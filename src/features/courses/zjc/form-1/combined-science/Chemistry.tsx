import React, { useState, useRef, useEffect } from 'react';

/* ---------- Types ---------- */
type Explanation = { heading: string; text: string };
type Definition = { term: string; meaning: string };
type Table = { title: string; headers: string[]; rows: string[][] };
type Image = { src: string; alt: string; caption: string };

type Chapter = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  explanations: Explanation[];
  definitions: Definition[];
  tables?: Table[];
  images?: Image[];
  keyPoints: string[];
  practicals?: string[];
  examFocus?: string[];
};

/* ---------- Helper: render text with bold support ---------- */
const renderBoldText = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
};

/* ---------- Chapter Data ---------- */
const chapters: Chapter[] = [
  {
    id: 'states-of-matter',
    eyebrow: 'Chapter 1',
    title: 'States of Matter',
    summary:
      'Matter is anything that has mass and volume (occupies space). Everything around you is made of matter, and matter exists in three states: solid, liquid and gas. The difference between these states comes from the energy and arrangement of the particles that make them up.',
    explanations: [
      {
        heading: 'What is matter? The particle theory',
        text: `• Matter is anything that has mass and volume.\n• Anything made of particles is called matter.\n• Matter exists in 3 states: solid, liquid and gas.\n\nThere are **4 important assumptions** about matter that scientists use to explain what we see around us:\n1. All matter is made up of particles.\n2. There are forces of attraction between the particles.\n3. The particles are in constant motion.\n4. There are spaces between the particles.`,
      },
      {
        heading: 'Properties of each state',
        text: `The properties of each state of matter depend on the arrangement and the energy of the particles that make it up. In each state, particles have a certain amount of movement energy (**kinetic energy**):\n\n• Particles in a **solid** have the least kinetic energy.\n• Particles in a **liquid** have medium kinetic energy.\n• Particles in a **gas** have the greatest kinetic energy.`,
      },
      {
        heading: 'Kinetic theory',
        text: `For many years scientists could not explain why solids, liquids and gases behave the way they do, until experiments led to the **kinetic theory**.\n\n• The kinetic theory states that all particles in a substance move and have kinetic energy.\n• All matter is made up of very small pieces called particles, with spaces between them.\n\nFrom this theory we conclude that:\n1. Particles have kinetic energy — they are always moving.\n2. Particles have spaces between them (this is why gases and liquids can be compressed using a syringe, while a solid cannot).`,
      },
    ],
    definitions: [
      { term: 'Matter', meaning: 'Anything that has mass and volume (occupies space).' },
      { term: 'Kinetic energy', meaning: 'The energy a particle has because it is moving.' },
      { term: 'Kinetic theory', meaning: 'The theory that all particles in a substance move, have kinetic energy, and have spaces between them.' },
      { term: 'Particle', meaning: 'A very small piece of matter that makes up a substance.' },
    ],
    tables: [
      {
        title: 'Arrangement and movement of particles in each state',
        headers: ['Property', 'Solid', 'Liquid', 'Gas'],
        rows: [
          ['Arrangement', 'Closely packed, regular pattern, very small spaces', 'Touching but larger spaces than a solid', 'Far apart with very large spaces'],
          ['Movement', 'Particles vibrate in one place', 'Particles move freely over each other', 'Particles move very fast and randomly in all directions'],
          ['Shape/volume', 'Fixed shape and size', 'Takes the shape of its container; can flow and be poured', 'Fills its container and can escape if not covered'],
          ['Compressibility', 'Cannot be compressed', 'Can be slightly compressed', 'Can easily be compressed'],
        ],
      },
    ],
    keyPoints: [
      'Matter has mass and volume, and is made of particles.',
      'The four assumptions: particles exist, attract each other, move constantly, and have spaces between them.',
      'Solids have the least kinetic energy, liquids medium, gases the most.',
      'Gases and liquids compress easily because their particles have larger spaces between them than solids.',
    ],
    practicals: [
      'Identifying the 3 states of matter using a syringe (gas), water (liquid) and stones (solid).',
      'Compressing a solid, a liquid and a gas using three syringes — air, water, and salt.',
    ],
    examFocus: [
      'State the four assumptions of the kinetic theory.',
      'Describe how particles are arranged and move in each state of matter.',
      'Explain why a gas can be compressed but a solid cannot.',
    ],
  },
  {
    id: 'changes-of-state-solubility',
    eyebrow: 'Chapter 2',
    title: 'Changes of State and Solubility',
    summary:
      'Matter can change from one state to another when it is heated or cooled — this is called a change of state. Heating gives particles more kinetic energy; cooling removes energy. This chapter also covers solubility: how well a solute dissolves in a solvent, and what speeds dissolving up.',
    explanations: [
      {
        heading: 'Changes of state',
        text: `When a material is heated, the particles gain kinetic energy and move faster. The higher the temperature, the faster the particles move.\n\n• **Melting** — a solid is heated and changes into a liquid.\n• **Evaporation** — a liquid is heated, particles gain enough energy to escape from its surface and form a gas (boiling).\n• **Sublimation** — a solid is heated and changes directly into a gas, without becoming a liquid first.\n• **Deposition** — a gas is cooled and changes directly into a solid.\n• **Condensation** — a gas is cooled, loses heat energy, particles move closer together and it changes into a liquid.\n• **Freezing (solidifying)** — a liquid is cooled and changes into a solid.`,
      },
      {
        heading: 'Solubility',
        text: `**Solubility** is the property of a substance (the solute) that allows it to dissolve in the solvent. When no more solute can be dissolved in the solvent, the solution is **saturated**.`,
      },
      {
        heading: 'Factors affecting the rate of dissolving',
        text: `Some solutes dissolve faster than others. Three factors affect the rate of dissolving:\n\n1. **Particle size** — fine icing sugar (smaller grains) dissolves faster than coarse granulated sugar.\n2. **Temperature** — heating gives solvent particles more kinetic energy, so they collide with solute particles more often and with more force, speeding up dissolving.\n3. **Stirring** — stirring makes solvent and solute particles collide more often, so dissolving happens more quickly.`,
      },
    ],
    definitions: [
      { term: 'Melting', meaning: 'A solid changing into a liquid when heated.' },
      { term: 'Evaporation', meaning: 'A liquid changing into a gas when heated.' },
      { term: 'Sublimation', meaning: 'A solid changing directly into a gas without becoming a liquid.' },
      { term: 'Deposition', meaning: 'A gas changing directly into a solid when cooled.' },
      { term: 'Condensation', meaning: 'A gas changing into a liquid when cooled.' },
      { term: 'Freezing / solidifying', meaning: 'A liquid changing into a solid when cooled.' },
      { term: 'Solubility', meaning: 'How well a solute dissolves in a solvent.' },
      { term: 'Saturated solution', meaning: 'A solution in which no more solute can dissolve.' },
    ],
    keyPoints: [
      'Heating a solid causes melting; heating a liquid causes evaporation.',
      'Sublimation and deposition skip the liquid state entirely.',
      'Cooling a gas causes condensation; cooling a liquid causes freezing.',
      'Dissolving speeds up with smaller particle size, higher temperature, and stirring.',
    ],
    practicals: [
      'Investigating factors that affect the rate of dissolving — comparing fine vs coarse salt, and stirred vs unstirred water.',
    ],
    examFocus: [
      'Define sublimation, deposition, evaporation, condensation, melting and freezing.',
      'Explain the three factors that affect the rate at which a solute dissolves.',
    ],
  },
  {
    id: 'mixtures-elements-compounds',
    eyebrow: 'Chapter 3',
    title: 'Mixtures, Elements and Compounds',
    summary:
      'Chemistry classifies materials as mixtures, elements or compounds. Mixtures can be separated by physical methods with no chemical change; elements are pure substances of one atom type; compounds are pure substances formed when elements bond chemically.',
    explanations: [
      {
        heading: 'Mixtures',
        text: `A **mixture** is an impure substance made of two or more substances. Soil is an example — it contains small stones, humus, water and air.\n\n• Mixing does not change the properties of each substance.\n• No chemical change takes place when substances are mixed.\n• Substances in a mixture can be separated by physical methods.\n• Types of mixture: solid in solid (sand and maize kernels), liquid in liquid (oil and water), solid in water (sand in water).`,
      },
      {
        heading: 'Elements',
        text: `An **element** is a pure substance made up of atoms of only one type. It cannot be broken down further into a simpler substance. The smallest particle in an element is an **atom**. Iron, for example, consists only of iron atoms. Elements have physical properties (hardness, size, colour, density) and chemical properties (reactivity, the compounds they form).`,
      },
      {
        heading: 'Compounds',
        text: `A **compound** is a pure substance made of two or more different elements that are chemically bonded — so it contains more than one kind of atom. Atoms in a compound can only be separated by chemical means, and compounds have their own physical and chemical properties, different from the elements that formed them.\n\nWater is a compound formed from hydrogen and oxygen. Heating iron (an element) with sulphur (an element) forms iron sulphide (a compound) — a chemical change that is permanent and cannot be reversed.`,
      },
    ],
    definitions: [
      { term: 'Mixture', meaning: 'An impure substance made of two or more substances that can be separated by physical means.' },
      { term: 'Element', meaning: 'A pure substance made up of atoms of only one type.' },
      { term: 'Compound', meaning: 'A pure substance made of two or more elements chemically bonded together.' },
      { term: 'Atom', meaning: 'The smallest particle of an element.' },
    ],
    keyPoints: [
      'Mixtures can be separated by physical methods; no chemical change occurs when mixing.',
      'An element contains only one type of atom and cannot be broken down further.',
      'A compound contains more than one type of atom, chemically bonded, and can only be separated chemically.',
      'Iron + sulphur, heated, forms iron sulphide — an example of an element pair forming a compound.',
    ],
    practicals: [
      'Mixing iron filings and sulphur powder, then using a magnet to separate the mixture.',
      'Heating iron filings and sulphur powder in a test tube to form iron sulphide, then testing with a magnet afterwards.',
    ],
    examFocus: [
      'Distinguish between a mixture, an element and a compound.',
      'Explain why iron sulphide can no longer be separated with a magnet after heating.',
    ],
  },
  {
    id: 'periodic-table',
    eyebrow: 'Chapter 4',
    title: 'The Periodic Table',
    summary:
      'The periodic table classifies all chemical elements. It shows each element\u2019s name, chemical symbol and atomic number, and organises elements into metals, metalloids and non-metals based on the structure of their atoms.',
    explanations: [
      {
        heading: 'What the periodic table shows',
        text: `• The periodic table shows the classification of chemical elements.\n• It shows the name, chemical symbol, and atomic number of each element.\n• The **atomic number** is the number of protons in the nucleus of an atom. Protons are positively charged particles inside an atom.\n• Elements are organised into columns and rows based on the structure of their atoms and their properties.`,
      },
      {
        heading: 'Metals, metalloids and non-metals',
        text: `The periodic table is arranged into three main categories:\n\n• **Metals** — on the left-hand side of the table.\n• **Non-metals** — on the far right-hand side of the table.\n• **Metalloids (semi-metals)** — in the region between metals and non-metals.\n\nEach element has its own name, symbol, atomic number and position on the periodic table.`,
      },
      {
        heading: 'The first 20 elements',
        text: 'The table below lists the first 20 elements of the periodic table, in order of atomic number, with their chemical symbols.',
      },
    ],
    definitions: [
      { term: 'Atomic number', meaning: 'The number of protons in the nucleus of an atom of an element.' },
      { term: 'Proton', meaning: 'A positively charged particle inside the nucleus of an atom.' },
      { term: 'Metal', meaning: 'An element found on the left-hand side of the periodic table.' },
      { term: 'Non-metal', meaning: 'An element found on the far right-hand side of the periodic table.' },
      { term: 'Metalloid', meaning: 'An element found between the metals and non-metals on the periodic table.' },
    ],
    tables: [
      {
        title: 'The first 20 elements of the periodic table',
        headers: ['Atomic number', 'Element', 'Symbol'],
        rows: [
          ['1', 'Hydrogen', 'H'],
          ['2', 'Helium', 'He'],
          ['3', 'Lithium', 'Li'],
          ['4', 'Beryllium', 'Be'],
          ['5', 'Boron', 'B'],
          ['6', 'Carbon', 'C'],
          ['7', 'Nitrogen', 'N'],
          ['8', 'Oxygen', 'O'],
          ['9', 'Fluorine', 'F'],
          ['10', 'Neon', 'Ne'],
          ['11', 'Sodium', 'Na'],
          ['12', 'Magnesium', 'Mg'],
          ['13', 'Aluminium', 'Al'],
          ['14', 'Silicon', 'Si'],
          ['15', 'Phosphorus', 'P'],
          ['16', 'Sulfur', 'S'],
          ['17', 'Chlorine', 'Cl'],
          ['18', 'Argon', 'Ar'],
          ['19', 'Potassium', 'K'],
          ['20', 'Calcium', 'Ca'],
        ],
      },
    ],
    keyPoints: [
      'The periodic table shows each element\u2019s name, symbol and atomic number.',
      'Atomic number = number of protons in the nucleus.',
      'Metals are on the left, non-metals on the right, metalloids in between.',
      'The first 20 elements run from Hydrogen (1) to Calcium (20).',
    ],
    examFocus: [
      'State the atomic number and symbol of a given element from the first 20.',
      'Classify a named element as a metal, non-metal or metalloid based on its position.',
    ],
  },
  {
    id: 'acids-and-bases',
    eyebrow: 'Chapter 5',
    title: 'Acids and Bases',
    summary:
      'All solid substances can be classified as acidic, basic or neutral. Acids and bases can be identified using an indicator called litmus, and each group has its own distinct set of properties.',
    explanations: [
      {
        heading: 'Identifying acids and bases with litmus',
        text: `All acids dissolve in water to form acidic solutions, but not all bases dissolve in water — bases that do dissolve are called **alkalis**, forming alkaline solutions. When an acid and a base react, they neutralise each other to form a salt.\n\n**Litmus** is a purple dye, used as a solution or as blue/red paper:\n\n• Blue litmus paper (or solution) turns **red** in an acid.\n• Red litmus paper (or solution) turns **blue** in an alkali.\n• A substance that does not change litmus colour is **neutral**.`,
      },
      {
        heading: 'Properties of acids and bases',
        text: `Acids and bases can be strong or weak. Strong acids and bases are corrosive and dangerous — they can eat away at metals and other materials and cause serious burns, so laboratory acids are usually diluted with water. Their properties are often what tells them apart, as shown in the table below.`,
      },
    ],
    definitions: [
      { term: 'Litmus', meaning: 'A purple dye used as an indicator, available as a solution or as blue/red paper.' },
      { term: 'Alkali', meaning: 'A base that dissolves in water to form an alkaline solution.' },
      { term: 'Neutral', meaning: 'Neither acidic nor basic; does not change the colour of litmus.' },
      { term: 'Corrosive', meaning: 'Able to eat away at metals and other materials — a property of strong acids and bases.' },
    ],
    tables: [
      {
        title: 'Properties of acids and bases',
        headers: ['Property', 'Acid', 'Base'],
        rows: [
          ['Taste', 'Sour', 'Bitter'],
          ['Smell', 'Often burns the nose', 'Usually no smell (except ammonia)'],
          ['Texture', 'Sticky', 'Soapy'],
          ['Indicators', 'Turns blue litmus red', 'Turns red litmus blue'],
          ['Reactions', 'Reacts with bases to form salts', 'Reacts with acids to form salts'],
          ['Examples', 'Vinegar, citric acid in citrus fruits, hydrochloric acid, sulfuric acid', 'Ammonia, potassium hydroxide, sodium hydroxide'],
        ],
      },
    ],
    keyPoints: [
      'Blue litmus turns red in an acid; red litmus turns blue in a base.',
      'A substance that does not change litmus colour is neutral.',
      'Acids taste sour and are sticky; bases taste bitter and feel soapy.',
      'An acid and a base neutralise each other to form a salt.',
    ],
    practicals: [
      'Identifying acids and bases using red and blue litmus paper on hydrochloric acid, sodium hydroxide solution and tap water.',
    ],
    examFocus: [
      'State the litmus colour change for an acid and for a base.',
      'List two properties each of acids and bases, with an example of each.',
    ],
  },
  {
    id: 'industrial-processes',
    eyebrow: 'Chapter 6',
    title: 'Industrial Processes: Peanut Butter and Oil',
    summary:
      'Chemistry is applied in industry to turn raw peanuts into everyday products. Peanut butter production involves several stages of cleaning, roasting and grinding, while peanut oil can be extracted directly or from peanut butter itself.',
    explanations: [
      {
        heading: 'Making peanut butter — the process',
        text: `1. **Cleaning & sorting** — blowers remove sand, stems, twigs and leaves; screens remove larger impurities like rocks; peanuts are sorted by size.\n2. **Shelling** — peanuts pass through rollers that crack the shells with minimal damage to the kernels, then screens, blowers and magnets remove all shell pieces.\n3. **Grading** — de-shelled peanuts are graded for colour, blemishes, moisture content and broken skins; unusable peanuts are discarded.\n4. **Roasting** — peanuts are roasted in special ovens at 180°C for about 10 minutes to enhance colour, flavour and texture.\n5. **Cooling & blanching** — hot peanuts are cooled in a blower, then blanched (skins loosened with steam or hot water) and gently rubbed to remove the loosened skins.\n6. **Grinding** — a first grinder coarsely grinds the peanuts; a second grinder reduces particles to no more than 0.025 cm in diameter. Additives like salt, sugar and oil stabiliser are added at this stage.\n7. **Packaging** — the peanut butter is cooled, filled into jars, sealed, labelled and boxed for transport to stores.`,
      },
      {
        heading: 'Producing and using peanut oil',
        text: `Peanuts have a high oil content of 45-55%, providing a lot of energy. Oil can be extracted directly from clean, shelled peanuts using an oil press, or indirectly from peanut butter using the decanting separation method.\n\n**Uses of peanut oil:** frying and baking, or adding a nutty flavour to a dish; skin moisturiser; baby care products such as nappy rash cream; massage oil, for its light, nutty smell.`,
      },
    ],
    definitions: [
      { term: 'Raw material', meaning: 'The starting substance used to make a product, e.g. raw peanuts.' },
      { term: 'Roasting', meaning: 'Heating to develop flavour, colour and texture.' },
      { term: 'Blanching', meaning: 'Loosening the skins of roasted peanuts using steam or hot water.' },
      { term: 'Decanting', meaning: 'A separation method of carefully pouring off a liquid layer, used to recover oil from peanut butter.' },
    ],
    keyPoints: [
      'Peanut butter production: cleaning, shelling, grading, roasting, cooling/blanching, grinding, packaging.',
      'Roasting is done at 180°C for about 10 minutes.',
      'Peanuts contain 45-55% oil, extractable directly by pressing or indirectly from peanut butter by decanting.',
      'Peanut oil is used for cooking as well as skin and baby-care products.',
    ],
    practicals: [
      'Pressing smooth and crunchy peanut butter to compare the volume of oil produced from each.',
    ],
    examFocus: [
      'Outline, in order, the steps in making peanut butter.',
      'State the percentage of oil in peanuts and two uses of peanut oil.',
    ],
  },
  {
    id: 'rusting-prevention',
    eyebrow: 'Chapter 7',
    title: 'Rusting and Rust Prevention',
    summary:
      'Most metals corrode when exposed to their environment, but the corrosion of iron specifically is called rusting. Rusting needs both oxygen and moisture, and can be slowed or prevented by keeping air and water away from the iron.',
    explanations: [
      {
        heading: 'What causes rusting',
        text: `**Rusting** is a process in which iron combines with oxygen in the presence of water to form rust (iron oxide). The two conditions necessary for rusting are the presence of **oxygen** and **moisture**, though other factors can speed up how quickly rusting occurs. Rusting is continuous — over time, more and more of the metal turns into rust, making objects unsightly and eventually destroying them.`,
      },
      {
        heading: 'Methods of preventing rust',
        text: `Since rusting needs both water and oxygen, the most obvious way to prevent it is to keep both away from the iron.\n\n1. **Painting** — creates a thin but effective barrier that keeps air off the iron; the coat must be renewed frequently.\n2. **Galvanizing** — coating a metal with zinc, usually by the hot dip method (dipping the object in molten zinc); commonly used for roofing iron, and works as long as the zinc layer isn\u2019t scratched.\n3. **Plating (electroplating)** — coating one metal with another, more decorative or corrosion-resistant metal (such as chromium, silver or gold), using an electric current to deposit the coating metal onto the object.\n4. **Oiling/greasing** — a layer of oil or grease repels water, so it never contacts the metal underneath; often used to protect machinery parts.`,
      },
    ],
    definitions: [
      { term: 'Rusting', meaning: 'The reaction of iron with oxygen in the presence of water to form rust (iron oxide).' },
      { term: 'Corrosion', meaning: 'The general breaking down or damaging of a metal from exposure to its environment.' },
      { term: 'Galvanizing', meaning: 'Coating a metal with zinc to prevent rusting, usually by hot dipping in molten zinc.' },
      { term: 'Electroplating', meaning: 'Using an electric current to coat one metal with a layer of another metal.' },
    ],
    keyPoints: [
      'Rusting needs both oxygen and moisture to occur.',
      'Rusting is a continuous process that gradually destroys the metal.',
      'Prevention methods all work by keeping air and/or water away from the iron: painting, galvanizing, plating, oiling/greasing.',
      'If a protective barrier is damaged, rusting will start at that point.',
    ],
    practicals: [
      'Investigating conditions necessary for rusting: nails in boiled water with oil, tap water open to air, dry air, and dry air with a drying agent (calcium chloride).',
    ],
    examFocus: [
      'State the two conditions necessary for rusting.',
      'Explain how two named methods prevent rusting.',
    ],
  },
  {
    id: 'fuel-efficiency',
    eyebrow: 'Chapter 8',
    title: 'Efficiency of Different Fuels',
    summary:
      'Fuel efficiency refers to how well the stored chemical energy in a fuel is converted into heat energy during combustion. Solid, liquid and gaseous fuels differ greatly in how efficiently they burn.',
    explanations: [
      {
        heading: 'Comparing solid, liquid and gaseous fuels',
        text: `**Fuel efficiency** refers to how well the stored chemical energy in a fuel is converted to heat energy during combustion.\n\n• **Wood** is an inefficient fuel — it burns quickly and does not produce much heat energy, and a lot of heat is wasted.\n• **Coal** has a higher carbon content than wood, so when it combines with oxygen during combustion it has a higher heating value.\n• **Liquid fuels** such as petrol and diesel are more efficient than solid fuels, and don\u2019t produce smoke like wood does.\n• **Gaseous fuels** are the most efficient of all, followed by liquid fuels, then solid fuels.`,
      },
    ],
    definitions: [
      { term: 'Fuel efficiency', meaning: 'How well the stored chemical energy in a fuel converts to heat energy during combustion.' },
      { term: 'Combustion', meaning: 'The chemical reaction of a fuel with oxygen that releases heat and light.' },
    ],
    keyPoints: [
      'Fuel efficiency ranks: gaseous fuels most efficient, then liquid fuels, then solid fuels.',
      'Wood burns quickly and wastes a lot of heat, making it an inefficient fuel.',
      'Coal has a higher carbon content and heating value than wood.',
      'Liquid fuels like petrol and diesel burn more efficiently and cleanly than solid fuels.',
    ],
    practicals: [
      'Comparing the efficiency of methylated spirit, gas and wood by heating 100ml of water for five minutes with each and recording temperature change.',
    ],
    examFocus: [
      'Identify which fuel was least efficient in an experiment, and explain why.',
      'Suggest ways to improve the accuracy of a fuel-efficiency experiment.',
    ],
  },
];

