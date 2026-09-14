import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface TopicCard {
  id: string;
  label: string;
  tagline: string;
  emoji: string;
  route: string;
  available: boolean;
  accentColor: string;
  bg: string;
}

const TOPICS: TopicCard[] = [
  {
    id: 'gravity',
    label: 'How Gravity Works',
    tagline: 'Interactive experiment: change Sun mass & Earth distance to see why orbits curve.',
    emoji: '☀️',
    route: '/how-stuff-works/astronomy/gravity/',
    available: true,
    accentColor: '#f97316',
    bg: 'radial-gradient(ellipse at top, rgba(249,115,22,0.2) 0%, transparent 70%)',
  },
  {
    id: 'orbits',
    label: 'How Orbits Work',
    tagline: 'Explore 3D Keplerian planetary orbits, speeds, and natural moons across the Solar System.',
    emoji: '🪐',
    route: '/how-stuff-works/astronomy/orbits/',
    available: true,
    accentColor: '#38bdf8',
    bg: 'radial-gradient(ellipse at top, rgba(56,189,248,0.2) 0%, transparent 70%)',
  },
  {
    id: 'orbits-2',
    label: 'How Orbits Work 2: Earth & Satellites',
    tagline: 'Sun, Earth, Moon & Satellites: zoom in and pause to see forward velocity vs inward gravity.',
    emoji: '🛰️',
    route: '/how-stuff-works/astronomy/orbits-2/',
    available: true,
    accentColor: '#06b6d4',
    bg: 'radial-gradient(ellipse at top, rgba(6,182,212,0.2) 0%, transparent 70%)',
  },
  {
    id: 'light-travels',
    label: 'How Light Travels',
    tagline: 'Cosmic speed limit: 8 min 20 sec from the Sun, 100 years from distant stars.',
    emoji: '✨',
    route: '/how-stuff-works/astronomy/light-travels/',
    available: true,
    accentColor: '#38bdf8',
    bg: 'radial-gradient(ellipse at top, rgba(56,189,248,0.2) 0%, transparent 70%)',
  },
  {
    id: 'black-holes',
    label: 'What Are Black Holes?',
    tagline: 'Gravity so strong that not even light can escape — explore the edge of the known.',
    emoji: '🕳️',
    route: '/how-stuff-works/astronomy/black-holes/',
    available: false,
    accentColor: '#a78bfa',
    bg: 'radial-gradient(ellipse at top, rgba(139,92,246,0.18) 0%, transparent 70%)',
  },
  {
    id: 'rockets',
    label: 'How Rockets Work',
    tagline: "Newton's 3rd Law at full throttle — action and reaction that escapes Earth's gravity.",
    emoji: '🚀',
    route: '/how-stuff-works/astronomy/rockets/',
    available: false,
    accentColor: '#fb923c',
    bg: 'radial-gradient(ellipse at top, rgba(251,146,60,0.18) 0%, transparent 70%)',
  },
  {
    id: 'planets',
    label: 'The Solar System',
    tagline: 'Eight planets, dwarf planets, moons and the vast emptiness between them.',
    emoji: '🪐',
    route: '/how-stuff-works/astronomy/solar-system/',
    available: false,
    accentColor: '#38bdf8',
    bg: 'radial-gradient(ellipse at top, rgba(56,189,248,0.18) 0%, transparent 70%)',
  },
];

export const AstronomyHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* Deep space background */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 55%), #050505',
        }}
      />

      {/* Starfield dots */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 80 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() > 0.85 ? 2 : 1,
              height: Math.random() > 0.85 ? 2 : 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.2 + Math.random() * 0.5,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 px-[50px] pt-4 pb-2">
        <button
          onClick={() => navigate('/how-stuff-works/')}
          className="absolute left-4 top-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-200 shrink-0"
          aria-label="Back"
        >
          <ArrowLeft size={18} className="text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
            The Universe
          </h1>
        </div>
      </div>

      {/* Topics grid */}
      <div className="relative z-10 px-[100px] pb-16 mt-2">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 w-full">
          {TOPICS.map((topic) => (
            <button
              key={topic.id}
              onClick={() => topic.available && navigate(topic.route)}
              disabled={!topic.available}
              className={`group relative text-left rounded-[9px] bg-white overflow-hidden transition-all duration-300 shadow-md ${
                topic.available
                  ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl'
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              <div className="relative z-10 flex h-full flex-col items-center text-center p-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-[9px] bg-gray-100 text-2xl leading-none shadow-sm mb-3">
                  {topic.emoji}
                </span>

                <h2 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                  {topic.label}
                </h2>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-4">
                  {topic.tagline}
                </p>

                <div className="mt-auto w-full pt-3 border-t border-gray-100">
                  <span
                    className={`block w-full text-xs font-semibold rounded-[9px] px-4 py-2.5 ${
                      topic.available
                        ? 'bg-gray-900 text-white group-hover:bg-black'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {topic.available ? 'Open →' : 'Locked'}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
