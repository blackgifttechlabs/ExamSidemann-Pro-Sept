import React from 'react';
const imageRoot = '/images/courses/o-level/combined-science/form-4/';
function Image({ name, alt }: { name: string; alt: string }) { return <figure className="my-5"><img src={`${imageRoot}phys-force-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="mx-auto block h-auto w-full rounded-2xl border border-slate-200 bg-white object-contain" style={{ maxHeight: 'min(60svh, 600px)' }} /><figcaption className="mt-2 text-sm leading-relaxed text-slate-600">{alt}</figcaption></figure>; }
function Card({ n, title, children }: { n: number; title: string; children: React.ReactNode }) { return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-800">{n}</span><h3 className="text-xl font-bold text-slate-900">{title}</h3></div><div className="space-y-4 text-base leading-relaxed text-slate-700">{children}</div></section>; }
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) { return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className="border border-slate-200 p-3 font-bold text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((r,i) => <tr key={i}>{r.map((v,j) => <td key={j} className="border border-slate-200 p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>; }
function Formula({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-sky-50 p-3 font-semibold text-sky-950">{children}</p>; }
function Resources({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Resources:</strong> {children}</p>; }
export default function Force() { return <div className="not-prose space-y-6">
  <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-slate-800 sm:p-6"><p>A force is a push or pull. In this lesson, you will investigate how forces change motion and shape, find the effect of forces acting together, and explain how machines, pressure and pumps work.</p><p className="mt-3">Start with each image, follow the worked examples, then carry out the teacher-led activities. The document asks learners to illustrate the operation of a Blair pump and a bicycle pump. The other images are teaching aids.</p></div>
  <Card n={1} title="Effects and Types of Force">
    <p><strong>Learning objectives:</strong> demonstrate effects on position, shape and size; identify force types, the SI unit and measuring instruments.</p>
    <Image name="effects" alt="A spring stretches, foam changes shape and a trolley or ball changes motion under a force. Force meters and spring balances measure force in newtons." />
    <p>A force can deform a solid, change its position, change its speed or change its direction. Measure force with a <strong>force meter or spring balance</strong>; its SI unit is the <strong>newton (N)</strong>. Check zero and read the scale straight on.</p>
    <Table headers={['Force type from the document', 'Meaning / example']} rows={[
      ['Gravitational force', 'Attraction between masses; Earth attracts objects towards it.'], ['Weight', 'The gravitational force acting on an object.'], ['Mechanical force', 'A push or pull, such as a hand pushing a trolley or a stretched spring pulling.'], ['Electrostatic force', 'Attraction or repulsion between electric charges.'], ['Magnetic force', 'Attraction or repulsion involving magnets, or attraction of suitable magnetic materials.'], ['Friction', 'Opposes relative motion or the tendency to slide between surfaces.'],
    ]} />
    <p><strong>Activities:</strong> stretch springs and rubber bands, squash foam rubber, and push or pull trolleys. Investigate gravitational, electrostatic and magnetic forces and friction. Measure forces using a force meter or spring balance.</p>
    <Resources>foam rubber, springs, trolleys, rubber bands, magnets, rulers, bricks, masses, force meter and spring balance.</Resources>
  </Card>
  <Card n={2} title="Resultant Force and Moments">
    <p><strong>Learning objectives:</strong> calculate the resultant of two inline forces; define and calculate a moment; state and apply the principle of moments.</p>
    <Image name="resultant" alt="Forces in the same direction add: 5 N + 3 N = 8 N. Opposing 7 N and 4 N forces give a 3 N resultant in the direction of the larger force." />
    <p>The <strong>resultant force</strong> is the single force that has the same overall effect as the forces acting together. For inline forces, add those acting in the same direction; subtract opposing forces and give the direction.</p>
    <Formula>Same direction: 5 N + 3 N = 8 N to the right.<br />Opposite directions: 7 N right − 4 N left = 3 N to the right.</Formula>
    <p><strong>Balanced forces</strong> have zero resultant: an object can remain at rest or move at constant velocity. <strong>Unbalanced forces</strong> have a non-zero resultant and change its velocity.</p>
    <Image name="moments" alt="A balanced rule has 4 N acting 0.30 m to the left of its pivot and 6 N acting 0.20 m to the right; both moments are 1.2 N m." />
    <p>A <strong>moment</strong> is the turning effect of a force about a pivot. Use the perpendicular distance from the pivot to the force’s line of action.</p>
    <Formula>Moment = force × perpendicular distance from pivot<br />Unit: newton metre (N m)</Formula>
    <p><strong>Principle of moments:</strong> for rotational equilibrium, total clockwise moments equal total anticlockwise moments. For a balanced object, the resultant force must also be zero.</p>
    <Formula>Left: 4 × 0.30 = 1.2 N m anticlockwise.<br />Right: 6 × 0.20 = 1.2 N m clockwise.<br />For the unknown right-hand force: F × 0.20 = 1.2, so F = 6 N.</Formula>
    <p><strong>Activities:</strong> demonstrate equal and unequal forces with force meters; balance a metre rule on a pivot, add masses and measure distances to apply the principle of moments.</p>
    <Resources>regular and irregular objects, liquids, force meters, levers, masses, balance and metre rule.</Resources>
  </Card>
  <Card n={3} title="Friction">
    <p><strong>Learning objectives:</strong> define and measure friction; state its applications.</p>
    <Image name="friction" alt="A block is pulled along a surface with a spring balance. Friction acts opposite its motion; braking systems, tyre treads and shoe soles use friction." />
    <p><strong>Friction</strong> opposes relative motion, or the tendency for motion, between touching surfaces. Its size depends on the nature of the surfaces and the force pressing them together.</p>
    <p>Pull a block horizontally with a spring balance. Record the force just before it starts moving, then the reading while it moves at a steady speed. At steady speed, the horizontal pull balances sliding friction.</p>
    <p><strong>Applications:</strong> car brakes slow a vehicle through friction; tyre treads, shoe soles and road surfaces help provide grip. Compare different surfaces while keeping the same block and load.</p>
    <p><strong>Activity:</strong> investigate friction using a spring balance and compare the readings for different surface conditions.</p>
    <Resources>spring balance.</Resources>
  </Card>
  <Card n={4} title="Simple Machines: Levers (Form 2)">
    <p><strong>Learning objectives:</strong> define a machine and construct a simple machine.</p>
    <Image name="levers" alt="Lever arrangements show the positions of effort, pivot and load: first class has the pivot in the middle, second class the load, and third class the effort." />
    <p>A <strong>machine</strong> makes a task easier by changing the size or direction of a force. A <strong>lever</strong> is a rigid bar that turns around a pivot. The applied force is the effort; the force being overcome is the load.</p>
    <Table headers={['Lever arrangement', 'Part between the other two', 'Example']} rows={[
      ['First class', 'Pivot', 'Crowbar used with a fulcrum; scissors.'], ['Second class', 'Load', 'Wheelbarrow.'], ['Third class', 'Effort', 'Forearm lifting a load.'],
    ]} />
    <p><strong>Activities:</strong> lift a suitable load with a crowbar using a secure pivot. Construct a simple lever from a plank, support and masses, then compare effort positions.</p>
    <Resources>crowbar, planks and masses.</Resources>
  </Card>
  <Card n={5} title="Weight, Mass and Newton’s Laws (Form 3)">
    <p><strong>Learning objectives:</strong> define weight, momentum and inertia; distinguish weight from mass; state Newton’s laws for linear motion; calculate force from mass and acceleration; state applications.</p>
    <Table headers={['Term', 'Meaning', 'Unit / relation']} rows={[
      ['Mass', 'Amount of matter, and a measure of resistance to acceleration.', 'kilogram (kg)'], ['Weight', 'Gravitational force acting on a mass; it depends on gravitational field strength.', 'newton (N); W = mg'], ['Momentum', 'Mass multiplied by velocity; it has the direction of the velocity.', 'kg m/s; p = mv'], ['Inertia', 'An object’s resistance to a change in its velocity.', 'Greater mass means greater inertia.'],
    ]} />
    <Table headers={['Law', 'Statement for linear motion', 'Application']} rows={[
      ['First law', 'An object remains at rest or at constant velocity unless a resultant force acts.', 'A passenger continues moving forwards when a vehicle brakes; a seat belt provides a stopping force.'],
      ['Second law', 'Resultant force equals mass × acceleration: F = ma.', 'For a fixed mass, a larger resultant force produces greater acceleration.'],
      ['Third law', 'When two objects interact, they exert equal and opposite forces on one another.', 'A foot pushes the ground backwards; the ground pushes the person forwards. The forces act on different objects.'],
    ]} />
    <Formula>F = ma = 2 kg × 3 m/s² = 6 N.<br />Using g = 10 N/kg: weight of 2 kg = 2 × 10 = 20 N.<br />Momentum of 2 kg moving at 3 m/s = 6 kg m/s.</Formula>
    <p>Use the value of g given in the question. The equal and opposite forces in the third law act on different objects, so they do not cancel as forces on one object.</p>
    <p><strong>Activities:</strong> define weight, momentum and inertia; discuss Newton’s laws for linear motion; verify the second law with a trolley and ticker timer by investigating acceleration while changing force or mass.</p>
    <Resources>spring balances, trolleys and ticker timer.</Resources>
  </Card>
  <Card n={6} title="Machines: Uses, Advantage and Efficiency (Form 3)">
    <p><strong>Learning objectives:</strong> describe machine uses; determine MA, VR and efficiency for levers, inclined planes, pulleys and gears; explain losses and ways to improve efficiency.</p>
    <Image name="machines" alt="A pulley system lifts a load, an inclined plane raises a load along a ramp, and meshing gears change rotational speed and direction." />
    <Table headers={['Machine', 'Use / application']} rows={[
      ['Lever', 'Crowbars lift loads; wheelbarrows carry loads; scissors cut.'], ['Pulley system', 'Lifting loads and changing the direction of the effort.'], ['Inclined plane', 'Raising a load gradually along a ramp.'], ['Gears', 'Transmitting rotation and changing speed or turning effect.'],
    ]} />
    <Formula>Mechanical advantage (MA) = load force ÷ effort force.<br />Velocity ratio (VR) = distance moved by effort ÷ distance moved by load.<br />Efficiency = useful output work ÷ input work × 100% = MA ÷ VR × 100%.</Formula>
    <p>Use forces for both load and effort. MA and VR have no units. For a lever, VR is effort-arm length divided by load-arm length. For an ideal simple pulley system, count the supporting rope segments; for a ramp, compare distance along the ramp with vertical height. For meshing gears, VR = input turns ÷ output turns = driven-gear teeth ÷ driver-gear teeth. For this rotational case, MA is output turning moment ÷ input turning moment.</p>
    <p><strong>Gear example:</strong> a 10-tooth driver turning a 20-tooth driven gear has VR = 20 ÷ 10 = 2. The driver makes two turns for one output turn; without losses, the output turning moment is twice the input turning moment.</p>
    <Formula>Example: load 80 N, effort 50 N and VR = 2.<br />MA = 80 ÷ 50 = 1.6; efficiency = 1.6 ÷ 2 × 100% = 80%.</Formula>
    <p><strong>Energy losses:</strong> friction transfers energy to heating; energy is also used to move machine parts. Lubrication, suitable bearings and reducing unnecessary moving mass can improve efficiency. Real machines do not create energy.</p>
    <p><strong>Activities:</strong> lift different loads with the machines; measure load, effort and their movement distances to calculate MA, VR and efficiency. Investigate lubrication, bearings and mass reduction.</p>
    <Resources>crowbar, wheelbarrow, scissors, pulleys, inclined plane, gears and bearings.</Resources>
  </Card>
  <Card n={7} title="Pressure (Form 4)">
    <p><strong>Learning objectives:</strong> define and calculate pressure and fluid pressure; explain depth effects and atmospheric pressure; describe, construct and use a simple manometer.</p>
    <p><strong>Pressure</strong> is the force acting normally on a surface per unit area. For the same force, a smaller contact area gives greater pressure.</p>
    <Formula>P = F/A; pressure unit = N/m² = pascal (Pa).<br />Example: 100 N ÷ 0.020 m² = 5000 Pa.</Formula>
    <Image name="pressure" alt="Greater water depth produces greater pressure; a dam wall is made thicker at its base to withstand the larger pressure." />
    <Formula>Pressure due to a liquid column: P = ρgh.<br />ρ = liquid density (kg/m³); g = gravitational field strength; h = depth (m).<br />Example: 1000 × 10 × 0.20 = 2000 Pa.</Formula>
    <p>The symbol <strong>ρ (rho)</strong> represents density. This formula gives pressure due to the liquid above the point. Pressure increases with depth and acts in all directions in a stationary fluid.</p>
    <p><strong>Atmospheric pressure</strong> is the pressure exerted by air. Air pressure acts on exposed surfaces, and differences in pressure can drive motion. A water barometer demonstrates support of a liquid column by atmospheric pressure.</p>
    <Image name="manometer" alt="An open-ended U-tube manometer has a lower level on the higher-pressure gas side and a higher level on the atmospheric side. The vertical difference is h." />
    <p>A <strong>simple manometer</strong> is a U-shaped tube containing liquid, such as water or oil. Connect one end to the gas and leave the other open to the atmosphere. Compare the liquid levels; greater gas pressure pushes its side down. Measure the <strong>vertical</strong> difference h.</p>
    <Formula>Pressure difference = ρgh.<br />If the gas-side level is lower: gas pressure = atmospheric pressure + ρgh.</Formula>
    <p><strong>Activities:</strong> determine the pressure of solids with different contact areas; demonstrate depth effects with a container having holes at different depths and discuss dam walls; demonstrate atmospheric pressure; construct and use a simple manometer.</p>
    <Resources>solid objects of different cross-sectional area, container with holes at different depths, water barometer, oil and water.</Resources>
  </Card>
  <Card n={8} title="Fluid Systems and Pumps (Form 4)">
    <p><strong>Learning objectives:</strong> explain the function and operation of simple fluid systems; describe the structures, functions and operations of simple pumps.</p>
    <Image name="fluid-systems" alt="A filled siphon carries liquid to an outlet below the source surface; a hydraulic system transfers pressure through liquid from a small piston to a larger piston." />
    <p><strong>Siphon:</strong> fill the tube with liquid, keep its inlet submerged and place its outlet below the source liquid surface. A continuous liquid column then flows to the lower outlet while the conditions are maintained. Use a teacher-approved priming method.</p>
    <p><strong>Hydraulic systems:</strong> pressure applied to an enclosed liquid is transmitted throughout it. A small piston can provide a larger force at a larger piston, which moves a shorter distance. Examples are a hydraulic jack and a car braking system.</p>
    <Formula>F₁/A₁ = F₂/A₂.<br />Example: 50 N on 0.002 m² gives 25 000 Pa.<br />On a 0.020 m² piston, force = 25 000 × 0.020 = 500 N.</Formula>
    <h4 className="text-lg font-bold text-slate-900">Blair pump</h4>
    <Image name="blair-pump" alt="A simplified Blair pump cutaway shows the foot valve opening and piston valve closing on the upstroke; their states reverse on the downstroke as water passes through the piston valve." />
    <p>The <strong>Blair pump</strong> is a hand-operated water pump. In the simplified hollow-pushrod teaching model, a moving piston valve and a fixed foot valve control one-way flow.</p>
    <Table headers={['Stroke', 'Valve states', 'Operation']} rows={[
      ['Upstroke', 'Piston valve closed; foot valve open.', 'The piston rises. Water enters the chamber below it through the foot valve.'],
      ['Downstroke', 'Foot valve closed; piston valve open.', 'The piston moves down. Water passes through its valve and into the hollow delivery path towards the spout.'],
    ]} />
    <h4 className="text-lg font-bold text-slate-900">Bicycle pump</h4>
    <Image name="bicycle-pump" alt="A bicycle pump draws air into its cylinder on the upstroke and compresses it into the tyre on the downstroke; a non-return valve prevents backflow." />
    <Table headers={['Stroke', 'Operation']} rows={[
      ['Upstroke', 'The piston rises and air enters the cylinder. The inlet route depends on the pump design, often through or around a flexible piston seal. The tyre valve prevents reverse flow.'],
      ['Downstroke', 'The seal closes tightly and the piston compresses the air. When cylinder pressure exceeds tyre pressure, air passes through the outlet and one-way tyre valve into the tyre.'],
    ]} />
    <p><strong>Activities:</strong> demonstrate a siphon, hydraulic jack and car braking system. Illustrate the operation of a Blair pump and a bicycle pump, showing piston movement, valve states and flow direction.</p>
    <Resources>siphon, hydraulic jack, model of a Blair pump and bicycle pump.</Resources>
  </Card>
</div>; }
