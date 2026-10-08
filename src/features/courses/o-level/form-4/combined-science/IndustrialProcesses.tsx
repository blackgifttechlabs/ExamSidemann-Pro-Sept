import React, { useState } from 'react';
import IndustrialProcessAnimation, { type IndustrialProcess } from './IndustrialProcessAnimation';

const imageRoot = '/images/courses/o-level/combined-science/form-4/';
function ProcessVisual({ process, title, alt }: { process: IndustrialProcess; title: string; alt: string }) {
  const [view, setView] = useState<'animation' | 'diagram'>('diagram');
  return <div className="my-5">
    <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label={`${title} teaching aids`}>
      <button type="button" aria-pressed={view === 'diagram'} onClick={() => setView('diagram')} className={`rounded-full px-4 py-2 text-sm font-bold ${view === 'diagram' ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-700'}`}>Labeled diagram</button>
      <button type="button" aria-pressed={view === 'animation'} onClick={() => setView('animation')} className={`rounded-full px-4 py-2 text-sm font-bold ${view === 'animation' ? 'bg-sky-700 text-white' : 'bg-slate-100 text-slate-700'}`}>Watch the process</button>
    </div>
    {view === 'animation' ? <IndustrialProcessAnimation process={process} title={title} /> : <figure>
      <img src={`${imageRoot}chem-industrial-${process}.webp`} alt={alt} className="mx-auto block h-auto w-full rounded-2xl border border-slate-200 bg-white object-contain" style={{ maxHeight: 'min(65svh, 640px)' }} loading="lazy" decoding="async" />
      <figcaption className="mt-2 text-sm leading-relaxed text-slate-600">{alt}</figcaption>
    </figure>}
  </div>;
}
function LessonCard({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
    <div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-800">{String(n).padStart(2, '0')}</span><h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h3></div>
    <div className="space-y-4 text-base leading-relaxed text-slate-700">{children}</div>
  </section>;
}
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead className="bg-sky-50"><tr>{headers.map(h => <th key={h} className="border border-slate-200 px-3 py-3 font-bold text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="border border-slate-200 px-3 py-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>;
}
function Equation({ children }: { children: React.ReactNode }) { return <p className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 font-semibold text-sky-950">{children}</p>; }
function Resources({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Resources:</strong> {children}</p>; }

export default function IndustrialProcesses() {
  return <div className="not-prose space-y-6">
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-slate-800 sm:p-6">
      <p className="text-base leading-relaxed">In this lesson, you will learn how raw materials are changed into useful products. You will follow the steps for making peanut butter, oil and soap, separating gases from air, using electricity to make products and coat metals, and making ammonia and sulphuric acid.</p>
      <p className="mt-3 text-base leading-relaxed">Start with each diagram. Find the starting materials, the equipment and the finished product. Then watch the animation to see what happens at each step. By the end, you should be able to describe the steps, explain any chemical reactions and say how the products are used.</p>
    </div>
    <LessonCard n={1} title="Peanut Butter and Oil">
      <p><strong>Learning objectives:</strong> outline the production of peanut butter and oil from peanut butter; state uses of the oil.</p>
      <ProcessVisual process="peanuts" title="From peanuts to paste and oil" alt="Peanut butter production by shelling, roasting, grinding and packaging; a separate branch presses paste to collect oil and leave press cake." />
      <Table headers={['Stage', 'What happens', 'Equipment']} rows={[
        ['Shelling', 'Remove the shells and separate shell fragments from the kernels.', 'Sheller; winnowing basket for separation.'],
        ['Roasting', 'Roast the kernels to develop flavour, then cool before grinding.', 'Roaster.'],
        ['Grinding', 'Break kernels down into a smooth or coarse paste; their natural oil becomes part of the peanut butter.', 'Mortar and pestle, grinding stone (guyo/imbokodo), or peanut butter making machine.'],
        ['Packaging', 'Place the peanut butter in clean containers and seal.', 'Suitable clean jars or packaging.'],
        ['Oil extraction', 'Press some peanut butter/paste through a suitable filter or press. Collect the expressed oil; solid press cake remains.', 'Suitable press or teacher-provided pressing arrangement and receiver.'],
      ]} />
      <p><strong>Uses of peanut oil:</strong> cooking and frying; a plant-fat raw material for soap manufacture.</p>
      <p><strong>Activities:</strong> prepare peanut butter by following the stages above, then press a portion of the paste to extract oil. Observe the oil and retained solid. These processes separate and change the form of the raw material; pressing does not create new oil.</p>
      <Resources>winnowing basket, mortar and pestle, grinding stone (guyo/imbokodo), roaster, sheller and peanut butter making machines.</Resources>
    </LessonCard>
    <LessonCard n={2} title="Soap Manufacture">
      <p><strong>Learning objective:</strong> outline soap manufacture by saponification.</p>
      <ProcessVisual process="soap" title="Saponification and soap separation" alt="Fat reacts with sodium hydroxide during heating and stirring; sodium chloride solution separates the soap before moulding and drying." />
      <p><strong>Saponification</strong> is the reaction of a plant or animal fat with sodium hydroxide to produce soap and glycerol.</p>
      <Equation>Fat/oil + sodium hydroxide → soap + glycerol</Equation>
      <ol className="list-decimal space-y-2 pl-6"><li>Combine plant oil or animal fat with NaOH solution.</li><li>Heat and stir using the teacher’s approved method so saponification can occur.</li><li>Add NaCl solution to help the soap separate from the aqueous mixture: this is called <strong>salting out</strong>.</li><li>Separate the soap, place it in moulds and allow it to dry. Glycerol and dissolved salts remain in the liquid.</li></ol>
      <p><strong>Activities:</strong> make soap under teacher supervision and visit a soap manufacturing company. NaOH is corrosive: use eye protection and the teacher’s specified quantities and procedure.</p>
      <Resources>NaOH solution, NaCl solution, and plant or animal fat.</Resources>
    </LessonCard>
    <LessonCard n={3} title="Production of Nitrogen and Oxygen">
      <p><strong>Learning objective:</strong> outline production by fractional distillation of liquid air.</p>
      <ProcessVisual process="air" title="Separating the gases in air" alt="Air is cleaned, compressed and cooled to liquid air; a fractionating column separates nitrogen at the colder top from oxygen lower down." />
      <ol className="list-decimal space-y-2 pl-6"><li>Remove dust, water vapour and carbon dioxide from air.</li><li>Compress and cool the air, using expansion and repeated cooling to obtain liquid air.</li><li>Feed liquid air into a fractionating column. Repeated vaporisation and condensation separate substances with different boiling points.</li><li>Collect nitrogen, which is more volatile and leaves near the top; obtain oxygen from the warmer lower region.</li></ol>
      <Table headers={['Gas', 'Boiling point at about 1 atm', 'Separation']} rows={[
        ['Nitrogen, N₂', '−196 °C', 'Lower boiling point: more volatile.'], ['Oxygen, O₂', '−183 °C', 'Higher boiling point: less volatile than nitrogen.'],
      ]} />
      <p><strong>Activity:</strong> discuss the production of nitrogen and oxygen using a flow chart. Explain why this is a physical separation rather than a chemical reaction.</p>
      <Resources>flow charts.</Resources>
    </LessonCard>
    <LessonCard n={4} title="Electrolysis">
      <p><strong>Learning objectives:</strong> define electrolysis; label an electrolytic cell; describe electrode and electrolyte properties; explain reactions and observations for molten lead bromide and water.</p>
      <p><strong>Electrolysis</strong> is the chemical decomposition of an electrolyte by an electric current. The electrolyte must contain mobile ions, usually in a molten substance or solution.</p>
      <Table headers={['Component', 'Property or function']} rows={[
        ['Battery / DC supply', 'Provides a direct current and sets the electrode polarities.'],
        ['Connecting wires', 'Conduct electrons between the power supply and electrodes.'],
        ['Cathode (negative)', 'Conducting electrode where reduction occurs: species gain electrons.'],
        ['Anode (positive)', 'Conducting electrode where oxidation occurs: species lose electrons.'],
        ['Electrolyte', 'Contains mobile ions that carry charge through the liquid; electrons do not travel through it as they do through wires.'],
        ['Electrodes', 'Conduct electricity and contact the electrolyte. Carbon electrodes are often used for classroom models; inert electrodes do not supply the intended products. A solid ionic electrolyte has fixed ions and cannot conduct this way.'],
      ]} />
      <h4 className="text-lg font-bold text-slate-900">Molten lead(II) bromide</h4>
      <ProcessVisual process="lead" title="Lead bromide: from fixed ions to products" alt="Molten lead bromide with graphite electrodes: Pb²⁺ moves to the negative cathode and produces lead; Br⁻ moves to the positive anode and produces brown bromine fumes." />
      <Table headers={['Electrode', 'Reaction', 'Observation']} rows={[
        ['Cathode (−)', 'Pb²⁺ + 2e⁻ → Pb', 'Lead forms and collects as a molten bead while hot, becoming a solid grey bead on cooling.'],
        ['Anode (+)', '2Br⁻ → Br₂ + 2e⁻', 'Reddish-brown bromine fumes are released.'],
      ]} />
      <p>The document lists <strong>solid lead and bromine fumes</strong> as observations. Lead is liquid at the hot operating temperature, so the solid product is observed after cooling. Discuss this process or watch a teacher demonstration in a fume cupboard.</p>
      <h4 className="text-lg font-bold text-slate-900">Electrolysis of water</h4>
      <ProcessVisual process="water" title="Water: two volumes of hydrogen, one of oxygen" alt="Water acidified with dilute sulphuric acid gives hydrogen at the cathode and oxygen at the anode in a 2:1 gas volume ratio." />
      <p>Use water acidified with <strong>dilute H₂SO₄</strong> to supply conducting ions. Gas bubbles appear at both electrodes; collect the products separately.</p>
      <Equation>2H₂O(l) → 2H₂(g) + O₂(g)</Equation>
      <Table headers={['Product', 'Electrode', 'Relative gas volume', 'Uses from the document']} rows={[
        ['Hydrogen, H₂', 'Cathode (−)', '2', 'A raw material for ammonia manufacture in the Haber process.'],
        ['Oxygen, O₂', 'Anode (+)', '1', 'In the basic oxygen furnace for steelmaking, and for medical purposes.'],
      ]} />
      <p>Compare volumes at the same temperature and pressure. Dilute sulphuric acid improves conductivity and is not consumed in the overall water-splitting reaction. Hydrogen is supplied <strong>to</strong> the Haber process; the product of the Haber process is ammonia.</p>
      <p><strong>Activities:</strong> set up and label an electrolytic cell; investigate electrolysis of water under teacher supervision; discuss molten lead bromide and the uses of oxygen and hydrogen.</p>
      <Resources>battery, electrodes, connecting wires, carbon electrodes, dilute H₂SO₄, and molten lead bromide for teacher-controlled demonstration or discussion.</Resources>
    </LessonCard>
    <LessonCard n={5} title="Electroplating an Iron Nail with Copper">
      <p><strong>Learning objectives:</strong> state the cathode, anode and electrolyte; explain the cathode process; state reasons for electroplating.</p>
      <ProcessVisual process="plating" title="Copper moves from the anode onto the nail" alt="The iron nail is the negative cathode, the copper strip is the positive anode, and copper sulphate solution supplies Cu²⁺ ions for a copper coating." />
      <Table headers={['Part', 'Material', 'What happens']} rows={[
        ['Cathode (−)', 'Iron sheet or nail to be coated.', 'Cu²⁺ gains electrons and deposits as copper metal: Cu²⁺ + 2e⁻ → Cu.'],
        ['Anode (+)', 'Copper electrode.', 'Copper dissolves to replenish Cu²⁺: Cu → Cu²⁺ + 2e⁻.'],
        ['Electrolyte', 'Copper(II) sulphate solution.', 'Contains copper ions that can be deposited on the cathode.'],
      ]} />
      <p><strong>Reasons:</strong> decoration and prevention of corrosion by providing a surface barrier. An intact coating keeps moisture and oxygen away from the iron; scratching through a copper coating exposes the iron.</p>
      <p><strong>Activities:</strong> clean an iron nail, connect it as the cathode and set up a teacher-supervised electroplating experiment. Identify plated objects and discuss why they were plated.</p>
      <Resources>iron sheet or nail, copper sulphate solution, copper electrode, and the DC supply and wires from the electrolytic cell.</Resources>
    </LessonCard>
    <LessonCard n={6} title="The Haber Process">
      <p><strong>Learning objectives:</strong> list ammonia’s raw materials, describe its manufacture, state operating conditions and industrial uses.</p>
      <ProcessVisual process="haber" title="Manufacturing ammonia and recycling the gases" alt="Nitrogen and hydrogen are compressed and passed over iron at 450–500 °C and 200 atm; cooling removes liquid ammonia and unreacted gases return to the converter." />
      <Table headers={['Raw material', 'Source specified in the document']} rows={[
        ['Nitrogen (N₂)', 'Fractional distillation of air.'], ['Hydrogen (H₂)', 'Electrolysis of water.'],
      ]} />
      <Equation>N₂(g) + 3H₂(g) ⇌ 2NH₃(g)</Equation>
      <p>Mix nitrogen and hydrogen in a <strong>1:3</strong> ratio, compress them and pass them over an iron catalyst. The reaction is reversible. Cool the mixture to condense ammonia, withdraw the liquid product and recycle unreacted nitrogen and hydrogen.</p>
      <Table headers={['Condition', 'Value from the document', 'Purpose']} rows={[
        ['Pressure', '200 atm', 'Favours ammonia formation because the product side has fewer gas molecules.'],
        ['Temperature', '450–500 °C', 'Balances a useful reaction rate with ammonia yield.'],
        ['Catalyst', 'Iron', 'Increases reaction rate; it does not change the equilibrium yield.'],
      ]} />
      <p><strong>Uses of ammonia:</strong> manufacture of ammonium nitrate and dyes.</p>
      <Equation>Ammonia + nitric acid → ammonium nitrate<br />NH₃ + HNO₃ → NH₄NO₃</Equation>
      <p><strong>Activities:</strong> describe the Haber process with a flow chart and multimedia; educational tours to <strong>Sable Chemicals</strong> are the document’s named industrial activity.</p>
      <Resources>Haber-process flow chart, multimedia, ammonia solution, nitric acid and titration materials.</Resources>
    </LessonCard>
    <LessonCard n={7} title="The Contact Process">
      <p><strong>Learning objectives:</strong> list sulphuric acid’s raw materials, describe its manufacture, state operating conditions and uses.</p>
      <ProcessVisual process="contact" title="From sulphur dioxide to sulphuric acid" alt="Sulphur dioxide and oxygen form sulphur trioxide over vanadium(V) oxide; absorption in concentrated acid makes oleum, which is diluted to sulphuric acid." />
      <Table headers={['Raw material', 'Source']} rows={[
        ['Sulphur dioxide (SO₂)', 'Burning sulphur or roasting iron pyrites.'], ['Oxygen (O₂)', 'Air.'],
      ]} />
      <ol className="list-decimal space-y-2 pl-6"><li>Make SO₂ from sulphur or iron pyrites and clean the gas.</li><li>Mix with oxygen from air and pass over vanadium(V) oxide to form SO₃.</li><li>Absorb SO₃ in concentrated sulphuric acid to form oleum.</li><li>Add water in a controlled industrial dilution stage to obtain sulphuric acid. Direct absorption of SO₃ in water is avoided because it creates acid mist.</li></ol>
      <Equation>S + O₂ → SO₂<br />2SO₂(g) + O₂(g) ⇌ 2SO₃(g)<br />SO₃ + H₂SO₄ → H₂S₂O₇<br />H₂S₂O₇ + H₂O → 2H₂SO₄</Equation>
      <Table headers={['Condition', 'Value from the document']} rows={[
        ['Pressure', '1 atm'], ['Temperature', '450–500 °C'], ['Catalyst', 'Vanadium(V) oxide (V₂O₅)'],
      ]} />
      <p><strong>Uses:</strong> battery acid, manufacture of plastics, and cleaning metal surfaces before electroplating.</p>
      <p><strong>Activity:</strong> discuss the Contact process and trace the materials through its stages. The document extract does not name a separate resource list for this activity; the diagram and animation support the discussion.</p>
    </LessonCard>
  </div>;
}
