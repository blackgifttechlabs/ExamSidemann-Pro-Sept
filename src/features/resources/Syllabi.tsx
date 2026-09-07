
import React, { useState, useEffect } from 'react';
import { Download, Eye, Search, Layers, BookOpen, ArrowLeft, Loader2 } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';

interface AcademicLevel {
    name: string;
    category: string;
}

export const Syllabi: React.FC<{ initialSearch?: string }> = ({ initialSearch }) => {
  const [courses, setCourses] = useState<AcademicLevel[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [subjects, setSubjects] = useState<string[]>(['All']);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState(initialSearch || '');
  const [syllabi, setSyllabi] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingSyllabus, setViewingSyllabus] = useState<any | null>(null);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isPdfReady, setIsPdfReady] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'academic_hierarchy'), (snap) => {
        if (snap.exists()) setCourses(snap.data().list || []);
    });
    return () => unsub();
  }, []);

  const categories = ['All', 'ZJC', "O' Level", "A' Level", 'Polytechnic'];
  
  const getLevelsForCategory = (cat: string) => {
      if (cat === 'All') return [];
      return courses.filter(c => c.category === cat).map(c => c.name);
  };

  useEffect(() => {
      setLoading(true);
      const q = query(collection(db, 'global_resources'), where('type', '==', 'syllabi'));
      const unsubscribe = onSnapshot(q, (snap) => {
          setSyllabi(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
      }, (err) => {
          console.error("Firestore Listen Error:", err);
          setLoading(false);
      });
      return () => unsubscribe();
  }, []);

  useEffect(() => {
      setActiveLevel('All');
      setSubjects(['All']);
      setSelectedSubject('All');
  }, [activeCategory]);

  useEffect(() => {
      if (activeLevel === 'All') {
          setSubjects(['All']);
          setSelectedSubject('All');
          return;
      }
      
      const unsubSub = onSnapshot(doc(db, 'course_subjects', activeLevel), (snap) => {
          if (snap.exists()) {
              const data = snap.data();
              const subNames = (data.subjects || []).map((s: any) => s.name);
              setSubjects(['All', ...subNames]);
          } else {
              setSubjects(['All']);
          }
      });
      return () => unsubSub();
  }, [activeLevel]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (viewingSyllabus) {
      setLoadProgress(0);
      setIsPdfReady(false);
      interval = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsPdfReady(true);
            return 100;
          }
          const increment = Math.floor(Math.random() * 15) + 5;
          return Math.min(prev + increment, 100);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [viewingSyllabus]);

  const filteredSyllabi = syllabi.filter(item => {
    const levelsForCat = getLevelsForCategory(activeCategory);
    const matchesCategory = activeCategory === 'All' || levelsForCat.includes(item.course);
    const matchesLevel = activeLevel === 'All' || item.course === activeLevel;
    const matchesSubject = selectedSubject === 'All' || item.subject === selectedSubject;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#050505] text-gray-900 dark:text-white font-sans pb-20 overflow-hidden relative text-left transition-colors duration-500">
      <div className="bg-white dark:bg-[#0d0d0d] pt-24 pb-16 px-6 relative overflow-hidden border-b border-gray-100 dark:border-white/5">
         <div className="absolute inset-0 bg-blue-50/30 dark:bg-blue-900/5"></div>
         <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#3b82f6 0.5px, transparent 0.5px)', backgroundSize: '24px 24px', opacity: 0.1 }}></div>
         <div className="max-w-6xl mx-auto relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-gray-900 dark:text-white">Academic <span className="text-blue-600 dark:text-blue-400">Syllabi</span></h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-medium">Access standardized curriculum data and exam specifications.</p>
         </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-8 relative z-20">
         <div className="bg-white dark:bg-[#111] rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-white/10 flex flex-col gap-6 mb-10">
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
                <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-1 hide-scrollbar">
                    {categories.map(cat => (
                        <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)} 
                            className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border shrink-0 ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full lg:w-96">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search database..." 
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl text-sm font-medium outline-none text-gray-900 dark:text-white focus:border-blue-500 focus:bg-white dark:focus:bg-[#1a1a1a] transition-all placeholder:text-gray-400" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                </div>
            </div>

            {(activeCategory !== 'All' || activeLevel !== 'All') && (
                <div className="flex flex-col gap-4 animate-dropdown-reveal pt-4 border-t border-gray-50 dark:border-white/5">
                    {activeCategory !== 'All' && (
                        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                            <button onClick={() => setActiveLevel('All')} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${activeLevel === 'All' ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-blue-400 hover:text-blue-600'}`}>All {activeCategory}</button>
                            {getLevelsForCategory(activeCategory).map(lvl => (
                                <button key={lvl} onClick={() => setActiveLevel(lvl)} className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${activeLevel === lvl ? 'bg-gray-900 dark:bg-white text-white dark:text-black border-gray-900 dark:border-white' : 'bg-white dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-blue-400 hover:text-blue-600'}`}>{lvl}</button>
                            ))}
                        </div>
                    )}
                </div>
            )}
         </div>

         {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[1,2,3,4,5,6].map(n => <div key={n} className="h-64 bg-white dark:bg-white/5 rounded-2xl animate-pulse border border-gray-100 dark:border-white/10 shadow-sm"></div>)}
             </div>
         ) : filteredSyllabi.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSyllabi.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-[#111] rounded-2xl p-6 border border-gray-100 dark:border-white/10 hover:border-blue-200 dark:hover:border-blue-800 transition-all group flex flex-col h-full shadow-sm hover:shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"><Layers size={24} /></div>
                            <span className="text-[10px] font-bold px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 rounded-full uppercase tracking-wider">{item.course}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight line-clamp-2">{item.title}</h3>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider mb-6">{item.subject}</p>
                        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-gray-50 dark:border-white/5 mt-auto">
                            <button onClick={() => setViewingSyllabus(item)} className="py-3 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-2"><Eye size={14} /> View</button>
                            <button onClick={() => window.open(item.url, '_blank')} className="py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all flex items-center justify-center gap-2"><Download size={14} /> PDF</button>
                        </div>
                    </div>
                ))}
             </div>
         ) : (
            <div className="py-32 text-center bg-white dark:bg-[#111] border border-gray-100 dark:border-white/10 rounded-2xl shadow-sm">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BookOpen size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Syllabus Found</h3>
                <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
            </div>
         )}
      </div>

      <div className={`fixed inset-y-0 right-0 z-[100] w-full md:w-[80vw] lg:w-[65vw] bg-white dark:bg-[#0d0d0d] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${viewingSyllabus ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
         {viewingSyllabus && (
             <>
                <div className="h-20 border-b border-gray-100 dark:border-white/5 px-6 flex items-center justify-between bg-white dark:bg-[#0d0d0d] shrink-0">
                    <div className="flex items-center gap-4 min-w-0">
                        <button onClick={() => { setViewingSyllabus(null); setIsPdfReady(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 rounded-lg transition-colors">
                            <ArrowLeft size={24} className="rotate-90 md:rotate-0" />
                        </button>
                        <div className="min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base truncate leading-none mb-1">{viewingSyllabus.title}</h3>
                            <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{viewingSyllabus.course}</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-gray-50 dark:bg-black relative overflow-hidden">
                    {!isPdfReady && (
                        <div className="absolute inset-0 z-10 bg-white dark:bg-[#0d0d0d] flex flex-col items-center justify-center text-center p-10 animate-fade-in">
                            <div className="w-full max-w-md space-y-8">
                                <div className="flex items-center justify-center">
                                    <div className="relative">
                                        <div className="w-24 h-24 border-4 border-gray-100 dark:border-white/5 border-t-blue-600 rounded-full animate-spin"></div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">{loadProgress}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">Loading Document...</h4>
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 transition-all duration-300 ease-out" style={{ width: `${loadProgress}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <iframe 
                      src={viewingSyllabus.url.replace('/view', '/preview')} 
                      className={`w-full h-full border-none transition-opacity duration-700 ${isPdfReady ? 'opacity-100' : 'opacity-0'}`} 
                      title="Syllabus Preview"
                    ></iframe>
                </div>
             </>
         )}
      </div>
      {viewingSyllabus && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[95] animate-fade-in" onClick={() => { setViewingSyllabus(null); setIsPdfReady(false); }} />}
    </div>
  );
};
