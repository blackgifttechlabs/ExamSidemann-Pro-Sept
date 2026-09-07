import React from 'react';
import { 
  Zap, Battery, Cpu, Box, Radio, 
  Wrench, Settings, Gauge, Shield, Map, 
  ChevronLeft, ChevronRight, X, Activity,
  Thermometer, Droplet, Sun, Moon, Wind,
  TrendingUp, TrendingDown, AlertTriangle,
  Code, Table, BookOpen, Target, Heart,
  Sigma, Divide, Plus, Minus, Car, Cog,
  Volume2, Eye, Hand, Monitor, Navigation,
  Bell, Lightbulb, Vibrate, MessageSquare, 
  Flame, Sparkles, Fuel, 
  AlertCircle, ShieldAlert, ZapOff, 
  Microscope, Scan, Wifi, Cloud,
  TestTube, 
  HardDrive, Server,
  CheckCircle, XCircle, ArrowRight, 
  Clock, TrendingUp as TrendingUpIcon,
  CloudRain, Wind as WindIcon, 
  Droplets,
  Recycle, Leaf, BatteryCharging,
  BatteryFull, BatteryWarning,
  Sparkle, Magnet, RotateCw, 
  ArrowLeftRight, ArrowUpDown,
  Disc, Car as CarIcon,
  Power, 
  Circle as CircleIcon,
  ArrowBigUp, ArrowBigDown
} from 'lucide-react';

