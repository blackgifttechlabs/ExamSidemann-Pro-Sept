import React from 'react';

const imageRoot = '/images/courses/o-level/combined-science/form-4/';
function Diagram({ name, alt }: { name: string; alt: string }) {
  return <figure className="my-5"><img src={`${imageRoot}chem-organic-${name}.webp`} alt={alt} loading="lazy" decoding="async" className="mx-auto block h-auto w-full rounded-2xl border border-slate-200 bg-white object-contain" style={{ maxHeight: 'min(65svh, 640px)' }} /><figcaption className="mt-2 text-sm leading-relaxed text-slate-600">{alt}</figcaption></figure>;
}
function Card({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"><div className="mb-4 flex items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sm font-black text-sky-800">{String(n).padStart(2, '0')}</span><h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{title}</h3></div><div className="space-y-4 text-base leading-relaxed text-slate-700">{children}</div></section>;
}
function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return <div className="overflow-x-auto"><table className="w-full border-collapse text-left text-sm"><thead className="bg-sky-50"><tr>{headers.map(h => <th scope="col" key={h} className="border border-slate-200 px-3 py-3 font-bold text-slate-900">{h}</th>)}</tr></thead><tbody>{rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="border border-slate-200 px-3 py-3 align-top">{v}</td>)}</tr>)}</tbody></table></div>;
}
function Equation({ children }: { children: React.ReactNode }) { return <p className="rounded-xl border border-sky-100 bg-sky-50 px-4 py-3 font-semibold text-sky-950">{children}</p>; }
function Resources({ children }: { children: React.ReactNode }) { return <p className="rounded-xl bg-slate-50 p-3 text-sm"><strong>Resources:</strong> {children}</p>; }

