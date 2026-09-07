import React, { useState } from 'react';
import {
  Zap, BrainCircuit, CheckCircle2, XCircle, ArrowRight, RotateCw,
  Sparkles, Star, Award, Flame, Lightbulb, ChevronRight, HelpCircle, Check
} from 'lucide-react';
import clsx from 'clsx';
import { recordStudentAction } from '../../services/personalizationEngine';

interface DailyBiteTabProps {
  onNavigate: (page: string, params?: any) => void;
  onPointsEarned?: (pts: number) => void;
}

export const DailyBiteTab: React.FC<DailyBiteTabProps> = ({ onNavigate, onPointsEarned }) => {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [iqSelectedAnswer, setIqSelectedAnswer] = useState<string | null>(null);
  const [qotdSelected, setQotdSelected] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const FLASHCARDS = [
    {
      subject: 'Integrated Science / Chemistry',
      term: 'Avogadro’s Constant',
      definition: 'The number of constituent particles (usually atoms or molecules) per mole of a given substance: 6.022 × 10²³ mol⁻¹.',
      examTip: 'Frequently used in stoichiometric mole calculations in ZIMSEC Science Paper 2.',
    },
    {
      subject: 'Mathematics',
      term: 'Quadratic Formula',
      definition: 'x = (-b ± √(b² - 4ac)) / (2a). The discriminant Δ = b² - 4ac determines whether roots are real (Δ ≥ 0) or non-real (Δ < 0).',
      examTip: 'Always check if you need to round answers to 2 decimal places or 3 significant figures.',
    },
    {
      subject: 'Geography',
      term: 'Intertropical Convergence Zone (ITCZ)',
      definition: 'A low-pressure belt near the equator where northeast and southeast trade winds converge, causing Zimbabwe’s summer rainfall season (Nov - March).',
      examTip: 'Essential for climatic region and weather pattern essay questions.',
    },
    {
      subject: 'Computer Science',
      term: 'Von Neumann Architecture',
      definition: 'Computer design schema consisting of CPU (ALU + Control Unit), Memory Unit, Input/Output mechanisms, and Common Bus interface.',
      examTip: 'Key distinction: Data and programs are stored in the same memory space.',
    },
  ];

  const DAILY_IQ_PUZZLE = {
    title: 'Daily Pattern Sequence',
    question: 'What is the next number in this sequence? 3, 7, 15, 31, 63, ?',
    options: [
      { id: 'a', text: '127', isCorrect: true, explanation: 'Rule: multiply by 2 and add 1 (n × 2 + 1) or adding 2^(k+1): +4, +8, +16, +32, +64.' },
      { id: 'b', text: '125', isCorrect: false, explanation: 'Close, but 63 × 2 + 1 = 127.' },
      { id: 'c', text: '119', isCorrect: false, explanation: 'Incorrect pattern.' },
      { id: 'd', text: '135', isCorrect: false, explanation: 'Incorrect.' },
    ],
  };

  const QUESTION_OF_THE_DAY = {
    subject: 'Zimbabwean History & Governance',
    question: 'Which ancient stone monument in Zimbabwe features chevron patterned walls built entirely without mortar?',
    options: [
      { id: 'a', text: 'Great Zimbabwe (Masvingo)', isCorrect: true, votes: '84%' },
      { id: 'b', text: 'Khami Ruins (Bulawayo)', isCorrect: false, votes: '11%' },
      { id: 'c', text: 'Danangombe Ruins', isCorrect: false, votes: '3%' },
      { id: 'd', text: 'Naletale Ruins', isCorrect: false, votes: '2%' },
    ],
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setCurrentFlashcardIndex((prev) => (prev + 1) % FLASHCARDS.length);
  };

  const handleIqSelect = (optId: string) => {
    if (iqSelectedAnswer) return;
    setIqSelectedAnswer(optId);
    const chosen = DAILY_IQ_PUZZLE.options.find((o) => o.id === optId);
    if (chosen?.isCorrect) {
      triggerToast('🧠 Superb logic! +20 IQ Points added.');
      recordStudentAction.solveChallenge('daily-iq-today', true, 20);
      onPointsEarned?.(20);
    }
  };

  const handleQotdSelect = (optId: string) => {
    if (qotdSelected) return;
    setQotdSelected(optId);
    const chosen = QUESTION_OF_THE_DAY.options.find((o) => o.id === optId);
    if (chosen?.isCorrect) {
      triggerToast('🎯 Correct! +15 Learning Points added.');
      recordStudentAction.solveChallenge('qotd-today', true, 15);
      onPointsEarned?.(15);
    }
  };

  const card = FLASHCARDS[currentFlashcardIndex];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {toast && (
        <div className="fixed bottom-20 sm:bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 px-4 py-3 text-xs font-black shadow-2xl animate-bounce">
          <Sparkles size={14} className="text-yellow-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <section className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#12141c] p-5 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/25 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
              <Zap size={13} className="text-amber-500" /> Daily Micro-Learning
            </span>
            <h1 className="mt-2 text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              ⚡ Daily Bite & Rapid-Fire Drills
            </h1>
            <p className="mt-0.5 text-xs sm:text-sm text-slate-600 dark:text-gray-300">
              Quick 60-second flashcards, daily IQ puzzle, and community question of the day.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.05] text-xs font-black text-slate-700 dark:text-gray-300">
              Card {currentFlashcardIndex + 1} of {FLASHCARDS.length}
            </span>
          </div>
        </div>
      </section>

      {/* 🎴 60-Second Concept Flashcard */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb size={16} className="text-yellow-500" /> 60-Second Flashcard Recall
          </h2>
          <span className="text-[11px] font-bold text-slate-400">Tap card to flip</span>
        </div>

        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative min-h-[220px] rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-gradient-to-br from-slate-50 to-white dark:from-[#161922] dark:to-[#12141a] p-6 sm:p-8 flex flex-col justify-between cursor-pointer hover:border-[#ef2b3f]/40 transition-all shadow-sm group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-0.5 rounded-md bg-[#ef2b3f]/10 text-[10px] font-black uppercase tracking-wider text-[#ef2b3f]">
                {card.subject}
              </span>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 group-hover:text-[#ef2b3f] transition-colors">
                <RotateCw size={13} /> {isFlipped ? 'Show Term' : 'Reveal Definition'}
              </span>
            </div>

            {!isFlipped ? (
              <div className="py-6">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Concept Term</p>
                <h3 className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.term}
                </h3>
              </div>
            ) : (
              <div className="py-2 space-y-3 animate-dropdown-reveal">
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Definition & Concept</p>
                <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-gray-100 leading-relaxed">
                  {card.definition}
                </p>
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-900 dark:text-amber-300">
                  💡 Exam Tip: {card.examTip}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/[0.05]">
            <span className="text-[11px] text-slate-400 font-bold">
              Tip: Test your memory before flipping
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNextFlashcard();
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-xs font-black flex items-center gap-1 hover:scale-105 transition-all"
            >
              <span>Next Card</span> <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* 🧠 Daily IQ & Logic Challenge */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
            <BrainCircuit size={16} className="text-purple-500" /> Daily IQ & Logic Challenge
          </h2>
          <button
            onClick={() => onNavigate('iq-trainer')}
            className="text-[11px] font-black text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            Open Full IQ Trainer <ArrowRight size={11} />
          </button>
        </div>

        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#151821] p-5 sm:p-6 space-y-4 shadow-sm">
          <div>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {DAILY_IQ_PUZZLE.title} · +20 pts
            </span>
            <h3 className="mt-2 text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {DAILY_IQ_PUZZLE.question}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {DAILY_IQ_PUZZLE.options.map((opt) => {
              const isSelected = iqSelectedAnswer === opt.id;
              const answered = Boolean(iqSelectedAnswer);

              return (
                <button
                  key={opt.id}
                  onClick={() => handleIqSelect(opt.id)}
                  disabled={answered}
                  className={clsx(
                    'p-3.5 rounded-xl border text-center font-black text-sm transition-all',
                    answered
                      ? opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : isSelected
                        ? 'border-rose-500 bg-rose-500/15 text-rose-600'
                        : 'border-slate-100 dark:border-white/5 opacity-50 text-slate-400'
                      : 'border-slate-200 dark:border-white/10 hover:border-purple-500 bg-slate-50 dark:bg-[#1a1d26] text-slate-800 dark:text-gray-200'
                  )}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {iqSelectedAnswer && (
            <div className="p-3.5 rounded-xl bg-purple-500/[0.06] border border-purple-500/20 text-xs font-semibold text-purple-950 dark:text-purple-200">
              💡 Solution: {DAILY_IQ_PUZZLE.options.find((o) => o.isCorrect)?.explanation}
            </div>
          )}
        </div>
      </section>

      {/* 🗳️ Question of the Day with Community Breakdown */}
      <section className="space-y-3">
        <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
          <Award size={16} className="text-amber-500" /> Community Question of the Day
        </h2>

        <div className="rounded-2xl border border-slate-200/90 dark:border-white/[0.08] bg-white dark:bg-[#151821] p-5 sm:p-6 space-y-4 shadow-sm">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              {QUESTION_OF_THE_DAY.subject}
            </span>
            <h3 className="mt-1 text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {QUESTION_OF_THE_DAY.question}
            </h3>
          </div>

          <div className="space-y-2">
            {QUESTION_OF_THE_DAY.options.map((opt) => {
              const selected = qotdSelected === opt.id;
              const answered = Boolean(qotdSelected);

              return (
                <button
                  key={opt.id}
                  onClick={() => handleQotdSelect(opt.id)}
                  disabled={answered}
                  className={clsx(
                    'w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs font-bold transition-all',
                    answered
                      ? opt.isCorrect
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : selected
                        ? 'border-rose-500 bg-rose-500/10 text-rose-700'
                        : 'border-slate-100 dark:border-white/5 opacity-60 text-slate-400'
                      : 'border-slate-200 dark:border-white/10 hover:border-[#ef2b3f]/40 bg-slate-50 dark:bg-[#1a1d26] text-slate-800 dark:text-gray-200'
                  )}
                >
                  <span>{opt.text}</span>
                  {answered && (
                    <span className="text-[11px] font-black text-slate-500 dark:text-gray-400">
                      {opt.votes} voted
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
