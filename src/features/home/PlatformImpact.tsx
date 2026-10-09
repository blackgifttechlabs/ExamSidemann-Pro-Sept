import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CURRICULUM_REGISTRY } from '../../data/constants';
import { ArrowRight } from 'lucide-react';

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

const WHATS_NEW = [
  {
    tag: 'AI Tutor',
    title: 'Exact graphs and step-by-step transformations',
    detail: 'The AI now draws accurate graphs and shows each transformation step by step.',
  },
  {
    tag: 'A-Level · Lower 6',
    title: 'Pure Mathematics: Algebra, fully expanded',
    detail: 'New practice bank, 2024 past paper questions and animated worked solutions.',
  },
  {
    tag: 'O-Level · Form 4',
    title: 'Combined Science Physics: new illustrated lessons',
    detail: 'Force, moments, machines, energy, fluids, friction, density, magnetism (fields, motors and generators) and Vernier measurements.',
  },
  {
    tag: 'Your Account',
    title: 'New student profile and download tracking',
    detail: 'A redesigned profile shows your 20 past paper download limit. Sign-in is now required to download.',
  },
  {
    tag: 'Sign-in',
    title: 'Smoother Google sign-in',
    detail: 'Fixed redirect problems so signing in with Google works reliably.',
  },
];

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
      <div className="mt-12 md:mt-16 relative flex w-full items-center min-h-24 sm:min-h-28">
        {/* Cartoon in the middle of the rail. The GIF has a solid near-white background,
            so its edges are feathered into a mist instead of showing a straight line. */}
        <img
          src="/images/site/dance-sticker.gif"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-24 w-24 sm:h-28 sm:w-28 -translate-x-1/2 -translate-y-1/2 select-none object-contain"
          style={{
            WebkitMaskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
            maskImage: 'radial-gradient(closest-side, #000 55%, transparent 100%)',
          }}
          loading="lazy"
        />
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
        <div className="relative overflow-hidden rounded-2xl bg-[#0d0d10] text-white shadow-2xl flex flex-col md:flex-row items-stretch">

          {/* Left: Heading */}
          <div className="flex flex-col justify-center py-6 px-5 sm:px-10 md:px-12 md:w-[40%] shrink-0">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white mb-2.5">
              Exam Sidemann
            </p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-snug tracking-tight mb-3">
              What's New This Week
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-5 max-w-sm">
              Fresh lessons, smarter AI tutoring and account upgrades, all added in the last seven days.
            </p>
            <div>
              <button
                onClick={handleExplore}
                className="inline-flex items-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-white text-gray-900 font-bold text-xs sm:text-sm hover:bg-gray-100 transition-all duration-200 active:scale-95 cursor-pointer group shadow"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Feature list */}
          <ul className="flex-1 divide-y divide-white/10 border-t md:border-t-0 md:border-l border-white/10 px-5 sm:px-10 md:px-8 py-2 md:py-6 self-center w-full">
            {WHATS_NEW.map((item) => (
              <li key={item.title} className="py-3.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{item.tag}</p>
                <p className="text-sm sm:text-base font-bold text-white leading-snug">{item.title}</p>
                <p className="mt-1 text-xs sm:text-sm text-gray-400 leading-relaxed">{item.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

