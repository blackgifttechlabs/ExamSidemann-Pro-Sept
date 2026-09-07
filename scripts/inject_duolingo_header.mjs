import fs from 'fs';

const BASE = 'src/features/courses/o-level/form-4/mathematics';

// Flag SVGs to insert
const FLAGS = `
const UkFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={\`shrink-0 overflow-hidden rounded-sm shadow-xs \${className}\`} aria-hidden="true">
    <clipPath id="uk-clip-s"><path d="M0,0 v30 h60 v-30 z"/></clipPath>
    <clipPath id="uk-clip-t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
    <g clipPath="url(#uk-clip-s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#uk-clip-t)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const ZwFlag = ({ className = 'h-4 w-6' }) => (
  <svg viewBox="0 0 60 30" className={\`shrink-0 overflow-hidden rounded-sm shadow-xs \${className}\`} aria-hidden="true">
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
`;

const FILES = [
  {
    file: 'GeneralArithmetic.tsx',
    chapterLabel: 'CHAPTER 1',
    pageTitle: 'General Arithmetic',
    scrollAreaId: 'ga-scroll-area',
    componentName: 'GeneralArithmetic',
    animName: 'gaEnter',
    gradient: 'from-emerald-500 via-teal-600 to-emerald-700',
    border: 'border-b-4 border-emerald-800',
    navActive: 'bg-emerald-600 border-b-4 border-emerald-800 text-white shadow-sm',
    badge: 'bg-emerald-400/30 text-white border border-emerald-200/40',
    intro: "Approximations, estimates, and limits of accuracy. Every number you round, every measurement you take, carries a little bit of uncertainty — in this chapter, you'll learn how to handle it like a mathematician.",
    introSn: "Kuyereketa, kufungidzira, nekuyera zvakakwana. Nhamba dzose dzaunomba nezviyero zvose zvaunotora zvinotakura kusajairika — muchitsauko chino, uchadzidzwa kuzviita sesainzi.",
  },
  {
    file: 'CircleGeometry.tsx',
    chapterLabel: 'CHAPTER 3',
    pageTitle: 'Circle Geometry (2): Tangents',
    scrollAreaId: 'cg-scroll-area',
    componentName: 'CircleGeometry',
    animName: 'gcEnter',
    gradient: 'from-violet-600 via-purple-700 to-indigo-700',
    border: 'border-b-4 border-violet-900',
    navActive: 'bg-violet-600 border-b-4 border-violet-900 text-white shadow-sm',
    badge: 'bg-violet-400/30 text-white border border-violet-200/40',
    intro: "Tangents, the angles they create, and the two circle theorems that turn them into a shortcut for angle-chasing. Press play on any diagram to see the reasoning unfold step by step.",
    introSn: "Tangents, makona avaita, nemirayiridzo miviri yemacircle inokuita nzira pfupi yekutevedzera makona. Dhinda play pane dhiyagiramu yega yega kuona nhanho dzekufunga dzichizarurwa.",
  },
  {
    file: 'GeometricalConstructions.tsx',
    chapterLabel: 'CHAPTER 2',
    pageTitle: 'Geometrical Constructions',
    scrollAreaId: 'gc-scroll-area',
    componentName: 'GeometricalConstructions',
    animName: 'gcEnter',
    gradient: 'from-amber-500 via-orange-500 to-yellow-600',
    border: 'border-b-4 border-amber-700',
    navActive: 'bg-amber-500 border-b-4 border-amber-700 text-white shadow-sm',
    badge: 'bg-amber-300/30 text-white border border-amber-200/40',
    intro: "Master the art of precise drawing with a ruler and compass — from bisecting lines and angles to constructing regular polygons and accurate scale drawings.",
    introSn: "Dzidza unyanzvi hwekudhirowa zvakananga uchiburitsa rezha necompasses — kubva pakupatsanura miringa nemakona kusvika pakugadzira polygon dzakakwana.",
  },
  {
    file: 'GraphsGradient.tsx',
    chapterLabel: 'CHAPTER 5',
    pageTitle: 'Graphs & Gradient',
    scrollAreaId: 'gg-scroll-area',
    componentName: 'GraphsGradient',
    animName: 'gcEnter',
    gradient: 'from-sky-500 via-blue-600 to-cyan-600',
    border: 'border-b-4 border-sky-800',
    navActive: 'bg-sky-500 border-b-4 border-sky-800 text-white shadow-sm',
    badge: 'bg-sky-300/30 text-white border border-sky-200/40',
    intro: "Drawing and interpreting straight-line graphs — from plotting a table of values to reading gradient and y-intercept straight from the equation, finding a line's equation from two clues, and measuring gradient on a curve using a tangent.",
    introSn: "Kudhirowa nekutsanangura magraph emutsetse wakatwasuka — kubva pakuisa nhamba patepu kusvika pakuverenga gradient ne y-intercept zvakananga kubva mumutemo.",
  },
  {
    file: 'TheSineRule.tsx',
    chapterLabel: 'CHAPTER 4',
    pageTitle: 'The Sine Rule',
    scrollAreaId: 'sr-scroll-area',
    componentName: 'TheSineRule',
    animName: 'gcEnter',
    gradient: 'from-rose-500 via-pink-500 to-red-500',
    border: 'border-b-4 border-rose-700',
    navActive: 'bg-rose-500 border-b-4 border-rose-700 text-white shadow-sm',
    badge: 'bg-rose-300/30 text-white border border-rose-200/40',
    intro: "Ratios for obtuse angles, the sine rule, solving triangles completely, and bearings problems. Once the sine rule clicks, every triangle becomes solvable — no right angle required.",
    introSn: "Ratio dzekona dzakapamhama, mutemo we sine, kugadzirisa triangle zvakakwana, nemibvunzo ye bearings. Kana mutemo we sine uchinzwika, triangle yose inogadziriswa.",
  },
  {
    file: 'Variation.tsx',
    chapterLabel: 'CHAPTER 9',
    pageTitle: 'Variation',
    scrollAreaId: 'vn-scroll-area',
    componentName: 'Variation',
    animName: 'gcEnter',
    gradient: 'from-fuchsia-600 via-pink-600 to-purple-600',
    border: 'border-b-4 border-fuchsia-800',
    navActive: 'bg-fuchsia-600 border-b-4 border-fuchsia-800 text-white shadow-sm',
    badge: 'bg-fuchsia-300/30 text-white border border-fuchsia-200/40',
    intro: "Direct, inverse, joint and partial variation — the four ways one quantity can depend on another. Understand the constant of proportionality and you can solve any variation problem in seconds.",
    introSn: "Variation yakatwasuka, yakadzokera, yakabatana, neye pakati — nzira ina dzinowanika nhamba imwe ichiterera imwe. Kunzwisisa constant yekuenzana kunokupa kukwanisa kugadzirisa mibvunzo yose ye variation.",
  },
];

