import React from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Layers3 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LEVELS, REVEAL_STYLES } from './practicalsCatalog';
import { PracticalsDesktopSidebar } from './common/PracticalsDesktopSidebar';
import { canonicalPathFor } from '../../utils/siteUrl';

const LEVEL_ORDER = ['olevel', 'alevel', 'polytechnic'];

const LEVEL_CARDS = LEVEL_ORDER
  .map((id) => LEVELS.find((level) => level.id === id))
  .filter((level): level is (typeof LEVELS)[number] => Boolean(level));

const LEVEL_CARD_DETAILS: Record<string, {
  image: string;
  eyebrow: string;
  shell: string;
  imageBackdrop: string;
}> = {
  olevel: {
    image: '/images/prac/combinedscie.png',
    eyebrow: 'Secondary school',
    shell: 'bg-[#087f6f] shadow-[0_18px_40px_rgba(8,127,111,.22)]',
    imageBackdrop: 'bg-[#14a58f]',
  },
  alevel: {
    image: '/images/prac/physicss.png',
    eyebrow: 'Advanced study',
    shell: 'bg-[#315aa8] shadow-[0_18px_40px_rgba(49,90,168,.24)]',
    imageBackdrop: 'bg-[#4372c8]',
  },
  polytechnic: {
    image: '/images/prac/IT.png',
    eyebrow: 'Technical training',
    shell: 'bg-[#c35418] shadow-[0_18px_40px_rgba(195,84,24,.23)]',
    imageBackdrop: 'bg-[#dc702e]',
  },
};

const IT_CARD_IMAGES = [
  { src: '/images/prac/it/linux.webp', label: 'Linux' },
  { src: '/images/prac/it/cpp.png', label: 'C++' },
  { src: '/images/prac/it/csharp.png', label: 'C#' },
  { src: '/images/prac/it/sql.png', label: 'SQL' },
  { src: '/images/prac/it/html.jpg', label: 'HTML' },
];

export const AllPracticalsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f4f7fa] text-slate-950 dark:bg-[#0c1017] dark:text-white">
      <style>{REVEAL_STYLES}</style>
      <PracticalsDesktopSidebar activeLevelId="all" />

      <header className="border-b border-slate-200 bg-white px-4 py-4 dark:border-white/10 dark:bg-[#111722] lg:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            aria-label="Back to home"
            className="grid h-10 w-10 shrink-0 place-items-center text-slate-800 dark:text-white"
          >
            <ArrowLeft size={23} strokeWidth={2.4} />
          </button>
          <div>
            <p className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">Practical labs</p>
            <h1 className="text-xl font-black">Choose your course</h1>
          </div>
        </div>
      </header>

      <main className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:min-h-screen lg:pl-[292px] lg:pr-8 lg:pt-10 xl:pl-[308px] xl:pr-12">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-6 hidden items-end justify-between gap-6 lg:flex">
            <div>
              <p className="flex items-center gap-2 text-xs font-black uppercase text-slate-500 dark:text-slate-400">
                <Layers3 size={15} /> Practical labs
              </p>
              <h1 className="mt-2 text-3xl font-black xl:text-4xl">Choose your course</h1>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Select a study level to see its subjects and practical activities.</p>
            </div>
          </div>

          <section aria-label="Practical courses" className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {LEVEL_CARDS.map((level) => {
              const details = LEVEL_CARD_DETAILS[level.id];
              const practicalCount = level.categories.reduce(
                (total, category) => total + category.experiments.length,
                0
              );
              return (
                <Link
                  key={level.id}
                  to={canonicalPathFor(level.route)}
                  className={`group flex min-h-[350px] min-w-0 flex-col overflow-hidden rounded-lg text-white transition duration-300 hover:-translate-y-1 hover:brightness-[1.03] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-sky-500 ${details.shell}`}
                >
                  <div className={`relative h-[220px] shrink-0 overflow-hidden ${details.imageBackdrop}`}>
                    <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />
                    <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-black/10" />
                    {level.id === 'polytechnic' ? (
                      <div className="relative z-10 grid h-full grid-cols-5 items-center gap-1 px-4 sm:gap-2 sm:px-6">
                        {IT_CARD_IMAGES.map((image, index) => (
                          <img
                            key={image.src}
                            src={image.src}
                            alt={image.label}
                            className={`w-full object-contain drop-shadow-lg transition-transform duration-500 group-hover:-translate-y-1 ${index % 2 === 0 ? 'rotate-[-4deg]' : 'rotate-[4deg]'}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <img
                        src={details.image}
                        alt=""
                        aria-hidden="true"
                        className="relative z-10 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    )}
                  </div>

                  <div className="flex min-h-0 flex-1 flex-col px-5 pb-0 pt-5 sm:px-6">
                    <p className="text-[10px] font-black uppercase text-white/70">{details.eyebrow}</p>
                    <h2 className="mt-1 text-2xl font-black">{level.label}</h2>

                    <div className="mt-auto flex min-h-[58px] items-center justify-between gap-4 border-t border-white/25 py-4">
                      <span className="flex items-center gap-2 text-xs font-black uppercase">
                        <BookOpen size={16} /> {practicalCount} {level.itemNoun ?? 'practical'}{practicalCount === 1 ? '' : 's'}
                      </span>
                      <span className="flex items-center gap-2 text-xs font-black uppercase">
                        View courses <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AllPracticalsPage;
