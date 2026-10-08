import React, { useState, useRef } from 'react';
import IndustrialProcesses from './IndustrialProcesses';
import OrganicChemistry from './OrganicChemistry';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Reactivity series
const reactivitySeriesSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400" width="100%" height="100%">
  <rect width="300" height="400" fill="white" />
  <text x="150" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Reactivity Series</text>
  <rect x="50" y="50" width="200" height="25" rx="4" fill="#ef4444" />
  <text x="150" y="68" text-anchor="middle" font-size="12" fill="white">Potassium (K)</text>
  <rect x="50" y="80" width="200" height="25" rx="4" fill="#ef4444" opacity="0.85" />
  <text x="150" y="98" text-anchor="middle" font-size="12" fill="white">Sodium (Na)</text>
  <rect x="50" y="110" width="200" height="25" rx="4" fill="#f59e0b" />
  <text x="150" y="128" text-anchor="middle" font-size="12" fill="white">Calcium (Ca)</text>
  <rect x="50" y="140" width="200" height="25" rx="4" fill="#f59e0b" opacity="0.85" />
  <text x="150" y="158" text-anchor="middle" font-size="12" fill="white">Magnesium (Mg)</text>
  <rect x="50" y="170" width="200" height="25" rx="4" fill="#eab308" />
  <text x="150" y="188" text-anchor="middle" font-size="12" fill="white">Aluminium (Al)</text>
  <rect x="50" y="200" width="200" height="25" rx="4" fill="#eab308" opacity="0.85" />
  <text x="150" y="218" text-anchor="middle" font-size="12" fill="white">Zinc (Zn)</text>
  <rect x="50" y="230" width="200" height="25" rx="4" fill="#facc15" />
  <text x="150" y="248" text-anchor="middle" font-size="12" fill="#1e293b">Iron (Fe)</text>
  <rect x="50" y="260" width="200" height="25" rx="4" fill="#facc15" opacity="0.85" />
  <text x="150" y="278" text-anchor="middle" font-size="12" fill="#1e293b">Lead (Pb)</text>
  <rect x="50" y="290" width="200" height="25" rx="4" fill="#d1d5db" />
  <text x="150" y="308" text-anchor="middle" font-size="12" fill="#1e293b">Copper (Cu)</text>
  <text x="150" y="350" text-anchor="middle" font-size="10" fill="#475569">Most reactive &#8594; Least reactive</text>
  <path d="M50 360 L250 360" stroke="#475569" stroke-width="1" marker-end="url(#arrow2)" />
  <defs>
    <marker id="arrow2" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
    </marker>
  </defs>
</svg>
`;

/* ---------- Image paths ----------
   New Form 4 artwork must be saved into:
     public/images/courses/o-level/combined-science/form-4/
   Drawing prompts for every file name below are in
     docs/FORM4_COMBINED_SCIENCE_IMAGE_PROMPTS.md
------------------------------------ */
const f4Image = (fileName: string) =>
  `/images/courses/o-level/combined-science/form-4/${fileName}`;

const chemImages = {
  /* ----- SVG diagrams drawn in code ----- */
  reactivitySeries: svgToDataUri(reactivitySeriesSvg),

  /* ----- New Form 4 artwork (save with these exact names) ----- */
  chromatographyApparatus: f4Image('chem-chromatography-setup.webp'),
  chromatographyStep1: f4Image('chem-chromatography-step1.png'),
  chromatographyStep2: f4Image('chem-chromatography-step2.png'),
  chromatographyStep3: f4Image('chem-chromatography-step3.png'),
  chromatographyStep4: f4Image('chem-chromatography-step4.png'),
  chromatographyStep5: f4Image('chem-chromatography-step5.png'),
  chromatogramRf: f4Image('chem-chromatogram-rf.png'),
  chromatogramInterpretation: f4Image('chem-chromatogram-interpretation.png'),

  periodicTableGroups: f4Image('chem-periodic-table-groups.png'),
  atomicSizeDownGroup: f4Image('chem-atomic-size-down-group.png'),
  group1WaterReaction: f4Image('chem-group1-water-reaction.png'),
  halogensAppearance: f4Image('chem-halogens-appearance.png'),
  halogenDisplacement: f4Image('chem-halogen-displacement.png'),
  nobleGasUses: f4Image('chem-noble-gas-uses.png'),
  transitionMetalColours: f4Image('chem-transition-metal-colours.png'),

  metalsOxygenReactions: f4Image('chem-metals-oxygen-reactions.png'),
  metalSteamStep1: f4Image('chem-metal-steam-step1.png'),
  metalSteamStep2: f4Image('chem-metal-steam-step2.png'),
  metalSteamStep3: f4Image('chem-metal-steam-step3.png'),
  metalAcidStep1: f4Image('chem-metal-acid-step1.png'),
  metalAcidStep2: f4Image('chem-metal-acid-step2.png'),
  metalAcidStep3: f4Image('chem-metal-acid-step3.png'),
  metalAcidStep4: f4Image('chem-metal-acid-step4.png'),
  displacementCopperSulphate: f4Image('chem-displacement-copper-sulphate.png'),
  rustingStep1: f4Image('chem-rusting-step1.png'),
  rustingStep2: f4Image('chem-rusting-step2.png'),
  rustingStep3: f4Image('chem-rusting-step3.png'),
  rustPrevention: f4Image('chem-rust-prevention.png'),
  extractionAndReactivity: f4Image('chem-extraction-and-reactivity.png'),



};

/* ---------- Small presentation helpers ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

/** Image that quietly removes itself if the artwork has not been added yet. */
const Figure: React.FC<{ src: string; alt: string; caption?: string; className?: string; compact?: boolean }> = ({
  src,
  alt,
  caption,
  className = '',
  compact = false,
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className={`mt-3 ${compact ? 'mx-auto w-full max-w-[780px]' : ''} ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="mx-auto block rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
        style={compact ? { width: 'auto', maxWidth: '100%', maxHeight: 'min(300px, 42svh)' } : { width: '100%' }}
      />
      {caption && (
        <figcaption className="mt-2 text-sm font-semibold text-slate-600">{caption}</figcaption>
      )}
    </figure>
  );
};

const Definition: React.FC<{ term: string; children: React.ReactNode }> = ({ term, children }) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Definition</p>
    <p className="mt-1 text-base leading-relaxed text-slate-800">
      <strong>{term}</strong> — {children}
    </p>
  </div>
);

const Example: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'Worked example',
  children,
}) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">{title}</p>
    <div className="mt-1 space-y-1 text-base leading-relaxed text-slate-800">{children}</div>
  </div>
);

const ExamTip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Exam tip</p>
    <div className="mt-1 space-y-1 text-base leading-relaxed text-slate-800">{children}</div>
  </div>
);

const WatchOut: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Watch out</p>
    <div className="mt-1 space-y-1 text-base leading-relaxed text-slate-800">{children}</div>
  </div>
);

const Safety: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-slate-50/70 p-4">
    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-700">Safety</p>
    <div className="mt-1 space-y-1 text-base leading-relaxed text-slate-800">{children}</div>
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h4 className="text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl">{title}</h4>
    <div className="mt-2 space-y-2 text-base leading-relaxed text-slate-700">{children}</div>
  </div>
);

const Step: React.FC<{ n: number; src?: string; alt?: string; children: React.ReactNode }> = ({
  n,
  src,
  alt,
  children,
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3">
    <p className="mb-1 text-sm font-bold text-slate-700">Step {n}</p>
    <p className="text-base leading-relaxed text-slate-700">{children}</p>
    {src && <Figure src={src} alt={alt ?? `Step ${n}`} className="mt-2" />}
  </div>
);

const Equation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg bg-slate-900 px-4 py-3 text-center font-mono text-base text-white shadow-sm">
    {children}
  </div>
);

