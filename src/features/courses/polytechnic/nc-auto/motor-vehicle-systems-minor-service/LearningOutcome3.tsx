import React from 'react';
import { Car, Wrench, Settings, Gauge, Shield, AlertTriangle, Droplet, Thermometer, Disc, Zap, Box, Circle, ArrowUpDown, Activity, Wind, Battery, Link, Lock, Unlock, Map, ChevronLeft, ChevronRight, X } from 'lucide-react';

const IMAGE_ROOT = '/images/courses/nc-auto/motor-vehicle-systems-minor-service';

const ComponentPhoto = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#161616]">
    <img src={`${IMAGE_ROOT}/${src}`} alt={alt} loading="lazy" decoding="async" className="h-52 w-full bg-slate-50 object-contain p-2 sm:h-64 dark:bg-slate-900" />
    <figcaption className="border-t border-slate-200 px-3 py-2 text-center text-xs leading-relaxed text-slate-600 dark:border-slate-700 dark:text-slate-400">{caption}</figcaption>
  </figure>
);

const SECTION_TABS = [
  ['braking-operation', 'Braking'],
  ['safety', 'Safety'],
  ['brake-wear', 'Brake Wear'],
  ['bleeding', 'Bleeding'],
  ['steering-suspension', 'Steering & Suspension'],
  ['steering-fluid', 'Steering Fluid'],
  ['faults', 'Faults'],
  ['lubrication', 'Lubrication'],
  ['wheels', 'Wheels & Tyres'],
] as const;

