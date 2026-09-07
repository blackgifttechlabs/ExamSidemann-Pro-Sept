import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, Rocket, Brain, Terminal, Database, Code, ShieldCheck, GraduationCap } from 'lucide-react';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.documentElement.classList.contains('dark'));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    setIsDarkMode(document.documentElement.classList.contains('dark'));

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
}

interface EnglishLayoutProps {
  title: string;
  subtitle: string;
  introText: string;
  children: React.ReactNode;
}

export const EnglishLayout: React.FC<EnglishLayoutProps> = ({ title, subtitle, introText, children }) => {
  const isDarkMode = useDarkMode();

  const containerClasses = isDarkMode
    ? 'w-full py-8 sm:py-12 md:py-16 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 dark:bg-[#1e1e1e] bg-white min-h-screen'
    : 'w-full py-8 sm:py-12 md:py-16 px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 dark:bg-[#1e1e1e] bg-white min-h-screen';

  return (
    <div className={containerClasses}>
      <header className={`relative w-full mb-12 rounded-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-indigo-950' : 'bg-indigo-900'}`}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-[5px] sm:px-6 md:px-8 py-10 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-900/20">
              <BookOpen className="w-4 h-4" />
              ENGLISH LANGUAGE
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              {title} <span className="text-emerald-300 font-bold italic">{subtitle}</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              {introText}
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-4">
              <div className="flex items-center gap-2 text-indigo-200">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold">Beginner Friendly</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-200">
                <Rocket className="w-5 h-5 text-blue-400" />
                <span className="font-semibold">Practical Examples</span>
              </div>
              <div className="flex items-center gap-2 text-indigo-200">
                <Brain className="w-5 h-5 text-purple-400" />
                <span className="font-semibold">Interactive Learning</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">
                    <Terminal className="w-3 h-3 text-blue-400" />
                    english_lesson.txt
                  </div>
                </div>
                
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4">
                    <span className="text-gray-600 select-none">1</span>
                    <span className="text-purple-400">LEARN</span>
                    <span className="text-blue-400 italic">"English"</span>
                    <span className="text-white">{' {'}</span>
                  </div>
                  <div className="flex gap-4 ml-6">
                    <span className="text-gray-600 select-none">2</span>
                    <span className="text-indigo-300">grammar</span>
                    <span className="text-white">:</span>
                    <span className="text-green-400">Perfect</span>
                    <span className="text-white">,</span>
                  </div>
                  <div className="flex gap-4 ml-6">
                    <span className="text-gray-600 select-none">3</span>
                    <span className="text-indigo-300">writing</span>
                    <span className="text-white">:</span>
                    <span className="text-yellow-400">"Mastered"</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-600 select-none">4</span>
                    <span className="text-white">{'}'}</span>
                  </div>
                  
                  <div className="flex gap-4 ml-6 mt-4">
                    <span className="text-gray-600 select-none">5</span>
                    <div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div>
                  </div>
                </div>

                <div className="bg-[#181825] px-4 py-2 flex justify-between items-center text-[10px] text-gray-500 font-mono border-t border-white/5">
                  <div className="flex gap-4">
                    <span>UTF-8</span>
                    <span>Line 4, Col 3</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span>ENG</span>
                  </div>
                </div>
              </div>

              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl animate-bounce duration-[3000ms]">
                <BookOpen className="w-8 h-8 text-blue-400" />
              </div>

              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]">
                <GraduationCap className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-16 w-full">
        {children}
      </div>
    </div>
  );
};

export const EnglishSectionHeader: React.FC<{ title: string }> = ({ title }) => {
  const isDarkMode = useDarkMode();
  return (
    <h2 className={isDarkMode
      ? 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 inline-block relative group text-white uppercase mt-12'
      : 'text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 inline-block relative group uppercase mt-12'
    }>
      {title}
    </h2>
  );
};

export const EnglishCard: React.FC<{ children: React.ReactNode, color: string }> = ({ children, color }) => {
  const isDarkMode = useDarkMode();
  const colorMap: Record<string, string> = {
    blue: '',
    green: '',
    purple: '',
    amber: '',
    red: '',
    indigo: '',
  };
  const borderColor = colorMap[color] || colorMap.blue;
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-[10px] md:p-6 mb-6 transform transition-all duration-300 hover:shadow-xl ${borderColor}`}>
      <div className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
        {children}
      </div>
    </div>
  );
};

export const EnglishRealLifeExample: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useDarkMode();
  return (
    <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'} mt-6`}>
      <p className={`font-bold text-indigo-600 dark:text-indigo-400 mb-2`}>REAL LIFE EXAMPLE:</p>
      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{children}</div>
    </div>
  );
};

export const EnglishExamTip: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDarkMode = useDarkMode();
  return (
    <div className={isDarkMode
      ? 'bg-yellow-900/30 p-4 rounded-lg my-5'
      : 'bg-yellow-50 p-4 rounded-lg my-5'
    }>
      <p className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>EXAM TIP:</p>
      <div className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{children}</div>
    </div>
  );
};