const KeyList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="mb-3 text-lg font-bold text-slate-700">{title}</h3>
    <ul className="list-inside list-disc space-y-1 text-base text-slate-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const chemistryTopics: TopicSection[] = [
  /* =======================================================================
     1. PAPER CHROMATOGRAPHY
  ======================================================================= */
  {
    id: 'chromatography',
    title: 'Paper Chromatography',
    content: (
      <div className="grid gap-8">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              A green felt-tip pen looks like it contains one colour. Put a spot of its ink on wet filter
              paper, though, and the spot spreads out into a blue band and a yellow band. The
              &ldquo;green&rdquo; ink was never one substance at all — it was a <strong>mixture</strong>{' '}
              of two dyes. The technique that reveals this is called <strong>paper chromatography</strong>,
              and it is one of the most useful separation methods in chemistry because it works on
              extremely small samples.
            </p>
          </div>

          <Definition term="Paper chromatography">
            a method of separating and identifying the substances in a mixture of dissolved solids, by
            allowing a solvent to move up a piece of absorbent paper and carry the different substances
            different distances.
          </Definition>

          <Card title="Why the Substances Separate">
            <p>
              Two things are happening at the same time, and the balance between them decides how far
              each substance travels.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                The <strong>solvent</strong> (water, ethanol or propanone) soaks up the paper by
                capillary action. This is called the <strong>mobile phase</strong> because it moves.
              </li>
              <li>
                The <strong>paper</strong> itself holds substances back. It is called the{' '}
                <strong>stationary phase</strong> because it stays still.
              </li>
            </ul>
            <p>
              A substance that dissolves <em>very well</em> in the solvent and is only weakly attracted to
              the paper gets carried a long way up. A substance that dissolves <em>poorly</em> and clings
              tightly to the paper hardly moves at all. Because every substance has its own particular
              balance of solubility and attraction, each one ends up at a different height — and the
              mixture has separated itself.
            </p>
            <Figure
              compact src={chemImages.chromatographyApparatus}
              alt="Labelled paper chromatography apparatus in a covered beaker"
              caption="Fig 1.1 — Chromatography apparatus. Every label here can be asked for in an exam: beaker, lid, chromatography paper, pencil baseline, sample spot, solvent and solvent front."
            />
          </Card>

          <Card title="Chromatography Results and Applications">
            <Figure compact src={f4Image('chem-chromatography-finished.webp')} alt="Finished chromatogram with a pencil start line, separated dye spots and marked solvent front" />
            <p>Chromatography can separate mixtures of dyes and pigments extracted from plants. A solvent carries the components up the paper; their different attractions to the stationary phase and solubilities in the solvent make them travel different distances.</p>
            <p><strong>Activity:</strong> use small spots of suitable dyes or teacher-prepared plant extracts on a pencil start line. Keep the initial solvent level below the spots, allow the solvent to rise, and mark the solvent front before it dries. Compare the separated spots. Filter paper or chromatography paper can be used; thin-layer chromatography uses a coated plate instead.</p>
            <p className="text-sm">The listed syllabus resources include benzene and toluene. These hazardous solvents should not be used casually by learners; a teacher selects a suitable safer solvent, such as water for water-soluble dyes, with appropriate ventilation and fire precautions where needed.</p>
          </Card>

          <Card title="Rf Values — Putting a Number on the Result">
            <p>
              Simply saying &ldquo;a red spot near the top&rdquo; is not scientific enough, because the
              height depends on how long you left the experiment running. Instead chemists calculate a{' '}
              <strong>retardation factor</strong>, or <strong>Rf value</strong>, which is a ratio and is
              therefore the same every time for the same substance in the same solvent.
            </p>
            <Equation>Rf = distance moved by the spot &divide; distance moved by the solvent front</Equation>
            <p>
              Both distances are measured <strong>from the pencil baseline</strong>: to the{' '}
              <em>centre</em> of the spot for the numerator, and to the solvent front for the denominator.
            </p>
            <Figure
              src={chemImages.chromatogramRf}
              alt="Chromatogram with measurements marked for calculating an Rf value"
              caption="Fig 1.2 — Measuring for an Rf value. Measure from the baseline to the centre of the spot, and from the baseline to the solvent front."
            />
            <Example>
              <p>
                On a chromatogram, a blue dye has moved 3.6 cm from the baseline and the solvent front has
                moved 8.0 cm.
              </p>
              <p>Rf = 3.6 &divide; 8.0 = <strong>0.45</strong></p>
              <p>
                Rf has <strong>no units</strong>, because it is a distance divided by a distance. It is
                always a number between 0 and 1 — if you ever calculate more than 1 you have divided the
                wrong way round.
              </p>
            </Example>
            <WatchOut>
              <p>
                Rf values are only comparable if the <strong>same solvent</strong> and the same type of
                paper were used. A dye with an Rf of 0.45 in water may have a completely different Rf in
                ethanol, so a question will always tell you which solvent was used.
              </p>
            </WatchOut>
          </Card>

          <Card title="Reading a Chromatogram">
            <Figure
              src={chemImages.chromatogramInterpretation}
              alt="Chromatogram comparing an unknown mixture against four known reference substances"
              caption="Fig 1.3 — An unknown mixture X run alongside four known substances A, B, C and D. X contains A and C, because its spots line up with theirs."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>One spot</strong> from a sample means the sample is a <strong>pure</strong>{' '}
                substance.
              </li>
              <li>
                <strong>Two or more spots</strong> means it is a <strong>mixture</strong>, and the number
                of spots is the minimum number of substances present.
              </li>
              <li>
                To identify what a mixture contains, run known reference substances on the{' '}
                <strong>same paper at the same time</strong>. Any spot in the mixture that lines up at the
                same height as a reference spot is that substance.
              </li>
              <li>
                Some substances are colourless. They are made visible by spraying with a{' '}
                <strong>locating agent</strong> (such as ninhydrin for amino acids) or by viewing the paper
                under an ultraviolet lamp.
              </li>
            </ul>
          </Card>

          <Card title="Where Chromatography Is Used in Real Life">
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Food industry:</strong> checking which colourings and additives are in a drink or
                sweet, and whether any banned dye has been used.
              </li>
              <li>
                <strong>Forensic science:</strong> comparing ink from a ransom note or a forged cheque with
                ink from a suspect&rsquo;s pen.
              </li>
              <li>
                <strong>Sport:</strong> testing athletes&rsquo; urine samples for banned performance-
                enhancing drugs.
              </li>
              <li>
                <strong>Medicine:</strong> analysing blood and urine to detect poisons, drugs or abnormal
                chemicals that indicate disease.
              </li>
              <li>
                <strong>Plant science:</strong> separating the different pigments in a leaf extract
                (chlorophyll a, chlorophyll b, carotene and xanthophyll).
              </li>
            </ul>
          </Card>

          <ExamTip>
            <p>
              Four &ldquo;why&rdquo; questions come up again and again. Learn the answers word for word:{' '}
              <strong>pencil</strong> is used for the baseline because it is insoluble;{' '}
              <strong>the solvent must be below the baseline</strong> or the sample would dissolve into the
              solvent; <strong>the beaker is covered</strong> to stop the solvent evaporating; and{' '}
              <strong>the solvent front is marked immediately</strong> because it disappears as the paper
              dries.
            </p>
          </ExamTip>
        </div>

      </div>
    ),
  },

  /* =======================================================================
     2. PERIODIC TABLE TRENDS
  ======================================================================= */


  /* =======================================================================
     3. METALS AND NON-METALS
  ======================================================================= */


];

const ChemistryTable: React.FC<{ headers: string[]; rows: string[][] }> = ({ headers, rows }) => (
  <div className="overflow-x-auto rounded-lg border border-slate-200">
    <table className="w-full border-collapse text-left text-base text-slate-700">
      <thead className="bg-slate-50"><tr>{headers.map(h => <th key={h} scope="col" className="border p-3">{h}</th>)}</tr></thead>
      <tbody>{rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0
        ? <th key={j} scope="row" className="border p-3 align-top font-semibold">{cell}</th>
        : <td key={j} className="border p-3 align-top">{cell}</td>)}</tr>)}</tbody>
    </table>
  </div>
);

