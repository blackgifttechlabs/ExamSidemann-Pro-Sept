import React, { Suspense, lazy } from 'react';
const ResultantForceScene = lazy(() => import('./ResultantForceScene'));
const imageRoot = '/images/courses/o-level/combined-science/form-4/';
function Image({ name, alt }: { name: string; alt: string }) { return <figure className="my-5"><img src={`${imageRoot}phys-force-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="block h-auto w-auto max-w-full rounded-2xl border border-slate-200" style={{ maxHeight: 'min(60svh, 600px)' }} /><figcaption className="mt-2 text-left text-sm leading-relaxed text-slate-600">{alt}</figcaption></figure>; }
function Card({ title, children }: { n?: number; title: string; children: React.ReactNode }) { return <section className="border-b border-slate-300 pb-6 last:border-b-0"><h3 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{title}</h3><div className="space-y-4 text-lg leading-relaxed text-slate-700">{children}</div></section>; }
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) { return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-base"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className="border border-slate-200 p-3 font-bold text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((r,i) => <tr key={i}>{r.map((v,j) => <td key={j} className="border border-slate-200 p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>; }
function Pic({ name, alt }: { name: string; alt: string }) { return <img src={`${imageRoot}phys-force-type-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full max-w-[14rem] sm:w-36" />; }
function EPic({ name, alt }: { name: string; alt: string }) { return <img src={`${imageRoot}phys-force-effect-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full max-w-[18rem] sm:w-44" />; }
function PicTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return <>
    <div className="hidden sm:block"><Table headers={[headers[1], 'Picture', ...headers.slice(2)]} rows={rows.map(r => [r[1], r[0], ...r.slice(2)])} /></div>
    <div className="grid grid-cols-2 gap-x-3 sm:hidden">
      {rows.map((r, i) => <div key={i} className="rounded-xl border border-slate-200 p-2" style={{ display: 'grid', gridRow: 'span 4', gridTemplateRows: 'subgrid', marginBottom: 12 }}>
        <p className="mb-2 text-base font-bold leading-snug text-slate-900">{r[1]}</p>
        <div className="mb-2">{r[0]}</div>
        <p className="text-sm leading-snug">{r[2]}</p>
        <p className="mt-2 border-t border-slate-200 pt-2 text-sm leading-snug"><span className="font-bold text-slate-900">{headers[3]}: </span>{r[3]}</p>
      </div>)}
    </div>
  </>;
}
function Formula({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-sky-50 p-3 font-semibold text-sky-950">{children}</p>; }
function Resources({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Resources:</strong> {children}</p>; }
export default function Force() { return <div className="not-prose space-y-6">
  <div className="space-y-3 text-lg leading-relaxed text-slate-700">
    <p>A <strong>force</strong> is a push or a pull. When you push a door open or pull a rope, you are using a force.</p>
    <p>A force can:</p>
    <ul className="list-disc space-y-1 pl-6"><li>make something start moving, speed up, slow down or stop,</li><li>change the direction something is moving in,</li><li>change the shape of something, like stretching a spring or squashing foam.</li></ul>
    <p>We measure force in <strong>newtons (N)</strong>.</p>
  </div>
  <hr className="border-slate-300" />
  <Card n={1} title="Effects and Types of Force">
    <p>There are different types of force. Each one has its own name:</p>
    <PicTable headers={['', 'Type of force', 'What it is', 'Example']} rows={[
      [<Pic name="gravity" alt="The Earth pulling a falling object down" />, <strong>Gravitational force</strong>, 'A pull between objects with mass. The Earth pulls everything towards it, so things fall down.', 'A mango falling from a tree. Why you stay on the ground.'],
      [<Pic name="gravity" alt="The Earth pulling a falling object down" />, <strong>Weight</strong>, 'The gravity force acting on an object. It is a force, so we measure it in newtons (N).', 'Hanging a bag on a spring balance to read its weight.'],
      [<Pic name="applied" alt="A girl pushing a shopping trolley" />, <strong>Mechanical force</strong>, 'A push or pull from a person or a machine on an object.', 'A hand pushing a trolley. A stretched spring pulling.'],
      [<Pic name="electric" alt="A rubbed balloon attracting small pieces of paper" />, <strong>Electrostatic force</strong>, 'A push or pull between objects that carry electric charge. Opposite charges attract. Like charges push apart.', 'A balloon rubbed on your hair sticking to a wall.'],
      [<Pic name="magnetic" alt="A magnet attracting paper clips" />, <strong>Magnetic force</strong>, 'A push or pull from a magnet. A magnet attracts iron and steel. Two magnets can attract or push each other away.', 'A magnet picking up pins or paper clips.'],
      [<Pic name="friction" alt="A skier slowing down on snow" />, <strong>Friction</strong>, 'A force that tries to stop two surfaces sliding past each other. It slows things down and makes them warm.', 'Brakes stopping a bicycle. Your hands getting warm when you rub them.'],
    ]} />
    <p>We measure force with a <strong>force meter</strong> or <strong>spring balance</strong>. The SI unit is the <strong>newton (N)</strong>. Check the zero first and read the scale straight on.</p>
    <p className="text-2xl font-bold text-slate-900">Effects of forces</p>
    <p>A force cannot be seen, but you can see what it does:</p>
    <PicTable headers={['', 'Effect of a force', 'What happens', 'Example']} rows={[
      [<EPic name="motion" alt="A car being pushed forward by a force" />, <strong>Change in motion</strong>, 'It makes an object start moving, stop, or change its speed.', 'A car speeding up. Brakes stopping a bicycle.'],
      [<EPic name="direction" alt="A football turning as a force acts on it" />, <strong>Change in direction</strong>, 'It changes the direction a moving object is going in.', 'A player kicking a rolling ball another way.'],
      [<EPic name="shape" alt="A hand squeezing a sponge" />, <strong>Change in shape</strong>, 'It stretches, squashes or bends an object.', 'Squeezing a sponge. Bending a ruler.'],
      [<EPic name="size" alt="A hand pressing down on a spring" />, <strong>Change in size</strong>, 'It makes an object bigger or smaller, by stretching or compressing it.', 'Compressing a spring. Stretching a rubber band.'],
      [<EPic name="momentum" alt="A tennis ball being hit by a force" />, <strong>Change in momentum</strong>, 'Momentum is mass × velocity. A force changes the momentum of an object.', 'A tennis racket hitting a ball.'],
      [<EPic name="position" alt="An apple falling because of gravity" />, <strong>Change in position</strong>, 'It moves an object from one place to another.', 'Gravity pulling an apple down from a tree.'],
      [<EPic name="balance" alt="A force lifting one end of a see-saw" />, <strong>Change in balance (turning effect)</strong>, 'It gives a turning effect (a moment) and changes the balance of an object.', 'Pushing down on one end of a see-saw.'],
      [<EPic name="pressure" alt="A finger pressing a drawing pin into a surface" />, <strong>Change in pressure</strong>, 'It can increase or decrease the pressure on a surface.', 'Pressing on a sharp pin makes a big pressure on a small point.'],
    ]} />
  </Card>
  <Card n={2} title="Resultant Force">
    <p>When two people move an object together, one pushing it from behind and one pulling it from the front with a string, both forces move it the same way. To find the total force on the object, we <strong>add the force from each side</strong>. The result is what we call the <strong>resultant force</strong>.</p>
    <Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><ResultantForceScene /></Suspense>
    <p className="text-2xl font-bold text-slate-900">How to find the resultant force</p>
    <ul className="list-disc space-y-1 pl-6"><li>Forces in the <strong>same direction</strong>: add them.</li><li>Forces in <strong>opposite directions</strong>: take the small one away from the big one. The resultant goes in the direction of the bigger force.</li></ul>
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
    <h4 className="text-xl font-bold text-slate-900">Blair pump</h4>
    <Image name="blair-pump" alt="A simplified Blair pump cutaway shows the foot valve opening and piston valve closing on the upstroke; their states reverse on the downstroke as water passes through the piston valve." />
    <p>The <strong>Blair pump</strong> is a hand-operated water pump. In the simplified hollow-pushrod teaching model, a moving piston valve and a fixed foot valve control one-way flow.</p>
    <Table headers={['Stroke', 'Valve states', 'Operation']} rows={[
      ['Upstroke', 'Piston valve closed; foot valve open.', 'The piston rises. Water enters the chamber below it through the foot valve.'],
      ['Downstroke', 'Foot valve closed; piston valve open.', 'The piston moves down. Water passes through its valve and into the hollow delivery path towards the spout.'],
    ]} />
    <h4 className="text-xl font-bold text-slate-900">Bicycle pump</h4>
    <Image name="bicycle-pump" alt="A bicycle pump draws air into its cylinder on the upstroke and compresses it into the tyre on the downstroke; a non-return valve prevents backflow." />
    <Table headers={['Stroke', 'Operation']} rows={[
      ['Upstroke', 'The piston rises and air enters the cylinder. The inlet route depends on the pump design, often through or around a flexible piston seal. The tyre valve prevents reverse flow.'],
      ['Downstroke', 'The seal closes tightly and the piston compresses the air. When cylinder pressure exceeds tyre pressure, air passes through the outlet and one-way tyre valve into the tyre.'],
    ]} />
    <p><strong>Activities:</strong> demonstrate a siphon, hydraulic jack and car braking system. Illustrate the operation of a Blair pump and a bicycle pump, showing piston movement, valve states and flow direction.</p>
    <Resources>siphon, hydraulic jack, model of a Blair pump and bicycle pump.</Resources>
  </Card>
</div>; }