type Atom = { symbol: 'C' | 'H' | 'O'; x: number; y: number };
type Bond = { a: number; b: number; order?: number };
type StructureName = 'methane' | 'ethane' | 'propane' | 'ethene' | 'propene' | 'ethanol';
export const displayedStructures: Record<StructureName, { formula: string; atoms: Atom[]; bonds: Bond[] }> = {
  methane: { formula: 'CH₄', atoms: [{ symbol: 'C', x: 190, y: 110 }, { symbol: 'H', x: 130, y: 110 }, { symbol: 'H', x: 250, y: 110 }, { symbol: 'H', x: 190, y: 50 }, { symbol: 'H', x: 190, y: 170 }], bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }] },
  ethane: { formula: 'C₂H₆', atoms: [{ symbol: 'C', x: 150, y: 110 }, { symbol: 'C', x: 230, y: 110 }, { symbol: 'H', x: 90, y: 110 }, { symbol: 'H', x: 290, y: 110 }, { symbol: 'H', x: 150, y: 50 }, { symbol: 'H', x: 150, y: 170 }, { symbol: 'H', x: 230, y: 50 }, { symbol: 'H', x: 230, y: 170 }], bonds: [{ a: 0, b: 1 }, { a: 0, b: 2 }, { a: 1, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 }, { a: 1, b: 6 }, { a: 1, b: 7 }] },
  propane: { formula: 'C₃H₈', atoms: [{ symbol: 'C', x: 110, y: 110 }, { symbol: 'C', x: 190, y: 110 }, { symbol: 'C', x: 270, y: 110 }, { symbol: 'H', x: 50, y: 110 }, { symbol: 'H', x: 330, y: 110 }, { symbol: 'H', x: 110, y: 50 }, { symbol: 'H', x: 110, y: 170 }, { symbol: 'H', x: 190, y: 50 }, { symbol: 'H', x: 190, y: 170 }, { symbol: 'H', x: 270, y: 50 }, { symbol: 'H', x: 270, y: 170 }], bonds: [{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 0, b: 3 }, { a: 2, b: 4 }, { a: 0, b: 5 }, { a: 0, b: 6 }, { a: 1, b: 7 }, { a: 1, b: 8 }, { a: 2, b: 9 }, { a: 2, b: 10 }] },
  ethene: { formula: 'C₂H₄', atoms: [{ symbol: 'C', x: 150, y: 110 }, { symbol: 'C', x: 230, y: 110 }, { symbol: 'H', x: 150, y: 50 }, { symbol: 'H', x: 150, y: 170 }, { symbol: 'H', x: 230, y: 50 }, { symbol: 'H', x: 230, y: 170 }], bonds: [{ a: 0, b: 1, order: 2 }, { a: 0, b: 2 }, { a: 0, b: 3 }, { a: 1, b: 4 }, { a: 1, b: 5 }] },
  propene: { formula: 'C₃H₆', atoms: [{ symbol: 'C', x: 110, y: 110 }, { symbol: 'C', x: 190, y: 110 }, { symbol: 'C', x: 270, y: 110 }, { symbol: 'H', x: 110, y: 50 }, { symbol: 'H', x: 110, y: 170 }, { symbol: 'H', x: 190, y: 50 }, { symbol: 'H', x: 270, y: 50 }, { symbol: 'H', x: 270, y: 170 }, { symbol: 'H', x: 330, y: 110 }], bonds: [{ a: 0, b: 1, order: 2 }, { a: 1, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 1, b: 5 }, { a: 2, b: 6 }, { a: 2, b: 7 }, { a: 2, b: 8 }] },
  ethanol: { formula: 'C₂H₅OH', atoms: [{ symbol: 'C', x: 110, y: 110 }, { symbol: 'C', x: 190, y: 110 }, { symbol: 'O', x: 270, y: 110 }, { symbol: 'H', x: 50, y: 110 }, { symbol: 'H', x: 110, y: 50 }, { symbol: 'H', x: 110, y: 170 }, { symbol: 'H', x: 190, y: 50 }, { symbol: 'H', x: 190, y: 170 }, { symbol: 'H', x: 330, y: 110 }], bonds: [{ a: 0, b: 1 }, { a: 1, b: 2 }, { a: 0, b: 3 }, { a: 0, b: 4 }, { a: 0, b: 5 }, { a: 1, b: 6 }, { a: 1, b: 7 }, { a: 2, b: 8 }] },
};
function DisplayedStructure({ name }: { name: StructureName }) {
  const structure = displayedStructures[name];
  return <figure data-structure={name} className="rounded-xl border border-slate-200 bg-slate-50 p-3"><figcaption className="text-center font-bold capitalize text-slate-900">{name} · {structure.formula}</figcaption><svg viewBox="0 0 380 215" className="mx-auto block h-auto w-full max-w-md" role="img" aria-label={`Displayed structural formula of ${name}, ${structure.formula}; every atom and bond is shown`}>
    {structure.bonds.map((bond, i) => { const a = structure.atoms[bond.a], b = structure.atoms[bond.b]; const length = Math.hypot(b.x - a.x, b.y - a.y), dx = (b.x - a.x) / length, dy = (b.y - a.y) / length; return <g key={i}>{Array.from({ length: bond.order ?? 1 }, (_, j) => { const offset = (j - ((bond.order ?? 1) - 1) / 2) * 7; return <line key={j} x1={a.x + dx * 16 - dy * offset} y1={a.y + dy * 16 + dx * offset} x2={b.x - dx * 16 - dy * offset} y2={b.y - dy * 16 + dx * offset} stroke="#334155" strokeWidth={2.5} />; })}</g>; })}
    {structure.atoms.map((atom, i) => <text key={i} x={atom.x} y={atom.y + 8} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize={25} fontWeight={600} fill={atom.symbol === 'O' ? '#b91c1c' : '#0f172a'}>{atom.symbol}</text>)}
  </svg></figure>;
}

