import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Search, ArrowRight, ChevronRight, Sparkles, FileText, FlaskConical, Brain, BookOpen, Video } from 'lucide-react';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { COURSE_ARTWORK, courseArtwork } from './courseArtwork';
import './courseCards.css';

interface CoursesOverviewProps {
  onNavigate?: (page: string, params?: any) => void;
}

const mainCategories = [
  { id: 'ZJC', name: 'Junior Certificate', subLabel: 'Forms 1 & 2', tag: 'ZJC', image: COURSE_ARTWORK.junior, description: 'Build your secondary school foundations.' },
  { id: "O' Level", name: 'Ordinary Level', subLabel: 'Forms 3 & 4', tag: 'O Level', image: COURSE_ARTWORK.ordinary, description: 'Choose your form and explore your subjects.' },
  { id: "A' Level", name: 'Advanced Level', subLabel: 'Lower & Upper 6', tag: 'A Level', image: COURSE_ARTWORK.advanced, description: 'Explore your advanced-level subjects.' },
  { id: 'Polytechnic', name: 'Technical Courses', subLabel: 'National Certificate & Diploma', tag: 'HEXCO', image: COURSE_ARTWORK.it, description: 'Choose your qualification and career pathway.' },
];

const suggestedActions = [
  { label: 'Past Papers', icon: FileText, route: 'past-papers' },
  { label: 'Practicals', icon: FlaskConical, route: 'practicals' },
  { label: 'Train Your Mind', icon: Brain, route: 'iq-trainer' },
  { label: 'Find Text Books', icon: BookOpen, route: 'library' },
  { label: 'Watch Tutorials', icon: Video, route: 'tutorials' },
  { label: 'Study With AI', icon: Sparkles, route: 'chat' },
];

const CardContents = ({ title, subtitle, image, badge, action }: {
  title: string; subtitle: string; image: string; badge: string; action: string;
}) => <>
  <span className="course-card-art">
    <img src={image} alt="" loading="lazy" decoding="async" width="1536" height="1024" />
  </span>
  <span className="course-card-copy">
    <span className="course-card-badge">{badge}</span>
    <span className="course-card-title">{title}</span>
    <span className="course-card-subtitle">{subtitle}</span>
    <span className="course-card-action">{action}<ChevronRight size={18} aria-hidden="true" /></span>
  </span>
</>;

export const CoursesOverview: React.FC<CoursesOverviewProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  // The URL owns the category so browser Back and direct links stay in sync.
  const selectedCategory = searchParams.get('category');
  const [searchQuery, setSearchQuery] = useState('');
  const activeCategoryMeta = mainCategories.find(category => category.id === selectedCategory);
  const displayedLevels = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) return CURRICULUM_REGISTRY.filter(level =>
      level.name.toLowerCase().includes(query) || level.category.toLowerCase().includes(query) ||
      level.id.toLowerCase().includes(query) || level.subjects.some(subject => subject.name.toLowerCase().includes(query)));
    return CURRICULUM_REGISTRY.filter(level => level.category === selectedCategory);
  }, [searchQuery, selectedCategory]);
  const showingLevels = Boolean(selectedCategory || searchQuery.trim());
  const handleCategorySelect = (id: string) => {
    setSearchQuery('');
    setSearchParams({ category: id });
  };
  const showCategories = () => { setSearchQuery(''); setSearchParams({}); };
  const handleBack = () => {
    if (searchQuery) { setSearchQuery(''); return; }
    if (selectedCategory) { showCategories(); return; }
    if (onNavigate) onNavigate('home'); else navigate('/');
  };
  const handleSuggestedAction = (route: string) => {
    if (onNavigate) onNavigate(route); else navigate(`/${route}`);
  };

  return (
    <div className="min-h-screen bg-[#fafafc] pb-16 text-slate-900 dark:bg-[#070709] dark:text-white">
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
      <div className="mx-auto w-full max-w-[1600px] px-4 pt-7 sm:px-6 sm:pt-10 lg:px-[60px]">
        {showingLevels ? <>
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-black leading-tight sm:text-2xl">{searchQuery.trim() ? 'Search results' : activeCategoryMeta?.name || 'Courses'}</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{searchQuery.trim() ? `${displayedLevels.length} matching courses` : activeCategoryMeta?.description}</p>
            </div>
            <button type="button" onClick={showCategories} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-600 dark:border-white/20 dark:bg-white/5 dark:text-purple-300">
              All levels
            </button>
          </div>
          {!searchQuery.trim() && <nav aria-label="Course categories" className="mb-6 flex flex-wrap gap-2">
            {mainCategories.map(category => <button key={category.id} type="button" onClick={() => handleCategorySelect(category.id)} aria-pressed={selectedCategory === category.id}
              className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 ${selectedCategory === category.id ? 'border-purple-700 bg-purple-700 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-purple-400 dark:border-white/15 dark:bg-white/5 dark:text-slate-300'}`}>
              {category.name}
            </button>)}
          </nav>}
          <div className="course-card-grid" aria-label="Available courses">
            {displayedLevels.map(level => <Link key={level.id} data-course-id={level.id} className="course-card" to={`/courses/detail/${encodeURIComponent(level.name)}`}
              aria-label={`Open ${level.name}`}
              onClick={event => {
                if (onNavigate && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
                  event.preventDefault();
                  onNavigate('courses/detail', { id: level.name });
                }
              }}>
              <CardContents title={level.name} subtitle={`${level.subjects.length} subjects`} image={courseArtwork(level)}
                badge={level.category === 'Polytechnic' ? `HEXCO · ${level.name.startsWith('ND ') ? 'National Diploma' : 'National Certificate'}` : `ZIMSEC · ${mainCategories.find(category => category.id === level.category)?.tag}`}
                action="View subjects" />
            </Link>)}
          </div>
          {displayedLevels.length === 0 && <div role="status" className="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-white/20">
            <p className="font-bold">No matching courses found</p>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try a different subject, form or course name.</p>
          </div>}
        </> : <>
          <div className="mb-6">
            <h2 className="text-xl font-black sm:text-2xl">Find your level</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">From your first school subjects to your future career.</p>
          </div>
          <div className="course-card-grid course-category-grid" aria-label="Learning levels">
            {mainCategories.map(category => <button type="button" key={category.id} className="course-card" onClick={() => handleCategorySelect(category.id)} aria-label={`Explore ${category.name}`}>
              <CardContents title={category.name} subtitle={category.subLabel} image={category.image} badge={category.tag} action="Explore courses" />
            </button>)}
          </div>
        </>}

        {!searchQuery.trim() && <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {suggestedActions.map(action => {
            const Icon = action.icon;
            return <button key={action.route} type="button" onClick={() => handleSuggestedAction(action.route)} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left text-sm font-bold transition-colors hover:border-purple-300 dark:border-white/10 dark:bg-white/5">
              <Icon size={20} aria-hidden="true" className="shrink-0 text-purple-600 dark:text-purple-400" />{action.label}
            </button>;
          })}
        </div>}
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
    </div>
  );
};
