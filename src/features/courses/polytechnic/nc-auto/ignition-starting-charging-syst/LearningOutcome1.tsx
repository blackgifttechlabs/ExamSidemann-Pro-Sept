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
  BatteryFull, BatteryWarning
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
      <header className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 relative w-full mb-12 rounded-[5px] overflow-hidden shadow-md pt-6 pb-6">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>
        <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center px-6 py-12 sm:px-12 sm:py-16">
          <div className="flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-teal-900/20">
              <Battery className="w-4 h-4" />
              Automotive Electrical: Module LO1
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Batteries — <span className="text-emerald-300 font-bold italic">Lead-Acid & Nickel-Cadmium</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to construction, operation, care and maintenance, safety precautions, battery ratings (Ah, RC, CCA), testing instruments, and charging methods.
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">batteries.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Lead_Acid;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">NiCd_Batteries;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">TEST</span><span className="text-white">CCA_&_RC;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><BatteryCharging className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><ShieldAlert className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: LEAD-ACID BATTERIES ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Lead-Acid Batteries</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Construction</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Consists of positive plates made of <strong>lead dioxide (PbO₂)</strong> and negative plates made of <strong>sponge lead (Pb)</strong>.</li>
              <li>These plates are immersed in an electrolyte, which is a solution of <strong>sulfuric acid (H₂SO₄)</strong> and water.</li>
              <li>The plates are separated by insulators to prevent short circuits.</li>
              <li>The battery is housed in a durable plastic case.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Operation</h3>
            <p><strong>Discharging:</strong> During discharge, a chemical reaction occurs where lead dioxide and sponge lead react with sulfuric acid, forming <strong>lead sulphate (PbSO₄)</strong> on both plates. This process releases electrons, providing electrical current.</p>
            <p><strong>Charging:</strong> During charging, an external electrical source reverses the chemical reaction, converting lead sulphate back to lead dioxide and sponge lead, and restoring the sulfuric acid concentration in the electrolyte.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Care and Maintenance</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Electrolyte Level:</strong> Regularly check the electrolyte level and add distilled water as needed. Low electrolyte can damage the plates.</li>
              <li><strong>Clean Terminals:</strong> Keep terminals clean and free from corrosion. Use a wire brush and apply a thin layer of petroleum jelly or battery terminal protector.</li>
              <li><strong>Charge Regularly:</strong> Avoid deep discharges, as they can shorten battery life. Regularly charge the battery to maintain its capacity.</li>
              <li><strong>Avoid Extreme Temperatures:</strong> Extreme temperatures can affect battery performance and lifespan.</li>
              <li><strong>Proper Ventilation:</strong> Ensure adequate ventilation when charging to prevent the build-up of explosive hydrogen gas.</li>
              <li><strong>Specific Gravity:</strong> The specific gravity of the electrolyte can be measured to determine the state of charge.</li>
              <li><strong>Testing:</strong> Regularly test the battery's voltage and capacity to identify potential problems.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 2: NICKEL-CADMIUM (NI-CD) BATTERIES ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Nickel-Cadmium (Ni-Cd) Batteries</h2>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Construction</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Consists of positive plates made of <strong>nickel hydroxide (Ni(OH)₂)</strong> and negative plates made of <strong>cadmium (Cd)</strong>.</li>
              <li>The electrolyte is a solution of <strong>potassium hydroxide (KOH)</strong>.</li>
              <li>The plates are separated by insulators.</li>
              <li>The battery is sealed in a metal case.</li>
            </ul>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Operation</h3>
            <p><strong>Discharging:</strong> During discharge, a chemical reaction occurs where nickel hydroxide and cadmium react with potassium hydroxide, releasing electrons.</p>
            <p><strong>Charging:</strong> During charging, an external electrical source reverses the chemical reaction, restoring the original chemical composition of the plates.</p>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">Care and Maintenance</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Avoid Deep Discharges (Memory Effect):</strong> Ni-Cd batteries can develop a "memory effect" if repeatedly discharged to the same level. This reduces their capacity. Avoid partial discharges when possible. When needed, fully discharge, and then recharge the battery.</li>
              <li><strong>Charge Regularly:</strong> Regular charging is essential to maintain battery health.</li>
              <li><strong>Avoid Overcharging:</strong> Overcharging can damage the battery. Use a charger designed for Ni-Cd batteries.</li>
              <li><strong>Proper Ventilation:</strong> Ensure adequate ventilation when charging to prevent the build-up of gases.</li>
              <li><strong>Storage:</strong> Store Ni-Cd batteries in a cool, dry place.</li>
              <li><strong>Dispose of Properly:</strong> Ni-Cd batteries contain cadmium, which is a toxic heavy metal. Dispose of them according to local regulations.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 3: SAFETY PRECAUTIONS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Safety Precautions for Battery Charging, Storage, and Acids</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><BatteryCharging size={20} /> Battery Charging</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Ventilation:</strong> Batteries release hydrogen gas during charging, which is highly explosive. Charge batteries in a well-ventilated area to prevent gas build-up. Avoid enclosed spaces like closets or small rooms.</li>
              <li><strong>Proper Connections:</strong> Ensure the charger is properly connected to the battery terminals, observing correct polarity (+ to + and - to -). Incorrect connections can cause sparks, explosions, or damage to the battery or charger.</li>
              <li><strong>Charger Settings:</strong> Use a charger with appropriate voltage and current settings for the battery type (lead-acid, Ni-Cd, etc.). Overcharging can overheat and damage the battery.</li>
              <li><strong>No Smoking or Open Flames:</strong> Keep sparks, flames, and smoking materials away from batteries during charging.</li>
              <li><strong>Disconnecting:</strong> Turn off the charger before disconnecting the battery. Disconnect the negative terminal first, then the positive terminal.</li>
            </ul>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Box size={20} /> Battery Storage</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Cool, Dry Place:</strong> Store batteries in a cool, dry place to prevent corrosion and self discharge.</li>
              <li><strong>Upright Position:</strong> Store lead-acid batteries in an upright position to prevent electrolyte leakage.</li>
              <li><strong>Separate Storage:</strong> Store different battery types separately to avoid chemical reactions. Store away from flammable materials.</li>
              <li><strong>Regular Checks:</strong> Periodically check stored batteries for voltage and electrolyte levels (if applicable).</li>
              <li><strong>Neutralisation:</strong> Keep a neutralising agent, such as baking soda, nearby in case of acid spills.</li>
            </ul>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Droplets size={20} /> Acids (Electrolyte)</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Protective Gear:</strong> Wear appropriate PPE, including safety glasses, gloves, and an apron, when handling battery acid.</li>
              <li><strong>Avoid Contact:</strong> Prevent acid from contacting skin, eyes, or clothing.</li>
              <li><strong>Eye Wash and First Aid:</strong> Have an eye wash station and first aid kit readily available.</li>
              <li><strong>Dilution:</strong> Always add acid to water, never water to acid, to prevent splashing and heat generation.</li>
              <li><strong>Neutralisation:</strong> Use baking soda to neutralise acid spills.</li>
              <li><strong>Proper Disposal:</strong> Dispose of used acid and contaminated materials according to local regulations.</li>
              <li><strong>Labelling:</strong> Clearly label all containers holding acid.</li>
              <li><strong>Storage:</strong> Store acids in acid resistant containers, in a cool dry location, away from incompatible materials.</li>
            </ul>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Shield size={20} /> General Precautions</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Read Manuals:</strong> Always read and follow the manufacturer's instructions for battery charging, storage, and handling.</li>
              <li><strong>Children and Pets:</strong> Keep batteries and acids out of reach of children and pets.</li>
              <li><strong>Emergency Procedures:</strong> Be familiar with emergency procedures for acid spills or battery explosions.</li>
              <li><strong>Training:</strong> Ensure anyone working with batteries or acids has proper training.</li>
            </ul>
          </div>
        </section>

        {/* ========== SECTION 4: BATTERY-RELATED TERMS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Battery-Related Terms</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Ampere-Hour Capacity (Ah)</h3>
            <p><strong>Definition:</strong> Ampere-hour capacity is a measure of a battery's ability to deliver a specific amount of current over a period of time. It indicates how much electrical charge a battery can store.</p>
            <p><strong>Explanation:</strong> A battery with a higher Ah rating can supply more current for a longer duration than a battery with a lower Ah rating. For example, a 100Ah battery can theoretically deliver 100 amperes for one hour, or 50 amperes for two hours, and so on. However, the actual capacity can vary depending on factors like temperature, discharge rate, and battery age.</p>
            <p><strong>Formula (General Concept):</strong> <MathFormula>Ah = Current (A) × Time (h)</MathFormula></p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Reserve Capacity (RC)</h3>
            <p><strong>Definition:</strong> Reserve capacity is the amount of time (in minutes) a fully charged battery can deliver 25 amperes at 80°F (26.7°C) before its voltage drops below 10.5 volts.</p>
            <p><strong>Explanation:</strong> This rating is particularly important for automotive batteries. It indicates how long a vehicle can operate on battery power alone if the charging system fails. It essentially provides a "backup" time for essential electrical systems.</p>
            <p><strong>Formula:</strong> There isn't a simple calculation formula. Reserve capacity is determined through standardised testing.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Cold Cranking Amps (CCA)</h3>
            <p><strong>Definition:</strong> Cold cranking amps is a measure of a battery's ability to deliver a high current at low temperatures. It's the number of amperes a battery can deliver at 0°F (-17.8°C) for 30 seconds while maintaining a voltage of 7.2 volts or higher.</p>
            <p><strong>Explanation:</strong> This rating is crucial for starting a vehicle in cold weather. Cold temperatures reduce battery performance, and a high CCA rating ensures the battery can provide enough power to crank the engine.</p>
            <p><strong>Formula:</strong> Similar to reserve capacity, CCA is determined through standardised testing rather than a direct calculation.</p>
          </div>
        </section>

        {/* ========== SECTION 5: BATTERY TESTING INSTRUMENTS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Battery Testing Instruments</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Hydrometer</h3>
            <p><strong>Construction:</strong> A hydrometer consists of a glass tube with a weighted bulb at the bottom and a graduated scale inside.</p>
            <p><strong>Operating Principle:</strong> It measures the specific gravity of the battery's electrolyte. Specific gravity is the ratio of the density of the electrolyte to the density of water. The specific gravity of the electrolyte is directly related to the state of charge of a lead-acid battery.</p>
            <p><strong>Operation:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Insert the hydrometer's nozzle into the battery's cell.</li>
              <li>Draw electrolyte into the tube until the float rises freely.</li>
              <li>Read the specific gravity on the graduated scale at the liquid level.</li>
              <li>Compare the reading to the manufacturer's specifications to determine the battery's state of charge.</li>
            </ol>
            <p><strong>Interpretation:</strong> A higher specific gravity indicates a higher state of charge.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">High-Rate Discharge Tester</h3>
            <p><strong>Construction:</strong> A high-rate discharge tester consists of a heavy-duty resistor, an ammeter, and a voltmeter.</p>
            <p><strong>Operating Principle:</strong> It applies a high current load to the battery for a short period, simulating the load of starting an engine. The voltmeter measures the battery's voltage under load.</p>
            <p><strong>Operation:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Connect the tester's leads to the battery terminals, observing correct polarity.</li>
              <li>Apply the load for a specified time (e.g., 15 seconds).</li>
              <li>Observe the voltmeter reading during the test.</li>
              <li>Compare the voltage reading to the manufacturer's specifications to determine the battery's condition.</li>
            </ol>
            <p><strong>Interpretation:</strong> A significant voltage drop indicates a weak or failing battery.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Cadmium Tester</h3>
            <p><strong>Construction:</strong> A cadmium tester consists of a voltmeter and a cadmium electrode.</p>
            <p><strong>Operating Principle:</strong> It measures the voltage between the cadmium electrode and the positive and negative plates of a nickel-cadmium (Ni-Cd) battery. This allows for the individual checking of the positive and negative plates.</p>
            <p><strong>Operation:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Carefully expose the electrolyte of the Ni-Cd battery.</li>
              <li>Insert the cadmium electrode and the voltmeter probes into the electrolyte, making contact with the appropriate plates.</li>
              <li>Read the voltage measurements.</li>
              <li>Compare the readings to the manufacturer's specifications to determine the condition of the individual plates.</li>
            </ol>
            <p><strong>Interpretation:</strong> A reading outside the specified range indicates a faulty plate.</p>
          </div>
        </section>

        {/* ========== SECTION 6: BATTERY CHARGING METHODS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Battery Charging Methods</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Constant Current Charging</h3>
            <p><strong>Principle:</strong> The charger delivers a constant current to the battery, regardless of the battery's voltage.</p>
            <p><strong>Procedure:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Connect the charger to the battery, observing correct polarity.</li>
              <li>Set the charger to the desired current level.</li>
              <li>Monitor the battery's voltage and temperature during charging.</li>
              <li>Terminate charging when the battery reaches the desired voltage or when the charging current drops to a low level.</li>
            </ol>
            <p><strong>Application:</strong> Suitable for charging Ni-Cd batteries and some lead-acid batteries.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Constant Voltage Charging</h3>
            <p><strong>Principle:</strong> The charger maintains a constant voltage across the battery terminals, allowing the charging current to decrease as the battery charges.</p>
            <p><strong>Procedure:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Connect the charger to the battery, observing correct polarity.</li>
              <li>Set the charger to the desired voltage level.</li>
              <li>Monitor the charging current, which will decrease as the battery charges.</li>
              <li>Terminate charging when the charging current reaches a low level.</li>
            </ol>
            <p><strong>Application:</strong> Commonly used for charging lead-acid batteries.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Trickle Charging</h3>
            <p><strong>Principle:</strong> A low-current, constant voltage charge used to maintain a battery's state of charge during long periods of inactivity.</p>
            <p><strong>Procedure:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Connect the trickle charger to the battery, observing correct polarity.</li>
              <li>Allow the charger to maintain a low current flow to the battery.</li>
              <li>Monitor the battery periodically.</li>
            </ol>
            <p><strong>Application:</strong> Used to prevent self-discharge of stored batteries.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Pulse Charging</h3>
            <p><strong>Principle:</strong> The charger delivers short pulses of high current to the battery, followed by periods of rest.</p>
            <p><strong>Procedure:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Connect the pulse charger to the battery, observing correct polarity.</li>
              <li>Allow the charger to cycle through its pulse and rest periods.</li>
              <li>Monitor the battery's voltage and temperature.</li>
            </ol>
            <p><strong>Application:</strong> Can help to reduce sulfation in lead-acid batteries.</p>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Equalization Charging</h3>
            <p><strong>Principle:</strong> A controlled overcharge used to balance the charge between the cells of a lead-acid battery.</p>
            <p><strong>Procedure:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Connect the charger to the battery, observing correct polarity.</li>
              <li>Apply a higher-than-normal voltage for a specific period.</li>
              <li>Monitor the battery's voltage and temperature.</li>
            </ol>
            <p><strong>Application:</strong> Used periodically to maintain the health of lead-acid batteries in standby power applications.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 1 — Batteries: Lead-Acid & Nickel-Cadmium</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Lead-Acid</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ni-Cd</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Ah / RC / CCA</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Charging Methods</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Battery Technology. 🔋⚡</p>
        </footer>

      </div>
    </div>
  );
};