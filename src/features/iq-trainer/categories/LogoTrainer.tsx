import React, { useState, useMemo } from 'react';
import { ArrowLeft, Check, X, Trophy, Flame, Shuffle, ArrowRight, Image as ImageIcon, HelpCircle, SkipForward } from 'lucide-react';
import { FAMOUS_LOGOS, type BrandLogo } from '../data/logosData';

interface LogoTrainerProps {
  onBack: () => void;
  onAddXp?: (xp: number) => void;
  soundEnabled?: boolean;
}

export const LogoTrainer: React.FC<LogoTrainerProps> = ({
  onBack,
  onAddXp,
  soundEnabled = true,
}) => {
  const [logos, setLogos] = useState<BrandLogo[]>(() =>
  [...FAMOUS_LOGOS].sort(() => Math.random() - 0.5)
);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const currentLogo = logos[currentIndex] || logos[0];

  const handleSelectOption = (option: string) => {
    if (isFlipped || showFeedback) return;

    setSelectedOption(option);
    const isCorrect = option === currentLogo.correctAnswer;

    if (isCorrect) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      onAddXp?.(15);
    } else {
      setStreak(0);
    }

    // Show the animated feedback modal first, then flip the card
    setShowFeedback(true);
    setTimeout(() => {
      setShowFeedback(false);
      setIsFlipped(true);
    }, 900);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setSelectedOption(null);
    setImageError(false);
    setShowFeedback(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % logos.length);
    }, 200);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setSelectedOption(null);
    setImageError(false);
    setShowFeedback(false);
    const shuffled = [...logos].sort(() => Math.random() - 0.5);
    setLogos(shuffled);
    setCurrentIndex(0);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];
  const isCorrect = selectedOption === currentLogo.correctAnswer;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* Top Header Bar */}
      <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Categories</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-amber-700 dark:text-amber-300 text-xs font-black">
            <Trophy size={14} />
            <span>{score} Solved</span>
          </div>

          <div className="flex items-center gap-1 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-lg text-rose-700 dark:text-rose-300 text-xs font-black">
            <Flame size={14} />
            <span>{streak} Streak</span>
          </div>

          <button
            onClick={handleShuffle}
            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Shuffle Logos"
          >
            <Shuffle size={16} />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full mb-6">
        <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
          <span>Logo {currentIndex + 1} of {logos.length}</span>
          <span className="text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{currentLogo.category}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / logos.length) * 100}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Flashcard Container */}
      <div
        className="w-full min-h-[460px] relative [perspective:1400px] mb-6"
      >
        {showFeedback && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-2xl">
            <div className="relative flex items-center justify-center h-24 w-24">
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${
                  isCorrect ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span
                className={`absolute inline-flex h-full w-full rounded-full opacity-40 animate-ping [animation-delay:200ms] ${
                  isCorrect ? 'bg-emerald-400' : 'bg-rose-400'
                }`}
              />
              <span
                className={`relative inline-flex items-center justify-center h-20 w-20 rounded-full shadow-2xl ${
                  isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
              >
                {isCorrect ? (
                  <Check size={42} strokeWidth={4} className="text-white" />
                ) : (
                  <X size={42} strokeWidth={4} className="text-white" />
                )}
              </span>
            </div>
          </div>
        )}
        <div
          className={`grid w-full min-w-0 min-h-[460px] rounded-2xl shadow-xl transition-transform duration-700 [transform-style:preserve-3d] relative ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* ========================================================================= */}
          {/* FRONT FACE: Logo Image & Options A, B, C, D                              */}
          {/* ========================================================================= */}
          <div
            inert={isFlipped}
            className="col-start-1 row-start-1 min-w-0 w-full rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 [backface-visibility:hidden] flex flex-col justify-between"
          >
            {/* Front Header */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300">
                {currentLogo.category}
              </span>
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <HelpCircle size={14} /> Flip on answer
              </span>
            </div>

            {/* Centered Question & Logo Canvas */}
            <div className="flex flex-col items-center justify-center my-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-4 text-center">
                What logo is this?
              </h2>

              {/* Logo Display Canvas (with image fallback to placeholder) */}
              <div className="w-full max-w-[340px] h-52 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/60 dark:to-slate-900 shadow-inner flex flex-col items-center justify-center p-4 relative overflow-hidden group" style={{ border: '3px solid ' + (currentLogo.brandColor || '#e2e8f0') }}>
                {!imageError ? (
                  <img
                    src={currentLogo.image}
                    alt="Brand Logo"
                    onError={() => setImageError(true)}
                    className="max-h-full max-w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  /* High quality placeholder when image hasn't been uploaded yet */
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md mb-2"
                      style={{ backgroundColor: currentLogo.brandColor || '#0284c7' }}
                    >
                      {currentLogo.monogram}
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      [ LOGO PLACEHOLDER ]
                    </span>
                    <span className="text-[10px] text-slate-400 mt-0.5 max-w-[220px] truncate">
                      {currentLogo.image}
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 text-center italic max-w-md">
                Hint: "{currentLogo.hint}"
              </p>
            </div>

            {/* A, B, C, D Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              {currentLogo.options.map((option, idx) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 hover:border-cyan-400 dark:hover:border-cyan-600 transition-all font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-3 group active:scale-98 text-left shadow-sm"
                >
                  <span className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-xs flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors shrink-0">
                    {optionLetters[idx]}
                  </span>
                  <span className="min-w-0 break-words">{option}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-center mt-3">
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <SkipForward size={14} /> Skip
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BACK FACE: Revealed Brand Name, Trivia & Next Button                     */}
          {/* ========================================================================= */}
          <div
            inert={!isFlipped}
            className="col-start-1 row-start-1 min-w-0 w-full rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950 text-white border border-cyan-500/30 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between shadow-2xl"
          >
            {/* Result Badge */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase flex items-center gap-1.5 shadow-md ${
                  isCorrect
                    ? 'bg-emerald-500 text-white'
                    : 'bg-rose-500 text-white'
                }`}
              >
                {isCorrect ? (
                  <>
                    <Check size={14} strokeWidth={3} /> SPOT ON! +15 XP
                  </>
                ) : (
                  <>
                    <X size={14} strokeWidth={3} /> NOT QUITE!
                  </>
                )}
              </span>

              <span className="text-xs font-bold text-cyan-300">
                Founded in {currentLogo.founded} • {currentLogo.origin}
              </span>
            </div>

            {/* Revealed Brand Identity */}
            <div className="flex flex-col items-center justify-center text-center my-4">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">
                The Correct Brand is
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                {currentLogo.name}
              </h1>

              {/* Brand Trivia Box */}
              <div className="w-full mt-5 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-left shadow-inner">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1.5">
                  💡 Logo Story &amp; Trivia
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {currentLogo.fact}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/15">
              <div className="text-xs text-slate-400">
                You picked: <strong className="text-white">{selectedOption || 'None'}</strong>
              </div>

              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <span>Next Logo</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
