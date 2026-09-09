
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, X, BookOpen, BookCheck, ArrowLeft, Layers, Code, Calculator, Languages, Atom, Sprout, Network, Database, PenTool } from 'lucide-react';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { hasCourseSubjectContent } from './courseContentAvailability';
import { getLearningOutcomePath } from '../../utils/learningOutcomeSeo';

interface CoursePageProps {
  courseName?: string; 
  onNavigateHome: () => void;
  onLoginRequest: () => void;
}

const DynamicModuleViewer = React.lazy(() =>
  import('./DynamicModuleViewer').then((module) => ({
    default: module.DynamicModuleViewer,
  })),
);

class DynamicModuleViewerErrorBoundary extends React.Component<
  { children: React.ReactNode; onClose: () => void; resetKey: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: { resetKey: string }) {
    if (previousProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 text-center dark:bg-[#050505]">
        <div className="max-w-md rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#0d0d0d]">
          <h2 className="mb-3 text-2xl font-black text-gray-950 dark:text-white">
            Lesson could not load
          </h2>
          <p className="mb-6 text-sm font-semibold text-gray-500 dark:text-gray-400">
            The lesson bundle failed to load. Go back and open it again.
          </p>
          <button
            onClick={this.props.onClose}
            className="rounded-xl bg-[#ff7400] px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition hover:bg-[#e56700]"
          >
            Back to subjects
          </button>
        </div>
      </div>
    );
  }
}

const ModuleViewerLoader: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-white dark:bg-[#050505]">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#ff7400] border-t-transparent" />
      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">
        Loading lesson
      </p>
    </div>
  </div>
);

const normalizeCourseKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/technology/g, 'tech')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const subjectCardAccents = [
  {
    card: 'from-sky-300 via-sky-500 to-sky-800 border-sky-200/80 shadow-sky-500/45',
    chip: 'bg-sky-950/35 text-white',
    icon: 'text-sky-100',
    button: 'bg-sky-100 text-sky-950 hover:bg-white',
    Icon: Calculator,
  },
  {
    card: 'from-emerald-300 via-emerald-500 to-emerald-800 border-emerald-200/80 shadow-emerald-500/45',
    chip: 'bg-emerald-950/35 text-white',
    icon: 'text-emerald-100',
    button: 'bg-emerald-100 text-emerald-950 hover:bg-white',
    Icon: Languages,
  },
  {
    card: 'from-amber-300 via-amber-500 to-amber-800 border-amber-200/80 shadow-amber-500/45',
    chip: 'bg-amber-950/35 text-white',
    icon: 'text-amber-100',
    button: 'bg-amber-100 text-amber-950 hover:bg-white',
    Icon: PenTool,
  },
  {
    card: 'from-violet-300 via-violet-500 to-violet-800 border-violet-200/80 shadow-violet-500/45',
    chip: 'bg-violet-950/35 text-white',
    icon: 'text-violet-100',
    button: 'bg-violet-100 text-violet-950 hover:bg-white',
    Icon: BookOpen,
  },
  {
    card: 'from-rose-300 via-rose-500 to-rose-800 border-rose-200/80 shadow-rose-500/45',
    chip: 'bg-rose-950/35 text-white',
    icon: 'text-rose-100',
    button: 'bg-rose-100 text-rose-950 hover:bg-white',
    Icon: Atom,
  },
  {
    card: 'from-green-300 via-green-500 to-green-800 border-green-200/80 shadow-green-500/45',
    chip: 'bg-green-950/35 text-white',
    icon: 'text-green-100',
    button: 'bg-green-100 text-green-950 hover:bg-white',
    Icon: Sprout,
  },
  {
    card: 'from-indigo-300 via-indigo-500 to-indigo-800 border-indigo-200/80 shadow-indigo-500/45',
    chip: 'bg-indigo-950/35 text-white',
    icon: 'text-indigo-100',
    button: 'bg-indigo-100 text-indigo-950 hover:bg-white',
    Icon: Network,
  },
  {
    card: 'from-slate-300 via-slate-500 to-slate-800 border-slate-200/80 shadow-slate-500/45',
    chip: 'bg-slate-950/35 text-white',
    icon: 'text-slate-100',
    button: 'bg-slate-100 text-slate-950 hover:bg-white',
    Icon: Database,
  },
];

