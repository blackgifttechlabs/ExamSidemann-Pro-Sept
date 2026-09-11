import React, { useState, useRef, type ComponentType, type ReactNode } from 'react';

type Example = {
    tag?: string;
    question: string;
    steps: string[];
    answer: string;
};

type GraphEntry = {
    type: 'graph';
    component: ComponentType;
    title?: string;
    caption?: string;
};

type ContentItem =
    | { type: 'paragraph' | 'note' | 'example'; text: string }
    | { type: 'worked'; text: string; working?: string; answer?: string }
    | { type: 'table'; headers: string[]; rows: string[][]; caption?: string }
    | GraphEntry;

type SectionData = {
    id: string;
    eyebrow: string;
    title: string;
    heading: string;
    intro: ReactNode;
    definition?: ReactNode;
    content?: ContentItem[];
    graphs?: GraphEntry[];
    examples?: Example[];
    practice?: string[];
};

/* =========================================================================
   FONTS + SHARED STYLES
   ========================================================================= */
const InkStyles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700&family=Patrick+Hand&display=swap');
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

/* =========================================================================
   SHARED UI PRIMITIVES
   ========================================================================= */
const DefinitionBox = ({ children, label = 'Definition' }: { children: ReactNode; label?: string }) => (
    <div className="my-6 rounded-2xl border-2 border-rose-200 bg-white px-6 py-5 shadow-sm">
        <span className="gc-hand block text-center text-sm text-slate-500">{label}</span>
        <p className="gc-ink mt-2 text-center text-xl font-bold leading-snug text-blue-900 sm:text-2xl">{children}</p>
        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-rose-300" />
    </div>
);

const PracticeZone = ({ items }: { items: string[] }) => (
    <div className="rounded-2xl bg-slate-900 p-4 text-white shadow-lg sm:p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <span className="text-2xl">✍️</span> Practice Zone
        </h3>
        <div className="space-y-4">
            {items.map((q, i) => (
                <div key={i} className="flex gap-3 border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                    <span className="font-bold text-emerald-400">{i + 1}.</span>
                    <span className="text-slate-200">{q}</span>
                </div>
            ))}
        </div>
    </div>
);