export const LearningOutcome4: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const containerClasses = isDarkMode
    ? 'w-full py-4 px-[5px] sm:px-6 dark:bg-[#1e1e1e] bg-white min-h-screen'
    : 'w-full py-4 px-[5px] sm:px-6 dark:bg-[#1e1e1e] bg-white min-h-screen';

  const sectionHeaderClasses = isDarkMode
    ? 'text-2xl sm:text-3xl md:text-4xl font-bold mb-8 inline-block relative group text-white uppercase mt-12'
    : 'text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-8 inline-block relative group uppercase mt-12';

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
      <header className="bg-[#78350f] dark:bg-[#451a03] border-b border-amber-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <Zap className="w-4 h-4" />
              Automotive Electrical: Module LO4
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              AC Production & <span className="text-amber-300 font-bold italic">Charging Systems</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to AC generation, passive components (R, L, C), sine waves, alternator construction, excitation methods, regulators, and smart charging systems.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">ac_charging.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">AC_Generation;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">RLC_Circuits;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">CALCULATE</span><span className="text-white">Reactance_Impedance;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Activity className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Power className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: PRODUCTION OF ALTERNATING CURRENT ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Production of Alternating Current (AC)</h2>
          </div>

          <div className={cardClasses('blue')}>
            <p>Alternating current (AC) is electrical current that periodically reverses direction and changes magnitude over time. It is the type of electricity commonly used in homes and businesses.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Principle of Electromagnetic Induction</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>AC generation is based on Faraday's law of electromagnetic induction.</li>
              <li>When a conductor moves through a magnetic field or a magnetic field changes around a conductor, a voltage (EMF) is induced.</li>
              <li>If the conductor is part of a closed circuit, the induced voltage causes current to flow.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">AC Generator (Alternator)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>An AC generator consists of a rotating coil (armature) within a stationary magnetic field (created by permanent magnets or electromagnets).</li>
              <li>As the coil rotates, the magnetic flux linking the coil changes, inducing a voltage.</li>
              <li>The induced voltage changes polarity with each half rotation of the coil, producing an alternating voltage waveform (typically a sine wave).</li>
              <li>Slip rings are used to connect the rotating coil to the external circuit, allowing the AC to flow.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Factors Affecting AC Generation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Rotation Speed:</strong> The faster the coil rotates, the higher the frequency of the AC.</li>
              <li><strong>Magnetic Field Strength:</strong> A stronger magnetic field induces a higher voltage.</li>
              <li><strong>Number of Turns in the Coil:</strong> More turns in the coil result in a higher voltage.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: EFFECTS OF PASSIVE COMPONENTS IN AC CIRCUITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Effects of Passive Components in AC Circuits</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Resistors (R)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Effect:</strong> Resistors oppose the flow of current in AC circuits, just as they do in DC circuits.</li>
              <li><strong>Ohm's Law:</strong> <MathFormula>V = I × R</MathFormula> (voltage, current, resistance).</li>
              <li><strong>Phase Relationship:</strong> In a purely resistive AC circuit, the voltage and current are in phase (reach peak values at the same time).</li>
              <li><strong>Power Dissipation:</strong> Resistors dissipate electrical energy as heat.</li>
            </ul>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Capacitors (C)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Effect:</strong> Capacitors store electrical energy in an electric field.</li>
              <li><strong>Capacitive Reactance (X<sub>C</sub>):</strong> Capacitors oppose the flow of AC. X<sub>C</sub> is inversely proportional to frequency and capacitance.</li>
              <li><strong>Phase Relationship:</strong> In a purely capacitive AC circuit, the current <strong>leads</strong> the voltage by 90 degrees.</li>
              <li><strong>Frequency Dependence:</strong> Capacitive reactance decreases as frequency increases.</li>
              <li><strong>Formula:</strong> <MathFormula>X<sub>C</sub> = 1 / (2πfC)</MathFormula>, where f is frequency and C is capacitance.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Inductors (L)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Effect:</strong> Inductors store electrical energy in a magnetic field.</li>
              <li><strong>Inductive Reactance (X<sub>L</sub>):</strong> Inductors oppose the flow of AC. X<sub>L</sub> is directly proportional to frequency and inductance.</li>
              <li><strong>Phase Relationship:</strong> In a purely inductive AC circuit, the current <strong>lags</strong> the voltage by 90 degrees.</li>
              <li><strong>Frequency Dependence:</strong> Inductive reactance increases as frequency increases.</li>
              <li><strong>Formula:</strong> <MathFormula>X<sub>L</sub> = 2πfL</MathFormula>, where f is frequency and L is inductance.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Combined Effects (RLC Circuits)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>In circuits containing combinations of resistors, capacitors, and inductors (RLC circuits), the effects of these components interact.</li>
              <li>The overall opposition to current flow in an RLC circuit is called <strong>impedance (Z)</strong>.</li>
              <li>The phase relationship between voltage and current depends on the relative values of resistance, capacitive reactance, and inductive reactance.</li>
              <li><strong>Resonance:</strong> At a specific frequency (resonant frequency), X<sub>C</sub> and X<sub>L</sub> cancel each other out, resulting in minimum impedance.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: PRODUCTION OF A SINE WAVE ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Production of a Wave</h2>
          </div>

          <div className={cardClasses('amber')}>
            <p>A sine wave is a smooth, periodic oscillation that represents the waveform of alternating current (AC) voltage or current.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Mechanical Generation (Alternator)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Imagine a loop of wire rotating within a uniform magnetic field.</li>
              <li>As the loop rotates, the angle between the loop and the magnetic field lines continuously changes.</li>
              <li>The induced voltage in the loop is proportional to the rate of change of magnetic flux, which is highest when the loop is perpendicular to the field and zero when it is parallel.</li>
              <li>This results in a sinusoidal voltage waveform.</li>
              <li>One complete rotation of the loop corresponds to one cycle of the sine wave.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Mathematical Representation</h3>
            <p>A sine wave can be represented mathematically as:</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded my-2"><MathFormula>v(t) = V<sub>p</sub> × sin(2πft + φ)</MathFormula></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>v(t):</strong> instantaneous voltage at time t.</li>
              <li><strong>V<sub>p</sub>:</strong> peak voltage.</li>
              <li><strong>f:</strong> frequency (in Hertz).</li>
              <li><strong>t:</strong> time (in seconds).</li>
              <li><strong>φ:</strong> phase angle.</li>
              <li>The <MathFormula>2πft</MathFormula> portion represents the angular velocity of the rotating loop.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: CALCULATING INDUCTIVE AND CAPACITIVE CIRCUITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Calculating Inductive and Capacitive Circuits</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Inductive Circuits</h3>
            <p><strong>Inductive Reactance (X<sub>L</sub>):</strong> Opposition to AC current flow offered by an inductor.</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded my-2"><MathFormula>X<sub>L</sub> = 2πfL</MathFormula></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>X<sub>L</sub> = inductive reactance (in ohms).</li>
              <li>f = frequency (in Hertz).</li>
              <li>L = inductance (in Henrys).</li>
              <li><strong>Voltage and Current Relationship:</strong> In a purely inductive circuit, current lags voltage by 90 degrees. <MathFormula>V = I × X<sub>L</sub></MathFormula></li>
              <li><strong>Example:</strong> L = 0.1 H, f = 60 Hz → X<sub>L</sub> = 2π × 60 × 0.1 ≈ 37.7 Ω.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Capacitive Circuits</h3>
            <p><strong>Capacitive Reactance (X<sub>C</sub>):</strong> Opposition to AC current flow offered by a capacitor.</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded my-2"><MathFormula>X<sub>C</sub> = 1 / (2πfC)</MathFormula></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>X<sub>C</sub> = capacitive reactance (in ohms).</li>
              <li>f = frequency (in Hertz).</li>
              <li>C = capacitance (in Farads).</li>
              <li><strong>Voltage and Current Relationship:</strong> In a purely capacitive circuit, current leads voltage by 90 degrees. <MathFormula>V = I × X<sub>C</sub></MathFormula></li>
              <li><strong>Example:</strong> C = 10 μF (10 × 10<sup>−6</sup> F), f = 60 Hz → X<sub>C</sub> = 1 / (2π × 60 × 10 × 10<sup>−6</sup>) ≈ 265.3 Ω.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">RLC Circuits (Resistor, Inductor, Capacitor)</h3>
            <p><strong>Impedance (Z):</strong> Total opposition to AC current flow.</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded my-2"><MathFormula>Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²)</MathFormula></p>
            <p><strong>Phase Angle (φ):</strong> Phase difference between voltage and current.</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded my-2"><MathFormula>φ = arctan((X<sub>L</sub> − X<sub>C</sub>) / R)</MathFormula></p>
            <p><strong>Resonance:</strong> Occurs when X<sub>L</sub> = X<sub>C</sub>. Impedance is minimum, current maximum.</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded my-2"><MathFormula>f<sub>r</sub> = 1 / (2π√(LC))</MathFormula></p>
            <p><strong>Important:</strong> Complex numbers are required to account for phase angles between components.</p>
          </div>
        </section>

        {/* ========== SECTION 5: EFFECTS OF RESISTORS IN INDUCTIVE AND CAPACITIVE CIRCUITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Effects of Resistors in Inductive and Capacitive Circuits</h2>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Resistors in Inductive (RL) Circuits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Current Limitation:</strong> Resistors always limit current flow, impacting the inductor's behaviour.</li>
              <li><strong>Phase Shift Reduction:</strong> In a purely inductive circuit, current lags voltage by 90°. Adding a resistor reduces this phase shift to less than 90°.</li>
              <li><strong>Impedance:</strong> <MathFormula>Z = √(R² + X<sub>L</sub>²)</MathFormula></li>
              <li><strong>Power Dissipation:</strong> Resistor dissipates power as heat, reducing efficiency.</li>
              <li><strong>Damping:</strong> Resistors add damping, reducing oscillations and stabilising the circuit.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Resistors in Capacitive (RC) Circuits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Current Limitation:</strong> Resistors limit current in RC circuits.</li>
              <li><strong>Phase Shift Reduction:</strong> In a purely capacitive circuit, current leads voltage by 90°. Adding a resistor reduces this phase shift to less than 90°.</li>
              <li><strong>Impedance:</strong> <MathFormula>Z = √(R² + X<sub>C</sub>²)</MathFormula></li>
              <li><strong>Time Constant:</strong> <MathFormula>τ = R × C</MathFormula> determines charging/discharging rate.</li>
              <li><strong>Filtering:</strong> RC circuits are used as filters; resistor value affects cutoff frequency.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: EFFECTS OF CAPACITORS IN INDUCTIVE AND CAPACITIVE CIRCUITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Effects of Capacitors in Inductive and Capacitive Circuits</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Capacitors in Inductive (RLC) Circuits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Resonance:</strong> At resonant frequency, X<sub>C</sub> and X<sub>L</sub> cancel, resulting in minimum impedance and maximum current.</li>
              <li><strong>Phase Shift Control:</strong> Capacitor can control phase shift (leading, lagging, or zero at resonance).</li>
              <li><strong>Power Factor Correction:</strong> Capacitors improve power factor in inductive circuits (motors), reducing energy losses.</li>
              <li><strong>Filtering:</strong> Capacitors filter out unwanted frequencies in inductive circuits.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Capacitors in Capacitive (RC) Circuits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Energy Storage:</strong> Capacitors store electrical energy in an electric field.</li>
              <li><strong>Blocking DC:</strong> Capacitors block DC while allowing AC to pass.</li>
              <li><strong>Filtering:</strong> RC circuits are widely used as low-pass and high-pass filters.</li>
              <li><strong>Time Constant:</strong> <MathFormula>τ = R × C</MathFormula> determines charging/discharging rate.</li>
              <li><strong>Smoothing:</strong> Capacitors smooth out voltage fluctuations in power supplies.</li>
              <li><strong>Coupling:</strong> Capacitors couple AC signals between circuit parts while blocking DC.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: CONCEPTS IN AC CIRCUITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Concepts in AC Circuits: Reactance, Impedance, Resonance, and Power Factor</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Reactance (X)</h3>
            <p><strong>Definition:</strong> Opposition to AC flow caused by inductors and capacitors. Frequency-dependent.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Inductive Reactance (X<sub>L</sub>):</strong> <MathFormula>X<sub>L</sub> = 2πfL</MathFormula></li>
              <li><strong>Capacitive Reactance (X<sub>C</sub>):</strong> <MathFormula>X<sub>C</sub> = 1 / (2πfC)</MathFormula></li>
              <li><strong>Units:</strong> Ohms (Ω).</li>
              <li><strong>Key Characteristic:</strong> Reactance does not dissipate power as heat; it stores and releases energy.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Impedance (Z)</h3>
            <p><strong>Definition:</strong> Total opposition to AC flow in circuits containing R, L, and C. Vector sum of resistance and reactance.</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded my-2"><MathFormula>Z = √(R² + (X<sub>L</sub> − X<sub>C</sub>)²)</MathFormula></p>
            <p><strong>Units:</strong> Ohms (Ω).</p>
            <p><strong>Key Characteristic:</strong> Accounts for both magnitude and phase relationship between voltage and current.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Resonance</h3>
            <p><strong>Definition:</strong> Occurs in RLC circuits when X<sub>L</sub> = X<sub>C</sub>.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>At resonance, impedance is minimum (equal to R), current is maximum.</li>
              <li><strong>Resonant Frequency:</strong> <MathFormula>f<sub>r</sub> = 1 / (2π√(LC))</MathFormula></li>
              <li><strong>Applications:</strong> Tuning circuits in radios, oscillators, filters.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Power Factor (PF)</h3>
            <p><strong>Definition:</strong> Ratio of real power (watts) to apparent power (volt-amperes). Indicates how effectively electrical power is used.</p>
            <p className="font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded my-2"><MathFormula>PF = cos(φ)</MathFormula></p>
            <ul className="list-disc pl-5 space-y-1">
              <li>PF = 1 (100%) in purely resistive circuit (voltage and current in phase).</li>
              <li>PF = 0 in purely inductive or capacitive circuit (90° out of phase).</li>
              <li>PF is between 0 and 1 in circuits with both resistance and reactance.</li>
              <li><strong>Significance:</strong> Low PF indicates poor power usage, increased current, voltage drops, and energy losses.</li>
              <li><strong>Power Factor Correction:</strong> Using capacitors to improve efficiency.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 8: TYPES OF CHARGING SYSTEM CIRCUIT LAYOUTS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Types of Charging System Layouts</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Traditional Belt-Driven Alternator </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Most common layout. Alternator driven by belt connected to engine's crankshaft.</li>
              <li>Output regulated by voltage regulator (internal or external).</li>
              <li>Output fed to battery and vehicle's electrical system.</li>
              <li>Warning light (battery light) on dashboard indicates charging system faults.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Integrated Starter Generator (ISG) </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>In hybrid and advanced vehicles, starter and generator functions combined into single unit.</li>
              <li>ISG can operate as both starter motor and alternator, improving efficiency and fuel economy.</li>
              <li>Integrated into engine's drivetrain. Controlled by vehicle's ECU.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Smart Alternator </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Modern vehicles use "smart" alternators controlled by ECU.</li>
              <li>ECU adjusts alternator output based on battery state of charge, engine load, and electrical system demands.</li>
              <li>Improves fuel efficiency and battery life.</li>
              <li>ECU communicates with smart alternator via communication bus (LIN or CAN).</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 9: CONSTRUCTION AND OPERATION OF AC GENERATORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Construction and Operation of AC Generators (Alternators)</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Construction</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Rotor:</strong> Electromagnet (field winding) or permanent magnets. Rotates within stator. Slip rings and brushes (or brushless design) provide current to field winding.</li>
              <li><strong>Stator:</strong> Stationary component with three sets of windings (three-phase). Where AC voltage is induced.</li>
              <li><strong>Rectifier Bridge:</strong> Converts AC output from stator to DC using diodes.</li>
              <li><strong>Voltage Regulator:</strong> Controls alternator's output voltage (internal or external).</li>
              <li><strong>Housing:</strong> Protects components and provides mounting points.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Operation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Rotor is driven by engine, creating a rotating magnetic field.</li>
              <li>Rotating magnetic field induces an AC voltage in stator windings.</li>
              <li>Rectifier bridge converts AC voltage to DC.</li>
              <li>Voltage regulator controls current to rotor field windings, controlling output voltage.</li>
              <li>DC output charges battery and powers vehicle's electrical system.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 10: OPERATING PRINCIPLES OF ALTERNATOR COMPONENTS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Operating Principles of Alternator Components</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Rotor (Field Winding/Permanent Magnets)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Creates the rotating magnetic field essential for inducing voltage in the stator.</li>
              <li>Electromagnets are controlled by voltage regulator, allowing variable output.</li>
              <li>Permanent magnets create a constant magnetic field.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Stator (Windings)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Stationary component where AC voltage is generated.</li>
              <li>Three-phase windings provide a more stable and efficient output.</li>
              <li>Voltage produced depends on rotor speed and magnetic field strength.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Rectifier Bridge (Diodes)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Converts AC output from stator to DC.</li>
              <li>Diodes allow current to flow in only one direction, "rectifying" the AC waveform.</li>
              <li>Three-phase rectifiers use six diodes.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Voltage Regulator</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Maintains constant output voltage by controlling current to rotor field windings.</li>
              <li>Regulates voltage to prevent overcharging and electrical component damage.</li>
              <li>Modern regulators are often integrated into the alternator and controlled by ECU.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Slip Rings and Brushes (or Brushless Designs)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Slip Rings and Brushes:</strong> Provide sliding electrical connection to rotating field windings. Brushes can wear over time.</li>
              <li><strong>Brushless Designs:</strong> Use electromagnetic induction to transfer power to rotor, eliminating brushes and slip rings. More reliable, less maintenance.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 11: EXCITATION METHODS IN ALTERNATORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Excitation Methods in Alternators</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Self-Excitation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Most common method in modern automotive alternators.</li>
              <li>Residual magnetism in rotor/field windings initiates the process.</li>
              <li>As alternator starts rotating, a small voltage is induced in stator.</li>
              <li>This voltage is rectified and used to increase current in field windings, strengthening the magnetic field.</li>
              <li>Process continues until desired output voltage is reached.</li>
              <li>Efficient and eliminates need for external power source.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Separate Excitation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>External DC power source supplies current to field windings.</li>
              <li>Used in some large generators and industrial applications.</li>
              <li>Allows precise control of alternator output voltage.</li>
              <li>Less common in automotive applications.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Permanent Magnet Excitation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Permanent magnets create magnetic field in the rotor.</li>
              <li>Eliminates need for field windings, slip rings, and brushes.</li>
              <li>Simplifies construction and reduces maintenance.</li>
              <li>Does not allow variable output voltage control.</li>
              <li>Used in some small alternators and generators.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 12: OPERATION OF MECHANICAL REGULATORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Operation of Mechanical Regulators</h2>
          </div>
          <div className={cardClasses('amber')}>
            <p>Mechanical regulators were used in older vehicles to control the alternator's output voltage.</p>
            <p><strong>Construction:</strong> Contact points, coil, spring-loaded armature. Coil connected to alternator output voltage.</p>
            <p><strong>Operation:</strong> When output voltage is low, spring holds contact points closed, allowing current to field windings. As voltage increases, coil magnetic field strengthens, pulling armature and opening contact points. This interrupts current to field windings, reducing magnetic field and output voltage. Contact points cycle on/off, maintaining relatively constant output.</p>
            <p><strong>Limitations:</strong> Prone to wear and tear, less accurate than electronic regulators, affected by temperature and vibration.</p>
          </div>
        </section>

        {/* ========== SECTION 13: OPERATION OF ELECTRONIC REGULATORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Operation of Electronic Regulators</h2>
          </div>
          <div className={cardClasses('blue')}>
            <p><strong>Construction:</strong> Electronic components (transistors, diodes, integrated circuits). May be integrated into alternator or separate.</p>
            <p><strong>Operation:</strong> Monitors alternator output voltage and compares to reference voltage. If too low, increases field current by switching transistor on. If too high, decreases field current by switching transistor off. Uses pulse-width modulation (PWM) for precise voltage regulation. Modern electronic regulators are often controlled by ECU.</p>
            <p><strong>Advantages:</strong> More accurate and reliable than mechanical regulators. Less affected by temperature and vibration. Can provide sophisticated control strategies (load shedding, temperature compensation). Longer lasting.</p>
          </div>
        </section>

        {/* ========== SECTION 14: SMART CHARGING SYSTEMS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Smart Charging Systems</h2>
          </div>

          <div className={cardClasses('indigo')}>
            <p>Smart charging systems represent a significant advancement in automotive electrical systems, moving beyond basic voltage regulation to a more dynamic and efficient approach.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Core Principles</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>ECU Control:</strong> Managed by vehicle's ECU, not standalone regulators. Allows response to wide range of operating conditions.</li>
              <li><strong>Dynamic Voltage Regulation:</strong> Adjusts alternator output based on various parameters to maximise fuel efficiency, extend battery lifespan, ensure optimal electrical performance.</li>
              <li><strong>Data-Driven Decisions:</strong> ECU receives data from battery temperature/SOC, engine load/speed, electrical system load, ambient temperature.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Operational Details</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Battery State of Charge (SOC) Monitoring:</strong> ECU monitors SOC. If low, increases alternator output. When fully charged, reduces or suspends output to minimise parasitic losses.</li>
              <li><strong>Load Management:</strong> ECU considers electrical load. During high demand (headlights, heated seats), increases output. During low demand, reduces output.</li>
              <li><strong>Regenerative Braking Integration:</strong> In hybrid/electric vehicles, increases alternator output during deceleration to convert kinetic energy to electrical energy stored in battery.</li>
              <li><strong>Temperature Compensation:</strong> Adjusts charging voltage based on battery temperature (higher voltage for cold, lower for warm).</li>
              <li><strong>Fuel Efficiency Optimisation:</strong> Reduces alternator load when possible (during acceleration). Increases output during coasting/deceleration.</li>
              <li><strong>Communication:</strong> ECU communicates with smart alternator via LIN or CAN bus for precise control.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Benefits</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Improved Fuel Efficiency: Reduced parasitic losses.</li>
              <li>Extended Battery Life: Optimised charging and temperature compensation.</li>
              <li>Enhanced Electrical System Performance: Stable voltage and reliable power delivery.</li>
              <li>Reduced Emissions: More efficient energy usage.</li>
              <li>Increased System Reliability: ECU detects and diagnoses faults in the charging system.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — AC Production & Charging Systems</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">AC Generation</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">RLC Circuits</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Alternators</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Smart Charging</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master AC & Charging Systems. ⚡🔋</p>
        </footer>

      </div>
    </div>
  );
};