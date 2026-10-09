import './mathLessonTheme.css';
import React, { useState, useRef, useEffect, type ComponentType } from 'react';
import { VariationLesson } from './lessonEngine';

export type LessonSection = {
    id: string;
    eyebrow?: string;
    title: string;
    heading: string;
    intro: string;
    lesson: any[];
};

// Full class names so Tailwind can see them.
const ACCENTS = {
    violet: {
        header: 'bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 border-violet-900',
        active: 'bg-violet-600 border-b-4 border-violet-900 text-white shadow-sm',
    },
    sky: {
        header: 'bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-600 border-sky-800',
        active: 'bg-sky-600 border-b-4 border-sky-900 text-white shadow-sm',
    },
    emerald: {
        header: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 border-emerald-900',
        active: 'bg-emerald-600 border-b-4 border-emerald-900 text-white shadow-sm',
    },
} as const;

/* =========================================================================
   FONTS + SHARED STYLES
   ========================================================================= */
const InkStyles = () => (
    <style>{`
      .gc-hand { font-family: 'Patrick Hand', cursive; }
      .gc-ink { font-family: 'Kalam', cursive; }
      @keyframes gcEnter { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes gcChevronPulse { 0%, 100% { opacity: .15; } 40% { opacity: 1; } }
      .gc-chevron-track { display: inline-flex; align-items: center; gap: 1px; }
      .gc-chevron-track svg { animation: gcChevronPulse 1s ease-in-out infinite; }
    `}</style>
);

/* =========================================================================
   FLAG ICONS
   ========================================================================= */
const UkFlag = ({ className = 'h-4 w-6' }) => (
    <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
        <clipPath id="uk-clip-s"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
        <clipPath id="uk-clip-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
        <g clipPath="url(#uk-clip-s)">
            <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
            <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
            <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4" />
            <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
            <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
        </g>
    </svg>
);

const ZwFlag = ({ className = 'h-4 w-6' }) => (
    <svg viewBox="0 0 60 30" className={`shrink-0 overflow-hidden rounded-sm shadow-xs ${className}`} aria-hidden="true">
        <rect width="60" height="4.286" y="0" fill="#31905c" />
        <rect width="60" height="4.286" y="4.286" fill="#ffd200" />
        <rect width="60" height="4.286" y="8.572" fill="#de2010" />
        <rect width="60" height="4.286" y="12.858" fill="#000000" />
        <rect width="60" height="4.286" y="17.144" fill="#de2010" />
        <rect width="60" height="4.286" y="21.43" fill="#ffd200" />
        <rect width="60" height="4.286" y="25.716" fill="#31905c" />
        <polygon points="0,0 22,15 0,30" fill="#ffffff" stroke="#000000" strokeWidth="0.8" />
        <polygon points="7.5,9.5 8.7,13.2 12.6,13.2 9.5,15.5 10.7,19.2 7.5,16.9 4.3,19.2 5.5,15.5 2.4,13.2 6.3,13.2" fill="#de2010" />
    </svg>
);


/**
 * One page for a maths topic: coloured header, language switch, section tabs,
 * the active section's lesson, and previous / next buttons.
 */