const separationFoundation = (
  <div className="space-y-6">
    <p className="text-lg leading-relaxed text-slate-700">A mixture contains substances that are not chemically joined. Separation uses differences in physical properties, such as solubility, magnetism, particle mass and boiling point, to recover its components.</p>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {[
      { title: 'Filtration', file: 'filtration', principle: 'Separates an insoluble solid from a liquid. Liquid passes through the pores in filter paper; solid particles are retained.', example: 'Sand and water: sand is the residue, while the collected water is the filtrate. Dissolved salt passes through, so filtration does not remove it.' },
      { title: 'Magnetism', file: 'magnetism', principle: 'A magnet attracts a magnetic component, such as iron, from non-magnetic material.', example: 'Separate iron filings from sulphur, or remove iron objects from grain before grinding. Not all metals are attracted to a magnet.' },
      { title: 'Winnowing', file: 'winnowing', principle: 'Moving air carries away lighter chaff while heavier grain falls back.', example: 'Separate husks or chaff from harvested grain.' },
      { title: 'Decanting', file: 'decanting', principle: 'Allow an insoluble solid to settle, then carefully pour off the liquid without disturbing the sediment.', example: 'Pour clear water off settled sand or mud. Some fine particles may remain, so the separation may be incomplete.' },
      { title: 'Evaporation and Crystallisation', file: 'evaporation', principle: 'Evaporation removes solvent and leaves dissolved solid. For crystals, concentrate a solution and allow it to cool or evaporate slowly.', example: 'Recover a suitable soluble solid from solution. The solvent is not collected; use distillation if you need to recover it.' },
    ].map(method => (
      <Card key={method.file} title={method.title}>
        <p>{method.principle}</p>
        <Figure compact src={f4Image(`chem-separation-${method.file}.webp`)} alt={`Labelled drawing showing ${method.title.toLowerCase()}`} />
        <p><strong>Example:</strong> {method.example}</p>
      </Card>
    ))}
    </div>
    <Card title="Applications of Separation Methods">
      <ChemistryTable headers={['Application', 'Method', 'Why it works']} rows={[
        ['Treatment of water', 'Filtration', 'Removes suspended insoluble particles. Drinking-water treatment also needs appropriate disinfection; filtration alone does not guarantee safe water.'],
        ['Grain separation', 'Winnowing', 'Air moves light chaff away from heavier grain.'],
        ['Metal objects in grain before grinding', 'Magnetism', 'A magnet removes magnetic iron or steel objects, protecting the grinder and food product.'],
        ['Metal waste for recycling', 'Magnetism', 'Separates magnetic iron and steel from non-magnetic waste; other metals require other sorting methods.'],
        ['Sugar and ammonium nitrate crystals from solution', 'Concentration and crystallisation', 'Removing some solvent and cooling or further controlled evaporation allows crystals to form. These are industrial applications, not instructions to heat ammonium nitrate in class.'],
      ]} />
      <p><strong>Activities:</strong> use multimedia or a field trip to compare water treatment, grain processing and recycling. Under teacher supervision, demonstrate safe examples of filtration, magnetic separation, winnowing, decanting and evaporation. ICT tools and an iron–sulphur mixture can support the discussion; do not heat that mixture when demonstrating physical separation.</p>
    </Card>
    <Card title="Simple Distillation">
      <p><strong>Distillation</strong> recovers a liquid by evaporation followed by condensation. Heat an impure-water sample so water vaporises; cool the vapour in a condenser and collect the <strong>distillate</strong>. Non-volatile dissolved impurities remain in the flask.</p>
      <Figure compact src={f4Image('chem-simple-distillation.svg')} alt="Simple distillation drawing showing flask, thermometer, condenser cooling-water connections and collecting vessel" />
      <p>The thermometer bulb is at the entrance to the condenser so it measures vapour temperature. Cooling water enters the condenser at its lower end and leaves at its upper end, keeping the jacket full. Vapour condenses back into liquid.</p>
      <p><strong>Demonstration:</strong> a teacher distils suitable impure water and compares the original sample with the collected distillate. A simple distillation unit and chart help identify each part. The receiving vessel must not seal the apparatus.</p>
    </Card>
    <Card title="Fractional Distillation">
      <p><strong>Fractional distillation</strong> separates miscible liquids with different boiling points more effectively than simple distillation, especially when the boiling points are close. A fractionating column provides repeated evaporation and condensation. Vapour reaching the top becomes richer in the more volatile component.</p>
      <Figure compact src={f4Image('chem-fractional-distillation.svg')} alt="Fractional distillation drawing with a packed column, thermometer at its top, condenser and ethanol-rich distillate" />
      <p>In dilute ethanol and water, ethanol is more volatile and boils at about 78°C as a pure substance, compared with about 100°C for water at normal atmospheric pressure. The first fraction is ethanol-rich, not necessarily pure ethanol; ordinary fractional distillation cannot give completely pure ethanol from this mixture.</p>
      <p><strong>Demonstration:</strong> use a teacher-prepared fractional distillation unit to concentrate dilute ethanol. Collect fractions and observe the vapour temperature. Use controlled electric heating or a suitable water bath rather than a naked flame, because ethanol is flammable.</p>
      <ChemistryTable headers={['Feature', 'Simple distillation', 'Fractional distillation']} rows={[
        ['Main use', 'Recovering solvent from non-volatile dissolved impurities', 'Separating mixtures of miscible liquids'],
        ['Column', 'No fractionating column', 'Fractionating column above the boiling flask'],
        ['Process', 'Vaporisation followed by condensation', 'Repeated vaporisation and condensation within the column'],
      ]} />
    </Card>
  </div>
);

const firstTwentyElements = [
  ['1', 'Hydrogen', 'H', '1'], ['2', 'Helium', 'He', '2'],
  ['3', 'Lithium', 'Li', '2,1'], ['4', 'Beryllium', 'Be', '2,2'],
  ['5', 'Boron', 'B', '2,3'], ['6', 'Carbon', 'C', '2,4'],
  ['7', 'Nitrogen', 'N', '2,5'], ['8', 'Oxygen', 'O', '2,6'],
  ['9', 'Fluorine', 'F', '2,7'], ['10', 'Neon', 'Ne', '2,8'],
  ['11', 'Sodium', 'Na', '2,8,1'], ['12', 'Magnesium', 'Mg', '2,8,2'],
  ['13', 'Aluminium', 'Al', '2,8,3'], ['14', 'Silicon', 'Si', '2,8,4'],
  ['15', 'Phosphorus', 'P', '2,8,5'], ['16', 'Sulphur', 'S', '2,8,6'],
  ['17', 'Chlorine', 'Cl', '2,8,7'], ['18', 'Argon', 'Ar', '2,8,8'],
  ['19', 'Potassium', 'K', '2,8,8,1'], ['20', 'Calcium', 'Ca', '2,8,8,2'],
];

