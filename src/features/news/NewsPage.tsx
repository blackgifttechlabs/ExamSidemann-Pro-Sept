
import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Clock, User, Eye, Newspaper, Loader2, Sparkles, Filter, ArrowRight, Calendar } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  category: string;
  image: string;
  createdAt: any;
  author: string;
  views?: number;
}

export const NewsPage: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'views'>('latest');

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy(sortBy === 'latest' ? 'createdAt' : 'views', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsPost)));
      setLoading(false);
    });
    return () => unsub();
  }, [sortBy]);

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRelativeTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    const diff = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-gray-900 font-sans text-left pb-24 relative overflow-hidden">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px'
       }}></div>

      {/* Hero Section */}
      <div className="relative pt-20 pb-16 px-4 md:px-8 max-w-[1440px] mx-auto z-10">
        <button 
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium mb-8"
        >
            <ArrowLeft size={18} /> Back to Home
        </button>
        
        <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
                Education <span className="text-blue-600">News</span>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
                Stay ahead with the latest updates, insights, and announcements across the nation.
            </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-12 flex flex-col md:flex-row gap-4 items-center max-w-5xl mx-auto">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 rounded-xl text-sm font-medium outline-none text-gray-900 transition-all placeholder:text-gray-400"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
                <div className="relative">
                    <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <select 
                        className="w-full md:w-48 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-100 py-3 pl-10 pr-8 rounded-xl text-sm font-medium outline-none cursor-pointer appearance-none text-gray-700"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value as any)}
                    >
                        <option value="latest">Latest First</option>
                        <option value="views">Most Popular</option>
                    </select>
                </div>
            </div>
        </div>

        {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {[1,2,3,4,5,6,7,8].map(n => (
                    <div key={n} className="bg-white rounded-2xl h-[400px] animate-pulse border border-gray-100 shadow-sm"></div>
                 ))}
             </div>
        ) : filteredPosts.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-dropdown-reveal">
                {filteredPosts.map(post => (
                    <div 
                        key={post.id} 
                        className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col border border-gray-100 h-[480px]"
                    >
                        {/* Image Container */}
                        <div className="relative h-48 w-full overflow-hidden shrink-0">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            {/* Floating Icon */}
                            <div className="absolute -bottom-6 right-6 bg-white p-3 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-gray-100 z-10 group-hover:-translate-y-1 transition-transform duration-300">
                                <Newspaper className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                            </div>
                            {/* Category Badge */}
                            <div className="absolute top-4 left-4">
                                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-700 text-xs font-bold rounded-full shadow-sm border border-blue-100">
                                    {post.category}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 pt-10 flex flex-col flex-1 text-left">
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-400 mb-3">
                                <span className="flex items-center gap-1"><Calendar size={12} /> {formatRelativeTime(post.createdAt)}</span>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className="flex items-center gap-1"><User size={12} /> {post.author || 'Admin'}</span>
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                {post.title}
                            </h3>
                            
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                                {post.content.replace(/<[^>]*>/g, '').substring(0, 120)}...
                            </p>
                            
                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <Eye size={14} className="text-blue-400"/> {post.views || 0} views
                                </span>
                                <button
                                    onClick={() => onNavigate('news/article', { id: post.id })}
                                    className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-semibold text-xs transition-colors flex items-center gap-2"
                                >
                                    Read Article <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
        ) : (
             <div className="py-32 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Newspaper size={32} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-500">We couldn't find any news matching your search.</p>
                <button 
                    onClick={() => { setSearchQuery(''); }} 
                    className="mt-6 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors"
                >
                    Clear Search
                </button>
             </div>
        )}
      </div>
    </div>
  );
};