/* ---------- Helper component to render a chapter's content ---------- */
const ChapterContent: React.FC<{ chapter: Chapter }> = ({ chapter }) => {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="p-5 bg-amber-50 rounded-xl text-slate-700 text-base leading-relaxed">
        {chapter.summary}
      </div>

      {/* Explanations */}
      {chapter.explanations.map((exp, idx) => (
        <div key={idx} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-lg font-bold text-amber-700 mb-2">{exp.heading}</h4>
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {renderBoldText(exp.text)}
          </div>
        </div>
      ))}

      {/* Tables */}
      {chapter.tables && chapter.tables.length > 0 && (
        <div className="space-y-4">
          {chapter.tables.map((table, tIdx) => (
            <div key={tIdx} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
              <h5 className="font-semibold text-slate-800 mb-2">{table.title}</h5>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-amber-50">
                    {table.headers.map((h, i) => (
                      <th key={i} className="border border-slate-300 px-4 py-2 text-left font-semibold text-slate-700">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, rIdx) => (
                    <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="border border-slate-300 px-4 py-2 text-slate-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}

      {/* Images */}
      {chapter.images && chapter.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapter.images.map((img, i) => (
            <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm text-center">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                className="w-full rounded-lg border border-slate-100 object-contain max-h-48"
              />
              <p className="mt-2 text-sm text-slate-600">{img.caption}</p>
            </div>
          ))}
        </div>
      )}

      {/* Definitions */}
      {chapter.definitions && chapter.definitions.length > 0 && (
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h5 className="font-semibold text-slate-800 mb-3">📖 Key Terms</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {chapter.definitions.map((def, i) => (
              <div key={i} className="bg-amber-50 p-3 rounded-lg">
                <span className="font-bold text-amber-800">{def.term}</span>
                <span className="text-slate-700 block text-sm mt-1">{def.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Points */}
      {chapter.keyPoints && chapter.keyPoints.length > 0 && (
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h5 className="font-semibold text-slate-800 mb-3">✅ Key Points</h5>
          <ul className="space-y-2">
            {chapter.keyPoints.map((kp, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-700">
                <span className="inline-flex items-center justify-center bg-amber-600 text-white rounded-full w-5 h-5 text-xs font-bold mt-0.5 shrink-0">
                  {i + 1}
                </span>
                <span>{kp}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Practicals & Exam Focus */}
      {(chapter.practicals || chapter.examFocus) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {chapter.practicals && chapter.practicals.length > 0 && (
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h5 className="font-semibold text-slate-800 mb-2">🧪 Practicals</h5>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {chapter.practicals.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {chapter.examFocus && chapter.examFocus.length > 0 && (
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
              <h5 className="font-semibold text-slate-800 mb-2">📝 Exam Focus</h5>
              <ul className="list-disc list-inside text-slate-700 space-y-1">
                {chapter.examFocus.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ---------- Topic Navigation ---------- */
const TopicNav: React.FC<{ activeId: string; onNavigate: (id: string) => void; sections: { id: string; title: string }[] }> = ({
  activeId,
  onNavigate,
  sections,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0a0a0b]/95 py-2.5 backdrop-blur-md shadow-xs">
      <div className="w-full px-[5px] sm:px-6 md:px-8 relative flex items-center">
        <button
          onClick={() => scroll('left')}
          className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18181b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-xs"
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`shrink-0 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-black transition-all active:translate-y-0.5 ${
                activeId === s.id
                  ? 'bg-amber-600 border-b-4 border-amber-800 text-white shadow-sm'
                  : 'border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18181b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-xs"
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

/* ---------- Main Chemistry Component ---------- */
interface ChemistryProps {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const Chemistry: React.FC<ChemistryProps> = ({ onNextTopic, nextTopicTitle = 'Physics' }) => {
  // Build sections: first an Overview, then each chapter with full titles
  const sectionList = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-amber-700 mb-3">Learning Outcomes</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>States of Matter</li>
              <li>Changes of State and Solubility</li>
              <li>Mixtures, Elements and Compounds</li>
              <li>The Periodic Table</li>
              <li>Acids and Bases</li>
              <li>Industrial Processes: Peanut Butter and Oil</li>
              <li>Rusting and Rust Prevention</li>
              <li>Efficiency of Different Fuels</li>
            </ol>
          </div>
          <div className="p-5 bg-amber-50 rounded-xl text-slate-700">
            <p className="font-medium">Chemistry studies what substances are made of and how they change: the particles that make up matter, how mixtures and compounds differ, the periodic table, acids and bases, industrial processes, rusting, and fuels.</p>
          </div>
        </div>
      ),
    },
    ...chapters.map((ch) => ({
      id: ch.id,
      title: ch.title,
      content: <ChapterContent chapter={ch} />,
    })),
  ];

  const [active, setActive] = useState(sectionList[0].id);
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [active]);
  const activeIndex = Math.max(sectionList.findIndex((s) => s.id === active), 0);
  const activeSection = sectionList[activeIndex];
  const isLast = activeIndex >= sectionList.length - 1;

  const handleNavigate = (id: string) => {
    setActive(id);
  };

  const handleNext = () => {
    if (!isLast) {
      setActive(sectionList[activeIndex + 1].id);
      return;
    }
    onNextTopic?.();
  };

  return (
    <div ref={topRef} className="min-h-screen bg-slate-50 dark:bg-[#0a0a0b] font-sans text-slate-900 dark:text-slate-100 pb-20">
      {/* Duolingo Gradient Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 border-b-4 border-amber-900 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="w-full px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-amber-400/30 text-white border border-amber-200/40 shadow-xs">
                CHEMISTRY
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                ZJC Form 1 • Combined Science
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                🧪 {sectionList.length} Sections
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                ⚗️ Matter & Reactions
              </span>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
            🧪 Chemistry
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-amber-50 font-medium">
            Explore what substances are made of and how they change: matter, mixtures, the periodic table, acids and bases, industrial processes, rusting and fuels.
          </p>
        </div>
      </header>

      <TopicNav
        activeId={active}
        onNavigate={handleNavigate}
        sections={sectionList.map((s) => ({ id: s.id, title: s.title }))}
      />

      <div className="w-full px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <section id={activeSection.id} className="mb-16 scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">{activeSection.title}</h2>
          </div>
          <div className="prose prose-slate dark:prose-invert max-w-none">{activeSection.content}</div>
        </section>

        {/* Footer / Key Takeaways */}
        {isLast && (
          <div className="mt-12 rounded-3xl border-2 border-b-6 border-amber-800 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-6 sm:p-8 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💡</span>
              <h3 className="font-black text-xl sm:text-2xl">Key Takeaways</h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-amber-50 font-medium">
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">⚛️ Matter:</strong>
                All matter is made of moving particles with spaces between them; solids, liquids and gases differ in particle arrangement and energy.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🌡️ Changes of state:</strong>
                Heating causes melting, evaporation and sublimation; cooling causes condensation, freezing and deposition.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🧪 Classification:</strong>
                Mixtures separate physically; elements are one type of atom; compounds are chemically bonded and need chemical means to separate.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">📊 Periodic table:</strong>
                Organised by atomic number, with metals on the left and non-metals on the right.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🍋 Acids and bases:</strong>
                Litmus tells them apart — acids turn it red, bases turn it blue.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🏭 Industry:</strong>
                Peanut butter and oil production, rust prevention, and fuel efficiency all apply chemistry to everyday life.
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 rounded-3xl border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-sm text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            {isLast ? 'Topic complete' : `Section ${activeIndex + 1} of ${sectionList.length}`}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">
            {isLast ? (
              <>
                Next Section: <span className="text-amber-600 dark:text-amber-400">{nextTopicTitle}</span>
              </>
            ) : (
              <>
                Up Next: <span className="text-amber-600 dark:text-amber-400">{sectionList[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <div className="flex items-center justify-center gap-4">
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={() => handleNavigate(sectionList[activeIndex - 1].id)}
                className="rounded-2xl border-2 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181b] px-6 py-3 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5"
              >
                ← Previous Section
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isLast && !onNextTopic}
              className="rounded-2xl border-2 border-b-4 border-amber-800 bg-amber-600 px-8 py-3 text-xs sm:text-sm font-black text-white shadow-md transition-all hover:bg-amber-500 active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:border-slate-400 disabled:shadow-none"
            >
              {isLast ? `Begin ${nextTopicTitle} →` : 'Next Section →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chemistry;