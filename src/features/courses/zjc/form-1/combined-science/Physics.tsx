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
    id: 'data-presentation',
    eyebrow: 'Chapter 1',
    title: 'Presenting Data',
    summary:
      'Data is information such as facts and statistics. Scientists collect data when they perform experiments and research, and then present it clearly using tallies, tables and bar graphs so it is easy to read and understand.',
    explanations: [
      {
        heading: 'Quantitative and qualitative data',
        text: `Sometimes results are numbers, such as an average temperature over a week — this is called **quantitative data**. Sometimes results are observations that cannot be measured exactly — this is **qualitative data**.`,
      },
      {
        heading: 'Tallies',
        text: `A **tally** is a way of recording data in groups of five, using lines for ones. It shows how often something happens — this is called the **frequency**. You make 4 vertical lines to show 4 counts, then a 5th line crosses them diagonally to show a group of 5, before starting the next group.`,
      },
      {
        heading: 'Tables',
        text: `Presenting data in a table makes it clear and easy to read. A table should always have a descriptive heading, and each row and column should be labelled — for example, a survey of learners' favourite fruit can be shown as a table of fruit types against number of learners.`,
      },
      {
        heading: 'Bar graphs',
        text: `A **bar graph** (bar chart) is a visual display of data, using vertical bars of different heights on a pair of axes. The height of each bar shows the value from the table. Bar graphs are used when data is in groups or categories (days of the week, transport types, fruit types), and there are always spaces between the bars.\n\n**Rules for drawing bar graphs:**\n• Draw a horizontal axis and a vertical axis.\n• Categories always go on the x-axis; label both axes.\n• Use a ruler to mark equal spaces on the x-axis, one per bar, with a gap between each bar.\n• Mark off a scale on the y-axis.\n• Draw the bars using the data from the table.`,
      },
    ],
    definitions: [
      { term: 'Data', meaning: 'Information such as facts and statistics collected through experiments or research.' },
      { term: 'Quantitative data', meaning: 'Data given as numbers, e.g. a measured temperature.' },
      { term: 'Qualitative data', meaning: 'Data given as observations that cannot be measured exactly.' },
      { term: 'Tally', meaning: 'A way of recording data in groups of five, using lines for ones.' },
      { term: 'Frequency', meaning: 'How often something happens.' },
      { term: 'Bar graph', meaning: 'A chart that uses bars of different heights to compare grouped data.' },
    ],
    keyPoints: [
      'Data can be quantitative (numbers) or qualitative (observations).',
      'A tally records data in groups of five for quick counting.',
      'A table needs a descriptive heading and labelled rows and columns.',
      'A bar graph compares categories using bars of equal width with gaps between them, and both axes must be labelled.',
    ],
    examFocus: [
      'Define a tally.',
      'Draw a bar chart from a results table.',
      'Make a tally table from a set of counted observations.',
    ],
  },
  {
    id: 'measurement',
    eyebrow: 'Chapter 2',
    title: 'Measurement',
    summary:
      'Measurement means finding the size, length or amount of something using a measuring instrument, in standard (SI) units understood worldwide. Estimation and awareness of common errors help make measurements accurate.',
    explanations: [
      {
        heading: 'Physical quantities, instruments and SI units',
        text: `A **physical quantity** is something that can be measured. The four you need to know:\n\n• **Length** — the distance between two points; SI unit is the **metre (m)**, made of smaller centimetres (cm) and millimetres (mm); measured with a metre rule placed alongside the object.\n• **Mass** — the amount of matter in an object; SI unit is the **kilogram (kg)**, made of grams (g) and milligrams (mg); measured using a balance (triple beam, digital, or spring).\n• **Time** — the duration an event takes; SI unit is the **second (s)**; measured with a stopwatch (analogue or digital).\n• **Temperature** — how hot or cold something is; measured in **degrees Celsius (°C)** using a thermometer, though the true SI unit is the **kelvin (K)**, starting at absolute zero (0K = -273°C).`,
      },
      {
        heading: 'Estimating physical quantities',
        text: `To **estimate** is to roughly calculate or judge the size, length or amount of something, without measuring it precisely. Estimating first — before actually measuring — lets you check whether your later measurement is reasonable.`,
      },
      {
        heading: 'Errors in measurement',
        text: `Two common errors can occur when taking measurements:\n\n1. **Parallax error** — the change in the apparent position of an object when the viewer's position changes. It happens if you look at the instrument from the wrong angle. To avoid it, your line of sight must be directly in line with the instrument's pointer and scale.\n2. **Zero error** — occurs when an instrument is not properly zeroed before use. For example, a metre rule's zero mark must line up exactly with the end of the object; an ammeter must read zero before it is connected to a circuit.`,
      },
    ],
    definitions: [
      { term: 'Physical quantity', meaning: 'Something that can be measured, such as length, mass, time or temperature.' },
      { term: 'SI unit', meaning: 'A standard, internationally agreed unit, e.g. metre, kilogram, second.' },
      { term: 'Estimate', meaning: 'To roughly calculate or judge the size, length or amount of something.' },
      { term: 'Parallax error', meaning: 'A wrong reading caused by viewing an instrument from an incorrect angle.' },
      { term: 'Zero error', meaning: 'An error that occurs when an instrument is not properly set to zero before use.' },
    ],
    tables: [
      {
        title: 'Physical quantities, instruments and units',
        headers: ['Quantity', 'SI unit', 'Instrument'],
        rows: [
          ['Length', 'Metre (m)', 'Metre rule'],
          ['Mass', 'Kilogram (kg)', 'Balance (triple beam / digital / spring)'],
          ['Time', 'Second (s)', 'Stopwatch'],
          ['Temperature', 'Kelvin (K), commonly °C', 'Thermometer'],
        ],
      },
    ],
    keyPoints: [
      'Length, mass, time and temperature each have a specific SI unit and instrument.',
      'Estimating before measuring helps check whether a result is reasonable.',
      'Parallax error comes from viewing a scale at the wrong angle — always read at eye level.',
      'Zero error comes from an instrument not starting at zero — always check the zero first.',
    ],
    practicals: ['Estimate and then measure quantities such as the width of a door, length of an exercise book, or mass of a shoe.'],
    examFocus: [
      'Match each physical quantity to its correct SI unit and instrument.',
      'Explain parallax error and zero error, and how to avoid each.',
      'Convert between related units (e.g. hours to seconds, cm to m).',
    ],
  },
  {
    id: 'force',
    eyebrow: 'Chapter 3',
    title: 'Force',
    summary:
      'A force is a push or a pull. Forces can be measured using a force meter, and are grouped into contact forces (which need touching) and non-contact forces (which act at a distance). Forces can change an object\u2019s position, shape, speed or direction.',
    explanations: [
      {
        heading: 'Measuring force',
        text: `A **force** is a pull or a push, and it is a physical quantity that can be measured. The SI unit of force is the **newton (N)**, named after Sir Isaac Newton. Forces are measured using a **force meter** (or spring balance) — a spring with a hook attached, with a scale marked in newtons. A spring balance measures how much a spring stretches when a mass is hung from it; this mass reading can be converted to weight by multiplying by the force of gravity (about 10N per kg).`,
      },
      {
        heading: 'Contact forces',
        text: `A **contact force** occurs when two objects exert a force on each other by touching.\n\n• **Mechanical force** — a push or pull applied directly to an object, such as pushing or pulling a wheelbarrow.\n• **Friction** — the resistance an object encounters when moving over a surface. It acts opposite to the direction of movement and slows down or stops a moving object. Rough surfaces cause more friction than smooth ones.`,
      },
      {
        heading: 'Non-contact forces',
        text: `A **non-contact force** occurs between two objects without them touching directly.\n\n• **Gravitational force** — a downward pull towards the Earth's centre, exerted on any object with mass; larger and closer objects experience a greater gravitational force.\n• **Weight** — the force between an object and the Earth, measured in newtons; a 1kg mass has a weight of approximately 10N.\n• **Magnetic force** — exerted between two magnetic objects; like poles repel, unlike poles attract.\n• **Electrostatic force** — exists between two electrically charged particles; can be a push or a pull depending on whether the charges are the same or opposite.`,
      },
      {
        heading: 'Effects of forces',
        text: `A force cannot be seen, but its effects can be. A force applied to an object can:\n\n• Change its **position** — cause a stationary object to move.\n• Change its **shape** — e.g. squeezing a cold drink can.\n• Change its **speed** — e.g. pedalling a bicycle harder makes it go faster.\n• Change its **direction** — e.g. a tennis player hitting a ball back.`,
      },
    ],
    definitions: [
      { term: 'Force', meaning: 'A push or a pull on an object.' },
      { term: 'Newton (N)', meaning: 'The SI unit of force.' },
      { term: 'Contact force', meaning: 'A force that acts between two objects that are touching, e.g. friction.' },
      { term: 'Non-contact force', meaning: 'A force that acts between two objects without touching, e.g. gravity or magnetism.' },
      { term: 'Friction', meaning: 'A force that opposes movement between two touching surfaces.' },
      { term: 'Weight', meaning: 'The gravitational force between an object and the Earth, measured in newtons.' },
    ],
    keyPoints: [
      'Force is measured in newtons using a force meter or spring balance.',
      'Contact forces need touching: mechanical force and friction.',
      'Non-contact forces act at a distance: gravity, weight, magnetic force, and electrostatic force.',
      'Forces can change an object\u2019s position, shape, speed or direction.',
      'A 1kg mass has a weight of about 10N.',
    ],
    practicals: [
      'Measuring force by hanging increasing masses on a force meter and recording the readings.',
      'Investigating magnetic force by testing which materials a bar magnet attracts, and observing iron filing patterns.',
      'Investigating electrostatic force by rubbing a plastic ruler with a cloth and bringing it near small pieces of paper.',
    ],
    examFocus: [
      'Define a force and state its unit and measuring instrument.',
      'Distinguish between contact and non-contact forces, with examples.',
      'State four effects a force can have on an object.',
    ],
  },
  {
    id: 'energy',
    eyebrow: 'Chapter 4',
    title: 'Energy',
    summary:
      'Energy is the capacity or ability to do work. It exists in many forms, can be stored as potential energy or exist as kinetic energy of movement, and can be converted from one form to another through energy converters and energy chains.',
    explanations: [
      {
        heading: 'What energy does',
        text: `**Energy** is the capacity or ability to do work. When a force causes an object to move, work has been done, and energy was needed to do it. We see, feel and hear the effects of energy — heat can be felt, sound can be heard, and light can be seen.`,
      },
      {
        heading: 'Kinetic and potential energy',
        text: `The two basic kinds of energy are:\n\n• **Kinetic energy** — the energy an object has when it is moving; all moving objects have kinetic energy.\n• **Potential energy** — stored energy that can be released to do work once triggered (e.g. releasing a stretched rubber band, or pushing an object off a cliff).\n\nPotential energy can be stored in three forms:\n1. **Gravitational potential energy** — possessed by an object able to move from a higher point to a lower point; the higher an object is lifted, the more it has.\n2. **Elastic potential energy** — stored due to the deformation (stretching or squeezing) of an elastic object; the more it's stretched or squeezed, the greater the stored energy.\n3. **Chemical potential energy** — stored within objects and released during a chemical reaction, e.g. in a battery before it's connected, or dynamite before it's lit.`,
      },
      {
        heading: 'Other forms of energy',
        text: 'The table below summarises other important forms of energy and where they come from.',
      },
      {
        heading: 'Energy conversion, chains and converters',
        text: `Energy can change or convert from one form to another — called an **energy transformation** — usually with the help of an **energy converter**.\n\nExamples:\n• Water's gravitational potential energy converts to electrical energy passing through turbines at a dam.\n• Rocket fuel's chemical potential energy converts to kinetic energy, then to gravitational potential energy as the rocket climbs.\n• Wind turbines convert kinetic energy in wind to electrical energy.\n\nAn **energy chain** is a diagram showing these conversions in order, e.g. gravitational potential energy → kinetic energy → electrical energy → light and heat energy (as in a hydroelectric dam powering a bulb).\n\nAn **energy converter** is a system that changes one form of energy to another. Man-made converters are called machines — bulbs, batteries, generators and solar panels are examples. A **dynamo** is a generator that converts kinetic (turning) energy into electricity.`,
      },
    ],
    definitions: [
      { term: 'Energy', meaning: 'The capacity or ability to do work.' },
      { term: 'Kinetic energy', meaning: 'The energy an object has because it is moving.' },
      { term: 'Potential energy', meaning: 'Stored energy that can be released to do work.' },
      { term: 'Energy chain', meaning: 'A diagram showing the order in which energy is converted from one form to another.' },
      { term: 'Energy converter', meaning: 'A device or system that changes energy from one form to another.' },
    ],
    tables: [
      {
        title: 'Other forms of energy',
        headers: ['Form of energy', 'Description', 'Sources'],
        rows: [
          ['Electrical energy', 'Released when electrons flow through wires', 'Lightning, mains electricity'],
          ['Light energy', 'Enables us to see in the dark', 'The sun, candles, bulbs'],
          ['Heat energy', 'Increases the temperature of objects', 'The sun, burning fuels'],
          ['Chemical energy', 'Released by chemical reactions', 'Food, batteries, fuel'],
          ['Sound energy', 'Produced when an object vibrates', 'Speakers, musical instruments'],
          ['Nuclear energy', 'Released when the nucleus of an atom is split', 'Nuclear reactors'],
          ['Mechanical energy', 'The sum of potential and kinetic energy of an object', 'A falling ball, a moving pendulum'],
        ],
      },
    ],
    keyPoints: [
      'Energy is the ability to do work.',
      'Kinetic energy is energy of movement; potential energy is stored energy.',
      'Potential energy can be gravitational, elastic, or chemical.',
      'An energy chain shows energy conversions in order; an energy converter is a device that performs the conversion.',
      'A dynamo converts kinetic energy into electricity.',
    ],
    practicals: ['Turning a dynamo connected to a bulb, first slowly then faster, and observing the effect on the bulb.'],
    examFocus: [
      'Define energy, kinetic energy and potential energy.',
      'Name the three types of potential energy.',
      'Draw an energy chain for a named device, such as a generator or torch.',
      'Name a man-made and a natural energy converter.',
    ],
  },
  {
    id: 'magnetism',
    eyebrow: 'Chapter 5',
    title: 'Magnetism',
    summary:
      'Magnetism is the magnetic force caused by the properties of certain materials. Magnets come in several shapes, always have two poles, and the Earth itself behaves like a giant bar magnet.',
    explanations: [
      {
        heading: 'Types of magnets',
        text: `**Magnetism** is the property of being magnetic; a **magnet** is an object that exerts a magnetic force. Magnets can be **natural** or **artificial** (magnetised by human activity). Artificial magnets can be **permanent** (keep their magnetism forever) or **non-permanent/temporary** (lose magnetism over time).\n\nCommon types:\n• **Bar magnet** — a straight bar with a north pole at one end and south pole at the other; found in fridge doors and labs.\n• **Horseshoe magnet** — a bar magnet bent into a U-shape, so both poles point the same direction, giving a stronger combined force; useful for lifting metal objects.\n• **C-magnet** — shaped like the letter C; used in motors, washing machines, fridges, speakers, air conditioners and cars.\n• **E-magnet (electromagnet)** — a temporary magnet whose field is caused by an electric current, so it can be switched on and off.`,
      },
      {
        heading: 'Magnetic and non-magnetic materials',
        text: `A material is **magnetic** if it experiences a magnetic force near a magnet, and **non-magnetic** if it does not. Iron, nickel and cobalt are naturally magnetic metals — any metal containing these is magnetic. Plastic, wood, glass and some metals like aluminium are non-magnetic.`,
      },
      {
        heading: 'Poles and magnetic fields',
        text: `Each end of a magnet is a **pole** — a north pole and a south pole. **Like poles repel** (push apart); **unlike poles attract** (pull together). A freely suspended magnet's north-seeking pole always points north.\n\nA **magnetic field** is the area around a magnet where a magnetic force can be detected; it weakens with distance. Magnetic field lines run from the north pole to the south pole outside the magnet — the closer together the lines, the stronger the field. Iron filings or a plotting compass can reveal the field's pattern.`,
      },
      {
        heading: 'The Earth as a magnet',
        text: `The Earth has a molten core of iron and nickel, giving it magnetic properties and effectively making it a giant bar magnet with its own north and south magnetic poles. This is why a compass needle always points north.`,
      },
    ],
    definitions: [
      { term: 'Magnetism', meaning: 'The property of being magnetic.' },
      { term: 'Magnet', meaning: 'An object that exerts a magnetic force.' },
      { term: 'Pole', meaning: 'One of the two ends of a magnet, north or south.' },
      { term: 'Magnetic field', meaning: 'The area around a magnet where a magnetic force can be detected.' },
      { term: 'Electromagnet', meaning: 'A temporary magnet whose magnetic field is produced by an electric current.' },
    ],
    tables: [
      {
        title: 'Types of magnets and their uses',
        headers: ['Type', 'Shape', 'Example use'],
        rows: [
          ['Bar magnet', 'Straight bar', 'Fridge doors, science labs'],
          ['Horseshoe magnet', 'U-shape', 'Lifting metal objects'],
          ['C-magnet', 'C-shape (arc)', 'Motors — washing machines, speakers, cars'],
          ['E-magnet (electromagnet)', 'Coil around a core', 'Devices needing a magnet that switches on/off'],
        ],
      },
    ],
    keyPoints: [
      'Bar, horseshoe, C- and E-magnets are the main magnet types; electromagnets can be switched on and off.',
      'Iron, nickel and cobalt are naturally magnetic; plastic, wood and glass are not.',
      'Like poles repel; unlike poles attract.',
      'Magnetic field lines run from north to south outside a magnet, and get weaker with distance.',
      'The Earth behaves like a giant bar magnet due to its molten iron-nickel core.',
    ],
    practicals: [
      'Sorting magnetic and non-magnetic materials using a bar magnet.',
      'Plotting magnetic field lines using iron filings sprinkled around a bar magnet under paper.',
    ],
    examFocus: [
      'Name and describe the different types of magnets.',
      'State the law of poles (like repel, unlike attract).',
      'Describe the pattern of magnetic field lines around a bar magnet.',
    ],
  },
  {
    id: 'electricity',
    eyebrow: 'Chapter 6',
    title: 'Electricity',
    summary:
      'Electricity involves the movement and behaviour of electric charges. This chapter covers the two types of charge, how static charge is produced, current electricity, conductors and insulators, and the components used to build a simple circuit.',
    explanations: [
      {
        heading: 'Types of charge and how they are produced',
        text: `There are two types of charge in nature: **negative** charge (from electrons) and **positive** charge (from protons). A neutral atom has equal numbers of each. If an object gains electrons it becomes more negatively charged; if it loses electrons, more positively charged.\n\nOutermost electrons are not held tightly to the nucleus, so friction between two surfaces can rub electrons off one surface onto another. The surface that loses electrons becomes positively charged; the one that gains electrons becomes negatively charged. **Static electricity** is this build-up of charge, usually from friction, and its discharge between two charged objects can be seen as small sparks.`,
      },
      {
        heading: 'Current electricity',
        text: `**Current** is the flow of negative charge (electrons) — the movement of charge from one point to another. For current to flow, there must be a complete path (circuit) and a source of electrical energy, such as a cell. Conventionally, current flows from the positive terminal of a cell, through the wires, to the negative terminal. Current is measured with an **ammeter**, in **amperes (A)**.`,
      },
      {
        heading: 'Conductors and insulators',
        text: `A **conductor** allows electric current to flow through it easily — copper is a good example. An **insulator** does not allow current to flow — plastic is a common example, which is why wires are covered in plastic.`,
      },
      {
        heading: 'Circuit components and symbols',
        text: `Every circuit needs a power source (a cell or battery), a switch to turn current on and off, and a load — the components that convert electrical energy into other forms, such as a bulb, radio or heater. Circuit diagrams use standardised symbols so anyone can read and build the same circuit.`,
      },
    ],
    definitions: [
      { term: 'Charge', meaning: 'A property of matter that can be positive or negative.' },
      { term: 'Static electricity', meaning: 'A build-up of charge on an object, usually from friction.' },
      { term: 'Current', meaning: 'The flow of electric charge (electrons) around a circuit, measured in amperes.' },
      { term: 'Conductor', meaning: 'A material that allows electric current to pass through easily, e.g. copper.' },
      { term: 'Insulator', meaning: 'A material that does not allow electric current to pass through, e.g. plastic.' },
    ],
    tables: [
      {
        title: 'Common circuit components',
        headers: ['Component', 'Function'],
        rows: [
          ['Connecting wires', 'Provide a path for electric current to flow'],
          ['Switch', 'Closed: current flows. Open: current does not flow'],
          ['Cell', 'Supplies electrical charge to the circuit'],
          ['Resistor', 'Restricts the flow of current, slowing it down'],
          ['Bulb', 'Converts electrical energy into light and heat energy'],
          ['Ammeter', 'Measures the size of the current'],
          ['Voltmeter', 'Measures the electrical energy (voltage) in a circuit'],
        ],
      },
    ],
    keyPoints: [
      'There are two types of charge: positive (protons) and negative (electrons); like charges repel, unlike charges attract.',
      'Friction can transfer electrons between surfaces, causing static electricity.',
      'Current is the flow of charge, measured in amperes with an ammeter.',
      'Copper is a conductor; plastic is an insulator.',
      'A circuit needs a power source, a switch, and a load, connected in a complete loop.',
    ],
    practicals: [
      'Rubbing a plastic ruler with cloth and using it to pick up small pieces of paper.',
      'Building a simple circuit to test which materials conduct electricity (wood, plastic, string, graphite, cloth, brass).',
    ],
    examFocus: [
      'State the two types of electric charge and how they behave.',
      'Define current, conductor and insulator.',
      'Draw and label a simple d.c. circuit with a cell, switch and bulb.',
      'Identify circuit component symbols and their functions.',
    ],
  },
];

