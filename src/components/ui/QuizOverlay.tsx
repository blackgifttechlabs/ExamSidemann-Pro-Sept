
import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock, CheckCircle, XCircle, Award, PlayCircle, ArrowRight, Loader2, Brain } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizResult {
    question: string;
    selected: string | null;
    correct: string;
    isCorrect: boolean;
}

interface QuizOverlayProps {
  title: string;
  content: string; 
  subject: string;
  onClose: () => void;
  onComplete: (score: number) => void;
}

export const QuizOverlay: React.FC<QuizOverlayProps> = ({ title, content, subject, onClose, onComplete }) => {
  const { user, saveQuizAttempt } = useAuth();
  
  const [quizState, setQuizState] = useState<'loading' | 'intro' | 'playing' | 'finished'>('loading');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [globalTime, setGlobalTime] = useState(300); // 5 mins total
  const [questionTime, setQuestionTime] = useState(15);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [history, setHistory] = useState<QuizResult[]>([]);

  // Parse and Shuffle Questions
  const questions = useMemo(() => {
    const parsed: Question[] = [];
    const qBlocks = content.split(/Question \d:?|^\d\./gm).filter(s => s.trim().length > 10);
    
    qBlocks.forEach(block => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);
        const questionText = lines[0];
        const answerLine = lines.find(l => l.toLowerCase().includes('answer') || l.toLowerCase().includes('correct'));
        const rawOptions = lines.filter(l => l.match(/^[a-dA-D][\)\.]/) || l.startsWith('-'));
        
        const cleanAnswer = answerLine ? answerLine.split(':')[1]?.trim() : (rawOptions[0] || "");
        
        if (questionText && rawOptions.length > 0) {
            // SHUFFLE OPTIONS
            const shuffledOptions = [...rawOptions].sort(() => Math.random() - 0.5);
            parsed.push({
                question: questionText,
                options: shuffledOptions,
                answer: cleanAnswer
            });
        }
    });

    if (parsed.length === 0) {
        parsed.push({
            question: "Sample Question: What is the main component of a computer?",
            options: ["A. Monitor", "B. Keyboard", "C. CPU", "D. Printer"].sort(() => Math.random() - 0.5),
            answer: "C. CPU"
        });
    }
    return parsed;
  }, [content]);

  useEffect(() => {
      if (questions.length > 0) setQuizState('intro');
  }, [questions]);

  // Timers Logic
  useEffect(() => {
    if (quizState === 'playing') {
        const globalTimer = setInterval(() => {
            setGlobalTime(t => {
                if (t <= 1) { finishQuiz(); return 0; }
                return t - 1;
            });
        }, 1000);

        return () => clearInterval(globalTimer);
    }
  }, [quizState]);

  useEffect(() => {
      if (quizState === 'playing' && !isAnswered) {
          const qTimer = setInterval(() => {
              setQuestionTime(t => {
                  if (t <= 1) { handleAnswer(null); return 15; }
                  return t - 1;
              });
          }, 1000);
          return () => clearInterval(qTimer);
      }
  }, [quizState, isAnswered]);

  const handleAnswer = (option: string | null) => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedOption(option);
    
    const currentQ = questions[currentIndex];
    const isCorrect = option !== null && currentQ.answer.toLowerCase().includes(option.toLowerCase());
    
    if (isCorrect) setScore(s => s + 10);

    const result: QuizResult = {
        question: currentQ.question,
        selected: option,
        correct: currentQ.answer,
        isCorrect: isCorrect
    };

    setHistory(prev => [...prev, result]);

    // AUTO ADVANCE
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(i => i + 1);
        setIsAnswered(false);
        setSelectedOption(null);
        setQuestionTime(15);
      } else {
        finishQuiz();
      }
    }, 1500);
  };

  const finishQuiz = async () => {
    setQuizState('finished');
    const correctCount = history.filter(h => h.isCorrect).length;
    const attempt = {
        title: title,
        subject: subject,
        date: new Date(),
        score: score,
        totalQuestions: questions.length,
        correctCount: correctCount,
        incorrectCount: questions.length - correctCount,
        results: history
    };
    await saveQuizAttempt(attempt);
    onComplete(score);
  };

  /* ===================== RENDER STATES ===================== */

  if (quizState === 'loading') {
      return (
          <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-white">
              <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
              <p className="font-bold">Constructing Assessment...</p>
          </div>
      );
  }

  if (quizState === 'intro') {
      return (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="bg-[#1a1a1a] border border-gray-800 rounded-[2.5rem] p-10 max-w-xl w-full text-center shadow-2xl animate-dropdown-reveal relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                  <Brain className="w-20 h-20 text-purple-500 mx-auto mb-6" />
                  <h2 className="text-3xl font-black text-white mb-2">{title}</h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                      This quiz contains <strong>{questions.length} questions</strong>. You have 15 seconds per question and 5 minutes total. Good luck!
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                      <div className="bg-[#252525] p-4 rounded-2xl border border-[#333]">
                          <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Time Limit</div>
                          <div className="text-lg font-bold text-white">5:00 Mins</div>
                      </div>
                      <div className="bg-[#252525] p-4 rounded-2xl border border-[#333]">
                          <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Points</div>
                          <div className="text-lg font-bold text-purple-400">{questions.length * 10} Max</div>
                      </div>
                  </div>
                  <button 
                    onClick={() => setQuizState('playing')}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-xl shadow-purple-900/20 transition-all flex items-center justify-center gap-2"
                  >
                      Start Assessment <PlayCircle size={20}/>
                  </button>
                  <button onClick={onClose} className="mt-4 text-gray-500 hover:text-white transition-colors text-sm font-medium">Maybe Later</button>
              </div>
          </div>
      );
  }

  if (quizState === 'finished') {
    return (
      <div className="fixed inset-0 z-[100] bg-black/98 overflow-y-auto custom-scrollbar p-4 md:p-10">
         <div className="max-w-4xl mx-auto space-y-8 animate-dropdown-reveal">
            <div className="bg-[#1a1a1a] rounded-[2.5rem] p-10 border border-gray-800 text-center relative overflow-hidden">
                <Award className="w-24 h-24 text-yellow-400 mx-auto mb-6 drop-shadow-glow" />
                <h2 className="text-4xl font-black text-white mb-2">Well Done!</h2>
                <p className="text-gray-400 mb-8">Your assessment results have been recorded.</p>
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4">{score} Pts</div>
                <div className="flex justify-center gap-4 mb-8">
                    <div className="px-4 py-2 bg-green-900/20 text-green-400 rounded-xl border border-green-500/30 text-sm font-bold">{history.filter(h=>h.isCorrect).length} Correct</div>
                    <div className="px-4 py-2 bg-red-900/20 text-red-400 rounded-xl border border-red-500/30 text-sm font-bold">{history.filter(h=>!h.isCorrect).length} Incorrect</div>
                </div>
                <button onClick={onClose} className="px-12 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition-colors shadow-xl">Return to Dashboard</button>
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white px-2">Detailed Breakdown</h3>
                {history.map((item, idx) => (
                    <div key={idx} className={`p-6 rounded-3xl border ${item.isCorrect ? 'bg-green-900/5 border-green-900/30' : 'bg-red-900/5 border-red-900/30'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="font-bold text-white max-w-[80%]">{idx + 1}. {item.question}</h4>
                            {item.isCorrect ? <CheckCircle className="text-green-500" /> : <XCircle className="text-[#ff7400]" />}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-3 bg-black/40 rounded-xl">
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Your Answer</p>
                                <p className={`text-sm font-bold ${item.isCorrect ? 'text-green-400' : 'text-red-400'}`}>{item.selected || 'No Answer'}</p>
                            </div>
                            {!item.isCorrect && (
                                <div className="p-3 bg-black/40 rounded-xl border border-green-900/20">
                                    <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Correct Answer</p>
                                    <p className="text-sm font-bold text-green-400">{item.correct}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col overflow-hidden font-sans">
       {/* Global Timer Bar */}
       <div className="h-1.5 w-full bg-gray-900 overflow-hidden">
           <div className="h-full bg-blue-600 transition-all duration-1000 ease-linear" style={{ width: `${(globalTime / 300) * 100}%` }}></div>
       </div>

       {/* Top Bar */}
       <div className="px-6 py-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24}/></button>
             <div>
                <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest">{title}</h3>
                <div className="text-lg font-black">{currentIndex + 1} of {questions.length}</div>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-gray-500 uppercase">Question Timer</span>
                <div className={`text-2xl font-black font-mono ${questionTime < 5 ? 'text-[#ff7400] animate-pulse' : 'text-white'}`}>
                    0:{questionTime < 10 ? `0${questionTime}` : questionTime}
                </div>
             </div>
             <div className="w-12 h-12 rounded-full border-4 border-gray-800 flex items-center justify-center font-black text-purple-400">
                {score}
             </div>
          </div>
       </div>

       {/* Main Content Area */}
       <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
          <div className="w-full h-1 bg-gray-900 rounded-full mb-10 overflow-hidden">
              <div className="h-full bg-purple-600 transition-all duration-1000" style={{ width: `${((currentIndex+1) / questions.length) * 100}%` }}></div>
          </div>

          <h1 className="text-2xl md:text-4xl font-bold text-white text-center leading-tight mb-12 min-h-[120px]">
             {currentQ.question}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
             {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isThisCorrect = currentQ.answer.toLowerCase().includes(option.toLowerCase());
                
                let stateClass = "bg-[#161616] border-gray-800 hover:bg-[#1c1c1c] text-gray-300";
                
                if (isAnswered) {
                   if (isThisCorrect) stateClass = "bg-green-600/20 border-green-500 text-green-100 ring-4 ring-green-500/20 shadow-lg shadow-green-900/10";
                   else if (isSelected) stateClass = "bg-red-600/20 border-red-500 text-red-100 ring-4 ring-red-500/20 shadow-lg shadow-red-900/10";
                   else stateClass = "bg-gray-900/30 border-gray-900 opacity-40";
                }

                return (
                   <button 
                     key={idx}
                     disabled={isAnswered}
                     onClick={() => handleAnswer(option)}
                     className={`w-full p-6 rounded-[2rem] border-2 text-left text-base md:text-lg font-bold transition-all duration-200 flex justify-between items-center group ${stateClass}`}
                   >
                      <span>{option}</span>
                      {isAnswered && isThisCorrect && <CheckCircle className="text-green-500" />}
                      {isAnswered && isSelected && !isThisCorrect && <XCircle className="text-[#ff7400]" />}
                   </button>
                );
             })}
          </div>
       </div>

       <div className="p-8 flex justify-center shrink-0">
           <button onClick={() => handleAnswer(null)} disabled={isAnswered} className="text-gray-600 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm">
               Skip this Question <ArrowRight size={16}/>
           </button>
       </div>
    </div>
  );
};
