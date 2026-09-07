import React from 'react';
import { 
  Zap, Battery,  Cpu, Box, Radio, 
  Wrench, Settings, Gauge, Shield, Map, 
  ChevronLeft, ChevronRight, X, Activity,
  Thermometer, Droplet, Sun, Moon, Wind,
  TrendingUp, TrendingDown, AlertTriangle,
  Code, Table, BookOpen, Target, Heart,
  Sigma, Divide, Plus, Minus, Car, Cog,
  Volume2, Eye, Hand, Monitor, MapPin, Navigation2,
  Bell, Lightbulb, Vibrate, MessageSquare
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
              <Bell className="w-4 h-4" />
              Automotive Electronics: Module LO2
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Warning Devices, Displays & <span className="text-sky-300 font-bold italic">Driver Information Systems</span>
            </h1>
            <p className="text-xl sm:text-2xl font-medium text-indigo-100 max-w-2xl leading-relaxed">
              Complete guide to audible, visual, tactile, textual warnings, sender units, electronic displays (LED, LCD, CRT, VFD, DC EL), and driver information systems (monitoring, trip computer, GPS).
            </p>
          </div>
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative group w-full max-w-lg">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-600 rounded-[5px] blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#1e1e2e] rounded-[5px] shadow-2xl border border-white/10 overflow-hidden transform group-hover:scale-[1.02] transition-transform duration-500 text-left">
                <div className="bg-[#181825] px-4 py-3 flex items-center gap-2 border-b border-white/5">
                  <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-[#ff7400]/100"></div><div className="w-3 h-3 rounded-full bg-yellow-500"></div><div className="w-3 h-3 rounded-full bg-green-500"></div></div>
                  <div className="ml-4 px-3 py-1 rounded-[5px] bg-[#313244] text-[10px] text-gray-400 flex items-center gap-2 lowercase">warning_displays.md</div>
                </div>
                <div className="p-6 font-mono text-sm space-y-4">
                  <div className="flex gap-4"><span className="text-gray-600 select-none">1</span><span className="text-emerald-400 font-bold">IMPORT</span><span className="text-white">Warning_Devices;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">2</span><span className="text-cyan-400 font-bold">ANALYZE</span><span className="text-white">Display_Tech;</span></div>
                  <div className="flex gap-4"><span className="text-gray-600 select-none">3</span><span className="text-emerald-400 font-bold">CONFIGURE</span><span className="text-white">GPS_Navigation;</span></div>
                  <div className="flex gap-4 mt-4"><span className="text-gray-600 select-none">4</span><div className="w-2 h-5 bg-blue-500 animate-[bounce_1s_infinite]"></div></div>
                </div>
              </div>
              <div className="absolute -top-10 -right-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce duration-[3000ms]"><MapPin className="w-8 h-8 text-emerald-400" /></div>
              <div className="absolute -bottom-8 -left-6 bg-white/10 backdrop-blur-md p-4 rounded-[5px] border border-white/20 shadow-xl animate-bounce delay-1000 duration-[4000ms]"><Monitor className="w-8 h-8 text-cyan-400" /></div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-none space-y-20">
        
        {/* ========== SECTION 1: WARNING DEVICES ========== */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Warning Devices</h2>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Volume2 size={20} /> Audible Warning Devices (Sirens, Alarms, Buzzers)</h3>
            <p><strong>What they are:</strong> Devices that produce sound to attract attention.</p>
            <p><strong>How they work:</strong> Use an electrical signal to vibrate a diaphragm, or produce an oscillating sound wave. The frequency (pitch) and amplitude (loudness) can be varied to create different types of alerts (e.g., different sound for fire vs. security).</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Eye size={20} /> Visual Warning Devices (Lights, Flashing Beacons)</h3>
            <p><strong>What they are:</strong> Devices that use light to provide visual alerts.</p>
            <p><strong>How they work:</strong> Use light sources such as LEDs or incandescent bulbs. Often include flashing mechanisms to increase visibility. The color of the light is usually standardized to indicate a specific type of warning (e.g., red = danger).</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><Hand size={20} /> Tactile Warning Devices (Vibrators)</h3>
            <p><strong>What they are:</strong> Devices that produce a physical vibration as a warning.</p>
            <p><strong>How they work:</strong> Use small motors with unbalanced weights to create vibration. Particularly useful for people with hearing impairments, or in noisy environments where sound alarms may not be noticed.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MessageSquare size={20} /> Textual/Graphical Warning Devices (Displays, Screens)</h3>
            <p><strong>What they are:</strong> Devices that provide written or visual information.</p>
            <p><strong>How they work:</strong> Use displays such as LCD screens or indicator panels. Present messages, symbols, or icons. Common in control systems and complex machinery.</p>
          </div>
        </section>

        {/* ========== SECTION 2: SENDER UNITS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Sender Units — Overview</h2>
          </div>
          <div className={cardClasses('indigo')}>
            <p><strong>What they do:</strong> Detect abnormal conditions and trigger the appropriate warning device.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Sensor-Based Sender Units</h3>
            <p><strong>What they are:</strong> Units that use sensors to detect changes in physical parameters.</p>
            <p><strong>Common types:</strong></p>
            <ul className="list-disc pl-5">
              <li>Temperature sensors — detect changes, trigger alarms if threshold exceeded.</li>
              <li>Pressure sensors — monitor pressure levels, trigger alarms if too high or low.</li>
              <li>Smoke detectors — detect smoke particles, trigger fire alarms.</li>
              <li>Motion sensors — detect movement, trigger security alarms.</li>
              <li>Fluid level sensors — detect high/low fluid levels in tanks.</li>
            </ul>
            <p><strong>How they work:</strong> The sensor converts the physical parameter into an electrical signal. The sender unit processes the signal; if abnormal, it activates the warning device.</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Manual Sender Units</h3>
            <p><strong>What they are:</strong> Units activated manually by a person.</p>
            <p><strong>Common types:</strong> Emergency stop buttons, fire alarm pull stations, panic buttons.</p>
            <p><strong>How they work:</strong> When activated, opens or closes an electrical circuit, triggering the warning device.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Control System Sender Units</h3>
            <p><strong>What they are:</strong> Sender units integrated into larger control systems.</p>
            <p><strong>How they work:</strong> Monitor various parameters continuously; trigger warnings based on programmed logic. Common in industrial automation and building management systems.</p>
            <p><strong>Example:</strong> A PLC (Programmable Logic Controller) monitors multiple sensor inputs; if a certain combination occurs, it activates a warning light and a siren.</p>
          </div>
        </section>

        {/* ========== SECTION 3: ELECTRONIC DISPLAYS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Electronic Displays — Construction and Operation</h2>
          </div>

          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">LED (Light-Emitting Diode)</h3>
            <p><strong>Construction:</strong> A semiconductor diode that emits light when current flows. Consists of a p-n junction (e.g., gallium arsenide phosphide). When forward-biased, electrons and holes recombine, releasing energy as photons. Color depends on semiconductor material.</p>
            <p><strong>Operation:</strong> When voltage applied, electrons move from n-type to p-type, holes opposite. Recombination releases light. Intensity proportional to current.</p>
            <p><strong>Advantages:</strong> Energy-efficient, long lifespan, many colors available.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Cathode Ray Tube (CRT)</h3>
            <p><strong>Construction:</strong> Vacuum tube with electron gun and phosphor-coated screen. Electromagnetic fields steer the electron beam.</p>
            <p><strong>Operation:</strong> Electron gun fires beam toward screen; deflection coils control direction to scan across screen. Beam intensity determines brightness. (Widely used in older TVs/monitors, now largely replaced.)</p>
          </div>

          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">LCD (Liquid Crystal Display)</h3>
            <p><strong>Construction:</strong> Liquid crystal material sandwiched between two glass plates with polarizing filters and electrodes. Backlight often used.</p>
            <p><strong>Operation:</strong> When electric field applied, liquid crystal molecules align, changing polarization of light. By controlling the field, individual pixels turn on/off, creating images. Used in laptops, smartphones, TVs, etc.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Vacuum Fluorescent Display (VFD)</h3>
            <p><strong>Construction:</strong> Vacuum tube with cathode, grid, and anode (phosphor-coated).</p>
            <p><strong>Operation:</strong> Cathode emits electrons; grid controls them; electrons strike phosphor-coated anode, causing it to glow. Bright, wide viewing angle; common in car stereos and industrial displays.</p>
          </div>

          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">DC EL (Direct Current Electroluminescent) Display</h3>
            <p><strong>Construction:</strong> Phosphor layer sandwiched between two electrodes, often with a dielectric layer.</p>
            <p><strong>Operation:</strong> When DC voltage applied, phosphor emits light via electroluminescence. Thin profile, uniform emission. Less common than other technologies.</p>
          </div>
        </section>

        {/* ========== SECTION 4: DRIVER INFORMATION SYSTEMS ========== */}
        <section className="space-y-8 pt-12">
          <div className="flex items-center gap-4 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pl-6">
            <h2 className={sectionHeaderClasses}>Driver Information Systems</h2>
          </div>

          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">Vehicle Condition Monitoring</h3>
            <p><strong>Operation:</strong> Monitors vehicle parameters to ensure optimal performance and prevent problems. Sensors collect data on engine temperature, oil pressure/level, tire pressure, battery voltage, fluid levels, brake pad wear. Central control unit processes data; warnings displayed on instrument cluster (visual/audible). Modern systems provide diagnostics and maintenance reminders.</p>
            <p><strong>Purpose:</strong> Alert driver to potential problems before they become serious; optimize performance and fuel efficiency; enhance safety.</p>
          </div>

          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Trip Computer</h3>
            <p><strong>Operation:</strong> Calculates and displays trip-related data using vehicle sensors (speed, fuel level, engine load). Calculates: average/instantaneous fuel consumption, distance traveled, time elapsed, average speed, range (distance to empty). Data shown on instrument cluster; resets via button or automatically.</p>
            <p><strong>Purpose:</strong> Give drivers real-time information about driving habits and fuel efficiency; help plan trips and manage fuel consumption.</p>
          </div>

          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2"><MapPin size={20} /> 3. Global Positioning System (GPS)</h3>
            <p><strong>Operation:</strong> Uses satellite network to determine precise location. GPS receiver calculates latitude, longitude, altitude from signal time-of-flight. Used for navigation (turn-by-turn), location tracking, mapping. Modern systems combine with mapping software and real-time traffic data.</p>
            <p><strong>Purpose:</strong> Provide accurate navigation; enhance safety and security; provide location-based services.</p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 2 — Warning Devices, Displays & Driver Information Systems</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Warning Devices</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Sender Units</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">LED/LCD/CRT/VFD</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">GPS & Trip Computer</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Warning & Info Systems. 🔔📟</p>
        </footer>

      </div>
    </div>
  );
};