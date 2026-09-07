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
  Clock, TrendingUp as TrendingUpIcon
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
              <TestTube className="w-4 h-4" />
              Automotive: Module LO3
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Fitting Fuel Injection <span className="text-purple-300 font-bold italic">System Components: Testing</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to injector pump tests, injector tests, fuel pump tests, test running engine procedures, faults and remedies, trip computer, clearing fault codes, and OBD codes.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">injection_testing.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Injector_Tests;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">TEST</span><span className="text-white">Fuel_Pump;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">DIAGNOSE</span><span className="text-white">OBD_Codes;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><AlertCircle className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: INJECTOR PUMP TESTS ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Injector Pump Tests (Primarily for Diesel Systems)</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Pressure Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Connect a high-pressure gauge to the injector pump's output.</li>
              <li>Measure the pump's delivery pressure at various engine speeds.</li>
              <li>Compare readings to manufacturer specifications.</li>
              <li>This test verifies the pump's ability to generate the required pressure.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Delivery Volume Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Measure the amount of fuel delivered by the pump over a specific time period.</li>
              <li>Compare the measured volume to manufacturer specifications.</li>
              <li>This test verifies the pump's ability to deliver the correct amount of fuel.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Timing Checks</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verify the injection timing using appropriate tools and procedures.</li>
              <li>This ensures that fuel is injected at the correct point in the engine's cycle.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Leakage Tests</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check for fuel leaks around the pump's body, seals, and connections.</li>
              <li>This prevents fuel loss and potential fire hazards.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Electronic Control Tests (if applicable)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use a scan tool or diagnostic equipment to check the operation of the pump's electronic controls.</li>
              <li>Verify that the pump is responding correctly to control signals.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: INJECTOR TESTS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Injector Tests (Gasoline and Diesel)</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Spray Pattern Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Remove the injectors and observe the spray pattern.</li>
              <li>A good injector will have a fine, even mist.</li>
              <li>A poor spray pattern indicates a clogged or damaged injector.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Resistance Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use a multimeter to measure the resistance of the injector coil.</li>
              <li>This checks for open or shorted circuits.</li>
              <li>Compare readings to manufacturer specifications.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Pulse Testing (Gasoline)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Use a noid light or oscilloscope to check for electrical pulses to the injectors.</li>
              <li>This verifies the ECU's control of the injectors.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Leakage Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>For diesel injectors: high pressure pop off testing is used to check for internal leakage, and proper opening pressure.</li>
              <li>For gasoline injectors: check for fuel dripping from the injector tip.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Volume Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Measuring the amount of fuel delivered by each injector over a set period of time.</li>
              <li>This can be done with specialized injector testing equipment.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: FUEL PUMP TESTS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Fuel Pump Tests (Gasoline and Diesel)</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Pressure Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Connect a fuel pressure gauge to the fuel line near the engine.</li>
              <li>Measure the pump's delivery pressure at various engine speeds.</li>
              <li>Compare readings to manufacturer specifications.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Delivery Volume Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Measure the amount of fuel delivered by the pump over a specific time period.</li>
              <li>Compare the measured volume to manufacturer specifications.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Electrical Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check the pump's voltage and amperage draw.</li>
              <li>This verifies the pump's electrical integrity.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Leakage Tests</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check for fuel leaks around the pump's body, seals, and connections.</li>
              <li>Check for leaks in the fuel lines.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Noise Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Listen for unusual noises from the fuel pump.</li>
              <li>Excessive noise can indicate a worn or failing pump.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: TEST RUNNING ENGINE ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Test Running Engine</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Initial Start-Up</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Start the engine and listen for any unusual noises.</li>
              <li>Observe the idle speed and smoothness.</li>
              <li>Check for any fuel or fluid leaks.</li>
              <li>Monitor the exhaust for unusual smoke or odours.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Warm-Up Phase</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Allow the engine to reach operating temperature.</li>
              <li>Observe the engine's behaviour during warm-up.</li>
              <li>Check for smooth acceleration and deceleration.</li>
              <li>Monitor the engine temperature gauge.</li>
            </ul>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Road Test (If Applicable)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Drive the vehicle under various conditions:
                <ul className="list-disc pl-5">
                  <li>City driving (stop-and-go).</li>
                  <li>Highway driving (constant speed).</li>
                  <li>Acceleration and deceleration.</li>
                </ul>
              </li>
              <li>Observe engine performance, fuel economy, and overall vehicle behaviour.</li>
              <li>Listen for any unusual noises or vibrations.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Final Inspection</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Check for any leaks or loose connections.</li>
              <li>Re-check fluid levels.</li>
              <li>Use a scan tool to check for any new DTCs.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 5: FAULTS AND REMEDIES ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Faults and Remedies</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Poor Idle</h3>
            <p><strong>Fault:</strong> Vacuum leaks, faulty idle air control (IAC) valve, incorrect idle mixture.</p>
            <p><strong>Remedy:</strong> Check for vacuum leaks, replace IAC valve, adjust idle mixture.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Misfires</h3>
            <p><strong>Fault:</strong> Faulty injectors, ignition problems, low fuel pressure.</p>
            <p><strong>Remedy:</strong> Test and replace injectors, check ignition system, check fuel pressure.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Poor Acceleration</h3>
            <p><strong>Fault:</strong> Clogged fuel filter, faulty MAF/MAP sensor, low fuel pressure.</p>
            <p><strong>Remedy:</strong> Replace fuel filter, test and replace MAF/MAP sensor, check fuel pressure.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Engine Stalling</h3>
            <p><strong>Fault:</strong> Faulty fuel pump, faulty crankshaft position sensor, vacuum leaks.</p>
            <p><strong>Remedy:</strong> Test and replace fuel pump, test and replace crankshaft position sensor, check for vacuum leaks.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Increased Fuel Consumption</h3>
            <p><strong>Fault:</strong> Faulty oxygen sensor, leaking injectors, incorrect air/fuel mixture.</p>
            <p><strong>Remedy:</strong> Test and replace oxygen sensor, test and replace injectors, adjust air/fuel mixture.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">Excessive Smoke</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Blue smoke:</strong> oil burning.</li>
              <li><strong>Black smoke:</strong> rich fuel mixture.</li>
              <li><strong>White smoke:</strong> coolant burning.</li>
              <li><strong>Remedy:</strong> Diagnose and address the specific cause of smoke.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Check Engine Light Illumination</h3>
            <p><strong>Fault:</strong> Various sensor or actuator failures.</p>
            <p><strong>Remedy:</strong> Scan for diagnostic trouble codes, and repair the related components.</p>
          </div>
        </section>

        {/* ========== SECTION 6: TRIP COMPUTER ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Trip Computer</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Function</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>A trip computer provides information about fuel economy, average speed, distance traveled, and other driving data.</li>
              <li>It can be used to monitor fuel consumption and detect changes in engine performance.</li>
              <li>It gives the driver feedback about the efficiency of the engine.</li>
            </ul>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Role in Testing</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>During a road test, the trip computer can provide real-time feedback on fuel economy, helping to identify any issues with fuel delivery or engine efficiency.</li>
              <li>Changes in fuel economy can indicate problems with the fuel injection or carburetor system.</li>
            </ul>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Limitations</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Trip computer readings can be affected by driving conditions, such as traffic, terrain, and driving style.</li>
              <li>They should be used as a general guide and not as a substitute for accurate diagnostic testing.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 7: CLEARING FAULT CODES ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Clearing Fault Codes</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Repair the Underlying Issue</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Crucial Step:</strong> Clearing fault codes without addressing the underlying problem is pointless. The codes will simply reappear.</li>
              <li><strong>Diagnostic Process:</strong> Use a scan tool, multimeter, or other diagnostic equipment to identify the root cause of the fault code.</li>
              <li><strong>Repair:</strong> Perform the necessary repairs, such as replacing a faulty sensor, repairing a wiring issue, or fixing a vacuum leak.</li>
            </ul>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Use a Scan Tool</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Connection:</strong> Connect a scan tool to the vehicle's OBD-II port.</li>
              <li><strong>Access Codes:</strong> Turn on the ignition (engine off) and use the scan tool to access the stored fault codes.</li>
              <li><strong>Clear Codes:</strong> Select the "Clear Codes" or "Erase Codes" function on the scan tool.</li>
              <li><strong>Verification:</strong> After clearing the codes, use the scan tool to verify that they have been successfully erased.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Battery Disconnection (Less Common)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Older Vehicles:</strong> In some older vehicles, disconnecting the battery (negative terminal first) for a period of time (typically 15-30 minutes) can clear fault codes.</li>
              <li><strong>Modern Vehicles:</strong> This method is less reliable in modern vehicles and can sometimes cause other issues, such as resetting learned engine parameters or triggering security systems.</li>
              <li><strong>Not Recommended:</strong> It is generally recommended to use a scan tool to clear fault codes.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Drive Cycle (If Required)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Readiness Monitors:</strong> After clearing fault codes, the ECU may need to perform a drive cycle to complete readiness monitors.</li>
              <li><strong>Drive Cycle:</strong> A specific sequence of driving conditions that allows the ECU to test various systems.</li>
              <li><strong>Verification:</strong> Use a scan tool to check the status of readiness monitors.</li>
              <li><strong>Inspection/Emissions:</strong> Some inspections and emissions testing require that the readiness monitors be complete.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 8: OBD CODES ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>OBD Codes (On-Board Diagnostics Codes)</h2>
          </div>
          <div className={cardClasses('indigo')}>
            <p><strong>Standardised Codes:</strong> OBD-II codes are standardised, meaning that the same code generally refers to the same fault across different vehicle manufacturers.</p>
            <p><strong>Structure:</strong> OBD-II codes consist of a five-character alphanumeric code, such as <MathFormula>P0300</MathFormula>.</p>
            
            <h4 className="font-bold mt-4">First Character:</h4>
            <ul className="list-disc pl-5">
              <li><strong>P:</strong> Powertrain (engine, transmission)</li>
              <li><strong>B:</strong> Body (interior, exterior)</li>
              <li><strong>C:</strong> Chassis (brakes, suspension)</li>
              <li><strong>U:</strong> Network (communication)</li>
            </ul>

            <h4 className="font-bold mt-4">Second Character:</h4>
            <ul className="list-disc pl-5">
              <li><strong>0:</strong> Standardised OBD-II code</li>
              <li><strong>1, 2, 3:</strong> Manufacturer-specific code</li>
            </ul>

            <h4 className="font-bold mt-4">Third Character (Indicates the specific system):</h4>
            <ul className="list-disc pl-5">
              <li><strong>1:</strong> Fuel and air metering</li>
              <li><strong>2:</strong> Fuel and air metering (injector circuit)</li>
              <li><strong>3:</strong> Ignition system or misfire</li>
              <li><strong>4:</strong> Auxiliary emissions controls</li>
              <li><strong>5:</strong> Vehicle speed control and idle control system</li>
              <li><strong>6:</strong> Computer output circuit</li>
              <li><strong>7:</strong> Transmission</li>
              <li><strong>8:</strong> Transmission</li>
              <li><strong>9:</strong> Transmission</li>
              <li><strong>0:</strong> High voltage battery</li>
            </ul>

            <h4 className="font-bold mt-4">Fourth and Fifth Characters:</h4>
            <p>Indicate the specific fault within the system.</p>

            <h4 className="font-bold mt-4">Importance:</h4>
            <ul className="list-disc pl-5">
              <li><strong>Diagnosis:</strong> OBD codes provide valuable information for diagnosing vehicle problems.</li>
              <li><strong>Troubleshooting:</strong> They help technicians pinpoint the source of a fault and guide them through the repair process.</li>
              <li><strong>Emissions Compliance:</strong> OBD-II systems are designed to monitor emissions-related systems and ensure compliance with regulations.</li>
            </ul>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Fitting Fuel Injection System Components: Testing</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Injector Tests</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fuel Pump Tests</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Faults & Remedies</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">OBD Codes</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Fuel Injection Testing. ⛽🔧</p>
        </footer>

      </div>
    </div>
  );
};