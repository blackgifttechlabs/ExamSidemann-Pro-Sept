
import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ChevronRight, X, Library as LibraryIcon, ArrowRight, Loader2, Filter, Menu, Grid, Users } from 'lucide-react';
import { db } from '../../services/firebase';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';

interface AcademicLevel {
    name: string;
    category: string;
}

export const Library: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<AcademicLevel[]>([]);
  const [activeCourse, setActiveCourse] = useState('');
  const [subjects, setSubjects] = useState<string[]>(['All']);
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'academic_hierarchy'), (snap) => {
        if (snap.exists()) {
            const list = snap.data().list || [];
            setCourses(list);
            if (list.length > 0 && !activeCourse) setActiveCourse(list[0].name);
        }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
      if (!activeCourse) return;
      const unsubSub = onSnapshot(doc(db, 'course_subjects', activeCourse), (snap) => {
          if (snap.exists()) {
              const data = snap.data();
              const subNames = (data.subjects || []).map((s: any) => s.name);
              setSubjects(['All', ...subNames]);
          } else {
              setSubjects(['All']);
          }
      });
      return () => unsubSub();
  }, [activeCourse]);

  useEffect(() => {
      if (!activeCourse) return;
      setLoading(true);
      const q = query(collection(db, 'global_resources'), where('course', '==', activeCourse), where('type', '==', 'library'));
      const unsub = onSnapshot(q, (snap) => {
          setBooks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
          setLoading(false);
      });
      return () => unsub();
  }, [activeCourse]);

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="flex h-[calc(100vh_-_var(--app-header-h))] bg-[#f8f9fa] dark:bg-[#0a0a0a] font-sans overflow-hidden relative">
      
      {/* Sidebar / Drawer */}
      <div className={`fixed lg:static inset-y-0 left-0 z-[50] w-72 bg-white dark:bg-[#111] border-r border-gray-200 dark:border-[#222] transform transition-transform duration-300 ease-in-out h-full flex flex-col ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
         <div className="p-6 border-b border-gray-100 dark:border-[#222] flex justify-between items-center shrink-0">
            <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2"><LibraryIcon className="text-purple-600" /> Virtual Vault</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"><X size={20}/></button>
         </div>
         <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-4 mb-2">Academic Level</p>
            {courses.map(course => (
                <button key={course.name} onClick={() => { setActiveCourse(course.name); setSelectedSubject('All'); setIsSidebarOpen(false); }} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${activeCourse === course.name ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-[#1a1a1a]'}`}>
                    <span className="truncate">{course.name} <span className="text-[10px] font-normal opacity-50 ml-1">({course.category})</span></span>
                    {activeCourse === course.name && <ChevronRight size={14} />}
                </button>
            ))}
         </nav>
         
         <div className="p-4 border-t border-gray-100 dark:border-[#222] space-y-2 lg:hidden">
            <button onClick={() => onNavigate('courses-overview')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"><Grid size={18}/> Courses</button>
            <button onClick={() => onNavigate('communities')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"><Users size={18}/> Discussion</button>
         </div>
      </div>

      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
         <div className="bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-gray-200 dark:border-[#222] p-4 md:p-6 flex flex-col gap-4 md:gap-6 sticky top-0 z-20 shrink-0">
            <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">Curriculum Library</span>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white leading-tight truncate">{activeCourse}</h2>
                </div>
                <div className="relative w-full max-w-md hidden sm:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Search textbooks..." className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-[#161616] border border-gray-200 dark:border-[#333] rounded-2xl text-sm text-white focus:border-gray-400 dark:focus:border-gray-700 outline-none transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                </div>
            </div>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
                {subjects.map(sub => (
                    <button key={sub} onClick={() => setSelectedSubject(sub)} className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${selectedSubject === sub ? 'bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg' : 'bg-white dark:bg-[#1a1a1a] text-gray-500 border-gray-200 dark:border-gray-800 hover:bg-gray-50'}`}>{sub}</button>
                ))}
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar pb-24">
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1,2,3,4,5,6].map(n => <div key={n} className="h-[320px] rounded-[2.5rem] bg-white dark:bg-[#161616] animate-pulse border border-gray-100 dark:border-[#2a2a2a]"></div>)}
                </div>
            ) : filteredBooks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map(book => (
                        <div key={book.id} className="group bg-white dark:bg-[#161616] rounded-[2.5rem] p-6 border border-gray-200 dark:border-[#2a2a2a] hover:shadow-2xl hover:border-purple-500/50 transition-all flex flex-col h-[360px] shadow-sm">
                            <div className="flex-1 bg-gray-50 dark:bg-[#111] rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden group-hover:bg-purple-50 dark:group-hover:bg-purple-900/10 transition-colors">
                                <img src="https://i.ibb.co/XZXJ24qx/3d-pdf-file-icon-illustration-png.webp" alt="PDF" className="w-16 h-16 object-contain transform group-hover:scale-110 transition-transform duration-500" />
                                <span className="absolute top-4 right-4 bg-white/90 dark:bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black border border-black/5 dark:border-white/10 uppercase tracking-widest text-gray-500">{book.course}</span>
                            </div>
                            <div className="mb-6">
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1 line-clamp-1">{book.title}</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{book.subject} • {book.size || '1.0 MB'}</p>
                            </div>
                            <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50 dark:border-[#222]">
                                <button onClick={() => setSelectedBook(book)} className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-[#252525] text-gray-700 dark:text-gray-300 text-xs font-black uppercase tracking-widest transition-all">VIEW</button>
                                <button onClick={() => window.open(book.url, '_blank')} className="flex-1 py-3 rounded-xl bg-purple-600 text-white text-xs font-black shadow-lg shadow-purple-900/20 uppercase tracking-widest transition-all">DOWNLOAD</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-[#161616] rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                    <BookOpen size={64} className="mb-4 text-gray-300" />
                    <h3 className="text-xl font-bold">No Resources Found</h3>
                    <p className="text-sm text-gray-500">Check different subjects or academic levels.</p>
                </div>
            )}
         </div>

         {/* MOBILE MENU TOGGLE */}
         <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden fixed bottom-6 left-6 z-40 w-14 h-14 bg-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-purple-700 transition-all active:scale-95"
         >
            <Menu size={24} />
         </button>
      </div>

      <div className={`fixed inset-y-0 right-0 z-[60] w-full md:w-[80vw] lg:w-[70vw] bg-white dark:bg-[#0f0f0f] shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${selectedBook ? 'translate-y-0 md:translate-x-0' : 'translate-y-full md:translate-y-0 md:translate-x-full'}`}>
         {selectedBook && (
             <>
                <div className="h-16 border-b border-gray-200 dark:border-[#2a2a2a] px-6 flex items-center justify-between bg-white dark:bg-[#161616] shrink-0">
                    <div className="flex items-center gap-4 min-w-0">
                        <button onClick={() => setSelectedBook(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-[#333] rounded-full transition-colors"><ArrowRight size={20} className="text-gray-500 rotate-90 md:rotate-0" /></button>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base truncate">{selectedBook.title}</h3>
                    </div>
                    <button onClick={() => window.open(selectedBook.url, '_blank')} className="bg-purple-600 text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shrink-0">DOWNLOAD</button>
                </div>
                <div className="flex-1 bg-gray-50 dark:bg-black relative">
                    <iframe src={selectedBook.url.includes('drive.google') ? selectedBook.url.replace('/view', '/preview') : selectedBook.url} className="w-full h-full border-none" title="PDF Viewer"></iframe>
                </div>
             </>
         )}
      </div>
      {(selectedBook || (isSidebarOpen && window.innerWidth < 1024)) && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45]" onClick={() => { setSelectedBook(null); setIsSidebarOpen(false); }} />}
    </div>
  );
};
