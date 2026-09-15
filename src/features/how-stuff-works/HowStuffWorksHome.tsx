import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Telescope, Zap, Atom, Droplets } from 'lucide-react';

interface Category {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  route: string;
  available: boolean;
}

const CATEGORIES: Category[] = [
  {
    id: 'astronomy',
    label: 'Astronomy & Space',
    description: 'Planets, black holes, gravity, rockets and the secrets of the cosmos.',
    icon: Telescope,
    gradient: 'from-[#4b137b] via-[#211965] to-[#1b1b4d]',
    glowColor: 'rgba(139,92,246,0.4)',
    route: '/how-stuff-works/astronomy/',
    available: true,
  },
  {
    id: 'physics',
    label: 'Physics & Forces',
    description: 'Energy, motion, electricity and the laws that govern the universe.',
    icon: Zap,
    gradient: 'from-[#a34a16] via-[#7f1d1d] to-[#1b1b4d]',
    glowColor: 'rgba(251,191,36,0.35)',
    route: '/how-stuff-works/physics/',
    available: false,
  },
  {
    id: 'chemistry',
    label: 'Chemistry & Matter',
    description: 'Atoms, reactions, elements and why things are made the way they are.',
    icon: Atom,
    gradient: 'from-[#0f766e] via-[#064e46] to-[#031b16]',
    glowColor: 'rgba(52,211,153,0.35)',
    route: '/how-stuff-works/chemistry/',
    available: false,
  },
  {
    id: 'earth',
    label: 'Earth & Nature',
    description: 'Weather, oceans, volcanoes and the living systems of our planet.',
    icon: Droplets,
    gradient: 'from-[#164e63] via-[#0f766e] to-[#071a22]',
    glowColor: 'rgba(6,182,212,0.35)',
    route: '/how-stuff-works/earth/',
    available: false,
  },
];

export const HowStuffWorksHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_80%_12%,rgba(65,68,180,.24),transparent_24%),radial-gradient(circle_at_50%_90%,rgba(110,31,221,.20),transparent_35%),#050505]" />

      <section className="relative overflow-hidden border-b border-white/10 text-white shadow-[0_24px_60px_rgba(8,0,28,.4)]">
        <div className="absolute inset-0 bg-[url('https://i.ibb.co/rfvwxmGn/es-heroo.jpg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#35106e]/60 via-[#120b2d]/45 to-[#050505]/80" />
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.11)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.11)_1px,transparent_1px)] [background-size:34px_34px]" />

        <button
          onClick={() => navigate('/')}
          className="absolute left-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 transition hover:bg-white/20"
          aria-label="Back to home"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>

        <div className="relative z-10 mx-auto flex min-h-[280px] max-w-[1280px] items-center justify-center px-4 py-9 sm:px-8 lg:px-14">
          <div className="max-w-3xl text-center">
            <h1 className="mt-2 text-4xl font-black leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              How Stuff Works
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
              Interactive 3D simulations and visual explainers that show you how the universe actually works.
            </p>
          </div>
        </div>
      </section>

      <main className="relative z-10 px-4 py-8 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => cat.available && navigate(cat.route)}
                disabled={!cat.available}
                className={`group relative min-h-[280px] overflow-hidden rounded-[14px] border text-left transition-all duration-300 ${
                  cat.available
                    ? 'border-white/20 hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-950/70 cursor-pointer'
                    : 'border-white/5 cursor-not-allowed opacity-50'
                }`}
                style={
                  cat.available
                    ? ({
                        boxShadow: `0 0 0 0 ${cat.glowColor}`,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-95`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,.08),transparent_18%),linear-gradient(120deg,transparent_0%,rgba(0,0,0,.10)_100%)]" />
                {cat.available && (
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: `radial-gradient(ellipse at top left, ${cat.glowColor}, transparent 70%)` }} />
                )}

                <div className="relative z-10 flex h-full flex-col p-7">
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-inner">
                      <Icon size={28} className="text-white" />
                    </span>
                    {cat.available ? (
                      <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-white">
                        Available
                      </span>
                    ) : (
                      <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-slate-300">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-white leading-tight tracking-tight">
                    {cat.label}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">
                    {cat.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
