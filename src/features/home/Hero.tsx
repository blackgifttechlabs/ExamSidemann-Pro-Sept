import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, BookOpen, FileText, Layers, GraduationCap, 
  X, Layout, Users, Library, Sparkles, Video, Newspaper, Code, MessageCircle, Brain, Baby, School
} from 'lucide-react';
import { GLOBAL_SEARCH_DB } from '../../data/constants';
import { SearchResultRow } from '../resources/SearchResultRow';

interface HeroProps {
  onStartLearning: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartLearning, onNavigate }) => {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [placeholder, setPlaceholder] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Typewriter Effect
  const phrases = [
    "Search 'Mathematics Syllabus'...", 
    "Search '2023 Past Papers'...", 
    "Search 'Computer Science'...",
    "Search 'Form 4 Geography'..."
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (inputValue) return; 
    const currentPhrase = phrases[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (isTyping) {
      if (charIndex < currentPhrase.length) {
        timeout = setTimeout(() => {
          setPlaceholder(prev => prev + currentPhrase[charIndex]);
          setCharIndex(prev => prev + 1);
        }, 50);
      } else {
        timeout = setTimeout(() => setIsTyping(false), 2000); 
      }
    } else {
      if (charIndex > 0) {
        timeout = setTimeout(() => {
          setPlaceholder(prev => prev.slice(0, -1));
          setCharIndex(prev => prev - 1);
        }, 30);
      } else {
        setPhraseIndex(prev => (prev + 1) % phrases.length);
        setIsTyping(true);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIndex, isTyping, phraseIndex, inputValue]);

  // Search Logic
  useEffect(() => {
    if (!inputValue.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const query = inputValue.toLowerCase();
    const filtered = GLOBAL_SEARCH_DB.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query) ||
      item.type.toLowerCase().includes(query)
    );

    setResults(filtered.slice(0, 8));
    setShowDropdown(true);
  }, [inputValue]);

  const handleInputFocus = () => {
    if (inputValue) setShowDropdown(true);
    
    if (window.innerWidth < 768 && searchRef.current) {
      setTimeout(() => {
        searchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleResultClick = (result: any) => {
    onNavigate(result.route, result.params);
    setShowDropdown(false);
    setInputValue('');
  };

  const handleAiClick = () => {
    onNavigate('chat');
  };

  const QuickCards = [
    { label: 'Class Notes', icon: BookOpen, route: 'courses/overview', textClass: 'text-green-500', action: () => onNavigate('courses/overview') },
    { label: 'ECD', icon: Baby, route: 'ecd', textClass: 'text-amber-500', action: () => onNavigate('ecd') },
    { label: 'Practicals', icon: Code, route: 'practicals', textClass: 'text-sky-500', action: () => onNavigate('practicals') },
    { label: 'IQ Trainer', icon: Brain, route: 'iq-trainer', textClass: 'text-violet-400', action: () => onNavigate('iq-trainer') },
    { label: 'Past Papers', icon: FileText, route: 'past-papers', textClass: 'text-sky-500', action: () => onNavigate('past-papers') },
    { label: 'Book Library', icon: Library, route: 'library', textClass: 'text-red-500', action: () => onNavigate('library') },
    { label: 'Syllabus', icon: Layers, route: 'syllabi', textClass: 'text-[#1b365d] dark:text-blue-400', action: () => onNavigate('syllabi') },
    { label: 'Find Schools', icon: School, route: 'schools', textClass: 'text-cyan-500', action: () => onNavigate('schools') },
    { label: 'Video Tutorials', icon: Video, route: 'tutorials', textClass: 'text-cyan-500', action: () => onNavigate('tutorials') },
    { label: 'Extra Lessons', icon: GraduationCap, route: 'extra-lessons', textClass: 'text-blue-600 dark:text-blue-400', action: () => onNavigate('extra-lessons') },
    { label: 'Edu News', icon: Newspaper, route: 'news/all', textClass: 'text-[#1b365d] dark:text-blue-400', action: () => onNavigate('news/all') },
    { label: 'Find Buddies', icon: Users, route: 'communities', textClass: 'text-indigo-500', action: () => onNavigate('communities') },
    { label: 'Study with AI', icon: Sparkles, route: 'chat', textClass: 'text-yellow-500', action: handleAiClick },
    { label: 'Sidemann AI', icon: MessageCircle, route: 'whatsapp-chat', textClass: 'text-emerald-500 dark:text-emerald-400', action: () => window.open('https://wa.me/263713952798?text=hi', '_blank') },
    { label: 'Dashboard', icon: Layout, route: 'dashboard', textClass: 'text-pink-500', action: () => onNavigate('dashboard') },
  ];

  return (
    <section className={`relative w-full min-h-screen flex flex-col justify-start bg-[#050505] dark:bg-[#020202] transition-colors duration-200 ${showDropdown ? 'z-50' : 'z-20'}`}>
      <style>
        {`
          @keyframes floating {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .animate-float {
            animation: floating 4s ease-in-out infinite;
          }
          .card-cutout {
            mask-image: radial-gradient(circle at top center, transparent 28px, black 29px);
            -webkit-mask-image: radial-gradient(circle at top center, transparent 28px, black 29px);
          }
          @media (min-width: 640px) {
            .card-cutout {
              mask-image: radial-gradient(circle at top center, transparent 34px, black 35px);
              -webkit-mask-image: radial-gradient(circle at top center, transparent 34px, black 35px);
            }
          }
          @media (min-width: 768px) {
            .card-cutout {
              mask-image: radial-gradient(circle at top center, transparent 38px, black 39px);
              -webkit-mask-image: radial-gradient(circle at top center, transparent 38px, black 39px);
            }
          }
        `}
      </style>

      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://i.ibb.co/rfvwxmGn/es-heroo.jpg" 
          alt="Hero" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#0a0a0a]"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      </div>

      <div className="relative z-20 w-full pt-8 pb-10 flex flex-col items-center px-2 sm:px-4">
        <div className="text-center max-w-5xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 dark:text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mb-4 md:mb-6 backdrop-blur-md">
            <span>Smart Education Platform</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl md:text-8xl font-black tracking-tighter text-white leading-[1.1] md:leading-[0.9] mb-4 md:mb-6 drop-shadow-2xl uppercase">
            <span className="block whitespace-nowrap">ZIMSEC & HEXCO</span>
            <span className="block whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-[#ff7400] via-[#ff9b00] to-[#ffdd22]">
              LEARNING SPACE
            </span>
          </h1>
        </div>

        {/* Search */}
        <div ref={searchRef} className="w-full max-w-3xl relative z-[200] mb-10 text-left">
          <div className={`relative bg-white/95 dark:bg-[#1a1a1a] backdrop-blur-md rounded-[50px] border transition-all duration-200 shadow-2xl ${showDropdown ? 'border-gray-200 dark:border-[#333]' : 'border-gray-200 dark:border-[#333] hover:border-gray-400 dark:hover:border-[#555]'}`}>
            <div className="flex items-center px-4 h-14 md:h-16 gap-3">
              <Search className="text-gray-400 shrink-0" size={18} />
              <input 
                type="text" 
                className="flex-1 bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white text-base placeholder-gray-400 dark:placeholder-gray-500 h-full"
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onFocus={handleInputFocus}
              />
              <div className="flex items-center gap-2 shrink-0">
                {inputValue && (
                  <button onClick={() => setInputValue('')} className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-50 dark:bg-[#141414] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[200]">
              
              {results.length > 0 ? (
                <>
                  <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-white/10">
                    <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200">
                      Courses and subjects
                    </span>
                    <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {results.length} {results.length === 1 ? 'result' : 'results'}
                    </span>
                  </div>

                  <div className="grid max-h-[60vh] grid-cols-1 gap-2 overflow-y-auto p-2 sm:grid-cols-2">
                    {results.map((result) => (
                      <SearchResultRow
                        key={result.id}
                        title={result.title}
                        levelName={result.levelName}
                        levelCategory={result.levelCategory}
                        resultType={result.type}
                        onSelect={() => handleResultClick(result)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="px-5 py-8 text-center">
                  <Search className="mx-auto mb-2 text-slate-300 dark:text-slate-600" size={24} />
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    No results for “{inputValue}”
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try a subject or level name.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 lg:gap-x-6 lg:gap-y-10 w-full max-w-none px-3 sm:px-[20px] lg:px-[50px] mt-10 sm:mt-12 lg:mt-16 justify-items-center">
          {QuickCards.map((card, index) => (
            <button 
              key={index}
              onClick={card.action}
              className="relative flex flex-col items-center justify-start gap-2 sm:gap-3 w-full group transition-all duration-300 hover:z-20 p-1"
            >
              {/* Main Circle */}
              <div 
                style={{ animationDelay: `${index * 100}ms` }}
                className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-[104px] xl:h-[104px] rounded-full bg-white dark:bg-[#1a1a1a] shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4)] border-[3px] border-white/60 dark:border-[#2a2a2a]/60 group-hover:-translate-y-2 group-hover:scale-[1.05] transition-all duration-500 animate-float shrink-0 z-10"
              >
                {/* Inner Icon Container */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-[52px] lg:h-[52px] xl:w-16 xl:h-16 rounded-full bg-gray-50 dark:bg-[#252525] flex items-center justify-center shadow-inner transition-transform duration-500 group-hover:scale-[1.15]">
                  <card.icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8 ${card.textClass || 'text-gray-800 dark:text-gray-100'}`} />
                </div>
                
              </div>
              
              {/* Label Outside */}
              <div className="flex items-center justify-center min-h-[36px] transition-transform duration-500 group-hover:-translate-y-1">
                <span className="text-[10px] sm:text-[11px] lg:text-[12px] xl:text-[13px] font-bold text-white uppercase tracking-widest text-center leading-snug line-clamp-2 px-1 drop-shadow-[0_1.5px_3.5px_rgba(0,0,0,0.85)]">
                  {card.label}
                </span>
              </div>
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};
