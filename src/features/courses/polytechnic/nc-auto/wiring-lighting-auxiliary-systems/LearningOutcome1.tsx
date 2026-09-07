import React from 'react';
import { 
  Zap, Battery, CircuitBoard, Cpu, Box, Radio, 
  Wrench, Settings, Gauge, Shield, Map, 
  ChevronLeft, ChevronRight, X, Activity,
  Thermometer, Droplet, Sun, Moon, Wind,
  TrendingUp, TrendingDown, AlertTriangle,
  Code, Table, BookOpen, Target, Heart,
  Sigma, Divide, Plus, Minus, Car, Cog
} from 'lucide-react';

export const LearningOutcome1: React.FC = () => {
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

  const TableWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-x-auto my-4">
      <table className={`min-w-full text-sm border-collapse ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {children}
      </table>
    </div>
  );

  const MathFormula = ({ children }: { children: React.ReactNode }) => (
    <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md text-indigo-700 dark:text-indigo-300">
      {children}
    </span>
  );

  return (
    <div className={containerClasses}>
      
      {/* HEADER SECTION */}
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <Cog className="w-4 h-4" />
              Automotive & Electronics: Module LO1
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Drivetrain & <span className="text-emerald-300 font-bold italic">Basic Electricity</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to gearbox, clutch, differential, transmission maintenance, matter, atomic structure, electrical laws, formulas, and wiring specifications.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">drivetrain_electricity.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Transmission_Module;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Atomic_Structure;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">CALCULATE</span><span className="text-white">Ohms_Law;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Car className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Battery className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: DRIVETRAIN COMPONENTS ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Drivetrain Components</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Gearbox (Transmission)</h3>
            <p><strong>What it is:</strong> A large housing, usually made of metal, containing gears and shafts.</p>
            <p><strong>Where it is located:</strong> Between the engine and propeller shaft (RWD) or integrated with differential (FWD).</p>
            <p><strong>What it does:</strong> Changes gear ratio between engine and wheels, providing different speeds and torque.</p>
            <p><strong>Types:</strong> Manual, Automatic.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Clutch</h3>
            <p><strong>What it is:</strong> A round, flat plate housed between the engine's flywheel and gearbox. Usually not visible without disassembly.</p>
            <p><strong>What it does:</strong> Disconnects and reconnects engine from transmission, allowing smooth gear changes.</p>
            <p><strong>Types:</strong> Friction clutch (most common), Hydraulic clutch.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Flywheel</h3>
            <p><strong>What it is:</strong> A heavy, circular metal disc attached to the rear of the engine's crankshaft. Often visible when clutch housing is removed.</p>
            <p><strong>What it does:</strong> Stores rotational energy, smooths out engine power pulses, provides flat surface for clutch engagement.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Propeller Shaft (Driveshaft)</h3>
            <p><strong>What it is:</strong> A long, rotating shaft along the underside of the vehicle.</p>
            <p><strong>What it does:</strong> Connects gearbox to differential (RWD/4WD) and transmits power to rear axle.</p>
            <p><strong>Key components:</strong> Universal joints (U-joints) allow changes in angle.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Transfer Box (Transfer Case)</h3>
            <p><strong>What it is:</strong> Separate gearbox-like unit found only in 4WD vehicles, located between main gearbox and propeller shafts.</p>
            <p><strong>What it does:</strong> Splits engine power between front and rear axles (provides 4WD).</p>
            <p><strong>Features:</strong> May include low-range gears for off-road use.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">Differential Unit</h3>
            <p><strong>What it is:</strong> Housing in center of rear axle (or integrated with front axle in FWD).</p>
            <p><strong>What it does:</strong> Allows wheels on an axle to rotate at different speeds (essential when turning – outer wheel travels further/faster).</p>
            <p><strong>Key components:</strong> Gears, bearings, differential carrier.</p>
            <p><strong>Types:</strong> Open differential, Limited-slip differential, Locking differential.</p>
          </div>
        </section>

        {/* ========== SECTION 2: CHANGING TRANSMISSION OIL ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Changing Transmission Oil</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Why It Matters</h3>
            <p>Ensures smooth gear shifts, prolongs transmission life. Always refer to vehicle service manual.</p>
            <p><strong>Tools & materials:</strong> New fluid (correct type), drain pan, wrenches/sockets, funnel, rags, jack & stands, torque wrench, new drain plug gasket (if applicable).</p>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Step-by-Step Procedure</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Prepare vehicle:</strong> Level surface, parking brake, warm fluid (if needed), safely raise.</li>
              <li><strong>Locate drain plug:</strong> Usually bottom of transmission pan.</li>
              <li><strong>Drain old fluid:</strong> Position pan, loosen plug (fluid hot), drain completely, clean plug, replace gasket, torque to spec.</li>
              <li><strong>Locate fill plug/dipstick:</strong> Side or top of transmission.</li>
              <li><strong>Fill with new fluid:</strong> Use funnel, fill to correct level. For automatics, engine running and in park when checking.</li>
              <li><strong>Check for leaks:</strong> Start engine, idle, shift through gears, inspect plugs.</li>
              <li><strong>Finish up:</strong> Lower vehicle, dispose of old fluid responsibly.</li>
            </ol>
          </div>
        </section>

        {/* ========== SECTION 3: BASIC TRANSMISSION OPERATION ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Basic Transmission Operation</h2>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Manual Transmissions</h3>
            <ul className="list-disc pl-5">
              <li>Driver manually selects gears using shift lever.</li>
              <li>Clutch disengages engine during gear changes.</li>
              <li>Gears engaged by sliding along shafts with shift forks.</li>
              <li>Lower gears = more torque (acceleration); higher gears = higher speed (cruising).</li>
            </ul>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Automatic Transmissions</h3>
            <ul className="list-disc pl-5">
              <li>Gears change automatically based on speed, engine load, driver input.</li>
              <li>Torque converter replaces clutch (fluid transmission).</li>
              <li>Planetary gear sets achieve different ratios.</li>
              <li>Hydraulic pressure and electronic controls manage shifts.</li>
              <li>Modern systems adapt to driving conditions.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: COMMON TRANSMISSION FAULTS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Common Transmission Faults</h2>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Manual Transmissions</h3>
            <ul className="list-disc pl-5">
              <li>Grinding gears → worn synchronizers.</li>
              <li>Difficulty shifting → clutch problems, worn linkages, low fluid.</li>
              <li>Popping out of gear → worn gears or shift forks.</li>
              <li>Clutch slipping → worn clutch disc or pressure plate.</li>
              <li>Leaking seals → low fluid.</li>
            </ul>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Automatic Transmissions</h3>
            <ul className="list-disc pl-5">
              <li>Slipping gears → low fluid or worn clutches.</li>
              <li>Rough/delayed shifts → low fluid, valve body, solenoid failures.</li>
              <li>No movement → torque converter, pump, internal failure.</li>
              <li>Fluid leaks → low fluid.</li>
              <li>Overheating → low fluid, heavy towing, internal problems.</li>
              <li>Check engine light / codes → electronic faults.</li>
              <li>Torque converter problems → shuddering or failure.</li>
            </ul>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">General Transmission Issues</h3>
            <ul className="list-disc pl-5">
              <li>Contaminated fluid → damages internal components.</li>
              <li>Low fluid levels → leaks or improper filling.</li>
              <li>Worn bearings/gears → noise and vibration.</li>
              <li>Electronic control problems → faulty sensors, solenoids, modules.</li>
              <li>Linkage problems → worn cables/mechanical linkages cause shifting issues.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: MATTER AND ELEMENTS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Matter and Elements</h2>
          </div>
          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">Matter</h3>
            <p><strong>Definition:</strong> Anything that has mass and occupies space (volume). If you can touch it, see it, or feel its presence, it's matter.</p>
            <p><strong>States of matter:</strong> Solid, Liquid, Gas, Plasma – determined by particle arrangement and energy.</p>
            <p><strong>Why it matters:</strong> Everything around us is matter. Mass measures amount, volume measures space. Made of atoms/molecules. Changes in temperature/pressure cause state changes (e.g., ice melting).</p>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Elements</h3>
            <p><strong>Definition:</strong> A pure substance that cannot be broken down by chemical means; made of only one type of atom.</p>
            <p><strong>Key facts:</strong> Basic building blocks of all matter. Organized on periodic table by atomic number (# of protons). Each element has unique properties from atomic structure (electron arrangement).</p>
            <p><strong>Elements combining into compounds:</strong> Through chemical reactions. Example: sodium (reactive metal) + chlorine (poisonous gas) → sodium chloride (table salt).</p>
          </div>
        </section>

        {/* ========== SECTION 6: ATOMIC STRUCTURE – BOHR MODEL ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Atomic Structure – Bohr's Atomic Model</h2>
          </div>
          <div className={cardClasses('amber')}>
            <p><strong>What it is:</strong> Model by Niels Bohr (early 20th century) built on Rutherford's nuclear model. Proposed electrons orbit nucleus in fixed, quantized energy levels – helped explain hydrogen spectral lines.</p>
            <p><strong>How it works:</strong> Small positive nucleus surrounded by orbiting electrons in specific shells. Orbits are quantized – electrons can only exist at certain levels. Jumping between levels emits or absorbs photons (spectral lines). Though replaced by quantum models, it's still useful for understanding basic atomic structure.</p>
          </div>
        </section>

        {/* ========== SECTION 7: CONDUCTORS VS INSULATORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Electrical Conductors vs. Insulators</h2>
          </div>
          <div className={cardClasses('red')}>
            <TableWrapper>
              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                <tr><th className="border p-2">Property</th><th className="border p-2">Conductors</th><th className="border p-2">Insulators</th></tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">Electron flow</td><td className="border p-2">Allow free flow</td><td className="border p-2">Resist flow</td></tr>
                <tr><td className="border p-2">Conductivity</td><td className="border p-2">High</td><td className="border p-2">Low</td></tr>
                <tr><td className="border p-2">Electron config</td><td className="border p-2">Free/loosely bound outer electrons</td><td className="border p-2">Tightly bound outer electrons</td></tr>
                <tr><td className="border p-2">Resistance</td><td className="border p-2">Low</td><td className="border p-2">High</td></tr>
                <tr><td className="border p-2">Temperature effect</td><td className="border p-2">Conductivity ↓ as T ↑ (most metals)</td><td className="border p-2">Resistance ↓ as T ↑ (many)</td></tr>
                <tr><td className="border p-2">Use cases</td><td className="border p-2">Wiring, circuits, transmission</td><td className="border p-2">Insulation, shock protection</td></tr>
                <tr><td className="border p-2">Atomic structure</td><td className="border p-2">Easy valence electron movement</td><td className="border p-2">Valence electrons held tightly</td></tr>
                <tr><td className="border p-2">Examples</td><td className="border p-2">Cu, Ag, Au, Al, Fe, salt water, graphite</td><td className="border p-2">Rubber, glass, plastic, wood, ceramics, air</td></tr>
              </tbody>
            </TableWrapper>
          </div>
        </section>

        {/* ========== SECTION 8: ELECTRON SHELLS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Electron Shells</h2>
          </div>
          <div className={cardClasses('blue')}>
            <p>Electrons occupy energy levels (shells) around the nucleus. Shells numbered 1,2,3… or K,L,M… Each shell has a maximum electron capacity.</p>
            <h4 className="font-bold mt-3">Example Atoms and Their Shell Distributions</h4>
            <TableWrapper>
              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                <tr><th className="border p-2">Element</th><th className="border p-2">Atomic #</th><th className="border p-2">Electron Configuration</th><th className="border p-2">Shell Distribution</th></tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">Hydrogen (H)</td><td className="border p-2">1</td><td className="border p-2">1s¹</td><td className="border p-2">1</td></tr>
                <tr><td className="border p-2">Silicon (Si)</td><td className="border p-2">14</td><td className="border p-2">[Ne] 3s² 3p²</td><td className="border p-2">2, 8, 4</td></tr>
                <tr><td className="border p-2">Copper (Cu)</td><td className="border p-2">29</td><td className="border p-2">[Ar] 3d¹⁰ 4s¹</td><td className="border p-2">2, 8, 18, 1</td></tr>
                <tr><td className="border p-2">Germanium (Ge)</td><td className="border p-2">32</td><td className="border p-2">[Ar] 4s² 3d¹⁰ 4p²</td><td className="border p-2">2, 8, 18, 4</td></tr>
                <tr><td className="border p-2">Arsenic (As)</td><td className="border p-2">33</td><td className="border p-2">[Ar] 4s² 3d¹⁰ 4p³</td><td className="border p-2">2, 8, 18, 5</td></tr>
                <tr><td className="border p-2">Indium (In)</td><td className="border p-2">49</td><td className="border p-2">[Kr] 5s² 4d¹⁰ 5p¹</td><td className="border p-2">2, 8, 18, 18, 3</td></tr>
              </tbody>
            </TableWrapper>
          </div>
        </section>

        {/* ========== SECTION 9: FLOW OF CURRENT ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Flow of Current in an Electrical </h2>
          </div>
          <div className={cardClasses('green')}>
            <p>For current to flow, three conditions must be met:</p>
            <ol className="list-decimal pl-5 mt-2">
              <li><strong>A closed circuit (complete path)</strong> – continuous loop from power source negative to positive. Any break stops current.</li>
              <li><strong>A voltage source (potential difference)</strong> – provides the "push" (volts). Without it, no force to drive electrons.</li>
              <li><strong>A conductor</strong> – material with free electrons (e.g., copper wire).</li>
            </ol>
            <p className="mt-3"><strong>Simple analogy (water circuit):</strong> Pump = voltage source, Pipe = closed circuit, Material = conductor.</p>
          </div>
        </section>

        {/* ========== SECTION 10: ELECTRICAL PHENOMENA, UNITS, FORMULAS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Electrical Phenomena, Units, and Formulas</h2>
          </div>
          <div className={cardClasses('purple')}>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Electromotive Force (EMF):</strong> ε = W / Q (Volts)</li>
              <li><strong>Potential Difference (PD):</strong> V = W / Q (Volts)</li>
              <li><strong>Current:</strong> I = Q / t (Amperes)</li>
              <li><strong>Resistance (Ohm's Law):</strong> R = V / I (Ohms, Ω)</li>
              <li><strong>Power:</strong> P = V × I = I² × R = V² / R (Watts)</li>
              <li><strong>Resistivity:</strong> ρ = (R × A) / L (Ω·m)</li>
              <li><strong>Temperature Coefficient:</strong> Rt = R₀[1 + α(T – T₀)] (α in °C⁻¹ or K⁻¹)</li>
              <li><strong>Charge:</strong> Q = I × t (Coulombs)</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 11: EFFECTS OF ELECTRICITY ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Effects of Electricity</h2>
          </div>
          <div className={cardClasses('amber')}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Heating effect</strong> – Joule heating (heaters, toasters, bulbs).</li>
              <li><strong>Magnetic effect</strong> – magnetic field around conductor (electromagnets, motors, generators).</li>
              <li><strong>Chemical effect</strong> – electrolysis (electroplating, battery charging).</li>
              <li><strong>Light effect</strong> – atoms excited emit light (LEDs, fluorescent, arc lamps).</li>
              <li><strong>Physiological effect</strong> – affects living organisms (pacemakers, defibrillators, electric shocks).</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 12: APPLICATIONS OF ELECTRICITY ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Applications of Electricity</h2>
          </div>
          <div className={cardClasses('blue')}>
            <ul className="list-disc pl-5">
              <li>Power generation and distribution (homes, businesses, industries)</li>
              <li>Electronics and communication (computers, smartphones, TV, radio, internet)</li>
              <li>Transportation (electric vehicles, trains, aircraft)</li>
              <li>Industrial processes (manufacturing, automation, robotics)</li>
              <li>Medical technology (diagnostic equipment, treatment devices, life support)</li>
              <li>Lighting and heating (household and industrial)</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 13: LAWS RELATED TO ELECTRICAL CIRCUITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Laws Related to Electrical Circuits</h2>
          </div>
          <div className={cardClasses('red')}>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Ohm's Law:</strong> V = I × R. Voltage ∝ current (constant temperature).</li>
              <li><strong>Kirchhoff's Current Law (KCL):</strong> Total current entering a junction equals total current leaving.</li>
              <li><strong>Kirchhoff's Voltage Law (KVL):</strong> Sum of voltages around any closed loop equals zero.</li>
              <li><strong>Joule's Law:</strong> H = I² × R × t (heat generated).</li>
              <li><strong>Power Law:</strong> P = V × I = I² × R = V² / R.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 14: WIRING ACCORDING TO SPECIFICATIONS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Wiring According to Specifications</h2>
          </div>
          <div className={cardClasses('green')}>
            <p><strong>Why it matters:</strong> Ensures safety, reliability, functionality. Follow established standards.</p>
            <h4 className="font-bold mt-3">Identifying and Interpreting Key Items</h4>
            <ul className="list-disc pl-5">
              <li><strong>Cable gauges (AWG):</strong> Lower gauge = thicker wire = higher current capacity. Prevents overheating and voltage drop.</li>
              <li><strong>Colour codes:</strong> North America: black=hot, white=neutral, green=ground. Europe: brown=live, blue=neutral, green/yellow=earth.</li>
              <li><strong>Terminal designations (L, N, E, +, −):</strong> Ensure correct connections.</li>
              <li><strong>Printed circuits (PCBs):</strong> Conductive tracks; understanding layout aids troubleshooting.</li>
              <li><strong>protection devices:</strong> Fuses, circuit breakers – must be correctly rated.</li>
              <li><strong>Terminals:</strong> Screw, crimp, push-in – choose right type, secure connection.</li>
              <li><strong>Switches:</strong> Toggle, push-button, rotary – understand ratings and configurations (SPST, SPDT).</li>
            </ul>
            <h4 className="font-bold mt-3">Harness Designs and Layouts</h4>
            <p><strong>What harnesses are:</strong> Organized bundles of wires connecting different parts of a system.</p>
            <p><strong>Design considerations:</strong> Wire routing (minimize interference/voltage drop), environmental protection (heat, moisture, vibration), accessibility for maintenance.</p>
            <p><strong>Layout:</strong> Created with CAD software, includes detailed drawings of routing, terminal locations, connector types.</p>
            <p><strong>Description:</strong> Planning physical path, securing with clips/ties, protective sleeving. Critical in automotive, aerospace, industrial applications. Account for flexibility and strain relief.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — Drivetrain & Basic Electricity</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transmission</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Matter & Elements</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ohm's Law</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wiring Specs</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Drivetrain & Electricity. ⚡🔧</p>
        </footer>

      </div>
    </div>
  );
};