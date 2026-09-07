import React from 'react';
import { Flag, Car, Wrench, Settings, Gauge, Cog, Box, Circle, ArrowUpDown, Zap, AlertTriangle, Droplet, Thermometer, Shield, Map, ChevronLeft, ChevronRight, X } from 'lucide-react';

const IMAGE_ROOT = '/images/courses/nc-auto/motor-vehicle-systems-minor-service';

const ComponentPhoto = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <figure className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#161616]">
    <img
      src={`${IMAGE_ROOT}/${src}`}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-52 w-full bg-slate-50 object-contain p-2 sm:h-64 dark:bg-slate-900"
    />
    <figcaption className="border-t border-slate-200 px-3 py-2 text-center text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-400">
      {caption}
    </figcaption>
  </figure>
);

export const LearningOutcome2: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const containerClasses = isDarkMode
    ? 'w-full py-6 sm:py-6 md:py-8 px-[5px] sm:px-[5px] sm:px-6 md:px-8 dark:bg-[#1e1e1e] bg-white min-h-screen'
    : 'w-full py-6 sm:py-6 md:py-8 px-[5px] sm:px-[5px] sm:px-6 md:px-8 dark:bg-[#1e1e1e] bg-white min-h-screen';

  const sectionHeaderClasses = isDarkMode
    ? 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 inline-block relative group text-white uppercase mt-8'
    : 'text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 inline-block relative group uppercase mt-8';

  const cardClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: '',
      green: '',
      purple: '',
      amber: '',
      red: '',
      indigo: '' };
    const borderColor = colorMap[color] || colorMap.blue;
    return `py-4 mb-4 ${borderColor}`;
  };

  return (
    <div className={containerClasses}>
      
      {/* HEADER SECTION */}
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <Settings className="w-4 h-4" />
              Automotive: Module LO2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Drivetrain <span className="text-sky-300 font-bold italic">Components & Transmission</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to gearboxes, clutches, differentials, transfer cases, transmission maintenance, and common fault diagnosis.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">drivetrain_notes.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Transmission_Module;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">INSPECT</span><span className="text-white">Clutch_Flywheel;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">DIAGNOSE</span><span className="text-white">Transmission_Faults;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Car className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Gauge className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* SECTION 1: MAJOR DRIVETRAIN COMPONENTS */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Major Drivetrain Components</h2>
          </div>

          {/* Gearbox */}
          <div className={cardClasses('blue')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Gearbox (Transmission)</h3>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-3">
              <p><strong>Visual:</strong> A large, usually metal, housing that contains gears and shafts. It's located between the engine and the propeller shaft (in rear-wheel drive vehicles) or integrated with the differential (in front-wheel-drive vehicles).</p>
              <p><strong>Function:</strong> Changes the gear ratio between the engine and the wheels, providing different speeds and torque.</p>
              <p><strong>Types:</strong> Manual or automatic.</p>
            </div>
            <ComponentPhoto src="manual-transmission.jpg" alt="Five-speed Getrag manual transmission removed from a vehicle" caption="Real five-speed manual transmission: the bell housing faces the engine and the output shaft carries torque toward the final drive." />
          </div>

          {/* Clutch */}
          <div className={cardClasses('green')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Clutch</h3>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-3">
              <p><strong>Visual:</strong> A round, flat plate housed between the engine's flywheel and the gearbox. It's usually not visible without disassembly.</p>
              <p><strong>Function:</strong> Disconnects and reconnects the engine from the transmission, allowing gear changes.</p>
              <p><strong>Types:</strong> Friction clutch (most common), hydraulic clutch.</p>
            </div>
            <ComponentPhoto src="clutch-disc.jpg" alt="Automotive friction clutch disc" caption="Clutch disc showing the friction linings, splined hub and torsional damper springs." />
          </div>

          {/* Flywheel */}
          <div className={cardClasses('purple')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Flywheel</h3>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-3">
              <p><strong>Visual:</strong> A heavy, circular metal disc attached to the rear of the engine's crankshaft. It's often visible when the clutch housing is removed.</p>
              <p><strong>Function:</strong> Stores rotational energy, smooths out engine power pulses, and provides a surface for the clutch to engage.</p>
            </div>
            <ComponentPhoto src="flywheel-clutch-cutaway.jpg" alt="Cutaway dual-mass flywheel and clutch assembly" caption="Cutaway dual-mass flywheel and clutch assembly, including the starter ring gear and internal damping mechanism." />
          </div>

          {/* Propeller Shaft */}
          <div className={cardClasses('amber')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Propeller Shaft (Driveshaft)</h3>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-3">
              <p><strong>Visual:</strong> A long, rotating shaft that connects the gearbox to the differential (in rear-wheel-drive and four-wheel-drive vehicles). It runs along the underside of the vehicle.</p>
              <p><strong>Function:</strong> Transmits power from the gearbox to the rear axle.</p>
              <p><strong>Components:</strong> Universal joints (U-joints) allow for changes in angle.</p>
            </div>
            <ComponentPhoto src="propeller-shaft.jpg" alt="Truck propeller shaft with universal joints" caption="Propeller shaft with universal joints, which transmit torque while allowing changes in driveline angle." />
          </div>

          {/* Transfer Box */}
          <div className={cardClasses('red')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Transfer Box (Transfer Case)</h3>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-3">
              <p><strong>Visual:</strong> A separate gearbox-like unit found in four-wheel-drive vehicles. It's located between the main gearbox and the propeller shafts.</p>
              <p><strong>Function:</strong> Splits engine power between the front and rear axles, providing four-wheel drive.</p>
              <p><strong>Features:</strong> May have low-range gears for off-road use.</p>
            </div>
            <ComponentPhoto src="transfer-case.jpg" alt="Four-wheel-drive transfer case with front and rear outputs" caption="Four-wheel-drive transfer case: separate output shafts send torque to the front and rear axles." />
          </div>

          {/* Differential Unit */}
          <div className={cardClasses('indigo')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Differential Unit</h3>
            <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none space-y-3">
              <p><strong>Visual:</strong> A housing located in the center of the rear axle (or integrated with the front axle in front-wheel-drive vehicles).</p>
              <p><strong>Function:</strong> Allows the wheels on an axle to rotate at different speeds, which is essential when turning.</p>
              <p><strong>Components:</strong> Gears, bearings, and a differential carrier.</p>
              <p><strong>Types:</strong> Open differential, limited-slip differential, locking differential.</p>
            </div>
            <ComponentPhoto src="differential-gears.jpg" alt="Automotive differential ring gear and internal gears" caption="Differential gear assembly: the crown wheel drives the carrier while the internal gears permit different left- and right-wheel speeds." />
          </div>
        </section>

        {/* SECTION 2: CHANGING TRANSMISSION OIL */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Changing Transmission Oil</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Tools and Materials</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>New transmission fluid (correct type and quantity)</li>
              <li>Drain pan</li>
              <li>Wrenches or sockets (appropriate sizes)</li>
              <li>Funnel</li>
              <li>Rags or shop towels</li>
              <li>Jack and jack stands (or ramps)</li>
              <li>Torque wrench (recommended)</li>
              <li>New drain plug gasket (if applicable)</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">Procedure</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Prepare the Vehicle:</strong> Park on level surface, engage parking brake. Warm up transmission fluid if possible. Safely raise the vehicle.</li>
              <li><strong>Locate the Drain Plug:</strong> Usually on the bottom of the transmission pan. Consult service manual.</li>
              <li><strong>Drain the Old Fluid:</strong> Position drain pan, loosen drain plug carefully (fluid may be hot). Allow complete draining. Inspect plug and replace gasket. Reinstall and torque to spec.</li>
              <li><strong>Locate the Fill Plug/Dipstick:</strong> Usually on side or top of transmission.</li>
              <li><strong>Fill with New Fluid:</strong> Use funnel, fill to correct level. For automatics, engine running and in park when checking level.</li>
              <li><strong>Check for Leaks:</strong> Start engine, idle, shift through gears. Inspect drain and fill plugs.</li>
              <li><strong>Recheck Fluid Level:</strong> After test drive, recheck and top up if needed.</li>
              <li><strong>Lower the Vehicle and Dispose of Old Fluid Responsibly.</strong></li>
            </ol>
          </div>
        </section>

        {/* SECTION 3: BASIC TRANSMISSION OPERATION */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Basic Transmission Operation</h2>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Manual Transmissions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Driver manually selects gears using shift lever.</li>
              <li>Clutch disengages engine during gear changes.</li>
              <li>Gears are engaged by sliding them along shafts using shift forks.</li>
              <li>Lower gears = more torque for acceleration; higher gears = higher speeds for cruising.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Automatic Transmissions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Gears change automatically based on speed, engine load, and driver input.</li>
              <li>Torque converter replaces clutch, using fluid to transmit power.</li>
              <li>Planetary gear sets achieve different gear ratios.</li>
              <li>Hydraulic pressure and electronic controls manage shifts.</li>
              <li>Modern systems adapt to driving conditions.</li>
            </ul>
          </div>
        </section>

        {/* SECTION 4: COMMON TRANSMISSION FAULTS */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Common Transmission Faults</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Manual Transmissions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li><strong>Grinding Gears:</strong> Worn synchronizers.</li>
              <li><strong>Difficulty Shifting:</strong> Clutch problems, worn linkages, low fluid.</li>
              <li><strong>Popping Out of Gear:</strong> Worn gears or shift forks.</li>
              <li><strong>Clutch Slipping:</strong> Worn clutch disc or pressure plate.</li>
              <li><strong>Leaking Seals:</strong> Result in low fluid levels.</li>
            </ul>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Automatic Transmissions</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li><strong>Slipping Gears:</strong> Low fluid or worn clutches.</li>
              <li><strong>Rough or Delayed Shifts:</strong> Low fluid, valve body problems, solenoid failures.</li>
              <li><strong>No Movement:</strong> Torque converter, pump, or internal component failure.</li>
              <li><strong>Fluid Leaks:</strong> Lead to low fluid and various issues.</li>
              <li><strong>Overheating:</strong> Low fluid, heavy towing, internal problems.</li>
              <li><strong>Check Engine Light/Transmission Codes:</strong> Electronic faults.</li>
              <li><strong>Torque Converter Problems:</strong> Shuddering or complete failure.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">General Transmission Issues</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li><strong>Contaminated Fluid:</strong> Damages internal components.</li>
              <li><strong>Low Fluid Levels:</strong> Leaks or improper filling.</li>
              <li><strong>Worn Bearings or Gears:</strong> Noise and vibration.</li>
              <li><strong>Electronic Control Problems:</strong> Faulty sensors, solenoids, or control modules.</li>
              <li><strong>Linkage Problems:</strong> Worn cables or mechanical linkages cause shifting issues.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Drivetrain & Transmission</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Gearbox</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Clutch</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Differential</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transmission Oil</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master the Drivetrain. 🔧🚗</p>
        </footer>

      </div>
    </div>
  );
};
