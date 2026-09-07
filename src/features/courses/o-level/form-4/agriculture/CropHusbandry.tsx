import React, { useState, useRef } from 'react';

/**
 * Topic: Crop Husbandry – Full component with sticky navigation,
 * container cards (9px border-radius), image placeholders,
 * and auto‑scroll + double‑highlight on heading.
 */
export const CropHusbandry: React.FC = () => {
  // ---------- CSS keyframes for the double highlight ----------
  const highlightStyles = `
    @keyframes highlight-flash {
      0% { background-color: transparent; }
      25% { background-color: #fef08a; }
      50% { background-color: transparent; }
      75% { background-color: #fef08a; }
      100% { background-color: transparent; }
    }
    .highlight-heading {
      animation: highlight-flash 0.9s ease 2;
      border-radius: 4px;
      padding: 0 4px;
      display: inline-block;
    }
  `;

  // ---------- Section definitions ----------
  interface TopicSection {
    id: string;
    title: string;
    content: React.ReactNode;
    aside?: React.ReactNode;
  }

  // Image helper
  const AgricultureImage: React.FC<{
    fileName: string;
    alt: string;
    caption: string;
  }> = ({ fileName, alt, caption }) => {
    const [isMissing, setIsMissing] = useState(false);

    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        {isMissing ? (
          <div className="flex aspect-video flex-col items-center justify-center bg-slate-100 px-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-600">
              Image ready to add
            </p>
            <code className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
              {fileName}
            </code>
            <p className="mt-3 text-xs text-slate-500">
              Place this file in <strong>public/images/agriculture/</strong>
            </p>
          </div>
        ) : (
          <img
            src={`/images/agriculture/${fileName}`}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
            onError={() => setIsMissing(true)}
          />
        )}
        <figcaption className="border-t border-slate-100 px-4 py-3 text-sm font-medium leading-6 text-slate-600">
          {caption}
        </figcaption>
      </figure>
    );
  };

  // Subtopic Card component for consistent styling
  const SubtopicCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="rounded-[9px] border border-slate-200 bg-white shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-6">
        <h3 className="text-3xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-200">
          {title}
        </h3>
        <div className="text-slate-700 leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );

  const sections: TopicSection[] = [
    {
      id: 'plant-processes',
      title: 'Plant Processes',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Aerobic Respiration">
            <p>
              <strong>Definition:</strong> Aerobic respiration is the process by
              which plants (and other living organisms) break down glucose (food)
              using oxygen to release energy, carbon dioxide, and water. It is the
              most efficient way to release energy from food.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Word Equation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Word equation:</strong>
                <br />
                Glucose + Oxygen → Carbon dioxide + Water + Energy (ATP)
              </li>
              <li>
                <strong>Chemical equation:</strong>
                <br />
                C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy (ATP)
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sites of Respiration</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Mitochondria:</strong> The main site of aerobic respiration
                in plant cells. Mitochondria are called the "powerhouses" of the cell.
              </li>
              <li>
                <strong>Cytoplasm:</strong> Glycolysis (the first stage of respiration)
                occurs in the cytoplasm.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Importance of Respiration</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Energy production:</strong> Respiration releases energy (ATP)
                that powers all life processes – growth, reproduction, transport of
                nutrients, and movement.
              </li>
              <li>
                <strong>Growth and development:</strong> The energy from respiration
                is used for cell division, elongation, and differentiation.
              </li>
              <li>
                <strong>Transport:</strong> Energy is needed for active transport of
                minerals and water.
              </li>
              <li>
                <strong>Repair and maintenance:</strong> Energy is required to repair
                damaged tissues and maintain cellular functions.
              </li>
            </ul>

            <AgricultureImage
              fileName="aerobic-respiration.png"
              alt="A 2D diagram showing aerobic respiration: glucose + oxygen → carbon dioxide + water + energy, with mitochondria labelled"
              caption="Aerobic respiration: word and chemical equations, sites, and importance."
            />
          </SubtopicCard>

          <SubtopicCard title="Aerobic vs Anaerobic Respiration">
            <p>
              <strong>Definition:</strong> While aerobic respiration requires oxygen,
              anaerobic respiration occurs in the absence of oxygen. Both processes
              release energy from glucose, but they differ in efficiency and products.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Comparison</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Feature</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Aerobic Respiration</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Anaerobic Respiration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Oxygen required?</td>
                  <td className="border border-slate-300 px-4 py-2">Yes</td>
                  <td className="border border-slate-300 px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Products</td>
                  <td className="border border-slate-300 px-4 py-2">CO₂ + H₂O + Energy</td>
                  <td className="border border-slate-300 px-4 py-2">Ethanol (plants) or Lactic acid (animals) + CO₂ + little energy</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Energy released</td>
                  <td className="border border-slate-300 px-4 py-2">High (38 ATP per glucose)</td>
                  <td className="border border-slate-300 px-4 py-2">Low (2 ATP per glucose)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Location</td>
                  <td className="border border-slate-300 px-4 py-2">Mitochondria + cytoplasm</td>
                  <td className="border border-slate-300 px-4 py-2">Cytoplasm only</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Example in plants</td>
                  <td className="border border-slate-300 px-4 py-2">Normal cellular respiration</td>
                  <td className="border border-slate-300 px-4 py-2">Waterlogged roots (ethanol produced)</td>
                </tr>
              </tbody>
            </table>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Significance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Aerobic respiration:</strong> Highly efficient, produces
                large amounts of energy for active growth and development.
              </li>
              <li>
                <strong>Anaerobic respiration:</strong> Less efficient but allows
                plants to survive in oxygen-poor conditions (e.g., waterlogged soils).
                However, ethanol production can be toxic to plants over time.
              </li>
            </ul>

            <AgricultureImage
              fileName="aerobic-anaerobic-respiration.png"
              alt="A 2D diagram comparing aerobic and anaerobic respiration with their inputs, outputs, and energy yield"
              caption="Aerobic vs anaerobic respiration: comparison of processes."
            />
          </SubtopicCard>

          <SubtopicCard title="Respiration vs Photosynthesis">
            <p>
              <strong>Definition:</strong> Respiration and photosynthesis are two
              fundamental processes in plants. Photosynthesis produces food (glucose)
              using sunlight, while respiration breaks down food to release energy.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Comparison</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Feature</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Photosynthesis</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Respiration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Purpose</td>
                  <td className="border border-slate-300 px-4 py-2">Produces food</td>
                  <td className="border border-slate-300 px-4 py-2">Releases energy</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Inputs</td>
                  <td className="border border-slate-300 px-4 py-2">CO₂ + H₂O + sunlight</td>
                  <td className="border border-slate-300 px-4 py-2">Glucose + O₂</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Outputs</td>
                  <td className="border border-slate-300 px-4 py-2">Glucose + O₂</td>
                  <td className="border border-slate-300 px-4 py-2">CO₂ + H₂O + energy</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Energy</td>
                  <td className="border border-slate-300 px-4 py-2">Stores energy (chemical)</td>
                  <td className="border border-slate-300 px-4 py-2">Releases energy (ATP)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Timing</td>
                  <td className="border border-slate-300 px-4 py-2">Only in sunlight</td>
                  <td className="border border-slate-300 px-4 py-2">All the time (day and night)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Location</td>
                  <td className="border border-slate-300 px-4 py-2">Chloroplasts</td>
                  <td className="border border-slate-300 px-4 py-2">Mitochondria</td>
                </tr>
              </tbody>
            </table>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Why Both Are Essential</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Photosynthesis produces the glucose and oxygen needed for respiration.
              </li>
              <li>
                Respiration provides the energy needed for photosynthesis to occur
                (energy for carbon fixation).
              </li>
              <li>
                Together, they maintain the balance of gases in the atmosphere
                (oxygen and carbon dioxide).
              </li>
            </ul>

            <AgricultureImage
              fileName="photosynthesis-respiration-comparison.png"
              alt="A 2D diagram comparing photosynthesis and respiration with inputs, outputs, and locations"
              caption="Comparison of photosynthesis and respiration."
            />
          </SubtopicCard>

          <SubtopicCard title="Plant Tropisms">
            <p>
              <strong>Definition:</strong> Tropisms are directional growth responses
              of plants to external stimuli (light, touch, gravity, water). The
              plant grows towards or away from the stimulus, allowing it to adapt
              to its environment.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Phototropism (Response to Light)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Growth of a plant in response to light.
              </li>
              <li>
                <strong>Direction:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Positive phototropism:</strong> Growing towards light
                    (e.g., shoots and leaves). This maximises light absorption for
                    photosynthesis.
                  </li>
                  <li>
                    <strong>Negative phototropism:</strong> Growing away from light
                    (e.g., roots). Roots grow away from light to seek moisture and
                    nutrients in the soil.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong> Ensures plants get maximum light for
                photosynthesis, which is essential for food production.
              </li>
              <li>
                <strong>Example:</strong> A houseplant bends towards a window to
                capture more sunlight.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Thigmotropism (Response to Touch)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Growth of a plant in response to touch
                or physical contact.
              </li>
              <li>
                <strong>Direction:</strong> Positive thigmotropism – growing towards
                or around an object (e.g., climbing plants).
              </li>
              <li>
                <strong>Importance:</strong> Allows climbing plants to attach to
                supports (trees, walls, trellises), helping them reach sunlight and
                support their growth.
              </li>
              <li>
                <strong>Example:</strong> Bean plants curl around a trellis; tendrils
                of grapes and passion fruit wrap around supports.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Gravitropism (Response to Gravity)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Growth of a plant in response to gravity.
              </li>
              <li>
                <strong>Direction:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Positive gravitropism:</strong> Growing towards gravity
                    (e.g., roots). Roots grow downwards into the soil to anchor the
                    plant and absorb water and minerals.
                  </li>
                  <li>
                    <strong>Negative gravitropism:</strong> Growing away from gravity
                    (e.g., shoots). Shoots grow upwards towards light and air.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong> Ensures roots grow into the soil for
                anchorage and absorption, and shoots grow upwards for light exposure.
              </li>
              <li>
                <strong>Example:</strong> A seed planted upside down will still send
                roots downwards and shoots upwards.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Hydrotropism (Response to Water)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Growth of a plant in response to water.
              </li>
              <li>
                <strong>Direction:</strong> Positive hydrotropism – growing towards
                water (e.g., roots grow towards moisture in the soil).
              </li>
              <li>
                <strong>Importance:</strong> Allows roots to find water in the soil,
                which is essential for plant survival, especially in dry conditions.
              </li>
              <li>
                <strong>Example:</strong> Roots of a plant will grow towards a
                water source (e.g., a pipe or moist soil layer).
              </li>
            </ul>

            <AgricultureImage
              fileName="plant-tropisms.png"
              alt="A 2D diagram showing plant tropisms: phototropism (towards light), thigmotropism (touch response), gravitropism (root down, shoot up), and hydrotropism (root towards water)"
              caption="Plant tropisms: responses to light, touch, gravity, and water."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Aerobic respiration:</strong> glucose + oxygen → CO₂ + water + energy</li>
            <li><strong>Anaerobic respiration:</strong> glucose → ethanol + CO₂ + little energy</li>
            <li><strong>Mitochondria:</strong> site of aerobic respiration</li>
            <li><strong>Photosynthesis:</strong> CO₂ + water → glucose + oxygen (sunlight)</li>
            <li><strong>Phototropism:</strong> response to light</li>
            <li><strong>Thigmotropism:</strong> response to touch</li>
            <li><strong>Gravitropism:</strong> response to gravity</li>
            <li><strong>Hydrotropism:</strong> response to water</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'crop-protection',
      title: 'Crop Protection',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Agrochemical Precautions When Using and Storing">
            <p>
              <strong>Definition:</strong> Agrochemicals are chemical products used
              in agriculture, including pesticides (insecticides, fungicides, herbicides),
              fertilisers, and growth regulators. They are toxic and must be handled
              with care.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Precautions When Using Agrochemicals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Personal protective equipment (PPE):</strong>
                <br />
                Wear protective clothing: gloves, boots, overalls, goggles, and a
                mask or respirator. This prevents skin contact and inhalation of toxic
                substances.
              </li>
              <li>
                <strong>Read the label:</strong>
                <br />
                Always read the product label and follow the manufacturer's instructions.
                The label provides information on dosage, application method, safety
                precautions, and first aid.
              </li>
              <li>
                <strong>Calibration:</strong>
                <br />
                Calibrate sprayers correctly to ensure the correct application rate.
                Over-application can damage crops and harm the environment; under-application
                may not control the pest.
              </li>
              <li>
                <strong>Avoid contamination:</strong>
                <br />
                Do not eat, drink, or smoke while handling agrochemicals. Wash hands
                and exposed skin thoroughly after handling.
              </li>
              <li>
                <strong>Spraying conditions:</strong>
                <br />
                Avoid spraying on windy days (to prevent drift) or before rain
                (to prevent runoff). Spray early morning or late afternoon to avoid
                high temperatures and direct sunlight.
              </li>
              <li>
                <strong>Clean equipment:</strong>
                <br />
                Clean sprayers and equipment thoroughly after use to prevent
                contamination and blockages.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Precautions When Storing Agrochemicals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Storage area:</strong>
                <br />
                Store agrochemicals in a dedicated, well-ventilated, lockable store
                away from food, feed, and water sources.
              </li>
              <li>
                <strong>Container integrity:</strong>
                <br />
                Keep agrochemicals in their original containers with intact labels.
                Check for leaks and damage regularly.
              </li>
              <li>
                <strong>Temperature and light:</strong>
                <br />
                Store in a cool, dry place away from direct sunlight and extreme
                temperatures (some chemicals can degrade or become volatile).
              </li>
              <li>
                <strong>Inventory:</strong>
                <br />
                Keep an inventory of stored agrochemicals and use older stock first
                (FIFO – First In, First Out).
              </li>
              <li>
                <strong>Spill containment:</strong>
                <br />
                Have spill containment materials (sand, sawdust, absorbent pads)
                and a spill response plan.
              </li>
              <li>
                <strong>Disposal:</strong>
                <br />
                Dispose of empty containers and unused chemicals safely (e.g.,
                triple-rinse containers and return to collection points; never
                burn or bury).
              </li>
            </ul>

            <AgricultureImage
              fileName="agrochemical-precautions.png"
              alt="A 2D diagram showing agrochemical precautions: PPE (gloves, goggles, mask), reading labels, calibration, storage, and disposal"
              caption="Agrochemical precautions when using and storing."
            />
          </SubtopicCard>

          <SubtopicCard title="Toxicity Levels of Agrochemicals">
            <p>
              <strong>Definition:</strong> Toxicity is the degree to which a chemical
              can harm living organisms. Agrochemicals are classified by their
              toxicity to humans, animals, and the environment.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">WHO Classification of Pesticides (by toxicity)</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Class</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Toxicity Level</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">LD50 (mg/kg body weight)</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Class I (Highly hazardous)</td>
                  <td className="border border-slate-300 px-4 py-2">Extremely toxic</td>
                  <td className="border border-slate-300 px-4 py-2">&lt; 5</td>
                  <td className="border border-slate-300 px-4 py-2">Parathion, Aldicarb</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Class II (Moderately hazardous)</td>
                  <td className="border border-slate-300 px-4 py-2">Moderately toxic</td>
                  <td className="border border-slate-300 px-4 py-2">5-50</td>
                  <td className="border border-slate-300 px-4 py-2">Carbofuran, Dimethoate</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Class III (Slightly hazardous)</td>
                  <td className="border border-slate-300 px-4 py-2">Slightly toxic</td>
                  <td className="border border-slate-300 px-4 py-2">50-500</td>
                  <td className="border border-slate-300 px-4 py-2">2,4-D, Malathion</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Class IV (Unlikely to cause acute hazard)</td>
                  <td className="border border-slate-300 px-4 py-2">Low toxicity</td>
                  <td className="border border-slate-300 px-4 py-2">Over 500</td>
                  <td className="border border-slate-300 px-4 py-2">Pyrethrins, Sulphur</td>
                </tr>
              </tbody>
            </table>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Understanding LD50</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>LD50:</strong> Lethal Dose that kills 50% of a test population.
                It is measured in mg of chemical per kg of body weight.
              </li>
              <li>
                <strong>Lower LD50 = higher toxicity.</strong> A chemical with an
                LD50 of 5 mg/kg is much more toxic than one with an LD50 of 500 mg/kg.
              </li>
              <li>
                <strong>Importance:</strong> LD50 values help farmers and regulators
                understand the risk of a chemical and determine appropriate safety
                measures.
              </li>
            </ul>

            <AgricultureImage
              fileName="toxicity-levels.png"
              alt="A 2D diagram showing WHO toxicity classes for pesticides with LD50 values and examples"
              caption="Toxicity levels of agrochemicals: WHO classification."
            />
          </SubtopicCard>

          <SubtopicCard title="Calculating Chemical Mixing Ratios">
            <p>
              <strong>Definition:</strong> Calculating chemical mixing ratios involves
              determining the correct amount of chemical to mix with water to achieve
              the recommended concentration for spraying.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps for Calculating Mixing Ratios</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1: Read the label.</strong>
                <br />
                The label will specify the recommended dosage (e.g., 2 litres per
                hectare, or 50 ml per 20 litres of water).
              </li>
              <li>
                <strong>Step 2: Calculate the spray volume needed.</strong>
                <br />
                Determine the area to be sprayed (hectares) and the spray volume
                required (litres per hectare). For a knapsack sprayer, typical spray
                volume is 200-400 litres per hectare.
              </li>
              <li>
                <strong>Step 3: Calculate the amount of chemical needed.</strong>
                <br />
                Amount of chemical = Recommended rate × Area to be sprayed ÷ Concentration
                of spray solution.
              </li>
              <li>
                <strong>Step 4: Mix carefully.</strong>
                <br />
                Add water to the sprayer, then add the chemical, then top up with
                more water. Agitate to mix thoroughly.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example Calculation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Scenario:</strong> You need to spray a 1-hectare field with
                a herbicide. The label says: "Apply 2 litres of product per hectare
                in 200 litres of water."
              </li>
              <li>
                <strong>Calculation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    You need 2 litres of herbicide for 1 hectare.
                  </li>
                  <li>
                    You need 200 litres of water to mix with the herbicide.
                  </li>
                  <li>
                    For a smaller area (e.g., 0.5 hectare), you would need:
                    2 litres × 0.5 = 1 litre of herbicide, and 200 litres × 0.5 =
                    100 litres of water.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">General Formula</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Amount of chemical = (Rate per hectare × Area) / (Volume per hectare ÷ Tank capacity)</strong>
              </li>
              <li>
                <strong>Example for a knapsack sprayer (15-litre tank):</strong>
                <br />
                If the spray volume is 200 L/ha, one knapsack covers 15/200 = 0.075 ha.
                <br />
                If the herbicide rate is 2 L/ha, you need 2 × 0.075 = 0.15 litres
                (150 ml) of herbicide per knapsack.
              </li>
            </ul>

            <AgricultureImage
              fileName="chemical-mixing-calculations.png"
              alt="A 2D diagram showing chemical mixing calculations: reading label, calculating spray volume, and measuring chemical"
              caption="Calculating chemical mixing ratios for safe and effective application."
            />
          </SubtopicCard>

          <SubtopicCard title="Parts of a Knapsack Sprayer">
            <p>
              <strong>Definition:</strong> A knapsack sprayer is a hand-operated or
              motorised sprayer worn on the back (like a backpack). It is commonly
              used for applying pesticides, herbicides, and fungicides on small to
              medium-sized farms.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Tank:</strong>
                <br />
                <strong>Description:</strong> The container that holds the spray
                solution (water + chemical). Usually made of plastic or metal,
                with a capacity of 10-20 litres.
                <br />
                <strong>Function:</strong> Stores the liquid to be sprayed.
              </li>
              <li>
                <strong>Pump:</strong>
                <br />
                <strong>Description:</strong> A hand-operated or motorised pump that
                pressurises the liquid in the tank.
                <br />
                <strong>Function:</strong> Creates the pressure needed to spray the liquid.
              </li>
              <li>
                <strong>Lance (spray wand):</strong>
                <br />
                <strong>Description:</strong> A long, tubular rod attached to the
                tank with a hose. It has a trigger and a nozzle at the end.
                <br />
                <strong>Function:</strong> Allows the operator to direct the spray
                to the target plants.
              </li>
              <li>
                <strong>Nozzle:</strong>
                <br />
                <strong>Description:</strong> The tip at the end of the lance that
                controls the spray pattern and droplet size.
                <br />
                <strong>Function:</strong> Atomises the liquid into droplets for
                even coverage. Different nozzles give different spray patterns (e.g.,
                fan nozzle, cone nozzle, hollow cone).
              </li>
              <li>
                <strong>Hose:</strong>
                <br />
                <strong>Description:</strong> A flexible tube that connects the tank
                to the lance.
                <br />
                <strong>Function:</strong> Carries the pressurised liquid from the
                pump to the nozzle.
              </li>
              <li>
                <strong>Strainer (filter):</strong>
                <br />
                <strong>Description:</strong> A fine mesh filter in the tank or at
                the nozzle.
                <br />
                <strong>Function:</strong> Prevents debris from blocking the nozzle.
              </li>
              <li>
                <strong>Pressure regulator:</strong>
                <br />
                <strong>Description:</strong> A device that maintains consistent
                pressure in the system.
                <br />
                <strong>Function:</strong> Ensures uniform spray application.
              </li>
              <li>
                <strong>Harness (straps):</strong>
                <br />
                <strong>Description:</strong> Shoulder straps that allow the sprayer
                to be carried on the back.
                <br />
                <strong>Function:</strong> Makes the sprayer portable and easy to carry.
              </li>
            </ul>

            <AgricultureImage
              fileName="knapsack-sprayer-parts.png"
              alt="A 2D diagram showing the parts of a knapsack sprayer: tank, pump, lance, nozzle, hose, strainer, pressure regulator, and harness"
              caption="Parts of a knapsack sprayer and their functions."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Crop Protection</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Precautions:</strong> PPE, read labels, calibration, storage</li>
            <li><strong>Toxicity:</strong> WHO classes (I-IV), LD50 values</li>
            <li><strong>Mixing ratios:</strong> calculate based on label and area</li>
            <li><strong>Knapsack parts:</strong> tank, pump, lance, nozzle, hose, strainer</li>
          </ul>
        </div>
      ),
    },
  ];

  // ---------- State ----------
  const [activeId, setActiveId] = useState<string>(sections[0].id);

  // ---------- Navigation handlers ----------
  const handleNavigate = (id: string) => {
    setActiveId(id);

    document.querySelectorAll('.highlight-heading').forEach((el) => {
      el.classList.remove('highlight-heading');
    });

    const sectionEl = document.getElementById(id);
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const heading = sectionEl.querySelector('h2');
      if (heading) {
        heading.classList.remove('highlight-heading');
        void heading.offsetWidth;
        heading.classList.add('highlight-heading');
      }
    }
  };

  const activeIndex = Math.max(sections.findIndex((s) => s.id === activeId), 0);
  const isLastChapter = activeIndex >= sections.length - 1;

  // ---------- Sub-components ----------
  const TopicNav: React.FC<{
    activeId: string;
    onNavigate: (id: string) => void;
  }> = ({ activeId, onNavigate }) => {
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
            type="button"
            aria-label="Scroll topics left"
            onClick={() => scroll('left')}
            className="p-1 bg-white rounded-full shadow border text-slate-600 mr-2 hover:bg-slate-50 transition-colors"
          >
            <svg aria-hidden="true" focusable="false" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    ? 'bg-green-600 text-white shadow-md shadow-green-200'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Scroll topics right"
            onClick={() => scroll('right')}
            className="p-1 bg-white rounded-full shadow border text-slate-600 ml-2 hover:bg-slate-50 transition-colors"
          >
            <svg aria-hidden="true" focusable="false" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <h2 className="text-4xl font-bold text-slate-900">{section.title}</h2>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <div className="max-w-none">{section.content}</div>
        {section.aside && <aside className="lg:sticky lg:top-24 space-y-5">{section.aside}</aside>}
      </div>
    </section>
  );

  // ---------- Main render ----------
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <style>{highlightStyles}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 pt-12 pb-10 shadow-lg">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            AGRICULTURE
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Crop Husbandry
          </h1>
          <p className="text-lg text-green-100 max-w-2xl leading-relaxed">
            Explore plant processes including respiration, photosynthesis, and tropisms,
            and crop protection including agrochemical safety, toxicity, mixing ratios,
            and knapsack sprayer parts.
          </p>
        </div>
      </div>

      {/* Sticky Navigation */}
      <TopicNav activeId={activeId} onNavigate={handleNavigate} />

      {/* Main content */}
      <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        {sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}

        {/* Footer - Key Takeaways */}
        {isLastChapter && (
          <div className="mt-12 p-6 bg-gradient-to-r from-green-600 to-green-800 rounded-[9px] text-white shadow-lg">
            <h3 className="font-bold text-2xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-green-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Aerobic Respiration:</strong>
                  Glucose + Oxygen → CO₂ + Water + Energy (ATP). Occurs in mitochondria.
                  Provides energy for growth, transport, and all life processes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Aerobic vs Anaerobic:</strong>
                  Aerobic requires oxygen, produces more energy (38 ATP). Anaerobic
                  occurs without oxygen, produces less energy (2 ATP) and ethanol
                  (in plants) or lactic acid (in animals).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Respiration vs Photosynthesis:</strong>
                  Photosynthesis produces glucose (stores energy); respiration breaks
                  it down (releases energy). They are complementary processes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Plant Tropisms:</strong> Phototropism
                  (light), Thigmotropism (touch), Gravitropism (gravity), Hydrotropism
                  (water) – directional growth responses that help plants survive
                  and thrive.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Agrochemical Safety:</strong> Wear
                  PPE, read labels, calibrate, store safely, and dispose of containers
                  correctly. Toxicity is classified by WHO (I-IV) based on LD50 values.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Sprayer Parts:</strong> Knapsack
                  sprayer has a tank, pump, lance, nozzle, hose, strainer, pressure
                  regulator, and harness. Correct mixing calculations are essential
                  for effective and safe application.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Crop Husbandry topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-green-600">Animal Husbandry</span>?</>
            ) : (
              <>Next: <span className="text-green-600">{sections[activeIndex + 1].title}</span></>
            )}
          </h3>
          <button
            type="button"
            onClick={() => {
              if (!isLastChapter) {
                handleNavigate(sections[activeIndex + 1].id);
              } else {
                alert('Proceed to Animal Husbandry (next topic)');
              }
            }}
            className="px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Animal Husbandry →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropHusbandry;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/agriculture/
   Use a mix of 2D diagram style and realistic photographs.

   --- PLANT PROCESSES IMAGES (2D DIAGRAM STYLE) ---

   1. aerobic-respiration.png
      A 2D diagram showing aerobic respiration:
      - Word equation: Glucose + Oxygen → Carbon dioxide + Water + Energy
      - Chemical equation: C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + Energy
      - Mitochondria labelled as the site of respiration
      - Importance: energy for growth, transport, repair

   2. aerobic-anaerobic-respiration.png
      A 2D diagram comparing aerobic and anaerobic respiration:
      - Aerobic: requires oxygen, produces CO₂ + H₂O + energy (38 ATP)
      - Anaerobic: no oxygen, produces ethanol + CO₂ + little energy (2 ATP)
      - Locations: mitochondria (aerobic), cytoplasm (both)

   3. photosynthesis-respiration-comparison.png
      A 2D diagram comparing photosynthesis and respiration:
      - Photosynthesis: CO₂ + H₂O + sunlight → glucose + O₂ (chloroplasts)
      - Respiration: glucose + O₂ → CO₂ + H₂O + energy (mitochondria)
      - Shows the relationship between the two processes

   4. plant-tropisms.png
      A 2D diagram showing plant tropisms:
      - Phototropism: shoot bends towards light (positive), root away (negative)
      - Thigmotropism: tendrils wrap around a support (touch response)
      - Gravitropism: root grows down (positive), shoot grows up (negative)
      - Hydrotropism: root grows towards water (positive)
      Label each tropism with examples.

   --- CROP PROTECTION IMAGES (2D DIAGRAM STYLE) ---

   5. agrochemical-precautions.png
      A 2D diagram showing agrochemical precautions:
      - When using: PPE (gloves, goggles, overalls, mask), read labels, calibration,
        avoid contamination, safe spraying conditions
      - When storing: dedicated store, original containers, cool/dry, inventory,
        spill containment, safe disposal

   6. toxicity-levels.png
      A 2D diagram showing WHO toxicity classes:
      - Class I: Highly hazardous (LD50 < 5) – parathion, aldicarb
      - Class II: Moderately hazardous (LD50 5-50) – carbofuran, dimethoate
      - Class III: Slightly hazardous (LD50 50-500) – 2,4-D, malathion
      - Class IV: Unlikely to cause acute hazard (LD50 > 500) – pyrethrins, sulphur

   7. chemical-mixing-calculations.png
      A 2D diagram showing chemical mixing calculations:
      - Read the label (recommended dosage)
      - Calculate spray volume needed
      - Calculate amount of chemical needed
      - Mix carefully (add water, chemical, then water)
      - Example calculation with a knapsack sprayer

   8. knapsack-sprayer-parts.png
      A 2D diagram showing the parts of a knapsack sprayer:
      - Tank (holds liquid)
      - Pump (creates pressure)
      - Lance (spray wand) with trigger
      - Nozzle (controls spray pattern)
      - Hose (connects tank to lance)
      - Strainer (filter)
      - Pressure regulator
      - Harness (straps)
      Label each part with its function.

   ============================================================ */