export const LearningOutcome3: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  React.useEffect(() => {
    const checkDarkMode = () => setIsDarkMode(document.documentElement.classList.contains("dark"));
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const containerClasses = 'min-h-screen w-full bg-slate-50 px-1 py-3 text-slate-800 dark:bg-[#111827] dark:text-slate-100 sm:px-4 sm:py-5';

  const sectionHeaderClasses = 'text-xl font-black uppercase leading-tight tracking-tight text-slate-900 dark:text-white sm:text-2xl';

  const cardClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'border-l-blue-500',
      green: 'border-l-emerald-500',
      purple: 'border-l-purple-500',
      amber: 'border-l-amber-500',
      red: 'border-l-rose-500',
      indigo: 'border-l-indigo-500' };
    const borderColor = colorMap[color] || colorMap.blue;
    return `rounded-xl border border-slate-200 border-l-4 bg-white p-4 text-sm leading-relaxed shadow-sm dark:border-slate-700 dark:bg-[#1a1a1a] sm:p-5 ${borderColor}`;
  };

  return (
    <div className={containerClasses}>
      
      {/* HEADER SECTION */}
      <header className="relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-[#31105e] via-[#4c1d95] to-[#6d28d9] shadow-lg">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,.14),transparent_32%),radial-gradient(circle_at_90%_70%,rgba(14,165,233,.18),transparent_30%)]" />
        <div className="relative grid items-center gap-5 px-5 py-7 sm:px-8 md:grid-cols-[1.35fr_.65fr] md:py-8">
          <div className="flex flex-col items-start gap-3 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
              <Disc className="w-4 h-4" />
              NC Auto Electrics · Learning Outcome 3
            </div>
            <h1 className="text-3xl font-black leading-[1.05] tracking-tight text-white sm:text-4xl lg:text-5xl">
              Braking, Steering & <span className="text-purple-200 italic">Suspension Systems</span>
            </h1>
            <p className="max-w-2xl text-sm font-medium leading-relaxed text-purple-100 sm:text-base">
              Brake operation, safe inspection, wear diagnosis, hydraulic bleeding, steering and suspension servicing, and wheel care.
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] font-bold text-white/90"><span className="rounded-full bg-white/10 px-3 py-1">9 sections</span><span className="rounded-full bg-white/10 px-3 py-1">Real components</span><span className="rounded-full bg-white/10 px-3 py-1">Service procedures</span></div>
          </div>
          <div className="hidden overflow-hidden rounded-xl border border-white/20 bg-white/10 p-2 md:block">
            <img src={`${IMAGE_ROOT}/disc-brake.jpg`} alt="Disc brake rotor and caliper" className="h-48 w-full rounded-lg object-cover" />
          </div>
        </div>
      </header>

      <nav aria-label="Lesson sections" className="sticky top-0 z-20 -mx-1 mb-5 border-y border-slate-200 bg-slate-50/95 px-1 py-2 backdrop-blur dark:border-slate-700 dark:bg-[#111827]/95 sm:mx-0 sm:rounded-xl sm:border sm:px-2">
        <div className="flex justify-start gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {SECTION_TABS.map(([id, label]) => <a key={id} href={`#${id}`} className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-purple-500 hover:bg-purple-600 hover:text-white dark:border-slate-700 dark:bg-[#1a1a1a] dark:text-slate-300">{label}</a>)}
        </div>
      </nav>

      <div className="mx-auto max-w-5xl space-y-6">
        
        {/* SECTION 1: OPERATION OF A BRAKING SYSTEM */}
        <section id="braking-operation" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <h2 className={sectionHeaderClasses}>Operation of a Braking System</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Hydraulic System (Most Common)</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>When brake pedal is pressed, it pushes piston in master cylinder.</li>
              <li>Pressurizes brake fluid in hydraulic lines.</li>
              <li>Pressurized fluid travels to wheel cylinders or calipers at each wheel.</li>
              <li>Wheel cylinders push brake shoes against drums (drum brakes), or calipers squeeze pads against rotors (disc brakes).</li>
              <li>Friction between shoes/pads and drums/rotors slows down wheels.</li>
            </ul>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Power Assist (Booster)</h3>
            <p>Most modern vehicles use a power booster (vacuum or hydraulic) to amplify force applied to brake pedal, reducing driver effort.</p>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Anti-lock Braking System (ABS)</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Prevents wheels from locking up during hard braking.</li>
              <li>Sensors monitor wheel speed; ABS control unit modulates brake pressure to prevent lock-up.</li>
              <li>Helps maintain vehicle stability and steering control during emergency braking.</li>
            </ul>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Electronic Brakeforce Distribution (EBD)</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Works in conjunction with ABS system.</li>
              <li>Distributes brake force between front and rear wheels based on vehicle load and road conditions.</li>
              <li>Helps prevent rear wheel lock-up.</li>
            </ul>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Electronic Stability Control (ESC)</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li>Uses braking system to help correct vehicle's path when it begins to skid.</li>
              <li>Sensors determine if vehicle is going in direction driver is steering; if not, system applies individual brakes to correct path.</li>
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ComponentPhoto src="disc-brake.jpg" alt="Disc brake rotor and caliper installed on a car" caption="Disc brake: the caliper clamps friction pads against both faces of the rotating rotor." />
            <ComponentPhoto src="drum-brake.jpg" alt="Drum brake with the drum removed showing shoes and springs" caption="Drum brake with the drum removed: curved shoes, return springs and wheel cylinder are visible." />
          </div>
        </section>

        {/* SECTION 2: SAFETY PROCEDURES AND PREPARATORY STEPS */}
        <section id="safety" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <h2 className={sectionHeaderClasses}>Safety Procedures & Preparatory Steps</h2>
          </div>
          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Fender Covers</h3>
            <p>Protect vehicle's paintwork from scratches and spills by placing fender covers over fenders.</p>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Follow Safety Procedures</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Wear appropriate PPE (safety glasses and gloves).</li>
              <li>Work in a well-ventilated area.</li>
              <li>Be aware of hazards of brake fluid (corrosive).</li>
              <li>For air brakes, bleed off air pressure.</li>
              <li>Never work under vehicle supported only by jack; use jack stands.</li>
            </ul>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Select Appropriate Tools and Equipment</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Gather wrenches, sockets, screwdrivers, brake spring tools, brake bleeding equipment.</li>
              <li>Ensure tools in good condition.</li>
              <li>Have proper replacement parts on hand.</li>
            </ul>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Choke Wheels</h3>
            <p>Place wheel chocks behind wheels not being worked on to prevent vehicle from rolling.</p>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Disconnect Battery</h3>
            <p>Disconnect negative terminal to prevent accidental electrical shorts, especially when working on ABS or electronic braking systems.</p>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Disconnect Pedal Connections</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Disconnect brake light switch or other electrical connections as needed.</li>
              <li>If replacing master cylinder, disconnect push rod.</li>
              <li>For mechanical parking brake, disconnect as needed.</li>
            </ul>
          </div>
        </section>

        {/* SECTION 3: IDENTIFYING WORN-OUT BRAKE COMPONENTS */}
        <section id="brake-wear" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <h2 className={sectionHeaderClasses}>Identifying Worn-Out Brake Components</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Pads (Disc Brakes)</h3>
            <p><strong>Visual:</strong> Reduced thickness (check wear indicators or measure), uneven wear (caliper/rotor problems), cracks/damage, scoring.</p>
            <p><strong>Aural/Feel:</strong> Squealing or grinding noises, vibration or pulsation (warped rotors or uneven wear).</p>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Drum (Drum Brakes)</h3>
            <p><strong>Visual:</strong> Scoring/grooving, cracks/damage, out-of-roundness, excessive rust.</p>
            <p><strong>Aural/Feel:</strong> Grinding/scraping noises, pulsation/vibration, poor parking brake holding ability.</p>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Shoes (Drum Brakes)</h3>
            <p><strong>Visual:</strong> Reduced lining thickness, uneven wear, cracks/damage, glazing of friction material.</p>
            <p><strong>Aural/Feel:</strong> Grinding/scraping noises, poor parking brake holding ability.</p>
          </div>
        </section>

        {/* SECTION 4: BLEEDING BRAKES */}
        <section id="bleeding" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <h2 className={sectionHeaderClasses}>Adjusting Brakes According to Specification & Bleeding Brakes</h2>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Procedure for Bleeding Brakes</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              <li><strong>Prepare:</strong> Ensure master cylinder full of fresh fluid. Gather wrench, clear tubing, container, fluid.</li>
              <li><strong>Start at farthest wheel:</strong> Usually right rear.</li>
              <li><strong>Attach bleeder hose:</strong> To bleeder screw, other end in container partially filled with fluid.</li>
              <li><strong>Pump and hold:</strong> Assistant pumps pedal several times and holds down.</li>
              <li><strong>Open bleeder screw:</strong> While pedal held, open screw; air/fluid flows out.</li>
              <li><strong>Close bleeder screw:</strong> Before pedal reaches floor.</li>
              <li><strong>Release pedal:</strong> Assistant slowly releases brake pedal.</li>
              <li><strong>Repeat until no air bubbles visible.</strong></li>
              <li><strong>Check fluid level regularly and top off.</strong></li>
              <li><strong>Move to next wheel:</strong> Left rear, right front, left front.</li>
              <li><strong>Final check:</strong> Test pedal firmness, top up fluid, test drive safely.</li>
            </ol>
            <p className="mt-3 text-amber-600 dark:text-amber-400"><strong>Note:</strong> Some ABS systems require special scan tools to bleed properly.</p>
          </div>
        </section>

        {/* SECTION 5: MAJOR STEERING & SUSPENSION COMPONENTS */}
        <section id="steering-suspension" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <h2 className={sectionHeaderClasses}>Major Steering & Suspension Components</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Steering Box (or Steering Rack)</h3>
            <p><strong>Visual:</strong> Steering box – metal housing on older/heavy vehicles near front frame. Steering rack – long horizontal metal component in modern vehicles behind engine or front axle.</p>
            <p><strong>Function:</strong> Converts rotational motion of steering wheel into linear motion to turn wheels.</p>
            <p><strong>Types:</strong> Recirculating ball steering box; rack and pinion steering rack.</p>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Steering Pump (Power Steering Pump)</h3>
            <p><strong>Visual:</strong> Small belt-driven pump mounted on engine with hoses connected.</p>
            <p><strong>Function:</strong> Provides hydraulic pressure to assist steering.</p>
            <p><strong>Components:</strong> Reservoir for fluid, pump mechanism, pressure hoses.</p>
          </div>
          <div className={cardClasses('purple')}>
            <h3 className="text-xl font-bold mb-2">Dampers (Shock Absorbers or Struts)</h3>
            <p><strong>Visual:</strong> Cylindrical components near each wheel connecting frame/body to suspension.</p>
            <p><strong>Function:</strong> Control suspension movement, absorb shocks/vibrations for smooth ride and tire contact.</p>
            <p><strong>Types:</strong> Shock absorbers (separate from spring); struts (integrated with spring).</p>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Wheel Assembly</h3>
            <p><strong>Components:</strong> Wheel (rim), tire, valve stem, wheel hub, wheel bearings, wheel studs/bolts.</p>
            <p><strong>Function:</strong> Supports vehicle and enables movement.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ComponentPhoto src="steering-system.jpg" alt="Vehicle rack-and-pinion steering system with numbered components" caption="Rack-and-pinion steering layout: steering wheel and column rotate the pinion, moving the rack and tie rods sideways." />
            <ComponentPhoto src="macpherson-suspension.jpg" alt="MacPherson-strut front suspension with radius rod and anti-roll bar" caption="MacPherson-strut front suspension showing the strut, lower arm, radius rod and anti-roll bar connections." />
          </div>
        </section>

        {/* SECTION 6: CHANGING POWER STEERING FLUID */}
        <section id="steering-fluid" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <h2 className={sectionHeaderClasses}>Changing Power Steering Fluid</h2>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Tools & Materials</h3>
            <ul className="list-disc pl-5"><li>New power steering fluid (correct type)</li><li>Turkey baster or syringe</li><li>Wrenches/sockets</li><li>Drain pan</li><li>Rags</li><li>Jack & jack stands (optional)</li></ul>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Procedure</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Park on level surface, engage parking brake. Raise front if needed.</li>
              <li>Locate power steering reservoir (marked "Power Steering").</li>
              <li>Remove old fluid with baster/syringe. Dispose properly.</li>
              <li>Refill with fresh fluid to "MAX" line.</li>
              <li>Start engine, idle, slowly turn steering lock to lock several times.</li>
              <li>Turn off engine, recheck fluid level, top up.</li>
              <li>Inspect for leaks.</li>
              <li>Optional: repeat for more thorough change (some vehicles have drain plug on rack).</li>
            </ol>
          </div>
        </section>

        {/* SECTION 7: COMMON FAULTS IN STEERING & SUSPENSION */}
        <section id="faults" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <h2 className={sectionHeaderClasses}>Common Faults in Steering & Suspension</h2>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Steering Faults</h3>
            <ul className="list-disc pl-5"><li>Power steering fluid leaks → hard steering, noise, pump damage.</li><li>Worn tie rods → loose steering, wandering, tire wear.</li><li>Worn ball joints → clunking, loose steering, tire wear.</li><li>Steering rack/box problems → hard steering, noise, play.</li><li>Power steering pump failure → hard steering or no assist.</li><li>Misalignment → uneven tire wear, pulling.</li><li>Uneven tire pressure → pulling.</li><li>Worn U-joints in steering shaft → play in wheel.</li></ul>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Suspension Faults</h3>
            <ul className="list-disc pl-5"><li>Worn shocks/struts → bouncy ride, poor handling, tire wear.</li><li>Worn springs → sagging ride height, poor handling.</li><li>Worn control arm bushings → clunking, loose handling, tire wear.</li><li>Worn sway bar links/bushings → clunking, poor handling in turns.</li><li>Worn wheel bearings → rumbling/grinding, wheel play.</li><li>Broken springs → sagging, rough ride.</li><li>Air suspension problems → leaks, compressor failures, sensor issues.</li><li>Leaking damper seals → poor ride quality.</li></ul>
          </div>
        </section>

        {/* SECTION 8: LUBRICATION REQUIREMENTS OF SUSPENSION SYSTEM */}
        <section id="lubrication" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <h2 className={sectionHeaderClasses}>Lubrication Requirements of the Suspension System</h2>
          </div>
          <div className={cardClasses('indigo')}>
            <h3 className="text-xl font-bold mb-2">General Principles</h3>
            <ul className="list-disc pl-5"><li>Many modern vehicles use sealed pre‑lubricated components.</li><li>Older/heavy‑duty vehicles may have grease fittings (zerks).</li><li>Use correct grease (lithium‑based common).</li><li>Avoid over‑greasing to prevent seal damage.</li></ul>
          </div>
          <div className={cardClasses('blue')}>
            <h3 className="text-xl font-bold mb-2">Ball Joints</h3>
            <p><strong>Function:</strong> Connect control arms to steering knuckles, allow multi‑direction movement.</p>
            <p><strong>Lubrication:</strong> If grease fitting, apply grease until old grease purged. Rotate steering wheel while greasing. Inspect dust boots. Sealed units require replacement when play or boot damage.</p>
            <p><strong>Signs of need:</strong> Clunking during turns, loose steering, uneven tire wear.</p>
          </div>
          <div className={cardClasses('green')}>
            <h3 className="text-xl font-bold mb-2">Tie-Rod Ends</h3>
            <p><strong>Function:</strong> Connect steering rack/box to steering knuckles, transmit steering input.</p>
            <p><strong>Lubrication:</strong> May have grease fittings; apply grease, purge old, inspect boots. Sealed units require replacement when play or boot damage.</p>
            <p><strong>Signs:</strong> Loose steering, wandering, uneven tire wear, clunking.</p>
          </div>
        </section>

        {/* SECTION 9: WHEEL AND TIRE SERVICES */}
        <section id="wheels" className="scroll-mt-24 space-y-4">
          <div className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
            <h2 className={sectionHeaderClasses}>Wheel and Tire Services</h2>
          </div>
          <div className={cardClasses('amber')}>
            <h3 className="text-xl font-bold mb-2">Wheel Assembly Components & Common Faults</h3>
            <p><strong>Components:</strong> Wheel (rim), tire, valve stem, wheel hub, wheel bearings, wheel studs/bolts.</p>
            <p><strong>Tire faults:</strong> Punctures, uneven wear, bulges, low pressure, overinflation, worn tread.</p>
            <p><strong>Wheel faults:</strong> Bent/damaged rims, loose nuts/bolts, damaged valve stems, worn bearings, imbalance.</p>
          </div>
          <div className={cardClasses('red')}>
            <h3 className="text-xl font-bold mb-2">Removal and Replacement of the Wheel Assembly</h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li><strong>Safety first:</strong> Park level, parking brake, wheel chocks.</li>
              <li><strong>Loosen lug nuts/bolts</strong> before jacking.</li>
              <li><strong>Jack up vehicle</strong> at proper point, place jack stand.</li>
              <li><strong>Remove wheel:</strong> Take off lug nuts, remove assembly.</li>
              <li><strong>Inspect</strong> hub, bearings, brakes, tire damage.</li>
              <li><strong>Install replacement wheel</strong> (if applicable), hand‑tighten nuts in star pattern.</li>
              <li><strong>Lower vehicle</strong>, remove jack stand, lower completely.</li>
              <li><strong>Tighten lug nuts/bolts</strong> with torque wrench in star pattern to spec.</li>
              <li><strong>Final check:</strong> Ensure tightness, remove chocks, test drive safely.</li>
            </ol>
          </div>
        </section>

        {/* FOOTER */}
        <footer className=" dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 pt-10 text-center space-y-4 pb-20">
          <p className="text-gray-400 font-black uppercase tracking-[0.4em] text-xs">End of Learning Outcome 3 — Braking, Steering & Suspension</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Brake System</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">ABS/EBD/ESC</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Steering & Suspension</span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[10px] font-bold text-gray-500 uppercase tracking-widest">Wheel Services</span>
          </div>
          <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">Study Hard. Master Every System. 🔧🚗</p>
        </footer>

      </div>
    </div>
  );
};
