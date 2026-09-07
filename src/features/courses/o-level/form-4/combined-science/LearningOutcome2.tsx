import React, { useState, useRef } from 'react';
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

// Alcohols (methanol, ethanol, propanol) structures
const alcoholsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 180" width="100%" height="100%">
  <rect width="700" height="180" fill="white" />
  <text x="350" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Alcohols &#8211; First Three Members</text>
  <rect x="30" y="50" width="180" height="100" rx="8" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" />
  <text x="120" y="75" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">Methanol</text>
  <text x="120" y="95" text-anchor="middle" font-size="11" fill="#475569">CH&#8323;OH</text>
  <text x="120" y="115" text-anchor="middle" font-size="10" fill="#475569">1 carbon atom</text>
  <text x="120" y="135" text-anchor="middle" font-size="10" fill="#475569">bp 65&#176;C</text>
  <rect x="260" y="50" width="180" height="100" rx="8" fill="#fef9c3" stroke="#eab308" stroke-width="2" />
  <text x="350" y="75" text-anchor="middle" font-size="12" font-weight="bold" fill="#ca8a04">Ethanol</text>
  <text x="350" y="95" text-anchor="middle" font-size="11" fill="#854d0e">C&#8322;H&#8325;OH</text>
  <text x="350" y="115" text-anchor="middle" font-size="10" fill="#854d0e">2 carbon atoms</text>
  <text x="350" y="135" text-anchor="middle" font-size="10" fill="#854d0e">bp 78&#176;C</text>
  <rect x="490" y="50" width="180" height="100" rx="8" fill="#e0f2fe" stroke="#3b82f6" stroke-width="2" />
  <text x="580" y="75" text-anchor="middle" font-size="12" font-weight="bold" fill="#1e293b">Propanol</text>
  <text x="580" y="95" text-anchor="middle" font-size="11" fill="#475569">C&#8323;H&#8327;OH</text>
  <text x="580" y="115" text-anchor="middle" font-size="10" fill="#475569">3 carbon atoms</text>
  <text x="580" y="135" text-anchor="middle" font-size="10" fill="#475569">bp 97&#176;C</text>
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
  alcohols: svgToDataUri(alcoholsSvg),

  /* ----- New Form 4 artwork (save with these exact names) ----- */
  chromatographyApparatus: f4Image('chem-chromatography-apparatus.png'),
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

  titrationApparatus: f4Image('chem-titration-apparatus.png'),
  titrationStep1: f4Image('chem-titration-step1.png'),
  titrationStep2: f4Image('chem-titration-step2.png'),
  titrationStep3: f4Image('chem-titration-step3.png'),
  titrationStep4: f4Image('chem-titration-step4.png'),
  titrationStep5: f4Image('chem-titration-step5.png'),
  titrationStep6: f4Image('chem-titration-step6.png'),
  buretteReading: f4Image('chem-burette-reading.png'),
  indicatorColours: f4Image('chem-indicator-colours.png'),
  saltCrystallisation: f4Image('chem-salt-crystallisation.png'),

  haberProcess: f4Image('chem-haber-process.png'),
  contactProcess: f4Image('chem-contact-process.png'),
  ostwaldProcess: f4Image('chem-ostwald-process.png'),
  ammoniaUses: f4Image('chem-ammonia-uses.png'),
  sulphuricAcidUses: f4Image('chem-sulphuric-acid-uses.png'),
  npkFertiliser: f4Image('chem-npk-fertiliser.png'),
  gasTests: f4Image('chem-gas-tests.png'),
  gasCollectionMethods: f4Image('chem-gas-collection-methods.png'),

  alcoholDisplayedFormulae: f4Image('chem-alcohol-displayed-formulae.png'),
  fermentationStep1: f4Image('chem-fermentation-step1.png'),
  fermentationStep2: f4Image('chem-fermentation-step2.png'),
  fermentationStep3: f4Image('chem-fermentation-step3.png'),
  fermentationStep4: f4Image('chem-fermentation-step4.png'),
  ethanolDistillation: f4Image('chem-ethanol-distillation.png'),
  etheneHydration: f4Image('chem-ethene-hydration.png'),
  ethanolUses: f4Image('chem-ethanol-uses.png'),
  greenhouseEffect: f4Image('chem-greenhouse-effect.png'),
  globalWarmingEffects: f4Image('chem-global-warming-effects.png'),
};