const matterFoundation = (
  <div className="space-y-6">
    <Card title="States of Matter and Kinetic Theory">
      <Figure src={f4Image('chem-matter-states.svg')} alt="Solid particles are close and ordered; liquid particles are close and irregular; gas particles are far apart." caption="Solid particles are close and ordered; liquid particles are close and irregular; gas particles are far apart." />
      <p>The three states of matter are <strong>solid, liquid and gas</strong>. Kinetic theory explains their properties using particle arrangement, movement and attractions. Particles are always moving; heating increases their average kinetic energy.</p>
      <ChemistryTable headers={['State', 'Particle arrangement and movement', 'Properties']} rows={[
        ['Solid', 'Particles are closely packed, usually in an ordered arrangement, and vibrate about fixed positions.', 'Fixed shape and volume; difficult to compress.'],
        ['Liquid', 'Particles are close together but irregularly arranged and can move past one another.', 'Fixed volume; flows and takes the container’s shape; difficult to compress.'],
        ['Gas', 'Particles are far apart and move rapidly and randomly in all directions.', 'No fixed shape or volume; fills its container and is easily compressed.'],
      ]} />
      <p>Melting and boiling overcome attractions between particles; cooling can cause condensation or freezing. The particles themselves do not expand when a substance expands — their average separation changes. Gas pressure results from particles colliding with container walls.</p>
    </Card>

    <Card title="Elements, Compounds and Mixtures">
      <Figure src={f4Image('chem-matter-types.svg')} alt="Compare one atom type, identical bonded particles, and a mixture of different particles." caption="Compare one atom type, identical bonded particles, and a mixture of different particles." />
      <ChemistryTable headers={['Type', 'Meaning', 'Example and separation']} rows={[
        ['Element', 'A substance containing only one type of atom, defined by its proton number.', 'Iron, oxygen or copper; cannot be broken into simpler substances by ordinary chemical methods.'],
        ['Compound', 'Two or more elements chemically joined in a fixed ratio.', 'Water (H₂O) or sodium chloride (NaCl); chemical changes are needed to separate its constituent elements.'],
        ['Mixture', 'Two or more substances together without chemical bonding between them; composition can vary.', 'Air, salt solution or iron and sulphur before heating; suitable physical methods can separate components.'],
      ]} />
      <p>Metals occupy mainly the left and centre of the Periodic Table; non-metals are mainly towards the upper right. Hydrogen is a non-metal despite appearing above Group I.</p>
    </Card>

    <Card title="Solubility and the Rate of Dissolving">
      <Definition term="Solubility">the maximum amount of a solute that dissolves in a specified amount of solvent at a stated temperature to form a saturated solution.</Definition>
      <p>A <strong>solute</strong> dissolves in a <strong>solvent</strong> to form a solution. A saturated solution cannot dissolve more of that solute under the same conditions.</p>
      <ChemistryTable headers={['Factor named in the syllabus', 'What changes']} rows={[
        ['Particle size', 'Smaller pieces have a larger exposed surface area and usually dissolve faster. Particle size does not normally change the final equilibrium solubility.'],
        ['Stirring', 'Brings fresh solvent to the solid surface, speeding dissolution. It does not normally increase the maximum amount that can dissolve.'],
        ['Temperature', 'Can change both rate and equilibrium solubility. Many solids become more soluble as temperature rises, but not all do; gases generally become less soluble.'],
      ]} />
      <p>The identities of the solute and solvent also matter. Compare equal masses of crushed and uncrushed solute, or stirred and unstirred samples, while controlling temperature and solvent amount.</p>
    </Card>

    <Card title="Concentration of Solutions">
      <Figure src={f4Image('chem-matter-concentration.svg')} alt="Equal volumes of the same coloured solution: more dissolved solute produces a darker colour." caption="Equal volumes of the same coloured solution: more dissolved solute produces a darker colour." />
      <p>Concentration describes how much solute is present in a given amount of solution. For comparisons, dissolve different amounts of the same solute in a fixed amount of solvent. More dissolved solute gives a more concentrated solution, provided it all dissolves.</p>
      <p>For the <strong>same coloured solute</strong>, equal-sized containers and equal viewing depths, a more intense colour usually indicates a higher concentration. Compare with known reference solutions. Different substances cannot be compared by colour alone, and colourless solutions cannot be judged this way.</p>
      <p><strong>Activity:</strong> prepare labelled samples using increasing solute masses and the same solvent amount; compare colour intensity under the same lighting. For numerical concentration calculations, use the <strong>final volume of solution</strong>, not just the starting solvent volume.</p>
      <p className="rounded-lg bg-slate-50 p-3 font-semibold">Mass concentration (g/dm³) = mass of dissolved solute (g) ÷ volume of solution (dm³)</p>
    </Card>

    <Card title="Atomic Structure and Sub-Atomic Particles">
      <Figure src={f4Image('chem-matter-atom.svg')} alt="A labeled carbon-12 atom showing its nucleus, six protons, six neutrons and electron shells containing 2 and 4 electrons." caption="A labeled carbon-12 atom showing its nucleus, six protons, six neutrons and electron shells containing 2 and 4 electrons." />
      <ChemistryTable headers={['Particle', 'Relative charge', 'Relative mass', 'Position']} rows={[
        ['Proton', '+1', '1', 'In the nucleus'],
        ['Neutron', '0', '1', 'In the nucleus'],
        ['Electron', '−1', 'About 1/1836 (very small)', 'In shells around the nucleus'],
      ]} />
      <p>Almost all atomic mass is concentrated in the tiny nucleus. A neutral atom has equal numbers of protons and electrons. Losing electrons forms a positive ion; gaining electrons forms a negative ion. Ordinary chemical reactions change electrons and bonding, not an atom’s proton number.</p>
      <p>In the simple shell model for the first 20 elements, fill the first shell with up to 2 electrons, then the next shells as shown below. Potassium and calcium begin a fourth shell after the third contains 8 electrons.</p>
    </Card>

    <Card title="The First 20 Elements and Their Electronic Configurations">
      <Figure src={f4Image('chem-matter-first20.svg')} alt="The first 20 elements arranged by period and main group, with atomic numbers, symbols and names." caption="The first 20 elements arranged by period and main group, with atomic numbers, symbols and names." />
      <ChemistryTable headers={['Atomic number', 'Element', 'Symbol', 'Electrons in shells']} rows={firstTwentyElements} />
      <p>The numbers in each configuration must add up to the atomic number of a neutral atom. For example, calcium has 20 electrons: <strong>2,8,8,2</strong>. Symbols begin with a capital letter; a second letter is lowercase.</p>
      <p>Periods are horizontal rows and groups are vertical columns. In the main groups, elements have related chemical properties because they have the same number of outer-shell electrons.</p>
    </Card>

    <Card title="Ionic Bonding">
      <Figure src={f4Image('chem-matter-ionic.svg')} alt="Electron transfer in NaCl, MgO and Na₂O, with initial electron arrangements and the resulting charged ions." caption="Electron transfer in NaCl, MgO and Na₂O, with initial electron arrangements and the resulting charged ions." />
      <p>Electrons are transferred from one atom to another. The resulting oppositely charged ions attract each other: this electrostatic attraction is an <strong>ionic bond</strong>. Ionic compounds form lattices rather than separate small molecules.</p>
      <ChemistryTable headers={['Compound', 'Electron transfer', 'Ions and ratio']} rows={[
        ['NaCl', 'One sodium atom transfers one electron to one chlorine atom.', 'Na⁺ and Cl⁻ combine 1:1.'],
        ['MgO', 'One magnesium atom transfers two electrons to one oxygen atom.', 'Mg²⁺ and O²⁻ combine 1:1.'],
        ['Na₂O', 'Two sodium atoms each transfer one electron to one oxygen atom.', 'Two Na⁺ ions balance one O²⁻ ion.'],
      ]} />
      <p>Examples: Na (2,8,1) becomes Na⁺ (2,8); Cl (2,8,7) becomes Cl⁻ (2,8,8). Magnesium and oxygen also gain stable outer shells when they form their ions.</p>
    </Card>

    <Card title="Covalent Bonding">
      <Figure src={f4Image('chem-matter-covalent.svg')} alt="Dot-and-cross diagrams for H₂, Cl₂ and H₂O showing shared electron pairs and lone pairs." caption="Dot-and-cross diagrams for H₂, Cl₂ and H₂O showing shared electron pairs and lone pairs." />
      <p>A <strong>covalent bond</strong> is a shared pair of electrons between atoms. Sharing helps atoms achieve stable outer shells.</p>
      <ChemistryTable headers={['Molecule', 'Bonding']} rows={[
        ['H₂', 'Two hydrogen atoms share one pair: each has two electrons in its first shell.'],
        ['Cl₂', 'Two chlorine atoms share one pair: each has eight electrons in its outer shell.'],
        ['H₂O', 'Oxygen shares one pair with each hydrogen, making two O–H bonds; oxygen also has two lone pairs.'],
      ]} />
      <p>Many simple molecular substances have relatively low melting and boiling points because attractions between molecules are weaker than their covalent bonds. This is not true of giant covalent structures.</p>
    </Card>

    <Card title="Atomic Number, Mass Number and Isotopes">
      <Figure src={f4Image('chem-matter-isotopes.svg')} alt="Carbon-12 and carbon-14 nuclei both have six protons but contain six and eight neutrons respectively." caption="Carbon-12 and carbon-14 nuclei both have six protons but contain six and eight neutrons respectively." />
      <p><strong>Atomic number (proton number), Z</strong>, is the number of protons. <strong>Mass number, A</strong>, is the total number of protons and neutrons in one atom. In nuclide notation, the mass number is written above the atomic number to the left of the symbol: <strong>¹⁶₈O</strong>.</p>
      <p className="rounded-lg bg-slate-50 p-3 font-semibold">Neutrons = mass number − atomic number (A − Z)</p>
      <Definition term="Isotopes">atoms of the same element with the same proton number but different neutron numbers, and therefore different mass numbers.</Definition>
      <ChemistryTable headers={['Isotope', 'Protons', 'Neutrons', 'Electrons in a neutral atom']} rows={[
        ['¹⁶₈O', '8', '8', '8'], ['¹⁸₈O', '8', '10', '8'],
        ['³⁵₁₇Cl', '17', '18', '17'], ['³⁷₁₇Cl', '17', '20', '17'],
        ['¹²₆C', '6', '6', '6'], ['¹⁴₆C', '6', '8', '6'],
      ]} />
      <p><strong>Relative atomic mass, Aᵣ</strong>, is the weighted mean atomic mass compared with one-twelfth of the mass of a carbon-12 atom. It has no unit and is not the same as mass number. For a 75% chlorine-35 and 25% chlorine-37 example: Aᵣ = (35 × 75 + 37 × 25) ÷ 100 = <strong>35.5</strong>.</p>
    </Card>

    <Card title="The Mole and Avogadro’s Number">
      <Definition term="Mole">an amount of substance containing 6.02214076 × 10²³ specified particles, such as atoms, molecules or formula units.</Definition>
      <p>Avogadro’s number is usually rounded in school calculations to <strong>6.02 × 10²³</strong>; Avogadro’s constant has units mol⁻¹. Always state which particles you are counting.</p>
      <p><strong>Relative molecular mass, Mᵣ</strong>, is the sum of the relative atomic masses in a molecule. For an ionic compound, use relative formula mass. For water, Mᵣ = 2(1) + 16 = <strong>18</strong>; for NaCl, relative formula mass = 23 + 35.5 = <strong>58.5</strong>.</p>
      <p className="rounded-lg bg-slate-50 p-3 font-semibold">n (mol) = m (g) ÷ M (g/mol) &nbsp; | &nbsp; particles = n × Avogadro’s constant</p>
      <p><strong>M</strong> is molar mass. Its numerical value in g/mol matches Aᵣ for atoms or Mᵣ for molecules. This is the meaning behind the school shorthand n = m/Mᵣ; Mᵣ itself has no unit.</p>
      <p><strong>Example:</strong> 9 g of water has n = 9 ÷ 18 = <strong>0.50 mol</strong>, containing about <strong>3.01 × 10²³ water molecules</strong>.</p>
    </Card>

    <Card title="Empirical and Molecular Formulae">
      <p>The <strong>empirical formula</strong> gives the simplest whole-number ratio of atoms. The <strong>molecular formula</strong> gives the actual numbers in one molecule.</p>
      <ol className="list-decimal space-y-2 pl-6">
        <li>For percentage composition, assume 100 g so each percentage becomes a mass in grams.</li>
        <li>Divide each mass by the element’s Aᵣ to obtain relative mole amounts.</li>
        <li>Divide by the smallest result, then multiply all ratios if needed to obtain whole numbers.</li>
        <li>Calculate the empirical formula mass. Divide the given Mᵣ by it and multiply all subscripts by that factor.</li>
      </ol>
      <Example title="Worked example: 40.0% carbon, 6.7% hydrogen and 53.3% oxygen">
        <p>Using Aᵣ values C = 12, H = 1, O = 16: 40/12 ≈ 3.33; 6.7/1 = 6.7; 53.3/16 ≈ 3.33. Divide by 3.33 to get approximately <strong>1:2:1</strong>, so the empirical formula is <strong>CH₂O</strong>.</p>
        <p>Empirical formula mass = 12 + 2 + 16 = 30. If the molecular Mᵣ is 180, the factor is 180/30 = 6, so the molecular formula is <strong>C₆H₁₂O₆</strong>.</p>
      </Example>
    </Card>

    <Card title="Concentration in g/dm³ and mol/dm³">
      <p className="rounded-lg bg-slate-50 p-3 font-semibold">c (mol/dm³) = n ÷ V &nbsp; | &nbsp; mass concentration (g/dm³) = m ÷ V</p>
      <p className="rounded-lg bg-slate-50 p-3 font-semibold">Mass concentration = molar concentration × molar mass</p>
      <p>Use the final solution volume in dm³: <strong>1 dm³ = 1000 cm³</strong>. Convert cm³ to dm³ by dividing by 1000.</p>
      <Example title="Worked example: 5.85 g of NaCl made up to 500 cm³ of solution">
        <p>V = 500/1000 = 0.500 dm³. M(NaCl) = 58.5 g/mol. Amount n = 5.85/58.5 = 0.100 mol.</p>
        <p>Molar concentration = 0.100/0.500 = <strong>0.200 mol/dm³</strong>. Mass concentration = 5.85/0.500 = <strong>11.7 g/dm³</strong>.</p>
      </Example>
    </Card>

    <Card title="Groups I, II, VII and VIII: Overview">
      <ChemistryTable headers={['Syllabus group', 'Outer electrons and properties', 'Typical ions']} rows={[
        ['I (modern Group 1)', 'One outer electron; soft, silvery metals with relatively low melting points. React with oxygen and vigorously with water; reactivity generally increases down the group.', '+1'],
        ['II (modern Group 2)', 'Two outer electrons; silvery metals, generally harder and with higher melting points than Group I metals. React with oxygen and dilute acids; reaction with water varies, and reactivity generally increases down the group.', '+2'],
        ['VII (modern Group 17)', 'Seven outer electrons; coloured, diatomic non-metals. At room temperature chlorine is a gas, bromine a liquid and iodine a solid. Melting and boiling points rise down the group; reactivity decreases.', '−1'],
        ['VIII / Group 0 (modern Group 18)', 'Colourless monatomic gases with low boiling points and very low reactivity because their outer shells are full. Helium has 2 outer electrons, the others have 8.', 'Do not normally form ions'],
      ]} />
      <p><strong>Uses of halogens:</strong> chlorine is used for water disinfection and chemical manufacture; iodine in suitable antiseptic preparations. Fluoride compounds, not elemental fluorine, are used in toothpaste.</p>
    </Card>

    <Card title="Metal Reactions and Reactivity Predictions">
      <Figure src={f4Image('chem-matter-reactivity.svg')} alt="Metals ordered from potassium to gold with hydrogen marked as a non-metal reference point." caption="Metals ordered from potassium to gold with hydrogen marked as a non-metal reference point." />
      <ChemistryTable headers={['Reactant', 'General outcome', 'Balanced example']} rows={[
        ['Oxygen in air', 'Metal + oxygen → metal oxide', '2Mg + O₂ → 2MgO'],
        ['Cold water (reactive metal)', 'Metal + water → hydroxide + hydrogen', '2Na + 2H₂O → 2NaOH + H₂'],
        ['Steam (suitable metal)', 'Metal + steam → oxide + hydrogen', 'Mg + H₂O(g) → MgO + H₂'],
        ['Dilute hydrochloric acid (metal above hydrogen)', 'Metal + acid → salt + hydrogen', 'Mg + 2HCl → MgCl₂ + H₂'],
      ]} />
      <p className="rounded-lg bg-slate-50 p-3 font-semibold">Decreasing reactivity: K → Na → Ca → Mg → Al → Zn → Fe → Sn → Pb → H → Cu → Ag → Au</p>
      <p>Hydrogen is a reference point, not a metal. Metals above it generally release hydrogen from suitable dilute acids; copper, silver and gold do not.</p>
      <p>Reaction rates also depend on conditions and surface layers: aluminium may appear less reactive because of its protective oxide film.</p>
    </Card>
  </div>
);

