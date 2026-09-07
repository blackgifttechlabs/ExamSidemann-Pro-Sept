
import React, { useState, useEffect } from 'react';
import { Search, FileText, BrainCircuit, Sparkles, ArrowLeft, Trash2, MessageSquare, Download, Clock, Filter, BookOpen, Loader2, Trophy, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../services/firebase';

interface SavedResourcesProps {
    onBack: () => void;
    onNavigate: (page: string, params?: any) => void;
}

export const SavedResources: React.FC<SavedResourcesProps> = ({ onBack, onNavigate }) => {
    const { user } = useAuth();
    const [resources, setResources] = useState<any[]>([]);
    const [quizHistory, setQuizHistory] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'All' | 'Quiz' | 'Summary' | 'Exam' | 'History'>('All');

    useEffect(() => {
        if (!user) return;
        
        // Listen to AI Resources
        const qRes = query(collection(db, 'users', user.uid, 'resources'), orderBy('createdAt', 'desc'));
        const unsubRes = onSnapshot(qRes, (snap) => {
            setResources(snap.docs.map(d => ({ id: d.id, ...d.data(), dataType: 'resource' })));
            if (filter !== 'History') setLoading(false);
        });

        // Listen to Quiz History
        const qHistory = query(collection(db, 'users', user.uid, 'quizHistory'), orderBy('date', 'desc'));
        const unsubHistory = onSnapshot(qHistory, (snap) => {
            setQuizHistory(snap.docs.map(d => ({ id: d.id, ...d.data(), dataType: 'history' })));
            setLoading(false);
        });

        return () => { unsubRes(); unsubHistory(); };
    }, [user, filter]);

    const handleDeleteResource = async (id: string) => {
        if (!user || !confirm("Delete this saved resource?")) return;
        await deleteDoc(doc(db, 'users', user.uid, 'resources', id));
    };

    const handleDeleteHistory = async (id: string) => {
        if (!user || !confirm("Delete this attempt from history?")) return;
        await deleteDoc(doc(db, 'users', user.uid, 'quizHistory', id));
    };

    const allItems = filter === 'History' ? quizHistory : resources;

    const filtered = allItems.filter(r => {
        const title = r.title || r.subject || '';
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'All' || filter === 'History' || r.type === filter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] pb-20 animate-dropdown-reveal">
            {/* Header */}
            <div className="bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-[#222] sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-4 mb-8">
                        <button onClick={onBack} className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors border border-gray-200 dark:border-[#333]">
                            <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">My Study Vault</h1>
                            <p className="text-sm text-gray-500">Your generated study materials and performance history.</p>
                        </div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-2xl pl-12 pr-4 py-3.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none transition-all shadow-sm"
                                placeholder="Search by title, subject or date..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                            {[
                                { id: 'All', label: 'All Resources' },
                                { id: 'Summary', label: 'Summaries' },
                                { id: 'Quiz', label: 'Practice Quizzes' },
                                { id: 'Exam', label: 'Exam Papers' },
                                { id: 'History', label: 'Quiz History' }
                            ].map(f => (
                                <button 
                                    key={f.id} 
                                    onClick={() => setFilter(f.id as any)}
                                    className={`px-5 py-2.5 rounded-xl text-xs font-black whitespace-nowrap border transition-all ${filter === f.id ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-transparent shadow-lg' : 'bg-white dark:bg-[#1a1a1a] text-gray-500 border-gray-200 dark:border-[#333] hover:bg-gray-50'}`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10">
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 size={48} className="animate-spin text-purple-600" /></div>
                ) : filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map(item => (
                            <div key={item.id} className="bg-white dark:bg-[#161616] p-6 rounded-[2.5rem] border border-gray-200 dark:border-[#222] hover:border-purple-500/50 hover:shadow-2xl transition-all flex flex-col h-full group shadow-sm">
                                
                                {item.dataType === 'resource' ? (
                                    /* AI RESOURCE CARD */
                                    <>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`p-3.5 rounded-2xl ${item.type === 'quiz' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600'}`}>
                                                {item.type === 'quiz' ? <BrainCircuit size={28} /> : <FileText size={28} />}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-[#222] px-2.5 py-1 rounded-full border border-gray-200 dark:border-[#333] uppercase">{item.subject}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 line-clamp-2 leading-tight group-hover:text-purple-600 transition-colors">{item.title}</h3>
                                        <div className="mt-auto pt-6 border-t border-gray-50 dark:border-[#222] flex items-center justify-between">
                                            <button 
                                                onClick={() => onNavigate('chat', { initialContent: item.content, subject: item.subject })}
                                                className="flex items-center gap-2 text-xs font-black text-purple-600 dark:text-purple-400 hover:underline"
                                            >
                                                <MessageSquare size={14}/> CONTINUE STUDY
                                            </button>
                                            <button onClick={() => handleDeleteResource(item.id)} className="p-2 text-gray-300 hover:text-[#ff7400] transition-colors">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    /* QUIZ HISTORY CARD */
                                    <>
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3.5 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600">
                                                <Trophy size={28} />
                                            </div>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded-full uppercase">Attempt</div>
                                                <div className="text-[9px] text-gray-500 mt-1 flex items-center justify-end gap-1"><Clock size={10}/> {new Date(item.date?.toDate?.() || Date.now()).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 line-clamp-1">{item.title}</h3>
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="flex-1 bg-gray-50 dark:bg-[#222] p-3 rounded-2xl text-center border border-gray-100 dark:border-[#333]">
                                                <div className="text-[10px] font-black text-gray-400 uppercase mb-1">Score</div>
                                                <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{item.score}</div>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-green-600"><CheckCircle size={14}/> {item.correctCount}</div>
                                                <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff7400]"><XCircle size={14}/> {item.incorrectCount}</div>
                                            </div>
                                        </div>
                                        <div className="mt-auto pt-6 border-t border-gray-50 dark:border-[#222] flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.subject}</span>
                                            <button onClick={() => handleDeleteHistory(item.id)} className="p-2 text-gray-300 hover:text-[#ff7400] transition-colors">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-white dark:bg-[#161616] rounded-[4rem] border-2 border-dashed border-gray-200 dark:border-[#222] shadow-sm">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-[#222] rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen size={40} className="text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nothing to show here</h3>
                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">Try a different filter or generate some study aids in your lessons.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