/* ---------- Small presentation helpers ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

/** Image that quietly removes itself if the artwork has not been added yet. */
const Figure: React.FC<{ src: string; alt: string; caption?: string; className?: string }> = ({
  src,
  alt,
  caption,
  className = '',
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className={`mt-3 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
      />
      {caption && (
        <figcaption className="mt-2 text-xs font-semibold text-slate-600">{caption}</figcaption>
      )}
    </figure>
  );
};

const Definition: React.FC<{ term: string; children: React.ReactNode }> = ({ term, children }) => (
  <div className="rounded-xl bg-blue-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700">Definition</p>
    <p className="mt-1 text-sm leading-relaxed text-slate-800">
      <strong>{term}</strong> — {children}
    </p>
  </div>
);

const Example: React.FC<{ title?: string; children: React.ReactNode }> = ({
  title = 'Worked example',
  children,
}) => (
  <div className="rounded-xl bg-amber-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">{title}</p>
    <div className="mt-1 space-y-1 text-sm leading-relaxed text-slate-800">{children}</div>
  </div>
);

const ExamTip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-emerald-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">Exam tip</p>
    <div className="mt-1 space-y-1 text-sm leading-relaxed text-slate-800">{children}</div>
  </div>
);

const WatchOut: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-rose-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-rose-700">Watch out</p>
    <div className="mt-1 space-y-1 text-sm leading-relaxed text-slate-800">{children}</div>
  </div>
);

const Safety: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-xl bg-orange-50/70 p-4">
    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-orange-700">Safety</p>
    <div className="mt-1 space-y-1 text-sm leading-relaxed text-slate-800">{children}</div>
  </div>
);

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <h4 className="font-bold text-blue-700">{title}</h4>
    <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-700">{children}</div>
  </div>
);

const Step: React.FC<{ n: number; src?: string; alt?: string; children: React.ReactNode }> = ({
  n,
  src,
  alt,
  children,
}) => (
  <div className="rounded-lg border border-slate-200 bg-white p-3">
    <p className="mb-1 text-xs font-bold text-blue-600">Step {n}</p>
    <p className="text-sm leading-relaxed text-slate-700">{children}</p>
    {src && <Figure src={src} alt={alt ?? `Step ${n}`} className="mt-2" />}
  </div>
);

const Equation: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg bg-slate-900 px-4 py-3 text-center font-mono text-sm text-white shadow-sm">
    {children}
  </div>
);

const KeyList: React.FC<{ title: string; items: string[] }> = ({ title, items }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="mb-3 text-lg font-bold text-blue-700">{title}</h3>
    <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const sections: TopicSection[] = [
  /* =======================================================================
     1. PAPER CHROMATOGRAPHY
  ======================================================================= */
  {
    id: 'chromatography',
    title: 'Paper Chromatography',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
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
              src={chemImages.chromatographyApparatus}
              alt="Labelled paper chromatography apparatus in a covered beaker"
              caption="Fig 1.1 — Chromatography apparatus. Every label here can be asked for in an exam: beaker, lid, chromatography paper, pencil baseline, sample spot, solvent and solvent front."
            />
          </Card>

          <div className="rounded-xl border-2 border-sky-200 bg-sky-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-sky-700">
              Experiment 1: Separating the Dyes in Black Ink
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To find out how many different coloured dyes are present in a sample of
              black ink.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> Chromatography (or filter) paper, a beaker, a watch glass or lid,
              a pencil, a ruler, a capillary tube or fine dropper, the ink sample, a suitable solvent
              (water for water-soluble inks, ethanol for permanent inks), a glass rod or paper clip to
              suspend the paper.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={chemImages.chromatographyStep1} alt="Drawing a pencil baseline on chromatography paper">
                Cut a strip of chromatography paper and use a <strong>pencil</strong> and ruler to draw a
                straight line about 2 cm from the bottom. This is the <strong>baseline</strong>. Pencil is
                used because pencil lead is insoluble, so it will not run and confuse the results — pen ink
                would separate too and ruin the experiment.
              </Step>
              <Step n={2} src={chemImages.chromatographyStep2} alt="Placing a small concentrated spot of ink on the baseline">
                Using a capillary tube, place a single small spot of the ink on the baseline. Let it dry,
                then add another drop on top of the same spot. A small, concentrated spot gives sharp,
                well-separated bands; a big spot gives a smeared, useless chromatogram.
              </Step>
              <Step n={3} src={chemImages.chromatographyStep3} alt="Solvent poured into the beaker below the baseline level">
                Pour solvent into the beaker to a depth of about 1 cm — the level must be{' '}
                <strong>below the baseline</strong>. If the solvent covered the spot the dyes would simply
                dissolve away into the beaker instead of travelling up the paper.
              </Step>
              <Step n={4} src={chemImages.chromatographyStep4} alt="Suspending the paper in the beaker and covering with a lid">
                Hang the paper so its bottom edge just dips into the solvent and it does not touch the
                sides of the beaker. Cover the beaker with a lid or watch glass. The lid keeps the air
                inside saturated with solvent vapour so the solvent does not evaporate off the paper.
              </Step>
              <Step n={5} src={chemImages.chromatographyStep5} alt="Removing the paper and marking the solvent front">
                Leave it until the solvent has risen nearly to the top, then remove the paper immediately
                and mark the <strong>solvent front</strong> with a pencil before it dries and disappears.
                Hang the paper up to dry.
              </Step>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Results:</strong> The single black spot separates into several coloured spots at
              different heights. Each spot is one dye.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> Black ink is a mixture of several coloured dyes. The number of
              spots tells you the minimum number of substances in the mixture.
            </p>
            <Safety>
              <p>
                Ethanol and propanone are flammable — keep them well away from naked flames and use them
                in a well-ventilated room.
              </p>
            </Safety>
          </div>

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

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Chromatography Key Points"
            items={[
              'Separates dissolved solids in a mixture',
              'Mobile phase = solvent; stationary phase = paper',
              'More soluble substance travels further',
              'Baseline in pencil, above the solvent level',
              'Rf = spot distance ÷ solvent front distance',
              'Rf has no units and is always less than 1',
              'One spot = pure; several spots = mixture',
              'Used in food testing, forensics and drug testing',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Quick self-test</h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700">
              <li>Why must the baseline be drawn in pencil?</li>
              <li>A spot travels 2.4 cm; the solvent front travels 6.0 cm. Find the Rf value.</li>
              <li>What does a single spot tell you about a sample?</li>
              <li>Give two everyday uses of chromatography.</li>
            </ol>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     2. PERIODIC TABLE TRENDS
  ======================================================================= */
  {
    id: 'periodic-trends',
    title: 'Periodic Table Trends',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              The periodic table is not a random list. Elements are arranged in order of increasing{' '}
              <strong>proton number</strong>, and this arrangement puts elements with similar properties
              directly underneath one another. Once you understand <em>why</em> that happens, you can
              predict the properties of an element you have never met before — which is exactly what
              examiners like to test.
            </p>
          </div>

          <Card title="Groups and Periods">
            <ul className="list-inside list-disc space-y-1">
              <li>
                A <strong>group</strong> is a vertical column. All the elements in a group have the{' '}
                <strong>same number of electrons in their outer shell</strong>, and since it is the outer
                electrons that take part in reactions, they behave in similar ways. The group number tells
                you the number of outer electrons (Group 1 has 1, Group 7 has 7, and Group 0 has a full
                shell).
              </li>
              <li>
                A <strong>period</strong> is a horizontal row. All the elements in a period have the{' '}
                <strong>same number of electron shells</strong>. Going across a period, elements change
                gradually from metals on the left to non-metals on the right.
              </li>
            </ul>
            <Figure
              src={chemImages.periodicTableGroups}
              alt="Periodic table with Group 1, Group 2, Group 7, Group 0 and the transition block highlighted"
              caption="Fig 2.1 — The periodic table with the groups you must know highlighted, and the metal / non-metal dividing line marked."
            />
          </Card>

          <Card title="The One Idea Behind Every Group Trend">
            <p>
              Almost every trend question can be answered with the same piece of reasoning. As you go{' '}
              <strong>down</strong> a group:
            </p>
            <ol className="list-inside list-decimal space-y-1">
              <li>Each element has one more electron shell than the one above it.</li>
              <li>So the atoms get <strong>bigger</strong>.</li>
              <li>
                So the outer electrons are <strong>further from the positive nucleus</strong>, and they are{' '}
                <strong>shielded</strong> from it by all the inner shells.
              </li>
              <li>So the pull of the nucleus on the outer electrons gets <strong>weaker</strong>.</li>
            </ol>
            <Figure
              src={chemImages.atomicSizeDownGroup}
              alt="Three atoms of increasing size down a group with outer electron further from the nucleus"
              caption="Fig 2.2 — Going down a group the atoms get larger, so the outer electron is held less tightly."
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-bold text-blue-700">Group 1 — metals that LOSE an electron</p>
                <p className="mt-1 text-sm text-slate-700">
                  Weaker pull means the outer electron is <strong>easier to lose</strong>, so reactivity{' '}
                  <strong>increases down the group</strong>.
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-sm font-bold text-blue-700">Group 7 — non-metals that GAIN an electron</p>
                <p className="mt-1 text-sm text-slate-700">
                  Weaker pull means an incoming electron is <strong>harder to attract</strong>, so
                  reactivity <strong>decreases down the group</strong>.
                </p>
              </div>
            </div>
          </Card>

          <Card title="Group 1 — The Alkali Metals">
            <p>
              Lithium, sodium, potassium, rubidium, caesium and francium. They are called alkali metals
              because they react with water to form <strong>alkaline</strong> solutions.
            </p>
            <p className="font-semibold text-slate-800">Physical properties</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Soft enough to be cut with a knife, showing a shiny silvery surface that quickly tarnishes.</li>
              <li>Low density — lithium, sodium and potassium all float on water.</li>
              <li>Low melting and boiling points for metals.</li>
              <li>Good conductors of heat and electricity.</li>
              <li>
                Stored under oil, because they react rapidly with the oxygen and water vapour in the air.
              </li>
            </ul>
            <p className="mt-2 font-semibold text-slate-800">Reaction with water</p>
            <Equation>Metal + Water &rarr; Metal hydroxide + Hydrogen</Equation>
            <Figure
              src={chemImages.group1WaterReaction}
              alt="Lithium, sodium and potassium reacting with water in a trough with universal indicator"
              caption="Fig 2.3 — Lithium fizzes gently, sodium melts into a ball and darts about, and potassium bursts into a lilac flame. The universal indicator turns purple, showing an alkali has formed."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Metal</th>
                  <th className="border p-2 text-left">What you observe</th>
                  <th className="border p-2 text-left">Equation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Lithium</td>
                  <td className="border p-2">Floats and fizzes steadily; slowly disappears</td>
                  <td className="border p-2">2Li + 2H₂O &rarr; 2LiOH + H₂</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Sodium</td>
                  <td className="border p-2">
                    Fizzes vigorously, melts into a silvery ball and darts across the surface
                  </td>
                  <td className="border p-2">2Na + 2H₂O &rarr; 2NaOH + H₂</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Potassium</td>
                  <td className="border p-2">
                    Reacts violently; the hydrogen catches fire with a <strong>lilac</strong> flame
                  </td>
                  <td className="border p-2">2K + 2H₂O &rarr; 2KOH + H₂</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2">
              They also react with non-metals to form white <strong>ionic</strong> compounds, because each
              atom loses its single outer electron to become a 1+ ion. For example 2Na + Cl₂ &rarr; 2NaCl.
            </p>
          </Card>

          <Card title="Group 2 — The Alkaline Earth Metals">
            <p>Beryllium, magnesium, calcium, strontium and barium.</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                Harder, denser and with higher melting points than Group 1, because each atom loses{' '}
                <strong>two</strong> electrons, giving stronger metallic bonding.
              </li>
              <li>Silvery-grey when freshly cut, but tarnish in air.</li>
              <li>
                <strong>Less reactive</strong> than the Group 1 metal in the same period — calcium reacts
                far more gently with water than potassium does.
              </li>
              <li>
                Magnesium reacts only very slowly with cold water, but vigorously with <strong>steam</strong>:
                Mg + H₂O &rarr; MgO + H₂.
              </li>
              <li>Calcium fizzes steadily in cold water: Ca + 2H₂O &rarr; Ca(OH)₂ + H₂.</li>
              <li>They form 2+ ions and therefore compounds such as MgO, CaCl₂ and CaCO₃.</li>
            </ul>
          </Card>

          <Card title="Group 7 — The Halogens">
            <p>
              Fluorine, chlorine, bromine, iodine and astatine. Every halogen molecule contains two atoms
              joined by a covalent bond — they are <strong>diatomic</strong>: F₂, Cl₂, Br₂, I₂.
            </p>
            <Figure
              src={chemImages.halogensAppearance}
              alt="Gas jars of chlorine, bromine and iodine showing their colours and states"
              caption="Fig 2.4 — Chlorine is a pale yellow-green gas, bromine a red-brown liquid that gives off orange vapour, and iodine a grey-black solid that sublimes to purple vapour."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Halogen</th>
                  <th className="border p-2 text-left">State at room temperature</th>
                  <th className="border p-2 text-left">Colour</th>
                  <th className="border p-2 text-left">Reactivity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Fluorine</td>
                  <td className="border p-2">Gas</td>
                  <td className="border p-2">Pale yellow</td>
                  <td className="border p-2">Most reactive</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Chlorine</td>
                  <td className="border p-2">Gas</td>
                  <td className="border p-2">Yellow-green</td>
                  <td className="border p-2">Very reactive</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Bromine</td>
                  <td className="border p-2">Liquid</td>
                  <td className="border p-2">Red-brown</td>
                  <td className="border p-2">Less reactive</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Iodine</td>
                  <td className="border p-2">Solid</td>
                  <td className="border p-2">Grey-black (purple vapour)</td>
                  <td className="border p-2">Least reactive of the four</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2">
              Notice the second trend: going down the group the <strong>melting and boiling points rise</strong>,
              so the state changes gas &rarr; liquid &rarr; solid. This is because the molecules get bigger
              and the forces between them get stronger.
            </p>
            <p className="mt-2 font-semibold text-slate-800">Displacement reactions</p>
            <p>
              A <strong>more reactive halogen displaces a less reactive halogen</strong> from a solution of
              its salt. This is the standard way of putting the halogens in order of reactivity.
            </p>
            <Figure
              src={chemImages.halogenDisplacement}
              alt="Three test tubes showing halogen displacement reactions and colour changes"
              caption="Fig 2.5 — Chlorine displaces bromine (colourless turns orange) and iodine (colourless turns brown); iodine cannot displace either of the others."
            />
            <div className="space-y-1">
              <Equation>Cl₂ + 2KBr &rarr; 2KCl + Br₂ &nbsp;(solution turns orange)</Equation>
              <Equation>Cl₂ + 2KI &rarr; 2KCl + I₂ &nbsp;(solution turns brown)</Equation>
              <Equation>Br₂ + 2KI &rarr; 2KBr + I₂ &nbsp;(solution turns brown)</Equation>
            </div>
            <p className="mt-2 font-semibold text-slate-800">Uses of the halogens</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Chlorine:</strong> killing bacteria in drinking water and swimming pools, making
                bleach, PVC and disinfectants.
              </li>
              <li>
                <strong>Iodine:</strong> antiseptic for cuts, added to table salt to prevent goitre, and
                used to test for starch.
              </li>
              <li>
                <strong>Fluoride compounds:</strong> added to toothpaste to strengthen tooth enamel.
              </li>
            </ul>
            <Safety>
              <p>
                Chlorine and bromine vapours are poisonous and irritate the lungs and eyes. Any experiment
                with them must be done in a fume cupboard.
              </p>
            </Safety>
          </Card>

          <Card title="Group 0 — The Noble Gases">
            <p>Helium, neon, argon, krypton, xenon and radon.</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                All are colourless, odourless gases that exist as <strong>single atoms</strong>{' '}
                (monatomic), not as molecules.
              </li>
              <li>
                They are <strong>chemically unreactive (inert)</strong> because their outer electron shell
                is already full — they have no need to gain, lose or share electrons.
              </li>
              <li>Their densities and boiling points increase down the group.</li>
            </ul>
            <Figure
              src={chemImages.nobleGasUses}
              alt="Uses of noble gases: helium balloon, neon sign, argon filled bulb, xenon headlamp"
              caption="Fig 2.6 — The uses of the noble gases all depend on the fact that they do not react."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Gas</th>
                  <th className="border p-2 text-left">Use</th>
                  <th className="border p-2 text-left">Why that gas</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Helium</td>
                  <td className="border p-2">Filling balloons and airships; breathing mixtures for divers</td>
                  <td className="border p-2">
                    Very low density and, unlike hydrogen, will not burn or explode
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Neon</td>
                  <td className="border p-2">Advertising signs and indicator lamps</td>
                  <td className="border p-2">Glows bright red-orange when electricity passes through it</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Argon</td>
                  <td className="border p-2">Filling filament light bulbs; shielding gas in welding</td>
                  <td className="border p-2">
                    Stops the hot metal filament or weld from reacting with oxygen and burning away
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Krypton and xenon</td>
                  <td className="border p-2">Car headlamps, photographic flash units, lighthouse lamps</td>
                  <td className="border p-2">Give a very bright, intense light</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="The Transition Elements">
            <p>
              These are the block of metals in the middle of the table, between Group 2 and Group 3 — iron,
              copper, zinc, nickel, chromium, manganese, silver and gold among them.
            </p>
            <p className="font-semibold text-slate-800">Physical properties</p>
            <ul className="list-inside list-disc space-y-1">
              <li>Hard, strong and dense, with high melting and boiling points.</li>
              <li>Malleable (can be hammered into shape) and ductile (can be drawn into wire).</li>
              <li>Excellent conductors of heat and electricity.</li>
            </ul>
            <p className="mt-2 font-semibold text-slate-800">Chemical properties</p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                Much <strong>less reactive</strong> than Group 1 metals — they react only slowly with water
                and oxygen, which is why they are useful for building and for coins.
              </li>
              <li>
                They form <strong>coloured compounds</strong>: copper(II) compounds are blue or green,
                iron(II) is pale green, iron(III) is yellow-brown, and potassium manganate(VII) is purple.
              </li>
              <li>
                They show <strong>variable valency</strong> — the same metal can form more than one ion,
                such as Fe²⁺ and Fe³⁺ or Cu⁺ and Cu²⁺.
              </li>
              <li>
                They and their compounds are widely used as <strong>catalysts</strong>: iron in the Haber
                process, vanadium(V) oxide in the Contact process, nickel in hardening vegetable oils, and
                platinum in car catalytic converters.
              </li>
            </ul>
            <Figure
              src={chemImages.transitionMetalColours}
              alt="Test tubes of coloured transition metal solutions"
              caption="Fig 2.7 — Coloured solutions of transition metal compounds: Cu²⁺ blue, Fe²⁺ pale green, Fe³⁺ yellow-brown, Ni²⁺ green, MnO₄⁻ purple."
            />
          </Card>

          <ExamTip>
            <p>
              When a question says &ldquo;explain the trend&rdquo;, the word <em>explain</em> means give the
              reason in terms of <strong>atomic size, shielding and the pull of the nucleus on outer
              electrons</strong>. Simply writing &ldquo;reactivity increases down the group&rdquo; is
              describing, not explaining, and will only score one of the marks.
            </p>
          </ExamTip>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Periodic Trends Key Points"
            items={[
              'Group = column = same outer electrons',
              'Period = row = same number of shells',
              'Down a group: bigger atoms, weaker pull on outer electrons',
              'Group 1 reactivity increases down',
              'Group 7 reactivity decreases down',
              'Group 7: gas → liquid → solid down the group',
              'Group 0: full shell, unreactive, monatomic',
              'Transition metals: coloured, variable valency, catalysts',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Flame and colour clues</h3>
            <p className="text-sm text-slate-700">
              Potassium burns lilac · sodium burns yellow-orange · magnesium burns bright white · copper
              compounds are blue-green · iron(III) solutions are yellow-brown · iodine vapour is purple.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     3. METALS AND NON-METALS
  ======================================================================= */
  {
    id: 'metals-nonmetals',
    title: 'Metals and Non‑Metals',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              About three-quarters of the elements are metals. What makes a metal a metal is that its atoms
              hold their outer electrons loosely and readily <strong>lose</strong> them to form{' '}
              <strong>positive ions</strong>. Non-metals do the opposite — they <strong>gain</strong> or{' '}
              <strong>share</strong> electrons. Almost every difference between the two groups, physical and
              chemical, comes back to that one fact.
            </p>
          </div>

          <Card title="Comparing Metals and Non-Metals">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Property</th>
                  <th className="border p-2 text-left">Metals</th>
                  <th className="border p-2 text-left">Non-metals</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Appearance</td>
                  <td className="border p-2">Shiny (lustrous) when freshly cut</td>
                  <td className="border p-2">Dull</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">State at room temperature</td>
                  <td className="border p-2">Solid (except mercury, which is liquid)</td>
                  <td className="border p-2">Many are gases; bromine is liquid; the rest are solids</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Conduction of heat and electricity</td>
                  <td className="border p-2">Good conductors</td>
                  <td className="border p-2">Poor conductors (graphite is the exception)</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Malleability and ductility</td>
                  <td className="border p-2">Malleable and ductile</td>
                  <td className="border p-2">Brittle — solids shatter when hammered</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Melting and boiling points</td>
                  <td className="border p-2">Usually high</td>
                  <td className="border p-2">Usually low</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Density</td>
                  <td className="border p-2">Usually high</td>
                  <td className="border p-2">Usually low</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Electrons in reactions</td>
                  <td className="border p-2">Lose electrons, forming positive ions</td>
                  <td className="border p-2">Gain or share electrons, forming negative ions</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Their oxides</td>
                  <td className="border p-2">Basic — react with acids to form salts</td>
                  <td className="border p-2">Acidic — dissolve in water to give acids</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="The Reactivity Series">
            <Definition term="Reactivity series">
              a list of metals arranged in order of how vigorously they react, with the most reactive at
              the top and the least reactive at the bottom.
            </Definition>
            <Figure src={chemImages.reactivitySeries} alt="Reactivity series of metals" />
            <p>
              A useful mnemonic for the order <strong>K, Na, Ca, Mg, Al, Zn, Fe, Pb, Cu, Ag, Au</strong> is:{' '}
              <em>&ldquo;Kind Nurses Can Make A Zebra Feel Perfectly Cool And Great.&rdquo;</em> Hydrogen and
              carbon are sometimes included in the list even though they are not metals, because they act as
              useful comparison points.
            </p>
            <p>
              The series is worth learning because it lets you <strong>predict</strong> the result of a
              reaction you have never seen. If you know where two metals sit relative to each other, you know
              which one will win.
            </p>
          </Card>

          <Card title="Reaction of Metals with Oxygen">
            <Equation>Metal + Oxygen &rarr; Metal oxide</Equation>
            <Figure
              src={chemImages.metalsOxygenReactions}
              alt="Magnesium ribbon, iron wool and copper being heated in air"
              caption="Fig 3.1 — Magnesium burns with a blinding white flame, iron wool glows and sparkles, and copper only turns black on the surface."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Metal</th>
                  <th className="border p-2 text-left">Observation on heating in air</th>
                  <th className="border p-2 text-left">Equation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Potassium / Sodium</td>
                  <td className="border p-2">Tarnish within seconds even without heating</td>
                  <td className="border p-2">4Na + O₂ &rarr; 2Na₂O</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Magnesium</td>
                  <td className="border p-2">
                    Burns with a brilliant white flame, leaving a white ash
                  </td>
                  <td className="border p-2">2Mg + O₂ &rarr; 2MgO</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Iron</td>
                  <td className="border p-2">
                    Iron wool glows and gives off yellow sparks, leaving a black solid
                  </td>
                  <td className="border p-2">3Fe + 2O₂ &rarr; Fe₃O₄</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Copper</td>
                  <td className="border p-2">
                    Does not burn; simply turns from pink-brown to black on the surface
                  </td>
                  <td className="border p-2">2Cu + O₂ &rarr; 2CuO</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Gold / Silver</td>
                  <td className="border p-2">No reaction — this is why they stay shiny in jewellery</td>
                  <td className="border p-2">—</td>
                </tr>
              </tbody>
            </table>
            <Safety>
              <p>
                Never look directly at burning magnesium. The intense ultraviolet light can damage your eyes
                — look at it through darkened glass or from the side.
              </p>
            </Safety>
          </Card>

          <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-blue-700">
              Experiment 2: Reacting Magnesium with Steam
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To show that magnesium reacts with steam to produce hydrogen and
              magnesium oxide.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> Hard-glass combustion tube, magnesium ribbon, mineral wool, water,
              two Bunsen burners, delivery tube, trough, test tube for collecting gas, wooden splint.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={chemImages.metalSteamStep1} alt="Setting up combustion tube with wet mineral wool and magnesium ribbon">
                Soak a plug of mineral wool in water and push it into one end of the combustion tube. Coil
                magnesium ribbon and place it in the middle of the tube. Fit a bung and delivery tube at the
                other end, leading to a test tube inverted over water.
              </Step>
              <Step n={2} src={chemImages.metalSteamStep2} alt="Heating the magnesium strongly and the wet wool gently">
                Heat the magnesium strongly first, then heat the wet mineral wool gently so that steam passes
                over the hot metal.
              </Step>
              <Step n={3} src={chemImages.metalSteamStep3} alt="Testing collected gas with a lighted splint">
                Collect the gas that comes off in the inverted test tube, then test it with a lighted splint.
              </Step>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Observations:</strong> The magnesium glows brightly as the steam reaches it, and a
              white solid is left in the tube. A gas is collected which burns with a{' '}
              <strong>squeaky pop</strong>.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Equation:</strong> Mg + H₂O &rarr; MgO + H₂
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> Magnesium reacts with steam to give magnesium oxide and hydrogen.
              The magnesium has <strong>gained oxygen</strong>, so it has been <strong>oxidised</strong>;
              the water has <strong>lost oxygen</strong>, so it has been <strong>reduced</strong>. Because
              both happen together this is a <strong>redox</strong> reaction.
            </p>
            <Safety>
              <p>
                Remove the delivery tube from the water <em>before</em> you stop heating, otherwise cold
                water will be sucked back into the hot tube and crack it.
              </p>
            </Safety>
          </div>

          <Card title="Reaction of Metals with Water and Steam">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Metal</th>
                  <th className="border p-2 text-left">With cold water</th>
                  <th className="border p-2 text-left">With steam</th>
                  <th className="border p-2 text-left">Products</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Potassium, sodium</td>
                  <td className="border p-2">Very violent</td>
                  <td className="border p-2">Dangerously explosive — never attempted</td>
                  <td className="border p-2">Hydroxide + hydrogen</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Calcium</td>
                  <td className="border p-2">Steady fizzing</td>
                  <td className="border p-2">Vigorous</td>
                  <td className="border p-2">Hydroxide + hydrogen</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Magnesium</td>
                  <td className="border p-2">Extremely slow</td>
                  <td className="border p-2">Vigorous, glows brightly</td>
                  <td className="border p-2">Oxide + hydrogen</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Zinc, iron</td>
                  <td className="border p-2">No visible reaction</td>
                  <td className="border p-2">Slow but definite when strongly heated</td>
                  <td className="border p-2">Oxide + hydrogen</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Copper, silver, gold</td>
                  <td className="border p-2">No reaction</td>
                  <td className="border p-2">No reaction</td>
                  <td className="border p-2">—</td>
                </tr>
              </tbody>
            </table>
            <ExamTip>
              <p>
                Note the pattern in the products: metals <strong>above magnesium</strong> react with cold
                water to give a <strong>hydroxide</strong>, while metals reacting with{' '}
                <strong>steam</strong> give an <strong>oxide</strong>. Getting this the wrong way round is a
                very common error.
              </p>
            </ExamTip>
          </Card>

          <div className="rounded-xl border-2 border-violet-200 bg-violet-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-violet-700">
              Experiment 3: Comparing How Metals React with Dilute Acid
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To place magnesium, zinc, iron and copper in order of reactivity by
              comparing how fast each reacts with dilute hydrochloric acid.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> Four test tubes and a rack, dilute hydrochloric acid, equal-sized
              pieces of magnesium, zinc, iron and copper, a stopwatch, wooden splints, measuring cylinder,
              eye protection.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={chemImages.metalAcidStep1} alt="Measuring equal volumes of acid into four labelled test tubes">
                Measure 10 cm&sup3; of dilute hydrochloric acid into each of four labelled test tubes. Using
                the same volume and concentration in every tube keeps the test <strong>fair</strong>.
              </Step>
              <Step n={2} src={chemImages.metalAcidStep2} alt="Adding equal sized pieces of four different metals">
                Clean equal-sized pieces of magnesium, zinc, iron and copper with emery paper to remove any
                oxide layer, then drop one metal into each tube at the same moment.
              </Step>
              <Step n={3} src={chemImages.metalAcidStep3} alt="Observing the rate of bubbling in each test tube">
                Watch the rate at which bubbles are given off in each tube and record your observations in a
                table, from &ldquo;very fast fizzing&rdquo; to &ldquo;no bubbles at all&rdquo;.
              </Step>
              <Step n={4} src={chemImages.metalAcidStep4} alt="Testing the gas produced with a lighted splint">
                Collect the gas from the fastest tube and hold a lighted splint at the mouth of the tube.
              </Step>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Results:</strong> Magnesium fizzes rapidly and the tube gets warm; zinc fizzes steadily;
              iron gives only slow bubbles; copper shows no reaction at all. The gas gives a{' '}
              <strong>squeaky pop</strong> with a lighted splint, which is the test for hydrogen.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>General equation:</strong> Metal + Acid &rarr; Salt + Hydrogen
            </p>
            <div className="mt-2 space-y-1">
              <Equation>Mg + 2HCl &rarr; MgCl₂ + H₂</Equation>
              <Equation>Zn + H₂SO₄ &rarr; ZnSO₄ + H₂</Equation>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> The order of reactivity is magnesium &gt; zinc &gt; iron &gt;
              copper, which matches their positions in the reactivity series. Copper is below hydrogen in the
              series, so it cannot displace hydrogen from an acid.
            </p>
          </div>

          <Card title="Displacement Reactions">
            <Definition term="Displacement reaction">
              a reaction in which a more reactive metal takes the place of a less reactive metal in a
              compound. The more reactive metal &ldquo;pushes out&rdquo; the less reactive one.
            </Definition>
            <Figure
              src={chemImages.displacementCopperSulphate}
              alt="Iron nail in blue copper sulphate solution becoming coated with brown copper"
              caption="Fig 3.2 — An iron nail left in blue copper(II) sulphate solution becomes coated with pink-brown copper, while the blue solution fades to pale green."
            />
            <div className="space-y-1">
              <Equation>Fe + CuSO₄ &rarr; FeSO₄ + Cu</Equation>
              <Equation>Zn + CuSO₄ &rarr; ZnSO₄ + Cu</Equation>
              <Equation>Cu + FeSO₄ &rarr; no reaction (copper is below iron)</Equation>
            </div>
            <p>
              The rule is simple: <strong>a metal will displace any metal below it in the reactivity series
              from a solution of that metal&rsquo;s salt, but never one above it.</strong> This single rule
              lets you predict dozens of reactions.
            </p>
          </Card>

          <Card title="Reactivity and How Metals Are Extracted">
            <p>
              A metal&rsquo;s position in the reactivity series decides how difficult it is to get out of its
              ore — and therefore how expensive it is.
            </p>
            <Figure
              src={chemImages.extractionAndReactivity}
              alt="Reactivity series linked to the method used to extract each metal"
              caption="Fig 3.3 — The higher a metal is in the reactivity series, the more strongly it holds onto oxygen and the more energy is needed to extract it."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Position in series</th>
                  <th className="border p-2 text-left">Extraction method</th>
                  <th className="border p-2 text-left">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Above carbon (K, Na, Ca, Mg, Al)</td>
                  <td className="border p-2">
                    <strong>Electrolysis</strong> of the molten ore — expensive because it uses a great deal
                    of electricity
                  </td>
                  <td className="border p-2">Aluminium from bauxite</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Below carbon (Zn, Fe, Pb, Cu)</td>
                  <td className="border p-2">
                    <strong>Reduction with carbon</strong> in a furnace — cheaper, because carbon takes the
                    oxygen away
                  </td>
                  <td className="border p-2">Iron from haematite in a blast furnace</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Very low (Ag, Au, Pt)</td>
                  <td className="border p-2">
                    Found <strong>native</strong> (uncombined), so only physical separation is needed
                  </td>
                  <td className="border p-2">Gold panned or mined as the metal itself</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <div className="rounded-xl border-2 border-orange-200 bg-orange-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-orange-700">
              Experiment 4: What Conditions Are Needed for Rusting?
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To find out whether iron needs air, water, or both, in order to rust.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> Three test tubes with bungs, three clean iron nails, boiled
              distilled water, cooking oil, anhydrous calcium chloride (a drying agent), tap water.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <Step n={1} src={chemImages.rustingStep1} alt="Test tube A with a nail in ordinary tap water open to the air">
                <strong>Tube A:</strong> place a nail in ordinary water and leave the tube open, so the nail
                has both <strong>air and water</strong>.
              </Step>
              <Step n={2} src={chemImages.rustingStep2} alt="Test tube B with a nail in boiled water covered with oil">
                <strong>Tube B:</strong> place a nail in water that has been boiled (to drive out dissolved
                air) and cover the surface with a layer of oil. The nail has <strong>water but no air</strong>.
              </Step>
              <Step n={3} src={chemImages.rustingStep3} alt="Test tube C with a nail and calcium chloride sealed with a bung">
                <strong>Tube C:</strong> place a nail in a dry tube with anhydrous calcium chloride and seal
                it with a bung. The nail has <strong>air but no water</strong>.
              </Step>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Results after one week:</strong> Only the nail in tube A has rusted. The nails in tubes
              B and C are unchanged.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> Iron rusts only when <strong>both air (oxygen) and water</strong>{' '}
              are present. Removing either one prevents rusting — which is exactly what every rust-prevention
              method does.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Word equation:</strong> Iron + Oxygen + Water &rarr; Hydrated iron(III) oxide (rust).
              Rusting is speeded up by salt, which is why cars near the sea and metal roofs in humid areas
              rust faster.
            </p>
          </div>

          <Card title="Preventing Rust">
            <Figure
              src={chemImages.rustPrevention}
              alt="Six methods of rust prevention illustrated"
              caption="Fig 3.4 — Rust prevention. The first four work by keeping air and water off the iron; galvanising and sacrificial protection also work chemically."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Painting</strong> — cheap and used on bridges, gates and car bodies; must be repaired
                if it chips.
              </li>
              <li>
                <strong>Oiling or greasing</strong> — used on moving parts such as bicycle chains and machine
                tools.
              </li>
              <li>
                <strong>Plastic coating</strong> — used on dish racks, garden furniture and fridge shelves.
              </li>
              <li>
                <strong>Electroplating with chromium or tin</strong> — gives a shiny protective layer, used
                on taps and on food cans.
              </li>
              <li>
                <strong>Galvanising</strong> — coating iron with zinc. Even if the coating is scratched, the
                zinc still protects the iron because zinc is <em>more reactive</em> and corrodes first.
              </li>
              <li>
                <strong>Sacrificial protection</strong> — blocks of zinc or magnesium are bolted to ships&rsquo;
                hulls and underground pipes. The more reactive metal corrodes away instead of the iron and is
                replaced from time to time.
              </li>
              <li>
                <strong>Alloying</strong> — mixing iron with chromium and nickel makes stainless steel, which
                does not rust at all, but it is expensive.
              </li>
            </ul>
          </Card>

          <Card title="Oxidation and Reduction (Redox)">
            <p>There are two definitions you may be asked for, and both are worth knowing.</p>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left"></th>
                  <th className="border p-2 text-left">In terms of oxygen and hydrogen</th>
                  <th className="border p-2 text-left">In terms of electrons</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Oxidation</td>
                  <td className="border p-2">Gain of oxygen, or loss of hydrogen</td>
                  <td className="border p-2">Loss of electrons</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Reduction</td>
                  <td className="border p-2">Loss of oxygen, or gain of hydrogen</td>
                  <td className="border p-2">Gain of electrons</td>
                </tr>
              </tbody>
            </table>
            <p>
              Remember it with <strong>OIL RIG</strong>: <strong>O</strong>xidation <strong>I</strong>s{' '}
              <strong>L</strong>oss of electrons, <strong>R</strong>eduction <strong>I</strong>s{' '}
              <strong>G</strong>ain of electrons.
            </p>
            <Example title="Worked example — identifying redox">
              <p>In the reaction Mg + H₂O &rarr; MgO + H₂:</p>
              <ul className="list-inside list-disc space-y-1">
                <li>Magnesium has gained oxygen, so magnesium is <strong>oxidised</strong>.</li>
                <li>Water has lost oxygen, so water is <strong>reduced</strong>.</li>
                <li>
                  The substance that causes the oxidation (water) is the <strong>oxidising agent</strong>;
                  the substance that causes the reduction (magnesium) is the{' '}
                  <strong>reducing agent</strong>.
                </li>
              </ul>
            </Example>
            <WatchOut>
              <p>
                Oxidation and reduction <strong>always happen together</strong>. If something is being
                oxidised, something else in the same reaction must be being reduced — that is why they are
                called <em>redox</em> reactions.
              </p>
            </WatchOut>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Metals Key Points"
            items={[
              'Metals lose electrons and form positive ions',
              'Order: K Na Ca Mg Al Zn Fe Pb Cu Ag Au',
              'Metal + oxygen → metal oxide',
              'Above Mg + cold water → hydroxide + H₂',
              'With steam → oxide + H₂',
              'Metal + acid → salt + hydrogen (pop test)',
              'A more reactive metal displaces a less reactive one',
              'Rusting needs BOTH air and water',
              'OIL RIG — oxidation is loss, reduction is gain',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">The four gas tests</h3>
            <p className="text-sm text-slate-700">
              Hydrogen — squeaky pop with a lighted splint · Oxygen — relights a glowing splint · Carbon
              dioxide — turns limewater milky · Ammonia — turns damp red litmus blue.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     4. TITRATION
  ======================================================================= */
  {
    id: 'titration',
    title: 'Titration',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              Mixing an acid and an alkali is easy. Mixing <em>exactly</em> the right amounts, so that
              neither is left over, is not — and it matters, because a leftover acid or alkali would
              contaminate the salt you are trying to make and would make any concentration calculation
              wrong. <strong>Titration</strong> is the careful technique that finds that exact point.
            </p>
          </div>

          <Definition term="Titration">
            a laboratory technique in which a solution of known concentration is added carefully from a
            burette to a measured volume of another solution, until the reaction between them is exactly
            complete. It is used to find an unknown concentration and to prepare pure soluble salts.
          </Definition>

          <Definition term="Neutralisation">
            the reaction between an acid and a base (or alkali) to form a salt and water only.
          </Definition>
          <Equation>Acid + Alkali &rarr; Salt + Water</Equation>
          <Equation>HCl + NaOH &rarr; NaCl + H₂O</Equation>

          <Card title="The Apparatus and Why Each Piece Is Used">
            <Figure
              src={chemImages.titrationApparatus}
              alt="Labelled titration apparatus with burette, clamp stand, pipette, conical flask and white tile"
              caption="Fig 4.1 — Titration apparatus. Learn every label: burette, clamp and stand, tap, conical flask, white tile, pipette and pipette filler."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Apparatus</th>
                  <th className="border p-2 text-left">What it does</th>
                  <th className="border p-2 text-left">Why it is used</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Burette</td>
                  <td className="border p-2">Delivers any volume you choose, drop by drop</td>
                  <td className="border p-2">
                    It is graduated to 0.1 cm&sup3;, so the volume added can be measured very precisely
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Pipette (with filler)</td>
                  <td className="border p-2">Measures one fixed volume, usually 25.0 cm&sup3;</td>
                  <td className="border p-2">
                    More accurate than a measuring cylinder; the filler is used because it is dangerous to
                    suck chemicals by mouth
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Conical flask</td>
                  <td className="border p-2">Holds the solution being tested</td>
                  <td className="border p-2">
                    Its sloping sides let you swirl the contents without splashing any out
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">White tile</td>
                  <td className="border p-2">Placed under the flask</td>
                  <td className="border p-2">
                    Provides a plain white background so the first hint of a colour change is easy to see
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Indicator</td>
                  <td className="border p-2">A few drops added to the flask</td>
                  <td className="border p-2">
                    Changes colour at the end point, showing that neutralisation is exactly complete
                  </td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Indicators">
            <Figure
              src={chemImages.indicatorColours}
              alt="Colour chart of methyl orange, phenolphthalein and litmus in acid, neutral and alkaline solutions"
              caption="Fig 4.2 — Indicator colours. Two or three drops are enough — adding more does not make the change clearer and can affect the result."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Indicator</th>
                  <th className="border p-2 text-left">In acid</th>
                  <th className="border p-2 text-left">In alkali</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Methyl orange</td>
                  <td className="border p-2">Red</td>
                  <td className="border p-2">Yellow</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Phenolphthalein</td>
                  <td className="border p-2">Colourless</td>
                  <td className="border p-2">Pink</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Litmus</td>
                  <td className="border p-2">Red</td>
                  <td className="border p-2">Blue</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Universal indicator</td>
                  <td className="border p-2">Red / orange (low pH)</td>
                  <td className="border p-2">Blue / purple (high pH)</td>
                </tr>
              </tbody>
            </table>
            <WatchOut>
              <p>
                Universal indicator is <strong>not</strong> used in titrations. It changes through a whole
                range of colours gradually, so you cannot pick out one sharp end point. Use methyl orange or
                phenolphthalein instead.
              </p>
            </WatchOut>
          </Card>

          <div className="rounded-xl border-2 border-teal-200 bg-teal-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-teal-700">
              Experiment 5: Titrating Hydrochloric Acid Against Sodium Hydroxide
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To find the volume of hydrochloric acid needed to exactly neutralise
              25.0 cm&sup3; of sodium hydroxide solution.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> Burette, clamp and stand, 25 cm&sup3; pipette and filler, conical
              flask, white tile, funnel, hydrochloric acid of known concentration, sodium hydroxide solution,
              phenolphthalein indicator, wash bottle of distilled water, eye protection.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={chemImages.titrationStep1} alt="Rinsing the burette with the acid it will contain">
                Rinse the burette with a little of the acid it will hold, then clamp it upright and fill it
                using a funnel. Run a little through the tap so that the space below the tap is filled and
                there is no air bubble, then remove the funnel and record the starting reading.
              </Step>
              <Step n={2} src={chemImages.titrationStep2} alt="Using a pipette and filler to transfer alkali into the conical flask">
                Rinse the pipette with the sodium hydroxide solution, then use the filler to draw exactly
                25.0 cm&sup3; into the conical flask. Touch the tip on the inside of the flask to release the
                last drop properly.
              </Step>
              <Step n={3} src={chemImages.titrationStep3} alt="Adding two drops of phenolphthalein indicator to the flask">
                Add two or three drops of phenolphthalein. The alkali turns <strong>pink</strong>. Stand the
                flask on the white tile beneath the burette.
              </Step>
              <Step n={4} src={chemImages.titrationStep4} alt="Running acid into the flask while swirling">
                Run acid in fairly quickly at first, swirling the flask constantly, until the pink colour
                begins to fade slowly. This first run is the <strong>rough titration</strong>.
              </Step>
              <Step n={5} src={chemImages.titrationStep5} alt="Adding acid drop by drop near the end point">
                Repeat, this time adding the acid <strong>drop by drop</strong> once you are near the
                expected volume, rinsing the sides of the flask with distilled water so nothing is left
                unreacted. Stop the instant the pink colour just disappears — this is the{' '}
                <strong>end point</strong>.
              </Step>
              <Step n={6} src={chemImages.titrationStep6} alt="Recording burette readings in a results table">
                Record the final burette reading and work out the titre (final reading &minus; initial
                reading). Repeat until you have two or three titres within 0.1 cm&sup3; of each other; these
                are called <strong>concordant</strong> results.
              </Step>
            </div>

            <Figure
              src={chemImages.buretteReading}
              alt="Close up of a burette scale showing how to read the bottom of the meniscus at eye level"
              caption="Fig 4.3 — Read the bottom of the meniscus with your eye level with it, to avoid a parallax error. Burette readings are always given to two decimal places, e.g. 24.50 cm³."
            />

            <p className="mt-3 text-sm font-semibold text-slate-800">Specimen results table:</p>
            <table className="mt-2 w-full border-collapse bg-white text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Titration</th>
                  <th className="border p-2 text-left">Rough</th>
                  <th className="border p-2 text-left">1</th>
                  <th className="border p-2 text-left">2</th>
                  <th className="border p-2 text-left">3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Final reading (cm&sup3;)</td>
                  <td className="border p-2">24.10</td>
                  <td className="border p-2">23.60</td>
                  <td className="border p-2">47.15</td>
                  <td className="border p-2">23.55</td>
                </tr>
                <tr>
                  <td className="border p-2">Initial reading (cm&sup3;)</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">0.00</td>
                  <td className="border p-2">23.60</td>
                  <td className="border p-2">0.00</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="border p-2 font-semibold">Titre (cm&sup3;)</td>
                  <td className="border p-2 font-semibold">24.10</td>
                  <td className="border p-2 font-semibold">23.60</td>
                  <td className="border p-2 font-semibold">23.55</td>
                  <td className="border p-2 font-semibold">23.55</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Average titre:</strong> the rough result is always left out of the average. Using the
              three concordant titres: (23.60 + 23.55 + 23.55) &divide; 3 = <strong>23.57 cm&sup3;</strong>.
            </p>
          </div>

          <Card title="Titration Calculations">
            <p>Two formulae do all the work:</p>
            <Equation>number of moles = concentration (mol/dm³) &times; volume (cm³) &divide; 1000</Equation>
            <Equation>concentration = moles &times; 1000 &divide; volume (cm³)</Equation>
            <Example>
              <p>
                25.0 cm&sup3; of sodium hydroxide solution of unknown concentration is exactly neutralised
                by 20.0 cm&sup3; of 0.100 mol/dm&sup3; hydrochloric acid. Find the concentration of the
                sodium hydroxide.
              </p>
              <p className="mt-1 font-semibold">Step 1 — write the balanced equation:</p>
              <p>HCl + NaOH &rarr; NaCl + H₂O, so the ratio is 1 mole of acid to 1 mole of alkali.</p>
              <p className="mt-1 font-semibold">Step 2 — find the moles of the substance you know:</p>
              <p>moles of HCl = 0.100 &times; 20.0 &divide; 1000 = <strong>0.00200 mol</strong></p>
              <p className="mt-1 font-semibold">Step 3 — use the ratio:</p>
              <p>the ratio is 1 : 1, so moles of NaOH = <strong>0.00200 mol</strong></p>
              <p className="mt-1 font-semibold">Step 4 — find the concentration:</p>
              <p>
                concentration of NaOH = 0.00200 &times; 1000 &divide; 25.0 ={' '}
                <strong>0.0800 mol/dm&sup3;</strong>
              </p>
            </Example>
            <Example title="Worked example 2 — a 2 : 1 ratio">
              <p>
                20.0 cm&sup3; of 0.050 mol/dm&sup3; sulphuric acid neutralises 25.0 cm&sup3; of potassium
                hydroxide. Find the concentration of the potassium hydroxide.
              </p>
              <p className="mt-1">
                Equation: H₂SO₄ + 2KOH &rarr; K₂SO₄ + 2H₂O — the ratio is 1 acid : <strong>2</strong> alkali.
              </p>
              <p>moles of H₂SO₄ = 0.050 &times; 20.0 &divide; 1000 = 0.00100 mol</p>
              <p>moles of KOH = 2 &times; 0.00100 = 0.00200 mol</p>
              <p>
                concentration of KOH = 0.00200 &times; 1000 &divide; 25.0 ={' '}
                <strong>0.0800 mol/dm&sup3;</strong>
              </p>
            </Example>
            <ExamTip>
              <p>
                Always write the <strong>balanced equation first</strong>. Students who skip it usually
                assume a 1 : 1 ratio, which is wrong for sulphuric acid (H₂SO₄ gives two H⁺ ions) and costs
                several marks.
              </p>
            </ExamTip>
          </Card>

          <Card title="Making a Pure Salt by Titration">
            <p>
              Once you know exactly how much acid neutralises the alkali, you can make a pure sample of the
              salt.
            </p>
            <ol className="list-inside list-decimal space-y-1">
              <li>Titrate as usual with indicator, and note the exact titre.</li>
              <li>
                Throw that mixture away and repeat with fresh solutions, adding exactly the same volume of
                acid but <strong>with no indicator</strong>, so that the salt solution is not contaminated by
                the dye.
              </li>
              <li>
                Pour the neutral solution into an evaporating basin and heat gently until about half the
                water has evaporated and crystals begin to form at the edges.
              </li>
              <li>
                Leave the concentrated solution to cool and crystallise slowly. Slow cooling gives larger,
                purer crystals.
              </li>
              <li>Filter off the crystals and dry them between filter papers or in a warm oven.</li>
            </ol>
            <Figure
              src={chemImages.saltCrystallisation}
              alt="Evaporating basin over a water bath with salt crystals forming, then filtering and drying"
              caption="Fig 4.4 — Making crystals: evaporate to the point of crystallisation, cool slowly, filter and dry."
            />
            <WatchOut>
              <p>
                Do not evaporate the solution to complete dryness over a strong flame. That gives a fine
                powder rather than proper crystals, and some salts decompose when overheated.
              </p>
            </WatchOut>
          </Card>

          <Card title="Precautions and Sources of Error">
            <ul className="list-inside list-disc space-y-1">
              <li>Rinse the burette with the acid and the pipette with the alkali before use, so leftover water does not dilute them.</li>
              <li>Fill the space below the burette tap — an air bubble that escapes during the titration makes the titre too large.</li>
              <li>Read the bottom of the meniscus with your eye level with it, to avoid parallax error.</li>
              <li>Swirl the flask continuously so the reaction mixes properly.</li>
              <li>Add the acid dropwise near the end point — overshooting by even one drop spoils the result.</li>
              <li>Repeat until concordant results are obtained, and ignore the rough titration in the average.</li>
              <li>Wear eye protection; acids and alkalis are corrosive.</li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Titration Key Points"
            items={[
              'Acid + alkali → salt + water',
              'Burette measures variable volume to 0.1 cm³',
              'Pipette measures one fixed volume (25.0 cm³)',
              'Phenolphthalein: pink in alkali, colourless in acid',
              'Methyl orange: yellow in alkali, red in acid',
              'White tile makes the end point easy to see',
              'Ignore the rough titre when averaging',
              'moles = concentration × volume ÷ 1000',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Calculation checklist</h3>
            <ol className="list-inside list-decimal space-y-1 text-sm text-slate-700">
              <li>Write the balanced equation.</li>
              <li>Find moles of the solution you know everything about.</li>
              <li>Use the mole ratio from the equation.</li>
              <li>Convert back to concentration, and give the unit mol/dm³.</li>
            </ol>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     5. INDUSTRIAL PROCESSES
  ======================================================================= */
  {
    id: 'industrial-processes',
    title: 'Industrial Processes',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              Laboratory chemistry aims for the purest possible product. Industrial chemistry has a
              different aim: making the largest amount of product at the <strong>lowest cost</strong>, safely
              and as quickly as possible. This is why industrial conditions are always a{' '}
              <strong>compromise</strong> — a temperature that gives the fastest useful rate rather than the
              highest yield, and a pressure high enough to help but low enough to afford.
            </p>
          </div>

          <Card title="The Haber Process — Making Ammonia">
            <p>
              <strong>Raw materials:</strong> nitrogen from the air (which is 78% N₂) and hydrogen, obtained
              from natural gas or from cracking petroleum fractions. Both are cheap and plentiful, which is
              the whole point of the process.
            </p>
            <Equation>N₂(g) + 3H₂(g) &#8652; 2NH₃(g)</Equation>
            <p>
              The double arrow means the reaction is <strong>reversible</strong> — ammonia breaks back down
              into nitrogen and hydrogen as fast as it forms, so the reaction never goes to completion.
            </p>
            <Figure
              src={chemImages.haberProcess}
              alt="Flow diagram of the Haber process from raw gases through compressor and converter to liquid ammonia"
              caption="Fig 5.1 — The Haber process. Only about 15% of the gas is converted on each pass, so the unreacted nitrogen and hydrogen are recycled, which is what makes the process economic."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Condition</th>
                  <th className="border p-2 text-left">Value used</th>
                  <th className="border p-2 text-left">Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Ratio of gases</td>
                  <td className="border p-2">1 volume N₂ : 3 volumes H₂</td>
                  <td className="border p-2">Matches the balanced equation, so neither gas is wasted</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Pressure</td>
                  <td className="border p-2">About 200 atmospheres</td>
                  <td className="border p-2">
                    High pressure pushes the reaction towards ammonia and gives a better yield; going much
                    higher would need dangerously strong, expensive pipes
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Temperature</td>
                  <td className="border p-2">About 450 &deg;C</td>
                  <td className="border p-2">
                    A compromise: a lower temperature would give more ammonia but far too slowly to be
                    useful, while a higher one is fast but breaks the ammonia down again
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Catalyst</td>
                  <td className="border p-2">Finely divided iron</td>
                  <td className="border p-2">
                    Speeds the reaction up so equilibrium is reached quickly; it does <em>not</em> change the
                    yield and is not used up
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Separation</td>
                  <td className="border p-2">Cooling and condensing</td>
                  <td className="border p-2">
                    Ammonia liquefies at a much higher temperature than N₂ and H₂, so it runs off as a liquid
                    while the unreacted gases stay gaseous and are recycled
                  </td>
                </tr>
              </tbody>
            </table>
            <Figure
              src={chemImages.ammoniaUses}
              alt="Uses of ammonia branching out from a central ammonia label"
              caption="Fig 5.2 — Uses of ammonia. About 80% of all ammonia produced ends up as fertiliser."
            />
            <p>
              <strong>Uses of ammonia:</strong> making nitrogenous fertilisers (ammonium nitrate, ammonium
              sulphate, urea), making nitric acid by the Ostwald process, refrigerants, household cleaning
              products, dyes, explosives, nylon and some medicines.
            </p>
            <p>
              <strong>Test for ammonia:</strong> it is the only common alkaline gas — it turns damp{' '}
              <strong>red litmus paper blue</strong> and gives dense white fumes with hydrogen chloride gas.
            </p>
          </Card>

          <Card title="The Contact Process — Making Sulphuric Acid">
            <p>
              Sulphuric acid is often called the most important industrial chemical of all; a country&rsquo;s
              output of it used to be treated as a measure of how industrialised it was.
            </p>
            <Figure
              src={chemImages.contactProcess}
              alt="Flow diagram of the four stages of the Contact process"
              caption="Fig 5.3 — The four stages of the Contact process."
            />
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">Stage 1 — burn sulphur in air</p>
                <Equation>S + O₂ &rarr; SO₂</Equation>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Stage 2 — oxidise sulphur dioxide (vanadium(V) oxide catalyst, about 450 &deg;C, 2 atm)
                </p>
                <Equation>2SO₂ + O₂ &#8652; 2SO₃</Equation>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Stage 3 — absorb the sulphur trioxide in concentrated sulphuric acid to form oleum
                </p>
                <Equation>SO₃ + H₂SO₄ &rarr; H₂S₂O₇</Equation>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Stage 4 — dilute the oleum carefully with water</p>
                <Equation>H₂S₂O₇ + H₂O &rarr; 2H₂SO₄</Equation>
              </div>
            </div>
            <WatchOut>
              <p>
                A favourite exam question: why is sulphur trioxide not simply added straight to water? Because
                the reaction SO₃ + H₂O is <strong>violently exothermic</strong> and produces a dangerous,
                uncontrollable acid mist that is difficult to condense. Dissolving it in acid first and then
                diluting keeps the process safe and controllable.
              </p>
            </WatchOut>
            <Figure
              src={chemImages.sulphuricAcidUses}
              alt="Uses of sulphuric acid shown as labelled icons"
              caption="Fig 5.4 — Uses of sulphuric acid."
            />
            <p>
              <strong>Uses of sulphuric acid:</strong> fertilisers (the largest single use), car batteries,
              detergents, paints and pigments, dyes, plastics, cleaning (&ldquo;pickling&rdquo;) steel before
              plating, and oil refining.
            </p>
          </Card>

          <Card title="The Ostwald Process — Making Nitric Acid">
            <Figure
              src={chemImages.ostwaldProcess}
              alt="Flow diagram of the three stages of the Ostwald process"
              caption="Fig 5.5 — The Ostwald process converts ammonia into nitric acid in three stages."
            />
            <div className="space-y-2">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Stage 1 — oxidise ammonia (platinum-rhodium catalyst, about 900 &deg;C)
                </p>
                <Equation>4NH₃ + 5O₂ &rarr; 4NO + 6H₂O</Equation>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Stage 2 — cool and oxidise further</p>
                <Equation>2NO + O₂ &rarr; 2NO₂</Equation>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">Stage 3 — absorb in water</p>
                <Equation>4NO₂ + 2H₂O + O₂ &rarr; 4HNO₃</Equation>
              </div>
            </div>
            <p>
              <strong>Uses of nitric acid:</strong> ammonium nitrate fertiliser, explosives (TNT and
              dynamite), dyes, drugs, plastics and nylon.
            </p>
          </Card>

          <Card title="Fertilisers">
            <p>
              Plants take mineral salts from the soil. Every harvest removes those minerals, so unless they
              are replaced the soil becomes exhausted and yields fall. Fertilisers put them back.
            </p>
            <Figure
              src={chemImages.npkFertiliser}
              alt="NPK fertiliser bag with each element linked to what it does in the plant"
              caption="Fig 5.6 — An NPK fertiliser bag. The three numbers give the percentage of nitrogen, phosphorus and potassium."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Element</th>
                  <th className="border p-2 text-left">What the plant uses it for</th>
                  <th className="border p-2 text-left">Sign of deficiency</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Nitrogen (N)</td>
                  <td className="border p-2">Making proteins and chlorophyll; leafy growth</td>
                  <td className="border p-2">Stunted plants with pale yellow leaves</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Phosphorus (P)</td>
                  <td className="border p-2">Root growth and ripening of fruit and seed</td>
                  <td className="border p-2">Poor root systems and slow ripening</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Potassium (K)</td>
                  <td className="border p-2">
                    Helps flowering and fruiting and improves resistance to disease
                  </td>
                  <td className="border p-2">Yellow leaf edges and poor fruit</td>
                </tr>
              </tbody>
            </table>
            <p>
              Nitrogenous fertilisers are made by neutralising an acid with ammonia:{' '}
              <strong>NH₃ + HNO₃ &rarr; NH₄NO₃</strong> (ammonium nitrate) and{' '}
              <strong>2NH₃ + H₂SO₄ &rarr; (NH₄)₂SO₄</strong> (ammonium sulphate).
            </p>
            <WatchOut>
              <p>
                Using too much fertiliser causes <strong>eutrophication</strong>: rain washes nitrates into
                rivers, algae bloom, plants below die, decomposing bacteria use up the dissolved oxygen and
                the fish suffocate. Fertiliser is not poisonous — it is the oxygen shortage that kills.
              </p>
            </WatchOut>
          </Card>

          <Card title="Industrial Gases, Their Uses and Their Tests">
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Gas</th>
                  <th className="border p-2 text-left">How it is obtained</th>
                  <th className="border p-2 text-left">Uses</th>
                  <th className="border p-2 text-left">Test</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Hydrogen</td>
                  <td className="border p-2">
                    Electrolysis of water; from natural gas; metal + acid in the laboratory
                  </td>
                  <td className="border p-2">Haber process, hardening vegetable oils into margarine, fuel</td>
                  <td className="border p-2">Squeaky pop with a lighted splint</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Oxygen</td>
                  <td className="border p-2">Fractional distillation of liquid air</td>
                  <td className="border p-2">Hospitals, oxy-acetylene welding, steel making, rocket fuel</td>
                  <td className="border p-2">Relights a glowing splint</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Nitrogen</td>
                  <td className="border p-2">Fractional distillation of liquid air</td>
                  <td className="border p-2">
                    Haber process, freezing food, filling crisp packets to stop them going stale
                  </td>
                  <td className="border p-2">No positive test — it puts out a lighted splint and does nothing else</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Ammonia</td>
                  <td className="border p-2">Haber process</td>
                  <td className="border p-2">Fertilisers, nitric acid, refrigerant, cleaning fluids</td>
                  <td className="border p-2">Turns damp red litmus blue; choking smell</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Carbon dioxide</td>
                  <td className="border p-2">
                    Burning fuels, fermentation, heating limestone, acid + carbonate
                  </td>
                  <td className="border p-2">Fire extinguishers, fizzy drinks, dry ice for refrigeration</td>
                  <td className="border p-2">Turns limewater milky</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Chlorine</td>
                  <td className="border p-2">Electrolysis of brine (concentrated sodium chloride)</td>
                  <td className="border p-2">Water treatment, bleach, PVC, disinfectants</td>
                  <td className="border p-2">Bleaches damp litmus paper white</td>
                </tr>
              </tbody>
            </table>
            <Figure
              src={chemImages.gasTests}
              alt="Panel showing the standard laboratory test for each of six gases"
              caption="Fig 5.7 — The standard gas tests. These are guaranteed marks in the examination if you learn them exactly."
            />
            <Figure
              src={chemImages.gasCollectionMethods}
              alt="Three methods of collecting gases: over water, upward delivery and downward delivery"
              caption="Fig 5.8 — Choosing a collection method: over water if the gas is insoluble; downward delivery (upward displacement of air) if it is denser than air; upward delivery if it is less dense."
            />
          </Card>

          <Card title="Where to Build a Chemical Plant">
            <p>
              Siting a factory is a chemistry question as much as a business one, and it is often worth
              several marks.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Close to raw materials</strong> — cuts transport costs, especially for bulky ores and
                limestone.
              </li>
              <li>
                <strong>Good transport links</strong> — road, rail or a port for bringing materials in and
                sending product out.
              </li>
              <li>
                <strong>Plenty of water</strong> — needed for cooling, for steam and as a solvent.
              </li>
              <li>
                <strong>Reliable and affordable energy supply</strong> — many processes need high
                temperatures or electrolysis.
              </li>
              <li>
                <strong>Available labour</strong> — both skilled operators and general workers.
              </li>
              <li>
                <strong>Near the market</strong> — a fertiliser plant is best sited near farming areas.
              </li>
              <li>
                <strong>Safe waste disposal, away from housing</strong> — to protect people from fumes,
                effluent and noise.
              </li>
            </ul>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Industrial Key Points"
            items={[
              'Haber: N₂ + 3H₂ ⇌ 2NH₃',
              'Haber conditions: 200 atm, 450 °C, iron catalyst',
              'Catalysts speed up the rate, not the yield',
              'Contact: S → SO₂ → SO₃ → oleum → H₂SO₄',
              'Contact catalyst: vanadium(V) oxide, 450 °C',
              'Ostwald: NH₃ → NO → NO₂ → HNO₃',
              'NPK: nitrogen leaves, phosphorus roots, potassium fruit',
              'Excess fertiliser causes eutrophication',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">The word &ldquo;compromise&rdquo;</h3>
            <p className="text-sm text-slate-700">
              If a question asks why 450 °C is used in the Haber or Contact process, the answer must contain
              the idea of a <strong>compromise</strong>: a lower temperature gives a better yield but is too
              slow; a higher temperature is fast but the yield falls.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     6. ORGANIC CHEMISTRY - ALCOHOLS
  ======================================================================= */
  {
    id: 'organic-chemistry',
    title: 'Organic Chemistry – Alcohols',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg leading-relaxed text-slate-700">
              <strong>Organic chemistry</strong> is the chemistry of compounds built around chains and rings
              of carbon atoms. Carbon is unusual because each of its atoms can form four strong bonds,
              including bonds to other carbon atoms, so it can build molecules of almost unlimited length and
              variety — which is why there are millions of organic compounds but only about a hundred
              thousand inorganic ones.
            </p>
          </div>

          <Definition term="Homologous series">
            a family of organic compounds that have the same general formula, contain the same functional
            group, and show a gradual change in physical properties as the molecules get bigger. Each member
            differs from the next by one &ndash;CH₂&ndash; unit.
          </Definition>

          <Card title="The Alcohols">
            <p>
              The alcohols are the homologous series whose <strong>functional group</strong> is the hydroxyl
              group, <strong>&ndash;OH</strong>. Their general formula is <strong>C&#8345;H&#8322;&#8345;&#8330;&#8321;OH</strong>,
              and their names all end in <strong>-ol</strong>.
            </p>
            <Figure src={chemImages.alcohols} alt="The first three alcohols" />
            <Figure
              src={chemImages.alcoholDisplayedFormulae}
              alt="Displayed formulae of methanol, ethanol and propanol showing every bond"
              caption="Fig 6.1 — Displayed formulae. Every atom and every bond is drawn, so the –OH group is clearly visible on the end carbon."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Molecular formula</th>
                  <th className="border p-2 text-left">Carbon atoms</th>
                  <th className="border p-2 text-left">Boiling point</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Methanol</td>
                  <td className="border p-2">CH₃OH</td>
                  <td className="border p-2">1</td>
                  <td className="border p-2">65 &deg;C</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Ethanol</td>
                  <td className="border p-2">C₂H₅OH</td>
                  <td className="border p-2">2</td>
                  <td className="border p-2">78 &deg;C</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Propanol</td>
                  <td className="border p-2">C₃H₇OH</td>
                  <td className="border p-2">3</td>
                  <td className="border p-2">97 &deg;C</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Butanol</td>
                  <td className="border p-2">C₄H₉OH</td>
                  <td className="border p-2">4</td>
                  <td className="border p-2">118 &deg;C</td>
                </tr>
              </tbody>
            </table>
            <p>
              Notice the pattern: as the chain gets longer the boiling point <strong>rises</strong> steadily,
              because bigger molecules have stronger forces of attraction between them and need more energy to
              separate. Solubility in water goes the other way — the short ones mix with water completely, the
              longer ones less and less.
            </p>
            <Safety>
              <p>
                <strong>Methanol is poisonous.</strong> Drinking even a small amount causes blindness and can
                be fatal. It is deliberately added to industrial alcohol (methylated spirits) precisely so
                that people cannot drink it.
              </p>
            </Safety>
          </Card>

          <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4 shadow-sm">
            <h4 className="mb-1 text-lg font-bold text-emerald-700">
              Experiment 6: Making Ethanol by Fermentation
            </h4>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Aim:</strong> To produce ethanol from glucose using yeast, and to show that carbon
              dioxide is given off at the same time.
            </p>
            <p className="mb-3 text-sm text-slate-700">
              <strong>Materials:</strong> Conical flask, glucose solution, dried yeast, bung with delivery
              tube, test tube of limewater, thermometer, water bath at about 30&ndash;37 &deg;C, cotton wool.
            </p>
            <p className="mb-2 text-sm font-semibold text-slate-800">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Step n={1} src={chemImages.fermentationStep1} alt="Dissolving glucose in warm water in a conical flask">
                Dissolve glucose in warm water in the conical flask. Warm water is used because yeast works
                best at about body temperature.
              </Step>
              <Step n={2} src={chemImages.fermentationStep2} alt="Adding yeast to the glucose solution and swirling">
                Add a spatula of yeast and swirl to mix. Yeast contains the enzymes that catalyse the
                breakdown of glucose.
              </Step>
              <Step n={3} src={chemImages.fermentationStep3} alt="Fitting a bung and delivery tube leading to limewater">
                Fit the bung and lead the delivery tube into a test tube of limewater. The bung keeps{' '}
                <strong>air out</strong>, which is essential because fermentation is an{' '}
                <strong>anaerobic</strong> process.
              </Step>
              <Step n={4} src={chemImages.fermentationStep4} alt="Leaving the apparatus in a warm water bath for several days">
                Stand the flask in a warm water bath at about 30&ndash;37 &deg;C and leave it for two to three
                days.
              </Step>
            </div>
            <p className="mt-3 text-sm text-slate-700">
              <strong>Observations:</strong> Bubbles of gas rise steadily through the mixture, the limewater
              turns <strong>milky</strong>, and after a few days the mixture smells of alcohol and the
              bubbling gradually stops.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Equation:</strong>
            </p>
            <Equation>C₆H₁₂O₆ &rarr; 2C₂H₅OH + 2CO₂</Equation>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Conclusion:</strong> Yeast converts glucose into ethanol and carbon dioxide. The
              bubbling stops when the ethanol concentration reaches about <strong>15%</strong>, because at
              that point the alcohol kills the yeast. This is why no fermented drink is naturally stronger
              than about 15% alcohol — anything stronger has been distilled.
            </p>
            <p className="mt-2 text-sm text-slate-700">
              <strong>Why the temperature matters:</strong> too cold and the enzymes work far too slowly; too
              hot (above about 45 &deg;C) and the enzymes are <strong>denatured</strong> and stop working
              altogether.
            </p>
          </div>

          <Card title="Concentrating Ethanol by Distillation">
            <p>
              Ethanol boils at 78 &deg;C and water at 100 &deg;C. Heating the fermented mixture in a
              fractional distillation apparatus allows the ethanol to boil off first, be condensed and be
              collected separately, giving a much more concentrated product.
            </p>
            <Figure
              src={chemImages.ethanolDistillation}
              alt="Fractional distillation apparatus for concentrating ethanol from a fermented mixture"
              caption="Fig 6.2 — Fractional distillation. Collect the fraction that comes over while the thermometer holds steady at about 78 °C."
            />
          </Card>

          <Card title="Making Ethanol Industrially — Hydration of Ethene">
            <p>
              The other way to make ethanol is to add water to ethene, a gas obtained from crude oil by
              cracking.
            </p>
            <Equation>C₂H₄ + H₂O &#8652; C₂H₅OH</Equation>
            <p>
              Conditions: about <strong>300 &deg;C</strong>, <strong>60&ndash;70 atmospheres</strong> pressure,
              and a <strong>phosphoric acid catalyst</strong>.
            </p>
            <Figure
              src={chemImages.etheneHydration}
              alt="Flow diagram for the industrial hydration of ethene to ethanol"
              caption="Fig 6.3 — Hydration of ethene: a fast, continuous process that gives very pure ethanol."
            />
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left"></th>
                  <th className="border p-2 text-left">Fermentation</th>
                  <th className="border p-2 text-left">Hydration of ethene</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Raw material</td>
                  <td className="border p-2">Sugar from crops — <strong>renewable</strong></td>
                  <td className="border p-2">Ethene from crude oil — <strong>non-renewable</strong></td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Conditions</td>
                  <td className="border p-2">Warm (about 35 &deg;C), no pressure needed</td>
                  <td className="border p-2">High temperature and high pressure</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Rate</td>
                  <td className="border p-2">Slow — takes days</td>
                  <td className="border p-2">Very fast</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Type of process</td>
                  <td className="border p-2">Batch — stop and start each time</td>
                  <td className="border p-2">Continuous — runs without stopping</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Purity of product</td>
                  <td className="border p-2">Impure; needs distilling</td>
                  <td className="border p-2">Very pure</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Reactions of Ethanol">
            <p className="font-semibold text-slate-800">Combustion</p>
            <p>
              Ethanol burns in plenty of air with a clean blue flame, releasing a great deal of heat, which is
              why it works as a fuel.
            </p>
            <Equation>C₂H₅OH + 3O₂ &rarr; 2CO₂ + 3H₂O</Equation>
            <p className="mt-2 font-semibold text-slate-800">Oxidation to ethanoic acid</p>
            <p>
              If ethanol is left exposed to air, bacteria oxidise it to ethanoic acid — this is how wine turns
              to vinegar. The same change can be done deliberately with an oxidising agent such as acidified
              potassium dichromate(VI), whose orange colour turns green as the reaction takes place.
            </p>
            <Equation>C₂H₅OH + 2[O] &rarr; CH₃COOH + H₂O</Equation>
            <Figure
              src={chemImages.ethanolUses}
              alt="Uses of ethanol shown as labelled icons"
              caption="Fig 6.4 — Uses of ethanol."
            />
            <ul className="list-inside list-disc space-y-1">
              <li>
                <strong>Solvent</strong> — dissolves substances that will not dissolve in water, so it is used
                in perfumes, glues, inks, cosmetics and medicines.
              </li>
              <li>
                <strong>Fuel</strong> — blended with petrol as bioethanol; Zimbabwe produces ethanol from
                sugar cane at Chisumbanje and blends it into the national fuel supply.
              </li>
              <li>
                <strong>Alcoholic drinks</strong> — the ethanol in beer, wine and spirits.
              </li>
              <li>
                <strong>Antiseptic</strong> — used to sterilise skin and instruments because it kills bacteria.
              </li>
              <li>
                <strong>Methylated spirits</strong> — ethanol deliberately mixed with methanol and a dye, sold
                cheaply for cleaning and burning.
              </li>
            </ul>
          </Card>

          <Card title="The Effects of Alcohol Abuse">
            <p>
              Ethanol is a <strong>depressant</strong>: it slows down the nervous system. In small amounts it
              reduces inhibitions; in larger amounts it causes serious harm.
            </p>
            <ul className="list-inside list-disc space-y-1">
              <li>Slower reaction times and poor judgement, which is why drinking and driving kills.</li>
              <li>Blurred vision, loss of balance and slurred speech.</li>
              <li>Long-term damage to the liver (cirrhosis), the brain and the stomach lining.</li>
              <li>Addiction, leading to loss of employment, family breakdown and poverty.</li>
              <li>Increased risk-taking, which raises the risk of HIV infection and of violence.</li>
              <li>Damage to an unborn baby if a pregnant woman drinks.</li>
            </ul>
          </Card>

          <Card title="The Greenhouse Effect and Global Warming">
            <Definition term="Greenhouse effect">
              the natural warming of the Earth caused by gases in the atmosphere that let short-wavelength
              radiation from the Sun pass through, but absorb the longer-wavelength infrared radiation that
              the warm Earth radiates back out.
            </Definition>
            <Figure
              src={chemImages.greenhouseEffect}
              alt="Diagram of the greenhouse effect with incoming solar radiation and trapped infrared radiation"
              caption="Fig 6.5 — The greenhouse effect. Some warming is natural and essential; the problem is that human activity is making the effect stronger."
            />
            <p>
              Without any greenhouse effect the Earth would be about 33 &deg;C colder and largely frozen. The
              problem is that human activities have raised the concentration of greenhouse gases, so more heat
              is trapped than before — this extra warming is called <strong>global warming</strong>, and the
              resulting shifts in weather patterns are called <strong>climate change</strong>.
            </p>
            <p className="font-semibold text-slate-800">The main greenhouse gases and where they come from</p>
            <table className="w-full border-collapse text-sm text-slate-700">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Gas</th>
                  <th className="border p-2 text-left">Main human sources</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Carbon dioxide (CO₂)</td>
                  <td className="border p-2">
                    Burning coal, petrol, diesel and paraffin; deforestation and veld fires
                  </td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Methane (CH₄)</td>
                  <td className="border p-2">Cattle, rice paddies, rubbish dumps, leaking natural gas</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Nitrous oxide (N₂O)</td>
                  <td className="border p-2">Nitrogen fertilisers and vehicle exhausts</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">CFCs</td>
                  <td className="border p-2">Old refrigerators, air conditioners and aerosol sprays</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Water vapour</td>
                  <td className="border p-2">
                    Mostly natural, but increases as the atmosphere warms, making the warming worse
                  </td>
                </tr>
              </tbody>
            </table>
            <Figure
              src={chemImages.globalWarmingEffects}
              alt="Effects of global warming illustrated: melting ice, rising sea level, drought, floods"
              caption="Fig 6.6 — Effects of global warming, including those already being felt in southern Africa."
            />
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-rose-700">Effects</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>Polar ice and glaciers melt, so sea levels rise and low-lying land floods</li>
                  <li>More frequent and more severe droughts, cutting crop yields</li>
                  <li>More intense storms, cyclones and flooding</li>
                  <li>Deserts spread (desertification) and rainfall becomes unreliable</li>
                  <li>Habitats are lost and species become extinct</li>
                  <li>Heat waves and the spread of malaria into new areas</li>
                </ul>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <p className="mb-1 text-sm font-bold text-emerald-700">Solutions</p>
                <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
                  <li>Burn fewer fossil fuels; use solar, wind and hydroelectric power</li>
                  <li>Plant trees (afforestation) and stop deforestation</li>
                  <li>Use energy-efficient appliances, stoves and light bulbs</li>
                  <li>Reduce, reuse and recycle to cut manufacturing emissions</li>
                  <li>Use public transport, walk or cycle</li>
                  <li>Capture methane from landfill sites and use it as biogas</li>
                </ul>
              </div>
            </div>
            <WatchOut>
              <p>
                Global warming and the hole in the ozone layer are <strong>two different problems</strong>.
                Global warming is caused mainly by carbon dioxide trapping heat; the ozone hole is caused by
                CFCs destroying ozone that blocks ultraviolet light. Mixing them up is a classic mistake.
              </p>
            </WatchOut>
          </Card>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24">
          <KeyList
            title="Organic Key Points"
            items={[
              'Alcohols contain the –OH functional group',
              'General formula CₙH₂ₙ₊₁OH; names end in -ol',
              'Boiling point rises as the chain gets longer',
              'Fermentation: C₆H₁₂O₆ → 2C₂H₅OH + 2CO₂',
              'Yeast, 30–37 °C, anaerobic, stops at about 15%',
              'Industrially: C₂H₄ + H₂O ⇌ C₂H₅OH',
              'Ethanol burns to CO₂ and water; oxidises to vinegar',
              'Greenhouse gases trap infrared radiation',
            ]}
          />
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h3 className="mb-2 text-base font-bold text-amber-800">Two alcohols, two very different things</h3>
            <p className="text-sm text-slate-700">
              <strong>Ethanol</strong> is the alcohol in drinks and in fuel blends.{' '}
              <strong>Methanol</strong> is highly poisonous and causes blindness. They differ by only one
              carbon atom, so read the question carefully.
            </p>
          </div>
        </aside>
      </div>
    ),
  },

  /* =======================================================================
     7. REVISION SUMMARY
  ======================================================================= */
  {
    id: 'revision-summary',
    title: 'Quick Revision Summary',
    content: (
      <div className="space-y-6">
        <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">⏱️</span>
            <h4 className="text-lg font-bold text-amber-800">Last-Minute Study Strategy</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>
              Write out the reactivity series, the four gas tests and the indicator colours on one card and
              read it every day. These are guaranteed marks.
            </li>
            <li>
              Practise three titration calculations from start to finish, including one with sulphuric acid so
              that you get used to the 1 : 2 ratio.
            </li>
            <li>
              For each industrial process learn: the equation, the catalyst, the temperature, the pressure and{' '}
              <strong>one reason</strong> for each condition.
            </li>
            <li>
              Learn the &ldquo;why&rdquo; answers for chromatography — pencil baseline, solvent below the
              spot, lid on the beaker, mark the solvent front.
            </li>
            <li>
              When you meet a trend question, always answer using atomic size, shielding and the pull of the
              nucleus.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border-2 border-rose-300 bg-rose-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            <h4 className="text-lg font-bold text-rose-800">Common Mistakes to Avoid</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>Drawing the chromatography baseline in pen, or letting the solvent cover the spot.</li>
            <li>Giving an Rf value with units, or greater than 1.</li>
            <li>
              Saying Group 7 reactivity increases down the group. It <strong>decreases</strong> — only Group 1
              increases.
            </li>
            <li>
              Writing that a metal + cold water gives an oxide. Above magnesium it gives a{' '}
              <strong>hydroxide</strong>; only steam gives an oxide.
            </li>
            <li>Saying a catalyst increases the yield. It only increases the <strong>rate</strong>.</li>
            <li>Assuming a 1 : 1 ratio in every titration calculation.</li>
            <li>Including the rough titre when calculating the average.</li>
            <li>Confusing global warming with the hole in the ozone layer.</li>
          </ul>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🧪</span>
              <h4 className="text-lg font-bold text-blue-700">Chromatography</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Mobile phase (solvent) and stationary phase (paper)</li>
              <li>More soluble = travels further</li>
              <li>Rf = spot distance ÷ solvent front distance</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              One spot = pure substance; several spots = mixture.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h4 className="text-lg font-bold text-blue-700">Periodic Trends</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Group 1: reactivity ↑ down the group</li>
              <li>Group 7: reactivity ↓ down the group</li>
              <li>Group 0: full shell, inert, monatomic</li>
              <li>Transition: coloured, catalysts, variable valency</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Explain every trend with atomic size and shielding.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🔩</span>
              <h4 className="text-lg font-bold text-blue-700">Metals</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>K Na Ca Mg Al Zn Fe Pb Cu Ag Au</li>
              <li>Metal + acid → salt + hydrogen</li>
              <li>Displacement: more reactive pushes out less reactive</li>
              <li>Rusting needs air <em>and</em> water</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Above carbon → electrolysis; below carbon → reduction with carbon.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">⚗️</span>
              <h4 className="text-lg font-bold text-blue-700">Titration</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Burette + pipette + conical flask + white tile</li>
              <li>Indicator shows the end point</li>
              <li>Concordant titres within 0.1 cm³</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              moles = concentration × volume ÷ 1000.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🏭</span>
              <h4 className="text-lg font-bold text-blue-700">Industrial Processes</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Haber: N₂ + 3H₂ ⇌ 2NH₃ — 200 atm, 450 °C, iron catalyst, gases recycled</li>
              <li>Contact: S → SO₂ → SO₃ → oleum → H₂SO₄ — V₂O₅ catalyst, 450 °C</li>
              <li>Ostwald: NH₃ → NO → NO₂ → HNO₃ — Pt/Rh catalyst, 900 °C</li>
              <li>Fertilisers supply N, P and K; too much causes eutrophication</li>
              <li>Gas tests: pop, glowing splint, limewater, damp red litmus, bleaching</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Every set of industrial conditions is a compromise between rate, yield and cost.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-2">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl">🍶</span>
              <h4 className="text-lg font-bold text-blue-700">Organic &amp; Environment</h4>
            </div>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
              <li>Alcohols: –OH group, CₙH₂ₙ₊₁OH, names end in -ol</li>
              <li>Fermentation vs hydration of ethene — know both sets of conditions</li>
              <li>Ethanol: solvent, fuel, drinks, antiseptic</li>
              <li>Greenhouse gases: CO₂, CH₄, N₂O, CFCs, water vapour</li>
              <li>Effects: rising seas, drought, floods, desertification, lost biodiversity</li>
            </ul>
            <p className="mt-2 text-xs font-semibold text-blue-700">
              Methanol is poisonous; ethanol is the one in drinks and fuel.
            </p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">✅</span>
            <h4 className="text-lg font-bold text-emerald-800">Final Checklist Before the Exam</h4>
          </div>
          <ul className="list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>I can describe a chromatography experiment and calculate an Rf value.</li>
            <li>I can explain Group 1 and Group 7 trends using atomic size and shielding.</li>
            <li>I can write the reactivity series from memory and use it to predict displacement.</li>
            <li>I can describe the rusting experiment and five ways of preventing rust.</li>
            <li>I can label a titration set-up and describe the method in full.</li>
            <li>I can do a titration calculation with a 1 : 1 and a 1 : 2 ratio.</li>
            <li>I can state the conditions for the Haber and Contact processes and explain each one.</li>
            <li>I can write the fermentation equation and describe the apparatus.</li>
            <li>I can explain the greenhouse effect and name four greenhouse gases.</li>
            <li>I know all the gas tests and their positive results.</li>
          </ul>
        </div>
      </div>
    ),
  },
];

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
      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 relative flex items-center">
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
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
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
      <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
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
  const activeIndex = Math.max(sections.findIndex((section) => section.id === active), 0);
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
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            CHEMISTRY – PART 2
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Chromatography, Periodic Trends, Metals, Titration, Industry &amp; Organic
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Full Form 4 notes in plain English — every term defined, every trend explained, with worked
            calculations, complete practical write-ups and labelled apparatus diagrams.
          </p>
        </div>
      </div>

      <TopicNav activeId={active} onNavigate={handleNavigate} />

      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg">
            <h3 className="font-bold text-xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
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
                  <strong className="text-white">Titration:</strong> a burette, pipette and indicator find the
                  exact neutralisation point, which gives an unknown concentration or a pure salt.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Industrial processes:</strong> Haber, Contact and Ostwald all
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
                In the next section, we will learn about <span className="text-blue-600">{nextTopicTitle}</span>.
              </>
            ) : (
              <>
                Next: <span className="text-blue-600">{sections[activeIndex + 1].title}</span>
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
