import React from 'react';
import { 
  Zap, Battery, CircuitBoard, Cpu, Box, Radio, 
  Wrench, Settings, Gauge, Shield, Map, 
  ChevronLeft, ChevronRight, X, Activity,
  Thermometer, Droplet, Sun, Moon, Wind,
  TrendingUp, TrendingDown, AlertTriangle,
  Code, Table, BookOpen, Target, Heart,
  Sigma, Divide, Plus, Minus, Car, Cog,
  Volume2, Eye, Hand, Monitor, MapPin, Navigation2,
  Bell, Lightbulb, MessageSquare, 
  Flame
} from 'lucide-react';

export const LearningOutcome3: React.FC = () => {
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <CircuitBoard className="w-4 h-4" />
              Automotive Electronics: Module LO3
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Electrical Circuits, Symbols & <span className="text-purple-300 font-bold italic">Automotive Lighting</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to circuit types, symbols, current density, voltage drop, wire gauges, terminal designations, lighting technologies, bulb selection, basic lighting circuits, and Adaptive Front Lighting Systems (AFS).
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">circuits_lighting.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Circuit_Symbols;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Series_Parallel;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">CALCULATE</span><span className="text-white">Current_Density;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Lightbulb className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Zap className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: ELECTRICAL CIRCUITS AND SYMBOLS ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Electrical Circuits and Symbols</h2>
          </div>
          <div className={cardClasses('indigo')}>
            <p><strong>What an electrical circuit is:</strong> A closed loop that allows electricity to flow. Made up of components like power sources, conductors, and loads. Standardized symbols are used to represent these components clearly in diagrams.</p>
            <h3 className="text-lg font-bold mt-4 mb-2">Standard Automobile Electrical Symbols</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Battery:</strong> long and short parallel lines — longer line is positive terminal.</li>
              <li><strong>AC source:</strong> sine wave symbol.</li>
              <li><strong>Conductor (Wire):</strong> straight line.</li>
              <li><strong>Fixed resistor:</strong> zigzag line.</li>
              <li><strong>Variable resistor (potentiometer):</strong> zigzag line with arrow through middle.</li>
              <li><strong>SPST switch:</strong> two lines with a gap that can be opened or closed.</li>
              <li><strong>SPDT switch:</strong> two lines with a gap that can connect to either of two other lines.</li>
              <li><strong>Lamp/Bulb:</strong> circle with a filament inside.</li>
              <li><strong>Fuse:</strong> rectangular shape with a line through it.</li>
              <li><strong>Ground:</strong> triangle or series of horizontal lines decreasing in length.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: DRAWING SIMPLE CIRCUITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Drawing Simple Circuits</h2>
          </div>
          <div className={cardClasses('blue')}>
            <p><strong>Steps to draw a basic circuit:</strong></p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>Draw battery symbol — positive on one side, negative on the other.</li>
              <li>Draw switch symbol in series with battery.</li>
              <li>Draw lamp symbol in series with switch.</li>
              <li>Connect all components with straight lines (wires).</li>
            </ol>
            <p><strong>How the circuit behaves:</strong> Switch closed → circuit complete → current flows from positive terminal, through switch, through lamp, back to negative. Lamp lights up. Switch open → circuit broken → no current → lamp off.</p>
          </div>
        </section>

        {/* ========== SECTION 3: MORE COMPLEX CIRCUITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>More Complex Circuits</h2>
          </div>
          <div className={cardClasses('purple')}>
            <p>More complex circuits can include resistors, capacitors, inductors, and diodes. Each component has its own symbol. The arrangement determines overall circuit behaviour.</p>
          </div>
        </section>

        {/* ========== SECTION 4: SERIES, PARALLEL, COMBINATION CIRCUITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Series, Parallel, and Combination Circuits</h2>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-lg font-bold">Series </h3>
            <ul className="list-disc pl-5">
              <li>Components connected one after another — single path for current.</li>
              <li>Current is the same through every component.</li>
              <li>Voltage is divided/shared among components.</li>
              <li>If one component fails, the entire circuit breaks.</li>
            </ul>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-lg font-bold">Parallel </h3>
            <ul className="list-disc pl-5">
              <li>Components connected across same two points — multiple current paths.</li>
              <li>Voltage is the same across all components.</li>
              <li>Current is divided among paths.</li>
              <li>If one component fails, others keep working.</li>
            </ul>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-lg font-bold">Combination </h3>
            <p>A circuit containing both series and parallel connections together.</p>
          </div>
        </section>

        {/* ========== SECTION 5: AUTOMOBILE ELECTRICAL CIRCUITS (WHERE EACH TYPE IS USED) ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Automobile Electrical Circuits — Where Each Type Is Used</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-lg font-bold">Series Circuits in Vehicles</h3>
            <ul className="list-disc pl-5">
              <li>Headlights (older systems) — sometimes wired in series; if one bulb blew, both would go out (less common today).</li>
              <li>Some sensor circuits — simple sensor circuits may be wired in series.</li>
              <li>Indicators — very rarely, indicator lights can be wired in series.</li>
            </ul>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-lg font-bold">Parallel Circuits in Vehicles</h3>
            <ul className="list-disc pl-5">
              <li>Most lighting systems — modern headlights, taillights, interior lights (if one bulb fails, others stay on).</li>
              <li>Accessory circuits — power windows, locks, etc.</li>
              <li>Fuse boxes — multiple circuits connect to battery in parallel through fuse box.</li>
              <li>Horns — most often wired in parallel.</li>
            </ul>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-lg font-bold">Combination Circuits in Vehicles</h3>
            <ul className="list-disc pl-5">
              <li>Complex lighting systems — some advanced features use series and parallel mixed.</li>
              <li>Engine control systems — sensors, actuators, control modules wired in both series and parallel.</li>
              <li>Dashboard circuits — usually contain a mix.</li>
            </ul>
            <p><strong>How to Identify Type in a Diagram:</strong> Look for single path (series), multiple paths across same points (parallel), or mix (combination).</p>
            <p><strong>Practical Examples:</strong> Old-style Christmas lights (series) → one bulb out, whole string dark. Car interior lights (parallel) → one bulb out, others work. ECU (combination).</p>
          </div>
        </section>

        {/* ========== SECTION 6: MEASURING CURRENT DENSITY ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Measuring Current Density</h2>
          </div>
          <div className={cardClasses('amber')}>
            <p><strong>Definition:</strong> Current density = amount of current flowing per unit cross-sectional area of a conductor. Measured in A/m² or A/mm².</p>
            <p><strong>Procedure:</strong></p>
            <ol className="list-decimal pl-5">
              <li>Measure current (I) using ammeter connected in series.</li>
              <li>Measure cross-sectional area (A): circular → measure diameter d, then A = π(d/2)²; other shapes → calculate accordingly.</li>
              <li>Calculate current density: <MathFormula>J = I / A</MathFormula>.</li>
            </ol>
            <p><strong>Practical considerations:</strong> Ensure ammeter in series, use accurate tools, be aware of temperature effects on current density.</p>
          </div>
        </section>

        {/* ========== SECTION 7: MEASURING MAXIMUM PERMISSIBLE VOLTAGE DROP ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Measuring Maximum Permissible Voltage Drop</h2>
          </div>
          <div className={cardClasses('red')}>
            <p><strong>Definition:</strong> Voltage drop = decrease in voltage along conductor due to resistance. Maximum permissible = allowable voltage loss.</p>
            <p><strong>Procedure:</strong></p>
            <ol className="list-decimal pl-5">
              <li>Determine permissible voltage drop (from standards/design).</li>
              <li>Measure voltage at source (Vs) using voltmeter.</li>
              <li>Measure voltage at load (Vl).</li>
              <li>Calculate: <MathFormula>ΔV = Vs - Vl</MathFormula>.</li>
              <li>Compare — must be ≤ maximum permissible.</li>
            </ol>
            <p><strong>Considerations:</strong> Measure under normal operating conditions; consider wire length, gauge, and temperature effects.</p>
          </div>
        </section>

        {/* ========== SECTION 8: CALCULATING STANDARD WIRE GAUGES ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Calculating Standard Wire Gauges</h2>
          </div>
          <div className={cardClasses('blue')}>
            <p><strong>Definition:</strong> Standard wire gauges (e.g., AWG) define diameter and cross-sectional area.</p>
            <p><strong>Calculation:</strong> AWG is logarithmic: <MathFormula>n = 36 − 19.931 × log(d)</MathFormula>, where n = AWG number, d = diameter in inches. In practice, use AWG charts or online calculators.</p>
            <p><strong>Considerations:</strong> Select gauge based on current-carrying capacity and voltage drop requirements.</p>
          </div>
        </section>

        {/* ========== SECTION 9: DECODING TERMINAL DESIGNATIONS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Decoding Terminal Designations</h2>
          </div>
          <div className={cardClasses('green')}>
            <p><strong>Definition:</strong> Alphanumeric codes that show the function of a terminal on an electrical component.</p>
            <ul className="list-disc pl-5">
              <li>L = Line (live)</li>
              <li>N = Neutral</li>
              <li>E or G = Earth (ground)</li>
              <li>+ = Positive, − = Negative</li>
              <li>COM = Common, NO = Normally open, NC = Normally closed</li>
            </ul>
            <p><strong>Practical considerations:</strong> Consult manufacturer documentation, use multimeter to verify if needed, pay attention to color codes.</p>
          </div>
        </section>

        {/* ========== SECTION 10: AUTOMOTIVE LIGHTING TECHNOLOGIES ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Automotive Lighting Technologies</h2>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-lg font-bold">Conventional Bulb (Incandescent)</h3>
            <p>Tungsten filament in vacuum/inert gas. Current heats filament to glow. Inexpensive, short lifespan, low efficiency (much energy as heat).</p>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-lg font-bold">Semi-Sealed Unit</h3>
            <p>Replaceable bulb within sealed glass lens and reflector. Improved durability, easier maintenance, still less efficient than newer tech.</p>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-lg font-bold">Quartz Halogen</h3>
            <p>Tungsten filament in quartz glass with halogen gas. Halogen redeposits evaporated tungsten, extending lifespan and producing brighter, whiter light. Operates at higher temperature.</p>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-lg font-bold">LED Lights (Light-Emitting Diodes)</h3>
            <p>Semiconductor devices emit light when current passes. Highly efficient, long lifespan, bright focused light. Increasingly used for headlights, taillights, interior lighting.</p>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-lg font-bold">Gas Discharge Lights (HID — High-Intensity Discharge)</h3>
            <p>Arc between two electrodes in gas-filled bulb (xenon). Very bright white light, more efficient than halogen, longer lifespan. Require ballast to regulate voltage/current.</p>
          </div>
          <div className={cardClasses('indigo')}>
            <h3 className="text-lg font-bold">Xenon Lighting</h3>
            <p>Type of HID using xenon gas. Brilliant bluish-white light, excellent visibility. Common in high-end vehicles, requires ballast.</p>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-lg font-bold">Ultraviolet Headlights</h3>
            <p>Emit UV light converted to visible by phosphor coating. Not common in standard headlights due to safety/regulatory concerns; used in some specialized applications.</p>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-lg font-bold">Infrared Lights</h3>
            <p>Emit IR radiation. Used in night vision systems and driver assistance technologies. Not used for standard headlights (IR invisible); used with cameras that detect heat signatures.</p>
          </div>
        </section>

        {/* ========== SECTION 11: SELECTING BULBS BASED ON POWER RATINGS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Selecting Bulbs Based on Power Ratings</h2>
          </div>
          <div className={cardClasses('blue')}>
            <p><strong>Understanding Power Ratings (Watts):</strong> Higher wattage = more light but more current.</p>
            <p><strong>Manufacturer Specifications:</strong> Always check owner's manual for correct bulb type and wattage.</p>
            <p><strong>Risks of Incorrect Wattage:</strong> Overheating (higher wattage), reduced visibility (lower wattage), electrical system overload (blown fuses, damaged components).</p>
            <p><strong>Legal Requirements:</strong> Many jurisdictions regulate bulb types/wattages; non-compliance may result in fines or inspection failures.</p>
            <p><strong>Application-Specific Selection:</strong> Headlights need specific beam patterns; taillights/brake lights need brightness; turn signals need correct flash rate; interior lights use lower wattage.</p>
          </div>
        </section>

        {/* ========== SECTION 12: USING BULBS WITH VARIOUS POWER RATINGS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Using Bulbs with Various Power Ratings</h2>
          </div>
          <div className={cardClasses('green')}>
            <p><strong>Replacing Bulbs:</strong> Always replace with same wattage as original. If upgrading to halogen or LED, ensure compatibility and legal compliance.</p>
            <p><strong>LED Conversions:</strong> Increasingly popular. Ensure compatibility, correct light output, beam pattern. LEDs use much less power — may cause system issues (car thinks bulb is broken); may need additional resistors.</p>
            <p><strong>Testing and Troubleshooting:</strong> If bulb not working, check fuse and wiring before replacing. Use multimeter to test voltage at socket.</p>
            <p><strong>Modifications:</strong> Be very careful; modifying lighting circuits could damage vehicle electrical system. Adding extra lights or changing power ratings can overload system.</p>
          </div>
        </section>

        {/* ========== SECTION 13: BASIC LIGHTING CIRCUITS FOR MOTOR VEHICLES ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Basic Lighting Circuits for Motor Vehicles</h2>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-lg font-bold">A. Headlight (Simple)</h3>
            <p><strong>Layout:</strong> Battery → Fuse → Headlight Switch → Headlight Bulb → Ground</p>
            <p>Battery power flows through fuse, then switch, then bulb, then to ground.</p>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-lg font-bold">B. Taillight (Parallel)</h3>
            <p><strong>Layout:</strong> Battery → Fuse → Taillight Switch → splits into two parallel branches (each to a taillight bulb) → Ground</p>
            <p>Two bulbs in parallel: if one fails, the other still lights.</p>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-lg font-bold">C. Turn Signal (With Flasher)</h3>
            <p><strong>Layout:</strong> Battery → Fuse → Flasher Unit → Turn Signal Switch → splits into two parallel branches (each to a turn signal bulb) → Ground</p>
            <p>Flasher unit creates intermittent (on/off) current to make bulbs flash.</p>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-lg font-bold">D. Brake Light </h3>
            <p><strong>Layout:</strong> Battery → Fuse → Brake Light Switch → Brake Light Bulbs → Ground</p>
            <p>Brake light switch closes when brake pedal pressed, completing circuit and lighting brake lights.</p>
          </div>
        </section>

        {/* ========== SECTION 14: ADAPTIVE FRONT LIGHTING SYSTEM (AFS) ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Adaptive Front Lighting System (AFS) / Intelligent Front Lighting</h2>
          </div>
          <div className={cardClasses('indigo')}>
            <p><strong>Principle of Operation:</strong> Sophisticated system that adjusts headlight beam pattern based on driving conditions to optimise visibility while minimising glare.</p>
            <p><strong>Sensors Used:</strong> Vehicle speed sensors, steering angle sensors, yaw rate sensors, light sensors (ambient light).</p>
            <p><strong>Control Unit:</strong> Central unit processes sensor data to calculate optimal beam pattern.</p>
            <p><strong>Actuators:</strong> Small electric motors adjust position and direction of headlight beams.</p>
            <p><strong>Key Functions:</strong></p>
            <ul className="list-disc pl-5">
              <li><strong>Curve lighting:</strong> Headlights swivel toward turn to illuminate the road ahead.</li>
              <li><strong>Speed-dependent lighting:</strong> Higher speeds → longer/narrower beam for distance; lower speeds → wider beam for surroundings.</li>
              <li><strong>Weather-dependent lighting:</strong> Adjust beam pattern for rain or fog.</li>
              <li><strong>Automatic leveling:</strong> Keeps headlights aimed correctly regardless of load or road angle.</li>
              <li><strong>Glare reduction:</strong> Cameras detect oncoming traffic and adjust high beams to avoid blinding other drivers.</li>
            </ul>
            <p><strong>Benefits:</strong> Improved visibility in various conditions, enhanced safety for driver and other road users, reduced glare for oncoming drivers.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Electrical Circuits, Symbols & Automotive Lighting</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Types</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lighting Tech</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Current Density</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">AFS</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Circuits & Lighting. 💡🔌</p>
        </footer>

      </div>
    </div>
  );
};