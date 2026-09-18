import React, { useState } from 'react';
import { ArrowLeft, Check, X, Trophy, Flame, ArrowRight, Lightbulb } from 'lucide-react';
import { GK_QUESTIONS, type GKQuestion } from '../data/gkQuestionsData';

interface GKTrainerProps {
  onBack: () => void;
  onAddXp?: (xp: number) => void;
  soundEnabled?: boolean;
}

export const GeneralKnowledgeTrainer: React.FC<GKTrainerProps> = ({ onBack, onAddXp }) => {
  const [questions] = useState<GKQuestion[]>(GK_QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const currentQ = questions[currentIndex] || questions[0];
  const isCorrect = selectedOption === currentQ.correctAnswer;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      onAddXp?.(15);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    setCurrentIndex((prev) => (prev + 1) % questions.length);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Categories</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-lg text-blue-700 dark:text-blue-300 text-xs font-black">
            <Trophy size={14} />
            <span>{score} Solved</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg text-rose-700 dark:text-rose-300 text-xs font-black">
            <Flame size={14} />
            <span>{streak} Streak</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="text-blue-600 dark:text-blue-400 uppercase tracking-wider">{currentQ.category}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded-full text-xs font-black uppercase tracking-wider">
            {currentQ.category}
          </span>
          <span className="text-xs font-bold text-slate-400">
            Global Trivia
          </span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-relaxed mb-6">
          {currentQ.question}
        </h2>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {currentQ.options.map((option, idx) => {
            const isThisSelected = selectedOption === option;
            const isThisCorrect = option === currentQ.correctAnswer;

            let buttonStyle = 'bg-slate-50 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-800 dark:text-white';
            if (isAnswered) {
              if (isThisCorrect) {
                buttonStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-400/30';
              } else if (isThisSelected && !isThisCorrect) {
                buttonStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200';
              } else {
                buttonStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400';
              }
            }

            return (
              <button
                key={option}
                disabled={isAnswered}
                onClick={() => handleSelect(option)}
                className={`py-3.5 px-4 rounded-xl border font-bold text-sm flex items-center justify-between transition-all shadow-sm active:scale-98 text-left ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center shrink-0">
                    {optionLetters[idx]}
                  </span>
                  <span>{option}</span>
                </div>
                {isAnswered && isThisCorrect && <Check size={18} className="text-emerald-500" strokeWidth={3} />}
                {isAnswered && isThisSelected && !isThisCorrect && <X size={18} className="text-rose-500" strokeWidth={3} />}
              </button>
            );
          })}
        </div>

        {/* Feedback and Explanation */}
        {isAnswered && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 animate-fadeIn">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isCorrect ? <Check size={16} /> : <X size={16} />}
                {isCorrect ? 'Correct! +15 XP' : `Incorrect! Correct answer: ${currentQ.correctAnswer}`}
              </span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <Lightbulb size={16} className="text-amber-500 shrink-0 mt-0.5" />
              <p><strong>Fact:</strong> {currentQ.explanation}</p>
            </div>
          </div>
        )}

        {/* Bottom Button */}
        {isAnswered && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95"
            >
              <span>Next Question</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
