import React from 'react';
import { 
  Zap, Battery,  Cpu, Box, Radio, 
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
  Sparkle
} from 'lucide-react';

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
      <header className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              Automotive Electrical: Module LO2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Ignition System — <span className="text-sky-300 font-bold italic">Components, Operation & Diagnosis</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to conventional ignition, triggering methods, electronic ignition systems (DIS, direct ignition, CDI, energy transfer), spark plugs, heat ranges, and fault diagnosis.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">ignition_system.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Ignition_Coil;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Triggering_Methods;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">DIAGNOSE</span><span className="text-white">Spark_Plugs;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Sparkle className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Zap className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: CONVENTIONAL IGNITION SYSTEM ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Conventional Ignition System</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Construction</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Battery:</strong> Provides the initial low-voltage power.</li>
              <li><strong>Ignition Switch:</strong> Controls the flow of power to the ignition system.</li>
              <li><strong>Ignition Coil:</strong> A transformer that steps up the battery voltage to a high voltage (typically 12,000 to 45,000 volts).</li>
              <li><strong>Distributor (Older Systems):</strong> Contains a mechanical breaker point assembly (or electronic pickup) and a rotor. It distributes the high voltage spark to the correct spark plug at the correct time.</li>
              <li><strong>Spark Plugs:</strong> Create the spark gap in the combustion chamber.</li>
              <li><strong>Wiring:</strong> Connects all the components.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Operation</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Primary :</strong> When the ignition switch is turned on, battery voltage flows through the primary winding of the ignition coil.</li>
              <li><strong>Breaker Points (or Electronic Trigger):</strong> In older systems, the distributor's breaker points open and close, interrupting the primary circuit. In electronic systems, a trigger mechanism (inductive, Hall effect, or optical) performs this function.</li>
              <li><strong>Induction:</strong> When the primary circuit is interrupted, the magnetic field in the coil collapses.</li>
              <li><strong>Secondary :</strong> The collapsing magnetic field induces a high voltage in the secondary winding of the coil.</li>
              <li><strong>Distributor (or Direct Ignition):</strong> The distributor's rotor directs the high voltage spark to the appropriate spark plug. In modern direct ignition systems, each spark plug has its own coil.</li>
              <li><strong>Spark Plug Ignition:</strong> The high-voltage spark jumps the gap between the spark plug electrodes, igniting the air-fuel mixture.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Ballast Resistor</h3>
            <p><strong>Purpose:</strong> A ballast resistor is used to limit the current flowing through the primary winding of the ignition coil.</p>
            <p><strong>Operation (Without Ballast Resistor):</strong> In a system without a ballast resistor, the full battery voltage is applied to the primary winding. This can cause the coil to overheat and fail.</p>
            <p><strong>Operation (With Ballast Resistor):</strong> The ballast resistor reduces the voltage applied to the coil's primary winding during normal operation. During engine cranking, the ballast resistor is bypassed, providing a higher voltage to the coil for a stronger spark. This is required because the battery voltage drops during cranking.</p>
            <p><strong>Bypassing the ballast resistor during cranking:</strong> This is often done by a connection from the starter solenoid that provides full battery voltage to the coil during engine cranking.</p>
          </div>
        </section>

        {/* ========== SECTION 2: TRIGGERING METHODS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Triggering Methods</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Inductive Type (Magnetic Pickup)</h3>
            <p><strong>Construction:</strong> Consists of a reluctor (a toothed wheel) mounted on the distributor shaft and a magnetic pickup coil.</p>
            <p><strong>Operation:</strong> As the reluctor teeth pass the pickup coil, they induce a voltage pulse in the coil. The pulses are then used to trigger the ignition module, which controls the primary circuit of the ignition coil.</p>
            <p><strong>Explanation:</strong> The reluctor teeth alter the magnetic field of the pickup coil as they pass. This change in magnetic flux induces a voltage in the coil. The frequency of the pulses is proportional to the engine speed.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Hall Generator (Hall Effect Sensor)</h3>
            <p><strong>Construction:</strong> Consists of a rotating trigger wheel with slots or vanes and a Hall effect sensor.</p>
            <p><strong>Operation:</strong> The Hall effect sensor generates a voltage when a magnetic field is applied perpendicular to its current flow. The trigger wheel interrupts the magnetic field as it rotates, creating voltage pulses. These pulses are used to trigger the ignition module.</p>
            <p><strong>Explanation:</strong> The Hall effect sensor uses a semiconductor material that generates a voltage when placed in a magnetic field. When the trigger wheel rotates, the slots or vanes interrupt the magnetic field, causing the sensor to produce voltage pulses. These pulses are very precise.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Optical Pulse (Optical Sensor)</h3>
            <p><strong>Construction:</strong> Consists of a rotating trigger wheel with slots or holes, an LED (light-emitting diode), and a phototransistor.</p>
            <p><strong>Operation:</strong> The LED emits a light beam that is interrupted by the slots or holes in the trigger wheel. The phototransistor detects the light pulses and converts them into electrical pulses. These pulses are used to trigger the ignition module.</p>
            <p><strong>Explanation:</strong> The optical sensor uses light to detect the position of the trigger wheel. The LED emits a light beam, and the phototransistor detects the presence or absence of light. As the trigger wheel rotates, the slots or holes interrupt the light beam, creating pulses. These pulses are very accurate and immune to electromagnetic interference.</p>
          </div>
        </section>

        {/* ========== SECTION 3: ELECTRONIC IGNITION SYSTEMS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Electronic Ignition Systems</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Distributor Type Electronic Ignition</h3>
            <p><strong>Construction:</strong> Retains a distributor for spark distribution. Uses an electronic trigger (inductive, Hall effect, or optical) instead of mechanical breaker points. An ignition module controls the primary circuit of the coil. High voltage coil.</p>
            <p><strong>Layout:</strong> The electronic trigger is located inside the distributor. The ignition module is typically mounted on the distributor or elsewhere in the engine compartment. The coil is connected to the distributor and the ignition module.</p>
            <p><strong>Operation:</strong> The electronic trigger generates pulses based on the distributor shaft's rotation. The ignition module receives these pulses and controls the primary circuit of the ignition coil. When the primary circuit is interrupted, the coil produces a high voltage spark. The distributor rotor distributes the spark to the appropriate spark plug.</p>
            <p><strong>Explanation:</strong> This system eliminates the wear and maintenance associated with mechanical breaker points, providing more reliable and consistent spark timing.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Distributorless Ignition System (DIS)</h3>
            <p><strong>Construction:</strong> Eliminates the distributor. Uses a crankshaft position sensor and a camshaft position sensor to determine engine position. Uses a coil pack with multiple coils, each serving two cylinders. An engine control unit (ECU) controls the ignition timing.</p>
            <p><strong>Layout:</strong> Sensors are located on the crankshaft and camshaft. The coil pack is mounted on the engine. The ECU is located in the engine compartment or under the dashboard.</p>
            <p><strong>Operation:</strong> The sensors provide engine position information to the ECU. The ECU calculates the optimal ignition timing and triggers the appropriate coils in the coil pack. Each coil fires two spark plugs simultaneously, one during the compression stroke and the other during the exhaust stroke (wasted spark system).</p>
            <p><strong>Explanation:</strong> DIS systems offer improved ignition timing accuracy and reliability compared to distributor-type systems.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Direct Ignition System (DIS or Coil-on-Plug)</h3>
            <p><strong>Construction:</strong> Eliminates the distributor and coil pack. Uses individual ignition coils mounted directly on each spark plug. An ECU controls the ignition timing. Crankshaft and camshaft sensors.</p>
            <p><strong>Layout:</strong> Sensors are located on the crankshaft and camshaft. Coils are mounted directly on the spark plugs. The ECU is located in the engine compartment or under the dashboard.</p>
            <p><strong>Operation:</strong> The sensors provide engine position information to the ECU. The ECU calculates the optimal ignition timing and triggers each coil independently. Each coil fires only one spark plug.</p>
            <p><strong>Explanation:</strong> Direct ignition systems provide the most precise ignition timing and are highly reliable. They eliminate high voltage wires, which reduces voltage loss.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Capacitor Discharge Ignition (CDI)</h3>
            <p><strong>Construction:</strong> Uses a capacitor to store electrical energy. Uses a trigger mechanism (inductive, Hall effect, or optical) to control the discharge of the capacitor. Uses a step-up transformer to produce a high-voltage spark.</p>
            <p><strong>Layout:</strong> The capacitor, trigger mechanism, and transformer are typically housed in a single unit.</p>
            <p><strong>Operation:</strong> The capacitor is charged by a charging circuit. When the trigger mechanism activates, the capacitor discharges rapidly through the primary winding of the transformer. The transformer steps up the voltage, producing a high-voltage spark.</p>
            <p><strong>Explanation:</strong> CDI systems produce a very fast rise time spark, which is beneficial for high-RPM engines. They are commonly used in motorcycles and small engines.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Energy Transfer Ignition</h3>
            <p><strong>Construction:</strong> Uses two coils: a primary coil and a secondary coil. The primary coil stores energy, and the secondary coil transfers it to the spark plug. Triggering mechanism.</p>
            <p><strong>Layout:</strong> The coils and trigger mechanism are typically housed in a single unit.</p>
            <p><strong>Operation:</strong> The primary coil stores energy when the primary circuit is closed. When the primary circuit is opened, the energy is transferred to the secondary coil. The secondary coil produces a high-voltage spark that is delivered to the spark plug.</p>
            <p><strong>Explanation:</strong> Energy transfer ignition systems provide a high-energy spark and are less sensitive to spark plug fouling. They are used in some automotive and industrial applications.</p>
          </div>
        </section>

        {/* ========== SECTION 4: SPARK PLUGS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Spark Plugs</h2>
          </div>

          <div className={cardClasses('indigo')}>
            <p>Spark plugs are critical components of an internal combustion engine's ignition system. Their primary function is to ignite the compressed air-fuel mixture within the engine's cylinders, initiating the combustion process. They achieve this by generating a high-voltage spark across a gap between two electrodes. Beyond ignition, spark plugs also play a role in heat dissipation from the combustion chamber.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Cold vs. Hot Spark Plugs</h3>
            <TableWrapper>
              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                <tr>
                  <th className="border p-2 text-left">Feature</th>
                  <th className="border p-2 text-left">Cold Spark Plug</th>
                  <th className="border p-2 text-left">Hot Spark Plug</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">1. Heat Transfer</td><td className="border p-2">Rapid heat transfer away from the firing tip.</td><td className="border p-2">Slower heat transfer away from the firing tip.</td></tr>
                <tr><td className="border p-2">2. Insulator Length</td><td className="border p-2">Shorter insulator tip.</td><td className="border p-2">Longer insulator tip.</td></tr>
                <tr><td className="border p-2">3. Operating Temperature</td><td className="border p-2">Operates at a lower firing tip temperature.</td><td className="border p-2">Operates at a higher firing tip temperature.</td></tr>
                <tr><td className="border p-2">4. Fouling Resistance</td><td className="border p-2">Less resistant to fouling (carbon build up).</td><td className="border p-2">More resistant to fouling.</td></tr>
                <tr><td className="border p-2">5. Pre-Ignition Risk</td><td className="border p-2">Lower risk of pre-ignition.</td><td className="border p-2">Higher risk of pre-ignition.</td></tr>
                <tr><td className="border p-2">6. Application</td><td className="border p-2">High-performance engines, high compression engines, or engines that operate under heavy loads.</td><td className="border p-2">Standard engines, low-compression engines, or engines that operate under light loads.</td></tr>
                <tr><td className="border p-2">7. Combustion Chamber Temp</td><td className="border p-2">Best for high combustion chamber temperatures.</td><td className="border p-2">Best for low combustion chamber temperatures.</td></tr>
                <tr><td className="border p-2">8. Self Cleaning ability</td><td className="border p-2">Less self cleaning ability.</td><td className="border p-2">More self cleaning ability.</td></tr>
              </tbody>
            </TableWrapper>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Short-Reach vs. Long-Reach Spark Plugs</h3>
            <TableWrapper>
              <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}>
                <tr>
                  <th className="border p-2 text-left">Feature</th>
                  <th className="border p-2 text-left">Short-Reach Spark Plug</th>
                  <th className="border p-2 text-left">Long-Reach Spark Plug</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">1. Thread Length</td><td className="border p-2">Shorter threaded section.</td><td className="border p-2">Longer threaded section.</td></tr>
                <tr><td className="border p-2">2. Cylinder Head Design</td><td className="border p-2">Designed for cylinder heads with shallow spark plug holes.</td><td className="border p-2">Designed for cylinder heads with deep spark plug holes.</td></tr>
                <tr><td className="border p-2">3. Combustion Chamber Placement</td><td className="border p-2">Positions the firing tip closer to the cylinder head surface.</td><td className="border p-2">Positions the firing tip deeper into the combustion chamber.</td></tr>
                <tr><td className="border p-2">4. Thread engagement</td><td className="border p-2">Less thread engagement with the cylinder head.</td><td className="border p-2">More thread engagement with the cylinder head.</td></tr>
                <tr><td className="border p-2">5. Heat Dissipation</td><td className="border p-2">Can have different heat ranges within reach type.</td><td className="border p-2">Can have different heat ranges within reach type.</td></tr>
                <tr><td className="border p-2">6. Application</td><td className="border p-2">Used in engines with compact cylinder head designs.</td><td className="border p-2">Used in engines with advanced or high-performance cylinder head designs.</td></tr>
                <tr><td className="border p-2">7. Thread Damage Risk</td><td className="border p-2">Higher risk of thread damage if cross-threaded.</td><td className="border p-2">Lower risk of thread damage if cross-threaded.</td></tr>
                <tr><td className="border p-2">8. Combustion efficiency</td><td className="border p-2">Can effect combustion efficiency based on cylinder head design.</td><td className="border p-2">Can effect combustion efficiency based on cylinder head design.</td></tr>
              </tbody>
            </TableWrapper>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Reasons for Differences</h3>
            <p><strong>Heat Range (Cold/Hot):</strong> The heat range of a spark plug is determined by its ability to dissipate heat. Cold plugs dissipate heat quickly, preventing pre-ignition in high-performance engines. Hot plugs retain more heat, burning off deposits and preventing fouling in standard engines.</p>
            <p><strong>Reach (Short/Long):</strong> The reach of a spark plug is determined by the length of its threaded section. This difference is dictated by the design of the cylinder head. Using the correct reach ensures that the firing tip is positioned correctly within the combustion chamber for optimal ignition.</p>
          </div>
        </section>

        {/* ========== SECTION 5: SPARK PLUG CONDITION AND FAULT DIAGNOSIS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Spark Plug Condition and Fault Diagnosis</h2>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Normal Appearance</h3>
            <p><strong>Appearance:</strong> Light tan or gray deposits on the insulator tip and electrodes.</p>
            <p><strong>Interpretation:</strong> Indicates proper air-fuel mixture, ignition timing, and engine operation.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Carbon Fouling (Black, Dry Deposits)</h3>
            <p><strong>Appearance:</strong> Dry, black, sooty deposits on the insulator tip and electrodes.</p>
            <p><strong>Interpretation:</strong> Rich air-fuel mixture, weak spark, faulty choke, restricted air filter, short trips (not allowing engine to reach operating temperature), weak compression, late ignition timing.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Oil Fouling (Wet, Black Deposits)</h3>
            <p><strong>Appearance:</strong> Wet, oily deposits on the insulator tip and electrodes.</p>
            <p><strong>Interpretation:</strong> Worn piston rings or cylinder walls, faulty valve stem seals, overfilled crankcase, PCV system problems.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Lead Fouling (Tan or Yellowish-Brown Deposits)</h3>
            <p><strong>Appearance:</strong> Tan or yellowish-brown deposits on the insulator tip and electrodes.</p>
            <p><strong>Interpretation:</strong> Use of leaded gasoline (not common in modern vehicles), additives in some fuels.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Ash Deposits (White or Gray Deposits)</h3>
            <p><strong>Appearance:</strong> White or gray, powdery deposits on the insulator tip and electrodes.</p>
            <p><strong>Interpretation:</strong> Oil or fuel additives, coolant leaks into the combustion chamber.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">Gap Bridging (Deposits Bridging the Gap)</h3>
            <p><strong>Appearance:</strong> Deposits bridging the gap between the electrodes.</p>
            <p><strong>Interpretation:</strong> Excessive deposits from oil or fuel, worn spark plugs.</p>
          </div>

          <div className={cardClasses('gray')}>
            <h3 className="text-xl font-bold mb-2">Electrode Wear (Rounded or Worn Electrodes)</h3>
            <p><strong>Appearance:</strong> Rounded or excessively worn electrodes.</p>
            <p><strong>Interpretation:</strong> Normal wear and tear, extended spark plug service interval.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Damaged Insulator (Cracked or Broken Insulator)</h3>
            <p><strong>Appearance:</strong> Cracked or broken insulator.</p>
            <p><strong>Interpretation:</strong> Physical damage during installation, thermal shock, detonation.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Pre-Ignition/Detonation Damage (Melted or Damaged Electrodes)</h3>
            <p><strong>Appearance:</strong> Melted or severely damaged electrodes, often with signs of pitting or erosion.</p>
            <p><strong>Interpretation:</strong> Overly advanced ignition timing, lean air-fuel mixture, overheating, incorrect spark plug heat range (too hot), low octane fuel, carbon deposits causing hot spots.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Wet Plug</h3>
            <p><strong>Appearance:</strong> The plug is wet with fuel.</p>
            <p><strong>Interpretation:</strong> Flooded engine, no spark, faulty fuel injector.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Diagnostic Tips</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Examine all spark plugs to get a comprehensive view of engine condition.</li>
              <li>Compare the condition of each spark plug to a spark plug condition chart.</li>
              <li>Consider the engine's operating conditions and recent maintenance history.</li>
              <li>Use a compression test and other diagnostic tools to confirm findings.</li>
              <li>When removing spark plugs, keep them organised, so you know from which cylinder they came.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Ignition System</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ignition Coil</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Triggering Methods</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Electronic Ignition</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Spark Plugs</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Ignition Systems. ⚡🔥</p>
        </footer>

      </div>
    </div>
  );
};