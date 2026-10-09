import React from 'react';
import { NoteSection as Section, NoteImage, Idea, Check, NoteTable as Table } from './PhysicsNotes';
const Image = ({ name, caption }: { name: string; caption: string }) => <NoteImage topic="energy" name={name} caption={caption} />;
export default function Energy() { return <div className="not-prose space-y-6">
  <Idea><p>Energy lets things move, heat up, give out light and make sound. It can be stored and transferred. In this lesson, trace where energy starts, how it changes, and where it goes.</p><p className="mt-3">Use the diagrams and experiments to explain engines, heat transfer, solar devices and communication. For calculations, write the formula, convert the units, then substitute the values.</p></Idea>
  <Section title="1. Effects and forms of energy">
    <Image name="forms" caption="Energy can be associated with motion, position, stretched or compressed materials, fuels, light, heat, electricity and sound." />
    <p>Energy is the capacity to do work. We recognise its effects when an object moves, a material changes temperature, or a source produces light or sound. Energy is measured in <strong>joules (J)</strong>.</p>
    <Table headings={['Form', 'Meaning / example']} rows={[
      ['Kinetic', 'Energy of motion: a moving ball or flowing water.'], ['Gravitational potential', 'Stored energy due to position: a raised brick can fall.'], ['Elastic potential', 'Stored energy in a stretched or compressed object: a spring or catapult.'], ['Chemical', 'Stored energy in fuels, food and cells, released through chemical changes.'], ['Light', 'Energy carried by light, such as sunlight.'], ['Thermal (heat)', 'Energy associated with particles; heating transfers energy because of a temperature difference.'], ['Electrical', 'Energy transferred electrically in a circuit.'], ['Sound', 'Energy carried by vibrations through a medium.'],
    ]} />
    <p>Gravitational, elastic and chemical energy are forms of potential energy in the document’s grouping. Compare a brick on the floor and the same brick held higher; the higher brick has more gravitational potential energy. Compress a spring: work done on it stores elastic potential energy.</p>
    <p>Run upstairs, raise a brick, light a torch, clap your hands and watch a ball bounce. Identify what changes each time. When a ball falls, gravitational potential energy becomes kinetic energy. On impact, some energy is stored briefly in deformation, and some spreads out as sound and heating. This helps explain why it usually bounces to a lower height.</p>
  </Section>
  <Section title="2. Energy conversions and chains">
    <p>An <strong>energy converter</strong> changes energy from one form to another. An energy chain uses arrows to show the sequence. Name the starting form, the useful output, and any other outputs.</p>
    <Table headings={['Device / action', 'Energy chain']} rows={[
      ['Torch', 'Chemical energy in cell → electrical energy → light and thermal energy.'], ['Dynamo lighting a bulb', 'Mechanical energy → electrical energy → light and thermal energy.'], ['Catapult', 'Chemical energy in muscles → elastic potential energy → kinetic energy of the projectile.'], ['Solar photovoltaic panel', 'Light energy → electrical energy.'], ['Electric motor', 'Electrical energy → mechanical energy, with heating and sound.'], ['Burning fuel', 'Chemical energy → thermal energy and light.'],
    ]} />
    <p>Try lighting a torch and turning a dynamo to light a bulb. The torch needs a cell; the dynamo needs motion. With a catapult model, notice that the stretched band must first store energy. With a solar panel, compare its output in brighter and dimmer light.</p>
    <Idea><strong>Energy cannot be created or destroyed.</strong> It is transferred or converted. This is the law of conservation of energy.</Idea>
    <p>“Wasted” energy has not disappeared. It has spread into less useful forms, often heating the surroundings. A converter’s useful output is less than its total input when some energy goes elsewhere.</p>
    <Check question="Why does a torch become warm as it gives out light?"><p>Not all the electrical energy becomes useful light. Some is transferred to thermal energy, warming the lamp and surroundings. Energy is conserved.</p></Check>
  </Section>
  <Section title="3. Work done and light travelling in straight lines">
    <p><strong>Work is done</strong> when a force moves an object through a distance in the force’s direction. Work done is energy transferred by that force. Both work and energy have the unit joule.</p>
    <Idea><p><strong>Work done = force × distance moved in the force’s direction.</strong><br />W = Fd.</p><p className="mt-2">A 20 N force moves a load 3 m along its direction: W = 20 × 3 = <strong>60 J</strong>. Lifting a 50 N brick by 0.4 m transfers 50 × 0.4 = <strong>20 J</strong> to gravitational potential energy.</p></Idea>
    <p>Convert centimetres to metres before calculating. If a force holds an object still, its work on that object is zero because the displacement is zero, even though the person holding it may use energy in their muscles. In an experiment, measure the force with a spring balance and the distance with a ruler.</p>
    <Image name="light" caption="Light reaches the screen when the holes are aligned. Moving the middle card blocks the straight path." />
    <p>The Sun, fire and an electric bulb are light sources because they emit light. The Moon is seen by reflected sunlight; it is not producing its own visible light in this example.</p>
    <p>In a uniform transparent medium, light travels in straight lines. Arrange a torch and three cards with small holes in a straight line. Light passes through all three. Move the middle card sideways: the light is blocked. An opaque object blocks light and produces a shadow, showing that light does not simply bend around the object to fill the shadow.</p>
    <Check question="A force of 15 N moves a trolley 80 cm in the same direction. Find the work done."><p>80 cm = 0.80 m. W = 15 × 0.80 = <strong>12 J</strong>.</p></Check>
  </Section>
  <Section title="4. Sound is produced by vibrations">
    <Image name="sound" caption="The bell continues vibrating as air is removed, but it becomes quieter because less air is available to carry the sound." />
    <p>A vibrating object produces sound. A guitar string vibrates; a drum skin vibrates; the air in a wind instrument vibrates. The source makes nearby particles vibrate, and they transfer the disturbance to neighbouring particles. Sound energy travels while particles move back and forth around their usual positions.</p>
    <p>Sound can travel through solids, liquids and gases. It requires a <strong>material medium</strong>, meaning matter with particles. It cannot travel through a vacuum.</p>
    <p>In a bell-jar experiment, an electric bell rings inside a sealed jar. With air present, it is heard. Pump air out: the sound becomes quieter although the bell is still vibrating. Let air back in and the sound becomes louder. This supports the idea that air carries sound. A real apparatus may still transmit some vibration through its supports, so it need not become perfectly silent.</p>
    <p>You can still see the bell through the jar because light can travel through a vacuum. Do not confuse the conditions needed for light and sound.</p>
    <Check question="Why can an astronaut see an explosion in space but not hear its sound through empty space?"><p>Light can travel through a vacuum. Sound needs a material medium, and empty space has no suitable medium to carry it.</p></Check>
  </Section>
  <Section title="5. Four-stroke petrol and diesel engines">
    <div className="grid min-w-0 gap-4 xl:grid-cols-2"><Image name="petrol" caption="A simple petrol engine takes in a fuel–air mixture, compresses it, ignites it with a spark, and expels the exhaust." /><Image name="petrol-exam" caption="Exam-style image of the four petrol-engine strokes. A spark ignites the compressed fuel–air mixture." /></div>
    <p>An engine converts chemical energy in fuel into mechanical energy. In a four-stroke engine, the piston moves up or down four times in one complete cycle. The crankshaft makes <strong>two complete turns</strong> per cycle.</p>
    <Table headings={['Stroke', 'Simple petrol-engine model']} rows={[
      ['Intake', 'Piston moves down. Inlet valve open; exhaust valve closed. A fuel–air mixture enters.'], ['Compression', 'Piston moves up. Both valves closed. The mixture is compressed.'], ['Power', 'A spark ignites the mixture near the end of compression. Hot gases expand and push the piston down. Both valves are closed in the simple model.'], ['Exhaust', 'Piston moves up. Inlet closed; exhaust open. Burnt gases leave.'],
    ]} />
    <div className="grid min-w-0 gap-4 xl:grid-cols-2"><Image name="diesel" caption="A diesel engine takes in air, compresses it until it is hot, then injects fuel that ignites without a spark." /><Image name="diesel-exam" caption="Exam-style image of the four diesel-engine strokes. Fuel is injected into hot compressed air and ignites without a spark." /></div>
    <p>A diesel engine uses the same four strokes but a different ignition method. On intake, <strong>air alone</strong> enters. Compression makes the air very hot. Fuel is injected near the end of compression and ignites in the hot air. Expanding gases drive the power stroke, then the exhaust stroke removes them.</p>
    <Table headings={['Feature', 'Petrol', 'Diesel']} rows={[
      ['Ignition', 'A spark plug normally starts combustion.', 'Fuel ignites in hot compressed air.'], ['Fuel supply', 'Older engines use a carburettor; modern engines commonly use injection.', 'Fuel is injected into the cylinder.'], ['Efficiency', 'Depends on design and conditions; modern control improves fuel use.', 'Often higher thermal efficiency because of higher compression and other design features.'], ['Carbon monoxide', 'Incomplete combustion, especially with a rich mixture, produces CO.', 'Also can produce CO; excess-air operation often reduces CO, but diesel is not emission-free.'],
    ]} />
    <p>A <strong>carburettor</strong> uses airflow to draw fuel into the incoming air and form a mixture. A <strong>fuel injector</strong> delivers a controlled amount of fuel as a spray. In modern petrol engines, fuel may enter the intake passage or be injected directly into the cylinder. The simple intake-mixture diagram represents the older or port-injected model, not every modern engine.</p>
    <p>An electronic control unit, often called the <strong>computer box</strong>, uses sensor readings to control fuel delivery and, in petrol engines, spark timing. Modern diesel systems control injection timing and quantity. Accurate control can improve starting, fuel efficiency and emissions compared with older carburettor systems. It does not remove the need for the four strokes.</p>
    <p>Use an engine model to follow piston motion and valve positions. During a garage visit, identify the fuel system and ignition method, then compare the model with a modern engine. Actual valve timing may overlap around stroke boundaries; the table gives the basic cycle.</p>
    <Check question="Why does a diesel engine not need a spark plug to ignite its fuel?"><p>The air becomes very hot during compression. Injected diesel fuel ignites in that hot air: compression ignition.</p></Check>
  </Section>
  <Section title="6. Conduction, convection and radiation">
    <Image name="heat" caption="Conduction transfers energy through material; convection carries energy with moving fluid; radiation can transfer energy through empty space." />
    <p><strong>Conduction</strong> transfers thermal energy through a material without the material flowing as a whole. Particles in a hotter region transfer energy to neighbouring particles. Metals conduct well partly because mobile electrons transfer energy. Plastic, wood and trapped air are poor thermal conductors.</p>
    <p>Compare equal-length metal and non-metal rods heated at one end. Use the same heating conditions and compare how quickly the far ends warm. Metal transfers energy more quickly. Insulating handles reduce energy transfer to the hand.</p>
    <p><strong>Convection</strong> transfers energy by the movement of liquids or gases. Heating usually makes a fluid expand and become less dense. In a gravitational field, the warmer fluid rises while cooler, denser fluid sinks to replace it. This circulation is a convection current. The particles do not become lighter; there are fewer particles per unit volume.</p>
    <p>Heat water gently at one side of a beaker and use a suitable tracer to show circulation. The water rises near the heated part, moves across, cools and sinks. Convection cannot happen through a solid in this way because the solid does not flow.</p>
    <p><strong>Thermal radiation</strong> transfers energy by electromagnetic waves, especially infrared. It needs no material medium. This is how energy from the Sun reaches Earth through space.</p>
    <Table headings={['Surface', 'Absorption, emission and reflection']} rows={[
      ['Dull black', 'Good absorber and emitter of thermal radiation; poor reflector.'], ['Shiny light or metallic', 'Good reflector; generally poor absorber and emitter of thermal radiation.'],
    ]} />
    <p>Compare dull black and shiny surfaces under the same radiation source. The black surface absorbs more and usually warms faster. When otherwise similar hot surfaces cool, the better emitter loses energy by radiation more readily. Keep material, area, starting temperature and conditions comparable.</p>
    <Check question="Why does warm air rise? Do its particles lose mass?"><p>It expands and becomes less dense, so buoyancy makes it rise among cooler, denser air. Individual particles do not lose mass.</p></Check>
  </Section>
  <Section title="7. A solar cooker and solar water heater">
    <Image name="solar-cooker" caption="A reflector directs sunlight towards a dark cooking pot. A cover and insulation reduce energy losses." />
    <p>A <strong>solar cooker</strong> uses sunlight to heat food. A shiny reflector directs more light towards the cooking area. A dull black pot absorbs radiation well. A transparent cover lets sunlight in while reducing air exchange, and insulated walls reduce energy loss by conduction. A suitable enclosed design also reduces other heat losses.</p>
    <p>The cooker needs strong sunlight and correct positioning. Explain each part by its function: the reflector redirects light; it does not absorb the light to heat itself as the main cooking mechanism.</p>
    <Image name="solar-heater" caption="In this passive solar heater, the collector is below the tank. Warm water rises to the tank, and cooler water returns to the collector." />
    <p>A <strong>solar water heater</strong> has a collector that absorbs sunlight and transfers energy to water. A dark absorber, a transparent cover and insulation help increase useful heating and reduce losses.</p>
    <p>In a passive thermosyphon design, the tank is above the collector. Heated water becomes less dense and rises into the tank. Cooler water moves down to the collector, forming circulation. Some other designs use a pump, so the same layout is not required for every solar heater.</p>
    <p>Both devices convert incoming light to thermal energy. Neither should be confused with a solar photovoltaic panel, which produces electricity. Use models to identify surfaces, covers, insulation and the water-flow path.</p>
    <Check question="Why is the water-storage tank above the collector in a passive solar heater?"><p>Warm, less dense water can rise from the collector into the tank, while cooler water returns downwards. This allows natural circulation without a pump.</p></Check>
  </Section>
  <Section title="8. Telecommunication: sending information over distance">
    <Image name="telecom" caption="Information is encoded, transmitted through a suitable medium, received and decoded. Phone calls can combine radio links and cable networks." />
    <p><strong>Telecommunication</strong> means communicating over a distance. A mobile call and an email both transmit information, but the information must first be represented as signals.</p>
    <Idea>Source of information → encoding → transmitter → transmission medium → receiver → decoding → output.</Idea>
    <p>In a phone call, a microphone converts sound into an electrical signal. The phone processes and encodes it, then sends a radio signal to a base station. The network routes the information through radio or cable links to the receiving phone. That phone decodes it, and its speaker converts an electrical signal back into sound. The route can include many network devices.</p>
    <p>For email, text and other data are encoded digitally, sent through a network to mail servers, and delivered or made available to the recipient’s device. The recipient’s device decodes the information to display the message. Sending an email is not the same as transmitting a continuous voice signal.</p>
    <Table headings={['Medium', 'How it carries signals']} rows={[
      ['Optic fibre', 'Light pulses travel through a transparent fibre, guided by total internal reflection. Electrical signals are converted to light and back at the ends.'], ['Coaxial cable', 'Electrical signals travel along a central conductor with insulation and an outer conducting shield.'], ['Sheathed pair cable', 'Signals use insulated conductors inside a protective sheath; pairs are often twisted to reduce interference.'], ['Wi-Fi', 'Radio waves carry data between devices and a wireless access point.'],
    ]} />
    <p>Wi-Fi is a local radio connection to a network; a mobile phone can also use a cellular base station. These are related wireless ideas, but not every mobile call is a Wi-Fi call. In any system, identify what the transmitter converts, what travels through the medium, and what the receiver reconstructs.</p>
    <p>Examine fibre, coaxial and sheathed-pair cable samples, then compare them with wireless transmission. A visit to an internet or telecommunications provider can show how several media connect into one network.</p>
    <Check question="Describe the energy conversions at the two ends of a voice call."><p>At the sending microphone, sound is converted into an electrical signal. At the receiving speaker, an electrical signal is converted into sound. Radio links also involve conversion between electrical signals and electromagnetic waves.</p></Check>
  </Section>
</div>; }
