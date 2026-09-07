import React from 'react';
import { 
  Zap, Battery, Cpu, Box, Radio, 
  Wrench, Settings, Gauge, Shield, Map, 
  ChevronLeft, ChevronRight, X, Activity,
  Thermometer, Droplet, Sun, Moon, Wind,
  TrendingUp, TrendingDown, AlertTriangle,
  Code, Table, BookOpen, Target, Heart,
  Sigma, Divide, Plus, Minus, Car, Cog,
  Volume2, Eye, Hand, Monitor,  Navigation,
  Bell, Lightbulb, Vibrate, MessageSquare, 
  LightbulbIcon, Flame, Sparkles, Fuel, 
  AlertCircle, ShieldAlert, ZapOff, 
  Microscope, Scan, Wifi, Cloud,
  FuelIcon, GaugeIcon, TestTube, 
  WrenchIcon, HardDrive, Server,
  CheckCircle, XCircle, ArrowRight, 
  Clock, TrendingUp as TrendingUpIcon,
  CloudRain, Wind as WindIcon, 
  Droplets, Gauge as GaugeIcon2,
  Recycle, Leaf, BatteryCharging,
  BatteryFull, BatteryLow, BatteryWarning,
  Sparkle, Magnet, RotateCw, 
  ArrowLeftRight, ArrowUpDown,
  Disc, Car as CarIcon
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
      <header className="bg-[#4c1d95] dark:bg-[#2e1065] border-b border-purple-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <Magnet className="w-4 h-4" />
              Automotive Electrical: Module LO3
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Magnetism, Motors & <span className="text-purple-300 font-bold italic">Starter Systems</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to magnetism principles, generators, DC motors, starter motor types, relays, and keyless start systems.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">magnetism_motors.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Magnetism;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Generators;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">DIAGNOSE</span><span className="text-white">Starter_Motors;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><RotateCw className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Zap className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: PRINCIPLES OF MAGNETISM ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Principles of Magnetism</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Magnet size={20} /> 1. Magnetic Fields</h3>
            <p>Moving electric charges create magnetic fields. These fields exert a force on other moving charges or magnetic materials. Magnetic fields are visualised as lines of force, which form closed loops around the source of the magnetic field.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ArrowLeftRight size={20} /> 2. Magnetic Poles</h3>
            <p>Magnets have two poles: a north pole and a south pole. Like poles repel each other (north-north or south-south), and unlike poles attract each other (north-south).</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> 3. Magnetic Materials</h3>
            <p>Certain materials, like iron, nickel, and cobalt, are strongly attracted to magnets. These are called ferromagnetic materials. Other materials are weakly attracted or repelled by magnets.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Zap size={20} /> 4. Electromagnetism Connection</h3>
            <p>Magnetism and electricity are intimately connected. Moving electric charges create magnetic fields, and changing magnetic fields create electric fields.</p>
          </div>
        </section>

        {/* ========== SECTION 2: CONCEPTS OF MAGNETISM ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Concepts of Magnetism</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Permanent Magnetism</h3>
            <p>This type of magnetism is exhibited by materials that retain their magnetic properties even after the external magnetic field is removed. These materials have atoms with aligned electron spins, creating a net magnetic field. Examples include naturally occurring magnets like lodestone and artificially magnetised materials like steel.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Electromagnetism</h3>
            <p>This is the magnetism produced by an electric current. When an electric current flows through a wire, it creates a magnetic field around the wire. The strength of the magnetic field is proportional to the current. An electromagnet consists of a coil of wire wrapped around a ferromagnetic core. When current flows through the coil, it creates a strong magnetic field. Electromagnets are used in various applications, such as electric motors, generators, and solenoids.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Electromagnetic Induction</h3>
            <p>This is the phenomenon where a changing magnetic field induces an electric current in a conductor. If a conductor is moved through a magnetic field or if a magnetic field changes around a conductor, a voltage (electromotive force or EMF) is induced in the conductor. This principle is the basis for electric generators, transformers, and many other electrical devices. Essentially, if a magnetic field lines "cut" across a conductor, or if a conductor "cuts" across magnetic field lines, then a voltage is induced within that conductor.</p>
          </div>
        </section>

        {/* ========== SECTION 3: GENERATOR PRINCIPLE ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Generator Principle (Electromagnetic Induction)</h2>
          </div>
          <div className={cardClasses('amber')}>
            <p>The generator principle is based on Faraday's law of electromagnetic induction. This law states that:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>A changing magnetic field induces an electromotive force (EMF) or voltage in a conductor.</li>
              <li>The magnitude of the induced EMF is proportional to the rate of change of the magnetic flux linking the conductor.</li>
              <li>In simpler terms, when a conductor moves through a magnetic field or when a magnetic field changes around a conductor, a voltage is generated.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: CONSTRUCTION AND OPERATING PRINCIPLE OF GENERATORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Construction and Operating Principle of Generators</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Construction</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Magnetic Field:</strong> A source of magnetic field, either permanent magnets or electromagnets (field windings).</li>
              <li><strong>Conductors (Armature):</strong> Coils of wire that move through the magnetic field.</li>
              <li><strong>Mechanical Motion:</strong> A means of rotating the armature, such as a turbine, engine, or hand crank.</li>
              <li><strong>Slip Rings or Commutator:</strong> Components that connect the rotating armature to the external circuit.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Operating Principle</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mechanical energy is used to rotate the armature within the magnetic field.</li>
              <li>As the conductors of the armature move through the magnetic field, a voltage is induced in them.</li>
              <li>The induced voltage causes current to flow through the external circuit.</li>
              <li>The direction of the induced current is determined by Fleming's right hand rule.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: AC AND DC GENERATORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Principle of Operation of AC and DC Generators</h2>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">AC Generators (Alternators)</h3>
            <p><strong>Operation:</strong> The armature rotates within a stationary magnetic field. The induced voltage in the armature changes polarity with each half rotation, producing an alternating current (AC). Slip rings are used to connect the rotating armature to the external circuit, allowing the AC to flow. The frequency of the AC is determined by the speed of rotation and the number of poles in the generator.</p>
            <p><strong>Explanation:</strong> Because the coil is constantly moving through changing magnetic fields, the current produced is constantly changing direction.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">DC Generators (Dynamos)</h3>
            <p><strong>Operation:</strong> The armature rotates within a stationary magnetic field. A commutator is used to convert the AC generated in the armature into DC.</p>
            <p><strong>Commutation:</strong> The commutator is a split ring that reverses the connections between the armature and the external circuit every half rotation. This ensures that the current flowing through the external circuit is always in the same direction.</p>
            <p><strong>Polarisation:</strong> In older DC generators, residual magnetism in the field windings is essential for starting the generation process. This residual magnetism initiates a small current, which strengthens the field windings, leading to increased output. Modern generators utilise permanent magnets, or electronic controls to provide the initial field.</p>
            <p><strong>Explanation:</strong> The commutator is the key component that transforms the AC produced in the armature into DC. It acts as a mechanical rectifier.</p>
            <p><strong>DC generator ripple:</strong> Due to the method of commutation, DC generators produce a ripple voltage. Modern DC generators, or alternators that are rectified to DC, use electronic regulation to smooth out the ripple.</p>
          </div>
        </section>

        {/* ========== SECTION 6: MOTOR PRINCIPLE ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Motor Principle</h2>
          </div>
          <div className={cardClasses('red')}>
            <p>The motor principle is based on the interaction between a magnetic field and a current-carrying conductor. When a current-carrying conductor is placed in a magnetic field, it experiences a force. This force causes the conductor to move.</p>
            <p>This principle is the inverse of the generator principle.</p>
            <p><strong>Fleming's Left-Hand Rule:</strong> This rule helps determine the direction of the force on a conductor in a magnetic field. The thumb, forefinger, and middle finger of the left hand are extended at right angles to each other. The forefinger represents the magnetic field, the middle finger represents the current, and the thumb represents the motion (force).</p>
          </div>
        </section>

        {/* ========== SECTION 7: CONSTRUCTION AND OPERATION PRINCIPLE OF MOTORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Construction and Operation Principle of Motors</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Construction</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Magnetic Field:</strong> A source of magnetic field, either permanent magnets or electromagnets (field windings).</li>
              <li><strong>Armature (Rotor):</strong> A rotating component consisting of coils of wire.</li>
              <li><strong>Commutator:</strong> A split ring that reverses the current in the armature coils, ensuring continuous rotation.</li>
              <li><strong>Brushes:</strong> Stationary contacts that connect the external circuit to the commutator.</li>
              <li><strong>Housing:</strong> Provides mechanical support and protection.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Operation Principle</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>When current flows through the armature coils, a magnetic field is created around the coils.</li>
              <li>This magnetic field interacts with the magnetic field of the permanent magnets or field windings, creating a force on the coils.</li>
              <li>The commutator and brushes reverse the current in the coils every half rotation, ensuring that the force on the coils is always in the same direction, causing continuous rotation.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 8: TYPES OF DC MOTORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Types of DC Motors</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Series Wound Motor</h3>
            <p><strong>Construction:</strong> The field windings are connected in series with the armature.</p>
            <p><strong>Operation:</strong> The same current flows through both the field windings and the armature. The magnetic field strength and torque are proportional to the armature current. The motor has high starting torque but low speed regulation. As load decreases, the motor speed increases dramatically, and can cause damage to the motor.</p>
            <p><strong>Application:</strong> Used in applications requiring high starting torque, such as starter motors, cranes, and electric tools.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Parallel Wound (Shunt) Motor</h3>
            <p><strong>Construction:</strong> The field windings are connected in parallel (shunt) with the armature.</p>
            <p><strong>Operation:</strong> The field current is independent of the armature current. The motor has relatively constant speed under varying loads. The starting torque is moderate.</p>
            <p><strong>Application:</strong> Used in applications requiring constant speed, such as machine tools, fans, and pumps.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Compound Wound Motor</h3>
            <p><strong>Construction:</strong> The motor has both series and parallel field windings.</p>
            <p><strong>Operation:</strong> The motor combines the characteristics of series and parallel wound motors. The series field windings provide high starting torque, while the parallel field windings provide better speed regulation. The degree of series and parallel winding combination determines the operating characteristics.</p>
            <p><strong>Types:</strong> Cumulative compound (series field aids shunt field, providing increased starting torque). Differential compound (series field opposes shunt field, providing very flat speed torque curve).</p>
            <p><strong>Application:</strong> Used in applications requiring a balance of starting torque and speed regulation, such as elevators, conveyors, and printing presses.</p>
          </div>
        </section>

        {/* ========== SECTION 9: CHARACTERISTICS OF MOTOR CIRCUIT TYPES ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Characteristics of Motor Types</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Series Wound Motor Circuits</h3>
            <p><strong>Characteristics:</strong> High starting torque, variable speed (increases dramatically with load decrease), low speed regulation, high current draw at start.</p>
            <p><strong>Application:</strong> Starter motors, cranes and hoists, electric tools.</p>
            <p><strong>Characteristics:</strong> Field windings in series with armature. Current is the same through field and armature. Voltage is divided between field and armature.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Shunt (Parallel) Wound Motor Circuits</h3>
            <p><strong>Characteristics:</strong> Constant speed, moderate starting torque, good speed regulation, lower starting current.</p>
            <p><strong>Application:</strong> Machine tools, centrifugal pumps, fans and blowers.</p>
            <p><strong>Characteristics:</strong> Field windings in parallel with armature. Voltage is the same across field and armature. Current is divided between field and armature.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Compound Wound Motor Circuits</h3>
            <p><strong>Characteristics:</strong> Combined characteristics, high starting torque, improved speed regulation, variable speed (less than series).</p>
            <p><strong>Application:</strong> Elevators, conveyors, printing presses.</p>
            <p><strong>Characteristics:</strong> Includes both series and shunt field windings. Cumulative compound (series aids shunt) or differential compound (series opposes shunt).</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">AC Motor Circuits</h3>
            <p><strong>Induction Motor Circuits:</strong> Simple and robust, relatively constant speed, require starting methods to reduce high starting current. Direct online starting (DOL) for small motors; star-delta, reduced voltage starters, or VFDs for larger motors.</p>
            <p><strong>Synchronous Motor Circuits:</strong> Operate at constant synchronous speed, used for precise speed control, require DC excitation for the rotor.</p>
            <p><strong>Universal Motor Circuits:</strong> Can operate on both AC and DC, high speed and high starting torque, used in portable tools and appliances. Series wound with brushes and commutator.</p>
          </div>
        </section>

        {/* ========== SECTION 10: STARTER MOTORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Starter Motors</h2>
          </div>
          <div className={cardClasses('indigo')}>
            <p>Starter motors are essential for initiating the combustion process in an internal combustion engine. They convert electrical energy from the battery into mechanical energy to crank the engine.</p>
            <p><strong>General Construction:</strong> Armature, Field Windings or Permanent Magnets, Commutator and Brushes, Solenoid, Drive Mechanism, Housing.</p>
          </div>
        </section>

        {/* ========== SECTION 11: TYPES OF STARTER MOTORS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Types of Starter Motors</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Pre-Engaged Starter Motor</h3>
            <p><strong>Construction:</strong> Uses a solenoid to shift the pinion gear into engagement with the flywheel before the motor starts to rotate. Includes an overrunning clutch to prevent the engine from driving the starter motor after it starts.</p>
            <p><strong>Operation:</strong> When the ignition key is turned, the solenoid is energised. The solenoid's plunger moves, shifting the pinion gear into mesh with the flywheel and closing the main contacts to supply current to the motor. The motor rotates, cranking the engine. Once the engine starts, the overrunning clutch disengages the pinion gear.</p>
            <p><strong>Explanation:</strong> This design provides a positive and reliable engagement, reducing the risk of gear damage.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Gear Reduction Starter Motor</h3>
            <p><strong>Construction:</strong> Incorporates a gear reduction mechanism between the armature and the pinion gear. This mechanism increases the torque output of the motor. Often uses permanent magnets instead of field windings.</p>
            <p><strong>Operation:</strong> The motor rotates at a higher speed, and the gear reduction mechanism reduces the speed and increases the torque applied to the flywheel. This allows for a smaller and lighter motor to crank larger engines.</p>
            <p><strong>Explanation:</strong> Gear reduction starters are more efficient and powerful than direct-drive starters of the same size.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Axial Starter Motor</h3>
            <p><strong>Construction:</strong> The armature and field windings are arranged axially, meaning they are aligned along the same axis. This design is compact and lightweight. Often uses permanent magnets.</p>
            <p><strong>Operation:</strong> The axial arrangement allows for a shorter and more efficient magnetic flux path, resulting in higher torque output. The solenoid and drive mechanism operate similarly to a pre-engaged starter.</p>
            <p><strong>Explanation:</strong> Axial starters are commonly used in modern vehicles due to their compact size and high performance.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Coaxial Starter Motor</h3>
            <p><strong>Construction:</strong> The solenoid and drive mechanism are arranged coaxially with the armature. Meaning that the solenoid and the armature share the same centre axis. This design results in a very compact and integrated unit.</p>
            <p><strong>Operation:</strong> The coaxial arrangement allows for a very efficient transfer of force from the solenoid to the drive mechanism. The solenoid's movement directly engages the pinion gear with the flywheel.</p>
            <p><strong>Explanation:</strong> Coaxial starters are designed for space-constrained applications.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Inertia Starter Motor</h3>
            <p><strong>Construction:</strong> Uses a Bendix drive, which relies on inertia to engage the pinion gear. The pinion gear is mounted on a threaded shaft.</p>
            <p><strong>Operation:</strong> When the motor starts, the inertia of the pinion gear causes it to move along the threaded shaft and engage with the flywheel. When the engine starts, the flywheel overruns the pinion gear, causing it to disengage.</p>
            <p><strong>Explanation:</strong> Inertia starters are older designs and are less common in modern vehicles. They are relatively simple but can be prone to engagement problems.</p>
          </div>
        </section>

        {/* ========== SECTION 12: OPERATING PRINCIPLES OF STARTER ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Operating Principles of Starter</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Engagement</h3>
            <p><strong>Solenoid Activation (Pre-Engaged and Coaxial):</strong> When the ignition key is turned to the start position, the starter solenoid is energised. The solenoid's electromagnetic force pulls a plunger, which performs two primary functions: Mechanical Engagement (pushes pinion gear forward into flywheel) and Electrical Connection (closes heavy-duty contacts allowing high current to flow).</p>
            <p><strong>Inertia Engagement (Bendix Drive):</strong> In older inertia-type starters, the Bendix drive mechanism uses the inertia of the pinion gear itself. When the starter motor begins to rotate, the inertia of the pinion gear causes it to move along a spiral thread on the armature shaft, engaging with the flywheel.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Torque Transfer</h3>
            <p>Once the pinion gear is engaged, the starter motor's rotational force is transferred to the flywheel or flex plate. This rotational force cranks the engine, causing the pistons to move and the air-fuel mixture to be compressed.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Disengagement</h3>
            <p><strong>Overrunning Clutch:</strong> Modern starter motors utilise an overrunning clutch (one-way clutch or freewheel). This clutch allows the pinion gear to rotate in one direction (when driven by the starter motor) but prevents it from rotating in the opposite direction (when driven by the engine). When the engine starts and its speed exceeds the starter motor's speed, the overrunning clutch disengages the pinion gear, preventing the engine from driving the starter motor.</p>
            <p><strong>Inertia Disengagement (Bendix Drive):</strong> In Bendix drive systems, when the engine starts and its speed exceeds the starter motor's speed, the pinion gear is forced to rotate faster than the spiral thread on the armature shaft. This causes the pinion gear to move back along the thread and disengage from the flywheel.</p>
            <p><strong>Solenoid Retraction:</strong> When the ignition key is released from the start position, the solenoid is de-energised. A return spring pushes the plunger back to its original position, disengaging the pinion gear and disconnecting the electrical connection to the starter motor.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Key Considerations</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Gear Ratio:</strong> The gear ratio between the starter motor's pinion gear and the flywheel or flex plate is crucial for providing sufficient torque to crank the engine.</li>
              <li><strong>Overrunning Clutch Function:</strong> A properly functioning overrunning clutch is essential for preventing damage to the starter motor and flywheel.</li>
              <li><strong>Solenoid Operation:</strong> The solenoid must operate reliably to ensure proper engagement and disengagement.</li>
              <li><strong>Electrical Connections:</strong> Clean and secure electrical connections are vital for delivering sufficient current to the starter motor.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 13: RELAYS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Relays in Starting Systems</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Change-Over Relay (SPDT Relay)</h3>
            <p><strong>Function:</strong> A change-over relay is a Single Pole Double Throw (SPDT) relay. It has one common terminal and two output terminals. Its purpose is to switch between two different circuits or functions based on the relay's state (energised or de-energised).</p>
            <p><strong>Operation:</strong> When the relay is de-energised, the common terminal is connected to one of the output terminals (normally closed, NC). When the relay is energised, the common terminal switches and connects to the other output terminal (normally open, NO).</p>
            <p><strong>Example:</strong> A change-over relay could be used to disable the vehicle's headlights while the starter motor is engaged, thus providing more power to the starter.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Start Repeating Relay (Cranking Relay)</h3>
            <p><strong>Function:</strong> A start repeating relay is designed to allow repeated attempts to start the engine, especially in situations where the engine fails to start on the first try. It is often used in conjunction with automatic starting systems or remote start systems. It is used to prevent the starter motor from being engaged for an excessive amount of time.</p>
            <p><strong>Operation:</strong> When the start signal is received, the relay energises, engaging the starter motor. If the engine fails to start within a predetermined time, the relay de-energises, stopping the starter motor. After a short delay, the relay can be energised again, allowing another attempt to start the engine. This cycle can repeat for a set number of attempts or until the engine starts.</p>
            <p><strong>Example:</strong> In a remote start system, a start repeating relay would allow the system to attempt to start the engine multiple times if it stalls or fails to ignite.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Double Starting Relay (Starter Interlock Relay)</h3>
            <p><strong>Function:</strong> A double starting relay, or starter interlock relay, is primarily a safety device. It prevents the starter motor from engaging while the engine is already running, preventing damage to the starter and flywheel. It also can be used to prevent the starter from engaging unless certain conditions are met, such as the vehicle being in park, or neutral.</p>
            <p><strong>Operation:</strong> The relay uses a signal from the engine's RPM or oil pressure sensor to determine if the engine is running. If the engine is running, the relay prevents the starter circuit from being energised, even if the ignition key is turned to the start position. It can also use signals from the transmission to only allow starting in park or neutral. If the engine is not running and the necessary conditions are met, the relay allows the starter circuit to be energised.</p>
            <p><strong>Example:</strong> A double starting relay prevents a driver from accidentally engaging the starter motor while the engine is running, which could damage the starter and flywheel teeth. It also prevents a vehicle from starting while in drive.</p>
          </div>
        </section>

        {/* ========== SECTION 14: KEYLESS START SYSTEMS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Keyless Start Systems</h2>
          </div>

          <div className={cardClasses('indigo')}>
            <p>Keyless start systems, also known as push-button start systems, have become increasingly common in modern vehicles. They offer convenience by eliminating the need to physically insert and turn a key.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Key Fob and Radio Frequency Identification (RFID)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>The system relies on a key fob, which contains a small transmitter.</li>
              <li>The fob emits a low-frequency radio signal that communicates with the vehicle's electronic control unit (ECU).</li>
              <li>The vehicle has antennas that detect the fob's signal.</li>
              <li>When the fob is within a certain range of the vehicle (typically a few feet), the vehicle's system recognises its presence.</li>
              <li>This communication uses RFID technology, which allows for secure authentication.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Authentication and Authorisation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Once the vehicle detects the fob's signal, it initiates an authentication process.</li>
              <li>The vehicle and the fob exchange encrypted codes to verify that the fob is authorised to start the vehicle.</li>
              <li>If the authentication is successful, the vehicle unlocks the steering column (if equipped) and enables the start button.</li>
              <li>Some systems also use rolling codes, which change with each use, to further enhance security.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Start Button Operation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>After successful authentication, the driver can press the start button to start the engine.</li>
              <li>The start button typically sends a signal to the ECU, which then engages the starter motor.</li>
              <li>The ECU controls the starting process, including the engagement of the starter motor and the timing of the ignition and fuel injection systems.</li>
              <li>Some vehicles require the driver to press the brake pedal or clutch pedal simultaneously with the start button for safety reasons.</li>
              <li>The system can also control other vehicle functions, such as unlocking the doors, adjusting the seats, and setting the climate control.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Automatic Shutdown and Security</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Some keyless start systems have an automatic shutdown feature that turns off the engine after a certain period of idling.</li>
              <li>This feature is designed to prevent the engine from running unnecessarily, especially if the driver forgets to turn it off.</li>
              <li>The system also includes security features to prevent unauthorised starting.</li>
              <li>If the fob is not present or if the authentication fails, the vehicle will not start.</li>
              <li>Many keyless start systems also have an immobiliser function, which prevents the engine from starting even if the ignition is hot wired.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Comfort and Convenience Features</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Many keyless start systems are integrated with other comfort and convenience features.</li>
              <li>For example, some systems allow the driver to remotely start the engine from a distance.</li>
              <li>Some systems also offer personalised settings, such as seat and mirror positions, which are automatically adjusted when the driver enters the vehicle.</li>
              <li>Some systems will also lock the doors automatically when the key fob leaves a certain range of the vehicle.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Magnetism, Motors & Starter Systems</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Magnetism</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Generators</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">DC Motors</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Starters & Keyless</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Motors & Starters. 🔋⚡</p>
        </footer>

      </div>
    </div>
  );
};