export default function OrganicChemistry() {
  return <div className="not-prose space-y-6">
    <div className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-slate-800 sm:p-6"><p>In this lesson, you will learn about fuels and the carbon compounds used to make them. You will compare how fuels burn, draw simple molecules, and follow the steps for making biogas and ethanol. You will also learn how burning fuels and cutting down trees contribute to global warming.</p><p className="mt-3">Start with each diagram, then read the steps and take part in the teacher-led activities. By the end, you should be able to name the materials and products, explain the changes, and describe their uses and effects on the environment.</p></div>
    <Card n={1} title="Fuels">
      <p><strong>Learning objectives:</strong> identify solid, liquid and gaseous fuels; compare the efficiency of different fuels.</p>
      <Diagram name="fuels" alt="Examples of solid, liquid and gaseous fuels, with a water-heating setup for comparing useful heat transferred by burning fuel." />
      <p>A <strong>fuel</strong> is a substance used to release useful energy, usually by burning.</p>
      <Table headers={['Form', 'Examples from the activity', 'How it is used']} rows={[
        ['Solid', 'Wood', 'Burned as a solid fuel.'], ['Liquid', 'Paraffin; methylated spirit', 'Used in a stove or spirit burner; vapour from the liquid burns.'], ['Gas', 'Gas supplied to a Bunsen burner', 'Mixed with air and burned at the burner.'],
      ]} />
      <p><strong>Activity:</strong> discuss these forms, then carry out teacher-supervised experiments to compare fuels. Use each fuel to heat a known mass of water in the same container. Record the starting and final water temperatures and the amount of fuel used.</p>
      <Table headers={['Keep the same', 'Measure', 'Compare']} rows={[
        ['Water mass, starting temperature, container, burner-to-container distance and exposure to draughts.', 'Temperature rise and fuel mass used, or use a measured gas volume when weighing a gas is impractical.', 'For fuels compared by mass, a larger water temperature rise per gram indicates more useful heat transferred in this setup. Repeat the measurements.'],
      ]} />
      <p><strong>Efficiency</strong> is the fraction of the fuel’s energy that becomes useful heat. A hotter flame alone does not prove a fuel is more efficient. Open experiments lose heat to the surroundings; the results compare the fuel-and-burner setups used. To calculate a percentage efficiency, the energy input must also be known.</p>
      <Resources>wood, paraffin, methylated spirit burner and Bunsen burners.</Resources>
    </Card>
    <Card n={2} title="Combustion">
      <p><strong>Learning objectives:</strong> define complete and incomplete combustion, list their products, and describe the effects of burning fuels.</p>
      <Diagram name="combustion" alt="A Bunsen burner with more air gives a clean blue flame; restricted air gives a yellow, sooty flame and can lead to incomplete combustion." />
      <Table headers={['Type', 'Oxygen supply', 'Products for hydrocarbon fuels']} rows={[
        ['Complete combustion', 'Sufficient oxygen.', 'Carbon dioxide and water.'],
        ['Incomplete combustion', 'Insufficient oxygen for complete burning.', 'Carbon monoxide and/or carbon (soot), plus water; some carbon dioxide may also form.'],
      ]} />
      <Equation>Complete: methane + oxygen → carbon dioxide + water<br />CH₄ + 2O₂ → CO₂ + 2H₂O</Equation>
      <Equation>Incomplete examples:<br />2CH₄ + 3O₂ → 2CO + 4H₂O<br />CH₄ + O₂ → C + 2H₂O</Equation>
      <p><strong>Activities:</strong> compare methylated-spirit burners with long and short wicks, or a paraffin stove. Compare a Bunsen burner with its sleeve wide open and with a narrow air opening. Record flame colour, soot and heating performance. More air usually gives a clean blue Bunsen flame; limited air gives a luminous yellow flame. Wick length changes the fuel supply, so judge the observations rather than assuming one wick always burns completely.</p>
      <p><strong>Effects:</strong> burning fuels releases carbon dioxide, which contributes to global warming. Collecting wood faster than trees regrow can cause deforestation. Incomplete combustion can produce soot and poisonous carbon monoxide, which is colourless; visible smoke is not a reliable test for it.</p>
      <p>Carry out environmental awareness campaigns using posters and drama about fuel use, forest protection and the effects of fires. Burner work is teacher-supervised; do not refill a hot or lit liquid-fuel burner.</p>
      <Resources>paraffin/methylated-spirit burners, gas burners, posters and drama.</Resources>
    </Card>
    <Card n={3} title="Hydrocarbons: Alkanes and Alkenes">
      <p><strong>Learning objectives:</strong> define a hydrocarbon; name the three-carbon members; draw the displayed structures of methane, ethane, propane, ethene and propene; state their uses.</p>
      <Diagram name="hydrocarbons" alt="Alkanes and alkenes are hydrocarbon families; propane and propene each have three carbon atoms." />
      <p>A <strong>hydrocarbon</strong> contains only carbon and hydrogen. A <strong>homologous series</strong> is a family of compounds with a shared pattern of structure and similar chemical properties; consecutive members differ by CH₂.</p>
      <Table headers={['Series', 'Bonding in these examples', 'Named members', 'Three-carbon member']} rows={[
        ['Alkanes', 'Only single bonds between carbon atoms; general formula CₙH₂ₙ₊₂.', 'Methane, ethane, propane.', 'Propane, C₃H₈.'],
        ['Alkenes', 'A carbon–carbon double bond; these open-chain examples have formula CₙH₂ₙ.', 'Ethene, propene.', 'Propene, C₃H₆.'],
      ]} />
      <h4 className="text-lg font-bold text-slate-900">Displayed structures</h4>
      <p>Show <strong>every atom and every bond</strong>. Carbon has four bonds, hydrogen one. A double bond is shown with two lines.</p>
      <div className="grid gap-3 sm:grid-cols-2">{(['methane', 'ethane', 'propane', 'ethene', 'propene'] as StructureName[]).map(name => <DisplayedStructure key={name} name={name} />)}</div>
      <Table headers={['Hydrocarbon', 'Uses']} rows={[
        ['Methane', 'Fuel for heating and cooking; the main combustible component of biogas.'],
        ['Ethane', 'A combustible fuel component and a raw material for making ethene.'],
        ['Propane', 'Fuel in bottled gas / LPG for cooking and heating.'],
        ['Ethene', 'A raw material for producing ethanol, an alcohol.'],
        ['Propene', 'A raw material for producing an alcohol such as propan-2-ol.'],
      ]} />
      <p>The document links hydrocarbons with use as fuels and in making alcohols. An alcohol contains an <strong>–OH group</strong>; it contains oxygen as well as carbon and hydrogen.</p>
      <p><strong>Activity:</strong> use models of atoms and bonds to build the five molecules, count the bonds around each carbon, then draw their displayed structures.</p>
      <Resources>models of atoms and bonds.</Resources>
    </Card>
    <Card n={4} title="Biogas">
      <p><strong>Learning objectives:</strong> outline biogas production, identify factors affecting it, and state its use.</p>
      <Diagram name="biogas" alt="Plant and animal waste enters an airtight digester; microorganisms produce biogas without oxygen, and the collected gas can be used as a fuel." />
      <ol className="list-decimal space-y-2 pl-6"><li>Mix suitable plant and animal waste with water to form a slurry.</li><li>Feed it into an airtight bio digester, keeping oxygen out.</li><li>Microorganisms break down the waste. The document describes this as the role of bacteria; methane-forming microorganisms work alongside bacteria during digestion.</li><li>Collect the biogas, which contains mainly methane and carbon dioxide, through a gas outlet. Remove spent slurry through the slurry outlet.</li></ol>
      <Table headers={['Factor', 'Effect on production']} rows={[
        ['Microorganisms', 'They break down the waste; conditions must support their activity.'],
        ['Temperature', 'A suitable, steady temperature supports digestion. Low temperatures slow production; excessive heat can damage the microorganisms.'],
        ['pH', 'Methane production generally needs conditions near neutral. Very acidic or alkaline conditions inhibit it.'],
        ['Waste and oxygen supply', 'Suitable organic waste supplies material for digestion; the process requires little or no oxygen.'],
      ]} />
      <p><strong>Use:</strong> biogas is a fuel for cooking and heating.</p>
      <p><strong>Activity:</strong> prepare and label a model bio digester showing the waste inlet, digestion chamber, gas outlet and slurry outlet. Discuss the effects of temperature and pH. Use a demonstration model rather than an unvented sealed container that can build pressure.</p>
      <Resources>model of a bio digester and samples of organic plant and animal waste.</Resources>
    </Card>
    <Card n={5} title="Ethanol">
      <p><strong>Learning objectives:</strong> name ethanol’s homologous series, draw its displayed formula, describe the production of concentrated ethanol, and list its uses.</p>
      <p>Ethanol belongs to the <strong>alcohols</strong>. Its formula is <strong>C₂H₅OH</strong>, and its functional group is <strong>–OH</strong>.</p>
      <DisplayedStructure name="ethanol" />
      <Diagram name="ethanol" alt="Yeast ferments sugars at 30–35 °C to produce dilute ethanol and carbon dioxide; fractional distillation collects ethanol-rich distillate." />
      <h4 className="text-lg font-bold text-slate-900">Fermentation</h4>
      <p><strong>Fermentation</strong> uses enzymes from yeast to convert sugars into ethanol and carbon dioxide when oxygen is limited.</p>
      <Equation>Glucose → ethanol + carbon dioxide<br />C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂</Equation>
      <Table headers={['Condition / material', 'Role']} rows={[
        ['Sugar solution', 'Provides fermentable sugar.'],
        ['Yeast', 'Provides enzymes for fermentation.'],
        ['Temperature: 30–35 °C', 'The range specified in the document. Cooling slows fermentation; excessive heat damages yeast and its enzymes.'],
        ['pH', 'Maintain conditions suitable for yeast; very acidic or alkaline mixtures can inhibit fermentation. The supplied extract gives no fixed pH value.'],
        ['Maize meal solution (maheu) and malt', 'Maize contains starch. Malt supplies enzymes that break starch into fermentable sugars; yeast then ferments those sugars. Yeast alone does not directly ferment intact maize starch.'],
      ]} />
      <h4 className="text-lg font-bold text-slate-900">Concentrating the ethanol</h4>
      <p>Fermentation makes a dilute ethanol-and-water mixture. Use <strong>fractional distillation</strong> to increase the ethanol concentration: heat the mixture, pass its vapour through the fractionating column, then cool the ethanol-rich vapour in a condenser and collect the liquid. Ethanol boils at about 78 °C and water at about 100 °C at normal atmospheric pressure; repeated vaporisation and condensation enrich the ethanol fraction. Ordinary fractional distillation does not give completely water-free ethanol.</p>
      <Table headers={['Use from the document', 'Example']} rows={[
        ['Beverage', 'An ingredient of alcoholic beverages. Classroom mixtures are not for drinking.'],
        ['Medical purpose', 'In appropriately formulated disinfectants and antiseptics.'],
        ['Fuel', 'Burned directly or used in fuel blends.'],
        ['Solvent', 'Dissolves substances used in products such as perfumes and some medicines.'],
      ]} />
      <p><strong>Activity:</strong> ferment sugar solution and maize meal solution (maheu) using yeast/malt as appropriate. Compare observations, including gas production. Discuss pH and temperature, then use teacher-controlled fractional distillation to concentrate the ethanol. Use an electric heater or suitable bath rather than a naked flame near ethanol.</p>
      <Resources>sugar solution, maize meal solutions, yeast/malt and fractional distillation apparatus.</Resources>
    </Card>
    <Card n={6} title="Global Warming">
      <p><strong>Learning objectives:</strong> define global warming and list its causes, focusing on combustion and deforestation.</p>
      <Diagram name="warming" alt="Combustion releases carbon dioxide and deforestation reduces its removal; increased greenhouse gases cause more warming of Earth’s surface." />
      <p><strong>Global warming</strong> is the long-term rise in Earth’s average surface temperature. Greenhouse gases absorb some outgoing infrared radiation and re-emit energy, including towards the surface. Increasing these gases strengthens the warming effect.</p>
      <Table headers={['Cause from the document', 'Link to warming']} rows={[
        ['Combustion', 'Burning carbon-containing fuels releases carbon dioxide, adding to the greenhouse effect.'],
        ['Deforestation', 'Fewer trees remove carbon dioxide by photosynthesis. Burning or decay of cleared vegetation can also release stored carbon.'],
        ['Veld fires', 'Burn vegetation, release carbon dioxide and damage plant cover.'],
      ]} />
      <p><strong>Activity:</strong> use multimedia to discuss the effects of combustion, veld fires and deforestation. Link this discussion to the environmental awareness posters or drama from the combustion activity.</p>
      <Resources>multimedia.</Resources>
    </Card>
  </div>;
}
