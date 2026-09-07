import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, Circle, List, ChevronRight, Flag, Globe, Leaf, Users, Scale, Shield, Search, Minus, Plus, Sparkles, Map, Gavel, History, Sun, Moon, Database, LayoutDashboard, X } from 'lucide-react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { AdSense } from '../../../../analytics/AdSense';
import { LearningOutcome1 } from './LearningOutcome1';
import { LearningOutcome2 } from './LearningOutcome2';
import { LearningOutcome3 } from './LearningOutcome3';
import { LearningOutcome4 } from './LearningOutcome4';
import { LearningOutcome5 } from './LearningOutcome5';
import { LearningOutcome6 } from './LearningOutcome6';

interface Props {
  onBack: () => void;
  initialOutcome?: number;
  onOutcomeChange?: (outcome: number) => void;
}

export const NationalStudies: React.FC<Props> = ({
  onBack,
  initialOutcome = 1,
  onOutcomeChange,
}) => {
  const { userProfile, markTopicCompleted } = useAuth();
  const [activeLO, setActiveLO] = useState(initialOutcome);
  const [textSize, setTextSize] = useState(2); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () =>
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const level = "NC Information Technology";
  const subject = "National & Strategic Studies";

  const contentId = `${level}_${subject}_LO${activeLO}`.replace(/\s+/g, '_');
  const isCompleted = userProfile?.completedTopics?.[contentId] || false;
  const selectOutcome = (outcome: number) => {
    setActiveLO(outcome);
    onOutcomeChange?.(outcome);
  };

  const renderUnitContent = () => {
    switch(activeLO) {
        case 1: return <LearningOutcome1 />;
        case 2: return <LearningOutcome2 />;
        case 3: return <LearningOutcome3 />;
        case 4: return <LearningOutcome4 />;
        case 5: return <LearningOutcome5 />;
        case 6: return <LearningOutcome6 />;
        default: return (
            <div className="space-y-12">
                
      {/* New Polished Interactive Header */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <Map className="w-4 h-4" />
              NASS: National Studies
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Simply Easy <span className="text-emerald-300 font-bold italic">Learning</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Step-by-step tutorials tracking the syllabus. This outcome focuses on <span className="text-white font-bold underline decoration-emerald-400">Learning Outcome {activeLO}</span>.
            </p>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">
                    module.docs
                  </div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">National_Strategy;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">"Learning Outcome {activeLO}";</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">PRINT</span><span className="text-white">"Comprehensive Student Notebook";</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Shield className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Flag className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>
                <div className="p-10 text-center text-gray-500 font-bold uppercase tracking-widest">
                    Content for Learning Outcome {activeLO} is coming soon.
                </div>
            </div>
        );
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

  const outcomes = [
    { id: 1, title: 'Learning Outcome 1', icon: Flag },
    { id: 2, title: 'Learning Outcome 2', icon: History },
    { id: 3, title: 'Learning Outcome 3', icon: Map },
    { id: 4, title: 'Learning Outcome 4', icon: Shield },
    { id: 5, title: 'Learning Outcome 5', icon: Users },
    { id: 6, title: 'Learning Outcome 6', icon: Search },
  ];

  return (
    <div className={`fixed inset-0 z-[150] flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#f4f4f5] text-gray-900"}`}>
      
      {/* Top Navbar */}
      <div className={`h-14 border-b flex items-center justify-between px-4 shrink-0 shadow-sm ${isDarkMode ? "bg-[#2d2d2d] border-[#404040]" : "bg-white border-gray-200"}`}>
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={onBack}
            className={`p-1.5 rounded-[5px] transition-colors ${isDarkMode ? "hover:bg-[#404040] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            
            <h1 className="truncate font-bold text-base tracking-tight sm:text-lg">
              National Studies
            </h1>
            <span
              className={`ml-2 hidden shrink-0 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest sm:inline-flex ${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}
            >
              NC Module
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className={`ml-3 flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-black text-white shadow-sm transition-colors lg:hidden ${isDarkMode ? "bg-indigo-600 hover:bg-indigo-700" : "bg-[#003153] hover:bg-[#003153]/90"}`}
          title="Open topics"
        >
          <LayoutDashboard size={18} />
          <span>Topics</span>
        </button>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden lg:flex-row flex-col relative w-full">
        {/* Sidebar */}
        <div className={`fixed lg:static inset-y-0 left-0 z-[110] flex flex-col w-[280px] shrink-0 h-full transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'} ${isDarkMode ? 'bg-[#1e1e1e] border-r border-[#404040]' : 'bg-white border-r border-gray-200'}`}>
          <div className={`h-14 lg:hidden border-b flex items-center justify-between px-4 shrink-0 ${isDarkMode ? 'border-[#404040]' : 'border-gray-200'}`}>
            <span className="font-semibold text-sm">Table of Contents</span>
            <button onClick={() => setIsSidebarOpen(false)} className={`p-1.5 rounded-[5px] ${isDarkMode ? "text-gray-400 hover:bg-[#404040]" : "text-gray-500 hover:bg-gray-100"}`}>
              <X className="w-5 h-5"/>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
             <div className="px-4 py-6 space-y-1">
                 <p className={`text-xs font-bold uppercase tracking-wider mb-4 px-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Learning Outcomes</p>
                 {outcomes.map((outcome) => {
                     const loId = `${level}_${subject}_LO${outcome.id}`.replace(/\s+/g, '_');
                     const isLOCompleted = userProfile?.completedTopics?.[loId] || false;
                     const Icon = outcome.icon;
                     
                     return (
                         <button
                             key={outcome.id}
                             onClick={() => selectOutcome(outcome.id)}
                             className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[5px] transition-all text-left mb-1 ${activeLO === outcome.id ? (isDarkMode ? 'bg-[#2d2d2d] text-indigo-400 shadow-sm border border-[#404040]' : 'bg-white text-indigo-700 shadow-sm border border-gray-200') : (isDarkMode ? 'text-gray-300 hover:bg-[#2d2d2d]/50 hover:text-white' : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900')}`}
                         >
                            <div className={`w-8 h-8 rounded-[5px] flex items-center justify-center shrink-0 transition-colors ${activeLO === outcome.id ? (isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600') : (isDarkMode ? 'bg-[#2d2d2d] text-gray-400' : 'bg-gray-100 text-gray-500')}`}>
                                <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <span className="text-sm font-medium block truncate">Outcome {outcome.id}</span>
                            </div>
                            {isLOCompleted && <CheckCircle size={14} className={`shrink-0 ${isDarkMode ? 'text-green-500' : 'text-green-600'}`}/>}
                         </button>
                     )
                 })}
             </div>
             
             <div key={`ads-${activeLO}`} className="px-4 mt-4 mb-10 w-full space-y-4">
               <AdSense adSlot="7822405452" />
               <AdSense adSlot="7822405452-2" />
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative h-full">
            {/* Scrollable Document Area */}
            <div id="lesson-scroll-area" className={`relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar ${isDarkMode ? "border-t border-[#404040] bg-[#121212]" : "border-t border-gray-200 bg-white"}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                <div className={`w-full pb-32 ${getTextSizeClass()}`}>
                   {renderUnitContent()}
                </div>
            </div>
            
            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black/50 z-[100] lg:hidden backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}
        </div>
      </div>
    </div>
  );
};
