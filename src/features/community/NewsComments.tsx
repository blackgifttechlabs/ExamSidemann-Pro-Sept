import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../services/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { User, Menu, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: any;
  isHidden: boolean;
  parentId: string | null;
  likedBy?: string[];
  dislikedBy?: string[];
}

type NewsCommentsProps = {
  postId: string;
  onLoginRequest?: () => void;
};

export const NewsComments: React.FC<NewsCommentsProps> = ({ postId, onLoginRequest }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'date' | 'likes' | 'relevance'>('date');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState('');
  const sortMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!postId) return;
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      where('isHidden', '==', false),
    );
    
    const unsub = onSnapshot(q, (snap) => {
      const fetchedComments = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      
      setComments(fetchedComments.filter(c => c.isHidden === false));
      setLoading(false);
    }, () => {
      setComments([]);
      setLoading(false);
    });

    return () => unsub();
  }, [postId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
        setShowSortMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    const text = parentId ? replyText : newComment;
    if (!text.trim()) return;
    if (!auth.currentUser) {
      onLoginRequest?.();
      return;
    }

    try {
      await addDoc(collection(db, 'comments'), {
        postId,
        userId: auth.currentUser.uid,
        userName: auth.currentUser.displayName || 'Exam Sidemann member',
        text: text.trim().slice(0, 2000),
        createdAt: serverTimestamp(),
        // New submissions stay out of the public page until an administrator
        // has reviewed them for spam, personal data, and prohibited content.
        isHidden: true,
        parentId,
        likedBy: [],
        dislikedBy: []
      });
      setSubmissionMessage('Thanks — your comment is awaiting moderation.');
      
      if (parentId) {
        setReplyText('');
        setReplyingTo(null);
        setExpandedReplies(prev => new Set(prev).add(parentId));
      } else {
        setNewComment('');
        setIsFocused(false);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLike = async (commentId: string, likedBy: string[] = [], dislikedBy: string[] = []) => {
    if (!auth.currentUser) return alert("Please log in to like comments.");
    const userId = auth.currentUser.uid;
    const commentRef = doc(db, 'comments', commentId);
    
    if (likedBy.includes(userId)) {
      await updateDoc(commentRef, { likedBy: arrayRemove(userId) });
    } else {
      await updateDoc(commentRef, { 
        likedBy: arrayUnion(userId),
        dislikedBy: arrayRemove(userId)
      });
    }
  };

  const handleDislike = async (commentId: string, likedBy: string[] = [], dislikedBy: string[] = []) => {
    if (!auth.currentUser) return alert("Please log in to dislike comments.");
    const userId = auth.currentUser.uid;
    const commentRef = doc(db, 'comments', commentId);
    
    if (dislikedBy.includes(userId)) {
      await updateDoc(commentRef, { dislikedBy: arrayRemove(userId) });
    } else {
      await updateDoc(commentRef, { 
        dislikedBy: arrayUnion(userId),
        likedBy: arrayRemove(userId)
      });
    }
  };

  const toggleReplies = (parentId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(parentId)) {
        next.delete(parentId);
      } else {
        next.add(parentId);
      }
      return next;
    });
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

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'date') {
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    } else if (sortBy === 'likes') {
      const likesA = a.likedBy?.length || 0;
      const likesB = b.likedBy?.length || 0;
      if (likesA !== likesB) return likesB - likesA;
      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    } else {
      const scoreA = (a.likedBy?.length || 0) * 10 + (a.createdAt?.toMillis ? a.createdAt.toMillis() / 1000000 : 0);
      const scoreB = (b.likedBy?.length || 0) * 10 + (b.createdAt?.toMillis ? b.createdAt.toMillis() / 1000000 : 0);
      return scoreB - scoreA + (Math.random() - 0.5) * 5;
    }
  });

  const topLevelComments = sortedComments.filter(c => !c.parentId);
  const getReplies = (parentId: string) => sortedComments.filter(c => c.parentId === parentId).sort((a, b) => {
    const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
    const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
    return timeA - timeB; // Oldest first for replies
  });

  const CommentThread: React.FC<{ comment: Comment, isReply?: boolean }> = ({ comment, isReply = false }) => {
    const replies = getReplies(comment.id);
    const hasReplies = replies.length > 0;
    const isExpanded = expandedReplies.has(comment.id);
    const isReplying = replyingTo === comment.id;
    const currentUserId = auth.currentUser?.uid;
    const threadRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (isExpanded && threadRef.current && !threadRef.current.contains(event.target as Node)) {
          setExpandedReplies(prev => {
            const next = new Set(prev);
            next.delete(comment.id);
            return next;
          });
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isExpanded, comment.id]);

    return (
      <div ref={threadRef} className={`flex gap-4 ${isReply ? 'mt-4' : ''}`}>
        <div className={`rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden ${isReply ? 'w-6 h-6' : 'w-10 h-10'}`}>
          <User size={isReply ? 14 : 20} className="text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-bold text-gray-900 dark:text-white ${isReply ? 'text-xs' : 'text-sm'}`}>
              {comment.userName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className={`text-gray-900 dark:text-gray-100 mb-2 ${isReply ? 'text-xs' : 'text-sm'}`}>
            {comment.text}
          </p>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleLike(comment.id, comment.likedBy, comment.dislikedBy)}
              className={`flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors ${comment.likedBy?.includes(currentUserId || '') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <ThumbsUp size={isReply ? 14 : 16} className={comment.likedBy?.includes(currentUserId || '') ? 'fill-current' : ''} />
              <span className="text-xs">{(comment.likedBy?.length || 0) > 0 ? comment.likedBy?.length : ''}</span>
            </button>
            <button 
              onClick={() => handleDislike(comment.id, comment.likedBy, comment.dislikedBy)}
              className={`flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition-colors ${comment.dislikedBy?.includes(currentUserId || '') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}
            >
              <ThumbsDown size={isReply ? 14 : 16} className={comment.dislikedBy?.includes(currentUserId || '') ? 'fill-current' : ''} />
            </button>
            <button 
              onClick={() => {
                if (!auth.currentUser) {
                  onLoginRequest?.();
                  return;
                }
                setReplyingTo(isReplying ? null : comment.id);
                setReplyText('');
              }}
              className="text-xs font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors"
            >
              Reply
            </button>
          </div>

          {/* Reply Input */}
          <AnimatePresence>
            {isReplying && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-4"
              >
                <form onSubmit={(e) => handleSubmit(e, comment.id)} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                    <User size={14} className="text-gray-500" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <input
                      type="text"
                      autoFocus
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Add a reply..."
                      maxLength={2000}
                      className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 pb-1 text-xs focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button 
                        type="button"
                        onClick={() => setReplyingTo(null)}
                        className="px-3 py-1.5 text-xs font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={!replyText.trim()}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors ${
                          replyText.trim() 
                            ? 'bg-blue-600 text-white hover:bg-blue-700' 
                            : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Replies Toggle */}
          {hasReplies && (
            <button 
              onClick={() => toggleReplies(comment.id)}
              className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-bold mt-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-full transition-colors"
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {/* Nested Replies */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                {replies.map(reply => (
                  <CommentThread key={reply.id} comment={reply} isReply={true} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6">
      <div className="flex items-center gap-8 mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {comments.length} Comments
        </h3>
        
        {/* iOS Style Sort Dropdown */}
        <div className="relative" ref={sortMenuRef}>
          <button 
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 px-3 py-2 rounded-xl transition-colors"
          >
            <Menu size={20} />
            Sort by
          </button>
          
          <AnimatePresence>
            {showSortMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-48 bg-white/80 dark:bg-[#1c1c1e]/80 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-50"
              >
                <div className="flex flex-col p-1">
                  {[
                    { id: 'likes', label: 'Top comments' },
                    { id: 'date', label: 'Newest first' },
                    { id: 'relevance', label: 'Relevance' }
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSortBy(option.id as any);
                        setShowSortMenu(false);
                      }}
                      className="flex items-center justify-between px-4 py-3 text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <span className={sortBy === option.id ? 'font-semibold' : 'font-normal'}>
                        {option.label}
                      </span>
                      {sortBy === option.id && <Check size={16} className="text-blue-600 dark:text-blue-400" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="mb-8 flex gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
          <User size={20} className="text-gray-500" />
        </div>
        <div className="flex-1 flex flex-col">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={() => {
              if (auth.currentUser) setIsFocused(true);
            }}
            onClick={() => {
              if (!auth.currentUser) onLoginRequest?.();
            }}
            readOnly={!auth.currentUser}
            placeholder={auth.currentUser ? 'Add a comment...' : 'Sign in to submit a moderated comment'}
            maxLength={2000}
            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 pb-1 text-sm focus:outline-none focus:border-gray-900 dark:focus:border-white transition-colors"
          />
          {isFocused && (
            <div className="flex justify-end gap-2 mt-2">
              <button 
                type="button"
                onClick={() => {
                  setIsFocused(false);
                  setNewComment('');
                }}
                className="px-4 py-2 text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={!newComment.trim()}
                className={`px-4 py-2 text-sm font-bold rounded-full transition-colors ${
                  newComment.trim() 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {submissionMessage && (
        <p role="status" className="-mt-5 mb-8 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          {submissionMessage}
        </p>
      )}

      <div className="space-y-6">
        {loading ? (
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></div>
                <div className="flex-1 space-y-2 mt-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : topLevelComments.length > 0 ? (
          topLevelComments.map(comment => <CommentThread key={comment.id} comment={comment} />)
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>
    </div>
  );
};
