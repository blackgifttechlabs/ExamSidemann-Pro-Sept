
import React, { useState } from 'react';
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle, Circle, Book } from 'lucide-react';
import { ToolsDock, SavedResource } from '../../../components/layout/ToolsDock';

interface Props {
  title: string;
  code?: string;
  outcomeCount: number;
  onBack: () => void;
  onSaveResource?: (resource: SavedResource) => void;
}

export const GenericPolyModule: React.FC<Props> = ({ title, code, outcomeCount, onBack, onSaveResource }) => {
  const [activeLO, setActiveLO] = useState(1);
  const [completedLOs, setCompletedLOs] = useState<number[]>([]);

  const toggleLOCompletion = (lo: number) => {
    if (completedLOs.includes(lo)) {
      setCompletedLOs(prev => prev.filter(i => i !== lo));
    } else {
      setCompletedLOs(prev => [...prev, lo]);
    }
  };

  const isCurrentLOCompleted = completedLOs.includes(activeLO);

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 pb-20 relative">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <button onClick={onBack} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-android-blue dark:hover:text-orange-500 transition-colors">
                 <ArrowLeft size={20} /> <span className="hidden sm:inline">Modules</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
              <h1 className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">{title}</h1>
              {code && <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-500">{code}</span>}
           </div>
           
           {onSaveResource && (
             <ToolsDock subject={title} topicTitle={`LO ${activeLO}`} onSave={onSaveResource} />
           )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Navigation */}
         <div className="lg:col-span-1 space-y-2">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Learning Outcomes</h3>
            {Array.from({ length: outcomeCount }, (_, i) => i + 1).map((num) => {
               const isCompleted = completedLOs.includes(num);
               return (
                 <button
                   key={num}
                   onClick={() => setActiveLO(num)}
                   className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-between group ${activeLO === num ? 'bg-android-blue text-white shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900'}`}
                 >
                    <span className="flex items-center gap-2">
                        {isCompleted && activeLO !== num && <CheckCircle size={14} className="text-green-500" />}
                        Learning Outcome {num}
                    </span>
                    {activeLO === num && <ChevronRight size={16} />}
                 </button>
               );
            })}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-10 border border-gray-100 dark:border-gray-800 shadow-xl min-h-[500px] flex flex-col">
               <div className="mb-6 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <BookOpen size={16} />
                  <span>Module Content</span>
                  <span>/</span>
                  <span className="text-android-blue dark:text-orange-500 font-bold">LO {activeLO}</span>
               </div>
               
               <div className="flex-1 space-y-6 animate-dropdown-reveal">
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Book className="text-blue-500" />
                      {title}: Outcome {activeLO}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      Content for Learning Outcome {activeLO} of {title} would go here. 
                      This is a placeholder for the specific curriculum content.
                    </p>
                    <div className="p-4 bg-white dark:bg-black rounded-xl border border-gray-100 dark:border-gray-800">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Key Concepts</h4>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>Understanding the core principles of Outcome {activeLO}.</li>
                            <li>Practical applications in the context of {title}.</li>
                            <li>Review and assessment criteria.</li>
                        </ul>
                    </div>
                  </div>
               </div>

               {/* Mark as Completed Section */}
               <div className="mt-10 mb-6 flex justify-center">
                  <button 
                    onClick={() => toggleLOCompletion(activeLO)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all shadow-sm transform active:scale-95 ${isCurrentLOCompleted ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-2 border-green-500' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-transparent'}`}
                  >
                     {isCurrentLOCompleted ? <CheckCircle size={20} /> : <Circle size={20} />}
                     {isCurrentLOCompleted ? 'Completed' : 'Mark as Completed'}
                  </button>
               </div>

               <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex justify-between">
                  <button 
                    onClick={() => setActiveLO(Math.max(1, activeLO - 1))}
                    disabled={activeLO === 1}
                    className="px-6 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                     Previous
                  </button>
                  <button 
                    onClick={() => setActiveLO(Math.min(outcomeCount, activeLO + 1))}
                    disabled={activeLO === outcomeCount}
                    className="px-6 py-2 rounded-lg bg-android-blue hover:bg-blue-600 text-white disabled:opacity-50 disabled:bg-gray-400"
                  >
                     Next Outcome
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
