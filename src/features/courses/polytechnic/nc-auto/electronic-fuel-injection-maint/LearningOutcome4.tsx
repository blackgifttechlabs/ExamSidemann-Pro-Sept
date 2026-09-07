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
  Recycle, Leaf
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
              <Recycle className="w-4 h-4" />
              Automotive: Module LO4
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Emissions Control <span className="text-amber-300 font-bold italic">Components & Principles</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to EGR, Lambda/Oxygen sensors, Catalytic Converters, their interactions, and Computerized Diagnostics Operations (DTCs, OBD-II, internet resources).
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">emissions_control.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">EGR_System;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Lambda_Sensors;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">DIAGNOSE</span><span className="text-white">Catalytic_Converter;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><Leaf className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><CloudRain className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: EMISSIONS CONTROL COMPONENTS AND PRINCIPLES ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Emissions Control Components and Principles</h2>
          </div>

          {/* 1. EGR */}
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><WindIcon size={20} /> 1. EGR (Exhaust Gas Recirculation)</h3>
            <p><strong>Principle:</strong> Recirculates a portion of the exhaust gases back into the intake manifold.</p>
            <p><strong>Function:</strong> Lowers combustion temperatures. Reduces NOx formation.</p>
            <p><strong>Operation:</strong> An EGR valve, controlled by the ECU, regulates the amount of exhaust gas recirculated. Recirculating inert exhaust gases reduces the amount of oxygen available for combustion, lowering the peak combustion temperatures.</p>
            <p><strong>Impact:</strong> Significantly reduces NOx emissions.</p>
          </div>

          {/* 2. Lambda Sensor */}
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><GaugeIcon2 size={20} /> 2. Lambda Sensor (Oxygen Sensor)</h3>
            <p><strong>Principle:</strong> Measures the oxygen content in the exhaust gases.</p>
            <p><strong>Function:</strong> Provides feedback to the ECU for precise air/fuel ratio control. Ensures optimal catalytic converter operation.</p>
            <p><strong>Operation:</strong> Generates a voltage signal that varies with the oxygen content in the exhaust. The ECU uses this signal to adjust the fuel injection, maintaining the air/fuel ratio close to the stoichiometric point (approximately <MathFormula>14.7:1</MathFormula> for gasoline).</p>
            <p><strong>Impact:</strong> Optimises combustion efficiency. Reduces CO, HC, and NOx emissions. Allows the catalytic converter to operate at its most efficient point.</p>
          </div>

          {/* 3. Oxygen Sensor (Same as Lambda Sensor) */}
          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Activity size={20} /> 3. Oxygen Sensor (Same as Lambda Sensor)</h3>
            <p><strong>Terminology:</strong> "Lambda sensor" and "oxygen sensor" are generally used interchangeably.</p>
            <p><strong>Types:</strong></p>
            <ul className="list-disc pl-5">
              <li><strong>Zirconia sensors:</strong> Generate a voltage signal based on the oxygen difference between the exhaust gas and ambient air.</li>
              <li><strong>Titania sensors:</strong> Change electrical resistance based on oxygen content.</li>
              <li><strong>Wideband sensors:</strong> Provides a more accurate and linear output over a wider range of air/fuel ratios. Used in more modern vehicles.</li>
            </ul>
            <p><strong>Location:</strong> Typically located in the exhaust manifold before and/or after the catalytic converter.</p>
            <p><strong>Function:</strong> The sensor before the catalytic converter provides feedback for air/fuel ratio control. The sensor after the catalytic converter monitors the catalytic converter's efficiency.</p>
            <p><strong>Importance:</strong> Essential for closed-loop fuel control. Vital for minimising emissions and ensuring optimal engine performance.</p>
          </div>

          {/* 4. Catalytic Converters */}
          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Recycle size={20} /> 4. Catalytic Converters</h3>
            <p>Work in conjunction with the oxygen sensors to convert harmful exhaust gases into less harmful substances. They use precious metals (platinum, palladium, rhodium) as catalysts. They reduce CO, HC, and NOx emissions.</p>
            <p><strong>Function:</strong> Catalytic converters are devices within the exhaust system that convert harmful pollutants into less harmful substances. They use precious metals (platinum, palladium, and rhodium) as catalysts to facilitate chemical reactions.</p>
            <p><strong>Process:</strong></p>
            <ul className="list-disc pl-5">
              <li><strong>Oxidation:</strong> Platinum and palladium catalyze the oxidation of carbon monoxide (CO) to carbon dioxide (CO₂) and hydrocarbons (HC) to CO₂ and water (H₂O).</li>
              <li><strong>Reduction:</strong> Rhodium catalyzes the reduction of nitrogen oxides (NOx) to nitrogen (N₂) and oxygen (O₂).</li>
            </ul>
            <p><strong>Types:</strong></p>
            <ul className="list-disc pl-5">
              <li><strong>Three-way catalytic converters:</strong> Used in gasoline engines, they perform all three reactions (oxidation and reduction).</li>
              <li><strong>Two-way catalytic converters:</strong> Older type, that only oxidised HC and CO.</li>
            </ul>
            <p><strong>Importance:</strong> Significantly reduce harmful emissions, helping to meet environmental regulations. They are a vital component of modern emission control systems.</p>
          </div>
        </section>

        {/* ========== SECTION 2: OVERALL EMISSIONS CONTROL STRATEGY ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Overall Emissions Control Strategy</h2>
          </div>
          <div className={cardClasses('indigo')}>
            <ul className="list-disc pl-5 space-y-1">
              <li>The ECU, using input from the oxygen sensor and other sensors, constantly adjusts the air/fuel ratio to maintain optimal combustion and catalytic converter operation.</li>
              <li>The EGR system reduces NOx emissions.</li>
              <li>The catalytic converter further reduces harmful emissions.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: OXYGEN SENSOR INTERACTION ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Oxygen Sensor Interaction</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Feedback Loop</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>The lambda sensor provides real-time feedback to the ECU about the oxygen content in the exhaust.</li>
              <li>The ECU uses this information to adjust the fuel injection, ensuring the air/fuel mixture is optimal for the catalytic converter.</li>
            </ul>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Catalytic Converter Efficiency</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>A second lambda sensor, located after the catalytic converter, monitors the converter's efficiency.</li>
              <li>It compares the oxygen content before and after the converter to determine if it's functioning correctly.</li>
            </ul>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">EGR and Oxygen Sensors</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>When the EGR valve opens, it changes the oxygen content of the intake air.</li>
              <li>The oxygen sensors detect these changes and the ECU adjusts the fuel mixture accordingly.</li>
              <li>The oxygen sensors help the ECU to maintain the correct air/fuel ratio, even with EGR operation.</li>
            </ul>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">In Summary</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Catalytic converters, lambda sensors, and EGR work together to reduce harmful emissions.</li>
              <li>Lambda sensors provide crucial feedback for air/fuel ratio control.</li>
              <li>EGR reduces NOx emissions by lowering combustion temperatures.</li>
              <li>The catalytic converter then finishes the job of cleaning the remaining gases.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: COMPUTERIZED DIAGNOSTICS OPERATIONS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Computerized Diagnostics Operations</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Common Faults/Codes (DTCs)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Diagnostic Trouble Codes (DTCs)</strong> are the language of modern vehicle diagnostics. They are generated by the vehicle's onboard computer system when it detects a malfunction. Understanding these codes is essential for efficient troubleshooting.</li>
              <li><strong>OBD-II Standardisation:</strong> The OBD-II (On-Board Diagnostics II) standard has created a uniform system for accessing and interpreting these codes, making it easier for technicians to diagnose problems across different vehicle makes and models.</li>
              <li><strong>Code Structure:</strong> DTCs follow a specific format, which reveals information about the affected vehicle system. For example: The first character (letter) indicates the system (P for Powertrain, B for Body, C for Chassis, U for Network). The subsequent digits provide more specific details about the fault.</li>
              <li><strong>Common Fault Areas:</strong>
                <ul className="list-disc pl-5">
                  <li>Engine Misfires (P0300 series): Often related to ignition, fuel, or compression issues.</li>
                  <li>Oxygen Sensor Problems (P01xx series): Indicate issues with the oxygen sensors, which are crucial for emissions control.</li>
                  <li>Mass Airflow (MAF) Sensor Issues (P0100 series): Affect the engine's ability to measure incoming air.</li>
                  <li>Evaporative Emission Control System (EVAP) Leaks (P04xx series): Indicate leaks in the system that controls fuel vapours.</li>
                </ul>
              </li>
              <li><strong>Importance:</strong> DTCs provide a starting point for diagnosis, guiding technicians toward the affected systems. They help to reduce diagnostic time and improve accuracy. OBD-II systems are designed to monitor emissions-related systems and ensure compliance with regulations.</li>
            </ul>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Wifi size={20} /> Internet</h3>
            <p>The internet has revolutionised automotive diagnostics, providing technicians with access to a wealth of information.</p>
            <p><strong>Uses:</strong></p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Code Definitions and Troubleshooting:</strong> Online databases and forums provide detailed information about DTCs, including their possible causes and solutions.</li>
              <li><strong>Technical Service Bulletins (TSBs):</strong> Manufacturers release TSBs to address common problems and provide repair procedures. Technicians can access these documents online.</li>
              <li><strong>Wiring Diagrams and Repair Manuals:</strong> Online resources provide access to wiring diagrams and repair manuals, which are essential for troubleshooting electrical and mechanical problems.</li>
              <li><strong>Online Forums and Communities:</strong> Technicians can connect with other professionals online to share knowledge and seek advice.</li>
              <li><strong>Software and Firmware Updates:</strong> Scan tool manufacturers and vehicle manufacturers provide software and firmware updates online, ensuring that diagnostic tools are up-to-date.</li>
            </ul>
            <p><strong>Impact:</strong> The internet has made it easier for technicians to access the information they need to diagnose and repair vehicles. It has also facilitated the sharing of knowledge and best practices within the automotive repair industry.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 4 — Emissions Control Components & Principles</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">EGR</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lambda/O₂ Sensors</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Catalytic Converters</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">DTCs & OBD-II</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Emissions Control. 🌿🔧</p>
        </footer>

      </div>
    </div>
  );
};