/* ---------- Helper component to render a chapter's content ---------- */
const ChapterContent: React.FC<{ chapter: Chapter }> = ({ chapter }) => {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="p-5 bg-violet-50 rounded-xl text-slate-700 text-base leading-relaxed">
        {chapter.summary}
      </div>

      {/* Explanations */}
      {chapter.explanations.map((exp, idx) => (
        <div key={idx} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <h4 className="text-lg font-bold text-violet-700 mb-2">{exp.heading}</h4>
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
                  <tr className="bg-violet-50">
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
              <div key={i} className="bg-violet-50 p-3 rounded-lg">
                <span className="font-bold text-violet-800">{def.term}</span>
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
                <span className="inline-flex items-center justify-center bg-violet-600 text-white rounded-full w-5 h-5 text-xs font-bold mt-0.5 shrink-0">
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
                  ? 'bg-violet-600 border-b-4 border-violet-800 text-white shadow-sm'
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

/* ---------- Main Physics Component ---------- */
interface PhysicsProps {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const Physics: React.FC<PhysicsProps> = ({ onNextTopic, nextTopicTitle = 'Biology' }) => {
  // Build sections: first an Overview, then each chapter with full titles
  const sectionList = [
    {
      id: 'overview',
      title: 'Overview',
      content: (
        <div className="space-y-6">
          <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-violet-700 mb-3">Learning Outcomes</h3>
            <ol className="list-decimal list-inside space-y-1 text-slate-700">
              <li>Presenting Data</li>
              <li>Measurement</li>
              <li>Force</li>
              <li>Energy</li>
              <li>Magnetism</li>
              <li>Electricity</li>
            </ol>
          </div>
          <div className="p-5 bg-violet-50 rounded-xl text-slate-700">
            <p className="font-medium">Physics studies forces, energy and matter: presenting data clearly, measuring physical quantities accurately, understanding force and its effects, the forms and conversion of energy, magnetism, and electricity.</p>
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
      <header className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-800 border-b-4 border-violet-900 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="w-full px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-violet-400/30 text-white border border-violet-200/40 shadow-xs">
                PHYSICS
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                ZJC Form 1 • Combined Science
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                ⚡ {sectionList.length} Sections
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                🧲 Forces & Energy
              </span>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
            ⚡ Physics
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-violet-50 font-medium">
            Explore forces, energy and matter: presenting data, measurement, force, energy, magnetism and electricity.
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
          <div className="mt-12 rounded-3xl border-2 border-b-6 border-violet-800 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 p-6 sm:p-8 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💡</span>
              <h3 className="font-black text-xl sm:text-2xl">Key Takeaways</h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-violet-50 font-medium">
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">📊 Data:</strong>
                Tallies, tables and bar graphs organise and present information clearly.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">📏 Measurement:</strong>
                Length, mass, time and temperature each have their own SI unit and instrument; watch for parallax and zero errors.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🎯 Force:</strong>
                A push or pull, measured in newtons; contact forces need touching, non-contact forces act at a distance.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">⚡ Energy:</strong>
                Exists as kinetic or potential energy, and converts between forms through energy converters and chains.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🧲 Magnetism:</strong>
                Magnets have two poles — like poles repel, unlike poles attract — and Earth itself acts like a giant magnet.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">💡 Electricity:</strong>
                Charge, current, conductors, insulators and circuit components underpin how electrical circuits work.
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
                Next Section: <span className="text-violet-600 dark:text-violet-400">{nextTopicTitle}</span>
              </>
            ) : (
              <>
                Up Next: <span className="text-violet-600 dark:text-violet-400">{sectionList[activeIndex + 1].title}</span>
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
              className="rounded-2xl border-2 border-b-4 border-violet-800 bg-violet-600 px-8 py-3 text-xs sm:text-sm font-black text-white shadow-md transition-all hover:bg-violet-500 active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:border-slate-400 disabled:shadow-none"
            >
              {isLast ? `Begin ${nextTopicTitle} →` : 'Next Section →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Physics;