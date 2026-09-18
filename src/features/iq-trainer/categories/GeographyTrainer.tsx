import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, Play, RotateCcw, X, Flag, Globe2, Landmark, Trophy, Flame, Volume2, VolumeX } from 'lucide-react';
import { ISO_MAP, MONUMENTS_MAP } from '../data/geographyData';
import { COUNTRY_DETAILS } from '../data/countryDetails';
import { CountryDetailsCard } from './CountryDetailsCard';

declare global {
  interface Window {
    d3?: any;
    topojson?: any;
  }
}

interface GeographyTrainerProps {
  onBack: () => void;
  onAddXp?: (xp: number) => void;
  soundEnabled?: boolean;
  headerActionsTarget?: HTMLElement | null;
}

type GameMode = 'explore' | 'flag' | 'name' | 'monument';

export const GeographyTrainer: React.FC<GeographyTrainerProps> = ({
  onBack,
  onAddXp,
  soundEnabled = true,
  headerActionsTarget,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<{ name: string; alpha2: string; id: string } | null>(null);
  const [contentAnimKey, setContentAnimKey] = useState(0);
  const [contentTransitioning, setContentTransitioning] = useState(false);
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('explore');
  const [showingMenu, setShowingMenu] = useState(false);

  // Quiz state
  const [activeTarget, setActiveTarget] = useState<any | null>(null);
  const [choices, setChoices] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [animatingFeedback, setAnimatingFeedback] = useState<'success' | 'error' | null>(null);
  const [monumentImage, setMonumentImage] = useState<string | null>(null);
  const [monumentImageLoading, setMonumentImageLoading] = useState(false);
  const [monumentImageError, setMonumentImageError] = useState(false);

  const worldDataRef = useRef<any>(null);

  // Dynamically load D3 and TopoJSON if not already present, with retries + CDN fallbacks
  useEffect(() => {
    let isMounted = true;

    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
          if ((existing as HTMLScriptElement).dataset.loaded === 'true') {
            resolve();
          } else {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
          }
          return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
          script.dataset.loaded = 'true';
          resolve();
        };
        script.onerror = () => {
          script.remove();
          reject(new Error(`Failed to load ${src}`));
        };
        document.head.appendChild(script);
      });
    };

    const loadScriptWithFallbacks = async (srcs: string[]) => {
      let lastErr: unknown;
      for (const src of srcs) {
        try {
          await loadScript(src);
          return;
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr;
    };

    const fetchJsonWithFallbacks = async (urls: string[]) => {
      let lastErr: unknown;
      for (const url of urls) {
        try {
          return await window.d3.json(url);
        } catch (err) {
          lastErr = err;
        }
      }
      throw lastErr;
    };

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const initD3AndMap = async (attempt = 1) => {
      const MAX_ATTEMPTS = 3;
      try {
        setLoadError(false);

        if (!window.d3) {
          await loadScriptWithFallbacks([
            'https://d3js.org/d3.v7.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js',
            'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js',
          ]);
        }
        if (!window.topojson) {
          await loadScriptWithFallbacks([
            'https://d3js.org/topojson.v3.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js',
            'https://cdn.jsdelivr.net/npm/topojson@3/dist/topojson.min.js',
          ]);
        }

        if (!window.d3 || !window.topojson) {
          throw new Error('D3/topojson did not attach to window after load');
        }

        const data = await fetchJsonWithFallbacks([
          'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json',
          'https://unpkg.com/world-atlas@2/countries-110m.json',
        ]);

        if (isMounted) {
          worldDataRef.current = data;
          setLoading(false);
          setLoadError(false);
        }
      } catch (err) {
        console.error(`Failed to load world map dependencies (attempt ${attempt}):`, err);
        if (!isMounted) return;
        if (attempt < MAX_ATTEMPTS) {
          await sleep(attempt * 600);
          if (isMounted) initD3AndMap(attempt + 1);
        } else {
          setLoading(false);
          setLoadError(true);
        }
      }
    };

    initD3AndMap();

    // Use ResizeObserver instead of only the window resize event, so the map
    // reliably renders once the container actually has real dimensions
    // (fixes blank-on-first-load when the container mounts at 0x0).
    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current && 'ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(() => {
        if (worldDataRef.current) {
          renderMap();
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    const handleResize = () => {
      if (worldDataRef.current) {
        renderMap();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  const retryMapLoad = () => {
    setLoading(true);
    setLoadError(false);
    // Re-trigger the mount effect logic by forcing a remount-style reload
    window.location.reload();
  };

  // Render D3 Map
  const renderMap = useCallback(() => {
    if (!svgRef.current || !containerRef.current || !window.d3 || !window.topojson || !worldDataRef.current) {
      return;
    }

    const d3 = window.d3;
    const topojson = window.topojson;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 580;
    const padding = 20;

    // If the container hasn't been laid out yet (0 width), retry shortly instead
    // of rendering a broken/invisible map.
    if (width === 0) {
      setTimeout(() => renderMap(), 150);
      return;
    }

    svg.attr('width', width).attr('height', height);

    const projection = d3.geoEquirectangular();
    const countries = topojson.feature(worldDataRef.current, worldDataRef.current.objects.countries).features;

    projection.fitExtent(
      [[padding, padding], [width - padding, height - padding]],
      { type: 'FeatureCollection', features: countries }
    );

    const path = d3.geoPath().projection(projection);
    const colors = d3.scaleOrdinal([
      '#E63946', '#1D3557', '#457B9D', '#2A9D8F', '#E9C46A',
      '#F4A261', '#E76F51', '#9C27B0', '#673AB7', '#00BCD4'
    ]);

    svg.selectAll('path')
      .data(countries)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', (_d: any, i: number) => colors(i % 10))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', '0.6px')
      .style('cursor', 'pointer')
      .style('transition', 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.25s ease')
      .style('transform-origin', (d: any) => {
        const centroid = path.centroid(d);
        return isNaN(centroid[0]) ? 'center center' : `${centroid[0]}px ${centroid[1]}px`;
      })
      .on('mouseenter', function (this: any) {
        d3.select(this)
          .raise()
          .attr('stroke-width', '1.5px')
          .style('transform', 'translateY(-4px)')
          .style('filter', 'drop-shadow(0px 8px 8px rgba(0,0,0,0.3))');
      })
      .on('mouseleave', function (this: any) {
        const el = d3.select(this);
        if (!el.classed('correct-pick') && !el.classed('wrong-pick')) {
          el.attr('stroke-width', '0.6px')
            .style('transform', 'none')
            .style('filter', 'none');
        }
      })
      .on('click', function (this: any, _event: any, d: any) {
        handleCountryClick(d, this);
      });
  }, []);

  // Trigger initial map render once loading is done
  useEffect(() => {
    if (!loading && worldDataRef.current) {
      const timer = setTimeout(renderMap, 150);
      return () => clearTimeout(timer);
    }
  }, [loading, renderMap]);

  // Re-render when sidebar status changes to adjust map bounds
  useEffect(() => {
    if (!loading && worldDataRef.current) {
      const timer = setTimeout(renderMap, 280);
      return () => clearTimeout(timer);
    }
  }, [sidebarOpen, renderMap]);

  const handleCountryClick = (d: any, element: any) => {
    const id = String(d.id).padStart(3, '0');
    const name = d.properties?.name || `Country #${id}`;
    const alpha2 = COUNTRY_DETAILS[id]?.alpha2.toLowerCase() || ISO_MAP[id] || '';

    if (activeGameMode !== 'explore' && activeTarget) {
      // Game answer checking
      checkAnswer(d.id, activeTarget.id, name, element);
    } else {
      // Explore mode: Show sidebar
      const isSwitchingCountry = sidebarOpen && !showingMenu && activeGameMode === 'explore' && selectedCountry;

      if (isSwitchingCountry) {
        // Slide the current content out, swap data, then slide the new content in
        setContentTransitioning(true);
        setTimeout(() => {
          setSelectedCountry({ name, alpha2, id });
          setShowingMenu(false);
          setContentAnimKey((k) => k + 1);
          setContentTransitioning(false);
        }, 220);
      } else {
        setSelectedCountry({ name, alpha2, id });
        setShowingMenu(false);
        setContentAnimKey((k) => k + 1);
      }
      setSidebarOpen(true);
    }
  };

  const highlightCountry = (countryId: string | number, isCorrect: boolean) => {
    if (!window.d3 || !svgRef.current) return;
    const d3 = window.d3;
    const normalizedId = String(countryId).padStart(3, '0');
    const svg = d3.select(svgRef.current);

    const targetPath = svg.selectAll('path.country').filter((d: any) => {
      return String(d.id).padStart(3, '0') === normalizedId;
    });

    if (!targetPath.empty()) {
      targetPath.raise();
      if (isCorrect) {
        targetPath
          .classed('correct-pick', true)
          .attr('fill', '#2A9D8F')
          .style('transform', 'translateY(-10px) scale(1.08)')
          .style('filter', 'drop-shadow(0px 12px 14px rgba(0,0,0,0.4))');

        setTimeout(() => {
          targetPath
            .classed('correct-pick', false)
            .style('transform', 'none')
            .style('filter', 'none');
          renderMap();
        }, 1300);
      } else {
        targetPath
          .classed('wrong-pick', true)
          .attr('fill', '#E63946')
          .style('transform', 'translateY(-5px)');

        setTimeout(() => {
          targetPath
            .classed('wrong-pick', false)
            .style('transform', 'none');
          renderMap();
        }, 800);
      }
    }
  };

  const triggerAnimation = (type: 'success' | 'error') => {
    setAnimatingFeedback(type);
    setTimeout(() => {
      setAnimatingFeedback(null);
    }, 900);
  };

  const checkAnswer = (selectedId: string | number, correctId: string | number, clickedName?: string, element?: any) => {
    const normSelected = String(selectedId).padStart(3, '0');
    const normCorrect = String(correctId).padStart(3, '0');

    if (normSelected === normCorrect) {
      triggerAnimation('success');
      highlightCountry(correctId, true);
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      onAddXp?.(15);
      setFeedback({
        isCorrect: true,
        message: 'Correct! Great job! Loading next country...',
      });
      setTimeout(() => {
        startQuizRound(activeGameMode);
      }, 1400);
    } else {
      triggerAnimation('error');
      if (element) {
        highlightCountry(selectedId, false);
      }
      setStreak(0);
      const name = clickedName || 'selected country';
      setFeedback({
        isCorrect: false,
        message: `Incorrect! That was ${name}. Try again or pick below:`,
      });
    }
  };

  const startQuizRound = (mode: GameMode) => {
    if (!worldDataRef.current || !window.topojson) return;
    const countries = window.topojson.feature(
      worldDataRef.current,
      worldDataRef.current.objects.countries
    ).features;

    const validCountries = countries.filter((c: any) => {
      const id = String(c.id).padStart(3, '0');
      return c.properties?.name && ISO_MAP[id];
    });

    if (validCountries.length === 0) return;

    // Pick target
    let target = validCountries[Math.floor(Math.random() * validCountries.length)];
    if (mode === 'monument') {
      const monumentKeys = Object.keys(MONUMENTS_MAP);
      const randomKey = monumentKeys[Math.floor(Math.random() * monumentKeys.length)];
      const matched = validCountries.find((c: any) => String(c.id).padStart(3, '0') === randomKey);
      if (matched) target = matched;
    }

    // Pick 3 distractors
    const roundChoices = [target];
    while (roundChoices.length < 4) {
      const rand = validCountries[Math.floor(Math.random() * validCountries.length)];
      if (!roundChoices.some((c) => c.id === rand.id)) {
        roundChoices.push(rand);
      }
    }
    roundChoices.sort(() => Math.random() - 0.5);

    setActiveTarget(target);
    setChoices(roundChoices);
    setActiveGameMode(mode);
    setShowingMenu(false);
    setSidebarOpen(true);
    setFeedback(null);
  };

  const resetToExplore = () => {
    setActiveGameMode('explore');
    setActiveTarget(null);
    setChoices([]);
    setFeedback(null);
    setShowingMenu(false);
    setSidebarOpen(false);
    renderMap();
  };

  const targetId = activeTarget ? String(activeTarget.id).padStart(3, '0') : '';
  const targetAlpha = ISO_MAP[targetId] || '';
  const monument = MONUMENTS_MAP[targetId] || {
    name: 'Famous Historical Landmark',
    hint: `Prominent heritage site located in ${activeTarget?.properties?.name || 'this country'}.`,
  };

  // Fetch a real photo of the monument from Wikipedia (backed by Wikimedia Commons)
  // instead of hardcoding image links per country.
  useEffect(() => {
    let cancelled = false;

    if (activeGameMode !== 'monument' || !monument?.name) {
      setMonumentImage(null);
      setMonumentImageError(false);
      return;
    }

    setMonumentImage(null);
    setMonumentImageError(false);
    setMonumentImageLoading(true);

    const fetchMonumentImage = async () => {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(monument.name)}`
        );
        if (!res.ok) throw new Error('Wikipedia summary fetch failed');
        const data = await res.json();
        const imageUrl = data?.originalimage?.source || data?.thumbnail?.source || null;
        if (!cancelled) {
          if (imageUrl) {
            setMonumentImage(imageUrl);
          } else {
            setMonumentImageError(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch monument image:', err);
        if (!cancelled) setMonumentImageError(true);
      } finally {
        if (!cancelled) setMonumentImageLoading(false);
      }
    };

    fetchMonumentImage();
    return () => {
      cancelled = true;
    };
  }, [activeGameMode, monument?.name]);

  const headerControls = (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1.5 rounded-md text-xs font-bold">
        <Trophy size={14} className="text-amber-400" />
        <span>{score} Score</span>
      </div>

      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 sm:px-3 py-1.5 rounded-md text-xs font-bold">
        <Flame size={14} className="text-rose-400" />
        <span>{streak} Streak</span>
      </div>

      <button
        onClick={() => {
          setShowingMenu(true);
          setSidebarOpen(true);
        }}
        className="bg-[#2A9D8F] hover:bg-[#238276] text-white px-2 sm:px-3.5 py-1.5 rounded-md text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-md transition-all active:scale-95"
      >
        <Play size={13} fill="currentColor" /> Play Game
      </button>

      <button
        onClick={resetToExplore}
        className="hidden sm:inline-flex p-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        title="Reset Map & Explore"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );

  return (
    <div className="relative w-full h-full min-h-0 bg-[#d8f0f8] dark:bg-[#0c1427] overflow-hidden flex flex-col">
      {headerActionsTarget ? createPortal(headerControls, headerActionsTarget) : headerControls}

      {/* Main Viewport */}
      <div className="relative flex-1 flex overflow-hidden">
        {/* SVG World Map */}
        <div ref={containerRef} className="flex-1 w-full relative min-w-0 min-h-0">
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#d8f0f8] dark:bg-[#0c1427]">
              <div className="w-10 h-10 border-4 border-[#2A9D8F] border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Loading Interactive World Atlas...
              </p>
            </div>
          ) : loadError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#d8f0f8] dark:bg-[#0c1427] px-6 text-center">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Couldn't load the world map.
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                This is usually a temporary network hiccup. Try again below.
              </p>
              <button
                onClick={retryMapLoad}
                className="mt-1 bg-[#2A9D8F] hover:bg-[#238276] text-white px-4 py-2 rounded-md text-xs font-bold shadow-md transition-all active:scale-95"
              >
                Retry
              </button>
            </div>
          ) : (
            <svg ref={svgRef} className="w-full h-full block" />
          )}

          {/* Quick instructions floating badge */}
          <div className="absolute bottom-4 left-4 z-10 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg pointer-events-none shadow-md">
            {activeGameMode === 'explore'
              ? '💡 Click any country to view its name & flag'
              : '🎯 Click the country on the map or select from options'}
          </div>
        </div>

        {/* Sliding Right Sidebar matching maps-retaou */}
        <aside
          className={`absolute right-0 top-0 sm:relative h-full w-full max-w-[360px] sm:max-w-none sm:w-[410px] shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto z-10 p-5 sm:p-6 transition-all duration-300 ease-out will-change-transform ${
            sidebarOpen
              ? contentTransitioning
                ? 'translate-x-6 opacity-0'
                : 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 pointer-events-none'
          }`}
        >
          <div key={contentAnimKey} className="relative min-w-0">
              {/* Close Button */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-0 right-0 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg transition-colors"
              >
                <X size={20} />
              </button>

              {/* MODE 1: Game Menu Selection */}
              {showingMenu && (
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                    Select a Game Mode
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                    Challenge your geography IQ with 3 distinct map games!
                  </p>

                  <div className="space-y-3.5">
                    {/* Game 1: Flag */}
                    <div
                      onClick={() => startQuizRound('flag')}
                      className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-[#E63946] transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-3.5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#E63946] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                        <Flag size={22} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          Find Country by Flag
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Guess the correct country name from a random world flag.
                        </p>
                      </div>
                    </div>

                    {/* Game 2: Name */}
                    <div
                      onClick={() => startQuizRound('name')}
                      className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-[#2A9D8F] transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-3.5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#2A9D8F] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                        <Globe2 size={22} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          Find Country by Name
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Identify the target country on the map or pick its flag.
                        </p>
                      </div>
                    </div>

                    {/* Game 3: Monuments */}
                    <div
                      onClick={() => startQuizRound('monument')}
                      className="group p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 hover:border-[#F4A261] transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-3.5"
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#F4A261] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform">
                        <Landmark size={22} />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                          Find by Monuments
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Match iconic world landmarks & heritage sites to their home country.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* MODE 2: Flag Quiz */}
              {!showingMenu && activeGameMode === 'flag' && activeTarget && (
                <div>
                  <button
                    onClick={() => setShowingMenu(true)}
                    className="text-xs font-bold text-[#457B9D] hover:underline flex items-center gap-1 mb-3"
                  >
                    <ArrowLeft size={13} /> Back to Games
                  </button>

                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Guess the Country
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Click the country directly on the map or select below:
                  </p>

                  <div className="my-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center h-44 shadow-inner border border-slate-200 dark:border-slate-700">
                    <img
                      src={`https://flagcdn.com/w320/${targetAlpha}.png`}
                      alt="Country Flag"
                      className="max-h-full max-w-full object-contain rounded shadow-md"
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    {choices.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => checkAnswer(c.id, activeTarget.id, c.properties?.name)}
                        className="w-full text-left px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-bold text-slate-800 dark:text-white transition-all shadow-sm active:scale-98"
                      >
                        {c.properties?.name || `Country #${c.id}`}
                      </button>
                    ))}
                  </div>

                  {feedback && (
                    <div
                      className={`mt-4 p-3 rounded-lg text-xs font-black ${
                        feedback.isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300'
                      }`}
                    >
                      {feedback.message}
                    </div>
                  )}
                </div>
              )}

              {/* MODE 3: Name Quiz */}
              {!showingMenu && activeGameMode === 'name' && activeTarget && (
                <div>
                  <button
                    onClick={() => setShowingMenu(true)}
                    className="text-xs font-bold text-[#457B9D] hover:underline flex items-center gap-1 mb-3"
                  >
                    <ArrowLeft size={13} /> Back to Games
                  </button>

                  <h2 className="text-base font-bold text-slate-600 dark:text-slate-400">
                    Find on Map or Pick Flag:
                  </h2>
                  <h3 className="text-2xl font-black text-[#E63946] my-1">
                    {activeTarget.properties?.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                    Click {activeTarget.properties?.name} directly on the map, or choose its flag:
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {choices.map((c) => {
                      const cAlpha = ISO_MAP[String(c.id).padStart(3, '0')];
                      return (
                        <div
                          key={c.id}
                          onClick={() => checkAnswer(c.id, activeTarget.id, c.properties?.name)}
                          className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-[#2A9D8F] hover:shadow-md transition-all flex items-center justify-center h-24 group"
                        >
                          <img
                            src={`https://flagcdn.com/w320/${cAlpha || ''}.png`}
                            alt={c.properties?.name}
                            className="max-h-full max-w-full object-contain rounded shadow-sm group-hover:scale-105 transition-transform"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {feedback && (
                    <div
                      className={`mt-4 p-3 rounded-lg text-xs font-black ${
                        feedback.isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300'
                      }`}
                    >
                      {feedback.message}
                    </div>
                  )}
                </div>
              )}

              {/* MODE 4: Monuments Quiz */}
              {!showingMenu && activeGameMode === 'monument' && activeTarget && (
                <div>
                  <button
                    onClick={() => setShowingMenu(true)}
                    className="text-xs font-bold text-[#457B9D] hover:underline flex items-center gap-1 mb-3"
                  >
                    <ArrowLeft size={13} /> Back to Games
                  </button>

                  <h2 className="text-lg font-black text-slate-900 dark:text-white">
                    Name the Country
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Click the country on the map or select an option:
                  </p>

                  <div className="my-4 rounded-xl overflow-hidden bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 shadow-sm">
                    <div className="w-full h-44 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                      {monumentImageLoading ? (
                        <div className="w-8 h-8 border-4 border-[#F4A261] border-t-transparent rounded-full animate-spin" />
                      ) : monumentImage && !monumentImageError ? (
                        <img
                          src={monumentImage}
                          alt={monument.name}
                          onError={() => setMonumentImageError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-3">
                          <Landmark size={28} className="text-[#F4A261] mb-1" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            No photo available
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-base font-black text-[#2A9D8F] flex items-center gap-1.5">
                        {monument.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                        {monument.hint}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    {choices.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => checkAnswer(c.id, activeTarget.id, c.properties?.name)}
                        className="w-full text-left px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-sm font-bold text-slate-800 dark:text-white transition-all shadow-sm active:scale-98"
                      >
                        {c.properties?.name || `Country #${c.id}`}
                      </button>
                    ))}
                  </div>

                  {feedback && (
                    <div
                      className={`mt-4 p-3 rounded-lg text-xs font-black ${
                        feedback.isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300'
                      }`}
                    >
                      {feedback.message}
                    </div>
                  )}
                </div>
              )}

              {/* MODE 5: Explore Mode Country Details */}
              {!showingMenu && activeGameMode === 'explore' && selectedCountry && (
                <CountryDetailsCard country={selectedCountry} />
              )}
          </div>
        </aside>
      </div>

      {/* Pop-in Animated Feedback Overlay matching maps-retaou */}
      {animatingFeedback && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center shadow-2xl animate-bounce ${
              animatingFeedback === 'success' ? 'bg-[#2A9D8F]' : 'bg-[#E63946]'
            }`}
          >
            {animatingFeedback === 'success' ? (
              <svg className="w-14 h-14 stroke-white stroke-[4] fill-none" viewBox="0 0 52 52">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 27 l10 10 l20 -20" />
              </svg>
            ) : (
              <svg className="w-14 h-14 stroke-white stroke-[4] fill-none" viewBox="0 0 52 52">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 16 L36 36 M36 16 L16 36" />
              </svg>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
