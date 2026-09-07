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
      <div className="mt-12 md:mt-16 relative w-full overflow-hidden">
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

      {/* What You Can Learn Banner Section */}
      <div className="mx-auto w-[92%] md:w-[80%] mt-12 md:mt-20">
        <div className="relative overflow-hidden rounded-2xl bg-[#0d0d10] text-white shadow-2xl flex flex-row items-stretch min-h-[160px] sm:min-h-[220px] md:min-h-[390px]">

          {/* Left: Content */}
          <div className="relative z-10 flex flex-col justify-center py-5 px-4 sm:px-10 md:px-12 w-[55%] sm:w-[52%] shrink-0">
            <p className="text-[9px] sm:text-xs font-bold uppercase tracking-widest text-white mb-1.5 sm:mb-2.5">
              Exam Sidemann
            </p>
            <h3 className="text-sm sm:text-2xl md:text-3xl font-black text-white leading-snug tracking-tight mb-2 sm:mb-3">
              Everything you need to pass, from O-Level to Polytechnic ND.
            </h3>
            <p className="hidden sm:block text-xs sm:text-sm text-gray-400 leading-relaxed mb-4 sm:mb-5 max-w-lg">
              Past papers with marking schemes, interactive notes, AI tutoring, and more — tailored for Zimbabwe's curriculum.
            </p>
            <div>
              <button
                onClick={handleExplore}
                className="inline-flex items-center gap-1.5 px-3 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-white text-gray-900 font-bold text-[10px] sm:text-sm hover:bg-gray-100 transition-all duration-200 active:scale-95 cursor-pointer group shadow"
              >
                <span>Explore</span>
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right: Image — visible on all screen sizes */}
          <div className="relative w-[45%] sm:w-[48%] shrink-0 overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-10 sm:w-24 bg-gradient-to-r from-[#0d0d10] to-transparent z-10" />
            <img
              src="/images/site/home2.jpg"
              alt="Student studying on Exam Sidemann"
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