export const LessonPage = ({ id, accent = 'violet', title, subtitle, sections, diagrams, courseLabel = 'O-Level Mathematics' }: {
    id: string;
    courseLabel?: string;
    accent?: keyof typeof ACCENTS;
    title: string;
    subtitle: { en: string; sn: string };
    sections: LessonSection[];
    diagrams: Record<string, ComponentType>;
}) => {
    const [active, setActive] = useState(sections[0].id);
    const [lang, setLang] = useState<'en' | 'sn'>('en');
    const railRef = useRef<HTMLDivElement>(null);
    const [railEdges, setRailEdges] = useState({ left: false, right: false });
    useEffect(() => {
        const rail = railRef.current;
        if (!rail) return;
        const update = () => setRailEdges({ left: rail.scrollLeft > 2, right: rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 2 });
        update();
        rail.addEventListener('scroll', update, { passive: true });
        const observer = new ResizeObserver(update);
        observer.observe(rail);
        return () => { rail.removeEventListener('scroll', update); observer.disconnect(); };
    }, [sections]);
    const moveRail = (direction: number) => {
        const rail = railRef.current;
        if (rail) rail.scrollBy({ left: direction * rail.clientWidth * 0.75, behavior: 'smooth' });
    };
    const theme = ACCENTS[accent];
    const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
    const activeSection = sections[activeIndex] || sections[0];

    const handleNavigate = (target: string) => {
        setActive(target);
        requestAnimationFrame(() => {
            const lessonScrollArea = document.getElementById('lesson-scroll-area');
            if (lessonScrollArea) lessonScrollArea.scrollTo({ top: 0, behavior: 'auto' });
            else window.scrollTo({ top: 0, behavior: 'auto' });
        });
    };
    const goNext = () => { const n = sections[activeIndex + 1]; if (n) handleNavigate(n.id); };
    const goPrev = () => { const p = sections[activeIndex - 1]; if (p) handleNavigate(p.id); };

    return (
        <div id={id} className="math-lesson min-h-screen w-full bg-slate-50 pb-20 font-sans text-slate-900">
            <InkStyles />

            <div className={`math-lesson-header relative overflow-hidden border-b-4 pb-8 pt-10 text-white shadow-md ${theme.header}`}>
                <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
                <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <span className="rounded-2xl bg-white/20 px-3 py-1 text-sm font-bold text-white/90 backdrop-blur-xs">{courseLabel}</span>
                        <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                            <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-black transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                                <UkFlag className="h-3.5 w-5" /><span className="hidden sm:inline">English</span>
                            </button>
                            <button type="button" onClick={() => setLang('sn')} aria-pressed={lang === 'sn'}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-black transition-all ${lang === 'sn' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                                <ZwFlag className="h-3.5 w-5" /><span className="hidden sm:inline">ChiShona</span>
                            </button>
                        </div>
                    </div>
                    <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">{title}</h1>
                    <p className="max-w-3xl text-base leading-relaxed text-white/90">{lang === 'sn' ? subtitle.sn : subtitle.en}</p>
                </div>
            </div>

            <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
                <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
                    <div className="flex min-w-0 items-center gap-2">
                    <button type="button" aria-label="Scroll topics left" aria-controls="math-topic-rail" disabled={!railEdges.left} onClick={() => moveRail(-1)} className="hidden lg:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl text-slate-700 disabled:opacity-30">←</button>
                    <div ref={railRef} id="math-topic-rail" data-math-chapter-scroller="true"
                        className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {sections.map((s) => {
                            const isActive = activeSection.id === s.id;
                            return (
                                <button key={s.id} aria-current={isActive ? 'step' : undefined} data-topic-id={s.id} onClick={() => handleNavigate(s.id)} title={s.title}
                                    className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? theme.active : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                                    {s.title}
                                </button>
                            );
                        })}
                    </div>
                    <button type="button" aria-label="Scroll topics right" aria-controls="math-topic-rail" disabled={!railEdges.right} onClick={() => moveRail(1)} className="hidden lg:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-xl text-slate-700 disabled:opacity-30">→</button>
                    </div>
                </div>
            </div>

            <div className="math-lesson-body w-full min-w-0 max-w-full overflow-x-hidden px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
                <div key={activeSection.id}>
                    <section id={activeSection.id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
                        <div className="mb-4">
                            {activeSection.eyebrow && <span className="text-sm font-bold uppercase tracking-wider text-emerald-500">{activeSection.eyebrow}</span>}
                            <h2 className="text-2xl font-bold text-slate-900">{activeSection.heading}</h2>
                        </div>
                        <p className="mb-4 leading-relaxed text-slate-700">{activeSection.intro}</p>
                        <VariationLesson lesson={activeSection.lesson} diagrams={diagrams} />
                    </section>
                </div>

                <div className="math-lesson-footer mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
                    <button onClick={goPrev} disabled={activeIndex === 0}
                        className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-base font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
                        ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
                    </button>
                    <span className="text-sm font-black tracking-wider text-slate-400">{activeIndex + 1} / {sections.length}</span>
                    <button onClick={goNext} disabled={activeIndex === sections.length - 1}
                        className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-base font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
                        {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
                    </button>
                </div>
            </div>
        </div>
    );
};
