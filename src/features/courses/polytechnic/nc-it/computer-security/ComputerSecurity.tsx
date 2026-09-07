import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, Menu, X, Plus, Minus, Search, Shield, Globe, Lock, Code, Cpu, Database, Network, Server, Wifi, LayoutDashboard, Monitor, Key } from 'lucide-react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { AdSense } from '../../../../analytics/AdSense';
import { LearningOutcome1 } from './LearningOutcome1';
import { LearningOutcome2 } from './LearningOutcome2';
import { LearningOutcome3 } from './LearningOutcome3';

interface Props {
  onBack: () => void;
  initialOutcome?: number;
  onOutcomeChange?: (outcome: number) => void;
}

export const ComputerSecurity: React.FC<Props> = ({
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
  const subject = "Computer Security";

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

  const outcomes = [
    { id: 1, title: 'Learning Outcome 1', icon: Shield },
    { id: 2, title: 'Learning Outcome 2', icon: Lock },
    { id: 3, title: 'Learning Outcome 3', icon: Key },
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
              Computer Security
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
