import React, { useState, useEffect } from 'react';
import { 
    BookOpen, ArrowLeft, CheckCircle, Circle, 
    List, Minus, Plus, X, Sparkles, Layout, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { LearningOutcome1 } from './LearningOutcome1';
import { LearningOutcome2 } from './LearningOutcome2';
import { LearningOutcome3 } from './LearningOutcome3';
import { LearningOutcome4 } from './LearningOutcome4';
import { LearningOutcome5 } from './LearningOutcome5';

interface Props {
  onBack: () => void;
}

export const NCITModule1: React.FC<Props> = ({ onBack }) => {
  const { userProfile, markTopicCompleted } = useAuth();
  const [activeLO, setActiveLO] = useState(1);
  const [textSize, setTextSize] = useState(2); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const outcomeCount = 5;
  const level = "NC Information Technology";
  const subject = "Computer Systems Maintenance";

  const contentId = `${level}_${subject}_LO${activeLO}`.replace(/\s+/g, '_');
  const isCompleted = userProfile?.completedTopics?.[contentId] || false;

  const renderUnitContent = () => {
    switch(activeLO) {
        case 1: return <LearningOutcome1 />;
        case 2: return <LearningOutcome2 />;
        case 3: return <LearningOutcome3 />;
        case 4: return <LearningOutcome4 />;
        case 5: return <LearningOutcome5 />;
        default: return <LearningOutcome1 />;
    }
  };

  useEffect(() => {
    const scrollArea = document.getElementById('lesson-scroll-area');
    if (scrollArea) {
        scrollArea.scrollTo({ top: 0, behavior: 'instant' });
    }
    setIsSidebarOpen(false);
  }, [activeLO]);

  const handleToggleComplete = async () => {
      await markTopicCompleted(contentId, !isCompleted);
  };

  const getTextSizeClass = () => {
      switch(textSize) {
          case 1: return 'text-xs md:text-sm';
          case 2: return 'text-sm md:text-base';
          case 3: return 'text-base md:text-lg';
          case 4: return 'text-lg md:text-xl';
          case 5: return 'text-xl md:text-2xl';
          default: return 'text-sm md:text-base';
      }
  };

  return (
    <div className="flex h-[calc(100vh_-_var(--app-header-h))] w-full bg-white dark:bg-[#050505] text-gray-900 dark:text-gray-200 overflow-hidden font-sans relative">
      
      {/* Dynamic Sidebar (Mirrors Secondary School Style) */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-[110] flex flex-col w-[280px] bg-[#f8f9fb] dark:bg-[#0a0a0a] border-r-2 border-gray-200 dark:border-white/5 shrink-0 h-full overflow-hidden transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
          <div className="h-16 px-4 border-b-2 border-gray-200 dark:border-white/5 bg-white dark:bg-black/20 flex items-center gap-3 shrink-0">
              <button onClick={onBack} className="p-2 text-gray-400 hover:text-[#003153] transition-colors rounded-none border border-transparent hover:border-gray-200 dark:hover:border-white/10" title="Back to Catalog">
                  <ArrowLeft size={18} />
              </button>
              <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 bg-[#003153] flex items-center justify-center text-white shrink-0 shadow-lg">
                      <BookOpen size={16}/>
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-xs font-black text-gray-900 dark:text-white uppercase leading-none truncate tracking-tighter">IT Maintenance</h2>
                    <p className="text-[8px] font-black text-[#003153] dark:text-blue-400 uppercase tracking-widest mt-0.5">NC IT Level</p>
                  </div>
              </div>
          </div>
          <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1 bg-gray-50/50 dark:bg-transparent text-left">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] px-2 mb-3">Syllabus Outcomes</p>
              {Array.from({ length: outcomeCount }, (_, i) => i + 1).map(num => {
                  const loId = `${level}_${subject}_LO${num}`.replace(/\s+/g, '_');
                  const isLOCompleted = userProfile?.completedTopics?.[loId] || false;
                  
                  return (
                    <button 
                        key={num} 
                        onClick={() => setActiveLO(num)}
                        className={`w-full flex items-center gap-3 px-3 py-3.5 transition-all text-left group border-b border-gray-100 dark:border-white/5 ${activeLO === num ? 'bg-white dark:bg-[#111] text-[#003153] dark:text-blue-400 shadow-sm font-black ring-1 ring-inset ring-gray-100 dark:ring-white/5' : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 font-bold'}`}
                    >
                        <div className={`w-7 h-7 flex items-center justify-center text-[9px] font-black border-2 transition-all ${activeLO === num ? 'bg-[#003153] text-white border-[#003153]' : isLOCompleted ? 'bg-green-500/20 text-green-600 border-green-500/30' : 'bg-white dark:bg-black border-gray-200 dark:border-[#222]'}`}>{num}</div>
                        <span className="text-[10px] uppercase tracking-widest truncate">Learning Outcome {num}</span>
                        {isLOCompleted && activeLO !== num && <CheckCircle size={12} className="ml-auto text-green-500" />}
                    </button>
                  );
              })}
          </nav>
      </aside>

      <main className="flex-1 flex flex-col h-full bg-[#fcfcfc] dark:bg-[#050505] relative overflow-hidden">
          {/* Header Action Bar */}
          <div className="h-16 sticky top-0 bg-white/95 dark:bg-[#050505]/95 backdrop-blur-xl border-b-2 border-gray-100 dark:border-white/5 px-4 md:px-10 flex items-center justify-between z-40 shrink-0 gap-2">
               <div className="flex flex-1 items-center gap-2 overflow-x-auto hide-scrollbar scroll-smooth">
                    <button 
                        onClick={() => setIsSidebarOpen(true)} 
                        className="lg:hidden p-2 text-gray-500 dark:text-gray-300 hover:text-[#003153] dark:hover:text-white transition-all flex items-center gap-2 shrink-0 border border-gray-200 dark:border-white/10 px-3 py-1.5"
                    >
                        <List size={18} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Topics</span>
                    </button>

                    <div className="px-4 md:px-5 py-2 bg-[#003153] text-white text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap text-center shadow-lg">
                        Outcome {activeLO}
                    </div>
                    <button onClick={handleToggleComplete} className={`flex items-center justify-center gap-2 px-4 md:px-6 py-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 whitespace-nowrap ${isCompleted ? 'bg-green-600 text-white border-green-600 shadow-md' : 'bg-white dark:bg-white/5 text-gray-500 border-gray-200 dark:border-white/10 hover:border-[#003153]/50'}`}>
                        {isCompleted ? <CheckCircle size={14}/> : <Circle size={14}/>}
                        <span className="hidden sm:inline">{isCompleted ? 'Task Verified' : 'Mark Outcome Done'}</span>
                        <span className="sm:hidden">{isCompleted ? 'Done' : 'Finish'}</span>
                    </button>
                    <button onClick={() => {}} className="flex items-center justify-center gap-2 px-4 md:px-6 py-2 bg-gray-900 dark:bg-white text-white dark:text-black text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] shadow-xl whitespace-nowrap hover:scale-105 transition-transform"> <span>AI Assistant</span>
                    </button>
               </div>
               <div className="hidden sm:flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-none shrink-0 border-l border-gray-100 dark:border-white/5 ml-4 pl-4">
                    <button onClick={() => setTextSize(Math.max(1, textSize - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#003153] transition-colors"><Minus size={12}/></button>
                    <button onClick={() => setTextSize(Math.min(5, textSize + 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-[#003153] transition-colors"><Plus size={12}/></button>
               </div>
          </div>

          <div id="lesson-scroll-area" className="flex-1 overflow-y-auto custom-scrollbar">
              {/* Added px-[20px] here to ensure content starts precisely 20px near the sidebar */}
              <div className={`w-full py-6 md:py-12 pb-40 px-[20px] ${getTextSizeClass()}`}>
                  {renderUnitContent()}
              </div>
          </div>
      </main>

      {(isSidebarOpen) && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[105] animate-fade-in" onClick={() => { setIsSidebarOpen(false); }} />}
    </div>
  );
};