export const CoursePage: React.FC<CoursePageProps> = ({ 
  courseName: propName, 
  onNavigateHome,
  onLoginRequest
}) => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const effectiveName = id ? decodeURIComponent(id).replace(/[-_]/g, ' ') : propName || '';
  
  const levelData = CURRICULUM_REGISTRY.find(c => {
    const registryName = normalizeCourseKey(c.name);
    const registryId = normalizeCourseKey(c.id);
    const targetName = normalizeCourseKey(effectiveName);
    
    return registryName === targetName || 
           registryId === targetName ||
           registryName.includes(targetName) ||
           targetName.includes(registryName);
  });

  const subjects = levelData?.subjects || [];
  const isPoly = levelData?.category === 'Polytechnic';
  const polyDeptParam = useMemo(() => {
    if (!isPoly) return null;
    const name = levelData?.name || effectiveName;
    if (name.includes('Information Technology')) return 'Information Tech';
    if (name.includes('Auto Electrics')) return 'Auto Electrics';
    if (name.includes('Records')) return 'Records';
    if (name.includes('Purchasing')) return 'Purchasing';
    if (name.includes('Banking')) return 'Banking';
    return null;
  }, [effectiveName, isPoly, levelData?.name]);
  const backToCoursesPath = '/courses/';

  // --- Deep-linking Scroll Effect ---
  useEffect(() => {
    const targetSub = searchParams.get('subject');
    if (targetSub && subjects.length > 0) {
      setTimeout(() => {
        const element = document.getElementById(`subject-${targetSub.replace(/\s+/g, '-').toLowerCase()}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-reached');
          setTimeout(() => {
            element.classList.remove('highlight-reached');
          }, 4000);
        }
      }, 500);
    }
  }, [searchParams, subjects]);

  const filteredSubjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    const currentLevelName = levelData?.name || effectiveName;
    const currentCategory = levelData?.category;

    const baseList = normalizedQuery
      ? subjects.filter(s => s.name.toLowerCase().includes(normalizedQuery))
      : [...subjects];

    return baseList.sort((a, b) => {
      const aHas = hasCourseSubjectContent(currentLevelName, a.name, currentCategory);
      const bHas = hasCourseSubjectContent(currentLevelName, b.name, currentCategory);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    });
  }, [searchQuery, subjects, levelData?.name, levelData?.category, effectiveName]);

  return (
    <>
      <div className="min-h-screen bg-[#fcfcfc] pb-24 text-left font-sans text-gray-900 dark:bg-[#050505] dark:text-white">
        {/* Hero Section */}
        <div className="relative min-h-[300px] w-full overflow-hidden border-b border-white/10 bg-[#07132d] pb-12 md:min-h-[390px]">
        <img
            src="https://i.ibb.co/rfvwxmGn/es-heroo.jpg"
            alt=""
            aria-hidden="true"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070d24]/75 via-[#120d38]/70 to-[#241044]/90" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent to-[#fcfcfc] dark:to-[#050505]" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pt-10 text-center md:pt-14">
            <button 
                onClick={() => navigate(backToCoursesPath)}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-white/70 transition-colors hover:text-white md:px-4 md:py-2 md:text-[10px]"
            >
                <ArrowLeft size={14} className="md:w-[16px] md:h-[16px]" /> Back to Courses
            </button>
            <div className="flex justify-center mb-4">
                <span className={`px-3 py-1 md:px-4 md:py-1.5 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] shadow-lg rounded-full ${isPoly ? 'bg-premium text-black' : 'bg-white/15 text-white border border-white/15'}`}>
                    {levelData?.category || 'Registry'} 
                </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black text-white tracking-tight leading-[0.92] mb-4 drop-shadow-[0_0_28px_rgba(120,160,255,0.55)]">
              {levelData?.name || effectiveName}
            </h1>
            
            {(levelData?.name?.toLowerCase().includes('national certificate') || levelData?.name?.toLowerCase().includes('national diploma') || levelData?.name?.toLowerCase().includes('nc') || levelData?.name?.toLowerCase().includes('nd')) && levelData?.name?.toLowerCase().includes('information technology') && (
              <div className="mb-6">
                <button
                  onClick={() => {
                    if (levelData?.name?.toLowerCase().includes('national certificate') || levelData?.name?.toLowerCase().includes('nc')) {
                      navigate('/practicals/polytechnic/it');
                    } else {
                      navigate('/practicals/polytechnic/it');
                    }
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-blue-500/50"
                >
                  <Code size={16} />
                  View Practical Labs
                </button>
              </div>
            )}

            <p className="text-blue-100/75 max-w-2xl mx-auto text-xs md:text-sm font-bold uppercase tracking-[0.18em] md:tracking-[0.28em] opacity-90 mb-2">
                Choose from notes, practice, papers and AI-supported lessons
            </p>
        </div>

      </div>

      <div className="px-3 sm:px-6 md:px-[30px] -mt-8 md:-mt-12 relative z-20">
         {/* Search Filter Bar */}
         <div className="bg-white dark:bg-[#0d0d0d] p-3.5 sm:p-4 md:p-6 shadow-2xl border border-gray-200 dark:border-white/10 flex flex-col md:flex-row gap-3 md:gap-6 items-center rounded-[9px]">
            <div className="relative flex-1 w-full group">
                <Search className={`absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 transition-colors ${isPoly ? 'text-premium/50 group-focus-within:text-premium' : 'text-gray-400 group-focus-within:text-[#003153]'}`} size={16} />
                <input 
                    className={`w-full pl-10 sm:pl-11 pr-4 py-2.5 sm:py-3 md:py-4 border rounded-[9px] text-xs sm:text-sm font-bold outline-none transition-all ${isPoly ? 'bg-[#1a1a1a] border-white/5 text-white' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-100 dark:border-white/5 text-gray-900 dark:text-white'}`}
                    placeholder="Quick search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
            <div className={`hidden md:flex items-center gap-4 px-6 py-4 border text-xs font-black uppercase tracking-widest rounded-[9px] ${isPoly ? 'bg-[#1a1a1a] border-white/5 text-premium' : 'bg-gray-50 dark:bg-[#1a1a1a] border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400'}`}>
                <BookCheck size={18} />
                <span>{filteredSubjects.length} Lessons Found</span>
            </div>
         </div>

         <div className="mt-6 sm:mt-8 md:mt-16 relative">
            {filteredSubjects.length > 0 ? (
                <div className="relative grid grid-cols-2 gap-2.5 sm:gap-6 md:grid-cols-2 md:gap-8 xl:grid-cols-4">
                    {filteredSubjects.map((sub, idx) => {
                        const accent = subjectCardAccents[idx % subjectCardAccents.length];
                        const SubjectIcon = accent.Icon;
                        const hasContent = hasCourseSubjectContent(levelData?.name || effectiveName, sub.name, levelData?.category);
                        const chipClass = hasContent ? accent.chip : 'bg-gray-950/35 text-white';
                        const iconClass = hasContent ? accent.icon : 'text-gray-100';
                        const buttonClass = hasContent ? accent.button : 'bg-gray-100 text-gray-800 hover:bg-white';
                        const openSubject = (e?: React.MouseEvent) => {
                          e?.stopPropagation();
                          if (hasContent && levelData) {
                            navigate(
                              getLearningOutcomePath(levelData, sub, 1),
                            );
                            return;
                          }
                          setSelectedSubject(sub.name);
                        };

                        return (
                        <div
                            key={sub.name}
                            id={`subject-${sub.name.replace(/\s+/g, '-').toLowerCase()}`}
                            onClick={openSubject}
                            className={`group relative min-h-[170px] cursor-pointer overflow-hidden rounded-[9px] border bg-gradient-to-br p-3.5 text-left shadow-md transition-all hover:scale-[1.01] sm:min-h-[190px] sm:p-5 md:p-6 ${hasContent ? accent.card : 'from-gray-200 via-gray-400 to-gray-700 border-gray-200/80 opacity-70'}`}
                        >
                            <div className="pointer-events-none absolute -right-8 top-1/2 h-28 w-28 sm:h-36 sm:w-36 -translate-y-1/2 rounded-full bg-white/12"></div>
                            <SubjectIcon className={`pointer-events-none absolute right-2 top-1/2 h-14 w-14 -translate-y-1/2 opacity-50 sm:right-6 sm:h-18 sm:w-18 md:right-8 md:h-20 md:w-20 ${iconClass}`} strokeWidth={1.5} />

                            <div className="relative z-10 mb-2 sm:mb-3 flex items-start justify-between gap-2 sm:gap-4">
                                <span className="rounded-[9px] bg-black/25 px-2 py-1 text-[9px] font-black text-white sm:px-3 sm:py-1.5 sm:text-[10px]">
                                    {hasContent ? '2026' : 'Upcoming'}
                                </span>
                                <button
                                    onClick={openSubject}
                                    className={`rounded-[9px] p-1.5 opacity-90 shadow-sm sm:p-2 ${buttonClass}`}
                                    aria-label={`Open ${sub.name}`}
                                >
                                    <Layers size={13} className="sm:w-[15px] sm:h-[15px]" />
                                </button>
                            </div>

                            <div className="relative z-10 pr-6 sm:pr-20">
                                <h3 className="mb-1.5 text-sm font-black leading-tight tracking-tight text-white sm:mb-3 sm:text-lg md:text-xl">
                                    {sub.name}
                                </h3>
                                <div className="flex flex-wrap gap-1 sm:gap-2">
                                    <span className={`rounded-[6px] px-1.5 py-0.5 text-[8px] font-black sm:px-3 sm:py-1.5 sm:text-[10px] ${chipClass}`}>
                                        {hasContent ? `${sub.outcomeCount} topics` : 'Soon'}
                                    </span>
                                    <span className={`rounded-[6px] px-1.5 py-0.5 text-[8px] font-black sm:px-3 sm:py-1.5 sm:text-[10px] ${chipClass}`}>
                                        {isPoly ? 'HEXCO' : 'ZIMSEC'}
                                    </span>
                                </div>
                            </div>

                            <div className="relative z-10 mt-3 sm:mt-5 flex items-end justify-between gap-2 sm:gap-4">
                                <div className="min-w-0">
                                    <p className="text-xs font-black text-white sm:text-base">
                                        {sub.outcomeCount} lessons
                                    </p>
                                    <p className="text-[9px] sm:text-xs font-semibold text-white/70 truncate max-w-[80px] sm:max-w-none">
                                        {levelData?.name || effectiveName}
                                    </p>
                                </div>
                                <button
                                    onClick={openSubject}
                                    className={`shrink-0 rounded-[9px] px-2.5 py-1.5 text-[9px] font-black shadow-sm sm:px-4 sm:py-3 sm:text-[10px] ${buttonClass}`}
                                >
                                    {hasContent ? 'Open' : 'Preview'}
                                </button>
                            </div>
                        </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-20 md:py-40 text-center bg-white dark:bg-[#0d0d0d] border-4 border-dashed border-gray-100 dark:border-white/5 opacity-40 rounded-[9px]">
                    <X size={48} className="mx-auto text-gray-200 md:w-[64px] md:h-[64px] mb-6" />
                    <h3 className="text-lg md:text-xl font-black uppercase tracking-widest text-gray-900 dark:text-white">Nothing Found</h3>
                    <p className="text-[10px] md:text-xs font-bold uppercase mt-2">Adjust your keywords to find {effectiveName} lessons.</p>
                </div>
            )}
         </div>
      </div>
    </div>
    
      {selectedSubject && (
            <div className="fixed inset-0 z-[150] bg-white dark:bg-[#050505]">
                <DynamicModuleViewerErrorBoundary
                  onClose={() => setSelectedSubject(null)}
                  resetKey={selectedSubject}
                >
                  <React.Suspense fallback={<ModuleViewerLoader />}>
                    <DynamicModuleViewer 
                      level={levelData?.name || effectiveName}
                      subject={selectedSubject}
                      onBack={() => setSelectedSubject(null)}
                      onLoginRequest={onLoginRequest}
                    />
                  </React.Suspense>
                </DynamicModuleViewerErrorBoundary>
            </div>
      )}
    </>
  );
};
