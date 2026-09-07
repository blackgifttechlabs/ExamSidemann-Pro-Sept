import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePageScrollLock } from "../../../../../components/ui/pageScrollLock";
import {
  Wrench,
  Car,
  Gauge,
  X,
  ZoomIn,
  ChevronLeft,
  ChevronRight } from "lucide-react";

const imageUrls = {
  crankshaft: "https://i.postimg.cc/nMgNmxGx/crankshaft.webp",
  camshaft: "https://i.postimg.cc/Rqy2tmQ8/cramshaft.webp",
  pistons: "https://i.postimg.cc/3WVzGhCq/Pistons-and-Connecting-Rods.webp",
  gudgeon: "https://i.postimg.cc/142bFScj/Gudgeon-Pins-(Wrist-Pins).webp",
  valves: "https://i.postimg.cc/142bFScv/Valves.webp",
  cylinderHead: "https://i.postimg.cc/F18wSvgp/Cylinder-Head.webp",
  engineBlock: "https://i.postimg.cc/hh6Nmnbr/Engine-Block.webp",
  valveSprings: "https://i.postimg.cc/hh6Nmnb1/Valve-Springs.webp",
  bearings: "https://i.postimg.cc/fkJ6kyXH/Bearings.webp",
  sump: "https://i.postimg.cc/fkJ6kyX5/Sump-(Oil-Pan).webp",
  covers: "https://i.postimg.cc/s1vt1xSm/Covers-(Tappet-and-Front).webp",
  gears: "https://i.postimg.cc/RqNjqhff/Gears.webp",
  belts: "https://i.postimg.cc/K4Rd4jLz/belts.webp",
  chains: "https://i.postimg.cc/BtXdtbD8/Chains.webp",
  fourStroke: "https://i.postimg.cc/yWkwWx9D/Four-Stroke-(Otto)-Cycle.webp",
  twoStroke: "https://i.postimg.cc/ctgjzkZj/Two-Stroke-Cycle.webp" };

const galleryImages = Object.entries(imageUrls).map(([key, url]) => ({
  id: key,
  src: url,
  alt: `${key.replace(/([A-Z])/g, " $1").trim()} diagram`,
  title: key.replace(/([A-Z])/g, " $1").replace(/^\w/, (c) => c.toUpperCase()) }));

