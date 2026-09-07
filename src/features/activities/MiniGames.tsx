
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, HelpCircle, Trophy, RefreshCw, Brain, ChevronRight, ChevronLeft, SkipForward } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// --- Types ---
interface BaseGameProps {
  id: string; // Unique ID for score tracking
  points: number; // Total points for the activity
}

interface QuizProps extends BaseGameProps {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface MultiQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface MultiQuizProps extends BaseGameProps {
  questions: MultiQuestion[];
}

interface TrueFalseProps extends BaseGameProps {
  statement: string;
  isTrue: boolean;
}

// --- Multi-Question Quiz Component ---
export const MultiQuestionQuiz: React.FC<MultiQuizProps> = ({ id, points, questions }) => {
  const { updateQuizScore } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // Store selected answers
  const [isFinished, setIsFinished] = useState(false);
  const [isLocked, setIsLocked] = useState(false); // Lock input during feedback delay

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx) / questions.length) * 100;

  const handleOptionClick = (option: string) => {
    if (isLocked || answers[currentIdx]) return; // Prevent changing answer or spamming

    const isCorrect = option === currentQ.correctAnswer;
    
    setAnswers(prev => ({ ...prev, [currentIdx]: option }));
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setIsLocked(true);

    // Auto advance after 1.5 seconds
    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setIsLocked(false);
      } else {
        finishQuiz(isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  const handleSkip = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setIsLocked(false); // Unlock for next question
    } else {
      finishQuiz(score);
    }
  };

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      // We don't unlock here because the previous question is likely already answered
      setIsLocked(!!answers[currentIdx - 1]); 
    }
  };

  const finishQuiz = (finalScore: number) => {
    setIsFinished(true);
    // Calculate total points earned based on percentage
    const percentage = finalScore / questions.length;
    const pointsEarned = Math.round(percentage * points);
    updateQuizScore(id, pointsEarned);
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setAnswers({});
    setIsFinished(false);
    setIsLocked(false);
  };

  if (isFinished) {
    return (
      <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center animate-dropdown-reveal">
        <Trophy size={48} className="mx-auto text-yellow-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quiz Complete!</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">You scored {score} out of {questions.length}</p>
        
        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-4 mb-6 overflow-hidden">
           <div className="bg-green-500 h-full transition-all duration-1000" style={{ width: `${(score / questions.length) * 100}%` }}></div>
        </div>

        <button 
          onClick={resetQuiz}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw size={18} /> Retry Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <Brain className="text-indigo-500" size={24} />
           <h4 className="font-bold text-gray-900 dark:text-white">Knowledge Check</h4>
        </div>
        <span className="text-xs font-bold bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-3 py-1 rounded-full">
           {currentIdx + 1} / {questions.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6">
         <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
      </div>

      {/* Question */}
      <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-6 min-h-[60px]">
        {currentQ.question}
      </h5>

      {/* Options */}
      <div className="space-y-3 mb-8">
        {currentQ.options.map((opt, idx) => {
          const isSelected = answers[currentIdx] === opt;
          const isCorrectAnswer = opt === currentQ.correctAnswer;
          const hasAnswered = !!answers[currentIdx];

          let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-medium flex justify-between items-center ";
          
          if (hasAnswered) {
             if (isCorrectAnswer) btnClass += "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200";
             else if (isSelected) btnClass += "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-200";
             else btnClass += "bg-white dark:bg-black border-gray-200 dark:border-gray-800 opacity-50";
          } else {
             btnClass += "bg-white dark:bg-black border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-gray-700 dark:text-gray-200";
          }

          return (
            <button 
              key={idx} 
              onClick={() => handleOptionClick(opt)}
              disabled={isLocked || hasAnswered}
              className={btnClass}
            >
              <span>{opt}</span>
              {hasAnswered && isCorrectAnswer && <CheckCircle size={20} />}
              {hasAnswered && isSelected && !isCorrectAnswer && <XCircle size={20} />}
            </button>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
         <button 
           onClick={handlePrevious} 
           disabled={currentIdx === 0}
           className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
         >
            <ChevronLeft size={16} /> Previous
         </button>
         
         {!answers[currentIdx] && (
            <button 
              onClick={handleSkip}
              className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 dark:hover:text-white transition-colors"
            >
               Skip <SkipForward size={16} />
            </button>
         )}
         
         {answers[currentIdx] && currentIdx < questions.length - 1 && (
             <div className="text-xs text-gray-400 italic animate-pulse">Next question in 1s...</div>
         )}
      </div>
    </div>
  );
};

// --- Single Mini Quiz Component (Legacy Support) ---
export const MiniQuiz: React.FC<QuizProps> = ({ id, points, question, options, correctAnswer }) => {
  const { updateQuizScore } = useAuth();
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (option: string) => {
    if (isSubmitted) return;
    setSelected(option);
    setIsSubmitted(true);
    
    if (option === correctAnswer) {
      await updateQuizScore(id, points);
    }
  };

  return (
    <div className="mt-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="text-indigo-500" size={20} />
        <h4 className="font-bold text-gray-900 dark:text-white">Quick Check</h4>
        <span className="text-xs font-bold bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded-full ml-auto">{points} Pts</span>
      </div>
      
      <p className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 mb-4">{question}</p>
      
      <div className="space-y-2">
        {options.map((opt) => {
          let btnClass = "w-full text-left p-3 rounded-xl border transition-all text-sm ";
          if (isSubmitted) {
            if (opt === correctAnswer) btnClass += "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300";
            else if (opt === selected) btnClass += "bg-red-100 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300 opacity-70";
            else btnClass += "bg-white dark:bg-black border-gray-200 dark:border-gray-800 opacity-50";
          } else {
            btnClass += "bg-white dark:bg-black border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:shadow-sm text-gray-700 dark:text-gray-300";
          }

          return (
            <button key={opt} onClick={() => handleSubmit(opt)} disabled={isSubmitted} className={btnClass}>
              <div className="flex justify-between items-center">
                <span>{opt}</span>
                {isSubmitted && opt === correctAnswer && <CheckCircle size={16} className="text-green-600" />}
                {isSubmitted && opt === selected && opt !== correctAnswer && <XCircle size={16} className="text-[#ff7400]" />}
              </div>
            </button>
          );
        })}
      </div>
      {isSubmitted && selected === correctAnswer && (
         <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm animate-dropdown-reveal">
            <Trophy size={16} /> Points Recorded!
         </div>
      )}
    </div>
  );
};

// --- True/False Component ---
export const MiniTrueFalse: React.FC<TrueFalseProps> = ({ id, points, statement, isTrue }) => {
  const { updateQuizScore } = useAuth();
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);

  const handleGuess = async (guess: boolean) => {
    if (result) return;
    const correct = guess === isTrue;
    setResult(correct ? 'correct' : 'incorrect');
    if (correct) await updateQuizScore(id, points);
  };

  return (
    <div className="mt-8 bg-orange-50 dark:bg-orange-900/10 rounded-2xl p-6 border border-orange-100 dark:border-orange-800">
       <div className="flex items-center gap-2 mb-4">
        <Brain className="text-orange-500" size={20} />
        <h4 className="font-bold text-gray-900 dark:text-white">Fact or Fiction?</h4>
        <span className="text-xs font-bold bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full ml-auto">{points} Pts</span>
      </div>
      
      <p className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-200 mb-6 text-center italic">"{statement}"</p>
      
      <div className="flex gap-4">
         <button onClick={() => handleGuess(true)} disabled={!!result} className={`flex-1 py-3 rounded-xl font-bold transition-all ${result ? (isTrue ? 'bg-green-500 text-white' : 'opacity-50 bg-gray-200 dark:bg-gray-800') : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'}`}>
            True
         </button>
         <button onClick={() => handleGuess(false)} disabled={!!result} className={`flex-1 py-3 rounded-xl font-bold transition-all ${result ? (!isTrue ? 'bg-green-500 text-white' : 'opacity-50 bg-gray-200 dark:bg-gray-800') : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'}`}>
            False
         </button>
      </div>
      
      {result === 'correct' && <div className="mt-4 text-center text-green-600 font-bold text-sm">Correct! +{points} Points</div>}
      {result === 'incorrect' && <div className="mt-4 text-center text-[#ff7400] font-bold text-sm">Incorrect. Keep trying!</div>}
    </div>
  );
};

// --- Mini Memory Game ---
export const MiniMemory: React.FC<BaseGameProps> = ({ id, points }) => {
    const { updateQuizScore } = useAuth();
    const [cards, setCards] = useState([
        { id: 1, val: 'A', flipped: false, matched: false },
        { id: 2, val: 'B', flipped: false, matched: false },
        { id: 3, val: 'A', flipped: false, matched: false },
        { id: 4, val: 'B', flipped: false, matched: false },
    ].sort(() => Math.random() - 0.5));
    const [flipped, setFlipped] = useState<number[]>([]);
    const [solved, setSolved] = useState(false);

    const handleCardClick = (idx: number) => {
        if (flipped.length === 2 || cards[idx].flipped || cards[idx].matched) return;
        
        const newCards = [...cards];
        newCards[idx].flipped = true;
        setCards(newCards);
        
        const newFlipped = [...flipped, idx];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            const [first, second] = newFlipped;
            if (cards[first].val === cards[second].val) {
                newCards[first].matched = true;
                newCards[second].matched = true;
                setCards(newCards);
                setFlipped([]);
                if (newCards.every(c => c.matched)) {
                    setSolved(true);
                    updateQuizScore(id, points);
                }
            } else {
                setTimeout(() => {
                    const resetCards = [...cards];
                    resetCards[first].flipped = false;
                    resetCards[second].flipped = false;
                    setCards(resetCards);
                    setFlipped([]);
                }, 1000);
            }
        }
    };

    return (
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-4">
                <Brain className="text-blue-500" size={20} />
                <h4 className="font-bold text-gray-900 dark:text-white">Memory Burst</h4>
                <span className="text-xs font-bold bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full ml-auto">{points} Pts</span>
            </div>
            {solved ? (
                <div className="text-center py-8">
                    <Trophy size={40} className="mx-auto text-yellow-500 mb-2" />
                    <p className="font-bold text-gray-900 dark:text-white">Complete!</p>
                </div>
            ) : (
                <div className="grid grid-cols-4 gap-2">
                    {cards.map((c, i) => (
                        <button 
                            key={c.id} 
                            onClick={() => handleCardClick(i)}
                            className={`aspect-square rounded-xl transition-all transform ${c.flipped || c.matched ? 'bg-blue-500 text-white rotate-0' : 'bg-gray-200 dark:bg-gray-800 rotate-180'}`}
                        >
                            {(c.flipped || c.matched) ? c.val : '?'}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