const acidsBasesSaltsFoundation = (
  <div className="space-y-6">
    <p className="text-base text-slate-700">This topic is called <strong>Acids and Bases</strong> in the competency matrix and <strong>Acids, Bases and Salts</strong> elsewhere. The headings below group the document’s points. Salt preparation appears in the scope and sequence (page 9).</p>
    <Card title="Identifying Acids and Bases">
      <p><strong>Learning objectives:</strong> identify acids and bases using red and blue litmus; list their properties.</p>
      <Definition term="Base">a substance that neutralises an acid. An alkali is a base that dissolves in water, such as sodium hydroxide or ammonia solution.</Definition>
      <ChemistryTable headers={['Property', 'Acid', 'Base / alkali']} rows={[
        ['Litmus', 'Turns blue litmus red; red litmus stays red.', 'An alkali turns red litmus blue; blue litmus stays blue.'],
        ['pH in aqueous solution', 'Below 7.', 'An alkaline solution has a pH above 7.'],
        ['Reactions', 'Neutralises bases; reacts with suitable metals and carbonates.', 'Neutralises acids to form a salt and water.'],
      ]} />
      <Figure compact src={f4Image('chem-acids-litmus.webp')} alt="Red and blue litmus results for acidic, neutral and alkaline solutions." caption="Test each sample with both red and blue litmus. Neutral solutions change neither paper." />
      <p><strong>Activity:</strong> dip fresh red and blue litmus papers into separate samples of HCl, NaOH, H₂O, CuSO₄ solution and tap water. Record both results, then classify each sample from the evidence.</p>
      <ChemistryTable headers={['Sample', 'Expected observation']} rows={[
        ['Hydrochloric acid (HCl)', 'Blue litmus turns red; acidic.'],
        ['Sodium hydroxide (NaOH)', 'Red litmus turns blue; alkaline.'],
        ['Pure water (H₂O)', 'Neither paper changes; neutral under usual classroom conditions.'],
        ['Copper(II) sulphate (CuSO₄) solution', 'Often mildly acidic; record the actual litmus response. A salt solution is not necessarily neutral.'],
        ['Tap water', 'Test rather than assume: dissolved substances can affect its pH.'],
      ]} />
      <p><strong>Resources:</strong> red and blue litmus papers; the listed solutions and labelled sample containers.</p>
    </Card>
    <Card title="Acid–Base Reactions">
      <p><strong>Learning objective:</strong> describe an acid–base reaction. In <strong>neutralisation</strong>, an acid reacts with a base to produce a salt and water.</p>
      <p className="rounded-lg bg-slate-50 p-3 font-semibold">Acid + base → salt + water</p>
      <p>Hydrochloric acid + sodium hydroxide → sodium chloride + water<br /><strong>HCl + NaOH → NaCl + H₂O</strong></p>
      <p>Sulphuric acid + sodium hydroxide → sodium sulphate + water<br /><strong>H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O</strong></p>
      <p><strong>Activity:</strong> under teacher supervision, add dilute HCl gradually to a small sample of NaOH solution, mix and test small samples with fresh litmus. Repeat using dilute H₂SO₄. Observe how the mixture changes from alkaline towards neutral and becomes acidic if excess acid is added. Litmus indicates the region; it does not measure an exact pH.</p>
      <p><strong>Resources:</strong> litmus paper, dilute hydrochloric acid, dilute sulphuric acid and sodium hydroxide solution.</p>
    </Card>
    <Card title="The pH Scale and Universal Indicator">
      <p><strong>Learning objective:</strong> identify acidic, neutral and alkaline regions using the pH scale and universal indicator solution.</p>
      <ChemistryTable headers={['Region', 'pH', 'Typical universal-indicator colour']} rows={[
        ['Acidic', 'Below 7', 'Red, orange or yellow, depending on pH.'],
        ['Neutral', '7', 'Green.'],
        ['Alkaline', 'Above 7', 'Blue to purple, depending on pH.'],
      ]} />
      <Figure compact src={f4Image('chem-acids-ph-scale.webp')} alt="Universal indicator colours on the pH scale from 0 to 14, with neutral pH 7 marked green." caption="Match the observed colour to the indicator’s own chart to estimate pH." />
      <p><strong>Activities:</strong> draw and label a pH scale. Add universal indicator to separate small samples of ammonia solution, sodium hydroxide solution, vinegar or lemon juice, hydrochloric acid and water. Compare each colour with the chart; record an estimated pH range and classify the sample.</p>
      <p><strong>Resources:</strong> pH scale chart, universal indicator solution and the listed substances. Acids are below pH 7; pure water is approximately pH 7; ammonia and sodium hydroxide solutions are alkaline. Actual values depend on concentration.</p>
    </Card>
    <Card title="Reactions of Dilute Acids with Metals, Bases and Carbonates">
      <p><strong>Learning objectives:</strong> describe acid reactions and write word equations and balanced chemical equations.</p>
      <Figure compact src={f4Image('chem-acids-reactions.webp')} alt="Dilute acid reactions with a metal, a base and a carbonate; gases form with the metal and carbonate." caption="Suitable metals produce hydrogen; carbonates produce carbon dioxide; acid–base neutralisation produces salt and water." />
      <ChemistryTable headers={['Reaction', 'Word equation', 'Balanced chemical equation']} rows={[
        ['Metal + acid', 'Magnesium + hydrochloric acid → magnesium chloride + hydrogen', 'Mg + 2HCl → MgCl₂ + H₂'],
        ['Metal + acid', 'Zinc + sulphuric acid → zinc sulphate + hydrogen', 'Zn + H₂SO₄ → ZnSO₄ + H₂'],
        ['Acid + base', 'Nitric acid + sodium hydroxide → sodium nitrate + water', 'HNO₃ + NaOH → NaNO₃ + H₂O'],
        ['Acid + carbonate', 'Calcium carbonate + hydrochloric acid → calcium chloride + water + carbon dioxide', 'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂'],
        ['Acid + carbonate', 'Magnesium carbonate + sulphuric acid → magnesium sulphate + water + carbon dioxide', 'MgCO₃ + H₂SO₄ → MgSO₄ + H₂O + CO₂'],
        ['Acid + carbonate', 'Calcium carbonate + nitric acid → calcium nitrate + water + carbon dioxide', 'CaCO₃ + 2HNO₃ → Ca(NO₃)₂ + H₂O + CO₂'],
      ]} />
      <p className="rounded-lg bg-slate-50 p-3">General patterns: <strong>metal + suitable dilute acid → salt + hydrogen</strong>; <strong>acid + base → salt + water</strong>; <strong>acid + carbonate → salt + water + carbon dioxide</strong>.</p>
      <p><strong>Activity:</strong> investigate teacher-selected combinations of dilute hydrochloric, nitric and sulphuric acids with magnesium, zinc, calcium carbonate, magnesium carbonate and sodium hydroxide. Record reactants, bubbling or other changes, products, word equations and balanced chemical equations.</p>
      <p>Hydrochloric acid forms chlorides, nitric acid forms nitrates and sulphuric acid forms sulphates. Nitric acid reactions with metals depend on concentration and metal: do not assume every nitric-acid/metal reaction releases hydrogen. Calcium carbonate with sulphuric acid can develop a calcium sulphate coating that slows the reaction.</p>
      <p><strong>Resources:</strong> dilute acids, hydroxides, metal granules or powder, the listed carbonates, and suitable small reaction vessels.</p>
    </Card>
    <Card title="Acid–Base Titration">
      <p><strong>Learning objectives:</strong> identify titration apparatus, describe the procedure and carry out an acid–base titration. The listed practical uses dilute sodium hydroxide and hydrochloric acid with phenolphthalein.</p>
      <Figure compact src={f4Image('chem-acids-titration-apparatus.webp')} alt="Titration setup with hydrochloric acid in a clamped burette above sodium hydroxide and phenolphthalein in a conical flask on a white tile." caption="Use a pipette and filler to measure the alkali; use the burette to add and measure the acid." />
      <ChemistryTable headers={['Apparatus', 'Purpose']} rows={[
        ['Burette, stand and clamp', 'Add acid in controlled amounts and measure the volume delivered.'],
        ['Volumetric pipette and pipette filler', 'Measure a fixed volume of sodium hydroxide; never pipette by mouth.'],
        ['Conical flask', 'Hold the alkali and indicator; allow swirling without spilling.'],
        ['White tile', 'Make the indicator colour change easier to see.'],
        ['Funnel', 'Fill the burette; remove it before taking readings.'],
      ]} />
      <ol className="list-decimal space-y-2 pl-6">
        <li>Rinse the burette with dilute HCl and the pipette with NaOH. Rinse the conical flask with distilled water.</li>
        <li>Fill the burette with HCl, fill the tip below the tap and remove the funnel. Record the initial reading at eye level at the bottom of the meniscus.</li>
        <li>Use a pipette filler to transfer a measured volume of NaOH into the conical flask. Add two or three drops of phenolphthalein; the alkaline solution is pink.</li>
        <li>Place the flask on a white tile. Add HCl while swirling, then add it drop by drop near the endpoint.</li>
        <li>Stop when the pink colour just disappears and remains colourless after swirling. Record the final burette reading.</li>
        <li>Volume of acid used (titre) = final reading − initial reading. Perform a rough run, then repeat carefully until closely agreeing titres are obtained.</li>
      </ol>
      <Figure compact src={f4Image('chem-acids-titration-endpoint.webp')} alt="Phenolphthalein changes from pink in sodium hydroxide to colourless when hydrochloric acid reaches the titration endpoint." caption="For acid added to alkali: pink → colourless. Colourless alone cannot distinguish neutral solution from excess acid." />
      <p><strong>Equation:</strong> HCl + NaOH → NaCl + H₂O.</p>
      <p><strong>Resources:</strong> dilute HCl, NaOH(aq), phenolphthalein and the listed apparatus. Wear eye protection and use teacher-approved dilute solutions throughout the practical work.</p>
    </Card>
    <Card title="Preparation of Salts">
      <p>The scope and sequence (page 9) lists <strong>preparation of salts</strong> and the reactions <strong>metal + acid, acid + base, acid + carbonate</strong>. No separate salt-preparation objective was identified in the supplied competency-matrix points.</p>
      <ChemistryTable headers={['Route', 'Example', 'Obtaining the salt']} rows={[
        ['Metal + acid', 'Zinc + dilute sulphuric acid → zinc sulphate + hydrogen', 'Add excess zinc so the acid is used up; filter off unused metal.'],
        ['Acid + insoluble base', 'Magnesium oxide + hydrochloric acid → magnesium chloride + water', 'Add excess base, then filter off the unused solid. MgO + 2HCl → MgCl₂ + H₂O.'],
        ['Acid + carbonate', 'Magnesium carbonate + dilute sulphuric acid → magnesium sulphate + water + carbon dioxide', 'Add carbonate in small portions until no more reacts; filter off unused solid.'],
        ['Acid + soluble base', 'Hydrochloric acid + sodium hydroxide → sodium chloride + water', 'Use titration to find the reacting volumes, then repeat those volumes without indicator.'],
      ]} />
      <Figure compact src={f4Image('chem-acids-salt-preparation.webp')} alt="Salt preparation steps: filter excess solid, gently concentrate the solution, then cool to form crystals." caption="For a suitable soluble salt: filter unused solid, concentrate gently, cool, collect crystals and dry." />
      <p>Gently evaporate some water from the salt solution, allow it to cool and crystallise, then collect and dry the crystals. Choose a suitable reactant and salt for this method; do not heat the solution completely dry.</p>
    </Card>
  </div>
);

