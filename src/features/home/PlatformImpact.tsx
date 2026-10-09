import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { ArrowRight, ChevronLeft, ChevronRight, Sparkles, Sigma, Atom, UserRound, LogIn } from 'lucide-react';

interface SchoolLogoItem {
  id: string;
  name: string;
  image: string;
}

const INSTITUTION_LOGOS: SchoolLogoItem[] = [
  {
    id: 'uz',
    name: 'University of Zimbabwe',
    image: '/images/poly-logos/uz_new_logo-1.png',
  },
  {
    id: 'nust',
    name: 'National University of Science & Technology',
    image: '/images/poly-logos/nust.png',
  },
  {
    id: 'msu',
    name: 'Midlands State University',
    image: '/images/poly-logos/msu.jpeg',
  },
  {
    id: 'cut',
    name: 'Chinhoyi University of Technology',
    image: '/images/poly-logos/cut.jpeg',
  },
  {
    id: 'hit',
    name: 'Harare Institute of Technology',
    image: '/images/poly-logos/HIT_logo.png',
  },
  {
    id: 'africa-university',
    name: 'Africa University',
    image: '/images/poly-logos/Africa_University_Logo.jpg',
  },
  {
    id: 'gzu',
    name: 'Great Zimbabwe University',
    image: '/images/poly-logos/gzu.jpeg',
  },
  {
    id: 'buse',
    name: 'Bindura University of Science Education',
    image: '/images/poly-logos/buse.jpg',
  },
  {
    id: 'catholic-university',
    name: 'Catholic University of Zimbabwe',
    image: '/images/poly-logos/catholic-university.png',
  },
  {
    id: 'rcu',
    name: 'Reformed Church University',
    image: '/images/poly-logos/rcu.jpeg',
  },
  {
    id: 'harare-poly',
    name: 'Harare Polytechnic',
    image: '/images/poly-logos/harare-poly.png',
  },
  {
    id: 'bulawayo-poly',
    name: 'Bulawayo Polytechnic',
    image: '/images/poly-logos/bulawayo-poly.png',
  },
  {
    id: 'masvingo-poly',
    name: 'Masvingo Polytechnic',
    image: '/images/poly-logos/masvingo-poly.png',
  },
  {
    id: 'mutare-poly',
    name: 'Mutare Polytechnic',
    image: '/images/poly-logos/mutare-poly.png',
  },
  {
    id: 'peterhouse',
    name: 'Peterhouse Group of Schools',
    image: '/images/poly-logos/Peterhouse.jpg',
  },
  {
    id: 'st-georges',
    name: "St. George's College",
    image: '/images/poly-logos/stgeorges.webp',
  },
  {
    id: 'prince-edward',
    name: 'Prince Edward School',
    image: '/images/poly-logos/prince-edward.jpg',
  },
  {
    id: 'falcon',
    name: 'Falcon College',
    image: '/images/poly-logos/falcon.jpg',
  },
  {
    id: 'kutama',
    name: 'Kutama College',
    image: '/images/poly-logos/kutama.jpeg',
  },
  {
    id: 'cbc',
    name: 'Christian Brothers College',
    image: '/images/poly-logos/cbc-logo.jpg',
  },
  {
    id: 'churchill',
    name: 'Churchill Boys High School',
    image: '/images/poly-logos/Churchill_Boys_High_School.jpg',
  },
  {
    id: 'queen-elizabeth',
    name: 'Queen Elizabeth School',
    image: '/images/poly-logos/queeneli.jpeg',
  },
  {
    id: 'oriel-girls',
    name: 'Oriel Girls High School',
    image: '/images/school-logos/Oriel_Girls.jpg',
  },
  {
    id: 'gutu-high',
    name: 'Gutu High School',
    image: '/images/poly-logos/gutu-high.jpg',
  },
  {
    id: 'ndarama-high',
    name: 'Ndarama High School',
    image: '/images/poly-logos/ndarama.jpg',
  },
  {
    id: 'victoria-high',
    name: 'Victoria High School',
    image: '/images/poly-logos/victoria-high.jpg',
  },
  {
    id: 'bernard-mizeki',
    name: 'Bernard Mizeki College',
    image: '/images/poly-logos/bmuzekicol.jpeg',
  },
  {
    id: 'st-marks',
    name: "St. Mark's High School",
    image: '/images/poly-logos/stmarks.jpeg',
  },
  {
    id: 'st-joseph',
    name: "St. Joseph's",
    image: '/images/poly-logos/stjoseph.png',
  },
  {
    id: 'speciss',
    name: 'Speciss College',
    image: '/images/poly-logos/300px-Speciss-college-logo.png',
  },
  {
    id: 'trust-academy',
    name: 'Trust Academy',
    image: '/images/poly-logos/trustacademy.jpeg',
  },
  {
    id: 'successvale',
    name: 'Successvale Science College',
    image: '/images/poly-logos/successvale-science-college.jpeg',
  },
  {
    id: 'belvedere',
    name: "Belvedere Teachers' Technical College",
    image: '/images/poly-logos/belveredere.jpeg',
  },
  {
    id: 'masvingo-teachers',
    name: 'Masvingo Teachers College',
    image: '/images/poly-logos/masvingoteachers.jpeg',
  },
  {
    id: 'morgan-zintec',
    name: 'Morgan Zintec Teachers College',
    image: '/images/poly-logos/Morgan_Zintec.png',
  },
  {
    id: 'morgenster',
    name: 'Morgenster Teachers College',
    image: '/images/poly-logos/morgenstertechechers.jpeg',
  },
  {
    id: 'mutare-teachers',
    name: 'Mutare Teachers College',
    image: '/images/poly-logos/Mtc_logo.png',
  },
  {
    id: 'seke-teachers',
    name: 'Seke Teachers College',
    image: '/images/poly-logos/seketchrs.jpeg',
  },
  {
    id: 'bondolfi',
    name: 'Bondolfi Teachers College',
    image: '/images/poly-logos/bondolfi-1.webp',
  },
  {
    id: 'hwange-college',
    name: 'Hwange College of Education',
    image: '/images/poly-logos/hwangecol.jpeg',
  },
  {
    id: 'mushagashe',
    name: 'Mushagashe Vocational Training Centre',
    image: '/images/poly-logos/mushagashe.jpeg',
  },
  {
    id: 'msasa',
    name: 'Msasa Training Bureau',
    image: '/images/poly-logos/msasa.png',
  },
  {
    id: 'rujeko',
    name: 'Rujeko Education',
    image: '/images/poly-logos/rujekoeducation.png',
  },
  {
    id: 'gebhuza',
    name: 'Gebhuza',
    image: '/images/poly-logos/gebhuza.png',
  },
  {
    id: 'alheight',
    name: 'Great Heights',
    image: '/images/poly-logos/alheight.png',
  },
  {
    id: 'hiph',
    name: 'HIPH',
    image: '/images/poly-logos/b-w-hiph-logo-2048x617.webp',
  },
  {
    id: 'zimche',
    name: 'ZIMCHE',
    image: '/images/poly-logos/ZIMCHE-Round-Logo-2-Green-e1749622218752.png',
  },
];

