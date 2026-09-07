import React, { useState, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */

// Simple distillation apparatus
const simpleDistillationSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="white" />
  <text x="250" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Simple Distillation</text>
  <!-- Flask -->
  <ellipse cx="100" cy="280" rx="40" ry="30" fill="none" stroke="#3b82f6" stroke-width="2" />
  <rect x="85" y="250" width="30" height="30" fill="none" stroke="#3b82f6" stroke-width="2" />
  <line x1="100" y1="250" x2="100" y2="230" stroke="#3b82f6" stroke-width="2" />
  <text x="100" y="320" text-anchor="middle" font-size="10" fill="#475569">Flask</text>
  <!-- Solution -->
  <ellipse cx="100" cy="285" rx="30" ry="15" fill="#fef9c3" opacity="0.5" />
  <text x="80" y="290" font-size="9" fill="#ca8a04">Salt water</text>
  <!-- Heat -->
  <path d="M80 310 L70 330 M100 310 L100 330 M120 310 L130 330" stroke="#f59e0b" stroke-width="2" />
  <!-- Still head -->
  <rect x="100" y="220" width="40" height="15" rx="2" fill="#d1d5db" />
  <!-- Thermometer -->
  <rect x="120" y="190" width="6" height="40" fill="#ef4444" />
  <circle cx="123" cy="190" r="10" fill="none" stroke="#ef4444" stroke-width="2" />
  <text x="130" y="195" font-size="9" fill="#ef4444">Thermometer</text>
  <!-- Condenser -->
  <rect x="140" y="220" width="160" height="20" rx="3" fill="#dbeafe" stroke="#3b82f6" stroke-width="1" />
  <rect x="145" y="225" width="150" height="10" rx="2" fill="#e0f2fe" />
  <text x="220" y="210" text-anchor="middle" font-size="9" fill="#2563eb">Condenser</text>
  <!-- Water jacket arrows -->
  <text x="160" y="240" font-size="8" fill="#2563eb">water out</text>
  <text x="280" y="240" font-size="8" fill="#2563eb">water in</text>
  <!-- Collecting flask -->
  <ellipse cx="350" cy="280" rx="30" ry="20" fill="none" stroke="#22c55e" stroke-width="2" />
  <text x="350" y="285" text-anchor="middle" font-size="10" fill="#22c55e">Distillate</text>
  <line x1="300" y1="230" x2="330" y2="275" stroke="#3b82f6" stroke-width="2" />
  <!-- vapour arrow -->
  <path d="M110 230 Q130 215 150 230" fill="none" stroke="#f59e0b" stroke-width="2" marker-end="url(#arrow)" />
  <defs>
    <marker id="arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
    </marker>
  </defs>
</svg>
`;

// Fractional distillation apparatus
const fractionalDistillationSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 400" width="100%" height="100%">
  <rect width="500" height="400" fill="white" />
  <text x="250" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Fractional Distillation</text>
  <!-- Flask -->
  <ellipse cx="100" cy="330" rx="40" ry="30" fill="none" stroke="#3b82f6" stroke-width="2" />
  <rect x="85" y="300" width="30" height="30" fill="none" stroke="#3b82f6" stroke-width="2" />
  <line x1="100" y1="300" x2="100" y2="280" stroke="#3b82f6" stroke-width="2" />
  <!-- Fractionating column -->
  <rect x="100" y="170" width="30" height="110" rx="3" fill="none" stroke="#3b82f6" stroke-width="2" />
  <line x1="100" y1="190" x2="130" y2="190" stroke="#94a3b8" stroke-width="1" />
  <line x1="100" y1="210" x2="130" y2="210" stroke="#94a3b8" stroke-width="1" />
  <line x1="100" y1="230" x2="130" y2="230" stroke="#94a3b8" stroke-width="1" />
  <line x1="100" y1="250" x2="130" y2="250" stroke="#94a3b8" stroke-width="1" />
  <text x="140" y="230" font-size="10" fill="#475569">Fractionating</text>
  <text x="140" y="245" font-size="10" fill="#475569">column</text>
  <!-- Thermometer -->
  <rect x="130" y="140" width="6" height="40" fill="#ef4444" />
  <circle cx="133" cy="140" r="10" fill="none" stroke="#ef4444" stroke-width="2" />
  <!-- Condenser -->
  <rect x="160" y="200" width="160" height="20" rx="3" fill="#dbeafe" stroke="#3b82f6" stroke-width="1" />
  <!-- Collecting flasks -->
  <ellipse cx="370" cy="250" rx="25" ry="18" fill="none" stroke="#22c55e" stroke-width="2" />
  <text x="370" y="255" text-anchor="middle" font-size="9" fill="#22c55e">Ethanol</text>
  <ellipse cx="370" cy="310" rx="25" ry="18" fill="none" stroke="#22c55e" stroke-width="2" />
  <text x="370" y="315" text-anchor="middle" font-size="9" fill="#22c55e">Water</text>
  <!-- Connections -->
  <line x1="130" y1="175" x2="160" y2="210" stroke="#3b82f6" stroke-width="2" />
  <line x1="320" y1="210" x2="350" y2="245" stroke="#3b82f6" stroke-width="2" />
  <line x1="320" y1="210" x2="350" y2="305" stroke="#3b82f6" stroke-width="2" />
  <text x="90" y="360" font-size="10" fill="#475569">Mixture</text>
</svg>
`;

 

 

 

// Electrolysis cell
const electrolysisSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 350" width="100%" height="100%">
  <rect width="500" height="350" fill="white" />
  <text x="250" y="25" text-anchor="middle" font-size="14" font-weight="bold" fill="#1e293b">Electrolysis of Molten Lead Bromide</text>
  <!-- Crucible -->
  <rect x="150" y="150" width="200" height="120" rx="10" fill="#d1d5db" stroke="#6b7280" stroke-width="2" />
  <text x="250" y="230" text-anchor="middle" font-size="12" fill="#374151">Molten PbBr₂</text>
  <!-- Electrodes -->
  <rect x="190" y="60" width="10" height="100" fill="#94a3b8" />
  <text x="180" y="55" font-size="10" fill="#3b82f6">Cathode (-)</text>
  <rect x="300" y="60" width="10" height="100" fill="#94a3b8" />
  <text x="310" y="55" font-size="10" fill="#ef4444">Anode (+)</text>
  <!-- Battery -->
  <rect x="230" y="30" width="40" height="30" rx="3" fill="#f59e0b" />
  <text x="250" y="50" text-anchor="middle" font-size="12" fill="white">DC</text>
  <line x1="195" y1="60" x2="240" y2="45" stroke="#1e293b" stroke-width="2" />
  <line x1="305" y1="60" x2="260" y2="45" stroke="#1e293b" stroke-width="2" />
  <!-- Products -->
  <text x="160" y="300" font-size="11" fill="#3b82f6">Pb (liquid)</text>
  <text x="330" y="300" font-size="11" fill="#ef4444">Br₂ (brown gas)</text>
</svg>
`;

 

const combinedScienceImage = (fileName: string) =>
  `/images/courses/o-level/combined-science/${encodeURIComponent(fileName)}`;

const chemistryPlaceholderImages: Record<string, string> = {
  simple_distillation_step1: 'simple_distillation_step1.png',
  simple_distillation_step2: 'simple_distillation_step2.png',
  simple_distillation_step3: 'simple_distillation_step3.png',
  simple_distillation_step4: 'simple_distillation_step4.png',
  simple_distillation_step5: 'simple_distillation_step5.png',
  simple_distillation_step6: 'simple_distillation_step6.png',
  fractional_distillation_step1: 'fractional_distillation_step1.png',
  fractional_distillation_step2: 'fractional_distillation_step2.png',
  fractional_distillation_step3: 'fractional_distillation_step3.png',
  fractional_distillation_step4: 'fractional_distillation_step4.png',
  fractional_distillation_step5: 'fractional_distillation_step5.png',
  fractional_distillation_step6: 'fractional_distillation_step6.png',
};

const placeholderToImage = (placeholder: string) => {
  const placeholderKey = placeholder.replace(/[{}]/g, '');
  const fileName = chemistryPlaceholderImages[placeholderKey];
  return fileName ? combinedScienceImage(fileName) : undefined;
};

const chemImages = {
  simpleDistillation: svgToDataUri(simpleDistillationSvg),
  fractionalDistillation: svgToDataUri(fractionalDistillationSvg),
  atomStructure: combinedScienceImage('atomstructure.png'),
   periodicTable: combinedScienceImage('periodictablefirst20.png'),
  electronConfigHydrogen: combinedScienceImage('electronconfig_hydrogen.png'),
  electronConfigHelium: combinedScienceImage('electronconfig_helium.png'),
  electronConfigLithium: combinedScienceImage('electronconfig_lithium.png'),
  electronConfigBeryllium: combinedScienceImage('electronconfig_beryllium.png'),
  electronConfigBoron: combinedScienceImage('electronconfig_boron.png'),
  ionicBonding: combinedScienceImage('ionicbonding_nacl.png'),
  covalentBonding: combinedScienceImage('covalentbonding_water.png'),
  electrolysis: svgToDataUri(electrolysisSvg),
  blastFurnace: combinedScienceImage('blastfurnacediagram.png'),
  phScaleChart: combinedScienceImage('phscalechart.png'),
  everydayAcidsBases: combinedScienceImage('everydayacidsbases.png'),
  litmusColorChange: combinedScienceImage('litmuscolorchange.png'),
  acidMetalReaction: combinedScienceImage('acidmetalreaction.png'),
  acidCarbonateReaction: combinedScienceImage('acidcarbonatereaction.png'),
  airLiquefactionDiagram: combinedScienceImage('airliquefactiondiagram.png'),
  haberProcessStep1: combinedScienceImage('haberprocess_step1.png'),
  haberProcessStep2: combinedScienceImage('haberprocess_step2.png'),
  haberProcessStep3: combinedScienceImage('haberprocess_step3.png'),
  haberProcessStep4: combinedScienceImage('haberprocess_step4.png'),
  electroplatingDiagram: combinedScienceImage('electroplatingdiagram.png'),
  oxidationReductionDemo: combinedScienceImage('oxidationreductiondemo.png'),
  cuoHydrogenStep1: combinedScienceImage('cuo_hydrogen_step1.png'),
  cuoHydrogenStep2: combinedScienceImage('cuo_hydrogen_step2.png'),
  cuoHydrogenStep3: combinedScienceImage('cuo_hydrogen_step3.png'),
  rustingDiagram: combinedScienceImage('rustingdiagram.png'),
   rustPreventionMethods: combinedScienceImage('rustpreventionmethods.png'),
  blastFurnaceRawMaterials: combinedScienceImage('blastfurnace_rawmaterials.png'),
  blastFurnaceStep1: combinedScienceImage('blastfurnace_step1.png'),
  blastFurnaceStep2: combinedScienceImage('blastfurnace_step2.png'),
  blastFurnaceStep3: combinedScienceImage('blastfurnace_step3.png'),
  blastFurnaceStep4: combinedScienceImage('blastfurnace_step4.png'),
  blastFurnaceOutput: combinedScienceImage('blastfurnace_output.png'),
  alkaneStructures: combinedScienceImage('alkanestructures.png'),
  alkeneStructures: combinedScienceImage('alkenestructures.png'),
  alkaneVsAlkeneTest: combinedScienceImage('alkanevsalkenetest.png'),
  biogasDigesterDiagram: combinedScienceImage('biogasdigesterdiagram.png'),
};

/* ---------- Content ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const PlaceholderImage: React.FC<{ placeholder: string; alt: string; className?: string }> = ({
  placeholder,
  alt,
  className = 'mt-3 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm',
}) => {
  const imageSrc = placeholderToImage(placeholder);
  if (!imageSrc) return null;

  return (
    <img
      src={imageSrc}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
};

const sections: TopicSection[] = [
  {
    id: 'separation',
    title: 'Separation',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A <strong>mixture</strong> is made up of two or more substances that are physically combined but not chemically joined together, meaning each substance keeps its own properties and can, at least in principle, be separated back out again using a suitable physical method. This is different from a <strong>compound</strong>, where atoms are chemically bonded together and can only be separated by breaking those chemical bonds through a chemical reaction. <strong>Separation techniques</strong> are the physical methods used to split a mixture back into its individual components, and the correct technique to use depends on the properties of the substances involved — such as whether they are solids or liquids, whether they are soluble, and, importantly for distillation, their different <strong>boiling points</strong>.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              <strong>Distillation</strong> is a separation technique that relies specifically on differences in boiling point. A liquid mixture is heated until the substance with the lowest boiling point turns to vapour and rises off; that vapour is then cooled back down until it condenses into a liquid again, which is collected separately from the original mixture. There are two main types, used in different situations depending on how many substances need to be separated and how different their boiling points are.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              <strong>Simple distillation</strong> is used to separate a pure liquid (the <strong>solvent</strong>) from a solution, where the other component (the <strong>solute</strong>) does not evaporate at the solvent's boiling point — for example, separating pure water from salt water, since salt has a far higher boiling point than water and stays behind as the water evaporates. <strong>Fractional distillation</strong>, by contrast, is used to separate two or more liquids that are <strong>miscible</strong> (able to mix completely with one another) but that each have their own different boiling point — for example, separating ethanol from water in a fermented mixture. Because the boiling points of miscible liquids can be quite close together, fractional distillation uses an additional piece of apparatus, the <strong>fractionating column</strong>, to achieve a much more effective separation than simple distillation could manage alone.
            </p>
          </div>

          <div className="p-4 bg-sky-50/50 rounded-xl border-2 border-sky-200 shadow-sm">
            <h4 className="font-bold text-sky-700 text-lg mb-1">Experiment: Simple Distillation of Salt Water</h4>
            <p className="text-sm text-slate-700 mb-3"><strong>Aim:</strong> To obtain pure water from a salt water solution.</p>
            <p className="text-sm text-slate-700 mb-3"><strong>Materials:</strong> Round-bottomed flask, salt water solution, Bunsen burner or heating mantle, stand and clamp, thermometer, condenser, delivery tube, collecting flask, rubber tubing (for water flow), anti-bumping granules.</p>
            <p className="text-sm font-semibold text-slate-800 mb-2">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">Pour the salt water solution into the round-bottomed flask, along with a few anti-bumping granules to ensure smooth, even boiling rather than violent bubbling.</p>
                <PlaceholderImage placeholder="{simple_distillation_step1}" alt="Pouring salt water solution into round-bottomed flask" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">Fit the flask with a thermometer positioned so its bulb sits level with the side-arm opening, and connect the side arm to a condenser set at a slight downward angle.</p>
                <PlaceholderImage placeholder="{simple_distillation_step2}" alt="Setting up flask with thermometer and condenser" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 3</p>
                <p className="text-sm text-slate-700">Connect the condenser's water jacket so that cold water flows in at the bottom (lower) end and out at the top (upper) end — this "counter-current" flow keeps the condenser consistently cool along its whole length.</p>
                <PlaceholderImage placeholder="{simple_distillation_step3}" alt="Connecting condenser water jacket with counter-current flow" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 4</p>
                <p className="text-sm text-slate-700">Place a clean, dry collecting flask at the far end of the condenser, and gently heat the salt water solution using a Bunsen burner or heating mantle.</p>
                <PlaceholderImage placeholder="{simple_distillation_step4}" alt="Heating salt water solution with collecting flask in place" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 5</p>
                <p className="text-sm text-slate-700">Watch the thermometer as the solution heats up. Water vapour rises up the flask, passes through the condenser where it cools and condenses back into a liquid, and drips into the collecting flask as the distillate.</p>
                <PlaceholderImage placeholder="{simple_distillation_step5}" alt="Water vapour condensing and dripping into collecting flask" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-sky-600 mb-1">Step 6</p>
                <p className="text-sm text-slate-700">Continue heating until most of the water has distilled over, then stop heating before the flask boils dry. Salt remains behind in the original flask as a solid residue.</p>
                <PlaceholderImage placeholder="{simple_distillation_step6}" alt="Salt residue remaining in original flask after distillation" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3"><strong>Observations:</strong> The thermometer reading stays steady at the boiling point of water while distillate is collecting steadily. Salt, having a much higher boiling point than water, does not evaporate and is left behind as a solid residue in the original flask.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Results:</strong> A clear, colourless liquid (pure water) collects in the collecting flask, while a white solid residue (salt) remains in the original flask.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Conclusion:</strong> Simple distillation successfully separates a pure solvent (water) from a dissolved solute (salt), since only the solvent evaporates and is later condensed and collected, while the solute is left behind.</p>
            <p className="text-sm text-slate-700 mt-3"><strong>Note:</strong> The boiling point of water is affected by atmospheric pressure, which changes with altitude. At sea level, water boils at exactly 100°C, but at higher altitudes — such as much of Zimbabwe, which sits at a considerable elevation — atmospheric pressure is lower, so water boils at a slightly lower temperature, around 96°C.</p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Fractional Distillation</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Fractional distillation</strong> is used to separate a mixture of two or more <strong>miscible liquids</strong> — liquids that dissolve completely in one another — based on their different boiling points. It works on the same basic principle as simple distillation (heating, evaporating, then condensing), but adds a <strong>fractionating column</strong> between the flask and the condenser. This column is usually packed with glass beads or fitted with small trays, which give the rising vapour a large surface area to repeatedly condense and re-evaporate against as it climbs the column. Each time this happens, the vapour that continues rising becomes slightly richer in the liquid with the <strong>lower</strong> boiling point, while liquid with a higher boiling point condenses and trickles back down. By the time the vapour reaches the top of the column, it is almost entirely made up of the more volatile (lower boiling point) liquid, giving a far more effective separation than simple distillation could achieve for liquids with similar boiling points.
            </p>
          </div>

          <div className="p-4 bg-teal-50/50 rounded-xl border-2 border-teal-200 shadow-sm">
            <h4 className="font-bold text-teal-700 text-lg mb-1">Experiment: Fractional Distillation of an Ethanol–Water Mixture</h4>
            <p className="text-sm text-slate-700 mb-3"><strong>Aim:</strong> To separate ethanol (boiling point 78°C) from a mixture of ethanol and water (boiling point 100°C).</p>
            <p className="text-sm text-slate-700 mb-3"><strong>Materials:</strong> Round-bottomed flask, ethanol–water mixture, fractionating column, thermometer, condenser, delivery tube, two collecting flasks, Bunsen burner or heating mantle, stand and clamp, anti-bumping granules.</p>
            <p className="text-sm font-semibold text-slate-800 mb-2">Method:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">Pour the ethanol–water mixture into the round-bottomed flask along with a few anti-bumping granules, then fit the fractionating column upright into the neck of the flask.</p>
                <PlaceholderImage placeholder="{fractional_distillation_step1}" alt="Ethanol-water mixture in flask with fractionating column fitted" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">Fit a thermometer at the top of the fractionating column, positioned so its bulb sits level with the side-arm opening leading to the condenser.</p>
                <PlaceholderImage placeholder="{fractional_distillation_step2}" alt="Thermometer fitted at top of fractionating column" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 3</p>
                <p className="text-sm text-slate-700">Connect the side arm to a condenser with counter-current water flow, and place the first collecting flask ready to catch the distillate.</p>
                <PlaceholderImage placeholder="{fractional_distillation_step3}" alt="Condenser connected with first collecting flask in place" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 4</p>
                <p className="text-sm text-slate-700">Gently heat the flask. As the mixture warms, vapour of both liquids rises into the column, where the higher-boiling water vapour condenses and trickles back down, while ethanol vapour continues rising.</p>
                <PlaceholderImage placeholder="{fractional_distillation_step4}" alt="Heating flask with vapour rising through fractionating column" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 5</p>
                <p className="text-sm text-slate-700">Watch the thermometer closely. Once it steadies at around 78°C, ethanol vapour is passing over consistently; collect this fraction in the first collecting flask.</p>
                <PlaceholderImage placeholder="{fractional_distillation_step5}" alt="Thermometer reading steady at 78 degrees during ethanol collection" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-teal-600 mb-1">Step 6</p>
                <p className="text-sm text-slate-700">Once the thermometer reading rises again and approaches 100°C, swap in a second collecting flask to collect the water fraction separately, then stop heating once distillation is complete.</p>
                <PlaceholderImage placeholder="{fractional_distillation_step6}" alt="Swapping to second collecting flask as temperature rises toward 100 degrees" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mt-3"><strong>Observations:</strong> The thermometer reading remains steady at around 78°C while ethanol is distilling over, then rises toward 100°C once the ethanol has been used up and water begins to vaporise and pass over instead.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Results:</strong> Two separate liquid fractions are collected — a lower-boiling fraction (mostly ethanol) collected first, and a higher-boiling fraction (mostly water) collected afterward.</p>
            <p className="text-sm text-slate-700 mt-2"><strong>Conclusion:</strong> Fractional distillation successfully separates miscible liquids with different boiling points, since the substance with the lower boiling point evaporates and is collected first, while the substance with the higher boiling point is left to evaporate and collect afterward.</p>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-base font-bold text-slate-800 mb-1">Real-world uses of fractional distillation</p>
            <p className="text-sm text-slate-700">
              Fractional distillation is widely used industrially wherever a mixture of liquids (or liquefied gases) with different boiling points needs to be separated into its individual components. It is used to separate <strong>oxygen and nitrogen from liquefied air</strong> (each gas is cooled until it liquefies, then the liquid air is fractionally distilled, with nitrogen boiling off first at –196°C, followed by oxygen at –183°C), to separate <strong>crude oil into its different petroleum fractions</strong> (such as petrol, kerosene, diesel, and bitumen, each with a different range of boiling points), and to purify <strong>alcoholic drinks</strong> by concentrating the ethanol produced during fermentation.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Separation Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Simple distillation – one volatile liquid</li>
              <li>Fractional distillation – two+ liquids, different boiling points</li>
              <li>Distillate – collected liquid</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'matter',
    title: 'Matter (Atoms, Isotopes)',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              All <strong>matter</strong> — anything that has mass and takes up space — is made up of tiny particles called <strong>atoms</strong>. An atom is the smallest part of an element that still retains the chemical properties of that element; splitting an atom further, into its sub-atomic particles, no longer leaves you with something recognisable as that element. Every atom is built from the same three types of <strong>sub-atomic particles</strong>: protons, neutrons, and electrons, and it is only the number of each present in a particular atom that determines which element it is and how it behaves chemically.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              Structurally, an atom has two main regions. At its centre is a tiny, extremely dense <strong>nucleus</strong>, made up of protons and neutrons packed tightly together, which contains almost all of the atom's mass despite taking up only a very small fraction of its total volume. Surrounding the nucleus, occupying most of the atom's actual size, are <strong>electrons</strong>, arranged in defined regions called <strong>shells</strong> (or energy levels) at increasing distances from the nucleus. It is the arrangement of these outer electrons in particular that governs how an atom bonds and reacts with other atoms.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Sub‑atomic Particles</h4>
            <img src={chemImages.atomStructure} alt="Labelled diagram of atomic structure showing nucleus and electron shells" loading="lazy" decoding="async" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-sm text-slate-700 mt-3 mb-2">
              Each of the three sub-atomic particles has a distinct charge, mass, and position within the atom, summarised below. Protons and neutrons contribute virtually all of an atom's mass, since electrons are so much lighter that their mass is usually considered negligible in calculations.
            </p>
            <table className="w-full text-sm text-slate-700 border-collapse mt-2">
              <thead className="bg-blue-50">
                <tr><th className="border p-2">Particle</th><th className="border p-2">Charge</th><th className="border p-2">Mass</th><th className="border p-2">Position</th></tr>
              </thead>
              <tbody>
                <tr><td className="border p-2">Proton</td><td className="border p-2">+1</td><td className="border p-2">1</td><td className="border p-2">Nucleus</td></tr>
                <tr><td className="border p-2">Neutron</td><td className="border p-2">0</td><td className="border p-2">1</td><td className="border p-2">Nucleus</td></tr>
                <tr><td className="border p-2">Electron</td><td className="border p-2">-1</td><td className="border p-2">1/1840</td><td className="border p-2">Shells</td></tr>
              </tbody>
            </table>
          </div>

           <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Nuclide Notation and Isotopes</h4>
            <p className="text-sm text-slate-700 mb-3">
              Every atom can be described using two key numbers that identify exactly what it is and how many of each sub-atomic particle it contains. The <strong>proton number</strong> (also called the <strong>atomic number</strong>, symbol <strong>Z</strong>) is the number of protons found in the nucleus of an atom. This number is unique to each element — every atom of a given element has exactly the same number of protons, and it is this number that determines which element the atom is (for example, every atom with exactly 17 protons is chlorine, regardless of anything else about it). In a neutral atom (one with no overall electrical charge), the number of electrons orbiting the nucleus always equals the number of protons, since the positive charge of the protons must be balanced by an equal negative charge from the electrons.
            </p>
            <p className="text-sm text-slate-700 mb-3">
              The <strong>mass number</strong> (symbol <strong>A</strong>) is the total number of protons <em>and</em> neutrons combined in the nucleus of an atom. Since protons and neutrons each have essentially the same mass, and electrons contribute a negligible amount, the mass number gives a good approximation of the atom's overall mass. This gives a simple relationship for working out how many neutrons a particular atom has: <strong>number of neutrons = mass number (A) − proton number (Z)</strong>. These two numbers are conventionally written together as <strong>nuclide notation</strong>, with the mass number written above and to the left of the element's symbol, and the proton number written below and to the left — for example, chlorine-35 is written with a mass number of 35 and a proton number of 17.
            </p>
            <p className="text-base font-bold text-slate-800 mb-1">Isotopes</p>
            <p className="text-sm text-slate-700 mb-3">
              Although every atom of a given element must have the same number of protons, the number of <strong>neutrons</strong> in the nucleus can actually vary between atoms of the same element. Atoms of the same element that have the <strong>same proton number but a different mass number</strong> (because they contain a different number of neutrons) are called <strong>isotopes</strong> of that element. Because isotopes have the same number of protons and electrons, they have identical chemical properties and react in exactly the same way — chemistry is governed by electron arrangement, not by the number of neutrons. However, because their mass numbers differ, isotopes can have slightly different physical properties, most notably differing in mass, and some isotopes are unstable and radioactive while others of the same element are not.
            </p>
            <p className="text-sm text-slate-700 mb-2">
              Two common examples of elements with well-known isotopes are carbon and chlorine:
            </p>
            <table className="w-full text-sm text-slate-700 border-collapse">
              <thead className="bg-blue-50">
                <tr>
                  <th className="border p-2 text-left">Isotope</th>
                  <th className="border p-2 text-left">Proton number (Z)</th>
                  <th className="border p-2 text-left">Mass number (A)</th>
                  <th className="border p-2 text-left">Number of neutrons (A − Z)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2 font-semibold">Carbon-12 (¹²C)</td>
                  <td className="border p-2">6</td>
                  <td className="border p-2">12</td>
                  <td className="border p-2">6</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Carbon-14 (¹⁴C)</td>
                  <td className="border p-2">6</td>
                  <td className="border p-2">14</td>
                  <td className="border p-2">8</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Chlorine-35 (³⁵Cl)</td>
                  <td className="border p-2">17</td>
                  <td className="border p-2">35</td>
                  <td className="border p-2">18</td>
                </tr>
                <tr>
                  <td className="border p-2 font-semibold">Chlorine-37 (³⁷Cl)</td>
                  <td className="border p-2">17</td>
                  <td className="border p-2">37</td>
                  <td className="border p-2">20</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-slate-700 mt-3">
              Note that both carbon-12 and carbon-14 have 6 protons (confirming both are definitely carbon), but carbon-14 has two additional neutrons, giving it a greater mass number. Similarly, both isotopes of chlorine have 17 protons, but differ in neutron number — this is in fact why the relative atomic mass of chlorine found on the periodic table (35.5) is not a whole number: it reflects the weighted average of naturally occurring chlorine-35 and chlorine-37 atoms, found in a roughly 3:1 ratio in nature.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Atom Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Protons (+) and neutrons (0) in nucleus</li>
              <li>Electrons (–) in shells</li>
              <li>Isotopes – same protons, different neutrons</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'periodic-table',
    title: 'Periodic Table and Electronic Configuration',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              The <strong>Periodic Table</strong> is a chart that organises all known chemical elements in a single, systematic layout. Elements are arranged in order of increasing <strong>proton number</strong> (atomic number), starting from hydrogen (proton number 1) in the top-left corner and increasing steadily as you move across and down the table. This arrangement is not arbitrary — it was designed so that elements with similar chemical properties line up in the same vertical columns, making the table an extremely useful tool for predicting how an element will behave, even before testing it experimentally.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              The table is organised into <strong>periods</strong> and <strong>groups</strong>. A <strong>period</strong> is a horizontal row of the table; moving from left to right across a period, proton number increases by one at each step, and elements gradually change in character from metallic on the left to non-metallic on the right. A <strong>group</strong> is a vertical column; elements within the same group share the same number of electrons in their outermost shell, which is the main reason they display similar chemical properties and react in similar ways. For example, all Group 1 elements have just one electron in their outer shell, making them all highly reactive metals that behave in a strikingly similar way to one another.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-blue-700">Periodic Table Overview</h4>
            <img src={chemImages.periodicTable} alt="Labelled periodic table showing groups and periods for the first 20 elements" loading="lazy" decoding="async" className="mt-2 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-sm text-slate-700 mt-3 mb-2">
              For O-Level Combined Science, it's important to be familiar with the first 20 elements in particular, since these appear most frequently in questions on structure, bonding, and reactivity.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 mt-2 space-y-1">
              <li><strong>Groups:</strong> Numbered 1, 2, then 13–18 in the modern system (older systems sometimes number them 1–8); Group 1 elements are called the <strong>alkali metals</strong>, and Group 18 (the final column) are the <strong>noble gases</strong>, with Group 17 known as the <strong>halogens</strong>.</li>
              <li><strong>Periods:</strong> Numbered 1–7; period number also tells you how many electron shells a neutral atom of that element has (for the first 20 elements at least).</li>
              <li><strong>First 20 elements, in order:</strong> H, He, Li, Be, B, C, N, O, F, Ne, Na, Mg, Al, Si, P, S, Cl, Ar, K, Ca.</li>
            </ul>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Electronic Configuration</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Electronic configuration</strong> is simply a way of describing how the electrons in an atom are arranged into shells around the nucleus. It might sound complicated, but the underlying idea is straightforward: electrons don't just float around the nucleus randomly — they fill up defined "energy levels" (shells) one at a time, starting with the shell closest to the nucleus, and only moving on to the next shell once the current one is full.
            </p>
            <p className="text-sm text-slate-700 mb-3">
              Think of shells a bit like rows of seats in a small theatre, arranged in circles around a stage (the nucleus). The front row (closest to the nucleus) has the fewest seats and fills up first; only once it's full do people start sitting in the next row back, and so on. For the first 20 elements of the periodic table, the rule for how many "seats" (electrons) each shell can hold is:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li><strong>1st shell (closest to nucleus):</strong> holds a maximum of <strong>2</strong> electrons.</li>
              <li><strong>2nd shell:</strong> holds a maximum of <strong>8</strong> electrons.</li>
              <li><strong>3rd shell:</strong> holds a maximum of <strong>8</strong> electrons (for these first 20 elements).</li>
            </ul>
            <p className="text-sm text-slate-700 mb-3">
              To write out an atom's electronic configuration, you simply count how many electrons it has (remember, in a neutral atom this equals the proton number) and fill the shells in order, writing the number in each shell separated by dots or commas. For example, sodium (Na) has 11 electrons in total: the first 2 go into the 1st shell (now full), the next 8 go into the 2nd shell (now full), leaving 1 electron left over for the 3rd shell — so sodium's electronic configuration is written <strong>2.8.1</strong>. Chlorine (Cl) has 17 electrons: 2 in the first shell, 8 in the second shell, and the remaining 7 in the third shell, giving <strong>2.8.7</strong>.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Working through the first five elements</p>
            <p className="text-sm text-slate-700 mb-3">
              The best way to get comfortable with this is to work through the first few elements one at a time and see the pattern build up.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 mb-4">
              <div className="rounded-lg border border-slate-200 p-3 bg-white">
                <p className="text-sm font-bold text-slate-800 mb-1">Hydrogen (H) — 1 electron</p>
                <img src={chemImages.electronConfigHydrogen} alt="Electron shell diagram of hydrogen with 1 electron in the first shell" loading="lazy" decoding="async" className="w-full rounded-lg border border-slate-200 bg-white object-contain" />
                <p className="text-sm text-slate-700 mt-2">Hydrogen has just 1 electron, which goes straight into the 1st shell. Configuration: <strong>1</strong>. Since the 1st shell can hold up to 2, this shell is not yet full.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-white">
                <p className="text-sm font-bold text-slate-800 mb-1">Helium (He) — 2 electrons</p>
                <img src={chemImages.electronConfigHelium} alt="Electron shell diagram of helium with 2 electrons filling the first shell" loading="lazy" decoding="async" className="w-full rounded-lg border border-slate-200 bg-white object-contain" />
                <p className="text-sm text-slate-700 mt-2">Helium has 2 electrons, both fitting into the 1st shell. Configuration: <strong>2</strong>. This completely fills the 1st shell, which is why helium is a stable, unreactive noble gas.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-white">
                <p className="text-sm font-bold text-slate-800 mb-1">Lithium (Li) — 3 electrons</p>
                <img src={chemImages.electronConfigLithium} alt="Electron shell diagram of lithium with 2 electrons in the first shell and 1 in the second shell" loading="lazy" decoding="async" className="w-full rounded-lg border border-slate-200 bg-white object-contain" />
                <p className="text-sm text-slate-700 mt-2">Lithium has 3 electrons. The 1st shell fills first, taking 2, leaving 1 electron that must go into the 2nd shell. Configuration: <strong>2.1</strong>. Having just 1 electron in its outer shell is exactly what makes lithium a reactive Group 1 metal, similar to sodium.</p>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 bg-white">
                <p className="text-sm font-bold text-slate-800 mb-1">Beryllium (Be) — 4 electrons</p>
                <img src={chemImages.electronConfigBeryllium} alt="Electron shell diagram of beryllium with 2 electrons in the first shell and 2 in the second shell" loading="lazy" decoding="async" className="w-full rounded-lg border border-slate-200 bg-white object-contain" />
                <p className="text-sm text-slate-700 mt-2">Beryllium has 4 electrons: 2 fill the 1st shell, and the remaining 2 go into the 2nd shell. Configuration: <strong>2.2</strong>.</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 bg-white mb-4 sm:w-1/2">
              <p className="text-sm font-bold text-slate-800 mb-1">Boron (B) — 5 electrons</p>
              <img src={chemImages.electronConfigBoron} alt="Electron shell diagram of boron with 2 electrons in the first shell and 3 in the second shell" loading="lazy" decoding="async" className="w-full rounded-lg border border-slate-200 bg-white object-contain" />
              <p className="text-sm text-slate-700 mt-2">Boron has 5 electrons: 2 fill the 1st shell, and 3 go into the 2nd shell. Configuration: <strong>2.3</strong>. Notice the pattern so far — the 1st shell fills with the first 2 electrons of any element, and everything after that spills into the 2nd shell until it too reaches its maximum of 8.</p>
            </div>

            <p className="text-base font-bold text-slate-800 mb-1">Why the outer shell matters most</p>
            <p className="text-sm text-slate-700 mb-3">
              The electrons in an atom's <strong>outermost shell</strong> (sometimes called the valence shell) are the ones involved in chemical bonding and reactions, since they are the electrons furthest from the nucleus and therefore the easiest for the atom to lose, gain, or share when interacting with another atom. This is why elements in the same group of the periodic table — which all have the same number of outer-shell electrons — behave so similarly to one another chemically, even though they may have very different numbers of electrons overall.
            </p>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Noble gases</strong> (Group 18, the final column of the periodic table) are the exception that proves the rule: they have a completely full outer shell (8 electrons, or just 2 in the case of helium), and a full outer shell is an especially stable arrangement. Because their outer shell is already full, noble gases have no tendency to lose, gain, or share electrons with other atoms, which is exactly why they are so chemically unreactive.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Valency</p>
            <p className="text-sm text-slate-700">
              <strong>Valency</strong> is the number of electrons an atom needs to lose, gain, or share in order to achieve a full outer shell (the same stable arrangement as the nearest noble gas). It's a useful number because it directly tells you how an element is likely to bond. <strong>Group 1</strong> metals (like sodium and lithium) have just 1 electron in their outer shell, so they achieve a full shell most easily by <strong>losing</strong> that 1 electron — giving them a valency of 1. <strong>Group 17</strong> halogens (like chlorine) have 7 electrons in their outer shell, just 1 short of being full, so they achieve a full shell by <strong>gaining</strong> 1 electron — also giving them a valency of 1, even though they reach it by the opposite process.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Periodic Table Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Groups – vertical, similar properties</li>
              <li>Periods – horizontal, increasing Z</li>
              <li>Outer electrons → reactivity</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'bonding',
    title: 'Chemical Bonding',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
           <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Atoms rarely exist alone in nature — most substances around us are made up of atoms joined together into larger structures, held together by <strong>chemical bonds</strong>. A chemical bond is essentially an attractive force that holds two or more atoms together, and it forms because atoms "want" to reach a more stable arrangement of electrons, usually one where their outer shell is full (matching the electron arrangement of the nearest noble gas). Since different elements are different distances away from having a full outer shell, they achieve this stability in different ways, giving rise to two main types of bonding.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              <strong>Ionic bonding</strong> happens between a metal and a non-metal, and involves one atom fully <strong>transferring</strong> electrons to another. <strong>Covalent bonding</strong> happens between two non-metals, and involves atoms <strong>sharing</strong> electrons rather than giving them away completely. The type of bonding a compound has largely determines its physical properties — such as its melting point and whether it conducts electricity — so recognising which type of bonding is present is a useful first step in predicting how a substance will behave.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Ionic Bonding</h4>
            <p className="text-sm text-slate-700 mb-3">
              In <strong>ionic bonding</strong>, one atom (a metal) gives away one or more electrons completely to another atom (a non-metal). This happens because metals typically have very few electrons in their outer shell (making it easier to lose them and reveal an already-full shell underneath), while non-metals typically have almost-full outer shells (making it easier to gain the few extra electrons needed to complete them). Once the transfer happens, both atoms become <strong>ions</strong> — electrically charged particles. The metal atom, having lost negatively charged electrons, becomes a positively charged ion (a <strong>cation</strong>), while the non-metal atom, having gained electrons, becomes a negatively charged ion (an <strong>anion</strong>). Since opposite charges attract, a strong electrostatic force of attraction — the ionic bond — holds the resulting positive and negative ions together.
            </p>
            <img src={chemImages.ionicBonding} alt="Diagram of ionic bonding between sodium and chlorine to form sodium chloride" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-sm text-slate-700 mb-3">
              A classic example is the formation of <strong>sodium chloride (NaCl)</strong>, common table salt. Sodium (electronic configuration 2.8.1) has just 1 electron in its outer shell, so it readily loses that single electron to become a stable Na⁺ ion (matching the electron arrangement of neon). Chlorine (electronic configuration 2.8.7) has 7 electrons in its outer shell, just 1 short of full, so it readily gains the electron that sodium gives up, becoming a stable Cl⁻ ion (also matching the electron arrangement of a noble gas, argon). The overall reaction can be summarised as: Na → Na⁺ + e⁻, and Cl + e⁻ → Cl⁻, combining to give <strong>Na⁺ + Cl⁻ → NaCl</strong>.
            </p>
            <p className="text-sm font-semibold text-slate-800 mb-1">Properties of ionic compounds</p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li><strong>High melting and boiling points:</strong> The electrostatic forces of attraction between oppositely charged ions are strong and extend throughout the whole structure (forming a giant ionic lattice), so a great deal of energy is needed to break these forces apart and melt the compound.</li>
              <li><strong>Conduct electricity only when molten or dissolved:</strong> In a solid ionic compound, the ions are locked tightly in place within the lattice and cannot move, so no current can flow. Once melted or dissolved in water, however, the ions become free to move and carry electrical charge, allowing the substance to conduct electricity.</li>
              <li><strong>Often soluble in water:</strong> Water molecules are able to surround and separate the individual ions in the lattice, pulling the compound apart and allowing it to dissolve.</li>
            </ul>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Covalent Bonding</h4>
            <p className="text-sm text-slate-700 mb-3">
              In <strong>covalent bonding</strong>, atoms achieve a full outer shell not by giving electrons away entirely, but by <strong>sharing</strong> one or more pairs of electrons with another atom. This type of bonding occurs between two non-metal atoms, since neither atom involved has a strong enough pull to fully remove electrons from the other — instead, both atoms are held together by their mutual attraction to the shared pair of electrons sitting between their nuclei. Each shared pair of electrons forms one covalent bond, and atoms can share more than one pair to form double or even triple bonds if needed.
            </p>
            <img src={chemImages.covalentBonding} alt="Diagram of covalent bonding in a water molecule showing shared electron pairs" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-sm text-slate-700 mb-3">
              A simple example is <strong>water (H₂O)</strong>. Oxygen has 6 electrons in its outer shell and needs 2 more to complete it; each hydrogen atom has just 1 electron and needs 1 more to complete its own (much smaller) outer shell. Oxygen shares one electron pair with each of the two hydrogen atoms — one electron from oxygen and one from each hydrogen forming each shared pair — so that oxygen effectively "sees" a full outer shell of 8, and each hydrogen "sees" a full outer shell of 2, all without any electrons actually being transferred away permanently. Other common covalent molecules include carbon dioxide (CO₂) and methane (CH₄), each built the same way, through atoms sharing electron pairs to complete their outer shells.
            </p>
            <p className="text-sm font-semibold text-slate-800 mb-1">Properties of covalent compounds</p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li><strong>Low melting and boiling points:</strong> Covalent compounds usually exist as separate, individual molecules, and while the covalent bonds within each molecule are strong, the forces of attraction <em>between</em> separate molecules are comparatively weak, so relatively little energy is needed to separate the molecules from each other during melting or boiling.</li>
              <li><strong>Do not conduct electricity:</strong> Since covalent compounds are made of neutral molecules rather than charged ions, there are no free-moving charged particles available to carry an electric current, whether solid, liquid, or dissolved.</li>
              <li><strong>Often gases, liquids, or soft solids at room temperature:</strong> A direct consequence of the weak forces between molecules, which require little energy to overcome.</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Bonding Comparison</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Ionic – transfer, salts</li>
              <li>Covalent – sharing, molecules</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'stoichiometry',
    title: 'Stoichiometry and Mole Concept',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Atoms and molecules are far too small and numerous to count individually — a single drop of water already contains billions upon billions of molecules. Chemists needed a convenient way to count out huge numbers of particles in a practical, usable unit, similar to how we might buy eggs by the "dozen" rather than counting them one by one. That unit is the <strong>mole</strong> (abbreviated <strong>mol</strong>), and the field of chemistry that deals with these quantity relationships — working out how much of one substance reacts with, or is produced from, another — is called <strong>stoichiometry</strong>.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              Formally, <strong>one mole</strong> of any substance is defined as the amount that contains the same number of particles as there are atoms in exactly 12 grams of the carbon-12 isotope. That number turns out to be a huge constant, known as the <strong>Avogadro constant</strong>: <strong>6.02 × 10²³</strong> particles per mole. It doesn't matter what the particles are — atoms, molecules, or ions — one mole of anything always contains this same enormous number of particles. Just like "a dozen" always means 12, whether it's a dozen eggs or a dozen pencils, "a mole" always means 6.02 × 10²³ particles, whether it's a mole of atoms or a mole of molecules.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Mole Calculations</h4>
            <p className="text-sm text-slate-700 mb-3">
              Since we can't easily count out 6.02 × 10²³ particles directly, we instead measure out substances by <strong>mass</strong> (using a balance) and use a simple relationship to work out how many moles that mass represents. This relationship relies on the <strong>molar mass</strong> (symbol <strong>Mr</strong>, sometimes called relative molecular mass or relative formula mass) — the mass, in grams, of one mole of a substance. Molar mass is calculated simply by adding up the relative atomic masses of every atom present in the substance's formula, which can be looked up from the periodic table.
            </p>
            <p className="text-sm text-slate-700 mb-2">
              For example, to find the molar mass of sodium chloride (NaCl): sodium has a relative atomic mass of 23, and chlorine has a relative atomic mass of 35.5, so Mr(NaCl) = 23 + 35.5 = <strong>58.5</strong>. This means that 58.5 grams of sodium chloride contains exactly one mole (6.02 × 10²³ "formula units") of NaCl.
            </p>
            <p className="text-sm text-slate-700 mb-2">
              Once you know the molar mass, you can convert between the mass of a sample and the number of moles it contains using this key formula:
            </p>
            <p className="text-sm text-slate-700 font-semibold mb-3">Number of moles (n) = mass of substance (g) ÷ molar mass (Mr)</p>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Worked example:</strong> How many moles are there in 10 g of ammonia (NH₃)?
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-2">
              <li>First, find the molar mass of NH₃: N = 14, H = 1 (×3) → Mr = 14 + (1×3) = 17.</li>
              <li>Then apply the formula: n = mass ÷ Mr = 10 ÷ 17 ≈ <strong>0.59 mol</strong>.</li>
            </ul>
            <p className="text-sm text-slate-700">
              This formula also works in reverse — if you know how many moles you need and the molar mass, you can rearrange it to find the mass required: <strong>mass (g) = moles (n) × molar mass (Mr)</strong>.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Empirical Formula</h4>
            <p className="text-sm text-slate-700 mb-3">
              An <strong>empirical formula</strong> shows the simplest whole-number ratio of atoms of each element present in a compound — it doesn't necessarily show the exact number of atoms in one molecule (that's called the <strong>molecular formula</strong>), just the smallest ratio they reduce to. For example, glucose has the molecular formula C₆H₁₂O₆, but its empirical formula is the simpler ratio CH₂O.
            </p>
            <p className="text-sm text-slate-700 mb-2">
              Empirical formulas are worked out from experimental data — usually the percentage by mass of each element present in a compound — using a step-by-step method:
            </p>
            <ol className="list-decimal list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li>Assume you have 100 g of the compound, so each given percentage becomes a mass in grams.</li>
              <li>Convert each element's mass into moles by dividing by its relative atomic mass.</li>
              <li>Divide every mole value by the <strong>smallest</strong> mole value calculated, to find the simplest ratio.</li>
              <li>If necessary, multiply all the ratios by a small whole number to remove any fractions, giving whole-number ratios.</li>
            </ol>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Worked example:</strong> A compound is found to contain 43.4% sodium (Na), 11.3% carbon (C), and 45.3% oxygen (O) by mass. Find its empirical formula.
            </p>
            <div className="mt-2 p-3 bg-blue-50 rounded text-sm text-slate-700 space-y-1">
              <p>Step 1–2 (moles of each element, using 100 g sample): Na: 43.4 ÷ 23 = 1.89 mol; C: 11.3 ÷ 12 = 0.942 mol; O: 45.3 ÷ 16 = 2.83 mol.</p>
              <p>Step 3 (divide by smallest, 0.942): Na: 1.89 ÷ 0.942 = 2.0; C: 0.942 ÷ 0.942 = 1.0; O: 2.83 ÷ 0.942 = 3.0.</p>
              <p>Step 4: Ratio is already whole numbers — Na : C : O = 2 : 1 : 3.</p>
              <p><strong>Empirical formula: Na₂CO₃</strong> (sodium carbonate).</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Concentration</h4>
            <p className="text-sm text-slate-700 mb-3">
              Many chemical reactions, especially in titrations and other experiments, happen in <strong>solution</strong> rather than between pure solids. For these, it's important to know not just how many moles of a substance are present, but how <strong>concentrated</strong> the solution is — that is, how many moles are dissolved in a given volume of liquid. <strong>Concentration</strong> is measured in moles per cubic decimetre (<strong>mol/dm³</strong>), where one cubic decimetre (dm³) is the same volume as one litre (1000 cm³).
            </p>
            <p className="text-sm text-slate-700 font-semibold mb-3">Concentration (mol/dm³) = number of moles (mol) ÷ volume (dm³)</p>
            <p className="text-sm text-slate-700 mb-2">
              This formula is also often rearranged to find the number of moles present in a known volume of a solution of known concentration: <strong>moles = concentration × volume (in dm³)</strong>. Since volumes measured in the lab are often given in cm³ rather than dm³, remember to convert first by dividing by 1000 (since 1000 cm³ = 1 dm³).
            </p>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Worked example:</strong> How many moles of NaOH are present in 25 cm³ of a 0.1 mol/dm³ sodium hydroxide solution?
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li>Convert volume to dm³: 25 cm³ ÷ 1000 = 0.025 dm³.</li>
              <li>Apply the formula: moles = concentration × volume = 0.1 × 0.025 = <strong>0.0025 mol</strong>.</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Mole Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>1 mole = 6.02 × 10²³ particles (Avogadro constant)</li>
              <li>n = mass ÷ Mr</li>
              <li>Empirical formula – simplest whole-number ratio</li>
              <li>Concentration (mol/dm³) = moles ÷ volume (dm³)</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'acids-bases-salts',
    title: 'Acids, Bases and Salts',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Acids</strong> and <strong>bases</strong> are two of the most important classes of chemical substances, and understanding how they behave and react with one another underlies a huge range of both everyday chemistry (like baking and cleaning) and industrial processes. An <strong>acid</strong> is a substance that releases <strong>hydrogen ions (H⁺)</strong> when dissolved in water — it is this excess of H⁺ ions in solution that gives acids their characteristic sour taste, ability to react with metals, and effect on indicators. A <strong>base</strong> is, broadly, any substance that can neutralise (react with and cancel out) an acid; a base that is soluble in water is more specifically called an <strong>alkali</strong>, and alkalis release <strong>hydroxide ions (OH⁻)</strong> when dissolved in water.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              When an acid and a base react together, the H⁺ ions from the acid and the OH⁻ ions from the base combine to form water (H⁺ + OH⁻ → H₂O), while the remaining parts of the acid and base combine to form a <strong>salt</strong>. This overall reaction — an acid reacting with a base to produce a salt and water, with neither acidic nor basic properties left over — is called <strong>neutralisation</strong>.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">pH Scale and Indicators</h4>
            <p className="text-sm text-slate-700 mb-3">
              The <strong>pH scale</strong> is a numbered scale, running from 0 to 14, used to measure how acidic or alkaline a solution is, based on the concentration of H⁺ ions present. A <strong>pH of 7</strong> is exactly <strong>neutral</strong> — neither acidic nor alkaline — and is the pH of pure water. Values <strong>below 7 (0–6) are acidic</strong>, with lower numbers indicating stronger acidity (more H⁺ ions), and values <strong>above 7 (8–14) are alkaline</strong>, with higher numbers indicating stronger alkalinity.
            </p>
            <img src={chemImages.phScaleChart} alt="pH scale chart from 0 to 14 showing acidic, neutral, and alkaline ranges with colour coding" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-sm text-slate-700 mb-3">
              To make this scale less abstract, it helps to place familiar everyday substances on it — this gives you a real sense of just how acidic or alkaline common things around you actually are.
            </p>
            <img src={chemImages.everydayAcidsBases} alt="Everyday household substances placed along the pH scale, from battery acid to oven cleaner" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-sm text-slate-700 mb-3">
              An <strong>indicator</strong> is a substance that changes colour depending on the pH of the solution it's added to, allowing us to estimate pH without specialised equipment. <strong>Universal indicator</strong> is especially useful because it gives a whole range of colours across the full pH scale — typically red for strongly acidic, through orange and yellow for weakly acidic, green for neutral, and blue through purple for increasingly alkaline — letting you estimate the approximate pH value just by comparing the colour produced to a reference chart. <strong>Litmus</strong> is a simpler indicator that only shows two colours: it turns <strong>red in acid</strong> and <strong>blue in alkali</strong>, without distinguishing how strong the acid or alkali is.
            </p>
            <img src={chemImages.litmusColorChange} alt="Litmus paper strips showing red colour in acid and blue colour in alkali" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-sm text-slate-700 mb-3">
              It's also useful to distinguish between <strong>strong</strong> and <strong>weak</strong> acids (and bases). A <strong>strong acid</strong>, such as hydrochloric acid (HCl) or sulphuric acid (H₂SO₄), <strong>fully dissociates</strong> (breaks apart) into its ions when dissolved in water, releasing the maximum possible number of H⁺ ions for its concentration. A <strong>weak acid</strong>, such as ethanoic acid (found in vinegar), only <strong>partially dissociates</strong> — at any moment, most of the acid molecules remain intact and un-ionised, so a weak acid produces fewer H⁺ ions (and therefore a higher pH) than a strong acid of the same concentration.
            </p>
            <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
              <strong>Common pH values:</strong> Hydrochloric acid, HCl (pH 1), lemon juice (pH ~2.5), distilled water (pH 7, neutral), toothpaste (pH ~9), sodium hydroxide, NaOH (pH 14).
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Reactions of Acids</h4>
            <p className="text-sm text-slate-700 mb-3">
              Acids react in three characteristic ways depending on what they're reacted with, and each type of reaction always produces a salt as one of its products — a useful pattern for remembering and predicting the products of acid reactions.
            </p>
            <p className="text-base font-bold text-slate-800 mb-1">1. Acid + Metal → Salt + Hydrogen</p>
            <p className="text-sm text-slate-700 mb-3">
              When a reactive metal is added to an acid, the metal displaces the hydrogen from the acid, forming a salt and releasing hydrogen gas — visible as bubbling/effervescence. For example, magnesium reacting with sulphuric acid: <strong>Mg + H₂SO₄ → MgSO₄ + H₂</strong>. Not every metal reacts this way; how vigorously (or whether at all) a metal reacts with acid depends on its position in the reactivity series — very unreactive metals like copper do not react with dilute acids at all.
            </p>
            <img src={chemImages.acidMetalReaction} alt="Magnesium ribbon reacting with dilute acid in a test tube, producing bubbles of hydrogen gas" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-base font-bold text-slate-800 mb-1">2. Acid + Base → Salt + Water (Neutralisation)</p>
            <p className="text-sm text-slate-700 mb-3">
              When an acid reacts with a base (such as a metal oxide or metal hydroxide), the H⁺ ions and the base's ions combine to form water, while the remaining ions combine to form a salt. For example, copper oxide (a base) reacting with sulphuric acid: <strong>CuO + H₂SO₄ → CuSO₄ + H₂O</strong>. This reaction is commonly used in the lab to prepare soluble salt crystals — the metal oxide is added in excess to the acid, the mixture is filtered to remove unreacted oxide, and the resulting salt solution is then evaporated to crystallise the pure salt.
            </p>
            <p className="text-base font-bold text-slate-800 mb-1">3. Acid + Carbonate → Salt + Water + Carbon Dioxide</p>
            <p className="text-sm text-slate-700 mb-3">
              When an acid reacts with a metal carbonate, it produces a salt, water, and carbon dioxide gas, again visible as effervescence (bubbling). This reaction is easily recognised because the carbon dioxide produced will turn limewater milky/cloudy — a standard test for CO₂. For example, calcium carbonate reacting with hydrochloric acid: <strong>CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂</strong>.
            </p>
            <img src={chemImages.acidCarbonateReaction} alt="Test tube of acid reacting with a carbonate, with gas bubbling through delivery tube into limewater turning milky" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Salts</h4>
            <p className="text-sm text-slate-700 mb-3">
              A <strong>salt</strong> is a compound formed when the hydrogen ion (H⁺) of an acid is replaced by a metal ion (or, in some cases, by an ammonium ion, NH₄⁺). Each acid gives rise to a family of salts named after it: hydrochloric acid produces <strong>chlorides</strong> (e.g. sodium chloride, NaCl), sulphuric acid produces <strong>sulphates</strong> (e.g. copper sulphate, CuSO₄), and nitric acid produces <strong>nitrates</strong> (e.g. potassium nitrate, KNO₃).
            </p>
            <p className="text-sm text-slate-700">
              Different salts have different levels of solubility in water — some, like sodium chloride, dissolve very readily, while others, like most carbonates (except those of Group 1 metals) and some sulphates, are insoluble. This difference in solubility is itself put to practical use: an insoluble salt can be made by mixing two soluble solutions together so that the insoluble salt "falls out" of solution as a solid (a process called precipitation), then separated from the remaining liquid by filtration.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Acids/Bases Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Acid → releases H⁺; alkali → releases OH⁻</li>
              <li>pH: 0–6 acidic, 7 neutral, 8–14 alkaline</li>
              <li>Strong acids fully dissociate; weak acids partially dissociate</li>
              <li>Acid + metal → salt + H₂</li>
              <li>Acid + base → salt + water (neutralisation)</li>
              <li>Acid + carbonate → salt + water + CO₂</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'industrial',
    title: 'Industrial Processes',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Some useful substances aren't dug out of the ground — they're made in factories, through carefully controlled chemical processes. Two important examples are <strong>electrolysis</strong> (using electricity to split up compounds) and the <strong>liquefaction of air</strong> (cooling air until it turns to liquid, so we can separate the gases inside it).
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Liquefaction of Air</h4>
            <p className="text-sm text-slate-700 mb-2">
              Air is a mixture of gases — mostly nitrogen and oxygen. To separate them, we first turn the air into a liquid, then use fractional distillation (the same idea used to separate liquids by boiling point).
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li>Air is cooled down to about <strong>–200°C</strong>, until it becomes liquid.</li>
              <li>Water vapour and carbon dioxide are removed first, since they would freeze solid and block the equipment.</li>
              <li>The liquid air is then warmed up slowly. <strong>Nitrogen boils off first</strong>, at –196°C, since it has the lower boiling point.</li>
              <li><strong>Oxygen boils off next</strong>, at –183°C, and is collected separately.</li>
            </ul>
            <img src={chemImages.airLiquefactionDiagram} alt="Diagram showing air being cooled, liquefied, and separated into nitrogen and oxygen by fractional distillation" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-sm font-semibold text-slate-800 mb-1">Uses</p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li><strong>Oxygen:</strong> used in steel-making, welding, and in hospitals to help patients breathe.</li>
              <li><strong>Nitrogen:</strong> used to make ammonia (for example, at Sable Chemicals in Zimbabwe).</li>
            </ul>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Electrolysis</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Electrolysis</strong> means using an electric current to break down (decompose) a compound. It only works on an <strong>electrolyte</strong> — an ionic compound that has been either melted (molten) or dissolved in water, so that its ions are free to move.
            </p>
            <img src={chemImages.electrolysis} alt="Electrolysis apparatus showing electrodes in molten lead bromide" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li>The <strong>cathode</strong> is the negative electrode. Positive ions move here and gain electrons (this is called <strong>reduction</strong>).</li>
              <li>The <strong>anode</strong> is the positive electrode. Negative ions move here and lose electrons (this is called <strong>oxidation</strong>).</li>
              <li><strong>Example:</strong> molten lead bromide (PbBr₂) splits into lead metal at the cathode and bromine gas at the anode.</li>
              <li><strong>Example:</strong> water can be split into hydrogen (at the cathode) and oxygen (at the anode) — 2H₂O → 2H₂ + O₂.</li>
            </ul>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Electroplating</h4>
            <p className="text-sm text-slate-700 mb-2">
              <strong>Electroplating</strong> uses electrolysis to coat one metal with a thin layer of another metal — for example, coating steel with chromium, nickel, or copper.
            </p>
            <img src={chemImages.electroplatingDiagram} alt="Diagram of electroplating setup showing object as cathode and plating metal as anode" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li>The object to be coated is made the <strong>cathode</strong>.</li>
              <li>The metal used for coating is made the <strong>anode</strong>.</li>
              <li>Why do it? To stop the object rusting or corroding, and to make it look better.</li>
            </ul>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Industrial Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Electrolysis – decomposition using electricity</li>
              <li>Cathode (–) = reduction; Anode (+) = oxidation</li>
              <li>Liquefaction – fractional distillation of air (N₂ then O₂)</li>
              <li>Electroplating – object = cathode, coating metal = anode</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'oxidation-reduction',
    title: 'Oxidation and Reduction',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              Many reactions in chemistry involve one substance gaining something while another substance loses it. These paired reactions are called <strong>oxidation</strong> and <strong>reduction</strong>, and together they're known as <strong>redox</strong> reactions (short for "reduction-oxidation").
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mt-3">
              <li><strong>Oxidation</strong> = gain of oxygen, OR loss of hydrogen.</li>
              <li><strong>Reduction</strong> = loss of oxygen, OR gain of hydrogen.</li>
              <li>A simple memory trick: <strong>OIL RIG</strong> — Oxidation Is Loss, Reduction Is Gain (of electrons, a more advanced way to think about it).</li>
              <li>Oxidation and reduction always happen <strong>together</strong> in the same reaction — one substance can't gain oxygen unless another substance loses it.</li>
            </ul>
            <img src={chemImages.oxidationReductionDemo} alt="Simple diagram showing oxidation as gain of oxygen and reduction as loss of oxygen happening together" loading="lazy" decoding="async" className="mt-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Reducing Metal Oxides</h4>
            <p className="text-sm text-slate-700 mb-3">
              Many metals are found in nature combined with oxygen, as a <strong>metal oxide</strong>. To get the pure metal out, we need to remove that oxygen — this is a <strong>reduction</strong> reaction. A substance that takes the oxygen away is called a <strong>reducing agent</strong>. Two common reducing agents are hydrogen and carbon.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Hydrogen as a reducing agent</p>
            <p className="text-sm text-slate-700 mb-2">
              When hydrogen gas is passed over heated copper oxide (CuO), it removes the oxygen, leaving pure copper metal behind. The equation is: <strong>CuO + H₂ → Cu + H₂O</strong>.
            </p>
            <div className="grid gap-3 sm:grid-cols-3 mb-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 1</p>
                <p className="text-sm text-slate-700">Black copper oxide powder is heated in a tube, with hydrogen gas passed over it.</p>
                <img src={chemImages.cuoHydrogenStep1} alt="Black copper oxide powder in tube with hydrogen gas passing over it" loading="lazy" decoding="async" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 2</p>
                <p className="text-sm text-slate-700">The hydrogen takes the oxygen away from the copper oxide, and water forms as a by-product.</p>
                <img src={chemImages.cuoHydrogenStep2} alt="Hydrogen reacting with copper oxide, water droplets forming at the tube's cooler end" loading="lazy" decoding="async" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs font-bold text-blue-600 mb-1">Step 3</p>
                <p className="text-sm text-slate-700">The black powder turns into shiny brown copper metal.</p>
                <img src={chemImages.cuoHydrogenStep3} alt="Black copper oxide has turned into brown copper metal" loading="lazy" decoding="async" className="mt-2 w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>
            <p className="text-sm text-slate-700 mb-3">
              Here, copper oxide is <strong>reduced</strong> (loses oxygen) to become copper. Hydrogen is <strong>oxidised</strong> (gains oxygen) to become water. Both happen in the same reaction.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">Carbon as a reducing agent</p>
            <p className="text-sm text-slate-700">
              Carbon can also remove oxygen from a metal oxide. For example: <strong>2ZnO + C → 2Zn + CO₂</strong>. Zinc oxide is reduced to zinc metal, and carbon is oxidised to carbon dioxide. This is exactly how some metals, including iron, are extracted on a large scale.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Rusting of Iron</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Rusting</strong> is a common everyday example of oxidation — it's simply iron reacting with oxygen (from the air) to form iron oxide, the reddish-brown flaky substance we know as rust.
            </p>
            <img src={chemImages.rustingDiagram} alt="Diagram showing iron nail rusting, requiring both oxygen and water to be present" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li>Rusting needs <strong>two</strong> things to happen: <strong>oxygen</strong> AND <strong>water</strong>. Without both present, iron will not rust.</li>
              <li>This is why iron kept somewhere dry (no water) doesn't rust, and iron kept somewhere with no air (no oxygen) also doesn't rust.</li>
            </ul>
            <p className="text-sm font-semibold text-slate-800 mb-1">How to stop rusting</p>
            <img src={chemImages.rustPreventionMethods} alt="Three methods of preventing rust: painting, galvanising with zinc, and oiling" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
              <li><strong>Painting:</strong> covers the iron so air and water can't reach it.</li>
              <li><strong>Galvanising:</strong> coating iron with a layer of zinc, which also protects it even if the coating gets scratched.</li>
              <li><strong>Oiling:</strong> a layer of oil keeps air and water away from moving iron parts, like on machinery.</li>
            </ul>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Extraction of Iron (Blast Furnace)</h4>
            <p className="text-sm text-slate-700 mb-3">
              Iron is one of the most useful metals we have, but it's never found pure in the ground — it's always locked up inside rock, combined with oxygen, as <strong>iron ore</strong>. To get useful iron metal out, we have to separate it from the oxygen it's stuck to. This is done inside a huge, tower-shaped structure called a <strong>blast furnace</strong>, which can run continuously, non-stop, for years at a time.
            </p>

            <p className="text-base font-bold text-slate-800 mb-1">What goes in</p>
            <p className="text-sm text-slate-700 mb-2">
              Three raw materials are loaded in together at the top of the furnace:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li><strong>Haematite</strong> (iron ore, mainly Fe₂O₃) — this is where the iron actually comes from.</li>
              <li><strong>Coke</strong> (a form of carbon, made from coal) — burned to give heat, and used to make the gas that pulls the oxygen away from the iron.</li>
              <li><strong>Limestone</strong> (calcium carbonate, CaCO₃) — added to remove the sandy, rocky impurities mixed in with the ore.</li>
            </ul>
            <img src={chemImages.blastFurnaceRawMaterials} alt="Diagram showing the three raw materials loaded into a blast furnace: haematite, coke, and limestone" loading="lazy" decoding="async" className="mb-4 w-full rounded-xl border border-slate-200 bg-white object-contain" />

            <p className="text-base font-bold text-slate-800 mb-1">What happens inside, step by step</p>
            <p className="text-sm text-slate-700 mb-3">
              As the raw materials fall slowly down through the furnace, they meet a blast of very hot air blown in near the bottom (this hot air blast is actually where the furnace gets its name). A series of reactions then happens, one leading into the next:
            </p>

            <div className="space-y-4 mb-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-bold text-slate-800 mb-1">Step 1 — Coke burns to make heat</p>
                <p className="text-sm text-slate-700 mb-2">Hot air is blasted in near the bottom of the furnace. The coke (carbon) burns in this air, releasing a huge amount of heat, which keeps the whole furnace hot enough for the later reactions to happen.</p>
                <p className="text-sm text-slate-700 font-semibold mb-2">C + O₂ → CO₂</p>
                <img src={chemImages.blastFurnaceStep1} alt="Hot air blown into furnace, coke burning to release heat and carbon dioxide" loading="lazy" decoding="async" className="w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>

              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-bold text-slate-800 mb-1">Step 2 — Carbon monoxide is made</p>
                <p className="text-sm text-slate-700 mb-2">As this hot carbon dioxide rises up through the furnace, it meets more red-hot coke and reacts with it again, this time forming carbon monoxide gas.</p>
                <p className="text-sm text-slate-700 font-semibold mb-2">CO₂ + C → 2CO</p>
                <img src={chemImages.blastFurnaceStep2} alt="Carbon dioxide reacting with more coke higher up the furnace, forming carbon monoxide" loading="lazy" decoding="async" className="w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>

              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-bold text-slate-800 mb-1">Step 3 — Carbon monoxide removes the oxygen from the iron ore</p>
                <p className="text-sm text-slate-700 mb-2">This carbon monoxide is the real "worker" of the whole process. As it continues rising, it meets the falling iron ore and reacts with it, pulling the oxygen away from the iron. This leaves behind pure, molten iron metal.</p>
                <p className="text-sm text-slate-700 font-semibold mb-2">Fe₂O₃ + 3CO → 2Fe + 3CO₂</p>
                <img src={chemImages.blastFurnaceStep3} alt="Carbon monoxide reacting with iron ore, removing oxygen to leave molten iron" loading="lazy" decoding="async" className="w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>

              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-bold text-slate-800 mb-1">Step 4 — Limestone removes the impurities</p>
                <p className="text-sm text-slate-700 mb-2">Meanwhile, the heat breaks the limestone down into calcium oxide, which then reacts with the sandy impurities in the ore, forming a molten waste material called <strong>slag</strong>.</p>
                <p className="text-sm text-slate-700 font-semibold mb-2">CaCO₃ → CaO + CO₂, then CaO + SiO₂ → CaSiO₃ (slag)</p>
                <img src={chemImages.blastFurnaceStep4} alt="Limestone breaking down and reacting with sandy impurities to form molten slag" loading="lazy" decoding="async" className="w-full rounded-lg border border-slate-200 bg-white object-contain" />
              </div>
            </div>

            <p className="text-base font-bold text-slate-800 mb-1">What comes out</p>
            <p className="text-sm text-slate-700 mb-2">
              Both the molten iron and the molten slag collect at the bottom of the furnace, but they separate from each other because of their different densities:
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li><strong>Molten iron</strong> is denser (heavier), so it sinks to the very bottom.</li>
              <li><strong>Slag</strong> is less dense (lighter), so it floats on top of the iron.</li>
            </ul>
            <img src={chemImages.blastFurnaceOutput} alt="Bottom of blast furnace showing molten iron sinking below floating slag, both being tapped off separately" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-sm text-slate-700">
              Because they sit in separate layers, they can be <strong>tapped off (drained) separately</strong> through holes at different heights. The iron collected is used to make steel, while the slag isn't wasted — it's commonly used to help build roads.
            </p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Redox Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Oxidation – gain O / lose H</li>
              <li>Reduction – lose O / gain H</li>
              <li>Rusting needs oxygen AND water</li>
              <li>Blast furnace: CO reduces Fe₂O₃ to iron</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'organic',
    title: 'Organic Chemistry',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              <strong>Organic chemistry</strong> is the study of compounds made mainly from carbon and hydrogen — these are called <strong>hydrocarbons</strong>. Carbon is special because it can join to other carbon atoms to form long chains or rings, which is why there are millions of different carbon-based compounds, far more than for any other element.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mt-3">
              Related hydrocarbons are grouped into <strong>homologous series</strong> — families of compounds that share the same general formula, similar chemical properties, and gradually changing physical properties (like boiling point) as the chain gets longer. The two most important homologous series to know are <strong>alkanes</strong> and <strong>alkenes</strong>.
            </p>
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Alkanes</h4>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li>General formula: <strong>CₙH₂ₙ₊₂</strong></li>
              <li>All the bonds between carbon atoms are <strong>single bonds</strong>.</li>
              <li>Because every possible bond is already used up by hydrogen, alkanes are called <strong>saturated</strong> hydrocarbons.</li>
              <li>First three members: methane (CH₄), ethane (C₂H₆), propane (C₃H₈).</li>
            </ul>
            <img src={chemImages.alkaneStructures} alt="Displayed structures of methane, ethane, and propane showing single carbon-carbon bonds" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Alkenes</h4>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li>General formula: <strong>CₙH₂ₙ</strong></li>
              <li>Contain at least one <strong>C=C double bond</strong>.</li>
              <li>Because a double bond could still open up to take on more atoms, alkenes are called <strong>unsaturated</strong> hydrocarbons.</li>
              <li>First two members: ethene (C₂H₄), propene (C₃H₆).</li>
            </ul>
            <img src={chemImages.alkeneStructures} alt="Displayed structures of ethene and propene showing carbon-carbon double bonds" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Telling Alkanes and Alkenes Apart</h4>
            <p className="text-sm text-slate-700 mb-2">
              Since alkanes and alkenes can look quite similar, chemists use a simple test to tell them apart: <strong>bromine water</strong>.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li>Add orange bromine water to the hydrocarbon and shake.</li>
              <li>An <strong>alkane</strong> has no double bond to react with, so the bromine water <strong>stays orange</strong>.</li>
              <li>An <strong>alkene</strong> reacts with the bromine at its double bond, so the bromine water <strong>turns colourless</strong>.</li>
            </ul>
            <img src={chemImages.alkaneVsAlkeneTest} alt="Bromine water test comparing an alkane (stays orange) and an alkene (turns colourless)" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
          </div>

          <div className="prose prose-slate max-w-none">
            <h4 className="font-bold text-blue-700 text-lg mb-2">Biogas Production</h4>
            <p className="text-sm text-slate-700 mb-3">
              <strong>Biogas</strong> is a fuel gas made by breaking down organic waste (like cow dung or plant matter) using bacteria that work <strong>without oxygen</strong> — this process is called <strong>anaerobic digestion</strong>.
            </p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li>Waste is loaded into a sealed tank called a <strong>digester</strong>, kept free of air.</li>
              <li>Bacteria break the waste down, producing <strong>biogas</strong> — mostly methane (CH₄), with some carbon dioxide and a small amount of hydrogen sulfide.</li>
              <li>The gas collects at the top of the digester and is piped off for use.</li>
            </ul>
            <img src={chemImages.biogasDigesterDiagram} alt="Diagram of a biogas digester showing waste input, bacteria breaking it down, and gas collecting at the top" loading="lazy" decoding="async" className="mb-3 w-full rounded-xl border border-slate-200 bg-white object-contain" />
            <p className="text-sm font-semibold text-slate-800 mb-1">What affects how much gas is made</p>
            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1 mb-3">
              <li><strong>Temperature:</strong> works best between 35–55°C — too cold, and the bacteria slow down.</li>
              <li><strong>pH:</strong> best around neutral (pH 7) — too acidic or too alkaline harms the bacteria.</li>
              <li><strong>Time:</strong> the longer the waste sits, the more gas is produced, up to a point.</li>
              <li><strong>Type of waste:</strong> some materials break down and release gas more easily than others.</li>
            </ul>
            <p className="text-sm font-semibold text-slate-800 mb-1">Uses</p>
            <p className="text-sm text-slate-700">Biogas can be burned for cooking, lighting, and even to run small refrigerators — making it a useful, renewable fuel source in rural areas.</p>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Organic Key</h3>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li>Alkanes (CₙH₂ₙ₊₂) – single bonds, saturated</li>
              <li>Alkenes (CₙH₂ₙ) – double bond, unsaturated</li>
              <li>Bromine water: orange = alkane, colourless = alkene</li>
              <li>Biogas – methane from anaerobic digestion</li>
            </ul>
          </div>
        </aside>
      </div>
    ),
  },
  {
    id: 'revision-summary',
    title: 'Quick Revision Summary',
    content: (
      <div className="grid gap-6 md:grid-cols-4">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🧪</span>
            <h4 className="text-lg font-bold text-blue-700">Separation</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Simple distillation – one volatile liquid</li>
            <li>Fractional – different boiling points</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚛️</span>
            <h4 className="text-lg font-bold text-blue-700">Matter</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Atoms: protons, neutrons, electrons</li>
            <li>Isotopes – same protons, different neutrons</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📊</span>
            <h4 className="text-lg font-bold text-blue-700">Periodic Table</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Groups (columns), periods (rows)</li>
            <li>Electronic config determines properties</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔗</span>
            <h4 className="text-lg font-bold text-blue-700">Bonding</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Ionic – transfer, salts</li>
            <li>Covalent – sharing, molecules</li>
          </ul>
        </div>

        <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🧮</span>
            <h4 className="text-lg font-bold text-blue-700">Stoichiometry</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Moles = mass / Mr</li>
            <li>Empirical formula – simplest ratio</li>
            <li>Concentration = moles / volume</li>
          </ul>
        </div>

        <div className="md:col-span-2 p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">⚗️</span>
            <h4 className="text-lg font-bold text-blue-700">Acids, Bases, Salts</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside text-sm">
            <li>Acid + metal → salt + H₂</li>
            <li>Acid + base → salt + water</li>
            <li>Acid + carbonate → salt + water + CO₂</li>
          </ul>
        </div>

        <div className="md:col-span-4 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏭</span>
            <h4 className="text-lg font-bold text-blue-700">Industrial & Organic</h4>
          </div>
          <p className="text-slate-700 mt-1">Electrolysis (PbBr₂, water), electroplating, liquefaction of air, blast furnace (iron extraction), alkanes/alkenes, biogas production.</p>
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

interface LearningOutcome2Props {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const LearningOutcome2: React.FC<LearningOutcome2Props> = ({
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
            CHEMISTRY
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Chemistry: Separation, Matter, Bonding, Stoichiometry, Acids, Industry & Organic
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Comprehensive notes covering separation techniques, atomic structure, periodic table, chemical bonding,
            mole concept, acids/bases/salts, industrial processes, oxidation/reduction, and organic chemistry.
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
                <span><strong className="text-white">Separation:</strong> Simple distillation (pure liquid from solution) and fractional distillation (liquids with different boiling points).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Matter:</strong> Atoms contain protons, neutrons, electrons. Isotopes – same Z, different A.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Bonding:</strong> Ionic (transfer) and covalent (sharing). Properties differ.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Stoichiometry:</strong> Moles = mass/Mr; empirical formula from composition; concentration = moles/volume.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Acids/Bases:</strong> Acids release H⁺, bases release OH⁻. Neutralisation forms salt + water. Carbonates give CO₂.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Industry:</strong> Electrolysis (PbBr₂, water), electroplating, liquefaction of air, blast furnace (iron extraction).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span><strong className="text-white">Organic:</strong> Alkanes (single bonds), alkenes (double bonds), biogas (methane from anaerobic digestion).</span>
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

export default LearningOutcome2;
