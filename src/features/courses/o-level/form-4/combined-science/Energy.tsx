import React from 'react';
import { Worked } from './NewtonIllustrations';
import { PicTable, QA, Chain, FormPic, BounceFigure, WorkFigure, LightFigure, SoundJarFigure, EngineFigure, ConductionFigure, ConvectionFigure, RadiationFigure, SolarCookerFigure, SolarHeaterFigure } from './EnergyIllustrations';

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-b border-slate-300 pb-6 last:border-b-0"><h3 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{title}</h3><div className="space-y-4 text-lg leading-relaxed text-slate-700">{children}</div></section>;
}
function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-base"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className="border border-slate-200 p-3 font-bold text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="border border-slate-200 p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>;
}
function Formula({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-sky-50 p-3 font-semibold text-sky-950">{children}</p>; }
const List = ({ children }: { children: React.ReactNode }) => <ul className="list-disc space-y-1 pl-6">{children}</ul>;
const Sub = ({ children }: { children: React.ReactNode }) => <p className="text-2xl font-bold text-slate-900">{children}</p>;

export default function Energy() { return <div className="not-prose space-y-6">
  <div className="space-y-3 text-lg leading-relaxed text-slate-700">
    <p><strong>Energy</strong> is what makes things happen. It lets things move, heat up, shine and make sound. We measure energy in <strong>joules (J)</strong>.</p>
    <p>Energy can be stored, and it can change from one form to another. In this lesson we follow where energy starts, how it changes, and where it goes.</p>
  </div>
  <hr className="border-slate-300" />

  <Card title="Forms of Energy">
    <p>Energy comes in different forms. Each form has its own name:</p>
    <PicTable headers={['', 'Form of energy', 'What it is', 'Example']} rows={[
      [<FormPic kind="kinetic" />, <strong>Kinetic</strong>, 'Energy of movement.', 'A rolling ball. Flowing water.'],
      [<FormPic kind="gpe" />, <strong>Gravitational potential</strong>, 'Energy stored because of height. The higher it is, the more it has.', 'A brick held high, ready to fall.'],
      [<FormPic kind="elastic" />, <strong>Elastic potential</strong>, 'Energy stored in something stretched or squashed.', 'A spring. A catapult band.'],
      [<FormPic kind="chemical" />, <strong>Chemical</strong>, 'Energy stored in fuels, food and cells. It is let out by a chemical change.', 'Petrol, firewood, a battery.'],
      [<FormPic kind="light" />, <strong>Light</strong>, 'Energy carried by light.', 'Sunlight. A torch.'],
      [<FormPic kind="thermal" />, <strong>Thermal (heat)</strong>, 'Energy of the moving particles in something. Heat flows from hot to cold.', 'A flame. A hot cup of tea.'],
      [<FormPic kind="electrical" />, <strong>Electrical</strong>, 'Energy carried by electric current in a circuit.', 'A lit bulb. A phone charger.'],
      [<FormPic kind="sound" />, <strong>Sound</strong>, 'Energy carried by vibrations.', 'A drum. A speaker.'],
    ]} />
    <Sub>Potential energy</Sub>
    <p>Gravitational, elastic and chemical energy are all <strong>potential energy</strong>. That means energy that is stored and ready to be used.</p>
    <List><li>A brick held higher has more gravitational potential energy than the same brick on the floor.</li><li>When you squash a spring, the work you do is stored in it as elastic potential energy.</li></List>
    <Sub>Energy changing form</Sub>
    <p>When a ball falls, its gravitational potential energy turns into kinetic energy. When it hits the ground, some energy goes into squashing the ball for a moment, and some becomes sound and heat. That is why the ball bounces back to a lower height each time.</p>
    <BounceFigure />
  </Card>

  <Card title="Energy Conversions">
    <p>An <strong>energy converter</strong> is something that changes energy from one form to another. We show this with an <strong>energy chain</strong>: arrows that go from the starting energy, to the useful energy, and to any other energy that comes out.</p>
    <div className="space-y-3">
      <Chain title="Torch" items={['Chemical energy in the cell', 'Electrical energy', 'Light energy + heat']} />
      <Chain title="Dynamo lighting a bulb" items={['Movement (kinetic) energy', 'Electrical energy', 'Light energy + heat']} />
      <Chain title="Catapult" items={['Chemical energy in your muscles', 'Elastic potential energy in the band', 'Kinetic energy of the stone']} />
      <Chain title="Solar panel" items={['Light energy', 'Electrical energy']} />
      <Chain title="Electric motor" items={['Electrical energy', 'Movement (kinetic) energy + heat + sound']} />
      <Chain title="Burning fuel" items={['Chemical energy', 'Heat + light energy']} />
    </div>
    <Sub>Conservation of energy</Sub>
    <p className="rounded-xl bg-amber-50 p-3 font-semibold text-slate-900">Energy cannot be created or destroyed. It can only change from one form to another.</p>
    <p>"Wasted" energy has not disappeared. It has spread out as heat into the surroundings, where it is no use to us. So the useful energy that comes out is always less than the energy that goes in.</p>
    <QA q="Why does a torch get warm when it gives out light?" a="Not all the electrical energy becomes light. Some of it becomes heat, which warms the bulb and the air around it. No energy is lost: it has just changed into a form we do not want." />
  </Card>

  <Card title="Work Done">
    <p><strong>Work</strong> is done when a force moves an object in the direction of the force. The work done is the energy that the force transfers. Work and energy both use the joule (J).</p>
    <Formula>Work done = force × distance moved in the direction of the force<br />W = F × d</Formula>
    <WorkFigure />
    <List><li>Change centimetres to metres before you calculate.</li><li>If you hold something still, you do no work on it, because it does not move. (Your muscles still use energy, but no work is done on the object.)</li></List>
    <Worked n={1} question="A force of 20 N moves a load 3 m in the direction of the force. Find the work done." steps={['Write the formula: W = F × d', 'Put in the numbers: W = 20 × 3']} answer="60 J" />
    <Worked n={2} question="You lift a brick weighing 50 N up by 0.4 m. How much energy goes into its gravitational potential energy?" steps={['The force needed is the weight: 50 N', 'Write the formula: W = F × d', 'Put in the numbers: W = 50 × 0.4']} answer="20 J" />
    <Worked n={3} question="A force of 15 N moves a trolley 80 cm in the same direction. Find the work done." steps={['Change cm to m: 80 cm = 0.80 m', 'Write the formula: W = F × d', 'Put in the numbers: W = 15 × 0.80']} answer="12 J" />
  </Card>

  <Card title="Light Travels in Straight Lines">
    <p>Some things give out their own light. They are <strong>light sources</strong>: the Sun, a fire and an electric bulb. The Moon is not a light source. We see it because it reflects sunlight.</p>
    <p>In a clear material, light travels in <strong>straight lines</strong>. You can show this with a torch and three cards that each have a small hole.</p>
    <LightFigure />
    <List><li>When the holes are in a straight line, the light goes through all three.</li><li>When you move the middle card sideways, the light is blocked.</li><li>An object that blocks light makes a shadow. The light does not bend round it.</li></List>
  </Card>

  <Card title="Sound">
    <p>Sound is made by something <strong>vibrating</strong>, like a guitar string, a drum skin, or the air in a flute. The vibrating thing makes the particles next to it vibrate. They pass the vibration to the next particles, and so on. The sound travels, but each particle only moves back and forth a little.</p>
    <p>Sound can travel through solids, liquids and gases. It needs a <strong>material medium</strong>: something made of particles. So <strong>sound cannot travel through a vacuum</strong> (empty space).</p>
    <SoundJarFigure />
    <List><li>An electric bell rings inside a sealed jar. You can hear it.</li><li>Pump the air out. The sound gets quieter, even though the bell is still shaking. Let the air back in and it gets louder.</li><li>You can still see the bell, because light can travel through a vacuum.</li></List>
    <QA q="Why can an astronaut see an explosion in space but not hear it?" a="Light can travel through empty space, so the astronaut can see it. Sound needs particles to carry it, and there are none in space." />
  </Card>

  <Card title="Petrol and Diesel Engines">
    <p>An engine changes the <strong>chemical energy</strong> in fuel into <strong>movement energy</strong>. In a <strong>four-stroke engine</strong>, the piston moves four times (up, down, up, down) to finish one cycle. The crankshaft turns <strong>two full turns</strong> in that cycle.</p>
    <Sub>Petrol engine</Sub>
    <EngineFigure kind="petrol" />
    <Table headers={['Stroke', 'What happens']} rows={[
      [<strong key="a">1. Intake</strong>, 'The piston moves down. The inlet valve is open. A mixture of fuel and air comes in.'],
      [<strong key="b">2. Compression</strong>, 'The piston moves up. Both valves are shut. The mixture is squeezed.'],
      [<strong key="c">3. Power</strong>, 'A spark lights the mixture. The hot gas expands and pushes the piston down.'],
      [<strong key="d">4. Exhaust</strong>, 'The piston moves up. The exhaust valve is open. The burnt gases go out.'],
    ]} />
    <Sub>Diesel engine</Sub>
    <p>A diesel engine uses the same four strokes, but it lights the fuel in a different way. Only <strong>air</strong> comes in. When the air is compressed it gets very hot. Fuel is sprayed in near the end of compression and it lights by itself.</p>
    <EngineFigure kind="diesel" />
    <Sub>Petrol or diesel?</Sub>
    <Table headers={['', 'Petrol', 'Diesel']} rows={[
      [<strong key="a">What lights the fuel</strong>, 'A spark plug.', 'The heat of the compressed air.'],
      [<strong key="b">What goes in on intake</strong>, 'Fuel and air.', 'Air only.'],
      [<strong key="c">Efficiency</strong>, 'Usually lower.', 'Often higher, because the air is compressed more.'],
      [<strong key="d">Carbon monoxide</strong>, 'Made when the fuel does not burn fully.', 'Can also be made, but a diesel engine usually has plenty of air. Neither engine is free of pollution.'],
    ]} />
    <Sub>Getting the fuel in</Sub>
    <List><li>A <strong>carburettor</strong> uses the flow of air to pull fuel into the air and make the mixture. It is used in older petrol engines.</li><li>A <strong>fuel injector</strong> sprays a measured amount of fuel. Modern engines use it.</li><li>The <strong>computer box</strong> (electronic control unit) reads sensors and controls the fuel, and the spark in a petrol engine. This saves fuel and cuts pollution. The engine still uses the same four strokes.</li></List>
    <QA q="Why does a diesel engine not need a spark plug?" a="The air gets very hot when it is compressed. The diesel fuel that is sprayed in lights by itself in that hot air." />
  </Card>

  <Card title="Heat Transfer">
    <p>Heat moves from a hot place to a cold place in three ways: conduction, convection and radiation.</p>
    <Sub>Conduction</Sub>
    <p><strong>Conduction</strong> is heat moving through a solid. The hot particles pass their energy to the particles next to them, and the energy travels along. Metals conduct heat well. Plastic, wood and trapped air are poor conductors, so they are good insulators.</p>
    <ConductionFigure />
    <Sub>Convection</Sub>
    <p><strong>Convection</strong> is heat moving in a liquid or a gas, because the liquid or gas itself moves. When it is heated, it expands and gets less dense, so it <strong>rises</strong>. Cooler, denser liquid sinks to take its place. This circle of movement is a <strong>convection current</strong>. The particles do not get lighter. There are just fewer of them in the same space.</p>
    <ConvectionFigure />
    <Sub>Radiation</Sub>
    <p><strong>Radiation</strong> is heat travelling as waves (mostly infrared). It does not need any material to travel through. This is how the Sun's energy reaches the Earth across empty space.</p>
    <RadiationFigure />
    <Table headers={['Surface', 'What it does with radiation']} rows={[
      [<strong key="a">Dull black</strong>, 'Takes in radiation well and gives it out well. A poor reflector.'],
      [<strong key="b">Shiny or light-coloured</strong>, 'Reflects radiation well. Takes in and gives out radiation poorly.'],
    ]} />
    <p>So a black surface in the Sun warms up faster than a shiny one.</p>
    <QA q="Why does warm air rise? Do its particles get lighter?" a="Warm air expands and becomes less dense than the cooler air around it, so it rises. The particles do not get lighter: there are just fewer of them in the same space." />
  </Card>

  <Card title="Solar Cooker and Solar Water Heater">
    <Sub>Solar cooker</Sub>
    <p>A <strong>solar cooker</strong> uses sunlight to cook food. Each part has a job:</p>
    <List><li>A <strong>shiny reflector</strong> sends more sunlight to the pot.</li><li>A <strong>dull black pot</strong> takes in the radiation well.</li><li>A <strong>clear cover</strong> lets the sunlight in and keeps the hot air in.</li><li><strong>Insulation</strong> stops heat from escaping.</li></List>
    <SolarCookerFigure />
    <p>It works best in strong sunlight, pointed at the Sun.</p>
    <Sub>Solar water heater</Sub>
    <p>A <strong>solar water heater</strong> has a dark <strong>collector</strong> that takes in sunlight and heats the water. A clear cover and insulation help to keep the heat in.</p>
    <p>In a simple heater with no pump, the tank is <strong>above</strong> the collector. The warm water becomes less dense and rises into the tank. Cooler water flows down to the collector. The water keeps circulating by itself.</p>
    <SolarHeaterFigure />
    <p>Both devices change light energy into heat. A <strong>solar panel</strong> is different: it changes light energy into electricity.</p>
    <QA q="Why is the water tank above the collector in a simple solar water heater?" a="The warm water is less dense, so it rises from the collector into the tank. The cooler water goes down to the collector. The water circulates without a pump." />
  </Card>

  <Card title="Telecommunication">
    <p><strong>Telecommunication</strong> means sending information over a distance, for example by phone call or email. The information is first turned into signals.</p>
    <Chain title="How a message is sent" items={['Information', 'Encoding', 'Transmitter', 'Medium', 'Receiver', 'Decoding', 'Output']} />
    <Sub>A phone call</Sub>
    <Chain items={['Your voice (sound)', 'Microphone: electrical signal', 'Phone sends a radio signal', 'Base station and network', 'Other phone receives the signal', 'Speaker: sound']} />
    <p>An <strong>email</strong> is different. The text is turned into digital data and sent through a network to mail servers. The other person's device turns the data back into a message on the screen.</p>
    <Sub>Media that carry signals</Sub>
    <Table headers={['Medium', 'How it carries signals']} rows={[
      [<strong key="a">Optic fibre</strong>, 'Pulses of light travel along a thin glass fibre. Electrical signals are turned into light at one end and back again at the other.'],
      [<strong key="b">Coaxial cable</strong>, 'Electrical signals travel along a central wire. It has insulation and a metal shield around it.'],
      [<strong key="c">Sheathed pair cable</strong>, 'Pairs of insulated wires inside a cover. The pairs are often twisted to cut interference.'],
      [<strong key="d">Wi-Fi</strong>, 'Radio waves carry data between a device and a wireless access point.'],
    ]} />
    <p>Wi-Fi is a short radio link to a network. A mobile phone can also use a mobile base station. Not every mobile call is a Wi-Fi call.</p>
    <QA q="Describe the energy changes at the two ends of a voice call." a="At the sending phone, the microphone changes sound into an electrical signal. At the receiving phone, the speaker changes an electrical signal back into sound. In between, radio links change electrical signals into radio waves and back." />
  </Card>
</div>; }
