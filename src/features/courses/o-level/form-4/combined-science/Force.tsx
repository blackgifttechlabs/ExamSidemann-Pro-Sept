import React, { Suspense, lazy } from 'react';
const ResultantForceScene = lazy(() => import('./ResultantForceScene'));
import ForceDirections, { BalancedIllustrations } from './ForceDirections';
import { FrictionOpposes, FrictionSurfaces, FrictionMeasure } from './FrictionIllustrations';
import { MachinePic } from './MachineIllustrations';
import { MechanicalAdvantageExamples } from './MachineMath';
import { PressureAreaFigure, DepthJetsFigure, AtmosphereFigure, ManometerFigure, SiphonFigure, HydraulicFigure, BicyclePumpFigure, BlairPumpFigure } from './FluidIllustrations';
import { MassFigure, WeightFigure, InertiaFigure, MomentumFigure, Worked } from './NewtonIllustrations';
const BusBrakeScene = lazy(() => import('./NewtonScenes').then(m => ({ default: m.BusBrakeScene })));
const TrolleyPushScene = lazy(() => import('./NewtonScenes').then(m => ({ default: m.TrolleyPushScene })));
const KickBallScene = lazy(() => import('./NewtonScenes').then(m => ({ default: m.KickBallScene })));
import { DoorIllustrations, PrincipleIllustrations, MomentCalcIllustration, PrincipleWorkingAnimation } from './MomentIllustrations';
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
function UPic({ name, alt }: { name: string; alt: string }) { return <img src={`${imageRoot}phys-force-use-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full max-w-[14rem] rounded-lg sm:w-40" />; }
function LPic({ name, alt }: { name: string; alt: string }) { return <img src={`${imageRoot}phys-force-lever-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="block h-auto w-full max-w-[14rem] rounded-lg sm:w-52" />; }
function Num({ items }: { items: string[] }) { return <>{items.map((x, i) => <span key={i} className="block">{i + 1}. {x}</span>)}</>; }
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
    <p>Always look at two things about each force: its <strong>direction</strong> and its <strong>size</strong>.</p>
    <ul className="list-disc space-y-1 pl-6"><li>Forces in the <strong>same direction</strong>: add the sizes.</li><li>Forces in <strong>opposite directions</strong>: take the small size away from the big size.</li><li>The resultant goes in the direction of the <strong>bigger force</strong>.</li></ul>
    <ForceDirections />
  </Card>
  <Card n={3} title="Balanced Forces">
    <p>Forces are <strong>balanced</strong> when they are equal in size and pull or push in opposite directions. They cancel each other out, so the resultant force is <strong>zero</strong>.</p>
    <ul className="list-disc space-y-1 pl-6"><li>If the object is still, it stays still.</li><li>If the object is moving, it keeps moving at the same speed in a straight line.</li></ul>
    <p>Forces are <strong>unbalanced</strong> when they are not equal. The resultant is not zero, so the object speeds up, slows down or changes direction.</p>
    <BalancedIllustrations />
  </Card>
  <Card n={3} title="Moments">
    <p>A <strong>moment</strong> is the turning effect of a force. It is what makes something turn around a point. That point is called the <strong>pivot</strong>.</p>
    <ul className="list-disc space-y-1 pl-6"><li>A door turns around its hinge. The hinge is the pivot.</li><li>A see-saw turns around the middle. The middle is the pivot.</li><li>A spanner turns around the nut. The nut is the pivot.</li></ul>
    <p>The turning effect gets bigger when the force is bigger, and when you push <strong>further from the pivot</strong>.</p>
    <DoorIllustrations />
    <p className="text-2xl font-bold text-slate-900">How to calculate a moment</p>
    <Formula>Moment = force × perpendicular distance from the pivot<br />Unit: newton metre (N m)</Formula>
    <p>The distance is measured straight from the pivot to the line of the force, at a right angle.</p>
    <MomentCalcIllustration />
    <p className="text-2xl font-bold text-slate-900">Principle of moments</p>
    <p>When something is balanced, the turning effects on both sides are equal: the total <strong>clockwise</strong> moments equal the total <strong>anticlockwise</strong> moments. For a balanced object, the resultant force is also zero.</p>
    <PrincipleIllustrations />
    <p className="text-2xl font-bold text-slate-900">How to do the calculation</p>
    <p>Work out the moment on one side, make the other side equal to it, then find the unknown number.</p>
    <PrincipleWorkingAnimation />
  </Card>
  <Card n={3} title="Friction">
    <p><strong>Friction</strong> is a force that tries to stop two surfaces sliding past each other. It always pushes the <strong>opposite way</strong> to the movement.</p>
    <FrictionOpposes />
    <p className="text-2xl font-bold text-slate-900">What changes the size of friction</p>
    <ul className="list-disc space-y-1 pl-6"><li>The <strong>surfaces</strong>: rough surfaces give big friction. Smooth surfaces give small friction.</li><li>How hard the surfaces are <strong>pressed together</strong>: pressed harder gives bigger friction.</li></ul>
    <FrictionSurfaces />
    <p className="text-2xl font-bold text-slate-900">How to measure friction</p>
    <ul className="list-disc space-y-1 pl-6"><li>Hook a spring balance onto a block and pull it along a surface.</li><li>Read the force just before the block starts to move.</li><li>Keep pulling at a steady speed. The pull now equals the friction.</li></ul>
    <FrictionMeasure />
    <p className="text-2xl font-bold text-slate-900">Where we use friction</p>
    <PicTable headers={['', 'Use', 'How friction helps', 'Example']} rows={[
      [<UPic name="grip" alt="A tyre gripping the road" />, <strong>Grip</strong>, 'The rough tread of a tyre grips the road, so the tyre does not slip.', 'Tyre treads on a wet road.'],
      [<UPic name="walking" alt="A shoe sole gripping the ground" />, <strong>Walking</strong>, 'The rough sole of a shoe grips the ground, so you do not slip when you walk.', 'Shoe soles.'],
      [<UPic name="braking" alt="A car brake disc and brake pad" />, <strong>Braking</strong>, 'The brake pads rub on the disc. The friction slows the wheel down.', 'Car and bicycle brakes.'],
    ]} />
  </Card>
  <Card n={4} title="Simple Machines">
    <p>A <strong>machine</strong> is something that makes a job easier. It does this by changing the <strong>size</strong> or the <strong>direction</strong> of a force.</p>
    <p className="text-2xl font-bold text-slate-900">Types of machines</p>
    <p>There are six simple machines:</p>
    <PicTable headers={['', 'Machine', 'How it helps', 'Examples']} rows={[
      [<MachinePic kind="lever" />, <strong>Lever</strong>, 'A bar that turns around a pivot. A small effort moves a big load.', 'Crowbar, scissors, wheelbarrow.'],
      [<MachinePic kind="pulley" />, <strong>Pulley</strong>, 'A wheel with a rope over it. It changes the direction of the force, so you pull down to lift up.', 'Flag pole, crane, well.'],
      [<MachinePic kind="ramp" />, <strong>Inclined plane (ramp)</strong>, 'A sloping surface. You push a load up a long slope with a smaller force.', 'Ramp, sloping road.'],
      [<MachinePic kind="wheel" />, <strong>Wheel and axle</strong>, 'A wheel fixed to a rod (the axle). A small turn of the big wheel makes a strong turn of the axle.', 'Steering wheel, door handle, tap.'],
      [<MachinePic kind="wedge" />, <strong>Wedge</strong>, 'Two slopes joined together. It pushes things apart or cuts them.', 'Axe, knife, nail.'],
      [<MachinePic kind="screw" />, <strong>Screw</strong>, 'A slope wound around a rod. Turning it drives it into things.', 'Screw, bolt, jar lid.'],
    ]} />
    <p className="text-2xl font-bold text-slate-900">Levers</p>
    <p>A <strong>lever</strong> is a rigid bar that turns around a point called the <strong>pivot</strong>. The force you put in is the <strong>effort</strong>. The thing you move is the <strong>load</strong>.</p>
    <ul className="list-disc space-y-1 pl-6"><li>A crowbar lets you lift a heavy rock with a small push.</li><li>A wheelbarrow lets you carry a heavy load with less effort.</li><li>A pair of scissors cuts when you squeeze the handles.</li></ul>
    <p className="text-2xl font-bold text-slate-900">Types of lever</p>
    <p>There are three types. They depend on which of the three parts (effort, pivot or load) is in the middle.</p>
    <PicTable headers={['', 'Type of lever', 'What is in the middle', 'Example']} rows={[
      [<LPic name="first" alt="A crowbar and scissors with the pivot in the middle" />, <strong>First class lever</strong>, 'The pivot is in the middle. Order: effort, pivot, load.', <Num items={['Crowbar', 'Scissors', 'See-saw', 'Pliers', 'Claw hammer pulling a nail']} />],
      [<LPic name="second" alt="A wheelbarrow with the load in the middle" />, <strong>Second class lever</strong>, 'The load is in the middle. Order: pivot, load, effort.', <Num items={['Wheelbarrow', 'Bottle opener', 'Nutcracker', 'Door (the hinge is the pivot)', 'Stapler']} />],
      [<LPic name="third" alt="A forearm lifting a weight with the effort in the middle" />, <strong>Third class lever</strong>, 'The effort is in the middle. Order: pivot, effort, load.', <Num items={['Forearm lifting a weight', 'Broom', 'Fishing rod', 'Tweezers', 'Spade or shovel']} />],
    ]} />
  </Card>
  <Card n={6} title="Machines: Uses, Advantage and Efficiency">
    <p>We use machines to lift heavy loads, to change the direction of a force, or to make a job need less effort.</p>
    <p className="text-2xl font-bold text-slate-900">Uses of machines</p>
    <PicTable headers={['', 'Machine', 'Use', 'Examples']} rows={[
      [<MachinePic kind="lever" />, <strong>Lever</strong>, 'Lifting and carrying loads, and cutting.', 'Crowbar, wheelbarrow, scissors.'],
      [<MachinePic kind="pulley" />, <strong>Pulley system</strong>, 'Lifting loads and changing the direction of the effort.', 'Flag pole, crane.'],
      [<MachinePic kind="ramp" />, <strong>Inclined plane</strong>, 'Raising a load gradually along a ramp.', 'Loading ramp, sloping road.'],
      [<MachinePic kind="gears" />, <strong>Gears</strong>, 'Passing on a turning movement and changing its speed or turning effect.', 'Bicycle, clock.'],
    ]} />
    <p className="text-2xl font-bold text-slate-900">Mechanical advantage (MA)</p>
    <p><strong>Mechanical advantage</strong> tells you how many times a machine multiplies your effort. Effort is the force you put in. Load is the force you are trying to overcome.</p>
    <Formula>MA = load force ÷ effort force</Formula>
    <ul className="list-disc space-y-1 pl-6"><li>Use forces for both, in newtons (N).</li><li>MA has no units. It is just a number.</li><li>If MA is more than 1, a small effort moves a bigger load.</li></ul>
    <p className="text-2xl font-bold text-slate-900">How to calculate mechanical advantage</p>
    <ol className="list-decimal space-y-1 pl-6"><li>Write down the load force.</li><li>Write down the effort force.</li><li>Divide the load by the effort.</li></ol>
    <MechanicalAdvantageExamples />
    <p className="text-2xl font-bold text-slate-900">Velocity ratio (VR)</p>
    <p><strong>Velocity ratio</strong> compares how far you move the effort with how far the load moves.</p>
    <Formula>VR = distance moved by the effort ÷ distance moved by the load</Formula>
    <ul className="list-disc space-y-1 pl-6"><li><strong>Lever:</strong> effort arm length ÷ load arm length.</li><li><strong>Pulley system:</strong> count the rope pieces that hold up the load.</li><li><strong>Inclined plane:</strong> distance along the ramp ÷ height.</li><li><strong>Gears:</strong> teeth on the driven gear ÷ teeth on the driver gear.</li></ul>
    <Worked n={1} question="A 10-tooth driver gear turns a 20-tooth driven gear. Find the velocity ratio." steps={['Write the rule: VR = teeth on driven gear ÷ teeth on driver gear', 'Put in the numbers: VR = 20 ÷ 10']} answer="VR = 2 (the driver turns twice for one turn of the driven gear)" />
    <p className="text-2xl font-bold text-slate-900">Efficiency</p>
    <p><strong>Efficiency</strong> tells you how much of the work you put in comes out as useful work.</p>
    <Formula>Efficiency = MA ÷ VR × 100%</Formula>
    <Worked n={2} question="A machine lifts a load of 80 N with an effort of 50 N. Its velocity ratio is 2. Find its efficiency." steps={['Find the MA: MA = 80 ÷ 50 = 1.6', 'Write the formula: efficiency = MA ÷ VR × 100%', 'Put in the numbers: efficiency = 1.6 ÷ 2 × 100%']} answer="80%" />
    <p className="text-xl font-bold text-slate-900">Why is efficiency less than 100%?</p>
    <ul className="list-disc space-y-1 pl-6"><li>Friction turns some energy into heat.</li><li>Some energy is used to move the parts of the machine.</li></ul>
    <p>To improve efficiency: use oil (lubrication) and good bearings, and reduce the mass of moving parts. A real machine never creates energy.</p>
  </Card>
  <Card n={5} title="Weight, Mass and Newton’s Laws">
    <p className="text-2xl font-bold text-slate-900">Mass</p>
    <p><strong>Mass</strong> is the amount of matter (stuff) in an object. We measure it in <strong>kilograms (kg)</strong> with a balance.</p>
    <ul className="list-disc space-y-1 pl-6"><li>Mass does not change when you move to a different place.</li><li>Mass is not a force.</li></ul>
    <MassFigure />
    <p className="text-2xl font-bold text-slate-900">Weight</p>
    <p><strong>Weight</strong> is the pull of gravity on an object. It is a <strong>force</strong>, so we measure it in <strong>newtons (N)</strong> with a spring balance.</p>
    <Formula>Weight = mass × gravitational field strength<br />W = m × g<br />On Earth g = 10 N/kg (use the value given in the question).</Formula>
    <WeightFigure />
    <Worked n={1} question="A bag has a mass of 6 kg. Find its weight. (g = 10 N/kg)" steps={['Write the formula: W = m × g', 'Put in the numbers: W = 6 × 10']} answer="60 N" />
    <Worked n={2} question="An astronaut has a mass of 70 kg. On the Moon g = 1.6 N/kg. Find the weight on the Moon." steps={['Write the formula: W = m × g', 'Put in the numbers: W = 70 × 1.6', 'Work it out: W = 112']} answer="112 N" />
    <p className="text-2xl font-bold text-slate-900">Inertia</p>
    <p><strong>Inertia</strong> is how much an object resists a change in its motion. A still object tries to stay still. A moving object tries to keep moving. The bigger the mass, the bigger the inertia.</p>
    <InertiaFigure />
    <p className="text-2xl font-bold text-slate-900">Momentum</p>
    <p><strong>Momentum</strong> is mass × velocity. It tells you how hard it is to stop a moving object. It has the same direction as the velocity.</p>
    <Formula>Momentum = mass × velocity<br />p = m × v<br />Unit: kg m/s</Formula>
    <MomentumFigure />
    <Worked n={3} question="A ball of mass 2 kg moves at 3 m/s. Find its momentum." steps={['Write the formula: p = m × v', 'Put in the numbers: p = 2 × 3']} answer="6 kg m/s" />
    <div className="border-t border-slate-300 pt-6"><h3 className="text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">Newton’s Laws of Motion</h3><p className="mt-3">Isaac Newton described how forces change the way things move. His three laws are:</p>
      <ol className="mt-2 list-decimal space-y-2 pl-6"><li><strong>First law:</strong> an object stays still, or keeps moving at the same speed in a straight line, unless a resultant force acts on it.</li><li><strong>Second law:</strong> a resultant force makes an object accelerate: F = m × a.</li><li><strong>Third law:</strong> when A pushes B, B pushes A back with a force that is equal in size and opposite in direction.</li></ol></div>
    <p className="text-2xl font-bold text-slate-900">Newton’s first law</p>
    <p>An object stays still, or keeps moving at the same speed in a straight line, <strong>unless a resultant force acts on it</strong>.</p>
    <ul className="list-disc space-y-1 pl-6"><li>No resultant force: no change in motion.</li><li>Example: when a bus brakes, the passengers keep moving forward. A seat belt gives them a stopping force.</li></ul>
    <Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><BusBrakeScene /></Suspense>
    <p className="text-2xl font-bold text-slate-900">Newton’s second law</p>
    <p>A resultant force makes an object accelerate. The bigger the force, the bigger the acceleration. The bigger the mass, the smaller the acceleration.</p>
    <Formula>Resultant force = mass × acceleration<br />F = m × a<br />So a = F ÷ m</Formula>
    <Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><TrolleyPushScene /></Suspense>
    <Worked n={4} question="A resultant force of 12 N acts on a trolley of mass 3 kg. Find the acceleration." steps={['Write the formula: a = F ÷ m', 'Put in the numbers: a = 12 ÷ 3']} answer="4 m/s²" />
    <Worked n={5} question="A car of mass 1200 kg accelerates at 2.5 m/s². Find the resultant force on it." steps={['Write the formula: F = m × a', 'Put in the numbers: F = 1200 × 2.5']} answer="3000 N" />
    <Worked n={6} question="A 4 kg box is pulled with a force of 20 N. Friction is 8 N. Find the acceleration." steps={['Find the resultant force: 20 − 8 = 12 N', 'Write the formula: a = F ÷ m', 'Put in the numbers: a = 12 ÷ 4']} answer="3 m/s²" />
    <p className="text-2xl font-bold text-slate-900">Newton’s third law</p>
    <p>When object A pushes object B, object B pushes A back with a force that is <strong>equal in size and opposite in direction</strong>.</p>
    <ul className="list-disc space-y-1 pl-6"><li>The two forces act on <strong>different objects</strong>, so they do not cancel each other.</li><li>Example: a ball hits a wall. The ball pushes the wall, and the wall pushes the ball back.</li></ul>
    <Suspense fallback={<p className="text-slate-500">Loading 3D view…</p>}><KickBallScene /></Suspense>
  </Card>
  <Card n={7} title="Pressure">
    <p><strong>Pressure</strong> tells you how much force is pressing on each bit of a surface. The same force gives a bigger pressure when it is pressed on a smaller area.</p>
    <ul className="list-disc space-y-1 pl-6"><li>A sharp pin goes into a wall easily because all your push is on a tiny point.</li><li>A wide shoe does not sink into mud as much, because your weight is spread over a big area.</li></ul>
    <PressureAreaFigure />
    <p className="text-2xl font-bold text-slate-900">How to calculate pressure</p>
    <Formula>Pressure = force ÷ area<br />P = F ÷ A<br />Unit: N/m², called the pascal (Pa)</Formula>
    <Worked n={1} question="A force of 100 N pushes on an area of 0.020 m². Find the pressure." steps={['Write the formula: P = F ÷ A', 'Put in the numbers: P = 100 ÷ 0.020']} answer="5000 Pa" />
    <Worked n={2} question="A box weighs 600 N and rests on a base of area 0.40 m². Find the pressure on the floor." steps={['Write the formula: P = F ÷ A', 'Put in the numbers: P = 600 ÷ 0.40']} answer="1500 Pa" />
    <p className="text-2xl font-bold text-slate-900">Pressure in liquids</p>
    <p>In a liquid, pressure gets bigger the <strong>deeper</strong> you go. It pushes in all directions. This is why a dam wall is thicker at the bottom.</p>
    <DepthJetsFigure />
    <p className="text-2xl font-bold text-slate-900">How to calculate pressure in a liquid</p>
    <Formula>P = ρ × g × h<br />ρ (rho) = density of the liquid (kg/m³)<br />g = gravitational field strength (N/kg)<br />h = depth (m)</Formula>
    <Worked n={3} question="Find the pressure at a depth of 0.20 m in water. The density of water is 1000 kg/m³ and g = 10 N/kg." steps={['Write the formula: P = ρ × g × h', 'Put in the numbers: P = 1000 × 10 × 0.20']} answer="2000 Pa" />
    <p className="text-2xl font-bold text-slate-900">Atmospheric pressure</p>
    <p><strong>Atmospheric pressure</strong> is the pressure of the air. Air is heavy, and it pushes on everything around us. A water barometer shows this: the air holds up a column of water in a tube.</p>
    <AtmosphereFigure />
    <p className="text-2xl font-bold text-slate-900">Manometer</p>
    <p>A <strong>manometer</strong> measures the pressure of a gas. It is a U-shaped tube with some liquid in it, like water or oil. Join one end to the gas and leave the other end open to the air.</p>
    <ul className="list-disc space-y-1 pl-6"><li>If the gas pressure is bigger, it pushes its side of the liquid down.</li><li>Measure the vertical difference between the two levels. Call it h.</li></ul>
    <ManometerFigure />
    <p className="text-2xl font-bold text-slate-900">How to calculate with a manometer</p>
    <Formula>Pressure difference = ρ × g × h<br />Gas pressure = atmospheric pressure + ρ × g × h<br />(when the gas side is lower)</Formula>
    <Worked n={4} question="A water manometer shows a height difference of 0.15 m. Find the pressure difference. (ρ = 1000 kg/m³, g = 10 N/kg)" steps={['Write the formula: pressure difference = ρ × g × h', 'Put in the numbers: 1000 × 10 × 0.15']} answer="1500 Pa" />
  </Card>
  <Card n={8} title="Fluid Systems and Pumps">
    <p>A fluid is a liquid or a gas. Fluid systems use the pressure in a fluid to move things. Pumps push a fluid from one place to another.</p>
    <p className="text-2xl font-bold text-slate-900">Siphon</p>
    <p>A <strong>siphon</strong> is a tube that moves liquid from a high place to a lower place, over an edge. Fill the tube with liquid, keep the inlet under the liquid, and put the outlet lower than the liquid surface. The liquid then keeps flowing.</p>
    <SiphonFigure />
    <p className="text-2xl font-bold text-slate-900">Hydraulic systems</p>
    <p>In a <strong>hydraulic system</strong>, a pressure on a liquid in a closed space is passed on everywhere in the liquid. A small force on a small piston can make a big force on a large piston. The large piston moves a shorter distance. A hydraulic jack and a car braking system work like this.</p>
    <HydraulicFigure />
    <p className="text-2xl font-bold text-slate-900">How to calculate in a hydraulic system</p>
    <Formula>F₁ ÷ A₁ = F₂ ÷ A₂<br />(pressure is the same on both pistons)</Formula>
    <Worked n={5} question="A force of 50 N pushes on a small piston of area 0.002 m². The large piston has an area of 0.020 m². Find the force on the large piston." steps={['Find the pressure: P = 50 ÷ 0.002 = 25 000 Pa', 'The pressure is the same on the large piston', 'Find the force: F = P × A = 25 000 × 0.020']} answer="500 N" />
    <p className="text-2xl font-bold text-slate-900">Blair pump</p>
    <p>The <strong>Blair pump</strong> is a pump you work by hand to bring up water. Two one-way valves control the flow: a moving valve in the piston and a fixed foot valve at the bottom.</p>
    <BlairPumpFigure />
    <Table headers={['Stroke', 'Valves', 'What happens']} rows={[
      ['Upstroke', 'Piston valve closed. Foot valve open.', 'The piston goes up. Water comes in through the foot valve.'],
      ['Downstroke', 'Foot valve closed. Piston valve open.', 'The piston goes down. Water passes through the piston valve and on towards the spout.'],
    ]} />
    <p className="text-2xl font-bold text-slate-900">Bicycle pump</p>
    <p>A <strong>bicycle pump</strong> pushes air into a tyre. The piston moves in a cylinder. A one-way valve stops the air from coming back out of the tyre.</p>
    <BicyclePumpFigure />
    <Table headers={['Stroke', 'What happens']} rows={[
      ['Upstroke', 'The piston goes up and air comes into the cylinder. The tyre valve stops air from flowing back.'],
      ['Downstroke', 'The seal closes and the piston squeezes the air. When the air pressure in the pump is more than in the tyre, air goes through the tyre valve into the tyre.'],
    ]} />
  </Card>
</div>; }
