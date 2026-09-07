import React, { useState, useEffect } from 'react';
import { db } from '../../services/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { Trash2, Eye, EyeOff, Edit2, Loader2, Check, X } from 'lucide-react';

interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  text: string;
  createdAt: any;
  isHidden: boolean;
}

export const CommentsManager: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const toggleVisibility = async (id: string, currentHidden: boolean) => {
    try {
      await updateDoc(doc(db, 'comments', id), {
        isHidden: !currentHidden
      });
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const deleteComment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await deleteDoc(doc(db, 'comments', id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const startEditing = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.text);
  };

  const saveEdit = async (id: string) => {
    try {
      await updateDoc(doc(db, 'comments', id), {
        text: editContent
      });
      setEditingId(null);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Comments</h2>
      </div>

      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Comment</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">{comment.userName}</div>
                    <div className="text-xs text-gray-500">{comment.userId}</div>
                  </td>
                  <td className="px-6 py-4 w-1/2">
                    {editingId === comment.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="flex-1 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded px-3 py-1 text-sm focus:outline-none focus:border-blue-500"
                        />
                        <button onClick={() => saveEdit(comment.id)} className="text-green-600 hover:text-green-700">
                          <Check size={16} />
                        </button>
                        <button onClick={() => setEditingId(null)} className="text-[#ff7400] hover:text-red-700">
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-700 dark:text-gray-300 line-clamp-2">
                        {comment.text}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      comment.isHidden 
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500'
                    }`}>
                      {comment.isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => toggleVisibility(comment.id, comment.isHidden)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title={comment.isHidden ? "Show comment" : "Hide comment"}
                      >
                        {comment.isHidden ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => startEditing(comment)}
                        className="text-gray-500 hover:text-blue-600 transition-colors"
                        title="Edit comment"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="text-gray-500 hover:text-[#ff7400] transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {comments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No comments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
