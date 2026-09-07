import React, { useState, useEffect } from 'react';
import { 
    ArrowLeft, CheckCircle, X, Database, LayoutGrid, Layers, Code, 
    Search, LayoutDashboard 
} from 'lucide-react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { AdSense } from '../../../../analytics/AdSense';
import { LearningOutcome1 } from './LearningOutcome1';
import { LearningOutcome2 } from './LearningOutcome2';
import { LearningOutcome3 } from './LearningOutcome3';
import { LearningOutcome4 } from './LearningOutcome4';
import { LearningOutcome5 } from './LearningOutcome5';
import { LearningOutcome6 } from './LearningOutcome6';
import { LearningOutcome7 } from './LearningOutcome7';
import { SQLPractice } from './SQLPractice';

interface Props {
  onBack: () => void;
  initialOutcome?: number;
  onOutcomeChange?: (outcome: number) => void;
}

export const DatabaseConcepts: React.FC<Props> = ({
  onBack,
  initialOutcome = 1,
  onOutcomeChange,
}) => {
  const { userProfile, markTopicCompleted } = useAuth();
  const [activeLO, setActiveLO] = useState(initialOutcome);
  const [textSize, setTextSize] = useState(2); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [lessonSearchQuery, setLessonSearchQuery] = useState('');
  const [lessonSearchSuggestions, setLessonSearchSuggestions] = useState<
    { id: string; label: string; element: HTMLElement }[]
  >([]);
  const [isLessonSearchFocused, setIsLessonSearchFocused] = useState(false);
  const [isMobileLessonSearchOpen, setIsMobileLessonSearchOpen] = useState(false);

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
  const subject = "Database Concepts";

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
        case 7: return <LearningOutcome7 />;
        case 8: return <SQLPractice onBack={() => selectOutcome(1)} />;
        default: return <LearningOutcome1 />;
    }
  };

  useEffect(() => {
    const scrollArea = document.getElementById('lesson-scroll-area');
    if (scrollArea) {
        scrollArea.scrollTo({ top: 0, behavior: 'instant' });
    }
    setIsSidebarOpen(false);
    setIsMobileLessonSearchOpen(false);
    setLessonSearchQuery('');
    setLessonSearchSuggestions([]);
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
    { id: 1, title: 'Learning Outcome 1', icon: Database },
    { id: 2, title: 'Learning Outcome 2', icon: LayoutGrid },
    { id: 3, title: 'Learning Outcome 3', icon: Layers },
    { id: 4, title: 'Learning Outcome 4', icon: Code },
    { id: 5, title: 'Learning Outcome 5', icon: Search },
    { id: 6, title: 'Learning Outcome 6', icon: CheckCircle },
    { id: 7, title: 'Learning Outcome 7', icon: Layers },
    { id: 8, title: 'Practice SQL', icon: Code },
  ];

  const getLessonHeadingSuggestions = (query: string) => {
    const trimmedQuery = query.trim();
    const scrollArea = document.getElementById('lesson-scroll-area');
    if (!trimmedQuery || !scrollArea) return [];

    const headings = Array.from(scrollArea.querySelectorAll<HTMLElement>('h1, h2, h3, h4'));
    const normalizedQuery = trimmedQuery.toLowerCase();

    return headings
      .map((element, index) => ({
        id: element.id || `database-heading-${activeLO}-${index}`,
        label: element.textContent?.replace(/\s+/g, ' ').trim() || '',
        element,
      }))
      .filter((item) => item.label.toLowerCase().includes(normalizedQuery))
      .slice(0, 8);
  };

  const updateLessonSearch = (query: string) => {
    setLessonSearchQuery(query);
    setLessonSearchSuggestions(getLessonHeadingSuggestions(query));
  };

  const scrollToLessonHeading = (target: HTMLElement) => {
    const scrollArea = document.getElementById('lesson-scroll-area');
    if (!scrollArea) return;

    const scrollAreaRect = scrollArea.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const targetTop = targetRect.top - scrollAreaRect.top + scrollArea.scrollTop - 18;

    scrollArea.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });

    target.style.animation = 'none';
    void target.offsetWidth;
    target.style.animation = 'database-heading-pulse 0.7s ease-in-out 3';
    window.setTimeout(() => {
      target.style.animation = '';
    }, 2300);
    setIsLessonSearchFocused(false);
    setIsMobileLessonSearchOpen(false);
  };

  const selectLessonSuggestion = (suggestion: { label: string; element: HTMLElement }) => {
    setLessonSearchQuery(suggestion.label);
    setLessonSearchSuggestions([]);
    scrollToLessonHeading(suggestion.element);
  };

  const runLessonSearch = () => {
    const suggestions = getLessonHeadingSuggestions(lessonSearchQuery);
    setLessonSearchSuggestions(suggestions);
    if (suggestions[0]) {
      scrollToLessonHeading(suggestions[0].element);
    }
  };

  const clearLessonSearch = () => {
    setLessonSearchQuery('');
    setLessonSearchSuggestions([]);
    window.getSelection()?.removeAllRanges();
  };

  const renderLessonSearch = (variant: 'desktop' | 'mobile') => (
    <div
      id={variant === 'mobile' ? 'mobile-database-lesson-search' : undefined}
      className={`relative min-w-0 ${variant === 'desktop' ? 'hidden md:block w-[320px] lg:w-[420px]' : 'flex-1'}`}
    >
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      <input
        value={lessonSearchQuery}
        onChange={(e) => updateLessonSearch(e.target.value)}
        onFocus={() => {
          setIsLessonSearchFocused(true);
          setLessonSearchSuggestions(getLessonHeadingSuggestions(lessonSearchQuery));
        }}
        onBlur={() => window.setTimeout(() => setIsLessonSearchFocused(false), 150)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            runLessonSearch();
          }
        }}
        placeholder="Search this lesson..."
        className={`w-full h-9 pl-9 pr-9 rounded-md border text-xs font-semibold outline-none transition-colors ${
          isDarkMode
            ? 'bg-[#1e1e1e] border-[#404040] text-white placeholder:text-gray-500 focus:border-indigo-500'
            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-indigo-400'
        }`}
      />
      {lessonSearchQuery ? (
        <button
          onClick={clearLessonSearch}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-[#333]' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-200'}`}
          title="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      ) : null}
      {isLessonSearchFocused && lessonSearchQuery.trim() ? (
        <div className={`absolute left-0 right-0 top-[calc(100%+6px)] z-[200] overflow-hidden rounded-lg border shadow-2xl ${isDarkMode ? 'bg-[#252526] border-[#404040]' : 'bg-white border-gray-200'}`}>
          {lessonSearchSuggestions.length > 0 ? (
            lessonSearchSuggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectLessonSuggestion(suggestion);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  selectLessonSuggestion(suggestion);
                }}
                className={`block w-full px-4 py-3 text-left text-xs font-bold transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-[#333]' : 'text-gray-700 hover:bg-indigo-50'}`}
              >
                {suggestion.label}
              </button>
            ))
          ) : (
            <div className={`px-4 py-3 text-xs font-bold ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No headings found
            </div>
          )}
        </div>
      ) : null}
    </div>
  );

  return (
    <div className={`fixed inset-0 z-[150] flex flex-col font-sans transition-colors duration-300 ${isDarkMode ? "bg-[#1e1e1e] text-white" : "bg-[#f4f4f5] text-gray-900"}`}>
      <style>{`
        @keyframes database-heading-pulse {
          0%, 100% { background-color: transparent; box-shadow: none; }
          45% { background-color: rgba(250, 204, 21, 0.42); box-shadow: 0 0 0 6px rgba(250, 204, 21, 0.18); }
        }
        @media (max-width: 640px) {
          .database-concepts-shell .px-\\[30px\\] {
            padding-left: 0.875rem !important;
            padding-right: 0.875rem !important;
          }
        }
      `}</style>
      
      {/* Top Navbar */}
      <div className={`h-14 border-b flex items-center justify-between gap-2 px-3 sm:px-4 shrink-0 shadow-sm ${isDarkMode ? "bg-[#2d2d2d] border-[#404040]" : "bg-white border-gray-200"}`}>
        <div className={`flex min-w-0 items-center gap-3 ${isMobileLessonSearchOpen ? 'hidden sm:flex' : 'flex'}`}>
          <button
            onClick={onBack}
            className={`p-1.5 rounded-[5px] transition-colors ${isDarkMode ? "hover:bg-[#404040] text-gray-400 hover:text-white" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}`}
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="font-bold text-base sm:text-lg tracking-tight truncate">
              Database Concepts
            </h1>
          </div>
        </div>
        <div className="hidden min-w-0 items-center gap-3 md:flex">
          {renderLessonSearch('desktop')}
        </div>
        <div className="ml-auto flex min-w-0 items-center justify-end gap-2 md:hidden">
          {isMobileLessonSearchOpen ? (
            <div className="w-[calc(100vw-86px)] max-w-[330px]">
              {renderLessonSearch('mobile')}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsMobileLessonSearchOpen(true);
                window.setTimeout(() => {
                  document
                    .querySelector<HTMLInputElement>('#mobile-database-lesson-search input')
                    ?.focus();
                }, 0);
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                isDarkMode
                  ? 'border-[#404040] bg-[#252526] text-gray-200 hover:bg-[#333]'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
              title="Search lesson"
            >
              <Search className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={`flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-black shadow-sm transition-colors text-white ${
              isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#003153] hover:bg-[#003153]/90'
            }`}
            title="Open topics"
          >
            <LayoutDashboard size={18} />
            <span>Topics</span>
          </button>
        </div>
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
                      <span className="text-sm font-medium block truncate">{outcome.id === 8 ? 'Practice SQL' : `Outcome ${outcome.id}`}</span>
                    </div>
                    {isLOCompleted && <CheckCircle size={14} className={`shrink-0 ${isDarkMode ? 'text-green-500' : 'text-green-600'}`}/>}
                  </button>
                );
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
          <div id="lesson-scroll-area" className={`database-concepts-shell relative flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar ${isDarkMode ? "border-t border-[#404040] bg-[#121212]" : "border-t border-gray-200 bg-white"}`} style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className={`w-full pb-32 ${getTextSizeClass()}`}>
              {renderUnitContent()}
            </div>
          </div>

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