const oxidationReductionFoundation = (
  <div className="space-y-6">
    <p className="text-base text-slate-700">The headings below group the document’s points on rusting, chemical reactions, extraction of iron and iron alloys.</p>
    <Card title="Rusting: Conditions and Prevention">
      <p><strong>Learning objectives:</strong> state the conditions necessary for rusting and explain how painting, galvanising and plating prevent it.</p>
      <p>Iron rusts when <strong>both oxygen and moisture</strong> are present. Removing either condition prevents rusting.</p>
      <Figure compact src={f4Image('chem-redox-rusting.webp')} alt="Three tubes compare iron nails in air and water, boiled water covered by oil, and dry air with calcium chloride." caption="Only the nail exposed to both oxygen and water should rust in this comparison." />
      <p><strong>Activity:</strong> set up equal clean iron nails in three labelled tubes and leave them for several days. Keep nail size, observation time and temperature the same. Record the appearance before and after.</p>
      <ChemistryTable headers={['Tube', 'Conditions', 'Expected result and explanation']} rows={[
        ['A: air and water', 'Oxygen and moisture are present.', 'Rust forms.'],
        ['B: freshly boiled water, covered with oil', 'Boiling removes dissolved air; oil prevents air re-entering. The nail is completely covered by water.', 'Little or no rust if oxygen is effectively excluded.'],
        ['C: dry air with fused (anhydrous) calcium chloride; stoppered', 'Calcium chloride absorbs moisture; oxygen remains present.', 'No rust because moisture is removed.'],
      ]} />
      <ChemistryTable headers={['Method', 'How it prevents rusting']} rows={[
        ['Painting', 'An intact paint layer prevents oxygen and water reaching the iron. Scratches expose the metal.'],
        ['Galvanising', 'A zinc coating provides a barrier; zinc also corrodes preferentially and can protect exposed iron at small scratches.'],
        ['Plating', 'A coating of another metal blocks oxygen and moisture while intact; protection depends on the metal used and the condition of the coating.'],
      ]} />
      <p><strong>Resources:</strong> iron nails, oil, fused calcium chloride, water, test tubes and multimedia showing the prevention methods.</p>
    </Card>
    <Card title="Chemical Reactions, Oxidation and Reduction: Basic Ideas">
      <p><strong>Learning objectives:</strong> write simple word equations, define oxidation and reduction in terms of oxygen, and distinguish physical from chemical changes.</p>
      <Definition term="Oxidation (oxygen definition)">gain of oxygen by a substance.</Definition>
      <Definition term="Reduction (oxygen definition)">loss of oxygen by a substance.</Definition>
      <ChemistryTable headers={['Change', 'What happens', 'Example']} rows={[
        ['Physical change', 'No new substance forms; the state or form changes.', 'Ice melts to liquid water: both are H₂O.'],
        ['Chemical change', 'New substances form with different properties.', 'Magnesium burns to magnesium oxide; burning sugar or mealie-meal forms new substances.'],
      ]} />
      <p><strong>Activity:</strong> melt ice and compare this with teacher-supervised burning of magnesium ribbon and a small sample of sugar or mealie-meal. Record observations and decide whether a new substance has formed. Magnesium gives a bright white light and a white magnesium oxide solid; avoid looking directly at the flame.</p>
      <p className="rounded-lg bg-slate-50 p-3 font-semibold">Magnesium + oxygen → magnesium oxide<br />2Mg + O₂ → 2MgO</p>
      <p>For complete combustion of sugar: <strong>sugar + oxygen → carbon dioxide + water</strong>. Actual classroom burning can also cause charring or incomplete combustion, so describe the observations rather than assuming only these products form.</p>
      <p><strong>Resources:</strong> burner, magnesium ribbon, mealie-meal or sugar; ice and a suitable container for the melting comparison.</p>
    </Card>
    <Card title="Oxidation, Reduction and Extraction of Iron">
      <p><strong>Learning objectives:</strong> define oxidation and reduction; list the raw materials for iron extraction and their sources.</p>
      <ChemistryTable headers={['Definition in terms of', 'Oxidation', 'Reduction']} rows={[
        ['Electrons', 'Loss of electrons', 'Gain of electrons'],
        ['Oxygen', 'Gain of oxygen', 'Loss of oxygen'],
        ['Hydrogen', 'Loss of hydrogen', 'Gain of hydrogen'],
      ]} />
      <p><strong>Redox reactions</strong> involve oxidation and reduction occurring together. Remember <strong>OIL RIG</strong>: oxidation is loss, reduction is gain of electrons.</p>
      <p><strong>Demonstration:</strong> the teacher demonstrates copper(II) oxide reacting with hydrogen using an approved apparatus and procedure, or shows a recording of the demonstration.</p>
      <p className="rounded-lg bg-slate-50 p-3 font-semibold">Copper(II) oxide + hydrogen → copper + water<br />CuO + H₂ → Cu + H₂O</p>
      <p>Black copper(II) oxide loses oxygen and is <strong>reduced</strong> to reddish-brown copper. Hydrogen gains oxygen and is <strong>oxidised</strong> to water.</p>
      <p>The document uses <strong>extraction of iron at ZISCO Steel in the blast furnace</strong> as its industrial context. Iron is extracted by reducing the iron oxide in its ore.</p>
      <ChemistryTable headers={['Raw material', 'Formula', 'Source', 'Function']} rows={[
        ['Iron ore / haematite', 'Fe₂O₃', 'Mined from iron-ore deposits.', 'Provides the iron(III) oxide that is reduced to iron.'],
        ['Coke / carbon', 'C', 'Made by heating coal in the absence of air.', 'Fuel and source of carbon monoxide, which reduces the ore.'],
        ['Limestone / calcium carbonate', 'CaCO₃', 'Quarried from limestone deposits.', 'Forms calcium oxide, which removes silica impurities as slag.'],
      ]} />
      <p><strong>Activities:</strong> discuss the extraction process and its raw-material sources; organise a visit to ZISCO Steel where arrangements permit.</p>
      <p><strong>Resources:</strong> copper oxide, hydrogen gas for the teacher demonstration, and ZISCO Steel as the named industrial resource.</p>
    </Card>
    <Card title="Reactions in the Blast Furnace">
      <p><strong>Learning objectives:</strong> describe the furnace reactions, state the functions of the raw materials, and explain how iron and slag separate.</p>
      <Figure compact src={f4Image('chem-redox-blast-furnace.webp')} alt="Blast furnace with raw materials charged at the top, hot air entering near the base, and slag floating above molten iron at separate outlets." caption="The charge enters at the top; hot air enters near the base. Slag floats above molten iron and is tapped separately." />
      <ChemistryTable headers={['Stage', 'Word equation', 'Chemical equation and function']} rows={[
        ['Formation of carbon dioxide', 'Carbon + oxygen → carbon dioxide', 'C + O₂ → CO₂. Burning coke releases heat.'],
        ['Formation of carbon monoxide', 'Carbon dioxide + carbon → carbon monoxide', 'CO₂ + C → 2CO. Produces the reducing gas.'],
        ['Reduction of iron(III) oxide', 'Iron(III) oxide + carbon monoxide → iron + carbon dioxide', 'Fe₂O₃ + 3CO → 2Fe + 3CO₂. Iron oxide loses oxygen; CO gains oxygen.'],
        ['Decomposition of limestone', 'Calcium carbonate → calcium oxide + carbon dioxide', 'CaCO₃ → CaO + CO₂. Heat breaks down limestone.'],
        ['Formation of slag', 'Calcium oxide + silicon dioxide → calcium silicate', 'CaO + SiO₂ → CaSiO₃. Removes silica impurities as slag.'],
      ]} />
      <p><strong>Separation:</strong> molten iron is denser and collects at the bottom of the furnace. Less-dense molten slag floats above it. The two liquids are removed through outlets at different heights.</p>
      <p><strong>Activity:</strong> under teacher supervision, heat a small sample of iron(III) oxide on a charcoal block and discuss how carbon can remove oxygen from an oxide. Treat this as a model of reduction; the industrial furnace mainly uses carbon monoxide to reduce the ore.</p>
      <p><strong>Resources:</strong> iron(III) oxide, charcoal and teacher-approved heating apparatus.</p>
    </Card>
    <Card title="Alloys of Iron">
      <p><strong>Learning objectives:</strong> list alloys of iron, state their percentage compositions, and explain their properties and uses.</p>
      <Definition term="Alloy">a mixture of a metal with one or more other elements. Adding carbon and other elements to iron changes its properties.</Definition>
      <Figure compact src={f4Image('chem-redox-iron-alloys.webp')} alt="Examples of mild steel structural beams, stainless steel utensils, and cast iron cookware and pipes." caption="Match each alloy’s composition and properties to the objects made from it." />
      <ChemistryTable headers={['Alloy', 'Typical composition by mass', 'Properties', 'Uses']} rows={[
        ['Mild steel', 'About 0.05–0.25% carbon; mostly iron, with small amounts of other elements.', 'Tough, ductile and readily shaped or welded; rusts unless protected.', 'Building structures, car bodies and nails.'],
        ['Stainless steel (18/8 example)', 'About 18% chromium and 8% nickel; mostly iron, with a small carbon content (usually below 0.1%).', 'Corrosion-resistant and tough; chromium forms a protective surface film.', 'Utensils, sinks and food-processing equipment.'],
        ['Cast iron (common grey grades)', 'About 2–4.5% carbon and 1–3% silicon; mostly iron.', 'Hard, brittle and readily cast into shapes.', 'Cookware, pipes and machine bases.'],
      ]} />
      <p>These are <strong>typical ranges or an example grade</strong>, not fixed recipes for every alloy sold under these names. The document lists the composition objective but the supplied extract gives no numerical percentages.</p>
      <p><strong>Activity:</strong> examine mild steel samples, stainless steel utensils and cast iron objects. Discuss why each alloy is suitable for its use and compare resistance to corrosion, strength, brittleness and ease of shaping.</p>
      <p><strong>Resources:</strong> mild steel, stainless steel utensils and cast iron objects.</p>
    </Card>
  </div>
);