for (const cfg of FILES) {
  const filePath = `${BASE}/${cfg.file}`;
  let src = fs.readFileSync(filePath, 'utf-8');

  // 1. Add flag SVGs after last import if not present
  if (!src.includes('const UkFlag')) {
    const lastImportEnd = (() => {
      let pos = 0, found = -1;
      while ((pos = src.indexOf('\nimport ', pos + 1)) !== -1) found = pos;
      if (found === -1) return 0;
      return src.indexOf('\n', found + 1) + 1;
    })();
    src = src.slice(0, lastImportEnd) + FLAGS + '\n' + src.slice(lastImportEnd);
    console.log(`[${cfg.file}] ✓ Added flags`);
  }

  // 2. Replace the old static header + TopicNav usage
  // Pattern A: <div className="... border-b ... bg-white pb-8 pt-12"> ... </div>\n\n      <TopicNav sections={sections} activeId={active} onNavigate={handleNavigate} />
  // Pattern B: <div className="overflow-x-hidden border-b ..."> ... <TopicNav.../>
  // We find the div that wraps the old header by looking for the TopicNav usage and backing up
  const topicNavUsageIdx = src.indexOf('<TopicNav sections={sections} activeId={active} onNavigate={handleNavigate} />');
  if (topicNavUsageIdx !== -1) {
    // Find the start of the header block (look backwards for the outer div)
    // The header div starts around: <div className="... border-b ... bg-white
    // We'll find the <div that comes after <InkStyles /> or similar
    const inkStylesIdx = src.indexOf('<InkStyles />', topicNavUsageIdx - 3000);
    const headerStart = src.indexOf('\n      <div', inkStylesIdx > 0 ? inkStylesIdx : topicNavUsageIdx - 2000);
    const afterTopicNav = topicNavUsageIdx + '<TopicNav sections={sections} activeId={active} onNavigate={handleNavigate} />'.length;
    
    const NEW_HEADER = `
      {/* Duolingo Gradient Header */}
      <div className={\`relative overflow-hidden bg-gradient-to-r ${cfg.gradient} ${cfg.border} pb-8 pt-10 text-white shadow-md\`}>
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
        <div className="w-full min-w-0 max-w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className={\`inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase ${cfg.badge}\`}>${cfg.chapterLabel}</span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">O-Level Mathematics</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl bg-black/20 p-1.5 backdrop-blur-md border border-white/25 shadow-inner">
              <button type="button" onClick={() => setLang('en')} aria-pressed={lang === 'en'}
                className={\`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all \${lang === 'en' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}\`}>
                <UkFlag className="h-3.5 w-5" /><span className="hidden sm:inline">English</span>
              </button>
              <button type="button" onClick={() => setLang('sn')} aria-pressed={lang === 'sn'}
                className={\`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-black transition-all \${lang === 'sn' ? 'bg-white text-slate-900 shadow-md' : 'text-white/85 hover:bg-white/10 hover:text-white'}\`}>
                <ZwFlag className="h-3.5 w-5" /><span className="hidden sm:inline">ChiShona</span>
              </button>
            </div>
          </div>
          <h1 className="mt-4 mb-2 text-3xl font-black tracking-tight text-white drop-shadow-sm sm:text-4xl">${cfg.pageTitle}</h1>
          <p className="max-w-3xl text-sm leading-relaxed text-white/90 sm:text-base">
            {lang === 'sn' ? "${cfg.introSn}" : "${cfg.intro}"}
          </p>
        </div>
      </div>

      {/* Left-aligned pill navigation */}
      <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 bg-white/95 py-2.5 backdrop-blur-md shadow-xs">
        <div className="w-full min-w-0 max-w-full px-4 sm:px-6 md:px-8 lg:px-10">
          <div className="flex w-full flex-nowrap items-center justify-start gap-2 overflow-x-auto overscroll-x-contain scroll-smooth text-left [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {sections.map((s) => {
              const isActive = active === s.id;
              return (
                <button key={s.id} data-topic-id={s.id} onClick={() => handleNavigate(s.id)}
                  className={\`shrink-0 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-black transition-all active:translate-y-0.5 \${isActive ? '${cfg.navActive}' : 'border-2 border-b-4 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:border-slate-300'}\`}>
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>`;

    src = src.slice(0, headerStart) + NEW_HEADER + src.slice(afterTopicNav);
    console.log(`[${cfg.file}] ✓ Replaced header + TopicNav`);
  } else {
    console.warn(`[${cfg.file}] ⚠ TopicNav usage not found — skipping header replacement`);
  }

  // 3. Add lang state to the component (after the existing useState calls)
  const compStart = src.indexOf(`export const ${cfg.componentName} = ()`);
  if (compStart !== -1 && !src.includes("setLang") ) {
    // Find first useState in the component
    const firstUseState = src.indexOf('useState(', compStart);
    if (firstUseState !== -1) {
      const lineEnd = src.indexOf('\n', firstUseState);
      src = src.slice(0, lineEnd + 1) + "  const [lang, setLang] = useState('en');\n" + src.slice(lineEnd + 1);
      console.log(`[${cfg.file}] ✓ Added lang state`);
    }
  }

  // 4. Upgrade the Prev/Next footer buttons
  const oldPrev = src.indexOf("← Previous");
  if (oldPrev !== -1) {
    // Find the containing div (mt-4 flex ...)
    const footerDivStart = src.lastIndexOf('\n        <div', oldPrev);
    const footerDivEnd = src.indexOf('</div>', oldPrev) + 6;
    const NEW_FOOTER = `
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
        </div>`;
    src = src.slice(0, footerDivStart) + NEW_FOOTER + src.slice(footerDivEnd);
    console.log(`[${cfg.file}] ✓ Upgraded footer buttons`);
  }

  // 5. Remove old TopicNav component definition
  const topicNavDefIdx = src.search(/\nconst TopicNav\s*=/);
  if (topicNavDefIdx !== -1) {
    // find the closing }; or ); for the component
    let depth = 0, started = false;
    let endIdx = topicNavDefIdx;
    for (let i = topicNavDefIdx; i < src.length; i++) {
      const ch = src[i];
      if (ch === '(' || ch === '{') { depth++; started = true; }
      if (ch === ')' || ch === '}') depth--;
      if (started && depth === 0) {
        endIdx = src.indexOf('\n', i) + 1;
        // skip trailing blank line
        if (src[endIdx] === '\n') endIdx++;
        break;
      }
    }
    src = src.slice(0, topicNavDefIdx + 1) + src.slice(endIdx);
    console.log(`[${cfg.file}] ✓ Removed TopicNav definition`);
  }

  fs.writeFileSync(filePath, src, 'utf-8');
  console.log(`[${cfg.file}] ✅ Done\n`);
}

console.log('\n🎉 All done!');
