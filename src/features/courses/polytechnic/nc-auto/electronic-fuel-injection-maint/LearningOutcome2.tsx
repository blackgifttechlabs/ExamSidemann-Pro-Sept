import React from 'react';
import { 
  Zap, Battery,  Cpu, Box, Radio, 
  Wrench, Settings, Gauge, Shield, Map, 
  ChevronLeft, ChevronRight, X, Activity,
  Thermometer, Droplet, Sun, Moon, Wind,
  TrendingUp, TrendingDown, AlertTriangle,
  Code, Table, BookOpen, Target, Heart,
  Sigma, Divide, Plus, Minus, Car, Cog,
  Volume2, Eye, Hand, Monitor, Navigation,
  Bell, Lightbulb, Vibrate, MessageSquare, 
  LightbulbIcon, Flame, Sparkles, Fuel, 
  AlertCircle, ShieldAlert, ZapOff, 
  Microscope, Scan, Wifi, Cloud,
  TestTube, 
  HardDrive, Server
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
              <Fuel className="w-4 h-4" />
              Automotive: Module LO2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Fuel Injection <span className="text-sky-300 font-bold italic">System Layout & Diagnostics</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to fuel injection system layout, fuel management (stoichiometric ratio, lambda, EGR), system types (K-Jetronic, L-Jetronic, Motronic, GDI, Common Rail), component testing, common faults, and computerized diagnostics.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">fuel_injection_lo2.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Injection_Types;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Lambda_Sensors;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">DIAGNOSE</span><span className="text-white">OBD_Systems;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Gauge className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><TestTube className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: FUEL INJECTION SYSTEM LAYOUT ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Fuel Injection System Layout</h2>
          </div>
          <div className={cardClasses('blue')}>
            <p>A typical fuel injection system, especially in modern vehicles, follows this general layout:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Fuel Tank:</strong> Stores the fuel.</li>
              <li><strong>Electric Fuel Pump:</strong> Located in or near the fuel tank, it delivers fuel under pressure.</li>
              <li><strong>Fuel Filter:</strong> Removes impurities from the fuel.</li>
              <li><strong>Fuel Lines:</strong> Carry fuel to the engine.</li>
              <li><strong>Fuel Rail:</strong> Distributes fuel to the individual fuel injectors.</li>
              <li><strong>Fuel Injectors:</strong> Spray fuel into the intake manifold or directly into the cylinders.</li>
              <li><strong>Air Intake System:</strong> Includes the air filter, throttle body, and intake manifold.</li>
              <li><strong>Sensors:</strong> MAF/MAP sensors, O₂ sensors, temperature sensors, etc., provide data to the ECU.</li>
              <li><strong>Electronic Control Unit (ECU):</strong> Processes sensor data and controls the fuel injectors.</li>
              <li><strong>Exhaust System:</strong> Including the lambda sensor and sometimes the EGR valve.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: SAFETY PRECAUTIONS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Safety Precautions</h2>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ShieldAlert size={20} /> Fuel Handling</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Work in a well-ventilated area.</li>
              <li>No smoking or open flames.</li>
              <li>Clean up fuel spills immediately.</li>
              <li>Relieve fuel pressure before disconnecting lines.</li>
              <li>Wear eye and skin protection.</li>
            </ul>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><ZapOff size={20} /> Electrical Safety</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Disconnect the battery.</li>
              <li>Use insulated tools.</li>
              <li>Handle components carefully.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: FUEL MANAGEMENT ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Fuel Management</h2>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Stoichiometric Ratio</h3>
            <p>The ideal air/fuel ratio for complete combustion. For gasoline, it's approximately <MathFormula>14.7:1</MathFormula> (14.7 parts air to 1 part fuel). This ratio optimises emissions and fuel efficiency.</p>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Air/Fuel Mixture</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Rich Mixture:</strong> Excess fuel (less air). Can increase power but increases emissions.</li>
              <li><strong>Lean Mixture:</strong> Excess air (less fuel). Can improve fuel efficiency but can increase NOx emissions and potentially damage the engine.</li>
            </ul>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Lambda Sensor (Oxygen Sensor)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Measures the oxygen content in the exhaust gases.</li>
              <li>Provides feedback to the ECU to adjust the air/fuel mixture.</li>
              <li><strong>Lambda (λ):</strong> Indicates the air/fuel ratio relative to the stoichiometric ratio:
                <ul className="list-disc pl-5 mt-1">
                  <li>λ = 1: Stoichiometric ratio.</li>
                  <li>λ {'>'} 1: Lean mixture.</li>
                  <li>λ {'<'} 1: Rich mixture.</li>
                </ul>
              </li>
            </ul>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">EGR (Exhaust Gas Recirculation)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Recirculates a portion of the exhaust gases back into the intake manifold.</li>
              <li>Reduces NOx emissions by lowering combustion temperatures.</li>
              <li>The ECU controls the EGR valve to regulate the amount of exhaust gas recirculated.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: FUEL INJECTION SYSTEM TYPES ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Fuel Injection System Types</h2>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">Pressure-Based/Sensed Systems</h3>
            <p>These systems rely on fuel pressure differentials to control fuel delivery. They often use mechanical components to regulate fuel flow. Older systems, like some early mechanical injection systems, fell into this category.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Continuous Injection Systems</h3>
            <p>Fuel is continuously sprayed into the intake manifold, regardless of the engine's intake stroke. The amount of fuel delivered is varied by controlling the fuel pressure.</p>
            <ul className="list-disc pl-5 mt-2">
              <li><strong>K-Jetronic:</strong> A continuous, mechanical fuel injection system. Uses a fuel distributor and air-flow sensor to control fuel delivery. Relies on fuel pressure and mechanical linkages.</li>
              <li><strong>KE-Jetronic:</strong> An electronically controlled version of K-Jetronic. Adds electronic control to the fuel pressure regulator, allowing for more precise fuel metering.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Intermittent Injection Systems</h3>
            <p>Fuel is injected in pulses, timed to coincide with the engine's intake stroke. This allows for more precise fuel control and better fuel economy.</p>
            <ul className="list-disc pl-5 mt-2">
              <li><strong>L-Jetronic:</strong> An electronic, multi-point fuel injection system. Uses a mass airflow (MAF) sensor to measure intake air volume. Electronically controlled injectors deliver fuel intermittently.</li>
              <li><strong>LE-Jetronic:</strong> A simplified version of the L-Jetronic system.</li>
              <li><strong>LH-Jetronic:</strong> Uses a hot-wire MAF sensor for more accurate air measurement.</li>
              <li><strong>LU-Jetronic:</strong> A less common variation with variations in the sensors used.</li>
              <li><strong>Motronic:</strong> A combined fuel injection and ignition control system. Integrates fuel injection, ignition timing, and other engine management functions. Available in many variations.</li>
              <li><strong>Mono-Jetronic:</strong> A single-point fuel injection system (throttle body injection). Uses a single injector located in the throttle body. Simpler and less expensive than multi-point systems.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Modern Electronic Systems</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Common Rail Systems:</strong> Used primarily in diesel engines. Fuel is stored in a common rail at high pressure. Electronically controlled injectors deliver precise amounts of fuel directly into the cylinders. Extremely high pressure systems.</li>
              <li><strong>Direct Injection Systems (Gasoline Direct Injection - GDI):</strong> Fuel is injected directly into the combustion chamber, rather than the intake manifold. Allows for precise fuel control, improved fuel economy, and increased power. This is a pressure based, and intermittent system. Can create issues with carbon buildup on the intake valves.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Differences</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mechanical systems (like K-Jetronic) rely on mechanical components and fuel pressure.</li>
              <li>Electronic systems (like L-Jetronic, Motronic, and GDI) use sensors, ECUs, and electrically controlled injectors.</li>
              <li>Continuous injection systems deliver fuel constantly, while intermittent systems deliver fuel in pulses.</li>
              <li>Direct injection injects fuel directly into the cylinder, and indirect injection injects fuel into the intake manifold.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: CHECKING COMPONENTS/SYSTEM FUNCTIONALITY ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Checking Components / System Functionality</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Fuel Pressure Test</h3>
            <ul className="list-disc pl-5">
              <li>Connect a fuel pressure gauge to the fuel rail.</li>
              <li>Check the fuel pressure against the manufacturer's specifications.</li>
              <li>Observe if the pressure holds steady or drops.</li>
              <li>This checks the fuel pump, pressure regulator, and fuel lines.</li>
            </ul>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Fuel Injector Testing</h3>
            <ul className="list-disc pl-5">
              <li><strong>Pulse Testing:</strong> Use a noid light or oscilloscope to check for electrical pulses to the injectors. Verifies the ECU's control of the injectors.</li>
              <li><strong>Resistance Testing:</strong> Use a multimeter to check the resistance of the injector coils. Identifies open or shorted injectors.</li>
              <li><strong>Spray Pattern Testing:</strong> Remove the injectors and observe the spray pattern. A good injector will have a fine, even mist.</li>
              <li><strong>Volume Testing:</strong> Measure the amount of fuel each injector delivers over a set amount of time.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Sensor Testing</h3>
            <ul className="list-disc pl-5">
              <li><strong>MAF/MAP Sensor:</strong> Use a scan tool to monitor sensor readings. Check for accurate readings and response to changes in airflow or pressure.</li>
              <li><strong>O₂ Sensor:</strong> Use a scan tool or multimeter to check sensor voltage and response time. Look for switching between rich and lean readings.</li>
              <li><strong>Temperature Sensors:</strong> Use a multimeter to check sensor resistance at different temperatures. Compare readings to manufacturer's specifications.</li>
              <li><strong>Position Sensors (CKP/CMP):</strong> Use a scan tool or oscilloscope to check sensor signals. Look for consistent and accurate signals.</li>
              <li>Compare scan tool live data to known good values.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Fuel Pump Testing</h3>
            <ul className="list-disc pl-5">
              <li>Check fuel pump operation by listening for the pump to run when the ignition is turned on.</li>
              <li>Check fuel pump amperage draw.</li>
              <li>Check fuel pump voltage.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Wiring and Connections</h3>
            <ul className="list-disc pl-5">
              <li>Visually inspect wiring for damage, corrosion, or loose connections.</li>
              <li>Use a multimeter to check for continuity and voltage at connectors.</li>
            </ul>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">ECU Diagnostics</h3>
            <ul className="list-disc pl-5">
              <li>Use a scan tool to read diagnostic trouble codes (DTCs).</li>
              <li>Monitor live data from sensors and actuators.</li>
              <li>Perform actuator tests using the scan tool.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Exhaust System</h3>
            <ul className="list-disc pl-5">
              <li>Visual inspection for leaks.</li>
              <li>Backpressure testing.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Air Intake System</h3>
            <ul className="list-disc pl-5">
              <li>Check for air leaks.</li>
              <li>Inspect air filter condition.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 6: COMMON FAULTS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Common Faults</h2>
          </div>
          <div className={cardClasses('red')}>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Fuel Pump Failure:</strong> Worn pump, electrical issues, contaminated fuel. Symptoms: No fuel delivery, low fuel pressure, engine stalling.</li>
              <li><strong>Clogged Fuel Filter:</strong> Contaminated fuel. Symptoms: Low fuel pressure, poor engine performance, engine stalling.</li>
              <li><strong>Faulty Fuel Injectors:</strong> Clogged injectors, electrical failures, worn seals. Symptoms: Misfires, poor idle, reduced power, increased fuel consumption.</li>
              <li><strong>Faulty Sensors:</strong> Electrical failures, contamination, wear and tear. Symptoms: Poor engine performance, increased emissions, inaccurate sensor readings.</li>
              <li><strong>Wiring and Connection Problems:</strong> Corrosion, damage, loose connections. Symptoms: Intermittent problems, sensor failures, actuator failures.</li>
              <li><strong>Vacuum Leaks:</strong> Cracked hoses, bad gaskets. Symptoms: Poor idle, increased fuel consumption, rough running.</li>
              <li><strong>Faulty Pressure Regulator:</strong> Diaphragm failure, spring wear. Symptoms: High or low fuel pressure, poor engine performance.</li>
              <li><strong>ECU Failures:</strong> Electrical surges, water damage, internal component failures. Symptoms: Various engine problems, no communication with scan tool.</li>
              <li><strong>Lambda Sensor Failure:</strong> Contamination, age. Symptoms: Poor fuel economy, increased emissions, poor engine performance.</li>
              <li><strong>EGR Valve Problems:</strong> Carbon buildup, valve failure. Symptoms: Rough idle, poor acceleration, increased emissions.</li>
              <li><strong>Direct Injection Carbon Buildup:</strong> The nature of direct injection. Symptoms: Misfires, poor performance, reduced fuel economy.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: COMPUTERIZED DIAGNOSTICS OPERATIONS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Computerized Diagnostics Operations</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Machines and Equipment</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Scan Tools (Diagnostic Scanners):</strong> Handheld or laptop-based devices that connect to the OBD-II port. Used to read DTCs, monitor live data, perform actuator tests, and reprogram ECUs. Vary in complexity from basic code readers to advanced professional-grade scanners.</li>
              <li><strong>Oscilloscopes:</strong> Used to visualise electrical signals from sensors and actuators. Helpful for diagnosing intermittent problems and analysing signal patterns.</li>
              <li><strong>Multimeters:</strong> Essential for checking voltage, resistance, and continuity in electrical circuits.</li>
              <li><strong>Fuel Pressure Testers:</strong> Used to measure fuel pressure in the fuel rail.</li>
              <li><strong>Fuel Injector Testers:</strong> Used to test the function of the fuel injectors.</li>
              <li><strong>Laptop/PC:</strong> For running advanced diagnostic software, accessing online repair information, and reprogramming ECUs.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Fault Codes (Diagnostic Trouble Codes - DTCs)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Codes generated by the ECU when it detects a problem with the fuel injection system or other vehicle systems.</li>
              <li>Each DTC corresponds to a specific fault, such as a faulty sensor, actuator, or wiring issue.</li>
              <li>Scan tools are used to read and interpret DTCs.</li>
              <li>DTCs provide a starting point for diagnosis, but further testing is often required to pinpoint the exact cause of the problem.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Internet</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Online Repair Information:</strong> Access to online databases, manufacturer websites, and repair forums for technical information, wiring diagrams, and troubleshooting tips.</li>
              <li><strong>Software Updates:</strong> Downloading software updates for scan tools and ECU reprogramming.</li>
              <li><strong>Parts Ordering:</strong> Online ordering of replacement parts from suppliers.</li>
              <li><strong>Technical Forums:</strong> Access to forums that discuss car repair, and allow for users to ask questions and learn from other users.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">OBD (On-Board Diagnostics)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>OBD-II:</strong> A standardised diagnostic system mandatory for most modern vehicles. Provides access to diagnostic information through a standardised connector (OBD-II port). Allows technicians to read DTCs, monitor live data, and perform other diagnostic tests.</li>
              <li><strong>Live Data Monitoring:</strong> Scan tools can display real-time data from sensors and actuators, allowing technicians to observe how the system is operating. Helps identify problems that may not trigger DTCs.</li>
              <li><strong>Actuator Tests:</strong> Scan tools can be used to activate actuators, such as fuel injectors or EGR valves, to verify their operation.</li>
            </ul>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">Computerized Diagnostic Operations Workflow</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Connect the scan tool to the OBD-II port.</li>
              <li>Turn on the ignition.</li>
              <li>Read and record any DTCs.</li>
              <li>Use the scan tool to monitor live data from relevant sensors and actuators.</li>
              <li>Perform actuator tests as needed.</li>
              <li>Use the internet to research DTCs and find repair information.</li>
              <li>Use a multimeter or oscilloscope to perform further testing as needed.</li>
              <li>Replace faulty components.</li>
              <li>Clear DTCs and retest the system.</li>
              <li>Verify that the problem is resolved.</li>
            </ol>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Fuel Injection System Layout & Diagnostics</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Layout</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fuel Management</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Types</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Diagnostics</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Fuel Injection Systems. ⛽🔧</p>
        </footer>

      </div>
    </div>
  );
};