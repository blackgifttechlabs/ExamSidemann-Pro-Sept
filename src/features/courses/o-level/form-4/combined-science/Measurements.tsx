import React from 'react';

const imageRoot = '/images/courses/o-level/combined-science/form-4/';
function Diagram({ name, alt, caption = true }: { name: string; alt: string; caption?: boolean }) {
  return <figure className="my-5"><img src={`${imageRoot}phys-measurements-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="block h-auto w-auto max-w-full rounded-2xl border border-slate-200" style={{ maxHeight: 'min(60svh, 560px)' }} />{caption && <figcaption className="mt-2 text-left text-sm leading-relaxed text-slate-600">{alt}</figcaption>}</figure>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-b border-slate-300 pb-6 last:border-b-0"><h3 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">{title}</h3><div className="space-y-4 text-lg leading-relaxed text-slate-700">{children}</div></section>;
}
function Table({ headers, rows, plain = false }: { headers: string[]; rows: React.ReactNode[][]; plain?: boolean }) {
  const cell = plain ? 'border-b border-slate-200 p-3' : 'border border-slate-200 p-3';
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-base"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className={`${cell} font-bold text-slate-900`}>{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((v, j) => <td key={j} className={`${cell} align-top`}>{v}</td>)}</tr>)}</tbody></table></div>;
}
function Formula({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-sky-50 p-3 font-semibold text-sky-950">{children}</p>; }
function Sub({ children }: { children: React.ReactNode }) { return <p className="text-xl font-bold text-slate-900">{children}</p>; }
function List({ children }: { children: React.ReactNode }) { return <ul className="list-disc space-y-1 pl-6">{children}</ul>; }
function Steps({ children }: { children: React.ReactNode }) { return <ol className="list-decimal space-y-1 pl-6">{children}</ol>; }

export default function Measurements() {
  return <div className="not-prose space-y-6">
    <p className="text-lg leading-relaxed text-slate-700"><strong>Measuring</strong> means finding out how big, how heavy, how long or how hot something is, by using an instrument and writing the answer as a number with a unit.</p>
    <p className="text-lg leading-relaxed text-slate-700">So when we measure, we do three things:</p>
    <List>
      <li>choose the right instrument,</li>
      <li>read it the correct way,</li>
      <li>and write the number with its unit.</li>
    </List>
    <p className="text-lg leading-relaxed text-slate-700">A number on its own means nothing in the exam. "5" is not an answer. "5 cm" is.</p>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-xl border border-slate-200 p-3 text-center">
        <svg viewBox="0 0 120 60" className="mx-auto h-16 w-auto" aria-hidden="true"><rect x={8} y={18} width={104} height={26} rx={3} fill="#fde68a" stroke="#b45309" strokeWidth={2} />{Array.from({ length: 11 }, (_, i) => <path key={i} d={`M${16 + i * 9.4} 18 v${i % 5 === 0 ? 14 : 8}`} stroke="#78350f" strokeWidth={1.5} />)}</svg>
        <p className="mt-1 font-bold text-slate-900">1. Choose</p>
        <p className="text-base text-slate-600">A ruler for length, not a stopwatch.</p>
      </div>
      <div className="rounded-xl border border-slate-200 p-3 text-center">
        <svg viewBox="0 0 120 60" className="mx-auto h-16 w-auto" aria-hidden="true"><path d="M10 30 Q60 -5 110 30 Q60 65 10 30 Z" fill="#fff" stroke="#334155" strokeWidth={2.5} /><circle cx={60} cy={30} r={13} fill="#0284c7" /><circle cx={60} cy={30} r={6} fill="#0f172a" /></svg>
        <p className="mt-1 font-bold text-slate-900">2. Read</p>
        <p className="text-base text-slate-600">Look straight at the scale.</p>
      </div>
      <div className="rounded-xl border border-slate-200 p-3 text-center">
        <div className="flex h-16 items-center justify-center gap-4 text-2xl font-extrabold"><span className="text-red-600">5 ✗</span><span className="text-green-700">5 cm ✓</span></div>
        <p className="mt-1 font-bold text-slate-900">3. Write the unit</p>
        <p className="text-base text-slate-600">No unit, no mark.</p>
      </div>
    </div>
    <hr className="border-slate-300" />
    <Card title="Instruments and the Quantities They Measure">
      <List>
        <li>A <strong>quantity</strong> is the thing you want to find out, like length, mass, time or temperature.</li>
        <li>An <strong>instrument</strong> is the tool you use to measure it, like a ruler, a balance, a stopwatch or a thermometer.</li>
        <li>Each quantity has its own instrument and its own unit.</li>
      </List>
      <Diagram name="tools" caption={false} alt="Measuring tools: metre rule, thermometer, balance, stopwatch, measuring cylinder, overflow can, vernier callipers, ammeter and voltmeter." />
      <p>Each thing you measure has its own instrument and its own SI unit:</p>
      <Table headers={['Quantity', 'Instrument', 'SI unit', 'Symbol']} rows={[
        ['Length', 'Metre rule', 'metre', 'm'], ['Mass', 'Balance', 'kilogram', 'kg'], ['Time', 'Stopwatch', 'second', 's'], ['Temperature', 'Thermometer', 'kelvin', 'K'],
      ]} />
      <p>At school your thermometer usually reads in °C. Kelvin (K) is the SI unit and has no degree sign.</p>
      <Sub>How to measure well</Sub>
      <Steps>
        <li>Guess the answer first. This helps you spot a silly mistake later.</li>
        <li>Pick an instrument that suits the size of what you measure.</li>
        <li>Check that it starts at zero, and see what one small division is worth.</li>
        <li>Read from the right position and write the reading to the nearest division, with the unit.</li>
      </Steps>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div><p className="text-xl font-bold text-slate-900">Parallax error</p><Diagram name="parallax" caption={false} alt="Looking from above or below a pointer gives different apparent readings; looking straight on gives the correct reading." /></div>
        <div><p className="text-xl font-bold text-slate-900">Zero error</p><Diagram name="zero-error" caption={false} alt="An empty balance indicates +2.0 g. Subtract this positive zero error from an indicated 52.0 g to obtain 50.0 g." /></div>
      </div>
      <Table headers={['', 'Parallax error', 'Zero error']} rows={[
        ['When it happens', 'When you look at the scale from the side. From above or below you get a different reading; looking straight on gives the correct one.', 'When the instrument shows a number when it should show zero, like an empty balance showing 2.0 g.'],
        ['How to fix it', 'Put your eye straight in front of the mark. For a liquid, put your eye level with the liquid.', 'Reset it to zero if you can. If you cannot, correct your answer.'],
        ['How to correct the reading', 'No sum needed. Just read again from the right position.', <>
          <strong>Correct reading = reading shown − zero error</strong><br /><br />
          The empty balance shows +2.0 g and you read 52.0 g. So 52.0 − 2.0 = <strong>50.0 g</strong>.<br /><br />
          If the zero error is −2.0 g and you read 48.0 g, then 48.0 − (−2.0) = <strong>50.0 g</strong>.
        </>],
      ]} />
      <Sub>Accuracy and Precision</Sub>
      <p>Say a stone really weighs <strong>50 g</strong>. You weigh it three times.</p>
      <Table headers={['Your readings', 'What it means']} rows={[
        ['50 g, 51 g, 49 g', <><strong>Accurate</strong>: your readings are close to the true value (50 g).</>],
        ['58 g, 58 g, 58 g', <><strong>Precise</strong>: you get the same answer every time. But it is not close to 50 g, so it is not accurate.</>],
        ['50 g, 50 g, 50 g', <>Both <strong>accurate and precise</strong>. This is what you want.</>],
      ]} />
      <List>
        <li><strong>Accurate</strong> = close to the true answer.</li>
        <li><strong>Precise</strong> = same answer each time.</li>
        <li>A zero error makes you precise but not accurate, because every reading is wrong by the same amount.</li>
      </List>
    </Card>
    <Card title="Units and Conversions">
      <p>Prefixes tell you how big the unit is:</p>
      <Table headers={['Prefix', 'Symbol', 'Meaning']} rows={[
        ['kilo', 'k', '1000 times the unit'], ['centi', 'c', 'One hundredth of the unit'], ['milli', 'm', 'One thousandth of the unit'],
      ]} />
      <Formula>1 m = 100 cm = 1000 mm<br />1 kg = 1000 g<br />1 min = 60 s</Formula>
      <Sub>How to convert</Sub>
      <Table headers={['Change', 'What you do', 'Example']} rows={[
        ['m to cm', 'multiply by 100', '2.5 m = 250 cm'], ['m to mm', 'multiply by 1000', '0.12 m = 120 mm'], ['kg to g', 'multiply by 1000', '0.75 kg = 750 g'], ['min to s', 'multiply by 60', '2.5 min = 150 s'],
      ]} />
      <Sub>Going the other way</Sub>
      <List>
        <li>To go back, <strong>divide</strong> by the same number. Example: 250 cm ÷ 100 = 2.5 m.</li>
        <li>Check your answer. A small unit gives a big number: 2.5 m is 250 cm. A big unit gives a small number: 250 cm is 2.5 m.</li>
      </List>
      <Sub>Do not mix up the letters</Sub>
      <List>
        <li><strong>m</strong> on its own means metre.</li>
        <li><strong>m</strong> in front of another letter means milli, like <strong>mm</strong> (millimetre).</li>
        <li>Minutes are written <strong>min</strong>.</li>
      </List>
    </Card>
    <Card title="Mass and Volume">
      <Table headers={['', 'Mass', 'Volume']} rows={[
        ['What it is', 'The amount of matter (stuff) in an object.', 'The amount of space an object takes up.'],
        ['In simple words', 'How much is in it.', 'How much room it takes.'],
        ['Instrument used', 'Balance', 'Measuring cylinder'],
        ['Units', 'kg, g', 'm³, cm³ (for liquids: litres, mL)'],
      ]} />
      <p>Example: a bucket full of sand and a bucket full of feathers take up the same space, so they have the <strong>same volume</strong>. But the sand has more matter in it, so it has more <strong>mass</strong>.</p>
      <Sub>Mass of a liquid</Sub>
      <List>
        <li>Weigh the empty, dry container.</li>
        <li>Pour in the liquid and weigh again.</li>
        <li>Take away the empty container's mass.</li>
      </List>
      <Formula>Mass of liquid = both together − empty container<br />Example: 90 g − 40 g = 50 g</Formula>
      <Sub>Reading the volume of a liquid</Sub>
      <Diagram name="meniscus" alt="For water in a level measuring cylinder, read the bottom of the concave meniscus at eye level." />
      <List>
        <li>Stand the measuring cylinder on a flat table.</li>
        <li>Put your eye level with the liquid.</li>
        <li>Read the bottom of the curve (the meniscus).</li>
        <li>Remember: 1 mL = 1 cm³.</li>
      </List>
      <Sub>Volume of a stone (displacement)</Sub>
      <Diagram name="displacement" alt="The water rises from 30 cm³ to 50 cm³ when the object is fully submerged, so the object’s volume is 20 cm³." />
      <Steps>
        <li>Pour water into a measuring cylinder and write down the volume.</li>
        <li>Tie the stone to a thin string and lower it in slowly until it is fully under water. No splashing, no air bubbles.</li>
        <li>Read the new volume. The rise in water is the volume of the stone.</li>
      </Steps>
      <Formula>Volume of stone = final reading − first reading<br />50 cm³ − 30 cm³ = 20 cm³</Formula>
      <p><strong>Overflow can:</strong> fill the can until water drips out of the spout, and wait until it stops. Put a cup under the spout, drop the object in, then pour the water that came out into a measuring cylinder. That water is the volume of the object. Do not use something that melts or soaks up water.</p>
      <Sub>Very small things</Sub>
      <Diagram name="small-objects" alt="A stack of 100 sheets is 20 mm thick; its average thickness per sheet is 0.20 mm. Book covers are excluded." />
      <p>One sheet of paper is too thin to measure. So measure many and share out the answer.</p>
      <Table headers={['Find', 'What you do', 'Calculation']} rows={[
        ['Thickness of one sheet', 'Measure a stack of sheets (not the covers) and count them.', 'stack thickness ÷ number of sheets'],
        ['Mass of one seed or pin', 'Weigh many together and count them.', 'total mass ÷ number of objects'],
        ['Volume of one pin', 'Put many pins in water and see how much the water rises.', 'total rise ÷ number of pins'],
      ]} />
      <p>Example: 100 sheets are 20 mm thick, so one sheet is 20 ÷ 100 = 0.20 mm. Count sheets, not page numbers.</p>
    </Card>
    <Card title="Density">
      <Diagram name="density" alt="The density triangle places mass above density and volume. Density is mass divided by volume; 54 g divided by 20 cm³ gives 2.7 g/cm³." />
      <p>Density tells you how heavy something is for its size. A stone and a sponge of the same size have different densities.</p>
      <Formula>Density = mass ÷ volume<br />ρ = m ÷ V</Formula>
      <Sub>How to find it</Sub>
      <Steps>
        <li>Weigh the object with a balance. That is the mass.</li>
        <li>Find the volume. For a block, multiply its length, width and height. For an odd shape, use displacement.</li>
        <li>Divide mass by volume.</li>
      </Steps>
      <p>Keep the units matching: <strong>kg and m³ give kg/m³</strong>. <strong>g and cm³ give g/cm³</strong>.</p>
      <p><strong>Example:</strong> a stone has mass 54 g and pushes the water up by 20 cm³. Density = 54 ÷ 20 = <strong>2.7 g/cm³</strong>.</p>
    </Card>
    <Card title="Vernier Callipers, Ammeters and Voltmeters">
      <Sub>Vernier callipers</Sub>
      <Diagram name="vernier" alt="A labeled mechanical vernier calliper with outside and inside jaws, fixed and sliding jaws, main and vernier scales, and depth rod. The example reading is 24.0 + 0.3 = 24.3 mm." />
      <List>
        <li><strong>Outside jaws:</strong> measure thickness, or how wide something is.</li>
        <li><strong>Inside jaws:</strong> measure the inside diameter of a pipe or a cup.</li>
        <li>Close the jaws first and check that it reads zero.</li>
      </List>
      <Sub>How to read it</Sub>
      <Steps>
        <li>Read the main scale just before the zero of the sliding scale.</li>
        <li>Find the line on the sliding scale that lines up with any line on the main scale.</li>
        <li>Multiply that line number by the least count, and add it to the first reading.</li>
      </Steps>
      <Formula>Reading = main scale reading + lined-up number × least count</Formula>
      <p>The <strong>least count</strong> is the smallest step the instrument can measure. In our example it is 0.02 mm: 24.0 + 15 × 0.02 = <strong>24.3 mm</strong>. Always check the least count on your own instrument.</p>
      <Sub>Ammeter and voltmeter</Sub>
      <Diagram name="current-voltage" alt="An ammeter is connected in series with the component; a voltmeter is connected in parallel across it in a low-voltage DC circuit." />
      <List>
        <li><strong>Ammeter</strong> measures current. Connect it in <strong>series</strong>, in line with the component.</li>
        <li><strong>Voltmeter</strong> measures voltage. Connect it in <strong>parallel</strong>, across the component.</li>
        <li>Check the zero, choose a suitable range, and connect + to + and − to −.</li>
      </List>
      <Sub>Density of a liquid</Sub>
      <Steps>
        <li>Weigh an empty, dry measuring cylinder.</li>
        <li>Pour in the liquid and read the volume at the bottom of the curve.</li>
        <li>Weigh the cylinder with the liquid, and take away the empty mass. That is the liquid's mass.</li>
        <li>Divide mass by volume.</li>
      </Steps>
      <Formula>Empty cylinder 40 g. With liquid 90 g. Volume 50 cm³.<br />Mass of liquid = 90 − 40 = 50 g<br />Density = 50 ÷ 50 = 1.0 g/cm³</Formula>
    </Card>
    <Card title="Derived Units">
      <p>Some units are made by joining base units together, using multiply or divide. These are called derived units.</p>
      <Table headers={['Quantity', 'SI unit', 'Symbol', 'In base units']} rows={[
        ['Force', 'newton', 'N', 'kg·m·s⁻²'], ['Energy / work', 'joule', 'J', 'kg·m²·s⁻²'], ['Power', 'watt', 'W', 'kg·m²·s⁻³'], ['Voltage', 'volt', 'V', 'kg·m²·s⁻³·A⁻¹'], ['Electric current', 'ampere', 'A', 'A — already a base unit'],
      ]} />
      <p>Careful: the <strong>ampere is a base unit</strong>, not a derived one. Newton, joule, watt and volt are derived.</p>
      <Formula>1 N = 1 kg·m·s⁻²<br />1 J = 1 N·m = 1 kg·m²·s⁻²<br />1 W = 1 J/s = 1 kg·m²·s⁻³<br />1 V = 1 W/A = 1 kg·m²·s⁻³·A⁻¹</Formula>
    </Card>
  </div>;
}
