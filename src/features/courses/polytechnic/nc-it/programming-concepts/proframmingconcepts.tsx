import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle, Circle, List, X, ChevronUp, Terminal, Hash, GitBranch, Box, FileText, Bug } from 'lucide-react';
import { ToolsDock, SavedResource } from '../../../../../components/layout/ToolsDock';
import { LearningOutcome1 } from './LearningOutcome1';
import { LearningOutcome2 } from './LearningOutcome2';
import { LearningOutcome3 } from './LearningOutcome3';
import { LearningOutcome4 } from './LearningOutcome4';
import { LearningOutcome5 } from './LearningOutcome5';
import { LearningOutcome6 } from './LearningOutcome6';
import { LearningOutcome7 } from './LearningOutcome7';

interface Props {
  onBack: () => void;
  onSaveResource?: (resource: SavedResource) => void;
}

export const ProgrammingConcepts: React.FC<Props> = ({ onBack, onSaveResource }) => {
  const [activeLO, setActiveLO] = useState(1);
  const [completedLOs, setCompletedLOs] = useState<number[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLOCompletion = (lo: number) => {
    if (completedLOs.includes(lo)) {
      setCompletedLOs(prev => prev.filter(i => i !== lo));
    } else {
      setCompletedLOs(prev => [...prev, lo]);
    }
  };

  const renderContent = () => {
    switch(activeLO) {
        case 1: return <LearningOutcome1 />;
        case 2: return <LearningOutcome2 />;
        case 3: return <LearningOutcome3 />;
        case 4: return <LearningOutcome4 />;
        case 5: return <LearningOutcome5 />;
        case 6: return <LearningOutcome6 />;
        case 7: return <LearningOutcome7 />;
        default: return <LearningOutcome1 />;
    }
  };

  const isCurrentLOCompleted = completedLOs.includes(activeLO);

  const handleNavClick = (num: number) => {
      setActiveLO(num);
      setIsMobileMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const outcomes = [
    { id: 1, title: 'System & User Requirements', icon: Terminal },
    { id: 2, title: 'Data Types & Variables', icon: Hash },
    { id: 3, title: 'Control Structures', icon: GitBranch },
    { id: 4, title: 'Arrays & Structures', icon: List },
    { id: 5, title: 'Functions', icon: Box },
    { id: 6, title: 'File Handling', icon: FileText },
    { id: 7, title: 'Testing & Debugging', icon: Bug },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 pb-20 relative" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="w-full px-6 py-3 flex items-center justify-between">
           <div className="flex min-w-0 items-center gap-3">
              <button onClick={onBack} className="p-2 text-gray-400 hover:text-android-blue dark:hover:text-orange-500 transition-colors rounded-none border border-transparent hover:border-gray-200 dark:hover:border-white/10" title="Back to Catalog">
                 <ArrowLeft size={20} /> <span className="hidden sm:inline font-bold text-xs uppercase tracking-widest">Modules</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
              <h1 className="truncate font-black text-gray-900 dark:text-white uppercase tracking-tighter">Programming Concepts</h1>
           </div>
           
           <div className="flex shrink-0 items-center gap-2">
             <button
               type="button"
               onClick={() => setIsMobileMenuOpen(true)}
               className="flex h-10 items-center gap-2 rounded-lg bg-[#003153] px-3 text-sm font-black text-white shadow-sm transition-colors hover:bg-blue-800 lg:hidden"
               title="Open topics"
             >
               <List size={18} />
               <span>Topics</span>
             </button>
             {onSaveResource && (
               <ToolsDock subject="Programming Concepts" topicTitle={`LO ${activeLO}`} onSave={onSaveResource} />
             )}
           </div>
        </div>
      </div>

      <div className="w-full px-[5px] lg:px-8 py-0 lg:py-8 lg:flex lg:gap-8">
         {/* Sticky Sidebar Navigation (Desktop) */}
         <div className="hidden lg:block lg:w-80 shrink-0 self-start sticky top-24">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 px-2">Table of Contents</h3>
            <div className="space-y-1">
                {outcomes.map((outcome) => {
                const isCompleted = completedLOs.includes(outcome.id);
                return (
                    <button
                    key={outcome.id}
                    onClick={() => handleNavClick(outcome.id)}
                    className={`w-full text-left px-4 py-3 rounded-none text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between group ${activeLO === outcome.id ? 'bg-[#003153] text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-900 hover:shadow-sm'}`}
                    >
                        <div className="flex items-center gap-3">
                            <outcome.icon size={18} className={activeLO === outcome.id ? 'text-white' : 'text-gray-400 group-hover:text-[#003153]'} />
                            <span>Outcome {outcome.id}</span>
                        </div>
                        {isCompleted && <CheckCircle size={14} className={activeLO === outcome.id ? "text-white" : "text-green-500"} />}
                    </button>
                );
                })}
            </div>
         </div>

         {/* Content Area */}
         <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-[#111] rounded-none p-4 sm:p-8 md:p-12 border border-gray-200 dark:border-white/5 shadow-xl min-h-[500px] flex flex-col">
               <div className="mb-8 pb-6 border-b border-gray-100 dark:border-white/5">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span className="uppercase tracking-[0.3em] font-black text-[9px] text-[#003153] dark:text-blue-400 underline underline-offset-4">Unit {activeLO}</span>
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{outcomes[activeLO-1].title}</h2>
               </div>
               
               <div className="flex-1">
                  {renderContent()}
               </div>

               <div className="mt-16 pt-8 border-t border-gray-100 dark:border-white/5 flex flex-col items-center gap-6">
                  <button 
                    onClick={() => toggleLOCompletion(activeLO)}
                    className={`flex items-center gap-2 px-8 py-3 rounded-none font-black text-[10px] uppercase tracking-widest transition-all shadow-sm transform active:scale-95 ${isCurrentLOCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent'}`}
                  >
                     {isCurrentLOCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
                     {isCurrentLOCompleted ? 'Progress Verified' : 'Mark Outcome Done'}
                  </button>

                  <div className="flex justify-between w-full">
                    <button 
                        onClick={() => setActiveLO(Math.max(1, activeLO - 1))}
                        disabled={activeLO === 1}
                        className="px-6 py-2 rounded-none border border-gray-200 dark:border-white/10 text-gray-500 font-black text-[9px] uppercase tracking-widest disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 transition-all"
                    >
                        <ArrowLeft size={16} /> Previous
                    </button>
                    <button 
                        onClick={() => setActiveLO(Math.min(7, activeLO + 1))}
                        disabled={activeLO === 7}
                        className="px-6 py-2 rounded-none bg-[#003153] hover:bg-blue-800 text-white font-black text-[9px] uppercase tracking-widest disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg"
                    >
                        Next Outcome <ChevronRight size={16} />
                    </button>
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* Mobile Drop-up Container */}
      {isMobileMenuOpen && (
        <>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] lg:hidden transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#111] z-[70] rounded-none p-6 shadow-2xl lg:hidden animate-slide-in-bottom max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white dark:bg-[#111] pb-2 border-b border-gray-100 dark:border-white/5">
                    <h3 className="font-black text-xl text-gray-900 dark:text-white uppercase tracking-tighter">Topics</h3>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 dark:bg-white/5 rounded-none text-gray-500">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-3 pb-8">
                    {outcomes.map((outcome) => {
                        const isCompleted = completedLOs.includes(outcome.id);
                        return (
                            <button
                                key={outcome.id}
                                onClick={() => handleNavClick(outcome.id)}
                                className={`w-full text-left px-5 py-4 rounded-none text-xs font-black uppercase tracking-widest transition-all flex items-center justify-between ${activeLO === outcome.id ? 'bg-[#003153] text-white shadow-lg' : 'bg-gray-50 dark:bg-black/40 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/5'}`}
                            >
                                <span className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-none flex items-center justify-center text-[10px] font-black ${activeLO === outcome.id ? 'bg-white/20' : 'bg-white dark:bg-black border border-gray-200 dark:border-white/5'}`}>
                                        {outcome.id}
                                    </div>
                                    {outcome.title}
                                </span>
                                {isCompleted ? <CheckCircle size={20} className={activeLO === outcome.id ? "text-white" : "text-green-500"} /> : (activeLO === outcome.id ? <ChevronUp size={20}/> : null)}
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
      )}
    </div>
  );
};
