import React from 'react';

const imageRoot = '/images/courses/o-level/combined-science/form-4/';
function Diagram({ name, alt }: { name: string; alt: string }) {
  return <figure className="my-5"><img src={`${imageRoot}phys-measurements-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="mx-auto block h-auto w-full rounded-2xl border border-slate-200 bg-white object-contain" style={{ maxHeight: 'min(60svh, 560px)' }} /><figcaption className="mt-2 text-sm leading-relaxed text-slate-600">{alt}</figcaption></figure>;
}
function Card({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-800">{n}</span><h3 className="text-xl font-bold text-slate-900">{title}</h3></div><div className="space-y-4 text-base leading-relaxed text-slate-700">{children}</div></section>;
}
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className="border border-slate-200 p-3 font-bold text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((row, i) => <tr key={i}>{row.map((v, j) => <td key={j} className="border border-slate-200 p-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>;
}
function Formula({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-sky-50 p-3 font-semibold text-sky-950">{children}</p>; }
function Resources({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Resources:</strong> {children}</p>; }

export default function Measurements() {
  return <div className="not-prose space-y-6">
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-slate-800 sm:p-6"><p>In this lesson, you will estimate quantities, choose suitable instruments and take readings carefully. You will practise converting units, measuring small and irregular objects, and finding density from mass and volume.</p><p className="mt-3">Check the instrument before you start, read its scale from the correct position and record a number with its unit. The diagrams help explain these methods; the document does not require you to draw or label diagrams in Measurements.</p></div>
    <Card n={1} title="Physical Quantities and Instruments">
      <p><strong>Learning objectives:</strong> estimate length, mass, time and temperature; choose appropriate instruments; measure accurately; identify parallax and zero errors; read to the nearest division; identify units, including SI units.</p>
      <Diagram name="tools" alt="Measuring tools: metre rule, thermometer, balance, stopwatch, measuring cylinder, overflow can, vernier callipers, ammeter and voltmeter." />
      <Table headers={['Quantity', 'Instrument', 'SI unit', 'Symbol']} rows={[
        ['Length', 'Metre rule', 'metre', 'm'], ['Mass', 'Balance', 'kilogram', 'kg'], ['Time', 'Stopwatch', 'second', 's'], ['Temperature', 'Thermometer', 'kelvin', 'K'],
      ]} />
      <p>School thermometers often have a Celsius (°C) scale; record the unit on the instrument. The SI temperature unit is kelvin, written <strong>K</strong>, without a degree sign.</p>
      <ol className="list-decimal space-y-2 pl-6"><li>Make a sensible estimate before measuring, then choose an instrument with a suitable range and scale.</li><li>Check the instrument’s zero and identify the value of each small division.</li><li>Read from the correct viewing position. At the introductory level, record the reading to the nearest division.</li><li>Measure at different points where appropriate, for example the thickness of a book, and compare the readings.</li></ol>
      <h4 className="text-lg font-bold text-slate-900">Parallax error</h4>
      <Diagram name="parallax" alt="Looking from above or below a pointer gives different apparent readings; looking straight on gives the correct reading." />
      <p><strong>Parallax error</strong> occurs when the eye is at an angle to the scale and mark being read. Put your eye straight in front of the mark, or at the meniscus level for a liquid scale.</p>
      <h4 className="text-lg font-bold text-slate-900">Zero error</h4>
      <Diagram name="zero-error" alt="An empty balance indicates +2.0 g. Subtract this positive zero error from an indicated 52.0 g to obtain 50.0 g." />
      <p><strong>Zero error</strong> occurs when an instrument gives a non-zero reading when it should read zero. Reset or tare it if possible; otherwise apply the signed correction.</p>
      <Formula>Corrected reading = indicated reading − zero error</Formula>
      <p>For a positive zero error of +2.0 g: 52.0 − 2.0 = <strong>50.0 g</strong>. For a negative zero error of −2.0 g: 48.0 − (−2.0) = <strong>50.0 g</strong>.</p>
      <p><strong>Accuracy and precision:</strong> the scope and sequence lists these terms. Accuracy means closeness to the accepted value; precision means how closely repeated measurements agree. Measurements can agree with each other yet still be inaccurate if there is a zero error.</p>
      <p><strong>Activities:</strong> estimate and then measure length, time, temperature and mass. Take measurements at different points and compare estimates with readings.</p>
      <Resources>metre rule, thermometer, balance, stopwatch and ICT tools.</Resources>
    </Card>
    <Card n={2} title="Units, Prefixes and Conversions">
      <p><strong>Learning objective:</strong> convert units using the SI prefixes in the listed examples.</p>
      <Table headers={['Prefix', 'Symbol', 'Meaning']} rows={[
        ['kilo', 'k', '1000 times the unit'], ['centi', 'c', 'One hundredth of the unit'], ['milli', 'm', 'One thousandth of the unit'],
      ]} />
      <Formula>1 m = 100 cm = 1000 mm<br />1 kg = 1000 g<br />1 min = 60 s</Formula>
      <Table headers={['Conversion', 'Example']} rows={[
        ['Metres to centimetres: × 100', '2.5 m = 250 cm'], ['Metres to millimetres: × 1000', '0.12 m = 120 mm'], ['Kilograms to grams: × 1000', '0.75 kg = 750 g'], ['Minutes to seconds: × 60', '2.5 min = 150 s'],
      ]} />
      <p>To reverse a conversion, divide by the same factor. The symbol <strong>m</strong> means metre when it stands alone; it means milli- when used as a prefix, as in <strong>mm</strong>. Minutes use <strong>min</strong>.</p>
      <p><strong>Activity:</strong> convert metres to centimetres and millimetres, kilograms to grams, and minutes to seconds. Check each answer against a sensible estimate.</p>
      <Resources>metre rule, balance and stopwatch.</Resources>
    </Card>
    <Card n={3} title="Mass and Volume">
      <p><strong>Learning objectives:</strong> measure the mass of a liquid, find an irregular object’s volume, and determine thickness, volume and mass of small objects.</p>
      <h4 className="text-lg font-bold text-slate-900">Mass by difference</h4>
      <p>Measure the mass of an empty, dry container. Add the liquid and measure again. Subtract the container’s mass to find the liquid’s mass. A balance with a tare function can remove the container’s mass before adding the liquid.</p>
      <Formula>Mass of liquid = combined mass − empty-container mass<br />Example: 90 g − 40 g = 50 g</Formula>
      <h4 className="text-lg font-bold text-slate-900">Reading liquid volume</h4>
      <Diagram name="meniscus" alt="For water in a level measuring cylinder, read the bottom of the concave meniscus at eye level." />
      <p>Stand the cylinder on a level surface and read the bottom of the water meniscus at eye level. Check the scale divisions. <strong>1 mL = 1 cm³.</strong></p>
      <h4 className="text-lg font-bold text-slate-900">Volume by displacement</h4>
      <Diagram name="displacement" alt="The water rises from 30 cm³ to 50 cm³ when the object is fully submerged, so the object’s volume is 20 cm³." />
      <ol className="list-decimal space-y-2 pl-6"><li>Record the initial water volume in a measuring cylinder.</li><li>Use a thin string to lower a suitable irregular object until it is fully submerged. Avoid splashing and trapped air bubbles.</li><li>Read the new volume. The increase is the object’s volume.</li></ol>
      <Formula>Object volume = final reading − initial reading<br />50 cm³ − 30 cm³ = 20 cm³</Formula>
      <p><strong>Overflow-can method:</strong> fill the can until water runs from its spout, then wait until dripping stops. Place a collecting vessel below the spout. Fully immerse the object and measure the displaced water using a measuring cylinder. Use an object that does not dissolve or absorb water.</p>
      <h4 className="text-lg font-bold text-slate-900">Small objects</h4>
      <Diagram name="small-objects" alt="A stack of 100 sheets is 20 mm thick; its average thickness per sheet is 0.20 mm. Book covers are excluded." />
      <Table headers={['Quantity', 'Method', 'Calculation']} rows={[
        ['Thickness', 'Measure a stack of a counted number of sheets, excluding covers, at several points.', 'Average thickness per sheet = stack thickness ÷ number of sheets. Count sheets, not printed page numbers.'],
        ['Mass', 'Count and weigh several similar small objects, such as seeds or pins.', 'Average mass per object = total mass ÷ number of objects.'],
        ['Volume', 'Immerse several similar non-absorbent small objects, such as pins, and measure their total displacement.', 'Average volume per object = total displaced volume ÷ number of objects.'],
      ]} />
      <p>Measuring many objects together gives a larger reading that is easier to resolve. Use similar objects and enough of them to give a measurable total; avoid crushing a paper stack or losing water during displacement.</p>
      <p><strong>Activities:</strong> find liquid mass by difference, find irregular-object volume by displacement, and measure the thickness, mass and volume of suitable small objects.</p>
      <Resources>beaker and water, measuring cylinder, irregular objects, overflow can, string, book, seeds, pins, metre rule, balance and stopwatch.</Resources>
    </Card>
    <Card n={4} title="Density">
      <p><strong>Learning objective:</strong> calculate density by finding mass and volume experimentally.</p>
      <Diagram name="density" alt="The density triangle places mass above density and volume. Density is mass divided by volume; 54 g divided by 20 cm³ gives 2.7 g/cm³." />
      <Formula>Density = mass ÷ volume<br />ρ = m ÷ V</Formula>
      <p>Measure mass with a balance. For a regular solid, calculate volume from its measured dimensions; for an irregular solid, use displacement. Use matching units: <strong>kg and m³ give kg/m³</strong>; <strong>g and cm³ give g/cm³</strong>.</p>
      <p><strong>Example:</strong> an irregular object has mass 54 g and displaces 20 cm³ of water. Its density is 54 ÷ 20 = <strong>2.7 g/cm³</strong>.</p>
      <p><strong>Activity:</strong> carry out experiments to find an object’s mass and volume, then calculate density. The supplied density point does not give a separate resource list; use the relevant measuring instruments from the mass-and-volume activities.</p>
    </Card>
    <Card n={5} title="Accurate Measurement with Instruments">
      <p><strong>Learning objectives:</strong> use appropriate instruments to measure length, thickness, internal diameter, current and voltage; read the nearest fraction of a division where the scale permits; determine liquid density.</p>
      <h4 className="text-lg font-bold text-slate-900">Vernier callipers</h4>
      <Diagram name="vernier" alt="A labeled mechanical vernier calliper with outside and inside jaws, fixed and sliding jaws, main and vernier scales, and depth rod. The example reading is 24.0 + 0.3 = 24.3 mm." />
      <p>Use the outside jaws for thickness or external dimensions and the inside jaws for an internal diameter. Close the jaws to check zero before measuring. Read the main scale just before the vernier zero, then find the vernier division that aligns with a main-scale line.</p>
      <Formula>Reading = main-scale reading + aligned vernier division × least count</Formula>
      <p>The <strong>least count</strong> is the smallest increment the vernier can resolve. In the worked example it is 0.02 mm: 24.0 + 15 × 0.02 = <strong>24.3 mm</strong>, before any zero correction. Check the least count of the actual instrument; do not assume every vernier uses the same least count.</p>
      <p>On a suitable analogue scale, estimate a fraction between the marked divisions. Record only the detail that the instrument allows, and state the unit.</p>
      <h4 className="text-lg font-bold text-slate-900">Current and voltage</h4>
      <Diagram name="current-voltage" alt="An ammeter is connected in series with the component; a voltmeter is connected in parallel across it in a low-voltage DC circuit." />
      <p>Measure current with an <strong>ammeter</strong> in series, and voltage with a <strong>voltmeter</strong> in parallel across the component. Choose a suitable range, check the zero and follow the correct polarity for DC meters. Read analogue pointers straight on to avoid parallax.</p>
      <h4 className="text-lg font-bold text-slate-900">Density of a liquid</h4>
      <ol className="list-decimal space-y-2 pl-6"><li>Measure the mass of an empty, dry measuring cylinder.</li><li>Add the liquid and measure its volume at the meniscus.</li><li>Measure the cylinder and liquid together. Subtract the empty-cylinder mass.</li><li>Divide the liquid’s mass by its measured volume.</li></ol>
      <Formula>Example: empty cylinder 40 g; cylinder + liquid 90 g; liquid volume 50 cm³.<br />Liquid mass = 90 − 40 = 50 g; density = 50 ÷ 50 = 1.0 g/cm³.</Formula>
      <p><strong>Activities:</strong> measure length, current and voltage; determine liquid density experimentally.</p>
      <Resources>vernier callipers, voltmeter, ammeter, measuring cylinder, balance and multimedia.</Resources>
    </Card>
    <Card n={6} title="Derived Units">
      <p><strong>Learning objective:</strong> express derived quantities in base units. A derived unit combines base units through multiplication or division.</p>
      <Table headers={['Quantity', 'SI unit', 'Symbol', 'In base units']} rows={[
        ['Force', 'newton', 'N', 'kg·m·s⁻²'], ['Energy / work', 'joule', 'J', 'kg·m²·s⁻²'], ['Power', 'watt', 'W', 'kg·m²·s⁻³'], ['Voltage', 'volt', 'V', 'kg·m²·s⁻³·A⁻¹'], ['Electric current', 'ampere', 'A', 'A — already a base unit'],
      ]} />
      <p>The document lists ampere alongside these units, but <strong>ampere is an SI base unit</strong>. Newton, joule, watt and volt are derived units.</p>
      <Formula>1 N = 1 kg·m·s⁻²<br />1 J = 1 N·m = 1 kg·m²·s⁻²<br />1 W = 1 J/s = 1 kg·m²·s⁻³<br />1 V = 1 W/A = 1 kg·m²·s⁻³·A⁻¹</Formula>
      <p><strong>Activity:</strong> use print or electronic references to express the listed derived units in base units.</p>
      <Resources>print and electronic media.</Resources>
    </Card>
  </div>;
}
