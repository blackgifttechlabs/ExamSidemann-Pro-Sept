import React from 'react';

const imageRoot = '/images/courses/o-level/combined-science/form-4/';
function Diagram({ name, caption }: { name: string; caption: string }) {
  return <figure className="my-5"><img src={`${imageRoot}phys-magnetism-${name}.webp`} alt={caption} loading="lazy" decoding="async" className="mx-auto block h-auto w-full rounded-2xl border border-slate-200 bg-white object-contain" style={{ maxHeight: 'min(60svh, 600px)' }} /><figcaption className="mt-2 text-sm leading-relaxed text-slate-600">{caption}</figcaption></figure>;
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><h3 className="mb-4 text-xl font-bold text-slate-900">{title}</h3><div className="space-y-4 text-base leading-relaxed text-slate-700">{children}</div></section>;
}
function KeyIdea({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-sky-50 p-4 text-sky-950">{children}</p>; }
function Question({ question, children }: { question: string; children: React.ReactNode }) {
  return <details className="rounded-xl border border-sky-200 bg-sky-50 p-4"><summary className="cursor-pointer font-semibold text-sky-950">{question}</summary><div className="mt-3 space-y-2 text-slate-700">{children}</div></details>;
}
function Table({ headings, rows }: { headings: string[]; rows: string[][] }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead className="bg-sky-50"><tr>{headings.map(h => <th key={h} scope="col" className="border border-slate-200 p-3 text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="border border-slate-200 p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>;
}

export default function Magnetism() {
  return <div className="not-prose space-y-6">
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-slate-800 sm:p-6"><p>A magnet can pull on iron without touching it. An electric current can also make a magnetic field. These two ideas help us explain how a motor turns and how a generator produces electricity.</p><p className="mt-3">Start with magnets and their fields. Then follow the experiments, compare motors with generators, and trace the energy changes in power stations. Try each question before opening its answer.</p></div>

    <Section title="1. Types of magnets">
      <Diagram name="types" caption="Bar, horseshoe, C and E shapes. A magnet’s shape helps you identify its type." />
      <p>A <strong>magnet</strong> produces a magnetic field. Magnets come in different shapes. A bar magnet is straight. A horseshoe magnet has a U shape, with its two poles close together. C-magnets and E-magnets have shapes like the letters C and E.</p>
      <p>Classify a set of magnets by looking at their shapes. Draw four columns headed bar, horseshoe, C and E, then place each example in the correct column. An E-shaped magnetic core has three limbs joined by a back piece.</p>
      <p>Shape and source of magnetism are different ideas. A <strong>permanent magnet</strong> keeps its magnetism without an electric current. An <strong>electromagnet</strong> gets its magnetic field from a current. A C- or E-shaped core can form part of an electromagnet; its shape alone does not mean it is a permanent magnet.</p>
    </Section>

    <Section title="2. Magnetic materials and poles">
      <p>A <strong>magnetic material</strong> is strongly attracted by a magnet in an ordinary classroom test. Iron and steel are examples. Copper, aluminium, wood, plastic and glass are classed as <strong>non-magnetic</strong> in this test.</p>
      <KeyIdea><strong>Not all metals are magnetic.</strong> Iron nails are attracted, but copper and aluminium samples are not attracted like iron.</KeyIdea>
      <p>Test the samples one at a time with the same bar magnet. Bring the magnet close, observe whether the sample is attracted, and record the result. Use the material itself when classifying it: an object may contain several materials.</p>
      <p>A bar magnet has a <strong>north pole (N)</strong> and a <strong>south pole (S)</strong>. The pull is strongest near its poles. Cutting a magnet in half produces two smaller magnets, each with a north and a south pole; it does not produce a separate north pole and a separate south pole.</p>
      <h4 className="text-lg font-bold text-slate-900">How to identify the poles</h4>
      <ol className="list-decimal space-y-2 pl-6"><li>Tie a string around the centre of a bar magnet so it hangs horizontally and can turn freely.</li><li>Keep other magnets and large iron objects away. Let it settle.</li><li>The end that points towards geographic north is its north-seeking pole, called its north pole. The other end is its south pole.</li><li>Use a compass to check the direction. Turn the suspended magnet gently and let it settle again to confirm the result.</li></ol>
      <p>Earth has a magnetic field and behaves approximately like a large magnet. A compass needle is a small magnet that lines up with this field. Near geographic north, Earth behaves like a magnetic south pole: this attracts the north-seeking end of the compass. Geographic and magnetic poles are not exactly at the same positions.</p>
      <Question question="A pupil says every metal is magnetic. How would you show that this is wrong?"><p>Bring the same magnet near iron, copper and aluminium. Iron is strongly attracted; copper and aluminium are not attracted like iron. These metal samples show that being a metal does not automatically make a material magnetic.</p></Question>
    </Section>

    <Section title="3. Properties of magnets and magnetic fields">
      <Diagram name="fields" caption="Field lines around a bar magnet and between facing poles. Outside magnets, arrows point from north to south." />
      <KeyIdea><strong>Like poles repel; unlike poles attract.</strong> N–N and S–S push apart. N–S pull together. This is the law of magnetism.</KeyIdea>
      <p>Bring one pole of a magnet near each end of a second magnet. You should find attraction in one case and repulsion in the other. Repeat with the first magnet reversed.</p>
      <p><strong>Repulsion is the reliable test for a magnet.</strong> An iron nail can be attracted by either pole of a magnet even when the nail is not a permanent magnet. If an object repels a known magnet, the object is also a magnet, with a like pole facing it.</p>
      <p>A <strong>magnetic field</strong> is a region where magnetic forces can act. Field lines are a way of drawing its direction and strength. They are not physical strings around a magnet.</p>
      <ul className="list-disc space-y-2 pl-6"><li>Outside a magnet, draw arrows <strong>from N to S</strong>. Inside the magnet, the field continues from S to N, making complete loops.</li><li>Draw smooth lines that do not cross. At one point, the field cannot have two different directions.</li><li>Closer lines represent a stronger field. They are closest near the poles.</li><li>Between unlike poles, lines connect across the gap. Between like poles, they bend away from one another. Equal like poles can have a point between them where their fields cancel.</li></ul>
      <h4 className="text-lg font-bold text-slate-900">Finding the pattern and the direction</h4>
      <p>Put plain paper over a bar magnet and sprinkle a small amount of iron filings on the paper. Tap gently. The filings line up and show the field pattern, with more crowding near the poles. <strong>Filings show the pattern, but do not tell you which way the field points.</strong></p>
      <p>To find direction, place a plotting compass beside the magnet and mark the direction of its north-seeking tip. Move it a short distance along that direction and mark again. Join the marks with a smooth curve and add an arrow. Repeat from several starting points. You can also repeat the filings and compass tests with like and unlike poles facing each other.</p>
      <Question question="Why are field lines drawn closer together near the poles?"><p>The magnetic field is stronger near the poles. A greater concentration of field lines represents greater field strength.</p></Question>
      <Question question="A bar magnet attracts an unknown object. Does this prove that the object is a magnet?"><p>No. It may simply be a magnetic material such as iron. Test for repulsion with a known pole. Repulsion shows that the object is a magnet.</p></Question>
    </Section>

    <Section title="4. Electromagnetism: a current produces a field">
      <Diagram name="wire" caption="Viewed from above: current towards you gives an anticlockwise magnetic field around the straight wire." />
      <p><strong>Electromagnetism</strong> links electricity and magnetism. A wire carrying an electric current has a magnetic field around it. Around a long straight wire, the field lines form circles centred on the wire.</p>
      <h4 className="text-lg font-bold text-slate-900">An experiment with a straight wire</h4>
      <ol className="list-decimal space-y-2 pl-6"><li>Pass a straight copper wire vertically through a piece of card. Connect it to a teacher-set low-voltage d.c circuit with a switch and suitable current control.</li><li>Put a plotting compass on the card near the wire. With the current off, note its direction.</li><li>Switch the current on briefly. The compass turns, showing that the current has produced a magnetic field.</li><li>Move the compass around the wire. Its north-seeking end lies along the circular field. Iron filings on the card also show a circular pattern.</li><li>Reverse the current. The compass direction reverses. Switch off: the field caused by the current disappears, and the compass responds mainly to Earth’s field again.</li></ol>
      <p>Use the <strong>right-hand grip rule</strong> to find direction. Point your right thumb along conventional current, from positive to negative in the external circuit. Your curled fingers show the field direction. A dot (•) means current towards you; a cross (×) means current away from you. Looking at the page, a dot gives an anticlockwise field and a cross gives a clockwise field.</p>
      <p>A larger current produces a stronger field. The field of a long straight wire is weaker farther from the wire. Keep the compass position fixed when comparing different currents.</p>
      <Diagram name="solenoid" caption="A solenoid behaves like a bar magnet. Inside this coil, the field points from its south end towards its north end." />
      <p>A <strong>solenoid</strong> is a long coil of wire. The fields of its turns combine. Inside a long solenoid, the field lines are nearly straight, parallel and equally spaced, so the field is nearly uniform. Outside, the pattern resembles a bar magnet, with a north and south end.</p>
      <p>Wrap your right fingers in the direction of current around the coil: your thumb points towards its north end. Viewed directly from one end, anticlockwise current makes that end north; clockwise current makes it south. Reversing the current swaps the poles.</p>
      <p>Repeat the field experiment with a solenoid, using a plotting compass at its ends and around its sides. This shows how winding the wire changes the pattern from circles around a straight wire to a bar-magnet-like field.</p>
      <Question question="How can you show that the field around the wire is caused by the current?"><p>Compare the compass with current off, current on and current reversed. It turns when the current flows, and its deflection reverses when the current reverses. These changes link the magnetic field to the current.</p></Question>
    </Section>

    <Section title="5. The motor effect and a d.c motor">
      <Diagram name="motor-effect" caption="With the field to the right and current towards you, the force on this wire is upwards." />
      <p>A current-carrying wire placed across a magnetic field experiences a force. The wire’s own magnetic field interacts with the field of the magnets. If the wire is free to move, it moves. This is the <strong>motor effect</strong>.</p>
      <p>Place a freely moving wire between magnet poles and connect it to a controlled low-voltage d.c supply. Switch on briefly and observe its movement. Reverse the current and repeat: the movement reverses. Restore the current, then reverse the magnetic poles: movement also reverses. With no current, there is no motor-effect force.</p>
      <p>The field direction is from N to S. The force is at right angles to both the current and the field. Use <strong>Fleming’s left-hand rule</strong>: hold the thumb, first finger and second finger at right angles. First finger = field; second finger = conventional current; thumb = force or motion. A wire parallel to the field has no motor-effect force.</p>
      <KeyIdea>Reverse the current <strong>or</strong> reverse the field: the force reverses. Reverse <strong>both</strong>: the force stays in its original direction.</KeyIdea>
      <Diagram name="motor" caption="A simple d.c motor has a rotating coil, magnets, carbon brushes and a split-ring commutator connected to a d.c supply." />
      <h4 className="text-lg font-bold text-slate-900">Why the coil keeps turning</h4>
      <ol className="list-decimal space-y-2 pl-6"><li>The d.c supply sends current through the brushes, split ring and coil.</li><li>Current travels in opposite directions along the two opposite sides of the coil. In the magnetic field, these sides experience opposite forces.</li><li>The forces act at different positions and produce a turning effect. The coil and axle rotate.</li><li>Every half-turn, the split-ring commutator changes which brush connects to each coil end. This reverses the current in the coil.</li><li>The current reversal keeps the turning effect in the same rotational direction. The coil’s motion carries it through the brief position where the turning effect is zero.</li></ol>
      <Table headings={['Part', 'What it does']} rows={[
        ['Magnets', 'Provide the magnetic field.'], ['Coil', 'Carries current; forces on its sides produce rotation.'], ['Axle', 'Turns with the coil and transfers motion.'], ['Carbon brushes', 'Maintain electrical contact with the rotating commutator.'], ['Split-ring commutator', 'Reverses current in the coil every half-turn.'], ['D.c supply', 'Provides electrical energy.'],
      ]} />
      <p>A motor converts <strong>electrical energy into mechanical (kinetic) energy</strong>. Some energy is also transferred to heating and sound.</p>
      <p>A stronger magnetic field, more turns on the coil, or a larger current increases the turning effect, with other conditions unchanged. This helps the motor turn against a load. Its actual speed also depends on the load and motor design.</p>
      <p>When constructing a simple model motor with a copper coil, magnets and a d.c supply, check that the coil can turn freely and that its contacts change the coil current at the correct point. Compare it with a motor model to identify the brushes and commutator.</p>
      <Question question="Why does a d.c motor need a split-ring commutator?"><p>It reverses the current in the coil every half-turn. The forces on the coil then keep producing a turning effect in the same rotational direction, allowing continuous rotation.</p></Question>
      <Question question="Give three ways to increase the turning effect on a motor coil."><p>Use a stronger magnetic field, increase the number of coil turns, or increase the current, keeping other conditions the same.</p></Question>
    </Section>

    <Section title="6. The generator effect">
      <Diagram name="induction" caption="Moving the same magnet into and out of a coil gives opposite galvanometer deflections. Holding it still gives no sustained deflection." />
      <p>Moving a magnet relative to a coil can produce a voltage across the coil. This is <strong>electromagnetic induction</strong>. The voltage is called an <strong>induced electromotive force (e.m.f.)</strong>, measured in volts. Despite its name, e.m.f. is not a mechanical force measured in newtons.</p>
      <p>The important change is in the magnetic field passing through the coil. A changing field produces an electric field that can drive charges. If the circuit is complete, an induced current flows. A voltage can exist even when the circuit is open and no current flows.</p>
      <h4 className="text-lg font-bold text-slate-900">The magnet-and-coil experiment</h4>
      <ol className="list-decimal space-y-2 pl-6"><li>Connect a copper coil to a sensitive centre-zero galvanometer. Do not connect a battery to this induction circuit.</li><li>Push one pole of a bar magnet into the coil. The pointer deflects while the magnet moves.</li><li>Hold the magnet still inside the coil. The pointer returns to zero because the field through the coil is no longer changing.</li><li>Pull the magnet out. The pointer deflects in the opposite direction.</li><li>Repeat with the other pole entering first. The direction of the deflection reverses compared with the first test.</li></ol>
      <p>The left or right deflection depends on how the coil and meter are connected. What matters is that reversing the motion, or reversing the pole, reverses the deflection. Moving the coil while keeping the magnet still can also produce induction: <strong>relative motion</strong> means motion of one compared with the other.</p>
      <Table headings={['Change', 'Effect, with other conditions kept the same']} rows={[
        ['Stronger magnet', 'A greater change of field through the coil can produce a larger induced e.m.f.'], ['Faster relative motion', 'The field through the coil changes faster, producing a larger induced e.m.f.'], ['More turns', 'More turns contribute to the induced e.m.f., so the total is larger.'], ['Larger coil area in a rotating generator', 'At the same speed and field, more changing field passes through the coil, increasing its e.m.f.'],
      ]} />
      <p>Investigate one factor at a time. For example, use the same magnet and coil, move the magnet through the same distance at two speeds, and compare the greatest deflections. For turns, use coils of the same area and keep the magnet’s movement similar. A larger coil is not automatically better if most of its area lies outside the magnetic field.</p>
      <Diagram name="generators" caption="A.c generators use two continuous slip rings. Simple d.c generators use a split-ring commutator. Both are driven mechanically." />
      <h4 className="text-lg font-bold text-slate-900">Turning motion into electricity</h4>
      <p>A <strong>generator</strong> converts mechanical energy into electrical energy. A turning coil in a magnetic field has a changing field passing through it, so an e.m.f. is induced. A hand crank or turbine supplies the motion. The generator does not create energy from nothing.</p>
      <p>In a simple <strong>a.c generator</strong>, each coil end connects to its own continuous slip ring. Stationary brushes collect the output while the rings turn. The induced voltage reverses every half-turn, so current in a connected load alternates direction.</p>
      <p>In a simple <strong>d.c generator</strong>, the coil ends connect to the two insulated halves of a split-ring commutator. It swaps the connections to the external circuit every half-turn. Although the induced voltage within the coil reverses, the output across the external circuit keeps the same polarity.</p>
      <Diagram name="output" caption="A.c voltage alternates above and below zero. A simple single-coil d.c generator gives positive pulses that fall to zero between peaks." />
      <h4 className="text-lg font-bold text-slate-900">Reading and drawing the output graphs</h4>
      <p>Label the vertical axis <strong>voltage (V)</strong> and the horizontal axis <strong>time (s)</strong>. Draw and label the zero-voltage line.</p>
      <ul className="list-disc space-y-2 pl-6"><li>For a.c, draw a smooth repeating wave with positive and negative halves. The sign tells you the polarity of the output; it is not a statement that energy is “negative”.</li><li>For the simple d.c generator, draw repeated humps on the same side of zero. The voltage changes in size, but its polarity does not reverse. This is <strong>pulsating d.c.</strong>, not a flat, constant voltage.</li><li>A greater peak height means a larger maximum e.m.f. More cycles in the same time means higher frequency.</li><li>Turning the same a.c generator faster increases its peak e.m.f. and its frequency. A stronger field, more turns or a larger effective coil area increases the peak e.m.f. without changing frequency if rotation speed stays the same.</li></ul>
      <p>For a rotating coil, e.m.f. is greatest when its plane is parallel to the field: the field passing through it is changing fastest. It is zero when its plane is perpendicular to the field: at that instant the change is zero. Do not confuse the amount of field through the coil with how quickly it changes.</p>
      <Table headings={['Machine', 'Energy change', 'Connection at the rotating coil']} rows={[
        ['D.c motor', 'Electrical → mechanical', 'Split ring reverses coil current to maintain rotation.'], ['A.c generator', 'Mechanical → electrical', 'Slip rings give an alternating output.'], ['Simple d.c generator', 'Mechanical → electrical', 'Split ring gives a one-direction, pulsating output.'],
      ]} />
      <Question question="A strong magnet is held still inside a coil. Why is there no sustained induced current?"><p>The magnetic field through the coil is not changing. Magnet strength alone is not enough; a changing field is needed to induce an e.m.f.</p></Question>
      <Question question="How do you distinguish a.c from the output of a simple d.c generator on a voltage–time graph?"><p>The a.c graph crosses zero and has positive and negative halves, showing reversal of polarity. The simple d.c graph stays on one side of zero, although its size pulses. A flat line is not the correct output for a simple single-coil d.c generator.</p></Question>
    </Section>

    <Section title="7. Power generation: hydro and thermal">
      <Diagram name="hydro" caption="Water from a high reservoir turns a turbine. A shaft turns the generator, while the water returns to the river." />
      <h4 className="text-lg font-bold text-slate-900">Hydroelectric power</h4>
      <p>Water stored high behind a dam has gravitational potential energy. When released down a pipe called a <strong>penstock</strong>, it gains kinetic energy. The moving water turns a <strong>turbine</strong>, and the turbine’s shaft turns a <strong>generator</strong>. Electricity is produced by electromagnetic induction. Water leaves the turbine and returns to the river.</p>
      <KeyIdea>Gravitational potential energy of stored water → kinetic energy of flowing water → mechanical energy of the turbine → electrical energy from the generator.</KeyIdea>
      <Diagram name="thermal" caption="Burning fuel heats water into steam. Steam turns a turbine, the turbine drives a generator, and condensed water returns to the boiler." />
      <h4 className="text-lg font-bold text-slate-900">Thermal power</h4>
      <p>In a fuel-burning thermal power station, fuel such as coal burns in air. Its chemical energy heats water in a <strong>boiler</strong>. The water becomes steam. The moving steam turns a turbine connected by a shaft to a generator. After leaving the turbine, steam is cooled in a <strong>condenser</strong> and becomes liquid water. A pump returns this water to the boiler.</p>
      <KeyIdea>Chemical energy in fuel → thermal energy → mechanical energy of moving steam and the turbine → electrical energy from the generator.</KeyIdea>
      <p>The condenser transfers heat to a cooling system. Both kinds of power station lose some useful energy to heating and sound. In both, the <strong>turbine provides rotation</strong> and the <strong>generator produces electricity</strong>. Water or steam drives the turbine; it does not flow through the electrical generator.</p>
      <p>Use hydro and thermal power-station models to trace the water, steam and shaft connections. Explain the energy change at each stage, rather than only naming the equipment.</p>
      <Question question="What is the main similarity and the main difference between hydro and thermal power generation?"><p>Both use a turbine to drive a generator, which converts mechanical energy into electrical energy by induction. Hydro starts with water’s gravitational potential energy; a fuel-burning thermal station starts with the chemical energy of fuel and uses steam to turn its turbine.</p></Question>
    </Section>
  </div>;
}
