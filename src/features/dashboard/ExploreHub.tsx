import React, { useState, useMemo } from 'react';
import {
  Search, BookOpen, BrainCircuit, Compass, Terminal, FileText, Video,
  Cpu, Wrench, ArrowRight, Check, Plus, Code2,
  Database, Layers, Award, GraduationCap, ChevronRight
} from 'lucide-react';
import clsx from 'clsx';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { hasCourseSubjectContent } from '../courses/courseContentAvailability';
import { recordStudentAction } from '../../services/personalizationEngine';
import { ThreeStarAiIcon } from '../../components/icons/ThreeStarAiIcon';

interface ExploreHubProps {
  enrolledSubjects: string[];
  onToggleEnroll: (subject: string) => void;
  onNavigate: (page: string, params?: any) => void;
}

export const ExploreHub: React.FC<ExploreHubProps> = ({
  enrolledSubjects,
  onToggleEnroll,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'subjects' | 'ai_tools' | 'practicals' | 'careers'>('all');

  const ALL_SUBJECTS = useMemo(() => {
    return CURRICULUM_REGISTRY.flatMap((lvl) =>
      lvl.subjects.map((sub) => ({
        name: sub.name,
        description: sub.description,
        level: lvl.name,
        levelId: lvl.id,
      }))
    );
  }, []);

  const AI_TOOLS = [
    {
      id: 'math-solver',
      title: 'AI Math & Science Solver',
      desc: 'Step-by-step solutions for equations, calculus, kinematics, and chemistry formulas.',
      badge: 'AI Lab',
      route: 'chat',
      color: 'from-rose-500/10 to-orange-500/10 border-rose-500/20 text-[#ff6b7a]',
      icon: ThreeStarAiIcon,
    },
    {
      id: 'career-navigator',
      title: 'AI Career Navigator',
      desc: 'Connect your subject strengths and passions to universities, polytechnics, and industries.',
      badge: 'Guidance',
      route: 'chat',
      params: { initialPrompt: 'I want career guidance based on my subject combination in Zimbabwe.' },
      color: 'from-cyan-500/10 to-blue-500/10 border-cyan-500/20 text-cyan-400',
      icon: Compass,
    },
    {
      id: 'code-agent',
      title: 'Code Agent Workspace',
      desc: 'Interactive full-stack development sandbox with AI auto-coding and live container preview.',
      badge: 'Pro Dev',
      route: 'code-agent',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400',
      icon: Terminal,
    },
    {
      id: 'iq-trainer',
      title: 'IQ & Pattern Logic Trainer',
      desc: 'Sharpen your spatial reasoning, Raven matrices, logic puzzles, and numerical sequences.',
      badge: 'Daily Brain',
      route: 'iq-trainer',
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400',
      icon: BrainCircuit,
    },
  ];

  const PRACTICAL_STUDIOS = [
    {
      id: 'technical-drawing',
      title: 'Technical Drawing 3D Studio',
      desc: 'Interactive CAD viewport, isometric projections, orthographic views, and sectioning.',
      category: 'HEXCO / Polytechnic',
      route: 'technical-drawing-studio',
      icon: Layers,
      careerTag: 'Civil & Mechanical Engineering',
    },
    {
      id: 'fabrication-drawing',
      title: 'Fabrication Engineering Studio',
      desc: 'Sheet metal development, triangulation, welding joints, and workshop engineering.',
      category: 'HEXCO / Polytechnic',
      route: 'fabrication-studio',
      icon: Wrench,
      careerTag: 'Manufacturing & Metallurgy',
    },
    {
      id: 'sql-practice',
      title: 'Interactive SQL Database Lab',
      desc: 'Live relational SQL queries, table schemas, joins, indexing, and SQLite in-browser.',
      category: 'Computer Science',
      route: 'sql-practice',
      icon: Database,
      careerTag: 'Data Science & Software',
    },
    {
      id: 'webdev-ide',
      title: 'Web Development IDE Studio',
      desc: 'Live HTML, CSS, JavaScript editor with instant split-pane preview and syntax highlighting.',
      category: 'Web Tech',
      route: 'webdev-practice',
      icon: Code2,
      careerTag: 'Frontend Engineering',
    },
  ];

  const CAREER_TRACKS = [
    {
      title: 'Software & Cloud Engineering',
      desc: 'Build scalable mobile, web and cloud systems powering fintech and global platforms.',
      subjects: ['Computer Science', 'Mathematics', 'Physics'],
      color: 'border-cyan-500/30 bg-cyan-500/[0.04]',
      icon: Cpu,
    },
    {
      title: 'Civil & Structural Engineering',
      desc: 'Design bridges, high-rise buildings, dams, and infrastructure across Africa.',
      subjects: ['Technical Drawing', 'Physics', 'Pure Mathematics'],
      color: 'border-amber-500/30 bg-amber-500/[0.04]',
      icon: Layers,
    },
    {
      title: 'Medicine & Health Sciences',
      desc: 'Pioneer medical research, clinical diagnosis, pharmacy, and healthcare technology.',
      subjects: ['Biology', 'Chemistry', 'Mathematics / Physics'],
      color: 'border-emerald-500/30 bg-emerald-500/[0.04]',
      icon: GraduationCap,
    },
    {
      title: 'Finance & Actuarial Science',
      desc: 'Financial modeling, stock exchange risk analysis, accounting, and banking systems.',
      subjects: ['Commercials', 'Accounts', 'Statistics & Pure Maths'],
      color: 'border-purple-500/30 bg-purple-500/[0.04]',
      icon: Award,
    },
  ];

  const filteredSubjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const baseList = q
      ? ALL_SUBJECTS.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q))
      : ALL_SUBJECTS;

    return [...baseList].sort((a, b) => {
      const aHas = hasCourseSubjectContent(a.level, a.name);
      const bHas = hasCourseSubjectContent(b.level, b.name);
      if (aHas && !bHas) return -1;
      if (!aHas && bHas) return 1;
      return 0;
    });
  }, [ALL_SUBJECTS, searchQuery]);

  return (
    <div className="mx-auto max-w-6xl space-y-7 pb-12">
      {/* Search Omnibar & Hero */}
      <section className="rounded-3xl border-2 border-slate-200 border-b-4 bg-white p-5 shadow-sm sm:p-7 dark:border-white/[0.1] dark:bg-[#12141c]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Compass size={22} className="text-[#ef2b3f]" /> Explore Everything
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-gray-300">
              Browse subjects, AI labs, interactive practicals, past papers, and career discovery pathways.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('past-papers')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-black text-slate-700 dark:text-gray-200 transition-colors flex items-center gap-1.5"
            >
              <FileText size={14} className="text-amber-500" /> Past Papers Vault
            </button>
            <button
              onClick={() => onNavigate('tutorials')}
              className="px-3.5 py-2 rounded-xl bg-[#ef2b3f] hover:bg-[#d82235] text-xs font-black text-white transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Video size={14} /> Video Library
            </button>
          </div>
        </div>

        {/* Search Omnibar */}
        <div className="relative mt-5 flex items-center rounded-2xl border-2 border-b-4 border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#ef2b3f] dark:border-white/10 dark:bg-[#1a1d26]">
          <Search size={16} className="text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search subjects, practical tools, past papers, career topics..."
            className="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-gray-100 placeholder:text-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
          {[
            { id: 'all', label: 'All Catalog', icon: Compass },
            { id: 'subjects', label: 'Subjects', icon: BookOpen },
            { id: 'ai_tools', label: 'AI Labs', icon: BrainCircuit },
            { id: 'practicals', label: 'Practicals & CAD', icon: Wrench },
            { id: 'careers', label: 'Career Pathways', icon: GraduationCap },
          ].map((cat) => {
            const CategoryIcon = cat.icon;
            return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={clsx(
                'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-xl border-2 border-b-4 px-3 py-2 text-xs font-black transition-all active:translate-y-0.5 active:border-b-2',
                activeCategory === cat.id
                  ? 'border-emerald-700 bg-emerald-600 text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-white'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.05] dark:text-gray-300 dark:hover:bg-white/10'
              )}
            >
              <CategoryIcon size={14} /> {cat.label}
            </button>
          );})}
        </div>
      </section>

      {/* AI Learning Labs Section */}
      {(activeCategory === 'all' || activeCategory === 'ai_tools') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <ThreeStarAiIcon size={16} className="text-[#ef2b3f]" /> AI Learning Labs & Intelligent Assistants
            </h2>
            <span className="text-[11px] font-bold text-slate-400">Available 24/7</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {AI_TOOLS.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    recordStudentAction.logCareerInterest(tool.title);
                    onNavigate(tool.route, tool.params);
                  }}
                  className={clsx(
                    'cursor-pointer rounded-3xl border-2 border-b-4 bg-gradient-to-br p-5 shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 sm:p-6',
                    tool.color,
                    'bg-white dark:bg-[#151821]'
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-white/40 dark:bg-white/10 text-[9px] font-black uppercase tracking-wider">
                      {tool.badge}
                    </span>
                    <Icon size={18} />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {tool.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-gray-300 line-clamp-2">
                    {tool.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-1 text-[11px] font-black text-[#ef2b3f] dark:text-rose-400">
                    <span>Launch AI Lab</span> <ArrowRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Practical Studios & Simulators */}
      {(activeCategory === 'all' || activeCategory === 'practicals') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench size={15} className="text-amber-500" /> Interactive Practical Labs & 3D CAD Studios
            </h2>
            <span className="text-[11px] font-bold text-slate-400">Hands-on Practice</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {PRACTICAL_STUDIOS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    recordStudentAction.logCareerInterest(item.careerTag);
                    onNavigate(item.route);
                  }}
                  className="group cursor-pointer rounded-3xl border-2 border-b-4 border-slate-200 bg-white p-5 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-amber-400 active:translate-y-0.5 active:border-b-2 sm:p-6 dark:border-white/[0.1] dark:bg-[#151821]"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-[9px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                      {item.category}
                    </span>
                    <Icon size={17} className="text-amber-500" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-gray-300 line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-400">{item.careerTag}</span>
                    <span className="font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      Open Studio <ChevronRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Career Pathways Discovery */}
      {(activeCategory === 'all' || activeCategory === 'careers') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <GraduationCap size={16} className="text-cyan-500" /> Career Pathways & University Connections
            </h2>
            <span className="text-[11px] font-bold text-slate-400">Discover Opportunities</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {CAREER_TRACKS.map((career, idx) => {
              const CareerIcon = career.icon;
              return (
              <div
                key={idx}
                onClick={() => {
                  recordStudentAction.logCareerInterest(career.title);
                  onNavigate('chat', {
                    initialPrompt: `Tell me how to prepare for a career in ${career.title} in Zimbabwe, including required A-Level subjects, top university programs, and practical skills.`,
                  });
                }}
                className={clsx(
                  'cursor-pointer rounded-3xl border-2 border-b-4 p-5 shadow-sm transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:border-b-2 sm:p-6',
                  career.color,
                  'bg-white dark:bg-[#151821]'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">
                    {career.title}
                  </h3>
                  <CareerIcon size={18} className="text-cyan-600" />
                </div>
                <p className="text-xs text-slate-600 dark:text-gray-300 mt-1">
                  {career.desc}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {career.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/10 text-[9px] font-bold text-slate-700 dark:text-gray-300"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            );})}
          </div>
        </section>
      )}

      {/* Subjects & Syllabi Browser */}
      {(activeCategory === 'all' || activeCategory === 'subjects') && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen size={16} className="text-[#ef2b3f]" /> Full Academic Curriculum & Subjects
            </h2>
            <span className="text-[11px] font-bold text-slate-400">
              {filteredSubjects.length} subjects found
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredSubjects.map((sub, idx) => {
              const isEnrolled = enrolledSubjects.includes(sub.name);
              return (
                <div
                  key={idx}
                  className="flex flex-col justify-between gap-3 rounded-2xl border-2 border-b-4 border-slate-200 bg-white p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-[#ef2b3f]/40 dark:border-white/[0.1] dark:bg-[#151821]"
                >
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {sub.level}
                      </span>
                      <button
                        onClick={() => onToggleEnroll(sub.name)}
                        className={clsx(
                          'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[9px] font-black uppercase transition-all',
                          isEnrolled
                            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                            : 'bg-slate-100 dark:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        )}
                      >
                        {isEnrolled ? <><Check size={11} /> Enrolled</> : <><Plus size={11} /> Add</>}
                      </button>
                    </div>

                    <h3 className="mt-1 text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                      {sub.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-gray-400 line-clamp-2 leading-tight">
                      {sub.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      recordStudentAction.logSubjectActivity(sub.name);
                      onNavigate('courses/detail', { id: sub.levelId, subject: sub.name });
                    }}
                    className="w-full py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] text-[11px] font-black text-slate-700 dark:text-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <span>Open Subject Hub</span> <ChevronRight size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
