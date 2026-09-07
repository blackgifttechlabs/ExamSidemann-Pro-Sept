
import React, { useState, useRef, useEffect } from 'react';
import { BrainCircuit, FileSpreadsheet, Sparkles, Save, X, Loader2, Check, ChevronDown, AlertTriangle } from 'lucide-react';
import { generateStudyMaterial } from '../../services/ai';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

export type GeneratedContentType = 'quiz' | 'exam' | 'summary';

export interface SavedResource {
  id: string;
  type: GeneratedContentType;
  title: string;
  date: string;
  subject: string;
  content: string;
  score?: number;
}

interface ToolsDockProps {
  subject: string;
  topicTitle: string;
  onSave: (resource: SavedResource) => void;
}

export const ToolsDock: React.FC<ToolsDockProps> = ({ subject, topicTitle, onSave }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<GeneratedContentType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dockRef.current && !dockRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tools = [
    { id: 'quiz', label: 'Create Quiz', icon: BrainCircuit, color: 'text-purple-500' },
    { id: 'exam', label: 'Exam Paper', icon: FileSpreadsheet, color: 'text-blue-500' },
    { id: 'summary', label: 'Summarize', icon: Sparkles, color: 'text-orange-500' },
  ];

  const handleToolClick = async (toolId: string) => {
    if (!user) {
      setError("Please login to use AI tools");
      return;
    }
    
    setActiveTool(toolId as GeneratedContentType);
    setGeneratedResult(null);
    setIsSaved(false);
    setError(null);
    setIsGenerating(true);

    try {
      const result = await generateStudyMaterial(toolId as GeneratedContentType, subject, topicTitle);
      setGeneratedResult(result);
    } catch (err) {
      setError("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!generatedResult || !activeTool || !user) return;
    
    try {
      const resourceData = {
        type: activeTool,
        title: `${topicTitle} ${activeTool === 'summary' ? 'Summary' : activeTool === 'quiz' ? 'Quiz' : 'Exam'}`,
        subject: subject,
        content: generatedResult,
        createdAt: serverTimestamp(),
        userId: user.uid
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'users', user.uid, 'resources'), resourceData);

      // Call parent onSave for immediate UI update (optimistic or synced)
      onSave({
        id: docRef.id,
        type: activeTool,
        title: resourceData.title,
        date: new Date().toLocaleDateString(),
        subject: subject,
        content: generatedResult
      });

      setIsSaved(true);
      setTimeout(() => {
          setGeneratedResult(null);
          setActiveTool(null);
          setIsOpen(false);
          setIsSaved(false);
      }, 1000);
    } catch (err) {
      console.error("Error saving resource:", err);
      setError("Failed to save");
    }
  };

  return (
    <div className="relative" ref={dockRef}>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all flex items-center gap-1 ${isOpen ? 'bg-android-blue/10 text-android-blue dark:text-orange-500' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-navy-800'}`}
        title="AI Tools"
      >
        <Sparkles size={18} />
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-white dark:bg-navy-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-navy-700 p-4 z-50 animate-dropdown-reveal origin-top-right">
           
           <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">AI Study Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={16}/></button>
           </div>

           {!user && (
             <div className="mb-4 p-3 bg-[#ff7400]/10 dark:bg-red-900/20 text-[#ff7400] dark:text-red-400 text-xs rounded-lg flex items-center gap-2">
               <AlertTriangle size={14} /> Please login to use AI features.
             </div>
           )}

           {/* Tools Horizontal Row */}
           <div className="grid grid-cols-3 gap-2 mb-4">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => handleToolClick(tool.id)}
                  disabled={!user}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border ${activeTool === tool.id ? 'bg-blue-50 dark:bg-navy-800 border-android-blue dark:border-orange-500' : 'bg-gray-50 dark:bg-navy-950 border-transparent hover:bg-gray-100 dark:hover:bg-navy-800'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                   <tool.icon size={20} className={`mb-1 ${tool.color}`} />
                   <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-300">{tool.label}</span>
                </button>
              ))}
           </div>

           {/* Content / Result Area */}
           <div className="bg-gray-50 dark:bg-navy-950 rounded-xl p-4 min-h-[200px] max-h-[300px] overflow-y-auto border border-gray-100 dark:border-navy-800 relative custom-scrollbar flex flex-col">
              
              {!activeTool && !error && (
                 <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
                    <Sparkles size={32} className="mb-2 opacity-50" />
                    <p className="text-xs">Select a tool above to generate content</p>
                 </div>
              )}

              {isGenerating && (
                 <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <Loader2 size={24} className="animate-spin text-android-blue dark:text-orange-500 mb-2" />
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300">Generating...</p>
                 </div>
              )}

              {error && (
                 <div className="flex-1 flex flex-col items-center justify-center text-center text-[#ff7400]">
                    <p className="text-xs">{error}</p>
                 </div>
              )}

              {!isGenerating && generatedResult && (
                 <div className="animate-dropdown-reveal">
                    <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line font-mono leading-relaxed mb-4">
                      {generatedResult}
                    </div>
                    <button 
                      onClick={handleSave}
                      disabled={isSaved}
                      className={`w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all ${isSaved ? 'bg-green-500 text-white' : 'bg-android-blue dark:bg-orange-600 text-white hover:bg-blue-600 dark:hover:bg-orange-700'}`}
                    >
                      {isSaved ? <><Check size={16} /> Saved</> : <><Save size={16} /> Save to Dashboard</>}
                    </button>
                 </div>
              )}
           </div>
        </div>
      )}
    </div>
  );
};
