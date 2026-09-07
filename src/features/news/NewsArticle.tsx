
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Eye, Share2, Loader2, Megaphone, X, LogIn, Clock, ThumbsUp, Instagram, Twitter, MessageCircle } from 'lucide-react';
import { db, auth } from '../../services/firebase';
import { doc, getDoc, updateDoc, increment, collection, query, orderBy, limit, onSnapshot, arrayUnion, arrayRemove } from 'firebase/firestore';
import { NewsComments } from '../community/NewsComments';
import { sanitizeArticleHtml } from '../../utils/sanitizeHtml';

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

interface NewsArticleProps {
    onBack: () => void;
    onLoginRequest: () => void;
}

export const NewsArticle: React.FC<NewsArticleProps> = ({ onBack, onLoginRequest }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [sidebarPosts, setSidebarPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const sanitizedContent = useMemo(
    () => sanitizeArticleHtml(post?.content || ''),
    [post?.content],
  );

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'news', id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setPost({ id: snap.id, ...snap.data() } as NewsPost);
          await updateDoc(docRef, { views: increment(1) });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const q = query(collection(db, 'news'), orderBy('createdAt', 'desc'), limit(11));
    const unsub = onSnapshot(q, (snap) => {
      const allPosts = snap.docs.map(d => ({ id: d.id, ...d.data() } as NewsPost));
      setSidebarPosts(allPosts.filter(p => p.id !== id));
    });
    return () => unsub();
  }, [id]);

  const handleShareWhatsApp = () => {
    if (!post) return;
    const currentUrl = window.location.href;
    const text = `*${post.title}*\n\nCheck out this education update on Exam Sidemann:\n${currentUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleLikePost = async () => {
    if (!post) return;
    if (!auth.currentUser) {
      setShowAuthGate(true);
      return;
    }
    const userId = auth.currentUser.uid;
    const postRef = doc(db, 'news', post.id);
    
    if (post.likedBy?.includes(userId)) {
      await updateDoc(postRef, { likedBy: arrayRemove(userId) });
      setPost(prev => prev ? { ...prev, likedBy: prev.likedBy?.filter(id => id !== userId) } : null);
    } else {
      await updateDoc(postRef, { likedBy: arrayUnion(userId) });
      setPost(prev => prev ? { ...prev, likedBy: [...(prev.likedBy || []), userId] } : null);
    }
  };

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

  if (loading) return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f0f] flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
          <p className="text-xs font-bold uppercase text-gray-500 tracking-widest">Opening Article...</p>
      </div>
  );

  if (!post) return (
      <div className="min-h-screen bg-white dark:bg-[#0f0f0f] flex flex-col items-center justify-center p-10 text-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Post not found</h2>
          <button onClick={onBack} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-full text-sm">Return Home</button>
      </div>
  );

  const estimatedReadingTime = Math.max(1, Math.ceil((post.content || '').replace(/<[^>]*>/g, '').split(/\s+/).length / 220));

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#09090b] text-slate-900 dark:text-neutral-100 font-sans text-left relative pb-24 transition-colors">
      {showAuthGate && (
        <div className="fixed top-20 right-4 md:right-10 z-[100] w-[90%] max-w-sm bg-white dark:bg-[#18181b] border border-gray-200 dark:border-white/10 shadow-2xl p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><Megaphone size={20}/></div>
             <button onClick={() => setShowAuthGate(false)} className="text-gray-400 hover:text-[#1b365d] dark:hover:text-blue-400 transition-colors"><X size={20}/></button>
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight mb-2">Login Required</h4>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">You must be logged in to perform this action.</p>
          <button onClick={() => { setShowAuthGate(false); onLoginRequest(); }} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors">
            <LogIn size={16}/> Login Now
          </button>
        </div>
      )}

      {/* Styled News Header / Navbar */}
      <div className="sticky top-16 z-40 bg-[#faf9f6]/95 dark:bg-[#09090b]/95 backdrop-blur-md border-b border-slate-200/60 dark:border-white/5 px-4 md:px-8 py-4 flex items-center justify-between shadow-xs transition-colors">
          <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-slate-200/50 dark:hover:bg-white/5 rounded-full text-slate-600 dark:text-neutral-400 transition-colors"><ArrowLeft size={20} /></button>
              <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs font-black text-[#1b365d] dark:text-blue-400 uppercase tracking-widest">{post.category || 'General'}</span>
                  <span className="text-slate-300 dark:text-zinc-800">•</span>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{estimatedReadingTime} min read</span>
              </div>
          </div>
          <div className="flex items-center gap-3">
              <span className="text-xs font-serif font-black tracking-widest text-[#1b365d] dark:text-blue-400 mr-2 hidden sm:inline">EXAM SIDEMANN GAZETTE</span>
              <button onClick={handleShareWhatsApp} title="Share on WhatsApp" className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 rounded-full transition-all"><Share2 size={18}/></button>
          </div>
      </div>

      <div className="w-full px-4 md:px-8 max-w-6xl mx-auto mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Side: Premium Modern Editorial Article */}
            <article className="lg:col-span-8 flex flex-col min-w-0">
                
                {/* News Category & Meta */}
                 <div className="flex items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 text-[11px] font-black uppercase text-[#1b365d] bg-[#1b365d]/10 dark:text-blue-400 dark:bg-blue-400/10 tracking-widest rounded-md">
                    {post.category || 'General'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                     • Published {formatRelativeTime(post.createdAt)}
                  </span>
                </div>

                {/* Elegant Editorial Headline */}
                <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-[1.12] tracking-tight mb-6">
                    {post.title}
                </h1>

                {/* Newspaper Byline / Contributor Row */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-y border-slate-200/80 dark:border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-slate-200/50 dark:border-zinc-700">
                            <User className="w-5 h-5 text-slate-600 dark:text-neutral-400" />
                        </div>
                        <div className="flex flex-col text-left">
                            <h4 className="font-bold text-slate-900 dark:text-neutral-100 text-sm">
                                {post.author || 'Editorial Reporter'}
                            </h4>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                                Education Contributor
                            </p>
                        </div>
                        
                        {/* Editor Social Media Handles */}
                        <div className="ml-4 flex items-center gap-1.5 border-l border-slate-200/80 dark:border-white/5 pl-4">
                            <a href="https://www.instagram.com/chief_proto/" target="_blank" rel="noopener noreferrer" title="Instagram" className="w-7 h-7 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <Instagram size={14} />
                            </a>
                            <a href="https://x.com/blackgift__" target="_blank" rel="noopener noreferrer" title="Twitter" className="w-7 h-7 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <Twitter size={14} />
                            </a>
                            <a href="https://wa.me/+263782456936" target="_blank" rel="noopener noreferrer" title="WhatsApp Messenger" className="w-7 h-7 rounded-md hover:bg-slate-100 dark:hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                <MessageCircle size={14} />
                            </a>
                        </div>
                    </div>
                    
                    {/* View Count Badge */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Eye size={14} /> <strong>{post.views || 0}</strong> views</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> <strong>{estimatedReadingTime} min</strong> read</span>
                    </div>
                </div>

                {/* Hero Feature Photo */}
                <div className="w-full relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200/60 dark:border-white/5 mb-8 shadow-sm">
                    <img 
                        src={post.image || 'https://images.unsplash.com/photo-1504711432819-51f193efec1b?q=80&w=2070'} 
                        className="w-full max-h-[480px] object-cover" 
                        alt={post.title} 
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent pointer-events-none"></div>
                </div>

                {/* Editorial Body Segment with Premium Book Typography */}
                <div className="text-left font-serif text-[18px] md:text-[19px] leading-[1.8] text-slate-800 dark:text-neutral-200 space-y-6">
                    <div 
                        className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none font-serif text-slate-800 dark:text-neutral-200 focus:outline-none"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                </div>

                {/* Article React / Appreciation Panel (Quiet and Sophisticated) */}
                <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleLikePost}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border transition-all ${post.likedBy?.includes(auth.currentUser?.uid || '') ? 'text-blue-600 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-900/10 dark:border-blue-900/30 font-bold' : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50 dark:text-neutral-300 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800/60 font-medium'}`}
                        >
                            <ThumbsUp size={16} className={post.likedBy?.includes(auth.currentUser?.uid || '') ? 'fill-current' : ''} />
                            <span className="text-sm">{post.likedBy?.length || 0} Appreciations</span>
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-400 dark:text-zinc-500 mr-1">Share this:</span>
                        <button onClick={handleShareWhatsApp} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:hover:bg-emerald-900/30 dark:text-emerald-400 rounded-xl text-xs font-bold transition-all border border-emerald-200/40 dark:border-emerald-900/10">
                            <Share2 size={13} /> WhatsApp
                        </button>
                    </div>
                </div>

                {/* Dedicated Editorial Comments Segment */}
                <div className="mt-16 pt-8 border-t border-slate-200/80 dark:border-white/5">
                    <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white mb-6">Article Discussion</h3>
                    <NewsComments postId={post.id} onLoginRequest={onLoginRequest} />
                </div>
            </article>

            {/* Right Side: related publisher content only. Ads are deliberately
                kept out of this navigation rail to avoid accidental clicks and
                an ad-to-content imbalance on shorter articles. */}
            <aside className="lg:col-span-4 shrink-0 flex flex-col">
                <div>
                  <h3 className="text-xs font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span>RECOMMENDED</span>
                      <span className="flex-1 h-px bg-slate-200/80 dark:bg-zinc-800"></span>
                  </h3>
                  
                  {/* Recommended Articles List - MAXIMUM 3 item limit */}
                  {sidebarPosts.length > 0 ? (
                      <div className="flex flex-col gap-4">
                          {sidebarPosts.slice(0, 3).map((sidebarPost) => (
                              <div 
                                  key={sidebarPost.id}
                                  className="group cursor-pointer flex gap-3 pb-4 border-b border-slate-200/50 dark:border-white/5 hover:opacity-90 duration-200"
                                  onClick={() => navigate(`/news/article/${sidebarPost.id}`)}
                              >
                                  {/* Thumbnail Aspect Ratio without the 10:00 video overlay indicator */}
                                  <div className="w-[110px] h-[75px] shrink-0 relative overflow-hidden rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200/30 dark:border-white/5">
                                      <img 
                                          src={sidebarPost.image || 'https://images.unsplash.com/photo-1504711432819-51f193efec1b?q=80&w=2070'} 
                                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                          alt={sidebarPost.title} 
                                      />
                                  </div>
                                  
                                  {/* News Card Metadata details (No YouTube style comments/views rows) */}
                                  <div className="flex flex-col flex-1 min-w-0 justify-center">
                                      <span className="text-[9px] font-black uppercase text-[#1b365d] dark:text-blue-400 tracking-wider mb-0.5">{sidebarPost.category || 'General'}</span>
                                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#1b365d] dark:group-hover:text-blue-400 transition-colors">
                                          {sidebarPost.title}
                                      </h4>
                                      <div className="text-[10px] text-slate-400 mt-1">
                                          {formatRelativeTime(sidebarPost.createdAt)}
                                      </div>
                                  </div>
                              </div>
                          ))}
                          
                          <button 
                              onClick={() => navigate('/news')}
                              className="w-full text-center py-2.5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-neutral-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-zinc-800 transition-colors"
                          >
                              Browse News Archive
                          </button>
                      </div>
                  ) : (
                      <div className="text-center py-6 text-xs text-slate-400 font-bold uppercase tracking-widest bg-slate-50 dark:bg-zinc-900/30 rounded-xl">
                          No further articles available.
                      </div>
                  )}
                </div>

            </aside>
        </div>
      </div>
    </div>
  );
};