const ACCENTS: Record<string, { card: string; pill: string }> = {
  violet: { card: 'from-violet-500 via-violet-600 to-indigo-800', pill: 'bg-violet-500/10 text-violet-600 dark:text-violet-300' },
  sky: { card: 'from-sky-400 via-sky-600 to-blue-800', pill: 'bg-sky-500/10 text-sky-600 dark:text-sky-300' },
  emerald: { card: 'from-emerald-400 via-emerald-600 to-teal-800', pill: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-300' },
  amber: { card: 'from-amber-300 via-orange-500 to-orange-700', pill: 'bg-amber-500/10 text-amber-600 dark:text-amber-300' },
  rose: { card: 'from-rose-400 via-rose-600 to-pink-800', pill: 'bg-rose-500/10 text-rose-600 dark:text-rose-300' },
};

const WHATS_NEW = [
  {
    icon: Sparkles,
    accent: 'violet',
    tag: 'AI Tutor',
    title: 'Exact graphs and step-by-step transformations',
    detail: 'The AI now draws accurate graphs and shows each transformation step by step.',
  },
  {
    icon: Sigma,
    accent: 'sky',
    tag: 'A-Level · Lower 6',
    title: 'Pure Mathematics: Algebra, fully expanded',
    detail: 'New practice bank, 2024 past paper questions and animated worked solutions.',
  },
  {
    icon: Atom,
    accent: 'emerald',
    tag: 'O-Level · Form 4',
    title: 'Combined Science Physics: new illustrated lessons',
    detail: 'Force, moments, machines, energy, fluids, friction, density, magnetism (fields, motors and generators) and Vernier measurements.',
  },
  {
    icon: UserRound,
    accent: 'amber',
    tag: 'Your Account',
    title: 'New student profile and download tracking',
    detail: 'A redesigned profile shows your 20 past paper download limit. Sign-in is now required to download.',
  },
  {
    icon: LogIn,
    accent: 'rose',
    tag: 'Sign-in',
    title: 'Smoother Google sign-in',
    detail: 'Fixed redirect problems so signing in with Google works reliably.',
  },
];

const WhatsNewCarousel: React.FC<{ onExplore: () => void }> = ({ onExplore }) => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = WHATS_NEW.length;

  // Auto-advance, looping back to the first update; resets whenever the user picks a slide
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % count), 4500);
    return () => window.clearTimeout(id);
  }, [active, paused, count]);
  const current = WHATS_NEW[active];
  const currentAccent = ACCENTS[current.accent];

  const prev = () => setActive((i) => (i - 1 + count) % count);
  const next = () => setActive((i) => (i + 1) % count);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-[#0b0b10] ring-1 ring-black/5 dark:ring-white/10 text-neutral-800 dark:text-white select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left gap-3 px-6 sm:px-10 pt-6 md:pt-8">
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/images/site/dance-sticker.gif"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="md:hidden h-20 w-20 -mb-1 pointer-events-none select-none object-contain mix-blend-multiply dark:mix-blend-normal dark:rounded-full"
            style={{ WebkitMaskImage: 'radial-gradient(closest-side, #000 60%, transparent 100%)', maskImage: 'radial-gradient(closest-side, #000 60%, transparent 100%)' }}
          />
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-none">What's New This Week</h3>
        </div>
        <button
          onClick={onExplore}
          className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-gray-900 font-bold text-sm active:scale-95 transition cursor-pointer group"
        >
          Explore
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Stage: clipped so inactive cards slide out of view vertically */}
      <div className="relative h-[250px] sm:h-[400px] md:h-[440px] overflow-hidden flex items-center justify-center md:justify-start md:pl-[12%]"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 22%, black 78%, transparent 100%)',
        }}
      >
        <div className="relative w-[var(--slide-width)]" style={{ '--slide-width': 'clamp(120px, 22vw, 220px)' } as React.CSSProperties}>
          {/* Slides strip */}
          <motion.div
            className="flex w-fit"
            animate={{ x: `${(-active * 100) / count}%` }}
            transition={{ type: 'spring', bounce: 0.1, duration: 0.8 }}
          >
            {WHATS_NEW.map((item, i) => {
              const isActive = active === i;
              const accent = ACCENTS[item.accent];
              const Icon = item.icon;
              return (
                <motion.button
                  type="button"
                  key={item.title}
                  onClick={() => setActive(i)}
                  aria-label={item.title}
                  className="w-[var(--slide-width)] shrink-0 cursor-pointer will-change-transform focus:outline-none"
                  animate={{
                    scale: isActive ? 1 : 0.8,
                    y: isActive ? 0 : `${(active - i > 0 ? -1 : 1) * 100}%`,
                  }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gradient-to-br ${accent.card} shadow-xl shadow-black/20 flex flex-col justify-between p-4 text-white`}>
                    <div aria-hidden="true" className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
                    <span className="relative text-[10px] font-bold uppercase tracking-widest text-white/80 text-left">
                      0{i + 1} / 0{count}
                    </span>
                    <Icon className="relative h-16 w-16 sm:h-20 sm:w-20 text-white/95 drop-shadow-lg" strokeWidth={1.5} />
                    <span className="relative text-left text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white/90">
                      {item.tag}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Active text, beside the card on desktop */}
          <AnimatePresence mode="popLayout">
            <motion.div
              key={active}
              className="hidden md:flex absolute left-full top-0 bottom-0 ml-8 w-[min(380px,34vw)] flex-col justify-center"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.9, filter: 'blur(4px)' }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.8 }}
            >
              <span className={`w-fit rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${currentAccent.pill}`}>
                {current.tag}
              </span>
              <p className="mt-3 text-2xl font-bold leading-tight tracking-tight">{current.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-gray-400">{current.detail}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop tiger, right side of the card */}
      <img
        src="/images/site/dance-sticker.gif"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="hidden lg:block -scale-x-100 absolute right-6 xl:right-10 bottom-6 h-64 w-64 xl:h-80 xl:w-80 pointer-events-none select-none object-contain mix-blend-multiply dark:mix-blend-normal dark:rounded-full"
        style={{ WebkitMaskImage: 'radial-gradient(closest-side, #000 60%, transparent 100%)', maskImage: 'radial-gradient(closest-side, #000 60%, transparent 100%)' }}
      />

      {/* Active text, below on mobile */}
      <div className="md:hidden px-8 pb-20 text-center min-h-[170px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center"
          >
            <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${currentAccent.pill}`}>
              {current.tag}
            </span>
            <p className="mt-2 text-base font-bold leading-snug">{current.title}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-neutral-600 dark:text-gray-400 line-clamp-3">{current.detail}</p>
          </motion.div>
        </AnimatePresence>
        <button onClick={onExplore} className="mt-3 inline-flex items-center gap-1 text-xs font-bold underline underline-offset-4 cursor-pointer">
          Explore <ArrowRight className="h-3 w-3" />
        </button>
      </div>

      {/* Controls pill */}
      <div className="absolute bottom-4 left-0 right-0 mx-auto w-fit px-2 flex items-center gap-3 rounded-full bg-neutral-200/60 dark:bg-white/10 backdrop-blur border border-neutral-200/80 dark:border-white/10 shadow-sm text-neutral-700 dark:text-gray-200">
        <button onClick={prev} aria-label="Previous update" className="p-2 cursor-pointer">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2 w-[110px] justify-center">
          {WHATS_NEW.map((item, i) => (
            <button
              key={item.title}
              onClick={() => setActive(i)}
              aria-label={`Show update ${i + 1}`}
              className={`h-2 rounded-full cursor-pointer transition-[width,background-color] duration-300 ${active === i ? 'w-7 bg-current' : 'w-2 bg-current/30'}`}
            />
          ))}
        </div>
        <button onClick={next} aria-label="Next update" className="p-2 cursor-pointer">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

interface PlatformImpactProps {
  onNavigate?: (page: string, params?: any) => void;
}

export const PlatformImpact: React.FC<PlatformImpactProps> = ({ onNavigate }) => {
  const navigate = useNavigate();

  const handleExplore = () => {
    if (onNavigate) {
      onNavigate('courses/overview');
    } else {
      navigate('/courses/overview');
    }
  };

  const subjectCount = useMemo(() => new Set(
    CURRICULUM_REGISTRY.flatMap((course) => course.subjects.map((subject) => subject.name))
  ).size, []);

  const stats = [
    { value: `${CURRICULUM_REGISTRY.length}+`, label: 'Courses offered' },
    { value: '450K+', label: 'Students helped' },
    { value: `${subjectCount}+`, label: 'Subjects covered' },
    { value: '34K+', label: 'Learning documents' },
  ];

  return (
    <section className="bg-white dark:bg-[#07070a] border-y border-gray-100 dark:border-white/5 py-14 md:py-20 text-gray-900 dark:text-white relative overflow-hidden transition-colors">
      <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
        
        {/* Intro Statement */}
        <p className="mx-auto max-w-3xl text-center text-sm sm:text-base md:text-lg font-medium leading-relaxed text-gray-700 dark:text-gray-300">
          Launched in 2024, Exam Sidemann was built to make trusted learning materials, exam preparation, and academic opportunities easier to access across Zimbabwe.
        </p>

        {/* Stats Grid - Clean numbers without icons or container boxes */}
        <div className="mt-10 md:mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8 max-w-5xl mx-auto">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-xs md:text-sm font-semibold text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* School Logos Rail Section - One Single Line Without Containers */}
      <div className="mt-12 md:mt-16 relative flex w-full items-center">
        {/* Marquee Container with Gradient Mask on edges */}
        <div 
          className="relative w-full overflow-hidden flex py-3"
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)', 
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' 
          }}
        >
          {/* Single Line Marquee */}
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center">
            {/* Set 1 */}
            <div className="flex items-center gap-10 sm:gap-14 pr-10 sm:pr-14">
              {INSTITUTION_LOGOS.map((item) => (
                <div
                  key={`logo-a-${item.id}`}
                  className="flex items-center justify-center shrink-0 hover:scale-105 transition-transform duration-200"
                  title={item.name}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 sm:h-12 w-auto max-w-[120px] object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Set 2 (for seamless loop) */}
            <div className="flex items-center gap-10 sm:gap-14 pr-10 sm:pr-14">
              {INSTITUTION_LOGOS.map((item) => (
                <div
                  key={`logo-b-${item.id}`}
                  className="flex items-center justify-center shrink-0 hover:scale-105 transition-transform duration-200"
                  title={item.name}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-10 sm:h-12 w-auto max-w-[120px] object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What's New This Week */}
      <div className="mx-auto w-[92%] md:w-[80%] mt-12 md:mt-20">
        <WhatsNewCarousel onExplore={handleExplore} />
      </div>
    </section>
  );
};

