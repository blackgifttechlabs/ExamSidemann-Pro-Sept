import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Search,
  Trophy,
  Flame,
  Volume2,
  VolumeX,
  ArrowRight,
} from 'lucide-react';
import { IQ_CATEGORIES, type IQCategory } from './categoryCardsData';
import { GeographyTrainer } from './categories/GeographyTrainer';
import { LogoTrainer } from './categories/LogoTrainer';
import { MathTrainer } from './categories/MathTrainer';
import { GeneralKnowledgeTrainer } from './categories/GeneralKnowledgeTrainer';
import { AstronomyTrainer } from './categories/AstronomyTrainer';
import { CarsTrainer } from './categories/CarsTrainer';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../services/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const STATS_KEY = 'exam-sidemann-iq-trainer-stats-v2';

type TrainerStats = {
  totalXp: number;
  dailyStreak: number;
  bestStreak: number;
  soundEnabled: boolean;
};

const DEFAULT_STATS: TrainerStats = {
  totalXp: 0,
  dailyStreak: 1,
  bestStreak: 0,
  soundEnabled: true,
};

export const IQTrainer: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('category') as IQCategory['id'] | null;
  const [searchQuery, setSearchQuery] = useState('');
  const [geographyHeaderTarget, setGeographyHeaderTarget] = useState<HTMLDivElement | null>(null);
  const isGeography = selectedCategoryId === 'geography';

  const { user } = useAuth();
  const [stats, setStats] = useState<TrainerStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      return saved ? { ...DEFAULT_STATS, ...JSON.parse(saved) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error('Failed saving stats', e);
    }
  }, [stats]);

  const handleAddXp = (xp: number) => {
    setStats((prev) => {
      const nextXp = prev.totalXp + xp;
      const nextBest = Math.max(prev.bestStreak, prev.dailyStreak + 1);

      if (user?.uid) {
        addDoc(collection(db, 'iqTrainerResults'), {
          userId: user.uid,
          xpEarned: xp,
          totalXp: nextXp,
          timestamp: serverTimestamp(),
        }).catch(() => {});
      }

      return {
        ...prev,
        totalXp: nextXp,
        bestStreak: nextBest,
      };
    });
  };

  const handleSelectCategory = (catId: IQCategory['id']) => {
    setSearchParams({ category: catId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (selectedCategoryId) {
      setSearchQuery('');
      setSearchParams({}, { replace: true });
      return;
    }
    navigate('/', { replace: true });
  };

  const activeCategory = useMemo(() => {
    return IQ_CATEGORIES.find((c) => c.id === selectedCategoryId) || null;
  }, [selectedCategoryId]);

  const displayedCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return IQ_CATEGORIES;
    return IQ_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.subLabel.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tag.toLowerCase().includes(q) ||
        c.bottomLabel.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className={`bg-[#fafafc] dark:bg-[#070709] text-slate-900 dark:text-white ${isGeography ? 'h-dvh flex flex-col overflow-hidden' : 'min-h-screen pb-32'}`}>
      {/* ========================================================================= */}
      {/* TOP BAR                                                                   */}
      {/* ========================================================================= */}
      <div className="w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 sm:px-8 lg:px-[100px] py-4 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="flex items-center justify-center p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
            aria-label={selectedCategoryId ? 'Back to categories' : 'Back to home'}
          >
            <ChevronLeft size={24} strokeWidth={2.3} />
          </button>
          <h1 className="text-lg sm:text-xl font-black tracking-tight truncate">{isGeography ? 'Geography Trainer' : 'IQ Trainer'}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isGeography ? (
            <div ref={setGeographyHeaderTarget} />
          ) : (
            <>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-black bg-slate-50 dark:bg-slate-900">
                <Trophy size={14} className="text-amber-400" />
                <span>{stats.totalXp} XP</span>
              </div>

              <div className="relative w-32 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-1.5 pl-9 pr-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>

            </>
          )}

          <button
            onClick={() => setStats(s => ({ ...s, soundEnabled: !s.soundEnabled }))}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            {stats.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <main className={isGeography ? "w-full flex-1 min-h-0" : "mx-auto w-full px-4 sm:px-8 lg:px-[100px] pt-8 sm:pt-10"}>
        <AnimatePresence mode="wait">
          {/* 1. GEOGRAPHY CATEGORY */}
          {activeCategory?.id === 'geography' && (
            <motion.div
              key="geography"
              className="h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <GeographyTrainer
                headerActionsTarget={geographyHeaderTarget}
                onBack={handleBack}
                onAddXp={handleAddXp}
                soundEnabled={stats.soundEnabled}
              />
            </motion.div>
          )}

          {/* 2. LOGOS CATEGORY */}
          {activeCategory?.id === 'logos' && (
            <motion.div
              key="logos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <LogoTrainer
                onBack={handleBack}
                onAddXp={handleAddXp}
                soundEnabled={stats.soundEnabled}
              />
            </motion.div>
          )}

          {/* 3. MATH CATEGORY */}
          {activeCategory?.id === 'math' && (
            <motion.div
              key="math"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <MathTrainer
                onBack={handleBack}
                onAddXp={handleAddXp}
                soundEnabled={stats.soundEnabled}
              />
            </motion.div>
          )}

          {/* 4. GENERAL KNOWLEDGE CATEGORY */}
          {activeCategory?.id === 'general' && (
            <motion.div
              key="general"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <GeneralKnowledgeTrainer
                onBack={handleBack}
                onAddXp={handleAddXp}
                soundEnabled={stats.soundEnabled}
              />
            </motion.div>
          )}

          {/* 5. ASTRONOMY CATEGORY */}
          {activeCategory?.id === 'astronomy' && (
            <motion.div
              key="astronomy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <AstronomyTrainer
                onBack={handleBack}
                onAddXp={handleAddXp}
                soundEnabled={stats.soundEnabled}
              />
            </motion.div>
          )}

          {/* 6. CARS CATEGORY */}
          {activeCategory?.id === 'cars' && (
            <motion.div
              key="cars"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              <CarsTrainer
                onBack={handleBack}
                onAddXp={handleAddXp}
                soundEnabled={stats.soundEnabled}
              />
            </motion.div>
          )}

          {/* 7. HUB VIEW: Category Cards */}
          {!activeCategory && (
            <motion.div
              key="hub-cards"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {searchQuery && (
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
                    {displayedCategories.length} Categories Found
                  </h2>
                </div>
              )}

              {/* Illustrated category cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 pt-4">
                {displayedCategories.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    type="button"
                    initial={{ opacity: 0, y: 35 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.08,
                      type: 'spring',
                      stiffness: 300,
                      damping: 24,
                    }}
                    onClick={() => handleSelectCategory(cat.id)}
                    aria-label={`Start ${cat.name}`}
                    className="group relative flex h-full min-w-0 cursor-pointer flex-col items-center rounded-[9px] p-6 text-center text-white shadow-md transition-shadow hover:shadow-2xl focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-purple-400"
                    style={{ backgroundColor: cat.accentColor }}
                  >
                    <span className={`relative mb-4 flex h-36 justify-center ${cat.id === 'logos' ? 'w-52 max-w-full items-center rounded-xl bg-white p-3' : 'w-full items-end'}`}>
                      {cat.id !== 'logos' && <span className="absolute bottom-0 h-24 w-52 max-w-full rounded-t-full bg-white/90" aria-hidden="true" />}
                      <img
                        src={cat.image}
                        alt=""
                        loading="lazy"
                        className={`relative z-10 max-w-full object-contain transition-transform duration-300 group-hover:scale-105 ${cat.id === 'logos' ? 'max-h-full' : 'max-h-[165px] -translate-y-6 drop-shadow-lg group-hover:-translate-y-7'}`}
                      />
                    </span>
                    <span className="text-lg font-bold leading-tight">{cat.name}</span>
                    <span className="mt-1 text-xs font-semibold text-white/85">{cat.subLabel}</span>
                    <span className="sr-only">{cat.description}</span>
                    <span className="mt-auto w-full pt-4">
                      <span className="flex w-full items-center justify-between border-t border-white/20 pt-3">
                        <span className="text-sm font-bold uppercase tracking-widest">{cat.bottomLabel}</span>
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-white/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors group-hover:bg-white/25">
                          Start <ArrowRight size={11} />
                        </span>
                      </span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default IQTrainer;