const ExampleCard = ({ index, example }: { index: number; example: Example }) => {
    const [open, setOpen] = useState(false);
    return (
        <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-start gap-4 p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">{index}</div>
                <div className="pt-1">
                    {example.tag && <div className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-500">{example.tag}</div>}
                    <div className="font-medium text-slate-800">{example.question}</div>
                </div>
            </div>
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5 text-left text-sm font-medium text-emerald-600 transition-colors hover:bg-slate-100">
                <span>{open ? 'Hide Solution' : 'Show Solution'}</span>
                <span className={`transform transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {open && (
                <div className="border-t border-slate-100 p-4 sm:p-5">
                    <div className="rounded-lg bg-blue-50/40 p-4 pl-6">
                        {example.steps.map((step, i) => (
                            <div key={i} className="flex gap-2 border-b border-blue-100/70 py-2 text-sm leading-relaxed last:border-0">
                                <span className="gc-hand shrink-0 font-bold text-rose-500">Step {i + 1}:</span>
                                <span className="gc-ink flex-1 text-[1.05rem] leading-relaxed text-blue-900">{step}</span>
                            </div>
                        ))}
                        <div className="pt-2 text-sm leading-relaxed">
                            <span className="gc-hand mr-1 font-bold text-slate-500">Answer:</span>
                            <span className="gc-ink text-lg font-bold text-emerald-700">{example.answer}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const TheoremExplainer = ({ heading, paragraphs, callout, calloutSn, footer, audioSrc }: {
    heading: string;
    paragraphs: ReactNode[];
    callout: ReactNode;
    calloutSn?: ReactNode;
    footer?: ReactNode;
    audioSrc?: string;
}) => {
    const [showSn, setShowSn] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handleTogglePlay = () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
    };

    return (
        <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900">{heading}</h3>
            <div className="space-y-3">
                {paragraphs.map((p, i) => (
                    <div key={i} className="leading-relaxed text-slate-700">{p}</div>
                ))}
            </div>
            <div className="my-4 flex items-start gap-3 rounded-r-lg border-l-4 border-rose-300 bg-rose-50/60 py-3 pl-4 pr-3">
                <p className="flex-1 font-bold leading-snug text-slate-800">{showSn && calloutSn ? calloutSn : callout}</p>
                <div className="flex shrink-0 flex-col items-center gap-1.5">
                    {calloutSn && (
                        <button
                            type="button"
                            onClick={() => setShowSn((s) => !s)}
                            aria-pressed={showSn}
                            title={showSn ? 'Show in English' : 'Bvunza muChiShona'}
                            className={`flex items-center justify-center rounded-lg p-1 transition ${showSn ? 'bg-white ring-2 ring-emerald-500' : 'bg-white/60 hover:bg-white'}`}
                        >
                            <ZwFlag className="h-4 w-6" />
                        </button>
                    )}
                    {audioSrc && (
                        <>
                            <button
                                type="button"
                                onClick={handleTogglePlay}
                                aria-pressed={isPlaying}
                                title={isPlaying ? 'Pause explanation' : 'Play explanation'}
                                className="relative overflow-hidden flex items-center justify-center rounded-full p-1.5 text-white transition-all active:scale-95"
                                style={{ background: 'linear-gradient(180deg,#7ee84a 0%,#3db41a 55%,#2a9010 100%)', border: '2px solid #1d6e0a', boxShadow: '0 3px 0 #155208, 0 4px 6px rgba(0,0,0,0.25)' }}
                            >
                                <span className="absolute inset-x-0.5 top-0.5 h-1.5 rounded-full opacity-60" style={{ background: 'linear-gradient(180deg,#c6f97d,transparent)' }} />
                                {isPlaying ? (
                                    <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0" y="0" width="3.5" height="10" fill="white" /><rect x="6.5" y="0" width="3.5" height="10" fill="white" /></svg>
                                ) : (
                                    <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="0,0 10,5 0,10" fill="white" /></svg>
                                )}
                            </button>
                            <audio
                                ref={audioRef}
                                src={audioSrc}
                                onEnded={() => setIsPlaying(false)}
                                onPause={() => setIsPlaying(false)}
                                className="hidden"
                            />
                        </>
                    )}
                </div>
            </div>
            {footer && <p className="leading-relaxed text-slate-700">{footer}</p>}
        </div>
    );
};

/* =========================================================================
   GRAPH HELPERS
   ========================================================================= */

/** Shared card wrapper for all probability diagrams */
const DiagramCard = ({ title, caption, children }: { title?: string; caption?: string; children: ReactNode }) => (
    <div className="my-4 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {title && (
            <div className="border-b border-slate-100 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">{title}</div>
        )}
        <div className="flex items-center justify-center p-3">
            {children}
        </div>
        {caption && (
            <div className="border-t border-slate-100 px-3 py-1 text-center text-xs text-slate-400">{caption}</div>
        )}
    </div>
);

/* =========================================================================
   SPECIFIC DIAGRAMS  (all use pixel-based viewBox coords)
   ========================================================================= */

// Fig 19.1: Magic square 4x4
const Fig19_1 = () => {
    const nums = [
        [16, 2, 3, 13],
        [5, 11, 10, 8],
        [9, 7, 6, 12],
        [4, 14, 15, 1]
    ];
    const cell = 60;
    const pad = 10;
    const W = pad * 2 + cell * 4;
    const H = pad * 2 + cell * 4;
    return (
        <DiagramCard title="Fig 19.1 — Magic Square" caption="Each row, column and diagonal sums to 34">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[280px]" preserveAspectRatio="xMidYMid meet">
                {nums.map((row, i) =>
                    row.map((val, j) => (
                        <g key={`${i}-${j}`}>
                            <rect x={pad + j * cell} y={pad + i * cell} width={cell} height={cell}
                                fill={i === j || i + j === 3 ? "rgba(30,58,138,0.08)" : "#f8fafc"}
                                stroke="#334155" strokeWidth="1.5" />
                            <text x={pad + j * cell + cell / 2} y={pad + i * cell + cell / 2 + 6}
                                fontSize="20" fill="#0f172a" textAnchor="middle" fontFamily="serif" fontWeight="600">{val}</text>
                        </g>
                    ))
                )}
            </svg>
        </DiagramCard>
    );
};

// Fig 19.2: Disjoint Venn circles (mutually exclusive)
const Fig19_2 = () => (
    <DiagramCard title="Fig 19.2 — Mutually Exclusive Events" caption="V ∩ L = ∅ (no overlap)">
        <svg viewBox="0 0 300 150" className="h-auto w-full max-w-[320px]" preserveAspectRatio="xMidYMid meet">
            {/* Universe rectangle */}
            <rect x="5" y="5" width="290" height="140" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,3" />
            <text x="280" y="22" fontSize="12" fill="#94a3b8" textAnchor="end">ξ</text>
            {/* Circle V */}
            <circle cx="90" cy="75" r="55" fill="rgba(30,58,138,0.12)" stroke="#1e3a8a" strokeWidth="2" />
            <text x="90" y="80" fontSize="22" fill="#1e3a8a" textAnchor="middle" fontWeight="700">V</text>
            {/* Circle L */}
            <circle cx="210" cy="75" r="55" fill="rgba(220,38,38,0.12)" stroke="#dc2626" strokeWidth="2" />
            <text x="210" y="80" fontSize="22" fill="#dc2626" textAnchor="middle" fontWeight="700">L</text>
        </svg>
    </DiagramCard>
);

// Fig 19.3: Spinner with 8 sectors (numbers 1-8)
const Fig19_3 = () => {
    const sectors = 8;
    const R = 90;
    const cx = 110, cy = 110;
    const COLORS = ["#dbeafe","#bfdbfe","#93c5fd","#60a5fa","#e0f2fe","#bae6fd","#7dd3fc","#38bdf8"];
    const arcs: ReactNode[] = [];
    for (let i = 0; i < sectors; i++) {
        const a1 = (i * 2 * Math.PI) / sectors - Math.PI / 2;
        const a2 = ((i + 1) * 2 * Math.PI) / sectors - Math.PI / 2;
        const x1 = cx + R * Math.cos(a1), y1 = cy + R * Math.sin(a1);
        const x2 = cx + R * Math.cos(a2), y2 = cy + R * Math.sin(a2);
        const mid = (a1 + a2) / 2;
        const lx = cx + R * 0.65 * Math.cos(mid);
        const ly = cy + R * 0.65 * Math.sin(mid);
        arcs.push(
            <g key={i}>
                <path d={`M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`}
                    fill={COLORS[i]} stroke="#334155" strokeWidth="1.5" />
                <text x={lx} y={ly + 5} fontSize="16" fill="#0f172a" textAnchor="middle" fontWeight="600">{i + 1}</text>
            </g>
        );
    }
    return (
        <DiagramCard title="Fig 19.3 — Spinner (8 equal sectors)" caption="P(any number) = 1/8">
            <svg viewBox="0 0 220 220" className="h-auto w-full max-w-[220px]" preserveAspectRatio="xMidYMid meet">
                {arcs}
                <circle cx={cx} cy={cy} r="6" fill="#334155" />
                {/* Arrow */}
                <polygon points={`${cx},${cy - R + 10} ${cx - 8},${cy - R + 28} ${cx + 8},${cy - R + 28}`} fill="#dc2626" />
                <line x1={cx} y1={cy} x2={cx} y2={cy - R + 28} stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </DiagramCard>
    );
};

// Fig 19.4: Intersecting Venn circles (independent events)
const Fig19_4 = () => (
    <DiagramCard title="Fig 19.4 — Independent Events" caption="S and T overlap — P(S∩T) = P(S)·P(T)">
        <svg viewBox="0 0 300 150" className="h-auto w-full max-w-[320px]" preserveAspectRatio="xMidYMid meet">
            <rect x="5" y="5" width="290" height="140" rx="6" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5,3" />
            <text x="280" y="22" fontSize="12" fill="#94a3b8" textAnchor="end">ξ</text>
            <circle cx="115" cy="75" r="60" fill="rgba(30,58,138,0.12)" stroke="#1e3a8a" strokeWidth="2" />
            <text x="82" y="80" fontSize="20" fill="#1e3a8a" textAnchor="middle" fontWeight="700">S</text>
            <circle cx="185" cy="75" r="60" fill="rgba(220,38,38,0.12)" stroke="#dc2626" strokeWidth="2" />
            <text x="218" y="80" fontSize="20" fill="#dc2626" textAnchor="middle" fontWeight="700">T</text>
            <text x="150" y="78" fontSize="13" fill="#334155" textAnchor="middle" fontWeight="600">S∩T</text>
        </svg>
    </DiagramCard>
);

// Fig 19.5: Three slots for cards (BED)
const Fig19_5 = () => (
    <DiagramCard title="Fig 19.5 — Arrangement Slots" caption="Arranging letters in order">
        <svg viewBox="0 0 300 100" className="h-auto w-full max-w-[300px]" preserveAspectRatio="xMidYMid meet">
            {[{label: "1st", x: 20}, {label: "2nd", x: 110}, {label: "3rd", x: 200}].map(({label, x}) => (
                <g key={label}>
                    <rect x={x} y="15" width="80" height="65" rx="6" fill="#eff6ff" stroke="#1e3a8a" strokeWidth="2" />
                    <text x={x + 40} y="56" fontSize="18" fill="#1e3a8a" textAnchor="middle" fontWeight="600">{label}</text>
                </g>
            ))}
        </svg>
    </DiagramCard>
);

// Fig 19.6: Tree diagram with replacement (3B,2W)
const Fig19_6 = () => (
    <DiagramCard title="Fig 19.6 — Tree Diagram (with replacement)" caption="3 Blue, 2 White balls — probabilities stay the same each draw">
        <svg viewBox="0 0 380 260" className="h-auto w-full max-w-[380px]" preserveAspectRatio="xMidYMid meet">
            {/* Root */}
            <circle cx={30} cy={130} r={5} fill="#0f172a" />
            {/* Level 1 branches */}
            <line x1={30} y1={130} x2={130} y2={65} stroke="#1e3a8a" strokeWidth="2" />
            <text x={72} y={88} fontSize="12" fill="#1e3a8a" textAnchor="middle" fontWeight="600">3/5</text>
            <circle cx={135} cy={62} r={14} fill="#dbeafe" stroke="#1e3a8a" strokeWidth="2" />
            <text x={135} y={67} fontSize="13" fill="#1e3a8a" textAnchor="middle" fontWeight="700">B</text>

            <line x1={30} y1={130} x2={130} y2={195} stroke="#dc2626" strokeWidth="2" />
            <text x={72} y={172} fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="600">2/5</text>
            <circle cx={135} cy={198} r={14} fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
            <text x={135} y={203} fontSize="13" fill="#dc2626" textAnchor="middle" fontWeight="700">W</text>

            {/* Level 2 from B */}
            <line x1={149} y1={62} x2={240} y2={30} stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={192} y={38} fontSize="11" fill="#1e3a8a" textAnchor="middle">3/5</text>
            <circle cx={248} cy={26} r={13} fill="#dbeafe" stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={248} y={31} fontSize="12" fill="#1e3a8a" textAnchor="middle" fontWeight="700">B</text>
            <text x={268} y={31} fontSize="11" fill="#475569">→ BB</text>

            <line x1={149} y1={62} x2={240} y2={95} stroke="#dc2626" strokeWidth="1.5" />
            <text x={192} y={87} fontSize="11" fill="#dc2626" textAnchor="middle">2/5</text>
            <circle cx={248} cy={98} r={13} fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
            <text x={248} y={103} fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="700">W</text>
            <text x={268} y={103} fontSize="11" fill="#475569">→ BW</text>

            {/* Level 2 from W */}
            <line x1={149} y1={198} x2={240} y2={165} stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={192} y={174} fontSize="11" fill="#1e3a8a" textAnchor="middle">3/5</text>
            <circle cx={248} cy={162} r={13} fill="#dbeafe" stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={248} y={167} fontSize="12" fill="#1e3a8a" textAnchor="middle" fontWeight="700">B</text>
            <text x={268} y={167} fontSize="11" fill="#475569">→ WB</text>

            <line x1={149} y1={198} x2={240} y2={230} stroke="#dc2626" strokeWidth="1.5" />
            <text x={192} y={226} fontSize="11" fill="#dc2626" textAnchor="middle">2/5</text>
            <circle cx={248} cy={233} r={13} fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
            <text x={248} y={238} fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="700">W</text>
            <text x={268} y={238} fontSize="11" fill="#475569">→ WW</text>
        </svg>
    </DiagramCard>
);

// Fig 19.7: Tree diagram without replacement (3B,2W)
const Fig19_7 = () => (
    <DiagramCard title="Fig 19.7 — Tree Diagram (without replacement)" caption="3 Blue, 2 White balls — probabilities change each draw">
        <svg viewBox="0 0 380 260" className="h-auto w-full max-w-[380px]" preserveAspectRatio="xMidYMid meet">
            {/* Root */}
            <circle cx={30} cy={130} r={5} fill="#0f172a" />
            {/* Level 1 */}
            <line x1={30} y1={130} x2={130} y2={65} stroke="#1e3a8a" strokeWidth="2" />
            <text x={72} y={88} fontSize="12" fill="#1e3a8a" textAnchor="middle" fontWeight="600">3/5</text>
            <circle cx={135} cy={62} r={14} fill="#dbeafe" stroke="#1e3a8a" strokeWidth="2" />
            <text x={135} y={67} fontSize="13" fill="#1e3a8a" textAnchor="middle" fontWeight="700">B</text>

            <line x1={30} y1={130} x2={130} y2={195} stroke="#dc2626" strokeWidth="2" />
            <text x={72} y={172} fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="600">2/5</text>
            <circle cx={135} cy={198} r={14} fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
            <text x={135} y={203} fontSize="13" fill="#dc2626" textAnchor="middle" fontWeight="700">W</text>

            {/* Level 2 from B — now 2B,2W remain */}
            <line x1={149} y1={62} x2={240} y2={30} stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={192} y={38} fontSize="11" fill="#1e3a8a" textAnchor="middle">2/4</text>
            <circle cx={248} cy={26} r={13} fill="#dbeafe" stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={248} y={31} fontSize="12" fill="#1e3a8a" textAnchor="middle" fontWeight="700">B</text>
            <text x={268} y={31} fontSize="11" fill="#475569">→ BB</text>

            <line x1={149} y1={62} x2={240} y2={95} stroke="#dc2626" strokeWidth="1.5" />
            <text x={192} y={87} fontSize="11" fill="#dc2626" textAnchor="middle">2/4</text>
            <circle cx={248} cy={98} r={13} fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
            <text x={248} y={103} fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="700">W</text>
            <text x={268} y={103} fontSize="11" fill="#475569">→ BW</text>

            {/* Level 2 from W — now 3B,1W remain */}
            <line x1={149} y1={198} x2={240} y2={165} stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={192} y={174} fontSize="11" fill="#1e3a8a" textAnchor="middle">3/4</text>
            <circle cx={248} cy={162} r={13} fill="#dbeafe" stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={248} y={167} fontSize="12" fill="#1e3a8a" textAnchor="middle" fontWeight="700">B</text>
            <text x={268} y={167} fontSize="11" fill="#475569">→ WB</text>

            <line x1={149} y1={198} x2={240} y2={230} stroke="#dc2626" strokeWidth="1.5" />
            <text x={192} y={226} fontSize="11" fill="#dc2626" textAnchor="middle">1/4</text>
            <circle cx={248} cy={233} r={13} fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
            <text x={248} y={238} fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="700">W</text>
            <text x={268} y={238} fontSize="11" fill="#475569">→ WW</text>
        </svg>
    </DiagramCard>
);

// Fig 19.8: Tree diagram for two cards (spades/non-spades)
const Fig19_8 = () => (
    <DiagramCard title="Fig 19.8 — Tree Diagram (cards, spades vs non-spades)" caption="Deck of 52 cards, drawing 2 without replacement">
        <svg viewBox="0 0 380 260" className="h-auto w-full max-w-[380px]" preserveAspectRatio="xMidYMid meet">
            <circle cx={30} cy={130} r={5} fill="#0f172a" />
            {/* First card */}
            <line x1={30} y1={130} x2={130} y2={65} stroke="#1e3a8a" strokeWidth="2" />
            <text x={72} y={88} fontSize="11" fill="#1e3a8a" textAnchor="middle" fontWeight="600">13/52</text>
            <circle cx={137} cy={62} r={14} fill="#dbeafe" stroke="#1e3a8a" strokeWidth="2" />
            <text x={137} y={67} fontSize="13" fill="#1e3a8a" textAnchor="middle" fontWeight="700">S</text>

            <line x1={30} y1={130} x2={130} y2={195} stroke="#dc2626" strokeWidth="2" />
            <text x={72} y={172} fontSize="11" fill="#dc2626" textAnchor="middle" fontWeight="600">39/52</text>
            <circle cx={137} cy={198} r={14} fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
            <text x={137} y={203} fontSize="13" fill="#dc2626" textAnchor="middle" fontWeight="700">N</text>

            {/* From S */}
            <line x1={151} y1={62} x2={242} y2={30} stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={194} y={38} fontSize="11" fill="#1e3a8a" textAnchor="middle">12/51</text>
            <circle cx={250} cy={26} r={13} fill="#dbeafe" stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={250} y={31} fontSize="12" fill="#1e3a8a" textAnchor="middle" fontWeight="700">S</text>
            <text x={270} y={31} fontSize="11" fill="#475569">→ SS</text>

            <line x1={151} y1={62} x2={242} y2={95} stroke="#dc2626" strokeWidth="1.5" />
            <text x={194} y={87} fontSize="11" fill="#dc2626" textAnchor="middle">39/51</text>
            <circle cx={250} cy={98} r={13} fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
            <text x={250} y={103} fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="700">N</text>
            <text x={270} y={103} fontSize="11" fill="#475569">→ SN</text>

            {/* From N */}
            <line x1={151} y1={198} x2={242} y2={165} stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={194} y={174} fontSize="11" fill="#1e3a8a" textAnchor="middle">13/51</text>
            <circle cx={250} cy={162} r={13} fill="#dbeafe" stroke="#1e3a8a" strokeWidth="1.5" />
            <text x={250} y={167} fontSize="12" fill="#1e3a8a" textAnchor="middle" fontWeight="700">S</text>
            <text x={270} y={167} fontSize="11" fill="#475569">→ NS</text>

            <line x1={151} y1={198} x2={242} y2={230} stroke="#dc2626" strokeWidth="1.5" />
            <text x={194} y={226} fontSize="11" fill="#dc2626" textAnchor="middle">38/51</text>
            <circle cx={250} cy={233} r={13} fill="#fee2e2" stroke="#dc2626" strokeWidth="1.5" />
            <text x={250} y={238} fontSize="12" fill="#dc2626" textAnchor="middle" fontWeight="700">N</text>
            <text x={270} y={238} fontSize="11" fill="#475569">→ NN</text>
        </svg>
    </DiagramCard>
);

// Fig 19.9: Pentagonal spinner (5 sides)
const Fig19_9 = () => {
    const n = 5;
    const R = 85;
    const cx = 100, cy = 100;
    const COLORS = ["#dbeafe","#bbf7d0","#fef08a","#fecaca","#e9d5ff"];
    const points: {x: number; y: number}[] = [];
    for (let i = 0; i < n; i++) {
        const angle = (i * 2 * Math.PI) / n - Math.PI / 2;
        points.push({ x: cx + R * Math.cos(angle), y: cy + R * Math.sin(angle) });
    }
    return (
        <DiagramCard title="Fig 19.9 — Pentagonal Spinner" caption="5 equal sections — P(any section) = 1/5">
            <svg viewBox="0 0 200 200" className="h-auto w-full max-w-[200px]" preserveAspectRatio="xMidYMid meet">
                {points.map((p, i) => {
                    const next = points[(i + 1) % n];
                    const mid = (i * 2 * Math.PI / n + (i + 1) * 2 * Math.PI / n) / 2 - Math.PI / 2;
                    const lx = cx + R * 0.62 * Math.cos(mid);
                    const ly = cy + R * 0.62 * Math.sin(mid);
                    return (
                        <g key={i}>
                            <path d={`M ${cx} ${cy} L ${p.x} ${p.y} L ${next.x} ${next.y} Z`}
                                fill={COLORS[i]} stroke="#334155" strokeWidth="1.5" />
                            <text x={lx} y={ly + 5} fontSize="16" fill="#0f172a" textAnchor="middle" fontWeight="700">{i + 1}</text>
                        </g>
                    );
                })}
                <circle cx={cx} cy={cy} r="5" fill="#334155" />
                <polygon points={`${cx},${cy - R + 12} ${cx - 7},${cy - R + 28} ${cx + 7},${cy - R + 28}`} fill="#dc2626" />
                <line x1={cx} y1={cy} x2={cx} y2={cy - R + 28} stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            </svg>
        </DiagramCard>
    );
};

// Fig 19.10: Square with midpoints M,N
const Fig19_10 = () => {
    const pad = 30, sq = 160;
    const A = {x: pad, y: pad};
    const B = {x: pad + sq, y: pad};
    const C = {x: pad + sq, y: pad + sq};
    const D = {x: pad, y: pad + sq};
    const M = {x: (A.x + B.x) / 2, y: A.y};
    const N = {x: (C.x + D.x) / 2, y: C.y};
    const W = pad * 2 + sq, H = pad * 2 + sq;
    return (
        <DiagramCard title="Fig 19.10 — Square ABCD with midpoints M and N" caption="M = midpoint of AB, N = midpoint of CD">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full max-w-[240px]" preserveAspectRatio="xMidYMid meet">
                <polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y} ${D.x},${D.y}`}
                    fill="rgba(30,58,138,0.07)" stroke="#1e3a8a" strokeWidth="2" />
                <text x={A.x - 12} y={A.y + 5} fontSize="14" fill="#0f172a" fontWeight="700">A</text>
                <text x={B.x + 5} y={B.y + 5} fontSize="14" fill="#0f172a" fontWeight="700">B</text>
                <text x={C.x + 5} y={C.y + 5} fontSize="14" fill="#0f172a" fontWeight="700">C</text>
                <text x={D.x - 16} y={D.y + 5} fontSize="14" fill="#0f172a" fontWeight="700">D</text>
                <circle cx={M.x} cy={M.y} r="5" fill="#dc2626" />
                <text x={M.x} y={M.y - 10} fontSize="13" fill="#dc2626" textAnchor="middle" fontWeight="700">M</text>
                <circle cx={N.x} cy={N.y} r="5" fill="#dc2626" />
                <text x={N.x} y={N.y + 20} fontSize="13" fill="#dc2626" textAnchor="middle" fontWeight="700">N</text>
            </svg>
        </DiagramCard>
    );
};

// Fig 19.11: Eight holes with numbers (1-8)
const Fig19_11 = () => (
    <DiagramCard title="Fig 19.11 — Eight numbered holes" caption="Dart thrown at random — P(any hole) = 1/8">
        <svg viewBox="0 0 320 90" className="h-auto w-full max-w-[340px]" preserveAspectRatio="xMidYMid meet">
            {Array.from({length: 8}, (_, i) => {
                const cx = 22 + i * 36;
                return (
                    <g key={i}>
                        <circle cx={cx} cy={42} r="16" fill={i % 2 === 0 ? "#dbeafe" : "#f1f5f9"} stroke="#334155" strokeWidth="2" />
                        <text x={cx} y={48} fontSize="16" fill="#0f172a" textAnchor="middle" fontWeight="700">{i + 1}</text>
                    </g>
                );
            })}
        </svg>
    </DiagramCard>
);

// Table 19.2 and Table 19.3: We'll render as HTML tables in content.

/* =========================================================================
   SECTION COMPONENT
   ========================================================================= */
const Section = ({ section }: { section: SectionData }) => {
    const { id, eyebrow, title, heading, intro, content, graphs, examples, practice, definition } = section;

    return (
        <section id={id} className="mb-16 w-full min-w-0 max-w-full scroll-mt-24">
            <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">{eyebrow}</span>
                <h2 className="text-2xl font-bold text-slate-900">{heading}</h2>
            </div>

            <div className="mb-6">
                {typeof intro === 'string'
                    ? <p className="mb-4 leading-relaxed text-slate-700">{intro}</p>
                    : intro}

                {definition && <DefinitionBox>{definition}</DefinitionBox>}

                {content && content.map((item, i) => {
                    if (item.type === 'paragraph') {
                        return <p key={i} className="mb-4 leading-relaxed text-slate-700">{item.text}</p>;
                    }
                    if (item.type === 'graph') {
                        const GraphComp = item.component;
                        return (
                            <div key={i} className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                {item.title && <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{item.title}</div>}
                                <div className="p-4 bg-slate-50/50">
                                    <GraphComp />
                                </div>
                                {item.caption && <p className="border-t border-slate-100 px-4 py-2 text-xs italic text-slate-500">{item.caption}</p>}
                            </div>
                        );
                    }
                    if (item.type === 'table') {
                        return (
                            <div key={i} className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                                <div className="p-4 overflow-x-auto">
                                    <table className="min-w-full border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-100">
                                                {item.headers.map((h, idx) => <th key={idx} className="border border-slate-300 px-4 py-2 text-left font-bold text-slate-700">{h}</th>)}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {item.rows.map((row, idx) => (
                                                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                    {row.map((cell, cidx) => <td key={cidx} className="border border-slate-300 px-4 py-2 text-slate-800">{cell}</td>)}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {item.caption && <p className="border-t border-slate-100 px-4 py-2 text-xs italic text-slate-500">{item.caption}</p>}
                            </div>
                        );
                    }
                    if (item.type === 'note') {
                        return (
                            <div key={i} className="my-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                                <span className="font-bold text-amber-700">Note:</span>
                                <span className="ml-2 text-slate-700">{item.text}</span>
                            </div>
                        );
                    }
                    if (item.type === 'example') {
                        return (
                            <div key={i} className="my-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <p className="font-bold text-slate-800">{item.text}</p>
                            </div>
                        );
                    }
                    if (item.type === 'worked') {
                        return (
                            <div key={i} className="my-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                <p className="font-bold text-emerald-800">{item.text}</p>
                                {item.working && <p className="mt-2 text-slate-700">{item.working}</p>}
                                {item.answer && <p className="mt-2 font-bold text-emerald-700">{item.answer}</p>}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>

            {graphs && graphs.map((g, i) => {
                const GraphComp = g.component;
                return (
                    <div key={i} className="my-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                        {g.title && <div className="border-b border-slate-100 px-4 py-2 text-sm font-bold text-slate-700">{g.title}</div>}
                        <div className="p-4 bg-slate-50/50">
                            <GraphComp />
                        </div>
                        {g.caption && <p className="border-t border-slate-100 px-4 py-2 text-xs italic text-slate-500">{g.caption}</p>}
                    </div>
                );
            })}

            {examples && examples.length > 0 && (
                <div className="mb-8">
                    <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-400">Worked Examples</h3>
                    {examples.map((ex, i) => (
                        <ExampleCard key={i} index={i + 1} example={ex} />
                    ))}
                </div>
            )}

            {practice && practice.length > 0 && <PracticeZone items={practice} />}
        </section>
    );
};

/* =========================================================================
   MAIN PROBABILITY COMPONENT
   ========================================================================= */
export const Probabilities = () => {
    const [active, setActive] = useState('intro');
    const [lang, setLang] = useState('en');

    const sections: SectionData[] = [
        {
            id: 'intro',
            eyebrow: 'Chapter 19',
            title: 'Introduction',
            heading: 'Probability (2) – Combined Probabilities',
            intro: (
                <>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        You already know that probability tells us how likely something is to happen.
                        But what happens when we have more than one event?
                    </p>
                    <p className="mb-2 leading-relaxed text-slate-700">For example:</p>
                    <ul className="mb-4 list-disc space-y-1 pl-6 leading-relaxed text-slate-700">
                        <li>What is the probability of getting a 6 and then a 4 when rolling a die twice?</li>
                        <li>What is the probability of getting a head or a tail when tossing a coin?</li>
                        <li>What is the probability that two things happen together?</li>
                    </ul>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        These are examples of <strong>combined probabilities</strong>. Before we start combining events,
                        let&apos;s quickly remind ourselves how probability works.
                    </p>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">A Quick Reminder</h3>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Probability can be found by comparing the number of outcomes we want with the number of possible outcomes.
                        For example, a fair die has 6 possible outcomes: 1, 2, 3, 4, 5, 6.
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        There is only one way to roll a 5. So the probability of rolling a 5 is 1/6.
                        This is called <strong>theoretical probability</strong> because we calculate it from the possible outcomes.
                    </p>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        We can also use what has happened in the past. Imagine that it rained in Gwanda during 9 out of 12 Septembers.
                        Based on those past results, we could estimate the probability of rain next September as 9/12 = ¾.
                        This is called <strong>experimental probability</strong> because it is based on observations or past data.
                    </p>
                    <h3 className="mb-2 text-lg font-bold text-slate-900">The General Rule</h3>
                </>
            ),
            definition: 'For an event R: P(R) = n(R) / n(ℰ), where n(R) is the number of favourable outcomes and n(ℰ) is the number of all possible outcomes.',
            content: [
                { type: 'paragraph', text: "Now let's see what happens when we have two or more events together." },
                { type: 'graph', component: Fig19_1, title: 'Fig 19.1 — Magic Square', caption: 'If a number is picked at random from this square, the probability of it being odd is 8/16 = 1/2.' },
                { type: 'paragraph', text: 'Example 1: Tendai and Samuel have played tennis 15 times, Tendai won 12. Probability of draw = 0 (no draws in tennis), Tendai wins = 12/15 = 4/5, either wins = 1.' },
                { type: 'paragraph', text: 'If p is probability of an event, then 0 ≤ p ≤ 1. Probability of not happening is 1-p.' },
                { type: 'paragraph', text: 'Example 2: Choosing a letter from alphabet. Probability of F is 1/26; of F or T is 2/26=1/13; of a letter in FREQUENCY (8 distinct letters) is 8/26=4/13; of a letter in TABLE is 5/26, so not in TABLE is 21/26.' },
            ],
            practice: [
                'A statistical survey shows that 28% of all men take size 9 shoes. What is the probability that your friend\'s father takes size 9 shoes?',
                'A school contains 357 boys and 323 girls. If a student is chosen at random, what is the probability that a girl is chosen?',
                'A State Lottery sells 1 million tickets of which 300 are prize winners. What is the probability of getting a prize by buying just one ticket?',
                'Statistics show that 92 out of every 100 adults are at least 150 cm tall. What is the probability that a person chosen at random is less than 150 cm tall?',
                'Using Fig 19.1, find the probability that a number picked at random is (a) odd, (b) prime, (c) less than 10, (d) exactly divisible by 3, (e) a perfect square, (f) a perfect cube.',
                'A bag contains 2 black, 3 green, 4 red balls. A ball is picked at random. Find probability of (a) black, (b) green, (c) red, (d) yellow, (e) not black, (f) either black or red.',
            ],
        },
        {
            id: 'mutually-exclusive',
            eyebrow: 'Chapter 19',
            title: 'Mutually Exclusive',
            heading: 'Mutually Exclusive Events',
            intro: (
                <>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Two events are <strong>mutually exclusive</strong> if they cannot happen at the same time.
                        For example, choosing a vowel (A,E,I,O,U) and choosing one of X,Y,Z from the alphabet – no letter is both.
                    </p>
                </>
            ),
            content: [
                { type: 'graph', component: Fig19_2, title: 'Fig 19.2 — Disjoint Sets V and L', caption: 'V ∩ L = ∅, so events are mutually exclusive.' },
                { type: 'paragraph', text: 'For mutually exclusive events, the probability that either event occurs is the sum of their probabilities: p(V) + p(L) = p(V∪L).' },
                { type: 'example', text: 'Example 3: Probability of choosing a vowel or X,Y,Z = 5/26 + 3/26 = 8/26 = 4/13.' },
                { type: 'paragraph', text: 'This is called the Addition Law: For mutually exclusive events A, B, C,..., p(A or B or C...) = p(A)+p(B)+p(C)+...' },
                { type: 'example', text: 'Example 4: From the set {2,4,6,...,20}, probability of factor of 18 or multiple of 5. Factors: {2,6,18} (3/10), multiples of 5: {10,20} (2/10). Sum = 5/10 = 1/2.' },
            ],
            practice: [
                'A card is chosen at random from a pack of playing cards. What is the probability that it is either a heart or the Queen of spades?',
                'F = {2,3,7} and T = {10,20,30,40}. If one element is selected at random from F∪T, find probability it is either a prime factor of 42 or a multiple of 4.',
                'In a game of chance, an arrow spins to one of eight sectors (Fig 19.3). Find probability of getting an odd number or a number greater than 6.',
            ],
        },
        {
            id: 'independent',
            eyebrow: 'Chapter 19',
            title: 'Independent Events',
            heading: 'Independent Events',
            intro: (
                <>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        Two events are <strong>independent</strong> if the outcome of one does not affect the other.
                        For example, throwing a die and tossing a coin: getting a six does not affect getting a head.
                    </p>
                </>
            ),
            content: [
                { type: 'graph', component: Fig19_4, title: 'Fig 19.4 — Intersecting Sets S and T', caption: 'S and T are independent; p(S∩T) = p(S)×p(T).' },
                { type: 'paragraph', text: 'The Product Law: For independent events, probability that both occur is product of their probabilities: p(A and B) = p(A) × p(B).' },
                { type: 'example', text: 'Example 5: Probability of throwing a six and tossing a tail = 1/6 × 1/2 = 1/12.' },
                { type: 'table', headers: ['', '1', '2', '3', '4', '5', '6'], rows: [['H', 'H1','H2','H3','H4','H5','H6'], ['T', 'T1','T2','T3','T4','T5','T6']], caption: 'Table 19.2 – All outcomes of die and coin.' },
                { type: 'paragraph', text: 'For any two events (not necessarily mutually exclusive): p(S∪T) = p(S) + p(T) - p(S∩T). If mutually exclusive, p(S∩T)=0, giving addition law.' },
                { type: 'paragraph', text: 'Example 6: Five girls, three boys. Pick two names without replacement. Probability both girls = 5/8 × 4/7 = 5/14.' },
            ],
            practice: [
                'A card is chosen from a pack, then returned. A second card is chosen. What is the probability that both cards are black?',
                'A coin is tossed and a die thrown. What is the probability of getting a head and a perfect square?',
                'If the arrow in Fig 19.3 is spun twice, what is the probability of getting two 3s?',
                'Five cards lettered A,B,C,D,E. Three cards are chosen without replacement. What is the probability that they spell BED?',
            ],
        },
        {
            id: 'tables-trees',
            eyebrow: 'Chapter 19',
            title: 'Outcome Tables & Tree Diagrams',
            heading: 'Using Tables and Tree Diagrams',
            intro: (
                <>
                    <p className="mb-4 leading-relaxed text-slate-700">
                        When there are many outcomes, tables and tree diagrams help us count them systematically.
                    </p>
                </>
            ),
            content: [
                { type: 'paragraph', text: 'Example 7: Two dice thrown. Find probability of (a) at least one 5, (b) total divisible by 5.' },
                { type: 'table', headers: ['', '1','2','3','4','5','6'], rows: [
                    ['1', '2','3','4','5','6','7'],
                    ['2', '3','4','5','6','7','8'],
                    ['3', '4','5','6','7','8','9'],
                    ['4', '5','6','7','8','9','10'],
                    ['5', '6','7','8','9','10','11'],
                    ['6', '7','8','9','10','11','12']
                ], caption: 'Table 19.3 – Sums of two dice. Shaded row/col for 5; circled sums divisible by 5.' },
                { type: 'paragraph', text: 'Total outcomes = 36. (a) At least one 5: 11 outcomes (shaded) → 11/36. (b) Total divisible by 5: sums 5 (4 outcomes) and 10 (3 outcomes) = 7 outcomes → 7/36.' },
                { type: 'graph', component: Fig19_6, title: 'Fig 19.6 — Tree diagram with replacement (3B,2W)', caption: 'Branches show probabilities. p(BB)=3/5×3/5=9/25; p(BW)=3/5×2/5=6/25; etc.' },
                { type: 'paragraph', text: 'Example 8 (a) with replacement: p(BB)=9/25, one black one white = p(BW)+p(WB)=6/25+6/25=12/25.' },
                { type: 'graph', component: Fig19_7, title: 'Fig 19.7 — Tree diagram without replacement', caption: 'After first pick, denominators change.' },
                { type: 'paragraph', text: 'Example 8 (b) without replacement: p(BB)=3/5×2/4=3/10; p(BW)=3/5×2/4=3/10; p(WB)=2/5×3/4=3/10; p(WW)=2/5×1/4=1/10. Sum=1.' },
                { type: 'paragraph', text: 'Example 9: Three cards from a pack without replacement. Probability of at least two spades. Use tree diagram (Fig 19.8).' },
                { type: 'graph', component: Fig19_8, title: 'Fig 19.8 — Tree diagram for three cards (spades/non-spades)', caption: 'Probabilities: p(SSS)=13/52×12/51×11/50=11/850; p(SSN)+p(SNS)+p(NSS) for exactly two spades = 117/850; total = 128/850=64/425.' },
            ],
            practice: [
                'A pair of dice are thrown. What is the probability of getting (a) at least one six, (b) a total score of seven?',
                'A pentagonal spinner (Fig 19.9) is spun twice. What is the probability of (a) two 5s, (b) at least one 5, (c) total score of 5, (d) total > 5?',
                'When two dice are thrown, what is the probability of the total being prime?',
                'In a large crowd, three times as many men as women. Three people chosen at random. Assuming negligible effect, find probability they are (a) all men, (b) 2 women and 1 man.',
                'In a school, 4 out of 5 students have pens. If 2 students are picked at random, find probability (a) both have pen, (b) one has pen and one not.',
                'In Fig 19.10, a point is selected at random in the square. Find probability it lies (a) in triangle ADM, (b) in triangle ADM but not in ADN, (c) neither in ADM nor ADN.',
                'A ball is dropped into one of eight holes (Fig 19.11). (a) State probability of scoring 1. (b) If dropped twice, find probability of total 6, total 4.',
            ],
        },
    ];

    const activeIndex = Math.max(0, sections.findIndex((s) => s.id === active));
    const activeSection = sections[activeIndex] || sections[0];

    const handleNavigate = (id: string) => {
        setActive(id);
        requestAnimationFrame(() => {
            const lessonScrollArea = document.getElementById('lesson-scroll-area');
            if (lessonScrollArea) lessonScrollArea.scrollTo({ top: 0, behavior: 'auto' });
            else window.scrollTo({ top: 0, behavior: 'auto' });
        });
    };

    const goNext = () => { const n = sections[activeIndex + 1]; if (n) handleNavigate(n.id); };
    const goPrev = () => { const p = sections[activeIndex - 1]; if (p) handleNavigate(p.id); };

    return (
        <div id="cg-scroll-area" className="min-h-screen w-full bg-slate-50 pb-20 font-sans text-slate-900">
            <InkStyles />

            <div className={`relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-700 border-b-4 border-violet-900 pb-8 pt-10 text-white shadow-md`}>
                <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
                <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
                <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <span className={`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-violet-400/30 text-white border border-violet-200/40`}>CHAPTER 19</span>
                            <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">O-Level Mathematics</span>
                        </div>
                        <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                            <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                                <UkFlag className="h-3.5 w-5" /><span className="hidden sm:inline">English</span>
                            </button>
                            <button type="button" onClick={() => setLang('sn')} aria-pressed={lang === 'sn'}
                                className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all ${lang === 'sn' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}`}>
                                <ZwFlag className="h-3.5 w-5" /><span className="hidden sm:inline">ChiShona</span>
                            </button>
                        </div>
                    </div>
                    <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">Probability (2) – Combined Probabilities</h1>
                    <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
                        {lang === 'sn' ? "Kubatanidza zviitiko: zvinopindirana, zvinenge zvinorambana, uye kushandisa matafura nemiti yemikana." : "Combining events: mutually exclusive, independent, and using tables and tree diagrams."}
                    </p>
                </div>
            </div>

            <div className="lesson-topic-navigation sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
                <div className="w-full min-w-0 max-w-full px-2 sm:px-6 md:px-8 lg:px-10">
                    <div id="math-topic-rail" data-math-chapter-scroller="true"
                        className="flex w-full min-w-0 flex-nowrap items-center !justify-start gap-1.5 overflow-x-auto overscroll-x-contain pb-1 text-left sm:gap-2.5 sm:overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {sections.map((s) => {
                            const isActive = active === s.id;
                            return (
                                <button key={s.id} onClick={() => handleNavigate(s.id)}
                                    title={s.title}
                                    className={`shrink-0 whitespace-nowrap rounded-xl sm:rounded-2xl px-2 py-1.5 sm:px-4 sm:py-2 text-[10.5px] sm:text-xs font-black tracking-tight sm:tracking-normal transition-colors text-center sm:text-left ${isActive ? 'bg-violet-600 border-b-4 border-violet-900 text-white shadow-sm' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}`}>
                                    {s.title}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="w-full min-w-0 max-w-full overflow-x-hidden px-3 pt-8 sm:px-5 sm:pt-12 md:px-8 lg:px-10">
                <div key={activeSection.id}>
                    <Section section={activeSection} />
                </div>

                <div className="mt-8 flex items-center justify-between border-t-2 border-slate-200 pt-6">
                    <button onClick={goPrev} disabled={activeIndex === 0}
                        className="rounded-2xl border-2 border-b-4 border-slate-300 bg-white px-6 py-2.5 text-sm font-black text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
                        ← {lang === 'sn' ? 'Kwekumashure' : 'Previous'}
                    </button>
                    <span className="text-xs font-black tracking-wider text-slate-400">{activeIndex + 1} / {sections.length}</span>
                    <button onClick={goNext} disabled={activeIndex === sections.length - 1}
                        className="rounded-2xl border-2 border-b-4 border-emerald-700 bg-emerald-500 px-7 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-600 active:translate-y-0.5 disabled:opacity-40 disabled:active:translate-y-0">
                        {lang === 'sn' ? 'Enderera Mberi' : 'Next'} →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Probabilities;