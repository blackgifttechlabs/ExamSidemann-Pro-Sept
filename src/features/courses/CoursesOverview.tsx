import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, Search, Check, ArrowRight, ChevronRight, LayoutGrid, Sparkles, Flame,
  FileText, FlaskConical, Brain, BookOpen, Video
} from 'lucide-react';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { COURSE_ARTWORK, courseArtwork } from './courseArtwork';

interface CoursesOverviewProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const CoursesOverview: React.FC<CoursesOverviewProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 4 Main Categories with fixed distinct vibrant themes
  const mainCategories = [
    {
      id: 'ZJC',
      name: 'Junior Certificate',
      subLabel: 'Forms 1 & 2',
      image: COURSE_ARTWORK.junior,
      bottomLabel: 'ZJC',
      tag: 'ZJC',
      description: 'Foundational secondary school curriculum for Forms 1 and 2.',
      themeGradient: 'bg-purple-700 text-white',
      badgeBg: 'bg-white/20 text-white',
      count: 2,
    },
    {
      id: "O' Level",
      name: 'Ordinary Level',
      subLabel: 'Forms 3 & 4',
      image: COURSE_ARTWORK.ordinary,
      bottomLabel: 'O-LEVEL',
      tag: 'O Level',
      description: 'Official ZIMSEC examination level notes and practical lessons.',
      themeGradient: 'bg-blue-700 text-white',
      badgeBg: 'bg-white/20 text-white',
      count: 2,
    },
    {
      id: "A' Level",
      name: 'Advanced Level',
      subLabel: 'Lower & Upper 6',
      image: COURSE_ARTWORK.advanced,
      bottomLabel: 'A-LEVEL',
      tag: 'A Level',
      description: 'Advanced Level specialization pathways and in-depth study syllabi.',
      themeGradient: 'bg-fuchsia-700 text-white',
      badgeBg: 'bg-white/20 text-white',
      count: 2,
    },
    {
      id: 'Polytechnic',
      name: 'Technical Courses',
      subLabel: 'NC & ND Levels',
      image: COURSE_ARTWORK.it,
      bottomLabel: 'POLY',
      tag: 'HEXCO',
      description: 'Practical vocational certifications and national diploma modules.',
      themeGradient: 'bg-teal-700 text-white',
      badgeBg: 'bg-white/20 text-white',
      count: CURRICULUM_REGISTRY.filter(c => c.category === 'Polytechnic').length,
    },
  ];

  // All individual levels
  const allLevels = useMemo(() => {
    return CURRICULUM_REGISTRY.map((lvl) => {
      let ribbonText = 'HOT';
      let tag = 'ZJC';
      let bgGradient = 'from-violet-950/90 via-slate-900/90 to-purple-950/80';

      if (lvl.category === "O' Level") {
        ribbonText = 'ZIMSEC';
        tag = 'O Level';
        bgGradient = 'from-blue-950/90 via-slate-900/90 to-indigo-950/80';
      } else if (lvl.category === "A' Level") {
        ribbonText = 'TOP';
        tag = 'A Level';
        bgGradient = 'from-indigo-950/90 via-slate-900/90 to-pink-950/80';
      } else if (lvl.category === 'Polytechnic') {
        ribbonText = 'HEXCO';
        tag = 'HEXCO';
        bgGradient = 'from-teal-950/90 via-slate-900/90 to-emerald-950/80';

      }

      return {
        ...lvl,
        image: courseArtwork(lvl),
        ribbonText,
        tag,
        bgGradient,
      };
    });
  }, []);

  // Filtered levels based on search or selected category
  const displayedLevels = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      return allLevels.filter((lvl) =>
        lvl.name.toLowerCase().includes(q) ||
        lvl.category.toLowerCase().includes(q) ||
        lvl.id.toLowerCase().includes(q) ||
        lvl.subjects.some(s => s.name.toLowerCase().includes(q))
      );
    }
    if (selectedCategory) {
      return allLevels.filter((lvl) => lvl.category === selectedCategory);
    }
    return [];
  }, [allLevels, selectedCategory, searchQuery]);

  const handleCategorySelect = (categoryId: string) => {
    setSearchParams({ category: categoryId });
    const firstInCat = allLevels.find(l => l.category === categoryId);
    if (firstInCat) {
      setSelectedLevelId(firstInCat.id);
    }
  };

  const handleBack = () => {
    if (searchQuery) {
      setSearchQuery('');
      return;
    }
    if (selectedCategory) {
      setSelectedLevelId(null);
      setSearchParams({});
      return;
    }
    if (onNavigate) {
      onNavigate('home');
    } else {
      navigate('/');
    }
  };

  const handleOpenLevel = (levelName: string) => {
    if (onNavigate) {
      onNavigate('courses/detail', { id: levelName });
    } else {
      navigate(`/courses/detail/${encodeURIComponent(levelName)}`);
    }
  };

  const handleContinue = () => {
    if (selectedLevelId) {
      const selected = allLevels.find(l => l.id === selectedLevelId);
      if (selected) {
        handleOpenLevel(selected.name);
        return;
      }
    }
    if (displayedLevels.length > 0) {
      handleOpenLevel(displayedLevels[0].name);
    }
  };

  const suggestedActions = [
    { label: 'Past Papers', icon: FileText, route: 'past-papers' },
    { label: 'Practicals', icon: FlaskConical, route: 'practicals' },
    { label: 'Train Your Mind', icon: Brain, route: 'iq-trainer' },
    { label: 'Find Text Books', icon: BookOpen, route: 'library' },
    { label: 'Watch Tutorials', icon: Video, route: 'tutorials' },
    { label: 'Study With AI', icon: Sparkles, route: 'chat' },
  ];

  const handleSuggestedAction = (route: string) => {
    if (onNavigate) {
      onNavigate(route);
    } else {
      navigate(`/${route}`);
    }
  };

  const activeCategoryMeta = mainCategories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-[#fafafc] dark:bg-[#070709] text-slate-900 dark:text-white pb-32">
      <section className="relative w-full overflow-hidden min-h-[260px] sm:min-h-[300px] lg:min-h-[330px] bg-[#13071b] text-white">
        <div
          className="absolute inset-0 bg-cover opacity-70"
          style={{
            backgroundImage: `url('/images/banners/courses-top-banner.jpg')`,
            backgroundPosition: 'center 24%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#13071b]/50 via-[#13071b]/66 to-[#13071b]/75" />

        <div className="relative z-10 mx-auto w-full px-4 lg:px-[100px] py-5 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                onClick={handleBack}
                className="flex items-center justify-center p-1.5 -ml-1.5 text-white/90 hover:text-white transition-colors"
                aria-label="Back"
              >
                <ChevronLeft size={26} strokeWidth={2.3} />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-black tracking-tight leading-tight truncate">
                  {searchQuery
                    ? 'Search Results'
                    : selectedCategory
                      ? `${activeCategoryMeta?.name || selectedCategory} Courses`
                      : 'Class Notes'}
                </h1>
                {selectedCategory && !searchQuery && (
                  <p className="text-xs font-semibold text-white/70 truncate mt-0.5">
                    {activeCategoryMeta?.subLabel} • Choose your course to start learning
                  </p>
                )}
              </div>
            </div>

            <div className="relative w-full sm:w-80 lg:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                aria-label="Search levels, forms or subjects"
                placeholder="Search levels, forms or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-[9px] border border-white/20 bg-white/95 py-2.5 sm:py-3 pl-10 pr-4 text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none shadow-sm transition-all focus:border-white focus:ring-2 focus:ring-white/25 dark:bg-white/95"
              />
            </div>
          </div>

          {!searchQuery && (
            <div className="mx-auto flex min-h-[170px] max-w-3xl flex-col items-center justify-center px-4 pt-6 text-center sm:min-h-[205px]">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight drop-shadow-sm">
                Class Notes Made for You
              </h2>
              <p className="text-xs sm:text-sm font-medium text-white/82 mt-2 max-w-lg mx-auto">
                Select Your Level
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto w-full px-4 lg:px-[100px] pt-8 sm:pt-10">
        {/* ========================================================================= */}
        {/* DESKTOP ANIMATED LAYOUT (lg screens and above)                           */}
        {/* ========================================================================= */}
        <div className="hidden lg:block">
          {searchQuery ? (
            /* Search Results Grid on Desktop */
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-400">
                  {displayedLevels.length} Results Found
                </h2>
              </div>
              <div className="grid grid-cols-3 xl:grid-cols-4 gap-6">
                {displayedLevels.map((lvl) => (
                  <motion.div
                    key={lvl.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => handleOpenLevel(lvl.name)}
                    className="group relative overflow-hidden rounded-[9px] shadow-lg cursor-pointer bg-slate-900 text-white flex flex-col justify-between p-5 min-h-[260px] border border-slate-800 hover:scale-[1.02] transition-all"
                  >
                    <img src={lvl.image} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30 z-10" />

                    {/* Top Ribbon */}
                    <div className="relative z-20 flex items-center justify-between">
                      <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-[4px] flex items-center gap-1 uppercase tracking-wider shadow-md">
                        <Flame size={12} /> {lvl.ribbonText}
                      </span>
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
                        {lvl.tag}
                      </span>
                    </div>

                    {/* Bottom Details */}
                    <div className="relative z-20 mt-auto">
                      <h3 className="text-lg font-black text-white leading-tight drop-shadow-md">
                        {lvl.name}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        {lvl.subjects.length} subjects • {lvl.category}
                      </p>
                      <button className="mt-4 w-full py-2 rounded-[6px] border border-white/60 text-white font-black text-xs uppercase tracking-wider text-center group-hover:bg-white group-hover:text-slate-950 group-hover:border-white transition-all shadow-sm">
                        VIEW SUBJECTS
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            /* Desktop Layout: Cards Morph & Slide to the Left; Course Cards Enter from the Right */
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="flex w-full gap-8 items-start relative"
            >
              {/* Animated Category Cards Column / Grid */}
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className={
                  selectedCategory
                    ? "sticky top-6 self-start w-80 xl:w-[330px] shrink-0 flex flex-col gap-3.5"
                    : "w-full grid grid-cols-4 gap-x-8 gap-y-12 pt-8"
                }
              >
                {selectedCategory && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col justify-center min-h-[52px] mb-2 pb-2 border-b border-slate-200/80 dark:border-white/10"
                  >
                    <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                      Categories
                    </h2>
                    <button
                      onClick={() => {
                          setSelectedLevelId(null);
                        setSearchParams({});
                      }}
                      className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <LayoutGrid size={12} /> View all categories
                    </button>
                  </motion.div>
                )}

                {mainCategories.map((cat, index) => {
                  const isSelected = selectedCategory === cat.id;
                  const isCollapsed = Boolean(selectedCategory);
                  // When a category is clicked, the other non-active cards shrink a bit
                  const isShrunk = isCollapsed && !isSelected;

                  return (
                    <motion.div
                      layout
                      key={cat.id}
                      initial={{ opacity: 0, y: 35 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        layout: { type: "spring", stiffness: 260, damping: 28 },
                        opacity: { duration: 0.35, delay: selectedCategory ? 0 : index * 0.1 },
                        y: { type: "spring", stiffness: 350, damping: 25, delay: selectedCategory ? 0 : index * 0.1 }
                      }}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`rounded-[9px] transition-all cursor-pointer shadow-md group overflow-visible relative ${cat.themeGradient} ${
                        isSelected
                          ? 'ring-2 ring-white/60 shadow-xl scale-100 opacity-100 z-10'
                          : isShrunk
                            ? 'scale-[0.93] opacity-80 hover:opacity-100 hover:scale-[0.97] border border-white/20'
                            : 'hover:shadow-2xl hover:-translate-y-1.5'
                      } ${isCollapsed ? 'p-4 sm:p-4.5 flex items-center justify-between min-h-[115px]' : 'p-6 flex flex-col items-center text-center'}`}
                    >
                      {/* Left side info (when in sidebar mode) */}
                      {isCollapsed ? (
                        <div className="flex flex-col justify-between z-10 min-w-0 pr-2">
                          <div>
                            <h3 className="text-base sm:text-lg font-black leading-tight truncate text-white drop-shadow-sm">
                              {cat.bottomLabel}
                            </h3>
                            <p className="text-xs font-semibold mt-0.5 truncate text-white/85">
                              {cat.subLabel}
                            </p>
                          </div>

                          <div className="mt-2.5">
                            <span className="px-3 py-1 bg-white text-slate-900 rounded-[6px] text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-sm transition-transform group-hover:scale-105">
                              Explore <ArrowRight size={11} />
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Initial 4-Card Full Grid Mode */
                        <>
                          <div className="relative h-36 w-full flex items-end justify-center overflow-visible mb-4">
                            <div className="absolute bottom-0 h-24 w-52 rounded-t-full bg-white/90 shadow-sm" />
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="relative z-30 max-h-[165px] max-w-[112%] object-contain drop-shadow-lg transition-transform duration-300 -translate-y-6 group-hover:-translate-y-7 group-hover:scale-105"
                            />
                          </div>

                          <span className="text-lg font-black text-white leading-tight drop-shadow-sm">
                            {cat.name}
                          </span>

                          <span className="text-xs font-semibold text-white/80 mt-1">
                            {cat.subLabel}
                          </span>

                          <div className="w-full border-t border-white/20 mt-4 pt-3">
                            <p className="text-center font-black uppercase text-base tracking-widest text-white">
                              {cat.bottomLabel}
                            </p>
                          </div>
                        </>
                      )}

                      {/* Right side cutout image in sidebar mode */}
                      {isCollapsed && (
                        <div className="relative h-20 sm:h-24 w-20 sm:w-24 flex items-end justify-center shrink-0 -mr-1 overflow-visible">
                          <div className="absolute bottom-0 h-14 w-20 rounded-t-full bg-white/90 shadow-sm" />
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="relative z-30 max-h-[112px] max-w-[120%] object-contain drop-shadow-md transition-transform duration-300 -translate-y-4 group-hover:-translate-y-5 group-hover:scale-110"
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Right Side: Course Cards (Designed like Image 1: "Basketball betting" card) */}
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  {selectedCategory && (
                    <motion.div
                      key={selectedCategory}
                      initial={{ opacity: 0, x: 80 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.12 }}
                    >
                      <div className="flex items-center justify-between min-h-[52px] mb-2 pb-2 border-b border-slate-200/80 dark:border-white/10">
                        <div>
                          <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">
                            {activeCategoryMeta?.name}
                          </h2>
                          <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                            {activeCategoryMeta?.description}
                          </p>
                        </div>
                        <span className="rounded-[9px] bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-3 py-1 text-xs font-bold shrink-0">
                          {displayedLevels.length} Courses Available
                        </span>
                      </div>

                      <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 pt-2">
                        {displayedLevels.map((lvl, idx) => (
                          <motion.div
                            key={lvl.id}
                            initial={{ opacity: 0, y: 20, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3, delay: 0.15 + idx * 0.06 }}
                            onClick={() => handleOpenLevel(lvl.name)}
                            className="group relative overflow-hidden rounded-[9px] shadow-lg cursor-pointer bg-slate-950 text-white flex min-h-[270px] flex-col justify-between border border-slate-800 hover:shadow-2xl hover:scale-[1.02] transition-all"
                          >
                            <img
                              src={lvl.image}
                              alt={lvl.name}
                              className="absolute inset-0 z-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/78 via-black/24 to-black/10" />

                            {/* Top Ribbon & Tag (Like Image 1) */}
                            <div className="relative z-20 flex items-center justify-between p-5">
                              <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-[4px] flex items-center gap-1 uppercase tracking-wider shadow-md">
                                <Flame size={12} /> {lvl.ribbonText}
                              </span>
                              <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-[4px]">
                                {lvl.tag}
                              </span>
                            </div>

                            {/* Bottom Details & VIEW SUBJECTS Button (Like Image 1) */}
                            <div className="relative z-20 mt-auto">
                              <div className="bg-gradient-to-t from-black/95 via-black/72 to-transparent px-5 pb-4 pt-24">
                                <h3 className="text-xl font-black text-white leading-tight drop-shadow-md">
                                  {lvl.name}
                                </h3>
                                <p className="text-xs font-semibold text-slate-200 mt-1">
                                  {lvl.subjects.length} subjects • {lvl.category}
                                </p>
                              </div>
                              <div className="border-t border-white/10 bg-[#022f2d] p-5">
                                <button className="w-full py-2.5 rounded-[6px] bg-white text-slate-950 font-black text-xs uppercase tracking-wider text-center hover:bg-slate-100 transition-all shadow-sm">
                                  VIEW SUBJECTS
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>

        {!searchQuery && (
          <div className="mt-8 hidden lg:grid grid-cols-6 gap-4">
            {suggestedActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.label}
                  onClick={() => handleSuggestedAction(action.route)}
                  className="group flex min-h-[92px] items-center gap-3 rounded-[9px] border border-slate-200 bg-white px-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md dark:border-white/10 dark:bg-[#121216] dark:hover:border-purple-400/40"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[9px] bg-slate-100 text-slate-700 transition-colors group-hover:bg-purple-600 group-hover:text-white dark:bg-white/10 dark:text-slate-200">
                    <Icon size={20} strokeWidth={2.2} />
                  </span>
                  <span className="text-sm font-black leading-tight text-slate-900 dark:text-white">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MOBILE VIEW (Visible on screens < lg)                                     */}
        {/* ========================================================================= */}
        <div className="block lg:hidden">
          {/* Mobile VIEW 1: 4 Category Cards */}
          {!selectedCategory && !searchQuery && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-x-3 gap-y-12 pt-8 sm:gap-x-4 sm:gap-y-14">
                {mainCategories.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.08 }}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`flex flex-col items-center text-center p-4 sm:p-5 rounded-[9px] shadow-md transition-all active:scale-[0.98] group ${cat.themeGradient}`}
                  >
                    <div className="relative h-28 sm:h-32 w-full flex items-end justify-center overflow-visible mb-4">
                      <div className="absolute bottom-0 h-20 w-40 rounded-t-full bg-white/90 shadow-sm" />
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="relative z-30 max-h-[145px] max-w-[112%] object-contain drop-shadow-md transition-transform duration-300 -translate-y-5 group-hover:-translate-y-6 group-hover:scale-105"
                      />
                    </div>

                    <span className="text-sm sm:text-base font-black text-white leading-tight">
                      {cat.name}
                    </span>

                    <span className="text-xs font-semibold text-white/80 mt-1">
                      {cat.subLabel}
                    </span>

                    <div className="w-full border-t border-white/20 mt-3 pt-2.5">
                      <p className="text-center font-black uppercase text-sm sm:text-base tracking-widest text-white">
                        {cat.bottomLabel}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Mobile VIEW 2: List of Courses Inside Category or Search */}
          {(selectedCategory || searchQuery) && (
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {searchQuery ? `${displayedLevels.length} Results Found` : 'Available Courses'}
                </h2>
                {selectedCategory && !searchQuery && (
                  <button
                    onClick={() => {
                      setSelectedLevelId(null);
                      setSearchParams({});
                    }}
                    className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    Change Level
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {displayedLevels.map((lvl) => {
                  const isSelected = selectedLevelId === lvl.id;

                  return (
                    <div
                      key={lvl.id}
                      onClick={() => setSelectedLevelId(lvl.id)}
                      onDoubleClick={() => handleOpenLevel(lvl.name)}
                      className={`relative overflow-hidden p-4 rounded-[9px] border transition-all cursor-pointer shadow-md bg-slate-950 text-white ${
                        isSelected
                          ? 'ring-2 ring-purple-500 border-purple-500'
                          : 'border-slate-800'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${lvl.bgGradient} z-0`} />

                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-14 w-14 rounded-[9px] bg-white/10 backdrop-blur-md p-1.5 flex items-center justify-center shrink-0">
                            <img src={lvl.image} alt={lvl.name} className="max-h-full max-w-full object-contain drop-shadow" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-black text-white truncate">
                                {lvl.name}
                              </h3>
                              <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-[4px]">
                                {lvl.ribbonText}
                              </span>
                            </div>
                            <p className="text-xs text-slate-300 truncate mt-0.5">
                              {lvl.subjects.length} subjects • {lvl.category}
                            </p>
                          </div>
                        </div>

                        <div className="ml-3 shrink-0">
                          {isSelected ? (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white shadow-sm">
                              <Check size={14} strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="h-6 w-6 rounded-full border-2 border-white/40" />
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {displayedLevels.length === 0 && (
                  <div className="p-8 text-center rounded-[9px] border border-dashed border-slate-200 dark:border-white/10 bg-white dark:bg-[#121216]">
                    <p className="text-sm font-bold text-slate-400">No matching courses found</p>
                    <p className="text-xs text-slate-500 mt-1">Try searching for a different keyword.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM CINEMATIC CTA BANNER (Inspired by Magnific Sci-Fi Series Banner)   */}
        {/* ========================================================================= */}
        <div className="mt-14 relative w-full rounded-[9px] overflow-hidden p-8 sm:p-12 bg-slate-950 text-white shadow-xl border border-slate-800">
          {/* Background image if provided */}
          <div
            className="absolute inset-0 bg-cover bg-right sm:bg-center mix-blend-luminosity opacity-40"
            style={{ backgroundImage: `url('/images/banners/courses-bottom-banner.jpg')` }}
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-0" />

          <div className="relative z-10 max-w-xl">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1.5 inline-block">
              ExamSidemann Pro
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Create your own <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400">success story.</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              The next high distinction could be yours. Take your exam preparation as far as it can go with comprehensive past paper solutions, virtual laboratories, and AI tutors.
            </p>
            <button
              onClick={() => {
                if (onNavigate) onNavigate('login');
                else navigate('/login');
              }}
              className="mt-6 px-6 py-3 bg-white text-slate-950 font-black rounded-[8px] text-xs sm:text-sm uppercase tracking-wider hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>Start now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Floating Bottom Continue Button */}
      {(selectedCategory || searchQuery) && displayedLevels.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-[#070709]/90 backdrop-blur-lg py-4 px-4">
          <div className="mx-auto max-w-lg">
            <button
              onClick={handleContinue}
              className="w-full py-3.5 sm:py-4 px-6 rounded-[9px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.99] text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all"
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
