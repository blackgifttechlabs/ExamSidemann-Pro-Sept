import React from 'react';
import { PicTable, QA } from './EnergyIllustrations';
import { MaterialsFigure, PoleLawFigure, BarFieldFigure, WireFieldFigure, SolenoidFigure, MotorEffectFigure, MotorFigure, InductionFigure, OutputGraphFigure, HydroFigure, ThermalFigure } from './MagnetismIllustrations';

const imageRoot = '/images/courses/o-level/combined-science/form-4/';
function Diagram({ name, caption }: { name: string; caption: string }) {
  return <figure className="mx-auto w-full max-w-lg"><img src={`${imageRoot}phys-magnetism-${name}.webp`} alt={caption} loading="lazy" decoding="async" className="h-auto w-full rounded-xl border border-slate-200 bg-white object-contain" /><figcaption className="mt-2 text-center text-base text-slate-700">{caption}</figcaption></figure>;
}
const Shape = ({ name, alt }: { name: string; alt: string }) => <img src={`${imageRoot}phys-magnetism-type-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="mx-auto h-24 w-auto max-w-full object-contain" />;

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-b border-slate-300 pb-6 last:border-b-0"><h3 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{title}</h3><div className="space-y-4 text-lg leading-relaxed text-slate-700">{children}</div></section>;
}
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-base"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className="border border-slate-200 p-3 font-bold text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="border border-slate-200 p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>;
}
const Rule = ({ children }: { children: React.ReactNode }) => <p className="rounded-xl bg-amber-50 p-3 font-semibold text-slate-900">{children}</p>;
const Formula = ({ children }: { children: React.ReactNode }) => <p className="rounded-xl bg-sky-50 p-3 font-semibold text-sky-950">{children}</p>;
const List = ({ children }: { children: React.ReactNode }) => <ul className="list-disc space-y-1 pl-6">{children}</ul>;
const Steps = ({ children }: { children: React.ReactNode }) => <ol className="list-decimal space-y-1 pl-6">{children}</ol>;
const Sub = ({ children }: { children: React.ReactNode }) => <p className="text-2xl font-bold text-slate-900">{children}</p>;

export default function Magnetism() {
  return <div className="not-prose space-y-6">
  <div className="space-y-3 text-lg leading-relaxed text-slate-700">
    <p>A <strong>magnet</strong> pulls some metals towards it without touching them. The space around a magnet where this pull works is its <strong>magnetic field</strong>.</p>
    <p>In this lesson we look at magnets, how electricity makes magnetism, how magnetism makes things move, and how it makes electricity in power stations.</p>
  </div>
  <hr className="border-slate-300" />

  <Card title="Types of Magnets">
    <p>Magnets come in different shapes. The shape helps us name them.</p>
    <PicTable headers={['', 'Magnet', 'What it looks like', 'Good to know']} rows={[
      [<Shape name="bar" alt="Bar magnet" />, <strong>Bar</strong>, 'A straight bar with a pole at each end.', 'The poles are far apart.'],
      [<Shape name="horseshoe" alt="Horseshoe magnet" />, <strong>Horseshoe</strong>, 'A U shape.', 'The two poles are close together, so it pulls strongly.'],
      [<Shape name="c" alt="C-magnet" />, <strong>C</strong>, 'Shaped like the letter C.', 'The poles face each other across the gap.'],
      [<Shape name="e" alt="E-magnet" />, <strong>E</strong>, 'Shaped like the letter E, with three limbs.', 'Used as the core of some electromagnets.'],
    ]} />
    <Sub>Permanent magnet or electromagnet?</Sub>
    <p>Shape does not tell you where the magnetism comes from.</p>
    <List>
      <li>A <strong>permanent magnet</strong> keeps its magnetism all the time. It needs no electricity.</li>
      <li>An <strong>electromagnet</strong> is only a magnet while an electric current flows through its coil.</li>
    </List>
    <QA q="A C-shaped magnet. Is it a permanent magnet?" a="You cannot tell from its shape. A C-shape can be a permanent magnet or part of an electromagnet." />
  </Card>

  <Card title="Magnetic Materials and Poles">
    <p>We say a material is <strong>magnetic</strong> when a magnet can pull it. Iron and steel are magnetic.</p>
    <p>We say a material is <strong>non-magnetic</strong> when a magnet cannot pull it. Copper, aluminium, wood, plastic and glass are non-magnetic.</p>
    <MaterialsFigure />
    <Rule>Not every metal is magnetic. Iron is. Copper and aluminium are not.</Rule>
    <Sub>Poles</Sub>
    <p>Every magnet has a <strong>north pole (N)</strong> and a <strong>south pole (S)</strong>. The pull is strongest at the poles.</p>
    <p>If you cut a magnet in half, you do not get one N and one S. You get two smaller magnets, and each has its own N and S.</p>
    <Sub>Finding the poles</Sub>
    <Steps><li>Hang a bar magnet from a string so it can turn freely.</li><li>Keep other magnets and iron away. Let it settle.</li><li>The end that points to geographic north is the <strong>north pole</strong>. The other end is the south pole.</li></Steps>
    <p>The Earth has a magnetic field too, like a huge magnet. A compass needle is a tiny magnet that lines up with it.</p>
    <QA q="A pupil says every metal is magnetic. How can you show this is wrong?" a="Hold a magnet near iron, copper and aluminium. Iron is pulled to it. Copper and aluminium are not." />
  </Card>

  <Card title="Magnetic Fields">
    <Rule>Like poles repel. Unlike poles attract.</Rule>
    <PoleLawFigure />
    <List><li>N and N push apart. S and S push apart.</li><li>N and S pull together.</li><li><strong>Repelling is the only sure test for a magnet.</strong> A plain iron nail is pulled by either pole. Only a magnet can push a magnet away.</li></List>
    <Sub>Field lines</Sub>
    <p>We draw <strong>field lines</strong> to show a magnetic field.</p>
    <BarFieldFigure />
    <List>
      <li>Outside the magnet, the arrows go <strong>from N to S</strong>.</li>
      <li>The lines never cross.</li>
      <li>Where the lines are close together, the field is strong. This is at the poles.</li>
    </List>
    <Sub>Showing a field</Sub>
    <List>
      <li><strong>Iron filings:</strong> sprinkle them on paper over a magnet and tap it. They line up and show the pattern. They do not show the direction.</li>
      <li><strong>Plotting compass:</strong> the needle's north end points along the field. Mark its position, move it a little in that direction, and mark again. Join the marks and add an arrow.</li>
    </List>
    <QA q="Why are field lines drawn closer together near the poles?" a="The field is stronger there. Closer lines mean a stronger field." />
    <QA q="A magnet pulls an object. Does that prove the object is a magnet?" a="No. It could be iron, which any magnet pulls. If the object pushes a magnet away, then it is a magnet." />
  </Card>

  <Card title="Electromagnetism">
    <p>An electric current makes a magnetic field. This link between electricity and magnetism is called <strong>electromagnetism</strong>.</p>
    <Sub>A straight wire</Sub>
    <p>Around a straight wire carrying current, the field lines are circles with the wire at the centre.</p>
    <WireFieldFigure />
    <Sub>Experiment</Sub>
    <Steps><li>Push a wire through a card and connect it to a low-voltage d.c supply.</li><li>Put a plotting compass on the card. With the current off, note where it points.</li><li>Switch on for a moment. The needle turns, so the current makes a field.</li><li>Reverse the current. The needle turns the other way.</li></Steps>
    <Rule>Right-hand grip rule: point your right thumb the way the current flows. Your curled fingers show the way the field goes round.</Rule>
    <List><li>A bigger current makes a stronger field.</li><li>The field is weaker farther from the wire.</li></List>
    <Sub>A solenoid</Sub>
    <p>A <strong>solenoid</strong> is a long coil of wire. The fields of all the turns add up.</p>
    <SolenoidFigure />
    <List><li>Inside, the field is nearly straight and even.</li><li>Outside, it looks like the field of a bar magnet, with a north end and a south end.</li><li>Curl your right fingers the way the current goes round. Your thumb points to the north end.</li><li>Reverse the current and the poles swap.</li></List>
    <QA q="How can you show the field is caused by the current?" a="Watch a compass with the current off, on, and reversed. It moves only when current flows, and it turns the other way when the current is reversed." />
  </Card>

  <Card title="The Motor Effect and the D.c Motor">
    <Sub>The motor effect</Sub>
    <p>A wire carrying current, placed in a magnetic field, feels a <strong>force</strong>. If it is free to move, it moves. This is the <strong>motor effect</strong>.</p>
    <MotorEffectFigure />
    <List>
      <li>Reverse the current: the wire moves the other way.</li>
      <li>Reverse the magnets: the wire moves the other way.</li>
      <li>Reverse both: the wire moves the same way as before.</li>
      <li>No current: no force.</li>
    </List>
    <Rule>Fleming's left-hand rule: thumb, first finger and second finger at right angles. First finger = Field (N to S). Second finger = Current. Thumb = force (Thrust).</Rule>
    <Sub>The d.c motor</Sub>
    <p>In a motor, a coil of wire sits between two magnets. The two sides of the coil carry current in opposite directions, so one side is pushed up and the other is pushed down. The coil turns.</p>
    <MotorFigure />
    <Sub>Why it keeps turning</Sub>
    <Steps>
      <li>Current flows from the d.c supply through the brushes and the split ring into the coil.</li>
      <li>The forces on the two sides turn the coil.</li>
      <li>Every half-turn, the split ring swaps which half touches each brush. This reverses the current in the coil.</li>
      <li>So the coil keeps being pushed round in the same direction.</li>
    </Steps>
    <Table headers={['Part', 'What it does']} rows={[
      [<strong key="a">Magnets</strong>, 'Make the magnetic field.'],
      [<strong key="b">Coil</strong>, 'Carries the current. Forces on its sides turn it.'],
      [<strong key="c">Carbon brushes</strong>, 'Touch the split ring and pass current to it.'],
      [<strong key="d">Split-ring commutator</strong>, 'Reverses the current in the coil every half-turn.'],
      [<strong key="e">D.c supply</strong>, 'Gives the electrical energy.'],
    ]} />
    <p>A motor changes <strong>electrical energy into movement energy</strong>. Some energy also becomes heat and sound.</p>
    <Sub>Making a motor turn harder</Sub>
    <List><li>Use stronger magnets.</li><li>Put more turns on the coil.</li><li>Use a bigger current.</li></List>
    <QA q="Why does a d.c motor need a split-ring commutator?" a="It reverses the current in the coil every half-turn. Then the forces keep turning the coil the same way, so it spins round and round." />
  </Card>

  <Card title="Making Electricity: The Generator Effect">
    <p>Move a magnet in or out of a coil of wire and a voltage is made in the coil. This is <strong>electromagnetic induction</strong>. The voltage is the <strong>induced e.m.f.</strong>, measured in volts.</p>
    <Sub>Magnet and coil experiment</Sub>
    <InductionFigure />
    <Steps>
      <li>Connect a coil to a sensitive centre-zero galvanometer. There is no battery.</li>
      <li>Push the magnet into the coil. The pointer swings while the magnet moves.</li>
      <li>Hold the magnet still. The pointer goes back to zero.</li>
      <li>Pull the magnet out. The pointer swings the other way.</li>
      <li>Use the other pole first. The swing is reversed.</li>
    </Steps>
    <Rule>A voltage is made only while the magnetic field through the coil is changing. A magnet held still gives nothing, however strong it is.</Rule>
    <p>It works the same if the coil moves and the magnet is still. What matters is that one moves compared with the other.</p>
    <Sub>Making a bigger voltage</Sub>
    <Table headers={['Change', 'Effect']} rows={[
      [<strong key="a">Stronger magnet</strong>, 'Bigger voltage.'],
      [<strong key="b">Move faster</strong>, 'Bigger voltage.'],
      [<strong key="c">More turns on the coil</strong>, 'Bigger voltage.'],
    ]} />
    <p>To test fairly, change only one thing at a time and keep the rest the same.</p>
    <Sub>Generators</Sub>
    <p>A <strong>generator</strong> changes movement energy into electrical energy. A coil is turned in a magnetic field, by a hand crank or a turbine. A generator does not make energy from nothing.</p>
    <Diagram name="generators" caption="An a.c generator uses two slip rings. A simple d.c generator uses a split-ring commutator." />
    <List>
      <li><strong>A.c generator:</strong> each end of the coil has its own slip ring. The output reverses direction every half-turn.</li>
      <li><strong>Simple d.c generator:</strong> a split ring swaps the connections every half-turn. The output always goes the same way, but it pulses.</li>
    </List>
    <Sub>Output graphs</Sub>
    <OutputGraphFigure />
    <List>
      <li>Label the up axis <strong>voltage (V)</strong> and the across axis <strong>time (s)</strong>.</li>
      <li><strong>A.c:</strong> a smooth wave above and below zero.</li>
      <li><strong>Simple d.c:</strong> humps that stay on one side of zero. It is not a flat line.</li>
      <li>A taller wave means a bigger voltage. More waves in the same time means a higher frequency.</li>
      <li>Turning the generator faster gives a bigger voltage and more waves.</li>
    </List>
    <Table headers={['Machine', 'Energy change', 'The coil connection']} rows={[
      [<strong key="a">D.c motor</strong>, 'Electrical → movement', 'Split ring reverses the current to keep it turning.'],
      [<strong key="b">A.c generator</strong>, 'Movement → electrical', 'Slip rings. Output alternates.'],
      [<strong key="c">Simple d.c generator</strong>, 'Movement → electrical', 'Split ring. Output pulses one way.'],
    ]} />
    <QA q="A strong magnet is held still inside a coil. Why is no current made?" a="The magnetic field through the coil is not changing. A voltage needs a changing field." />
    <QA q="How can you tell a.c from a simple d.c generator on a graph?" a="The a.c graph goes above and below zero. The d.c graph stays on one side of zero and pulses." />
  </Card>

  <Card title="Power Stations: Hydro and Thermal">
    <p>Both kinds of power station use a <strong>turbine</strong> to turn a <strong>generator</strong>. The generator makes the electricity.</p>
    <Sub>Hydroelectric power</Sub>
    <HydroFigure />
    <Steps><li>Water stored high up behind a dam has gravitational potential energy.</li><li>It runs down a big pipe called a <strong>penstock</strong> and gains kinetic energy.</li><li>The moving water turns the turbine.</li><li>The turbine turns the generator.</li><li>The water flows on into the river.</li></Steps>
    <Rule>Gravitational potential energy → kinetic energy of water → turbine → electrical energy.</Rule>
    <Sub>Thermal power</Sub>
    <ThermalFigure />
    <Steps><li>Fuel such as coal is burned. Its chemical energy heats water in the <strong>boiler</strong>.</li><li>The water becomes steam.</li><li>The steam turns the turbine, and the turbine turns the generator.</li><li>The steam is cooled in the <strong>condenser</strong> and turns back to water.</li><li>A pump sends the water back to the boiler.</li></Steps>
    <Rule>Chemical energy → heat → movement of steam and turbine → electrical energy.</Rule>
    <p>In both, some energy is lost as heat and sound. The water or steam turns the turbine only. It does not go through the generator.</p>
    <QA q="What is the same, and what is different, about hydro and thermal stations?" a="Both use a turbine to turn a generator. Hydro starts with the energy of stored high water. Thermal starts with the chemical energy of a fuel and uses steam." />
  </Card>
  </div>;
}