/* Syllabus topic groups; preserve the detailed lessons within each group. */
const chemistryContent = (id: string) => chemistryTopics.find(topic => topic.id === id)!.content;
const sections: TopicSection[] = [
  { id: 'separation', title: 'Separation', content: (
    <div className="space-y-8">
      {separationFoundation}
      <div><h3 className="mb-4 text-3xl font-bold text-slate-900">Paper Chromatography</h3>{chemistryContent('chromatography')}</div>
    </div>
  ) },
  { id: 'matter', title: 'Matter', content: matterFoundation },
  { id: 'acids-bases-salts', title: 'Acids, Bases and Salts', content: acidsBasesSaltsFoundation },
  { id: 'oxidation-reduction', title: 'Oxidation and Reduction', content: oxidationReductionFoundation },
  { id: 'industrial-processes', title: 'Industrial Processes', content: <IndustrialProcesses /> },
  { id: 'organic-chemistry', title: 'Organic Chemistry', content: <OrganicChemistry /> },
];

const legacyChemistryTopics: Record<string, string> = {
  chromatography: 'separation',
  'periodic-trends': 'matter',
  'metals-nonmetals': 'matter',
  titration: 'acids-bases-salts',
  'revision-summary': 'organic-chemistry',
};

/* ---------- Components ---------- */
const TopicNav: React.FC<{ activeId: string; onNavigate: (id: string) => void }> = ({ activeId, onNavigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm">
      <div className="w-full px-4 sm:px-6 md:px-8 relative flex items-center">
        <button
          onClick={() => scroll('left')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 mr-2 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors whitespace-nowrap ${
                activeId === s.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="p-1 bg-white rounded-full shadow border text-slate-600 ml-2 hover:bg-slate-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{ section: TopicSection }> = ({ section }) => (
  <section id={section.id} className="mb-16 scroll-mt-24">
    <div className="mb-6">
      <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">{section.title}</h2>
    </div>
    <div className="prose prose-slate max-w-none">{section.content}</div>
  </section>
);

interface CombinedScienceChemistry2Props {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const CombinedScienceChemistry2: React.FC<CombinedScienceChemistry2Props> = ({
  onNextTopic,
  nextTopicTitle = 'Next Topic',
}) => {
  const [active, setActive] = useLessonState('chapter', sections[0].id);
  const activeTopic = legacyChemistryTopics[active] ?? active;
  const activeIndex = Math.max(sections.findIndex((section) => section.id === activeTopic), 0);
  const activeSection = sections[activeIndex];
  const isLastChapter = activeIndex >= sections.length - 1;

  const handleNavigate = (id: string) => {
    setActive(id);
    document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!isLastChapter) {
      setActive(sections[activeIndex + 1].id);
      document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onNextTopic?.();
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header */}
      <div className="bg-[#1e3a8a] dark:bg-[#172554] border-b border-blue-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-4 sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-sm font-bold mb-4 backdrop-blur-sm">
            CHEMISTRY – PART 2
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Separation, Matter, Acids, Bases and Salts, Redox, Industry &amp; Organic Chemistry
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Full Form 4 notes in plain English — every term defined, every trend explained, with worked
            calculations, complete practical write-ups and labelled apparatus diagrams.
          </p>
        </div>
      </div>

      <TopicNav activeId={activeSection.id} onNavigate={handleNavigate} />

      <div className="w-full px-4 sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-base">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Paper chromatography:</strong> separates a mixture because
                  each substance has its own balance of solubility in the solvent and attraction to the
                  paper; Rf values identify them.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Periodic trends:</strong> atoms get bigger down a group, so
                  Group 1 metals lose their outer electron more easily (more reactive) and Group 7 non-metals
                  attract an electron less easily (less reactive).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Metals:</strong> the reactivity series predicts reactions
                  with oxygen, water and acids, which metal displaces which, and how each metal is extracted;
                  rusting needs both air and water.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Acids, bases and salts:</strong> use litmus and universal indicator,
                  explain acid reactions, and titrate sodium hydroxide with hydrochloric acid.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Industrial processes:</strong> Haber and Contact all
                  use a catalyst and a compromise temperature to balance rate, yield and cost.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Organic chemistry:</strong> alcohols contain the –OH group;
                  ethanol is made by fermentation of sugar or by hydration of ethene.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Global warming:</strong> greenhouse gases trap infrared
                  radiation; the answer lies in renewable energy, afforestation and using less energy.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'Ready for the next section?' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>
                In the next section, we will learn about <span className="text-slate-700">{nextTopicTitle}</span>.
              </>
            ) : (
              <>
                Next: <span className="text-slate-700">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <button
            type="button"
            onClick={handleNext}
            disabled={isLastChapter && !onNextTopic}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            {isLastChapter ? `Begin ${nextTopicTitle}` : 'Next Section'} →
          </button>
        </div>
      </div>
    </div>
  );
};

export const LearningOutcome2 = CombinedScienceChemistry2;

export default LearningOutcome2;