export const LearningOutcome1: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  usePageScrollLock(lightboxOpen);

  React.useEffect(() => {
    const checkDarkMode = () =>
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  const prevImage = () =>
    setCurrentImageIndex(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
    );

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!lightboxOpen) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  };
  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  const containerClasses = isDarkMode
    ? "w-full py-4 md:py-6 px-3 lg:px-8 dark:bg-[#1e1e1e] bg-white min-h-screen"
    : "w-full py-4 md:py-6 px-3 lg:px-8 dark:bg-[#1e1e1e] bg-white min-h-screen";

  const sectionHeaderClasses = isDarkMode
    ? "text-2xl sm:text-3xl md:text-4xl font-bold mb-8 inline-block relative group text-white uppercase mt-8 tracking-tight"
    : "text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 inline-block relative group uppercase mt-8 tracking-tight";

  const cardClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: " hover:shadow-blue-500/20",
      green: " hover:shadow-green-500/20",
      purple: " hover:shadow-purple-500/20",
      amber: " hover:shadow-amber-500/20",
      red: " hover:shadow-red-500/20",
      indigo: " hover:shadow-indigo-500/20",
      gray: " hover:shadow-gray-500/20",
      lime: " hover:shadow-lime-500/20" };
    const borderColor = colorMap[color] || colorMap.blue;
    return `${isDarkMode ? "bg-[#252526]" : "bg-white"} rounded-xl shadow-md p-4 sm:p-6 mb-6 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${borderColor}`;
  };

  const ComponentCard = ({
    title,
    description,
    imageKey,
    color,
    imageLabel = "Image" }: any) => {
    const imageIndex = galleryImages.findIndex((img) => img.id === imageKey);
    return (
      <div className={cardClasses(color)}>
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 flex items-center gap-3">
              <span className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 p-2 rounded-full text-lg sm:text-xl flex-shrink-0 shadow-sm">
                🔧
              </span>
              <span className="break-words">{title}</span>
            </h3>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:text-indigo-700 dark:[&_strong]:text-indigo-300">
              {description}
            </div>
          </div>
          <div className="lg:w-1/3 flex flex-col items-center flex-shrink-0">
            <div
              className="cursor-pointer transform transition-all duration-300 hover:scale-105 active:scale-95 w-full group/img relative"
              onClick={() => openLightbox(imageIndex)}
            >
              <div className="relative overflow-hidden rounded-xl shadow-md border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
                <img
                  src={imageUrls[imageKey as keyof typeof imageUrls]}
                  alt={title}
                  className="w-full max-h-52 object-contain p-3 transition-transform duration-500 group-hover/img:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-indigo-900/0 group-hover/img:bg-indigo-900/10 transition-colors duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-gray-900/90 rounded-full p-2 shadow-lg">
                    <ZoomIn
                      size={20}
                      className="text-indigo-600 dark:text-indigo-400"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1 mt-2 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <ZoomIn size={12} /> Click to enlarge
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {imageLabel}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {/* Lightbox Modal */}
      {lightboxOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-[fadeIn_0.2s_ease-out] px-2"
            onClick={closeLightbox}
          >
            <style>{`
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.92) } to { opacity: 1; transform: scale(1) } }
          `}</style>
            <button
              className="absolute top-3 right-3 sm:top-6 sm:right-6 text-white bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition z-10 border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
            >
              <X size={28} />
            </button>
            <button
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-white bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft size={32} />
            </button>
            <button
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-white bg-white/10 backdrop-blur-md rounded-full p-3 hover:bg-white/20 transition border border-white/10"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight size={32} />
            </button>
            <div
              className="w-full h-full flex flex-col items-center justify-center animate-[scaleIn_0.25s_ease-out]"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }} // Clicking outside the image closes it
            >
              <div className="relative flex items-center justify-center w-full h-[85vh] px-4 sm:px-12">
                <img
                  src={galleryImages[currentImageIndex].src}
                  alt={galleryImages[currentImageIndex].alt}
                  className="max-w-full max-h-full object-contain drop-shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div
                className="mt-4 text-center z-10"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-white text-lg sm:text-3xl font-bold tracking-tight">
                  {galleryImages[currentImageIndex].title}
                </p>
                <p className="text-gray-400 text-sm sm:text-base mt-1 font-medium">
                  {currentImageIndex + 1} / {galleryImages.length}
                </p>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* HEADER SECTION */}
      <header
        className={`relative w-full mb-10 sm:mb-12 rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? "bg-indigo-950" : "bg-indigo-900"}`}
      >
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes float { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-8px) } }
          @keyframes glow { 0%, 100% { opacity: 0.2 } 50% { opacity: 0.4 } }
        `}</style>
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full blur-3xl"
            style={{ animation: "glow 6s ease-in-out infinite" }}
          ></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div
            className="absolute -bottom-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-purple-500 rounded-full blur-3xl"
            style={{ animation: "glow 6s ease-in-out infinite 1.5s" }}
          ></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-4 py-10 sm:px-12 sm:py-16">
          <div
            className="flex flex-col items-start gap-5 sm:gap-6 text-left"
            style={{ animation: "slideUp 0.6s ease-out" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-900/30">
              <Wrench className="w-4 h-4" />
              Automotive: Module LO1
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Engine{" "}
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-cyan-300"
                style={{
                  backgroundSize: "200% auto",
                  animation: "shimmer 4s linear infinite" }}
              >
                Components & Maintenance
              </span>
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Comprehensive guide to major and minor engine parts, lubrication
              systems, engine cycles, and professional tune‑up procedures.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>
              <div className="relative bg-[#1e1e2e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff7400]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 px-3 py-1 rounded-md bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">
                    engine_notes.md
                  </div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4">
                    <span className="text-gray-600 select-none">1</span>
                    <span className="text-emerald-400 font-bold">IMPORT</span>
                    <span className="text-white">Crankshaft_Module;</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-600 select-none">2</span>
                    <span className="text-cyan-400 font-bold">INSPECT</span>
                    <span className="text-white">Lubrication_System;</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-gray-600 select-none">3</span>
                    <span className="text-emerald-400 font-bold">
                      CALIBRATE
                    </span>
                    <span className="text-white">Ignition_Timing;</span>
                  </div>
                  <div className="flex gap-4 mt-4">
                    <span className="text-gray-600 select-none">4</span>
                    <div className="w-2 h-5 bg-blue-500 animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div
                className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl"
                style={{ animation: "float 3s ease-in-out infinite" }}
              >
                <Car className="w-8 h-8 text-emerald-400" />
              </div>
              <div
                className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 shadow-xl"
                style={{ animation: "float 4s ease-in-out infinite 1s" }}
              >
                <Gauge className="w-8 h-8 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-16 sm:space-y-20">
        {/* MAJOR ENGINE COMPONENTS */}
        <section className="space-y-6 sm:space-y-8">
          <div className="flex items-center gap-3 sm:gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-4 sm:pl-6">
            <h2 className={sectionHeaderClasses}>Major Engine Components</h2>
          </div>

          <ComponentCard
            title="Crankshaft"
            imageKey="crankshaft"
            color="red"
            description={
              <>
                <p>
                  <strong>What it is:</strong> A large, heavy steel shaft
                  located at the bottom of the engine block. Considered one of
                  the most important moving parts in the entire engine.
                </p>
                <p>
                  <strong>What it does:</strong> Takes the up-and-down
                  (reciprocating) motion of the pistons and converts it into
                  spinning (rotary) motion. This spinning motion eventually
                  passes through the transmission to the wheels — without it,
                  the engine's power can't move the car.
                </p>
                <p>
                  <strong>What it looks like:</strong> A long shaft with offset
                  sections called journals (or crank pins) along its length.
                  These journals are slightly off-center from the main axis.
                  From outside you can see the pulley at the front and the
                  flywheel at the back. If opened up, the journals appear as
                  smooth, rounded, polished metal surfaces.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Healthy: smooth, steady
                  whirring. Problem signs: knocking or clanking sounds that
                  change with engine speed — usually worn bearings or excessive
                  play. Never ignore; crankshaft bearing failure causes very
                  expensive damage.
                </p>
              </>
            }
          />

          <ComponentCard
            title="Camshaft"
            imageKey="camshaft"
            color="green"
            description={
              <>
                <p>
                  <strong>What it is:</strong> A long rod with a series of
                  egg-shaped bumps called lobes (or cams).
                </p>
                <p>
                  <strong>What it does:</strong> Controls exactly when the
                  intake and exhaust valves open and close, and for how long. As
                  the camshaft rotates, the lobes push against the valves
                  (directly or via rocker arms/pushrods) forcing them open at
                  precise moments.
                </p>
                <p>
                  <strong>Where it is located:</strong> Overhead cam (OHC)
                  engines: in the cylinder head, visible after removing valve
                  cover. Older pushrod engines: inside the engine block, not
                  visible without disassembly.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Healthy: smooth,
                  rhythmic ticking noise. Problem signs: excessive ticking or
                  tapping — usually means lobes wearing down or problems in the
                  valve train.
                </p>
              </>
            }
          />

          <ComponentCard
            title="Pistons and Connecting Rods"
            imageKey="pistons"
            color="blue"
            description={
              <>
                <p>
                  <strong>What they are:</strong> Pistons are cylindrical metal
                  components that move up and down inside the cylinders.
                  Connecting rods link each piston to the crankshaft.
                </p>
                <p>
                  <strong>What they do:</strong> The combustion chamber sits on
                  top of each piston. The connecting rod has two ends: one
                  attaches to the underside of the piston (via gudgeon pin), the
                  other to a journal on the crankshaft. As the piston moves, the
                  rod transfers motion to the crankshaft.
                </p>
                <p>
                  <strong>Visibility:</strong> Completely hidden inside the
                  cylinders and engine block. Problems can be noticed indirectly
                  via excessive "blow-by" (exhaust gases escaping past piston
                  rings into the crankcase) — may show as extra smoke from oil
                  filler cap.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Piston slap: knocking
                  sound (worn pistons/cylinders). Rod knock: deep, heavy
                  knocking (damaged connecting rod bearings) — a serious
                  problem.
                </p>
              </>
            }
          />

          <ComponentCard
            title="Gudgeon Pins (Wrist Pins)"
            imageKey="gudgeon"
            color="purple"
            description={
              <>
                <p>
                  <strong>What they are:</strong> Small metal pins that connect
                  the piston to the connecting rod.
                </p>
                <p>
                  <strong>What they do:</strong> Allow the connecting rod to
                  pivot as the piston moves up and down.
                </p>
                <p>
                  <strong>Visibility:</strong> Internal — located inside the
                  piston. Cannot be seen without taking the engine apart.
                </p>
                <p>
                  <strong>What it sounds like:</strong> A loose gudgeon pin
                  produces a sharp, metallic clicking or knocking sound.
                </p>
              </>
            }
          />

          <ComponentCard
            title="Valves"
            imageKey="valves"
            color="amber"
            description={
              <>
                <p>
                  <strong>What they are:</strong> Small "doors" located in the
                  cylinder head.
                </p>
                <p>
                  <strong>What they do:</strong> Control the intake of the
                  air-fuel mixture into the cylinder and the exhaust of burnt
                  gases out of the cylinder.
                </p>
                <p>
                  <strong>What you can see:</strong> Once the valve cover is
                  removed, you can see the valve stems and the valve springs.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Healthy: light, rhythmic
                  ticking. Problem signs: excessive ticking/tapping (valve lash
                  or worn components); whistling (leaking valve).
                </p>
              </>
            }
          />

          <ComponentCard
            title="Cylinder Head"
            imageKey="cylinderHead"
            color="indigo"
            description={
              <>
                <p>
                  <strong>What it is:</strong> The top part of the engine — a
                  large metal component bolted onto the engine block.
                </p>
                <p>
                  <strong>What it contains:</strong> The valves, the camshaft
                  (in overhead cam engines), and the spark plugs or injectors.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Hissing or bubbling
                  sounds, especially while the engine is running, often indicate
                  a head gasket leak.
                </p>
              </>
            }
          />

          <ComponentCard
            title="Engine Block"
            imageKey="engineBlock"
            color="gray"
            description={
              <>
                <p>
                  <strong>What it is:</strong> The main body of the engine — a
                  large, heavy metal casting.
                </p>
                <p>
                  <strong>What it contains:</strong> The cylinders, the
                  crankshaft, and the coolant passages.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Hissing or gurgling
                  sounds, especially when the engine is hot, can indicate cracks
                  or leaks in the engine block.
                </p>
              </>
            }
          />

          <ComponentCard
            title="Valve Springs"
            imageKey="valveSprings"
            color="lime"
            description={
              <>
                <p>
                  <strong>What they are:</strong> Small coiled springs located
                  around the valve stems.
                </p>
                <p>
                  <strong>What they do:</strong> Close the valves again after
                  the camshaft has pushed them open.
                </p>
                <p>
                  <strong>What it sounds like:</strong> A rattling or clattering
                  sound, often accompanied by engine misfires, may indicate a
                  broken or weakened valve spring.
                </p>
              </>
            }
          />
        </section>

        {/* MINOR ENGINE COMPONENTS */}
        <section className="space-y-6 sm:space-y-8 pt-8 sm:pt-12">
          <div className="flex items-center gap-3 sm:gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-4 sm:pl-6">
            <h2 className={sectionHeaderClasses}>Minor Engine Components</h2>
          </div>

          <ComponentCard
            title="Bearings"
            imageKey="bearings"
            color="blue"
            description={
              <>
                <p>
                  <strong>What they are:</strong> Smooth metal surfaces or
                  rollers found at points where a rotating part meets a
                  stationary part (crankshaft bearings, camshaft bearings).
                </p>
                <p>
                  <strong>What they do:</strong> Reduce friction between moving
                  and still parts.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Worn bearings produce a
                  rumbling, grinding, or whining sound.
                </p>
              </>
            }
          />
          <ComponentCard
            title="Sump (Oil Pan)"
            imageKey="sump"
            color="green"
            description={
              <>
                <p>
                  <strong>What it is:</strong> The lowest part of the engine — a
                  metal or plastic pan bolted to the bottom of the engine block.
                  Holds the engine oil.
                </p>
                <p>
                  <strong>Signs of a problem:</strong> Damage may not produce
                  sound; instead visible oil leaking/dripping from underneath
                  the engine.
                </p>
              </>
            }
          />
          <ComponentCard
            title="Covers (Tappet and Front)"
            imageKey="covers"
            color="purple"
            description={
              <>
                <p>
                  <strong>What they are:</strong> Tappet covers (valve covers)
                  seal the top of the cylinder head; front cover protects timing
                  gears/chain. Typically metal or plastic.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Leaks from these covers
                  can result in hissing or dripping sounds.
                </p>
              </>
            }
          />
          <ComponentCard
            title="Gears"
            imageKey="gears"
            color="amber"
            description={
              <>
                <p>
                  <strong>What they are:</strong> Toothed wheels that transmit
                  motion between shafts (timing gears, oil pump gears). Visible
                  when covers are removed.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Worn or damaged gears
                  produce a whining or grinding sound.
                </p>
              </>
            }
          />
          <ComponentCard
            title="Belts"
            imageKey="belts"
            color="red"
            description={
              <>
                <p>
                  <strong>What they are:</strong> Flexible rubber bands that
                  transmit power between pulleys (serpentine belt or timing
                  belt).
                </p>
                <p>
                  <strong>What it sounds like:</strong> Worn or loose belts
                  produce a squealing or chirping sound.
                </p>
              </>
            }
          />
          <ComponentCard
            title="Chains"
            imageKey="chains"
            color="indigo"
            description={
              <>
                <p>
                  <strong>What they are:</strong> Metal links that transmit
                  power between sprockets (timing chain). Stronger than belts.
                </p>
                <p>
                  <strong>What it sounds like:</strong> Worn or loose chains
                  produce a rattling or slapping sound.
                </p>
              </>
            }
          />
        </section>

        {/* ENGINE CYCLES AND TYPES */}
        <section className="space-y-6 sm:space-y-8 pt-8 sm:pt-12">
          <div className="flex items-center gap-3 sm:gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-4 sm:pl-6">
            <h2 className={sectionHeaderClasses}>Engine Cycles and Types</h2>
          </div>

          <ComponentCard
            title="Four-Stroke (Otto) Cycle"
            imageKey="fourStroke"
            color="blue"
            description={
              <>
                <p>
                  <strong>Overview:</strong> One full power cycle = 4 piston
                  strokes = 2 full crankshaft revolutions.
                </p>
                <p>
                  <strong>Key parts involved:</strong> Crankshaft (converts
                  reciprocating to rotary), Camshaft (controls valves), Pistons
                  (create compression/power), Valve train (valves, springs,
                  pushrods, rocker arms).
                </p>
                <p>
                  <strong>The four strokes:</strong> Intake, Compression, Power,
                  Exhaust.
                </p>
              </>
            }
          />
          <ComponentCard
            title="Two-Stroke Cycle"
            imageKey="twoStroke"
            color="green"
            description={
              <>
                <p>
                  <strong>Overview:</strong> One full power cycle = 2 piston
                  strokes = 1 crankshaft revolution.
                </p>
                <p>
                  <strong>Key features:</strong> Eliminates separate intake and
                  exhaust strokes; uses ports in cylinder walls. Simpler design
                  but less efficient than four-stroke. Common in small engines
                  (lawnmowers, motorcycles).
                </p>
              </>
            }
          />

          <div className={cardClasses("amber")}>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-3">
              <span className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 p-2 rounded-full text-lg sm:text-xl shadow-sm">
                ⚙️
              </span>
              Compression Ignition Engines (Diesel Engines)
            </h3>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none [&_strong]:text-indigo-700 dark:[&_strong]:text-indigo-300">
              <p>
                <strong>How they work:</strong> Use compression (not a spark) to
                ignite fuel. Air is compressed to a very high temperature; fuel
                is injected into hot air, causing ignition.
              </p>
              <p>
                <strong>Key features:</strong> More efficient than spark
                ignition (petrol) engines. Common in trucks, buses, heavy
                equipment. Do not use spark plugs. Use high-pressure fuel
                injection.
              </p>
            </div>
          </div>
        </section>

        {/* LUBRICATION SYSTEM */}
        <section className="space-y-6 sm:space-y-8 pt-8 sm:pt-12">
          <div className="flex items-center gap-3 sm:gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-4 sm:pl-6">
            <h2 className={sectionHeaderClasses}>Lubrication System</h2>
          </div>
          <div className={cardClasses("blue")}>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3">
              Why the Lubrication System Matters
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base">
              <li>
                <strong>Reducing friction:</strong> Creates a thin oil film
                between moving parts, minimizing wear.
              </li>
              <li>
                <strong>Cooling:</strong> Oil absorbs heat from components and
                carries it away.
              </li>
              <li>
                <strong>Cleaning:</strong> Carries away contaminants (metal
                particles, combustion byproducts).
              </li>
              <li>
                <strong>Sealing:</strong> Helps seal gaps between piston rings
                and cylinder walls, maintaining compression.
              </li>
              <li>
                <strong>Corrosion prevention:</strong> Forms a protective
                barrier on metal surfaces.
              </li>
            </ul>
          </div>
          <div className={cardClasses("green")}>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3">
              Key Components of a Lubrication System
            </h3>
            <ul className="list-disc pl-5 space-y-1 text-sm sm:text-base">
              <li>
                <strong>Oil Pan (Sump):</strong> Stores engine oil.
              </li>
              <li>
                <strong>Oil Pump:</strong> Circulates oil throughout the engine.
              </li>
              <li>
                <strong>Oil Filter:</strong> Removes contaminants from oil.
              </li>
              <li>
                <strong>Oil Passages:</strong> Channels for oil flow.
              </li>
              <li>
                <strong>Oil Pressure Sensor/Switch:</strong> Monitors pressure
                and alerts driver.
              </li>
              <li>
                <strong>Oil Control Valves:</strong> Control oil flow to various
                parts (modern engines).
              </li>
            </ul>
          </div>
          <div className={cardClasses("purple")}>
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3">
              Changing Engine-Related Filters and Oil — A Maintenance Task
            </h3>
            <div className="text-sm sm:text-base space-y-2">
              <p>
                <strong>Why oil changes are needed:</strong> Old oil becomes
                contaminated and loses lubricating properties. Fresh oil ensures
                optimal lubrication.
              </p>
              <p>
                <strong>Why filter changes are needed:</strong> The oil filter
                traps contaminants. Replacing it prevents clogging and maintains
                effectiveness.
              </p>
              <p>
                <strong>Why this matters overall:</strong> Removes abrasive
                particles and sludge. Fresh oil has correct viscosity and
                additives. A clean oil filter ensures proper oil flow.
              </p>
            </div>
          </div>
        </section>

        {/* ENGINE TUNE-UP */}
        <section className="space-y-6 sm:space-y-8 pt-8 sm:pt-12">
          <div className="flex items-center gap-3 sm:gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-4 sm:pl-6">
            <h2 className={sectionHeaderClasses}>Engine Tune-Up</h2>
          </div>
          <div className={cardClasses("red")}>
            <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-red-500">A.</span> Valves
            </h3>
            <div className="text-sm sm:text-base space-y-1">
              <p>
                <strong>Purpose:</strong> Control intake of air-fuel mixture and
                exhaust of combustion gases.
              </p>
              <p>
                <strong>Tune-up procedures:</strong> Valve lash adjustment,
                valve inspection, valve stem seal replacement, compression test.
              </p>
              <p>
                <strong>Importance:</strong> Properly adjusted valves ensure
                proper cylinder sealing, optimal combustion, and efficient
                engine operation.
              </p>
            </div>
          </div>
          <div className={cardClasses("green")}>
            <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-green-500">B.</span> Engine Timing
            </h3>
            <div className="text-sm sm:text-base space-y-1">
              <p>
                <strong>Purpose:</strong> Coordination of crankshaft and
                camshaft(s) to ensure valves open/close at correct times.
              </p>
              <p>
                <strong>Tune-up procedures:</strong> Timing belt/chain
                inspection and replacement, camshaft timing adjustment, sensor
                checks.
              </p>
              <p>
                <strong>Importance:</strong> Correct engine timing is crucial
                for optimal performance, fuel efficiency, and emissions control.
              </p>
            </div>
          </div>
          <div className={cardClasses("blue")}>
            <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2">
              <span className="text-blue-500">C.</span> Ignition Timing
            </h3>
            <div className="text-sm sm:text-base space-y-1">
              <p>
                <strong>Purpose:</strong> Timing of spark plug firing in
                relation to piston position.
              </p>
              <p>
                <strong>Tune-up procedures:</strong> Distributor
                inspection/adjustment (older engines), ignition timing check
                (modern engines), spark plug inspection/replacement, ignition
                coil inspection.
              </p>
              <p>
                <strong>Importance:</strong> Correct ignition timing ensures
                complete combustion, optimal power output, and reduced
                emissions.
              </p>
            </div>
          </div>
        </section>

        {/* 7 KEY TAKEAWAYS */}
        <section className="space-y-6 sm:space-y-8 pt-8 sm:pt-12">
          <div className="flex items-center gap-3 sm:gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-4 sm:pl-6">
            <h2 className={sectionHeaderClasses}>
              7 Key Takeaways (Importances)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 sm:p-5 bg-white dark:bg-[#252526] rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <p className="font-bold">1. Sound is a diagnostic tool</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Every major part has a "normal" sound and a "warning" sound.
                Learning these helps catch problems early.
              </p>
            </div>
            <div className="p-4 sm:p-5 bg-white dark:bg-[#252526] rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <p className="font-bold">2. Most damage happens out of sight</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Pistons, rods, and gudgeon pins are hidden. Listening and
                watching for secondary clues is often the only early warning.
              </p>
            </div>
            <div className="p-4 sm:p-5 bg-white dark:bg-[#252526] rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <p className="font-bold">3. Oil is the engine's lifeblood</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                It lubricates, cools, cleans, seals, and protects all at once.
                Without good oil, every other part wears out faster.
              </p>
            </div>
            <div className="p-4 sm:p-5 bg-white dark:bg-[#252526] rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <p className="font-bold">
                4. Regular oil and filter changes prevent big repairs
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Cheap, simple maintenance now avoids expensive engine damage
                later.
              </p>
            </div>
            <div className="p-4 sm:p-5 bg-white dark:bg-[#252526] rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <p className="font-bold">5. Timing is everything</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Both engine timing (crankshaft/camshaft) and ignition timing
                (spark) must be correct; otherwise the engine loses power,
                wastes fuel, and pollutes more.
              </p>
            </div>
            <div className="p-4 sm:p-5 bg-white dark:bg-[#252526] rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <p className="font-bold">6. Valve health affects everything</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Poor valve sealing or incorrect valve clearance reduces power,
                increases noise, and can damage the engine over time.
              </p>
            </div>
            <div className="p-4 sm:p-5 bg-white dark:bg-[#252526] rounded-xl shadow-md md:col-span-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <p className="font-bold">7. Different engines, different rules</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Four-stroke, two-stroke, and diesel engines all work
                differently. Knowing which type you're dealing with changes what
                maintenance and checks are needed.
              </p>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">
            End of Learning Outcome 1 — Engine Components & Maintenance
          </p>
          <div className="flex justify-center gap-3 sm:gap-4 flex-wrap px-2">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Crankshaft
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Lubrication
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              Tune-Up
            </span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
            Study Hard. Keep Engines Running. 🔧🚗
          </p>
        </footer>
      </div>
    </div>
  );
};
