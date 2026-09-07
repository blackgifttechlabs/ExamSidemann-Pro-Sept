import fs from 'fs';
import path from 'path';

function buildPage(courseTitle, courseCode, outcomesCode) {
    return `import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, CheckCircle, ChevronRight, Menu, X, Plus, Minus, Search, Shield, Globe, Lock, Code, Cpu, Database, Network, Server, Wifi, LayoutDashboard, Monitor, Key } from 'lucide-react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { AdSense } from '../../../../AdSense';
import { LearningOutcome1 } from './LearningOutcome1';
import { LearningOutcome2 } from './LearningOutcome2';
import { LearningOutcome3 } from './LearningOutcome3';
${outcomesCode.length >= 4 ? "import { LearningOutcome4 } from './LearningOutcome4';\n" : ""}${outcomesCode.length >= 5 ? "import { LearningOutcome5 } from './LearningOutcome5';\n" : ""}
interface Props {
  onBack: () => void;
}

export const ${courseCode}: React.FC<Props> = ({ onBack }) => {
  const { userProfile, markTopicCompleted } = useAuth();
  const [activeLO, setActiveLO] = useState(1);
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
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const level = "NC Information Technology";
  const subject = "${courseTitle}";

  const contentId = \`\${level}_\${subject}_LO\${activeLO}\`.replace(/\\s+/g, '_');
  const isCompleted = userProfile?.completedTopics?.[contentId] || false;

  const renderUnitContent = () => {
    switch(activeLO) {
        case 1: return <LearningOutcome1 />;
        case 2: return <LearningOutcome2 />;
        case 3: return <LearningOutcome3 />;
${outcomesCode.length >= 4 ? "        case 4: return <LearningOutcome4 />;\n" : ""}${outcomesCode.length >= 5 ? "        case 5: return <LearningOutcome5 />;\n" : ""}
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
${outcomesCode}
  ];

  return (
    <div className={\`fixed inset-0 z-[150] flex flex-col font-sans transition-colors duration-300 \${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#f4f4f5] text-gray-900"}\`}>
      
      {/* Top Navbar */}
      <div className={\`h-14 border-b flex items-center justify-between px-4 shrink-0 shadow-sm \${isDarkMode ? "bg-[#2d2d2d] border-[#404040]" : "bg-white border-gray-200"}\`}>
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className={\`p-1.5 rounded-[5px] transition-colors \${isDarkMode ? "hover:bg-[#404040] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}\`}
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className={\`p-1.5 rounded-[5px] \${isDarkMode ? "bg-indigo-900/50 text-indigo-400" : "bg-indigo-100 text-indigo-700"}\`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="font-semibold text-base sm:text-lg tracking-tight">
              ${courseTitle}
            </h1>
            <span
              className={\`ml-2 px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest rounded-full \${isDarkMode ? "bg-indigo-900/50 text-indigo-300" : "bg-indigo-100 text-indigo-700"}\`}
            >
              NC Registry
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={handleToggleComplete} className={\`relative hidden lg:flex z-10 items-center gap-2 px-4 py-1.5 rounded-[5px] font-semibold text-sm transition-all shadow-sm active:scale-[0.98] \${isCompleted ? (isDarkMode ? "bg-green-900/40 text-green-400 border border-green-800 hover:bg-green-900/60" : "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200") : (isDarkMode ? "bg-[#333] hover:bg-[#444] text-gray-200 border border-[#555]" : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300")}\`}>
                <CheckCircle size={16} />
                <span>{isCompleted ? 'Completed' : 'Mark as Done'}</span>
            </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0 overflow-hidden lg:flex-row flex-col relative w-full">
        {/* Sidebar */}
        <div className={\`fixed lg:static inset-y-0 left-0 z-[110] flex flex-col w-[280px] shrink-0 h-full transition-transform duration-300 lg:translate-x-0 \${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'} \${isDarkMode ? 'bg-[#1e1e1e] border-r border-[#404040]' : 'bg-white border-r border-gray-200'}\`}>
          <div className={\`h-14 lg:hidden border-b flex items-center justify-between px-4 shrink-0 \${isDarkMode ? 'border-[#404040]' : 'border-gray-200'}\`}>
            <span className="font-semibold text-sm">Table of Contents</span>
            <button onClick={() => setIsSidebarOpen(false)} className={\`p-1.5 rounded-[5px] \${isDarkMode ? "text-gray-400 hover:bg-[#404040]" : "text-gray-500 hover:bg-gray-100"}\`}>
              <X className="w-5 h-5"/>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
             <div className="px-4 py-6 space-y-1">
                 <p className={\`text-xs font-bold uppercase tracking-wider mb-4 px-2 \${isDarkMode ? "text-gray-500" : "text-gray-400"}\`}>Learning Outcomes</p>
                 {outcomes.map((outcome) => {
                     const loId = \`\${level}_\${subject}_LO\${outcome.id}\`.replace(/\\s+/g, '_');
                     const isLOCompleted = userProfile?.completedTopics?.[loId] || false;
                     const Icon = outcome.icon;
                     
                     return (
                         <button
                             key={outcome.id}
                             onClick={() => setActiveLO(outcome.id)}
                             className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded-[5px] transition-all text-left mb-1 \${activeLO === outcome.id ? (isDarkMode ? 'bg-[#2d2d2d] text-indigo-400 shadow-sm border border-[#404040]' : 'bg-white text-indigo-700 shadow-sm border border-gray-200') : (isDarkMode ? 'text-gray-300 hover:bg-[#2d2d2d]/50 hover:text-white' : 'text-gray-600 hover:bg-gray-100/50 hover:text-gray-900')}\`}
                         >
                            <div className={\`w-8 h-8 rounded-[5px] flex items-center justify-center shrink-0 transition-colors \${activeLO === outcome.id ? (isDarkMode ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-600') : (isDarkMode ? 'bg-[#2d2d2d] text-gray-400' : 'bg-gray-100 text-gray-500')}\`}>
                                <Icon size={16} />
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                                <span className="text-sm font-medium block truncate">Outcome {outcome.id}</span>
                            </div>
                            {isLOCompleted && <CheckCircle size={14} className={\`shrink-0 \${isDarkMode ? 'text-green-500' : 'text-green-600'}\`}/>}
                         </button>
                     )
                 })}
             </div>
             
             <div className="px-4 mt-4 mb-10 w-full space-y-4">
               <AdSense adSlot="7822405452" />
               <AdSense adSlot="7822405452-2" />
             </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 relative h-full">
            {/* Topbar for mobile inside content area */}
            <div className={\`lg:hidden h-14 border-b flex items-center justify-between px-4 shrink-0 sticky top-0 z-10 \${isDarkMode ? 'bg-[#1e1e1e]/90 border-[#404040] backdrop-blur-md' : 'bg-[#f4f4f5]/90 border-gray-200 backdrop-blur-md'}\`}>
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className={\`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-[5px] \${isDarkMode ? "hover:bg-[#2d2d2d] text-gray-300" : "hover:bg-gray-200 text-gray-700"}\`}
                >
                    <LayoutDashboard size={18} />
                    <span>Outcomes</span>
                </button>
                 <div className="flex items-center gap-2">
                   <button onClick={handleToggleComplete} className={\`flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[5px] transition-all \${isCompleted ? (isDarkMode ? 'bg-green-900/40 text-green-400 border border-green-800' : 'bg-green-100 text-green-700 border border-green-300') : (isDarkMode ? 'bg-[#333] text-gray-300 border border-[#555]' : 'bg-white text-gray-700 border border-gray-300')}\`}>
                       <CheckCircle size={14}/>
                       <span>{isCompleted ? 'Done' : 'Mark Done'}</span>
                   </button>
                </div>
            </div>

            {/* Scrollable Document Area */}
            <div id="lesson-scroll-area" className={\`flex-1 overflow-y-auto custom-scrollbar \${isDarkMode ? 'bg-[#121212]' : 'bg-white'}\`}>
                <div className="max-w-4xl mx-auto w-full transition-all duration-300 ease-in-out">
                    <div className={\`w-full px-4 sm:px-8 md:px-12 py-8 pb-32 \${getTextSizeClass()}\`}>
                      {renderUnitContent()}
                    </div>
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
`
}

fs.writeFileSync('src/features/courses/polytechnic/nc-it/computer-networking/ComputerNetworking.tsx', buildPage('Computer Networking', 'ComputerNetworking', `    { id: 1, title: 'Learning Outcome 1', icon: Network },
    { id: 2, title: 'Learning Outcome 2', icon: Server },
    { id: 3, title: 'Learning Outcome 3', icon: Wifi },
    { id: 4, title: 'Learning Outcome 4', icon: Globe },
    { id: 5, title: 'Learning Outcome 5', icon: Search },`));

fs.writeFileSync('src/features/courses/polytechnic/nc-it/computer-security/ComputerSecurity.tsx', buildPage('Computer Security', 'ComputerSecurity', `    { id: 1, title: 'Learning Outcome 1', icon: Shield },
    { id: 2, title: 'Learning Outcome 2', icon: Lock },
    { id: 3, title: 'Learning Outcome 3', icon: Key },`));
