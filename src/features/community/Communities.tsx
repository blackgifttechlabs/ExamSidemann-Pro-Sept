
import React, { useState, useEffect, useRef } from 'react';
import { Search, Users, Filter, Plus, ArrowRight, Loader2, MessageSquare, CheckCircle, ArrowLeft, Globe, ShieldCheck, Sparkles, BookOpen } from 'lucide-react';
import { SUBJECTS } from '../../data/constants';
import { db } from '../../services/firebase';
import { collection, query, getDocs, where, doc, updateDoc, arrayUnion, orderBy, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { LoginRequiredView } from '../auth/LoginRequiredView';

const GRADES = ['Form 1', 'Form 2', 'Form 3', 'Form 4', 'Lower 6', 'Upper 6'];

interface Community {
  id: string;
  name: string;
  subject: string;
  grade: string;
  members: number;
  description: string;
  approved?: boolean;
}

interface CommunityMessage {
    id: string;
    text: string;
    senderId: string;
    senderName: string;
    timestamp: any;
    approved?: boolean;
}

interface CommunitiesProps {
    onNavigate?: (page: string) => void;
    onLoginRequest?: () => void;
    initialCommunityId?: string;
}

export const Communities: React.FC<CommunitiesProps> = ({ onNavigate, onLoginRequest, initialCommunityId }) => {
  const { user, userProfile, refreshProfile, loading: authLoading } = useAuth();
  const [activeCommunity, setActiveCommunity] = useState<Community | null>(null);
  const [selectedGrade, setSelectedGrade] = useState('Form 4');
  const [searchQuery, setSearchQuery] = useState('');
  const [joiningId, setJoiningId] = useState<string | null>(null);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [messages, setMessages] = useState<CommunityMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(collection(db, 'communities'), where('approved', '==', true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const loaded: Community[] = [];
        snapshot.forEach(doc => {
          const community = { id: doc.id, ...doc.data() } as Community;
          if (community.approved === true) loaded.push(community);
        });
        setCommunities(loaded);
        setLoadingList(false);
    }, () => {
        setCommunities([]);
        setLoadingList(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
      if (initialCommunityId && communities.length > 0) {
          const target = communities.find(c => c.id === initialCommunityId);
          if (target) setActiveCommunity(target);
      }
  }, [initialCommunityId, communities]);

  useEffect(() => {
      if (!activeCommunity) return;
      setLoadingMessages(true);
      const messagesRef = collection(db, 'communities', activeCommunity.id, 'messages');
      const q = query(
        messagesRef,
        where('approved', '==', true),
        orderBy('timestamp', 'asc'),
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
          const msgs: CommunityMessage[] = [];
          snapshot.forEach(doc => {
              const message = { id: doc.id, ...doc.data() } as CommunityMessage;
              if (message.approved === true) msgs.push(message);
          });
          setMessages(msgs);
          setLoadingMessages(false);
      }, () => {
          setMessages([]);
          setLoadingMessages(false);
      });
      return () => unsubscribe();
  }, [activeCommunity]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = async (community: Community) => {
    if (!user) { onLoginRequest?.(); return; }
    setJoiningId(community.id);
    try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, { joinedCommunities: arrayUnion(community.id) });
        const commRef = doc(db, 'communities', community.id);
        await updateDoc(commRef, { members: community.members + 1 });
        await refreshProfile();
        setActiveCommunity({ ...community, members: community.members + 1 });
    } catch (e) { console.error(e); } finally { setJoiningId(null); }
  };

  const filteredCommunities = communities.filter(c => 
      c.grade === selectedGrade && 
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user && !authLoading) return <LoginRequiredView onLoginRequest={onLoginRequest} featureName="Communities" />;

  if (activeCommunity) {
      return (
        <div className="h-[calc(100vh_-_var(--app-header-h))] bg-[#fdfdfd] dark:bg-[#0b141a] flex flex-col overflow-hidden relative animate-dropdown-reveal">
            <div className="bg-white dark:bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-[#2a3942] shrink-0 h-16 shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => setActiveCommunity(null)} className="text-gray-500 dark:text-[#aebac1] p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {activeCommunity.name[0]}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-[#e9edef] text-base leading-tight">{activeCommunity.name}</h3>
                        <p className="text-xs text-green-600 dark:text-green-500 font-bold flex items-center gap-1">
                            {activeCommunity.members} members
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 bg-gray-50 dark:bg-black/20">
                {loadingMessages ? (
                    <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600" /></div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((msg) => {
                            const isMe = msg.senderId === user?.uid;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] md:max-w-[60%] px-4 py-2 rounded-2xl shadow-sm ${isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white dark:bg-[#202c33] text-gray-900 dark:text-white rounded-tl-none border border-gray-200 dark:border-transparent'}`}>
                                        {!isMe && <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest block mb-1">{msg.senderName}</span>}
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <span className={`text-[10px] block text-right mt-1 opacity-60`}>
                                            {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="border-t border-gray-100 bg-white px-4 py-4 text-center dark:border-[#2a3942] dark:bg-[#202c33]">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                Community posting is temporarily paused while reporting and moderation controls are upgraded.
              </p>
            </div>
        </div>
      );
  }

  return (
    <div className="h-[calc(100vh_-_var(--app-header-h))] bg-[#f8f9fa] dark:bg-[#0a0a0a] flex flex-col overflow-hidden text-gray-900 dark:text-gray-200 animate-dropdown-reveal">
        <div className="p-6 md:p-8 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-[#333] shrink-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                        <Globe className="text-blue-500" /> Study Universe
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Connect with students in your grade across the country.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Find a specific subject group..." 
                        className="w-full bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-[#333] rounded-2xl pl-12 pr-4 py-3.5 text-sm outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
                {GRADES.map(grade => (
                    <button
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all border ${
                            selectedGrade === grade 
                            ? 'bg-purple-600 text-white border-transparent shadow-lg shadow-purple-900/20' 
                            : 'bg-white dark:bg-[#1a1a1a] text-gray-500 border-gray-200 dark:border-[#333] hover:bg-gray-50'
                        }`}
                    >
                        {grade}
                    </button>
                ))}
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 custom-scrollbar">
            {loadingList ? (
                <div className="col-span-full flex justify-center py-20"><Loader2 size={40} className="animate-spin text-purple-600" /></div>
            ) : filteredCommunities.length > 0 ? (
                filteredCommunities.map((comm) => {
                    const isJoined = userProfile?.joinedCommunities?.includes(comm.id);
                    return (
                        <div key={comm.id} className="bg-white dark:bg-[#161616] rounded-[2rem] border border-gray-200 dark:border-[#2a2a2a] p-6 hover:border-purple-500/50 hover:shadow-xl transition-all flex flex-col group relative overflow-hidden h-[340px] shadow-sm">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3.5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-100 dark:border-purple-800 text-purple-600 dark:text-purple-400">
                                    <MessageSquare size={28} />
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-[10px] font-black text-gray-400 bg-gray-50 dark:bg-[#222] px-2.5 py-1 rounded-full border border-gray-200 dark:border-[#333]">
                                        <Users size={12} /> {comm.members}
                                    </div>
                                    <span className="text-[9px] font-bold text-green-500 uppercase mt-1 block">Active Now</span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 transition-colors leading-tight line-clamp-2">{comm.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">{comm.description}</p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-gray-50 dark:border-[#222]">
                                {isJoined ? (
                                    <button onClick={() => setActiveCommunity(comm)} className="w-full py-3.5 bg-gray-900 dark:bg-white text-white dark:text-black rounded-2xl text-xs font-black hover:opacity-90 transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                                        ENTER CHAT <ArrowRight size={14} />
                                    </button>
                                ) : (
                                    <button onClick={() => handleJoin(comm)} disabled={joiningId === comm.id} className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20 disabled:opacity-50">
                                        {joiningId === comm.id ? <Loader2 size={16} className="animate-spin" /> : "JOIN COMMUNITY"}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="col-span-full text-center py-20 bg-white dark:bg-[#161616] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-[#333] shadow-sm">
                    <ShieldCheck size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-bold">No communities found in this category.</p>
                </div>
            )}
        </div>
    </div>
  );
};
