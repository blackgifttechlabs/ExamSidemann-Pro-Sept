import { AgricultureLessonImage as AgricultureImage } from '../../../common/AgricultureLessonImage';
import React, { useState, useRef } from 'react';

/**
 * Topic: Crop Husbandry – Full component with sticky navigation,
 * container cards (9px border-radius), lesson illustrations,
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
      id: 'structure-flowering-plants',
      title: 'Structure of Flowering Plants',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Internal Structure (Tissue Distribution) of Root, Stem, Leaf">
            <p>
              <strong>Definition:</strong> Plants are made up of different tissues
              that are organised into organs (roots, stems, leaves). Each tissue has
              a specific function, and the arrangement of tissues (tissue distribution)
              varies between organs.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Internal Structure of a Root</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Epidermis:</strong>
                <br />
                <strong>Location:</strong> Outer layer of the root.
                <br />
                <strong>Function:</strong> Protects the root and absorbs water and
                minerals. Root hairs (extensions of epidermal cells) increase surface area.
              </li>
              <li>
                <strong>Cortex:</strong>
                <br />
                <strong>Location:</strong> Beneath the epidermis, made of parenchyma cells.
                <br />
                <strong>Function:</strong> Stores food and transports water and
                minerals from the epidermis to the centre of the root.
              </li>
              <li>
                <strong>Endodermis:</strong>
                <br />
                <strong>Location:</strong> Inner layer of the cortex.
                <br />
                <strong>Function:</strong> Regulates the movement of water and minerals
                into the vascular tissue (Casparian strip forces water to pass through
                cell membranes).
              </li>
              <li>
                <strong>Pericycle:</strong>
                <br />
                <strong>Location:</strong> Layer inside the endodermis.
                <br />
                <strong>Function:</strong> Gives rise to lateral roots and is involved
                in secondary growth.
              </li>
              <li>
                <strong>Vascular tissue (stele):</strong>
                <br />
                <strong>Xylem:</strong> Transports water and minerals from roots to
                the rest of the plant. In the root, xylem is arranged in a star-like
                pattern (protoxylem and metaxylem).
                <br />
                <strong>Phloem:</strong> Transports sugars and other organic nutrients
                from leaves to other parts of the plant. Phloem is located between the
                arms of the xylem.
              </li>
            </ul>

            <AgricultureImage
              fileName="root-internal-structure.webp"
              alt="A 2D diagram showing the internal structure of a dicot root with epidermis, cortex, endodermis, pericycle, xylem, and phloem labelled"
              caption="Internal structure of a dicot root: tissues and their functions."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Internal Structure of a Stem</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Epidermis:</strong>
                <br />
                <strong>Location:</strong> Outer layer of the stem.
                <br />
                <strong>Function:</strong> Protects the stem, reduces water loss
                (cuticle), and may have stomata for gas exchange.
              </li>
              <li>
                <strong>Cortex:</strong>
                <br />
                <strong>Location:</strong> Between epidermis and vascular tissue.
                <br />
                <strong>Function:</strong> Stores food and provides support.
              </li>
              <li>
                <strong>Vascular bundles (in dicots):</strong>
                <br />
                <strong>Arrangement:</strong> In a ring (dicots) or scattered (monocots).
                <br />
                <strong>Xylem:</strong> Inner side of the bundle, transports water.
                <br />
                <strong>Phloem:</strong> Outer side of the bundle, transports food.
                <br />
                <strong>Cambium:</strong> (In dicots) a layer of meristematic cells
                between xylem and phloem that produces secondary growth (width).
              </li>
              <li>
                <strong>Pith:</strong>
                <br />
                <strong>Location:</strong> Centre of the stem (in dicots).
                <br />
                <strong>Function:</strong> Stores food.
              </li>
            </ul>

            <AgricultureImage
              fileName="stem-internal-structure.webp"
              alt="A 2D diagram showing the internal structure of a dicot stem with epidermis, cortex, vascular bundles (xylem, phloem, cambium), and pith labelled"
              caption="Internal structure of a dicot stem: tissues and their functions."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Internal Structure of a Leaf</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Epidermis:</strong>
                <br />
                <strong>Upper epidermis:</strong> Outer layer on the top of the leaf.
                Usually covered with a waxy cuticle to reduce water loss.
                <br />
                <strong>Lower epidermis:</strong> Outer layer on the bottom of the leaf.
                Contains stomata (pores) for gas exchange.
              </li>
              <li>
                <strong>Mesophyll:</strong>
                <br />
                <strong>Palisade mesophyll:</strong> Upper part of the mesophyll.
                Cells are columnar and contain many chloroplasts. The main site of
                photosynthesis.
                <br />
                <strong>Spongy mesophyll:</strong> Lower part of the mesophyll.
                Cells are irregularly shaped with air spaces. Allows gas exchange.
              </li>
              <li>
                <strong>Veins (vascular bundles):</strong>
                <br />
                <strong>Xylem:</strong> Transports water and minerals to the leaf.
                <br />
                <strong>Phloem:</strong> Transports sugars away from the leaf.
              </li>
              <li>
                <strong>Stomata:</strong>
                <br />
                <strong>Location:</strong> Usually on the lower epidermis.
                <br />
                <strong>Function:</strong> Allow carbon dioxide to enter for photosynthesis
                and oxygen and water vapour to exit. Controlled by guard cells.
              </li>
            </ul>

            <AgricultureImage
              fileName="leaf-internal-structure.webp"
              alt="A 2D diagram showing the internal structure of a dicot leaf with upper epidermis, palisade mesophyll, spongy mesophyll, lower epidermis, stomata, and vascular bundle labelled"
              caption="Internal structure of a dicot leaf: tissues and their functions."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Epidermis:</strong> protective outer layer</li>
            <li><strong>Cortex:</strong> storage and transport</li>
            <li><strong>Xylem:</strong> water transport</li>
            <li><strong>Phloem:</strong> food transport</li>
            <li><strong>Mesophyll:</strong> photosynthesis tissue</li>
            <li><strong>Stomata:</strong> gas exchange pores</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'plant-processes',
      title: 'Plant Processes',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Water and Nutrient Uptake">
            <p>
              <strong>Definition:</strong> Plants absorb water and minerals from the
              soil through their roots. This process involves several mechanisms:
              osmosis, diffusion, active uptake, and imbibition.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Osmosis:</strong>
                <br />
                <strong>Definition:</strong> The movement of water from a region of
                higher water concentration (low solute) to a region of lower water
                concentration (high solute) across a selectively permeable membrane.
                <br />
                <strong>Role in plants:</strong> Water enters root hairs by osmosis
                because the soil solution is dilute (higher water concentration) and
                the root hair cell sap is concentrated (lower water concentration).
              </li>
              <li>
                <strong>Diffusion:</strong>
                <br />
                <strong>Definition:</strong> The movement of particles (molecules or
                ions) from a region of higher concentration to lower concentration.
                <br />
                <strong>Role in plants:</strong> Carbon dioxide enters leaves by
                diffusion through stomata. Oxygen exits by diffusion.
              </li>
              <li>
                <strong>Active uptake (Active transport):</strong>
                <br />
                <strong>Definition:</strong> The movement of ions across a membrane
                against a concentration gradient, using energy (ATP).
                <br />
                <strong>Role in plants:</strong> Root cells actively take up mineral
                ions (e.g., nitrate, phosphate) from the soil, even when the soil
                concentration is lower than in the root.
              </li>
              <li>
                <strong>Imbibition:</strong>
                <br />
                <strong>Definition:</strong> The absorption of water by solid substances
                (e.g., seed coat) causing swelling.
                <br />
                <strong>Role in plants:</strong> Imbibition is the first step in
                germination – water is absorbed by the seed coat, causing it to swell
                and initiate germination.
              </li>
            </ul>

            <AgricultureImage
              fileName="water-nutrient-uptake.webp"
              alt="A 2D diagram showing water and nutrient uptake mechanisms: osmosis, diffusion, active uptake, and imbibition with arrows and labels"
              caption="Mechanisms of water and nutrient uptake in plants."
            />
          </SubtopicCard>

          <SubtopicCard title="Transpiration Stream, Stomata, and Wilting">
            <p>
              <strong>Definition:</strong> The transpiration stream is the continuous
              flow of water from the roots to the leaves through the xylem, driven by
              evaporation from the leaves.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">The Transpiration Stream</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Steps:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Water is absorbed by root hairs through osmosis.</li>
                  <li>Water moves through the cortex to the xylem.</li>
                  <li>Water is pulled up the xylem by tension created by transpiration
                    (cohesion-tension theory).</li>
                  <li>Water evaporates from the leaves through stomata (transpiration).</li>
                </ol>
              </li>
              <li>
                <strong>Role of stomata:</strong>
                <br />
                <strong>Definition:</strong> Stomata are small pores on the leaf
                surface (usually lower epidermis) that allow gas exchange and transpiration.
                <br />
                <strong>Function:</strong> They open to allow CO₂ in for photosynthesis
                and release O₂ and water vapour. They close to reduce water loss.
              </li>
              <li>
                <strong>Factors affecting transpiration rate:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Temperature:</strong> Higher temperature increases
                    evaporation and transpiration rate.
                  </li>
                  <li>
                    <strong>Humidity:</strong> Lower humidity (drier air) increases
                    transpiration rate.
                  </li>
                  <li>
                    <strong>Wind:</strong> Wind removes water vapour from around the
                    leaf, increasing transpiration rate.
                  </li>
                  <li>
                    <strong>Light:</strong> Light stimulates stomata to open,
                    increasing transpiration.
                  </li>
                  <li>
                    <strong>Soil moisture:</strong> If soil is dry, water uptake is
                    limited, reducing transpiration.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Wilting:</strong>
                <br />
                <strong>Definition:</strong> Wilting occurs when plants lose more
                water through transpiration than they can absorb from the soil.
                <br />
                <strong>Causes:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Drought (soil moisture deficit).</li>
                  <li>High temperatures.</li>
                  <li>Strong winds.</li>
                  <li>Root damage (pests, diseases).</li>
                </ul>
                <br />
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Temporary wilting:</strong> Occurs during the hottest
                    part of the day; plants recover at night when temperatures drop.
                  </li>
                  <li>
                    <strong>Permanent wilting:</strong> Occurs when soil moisture is
                    so low that plants cannot recover; leads to death.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="transpiration-stream.webp"
              alt="A 2D diagram showing the transpiration stream: water uptake from roots, movement up xylem, and evaporation from leaves through stomata"
              caption="The transpiration stream: water movement from roots to leaves."
            />
          </SubtopicCard>

          <SubtopicCard title="Photosynthesis">
            <p>
              <strong>Definition:</strong> Photosynthesis is the process by which
              green plants use sunlight, carbon dioxide, and water to produce glucose
              (food) and oxygen.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Gaseous Exchange in Photosynthesis</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Carbon dioxide (CO₂) enters leaves through
                stomata. Water (H₂O) is absorbed by roots and transported to leaves.
              </li>
              <li>
                <strong>Outputs:</strong> Oxygen (O₂) is released as a by-product
                through stomata. Glucose is produced and used or stored.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Requirements for Photosynthesis</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Chlorophyll:</strong>
                <br />
                <strong>Definition:</strong> A green pigment found in chloroplasts
                that absorbs light energy. It captures the energy from sunlight.
              </li>
              <li>
                <strong>Carbon dioxide (CO₂):</strong>
                <br />
                <strong>Source:</strong> Enters leaves through stomata from the atmosphere.
              </li>
              <li>
                <strong>Light:</strong>
                <br />
                <strong>Source:</strong> Sunlight provides the energy for photosynthesis.
                The intensity and quality of light affect the rate.
              </li>
              <li>
                <strong>Water (H₂O):</strong>
                <br />
                <strong>Source:</strong> Absorbed by roots from the soil.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Word and Chemical Equations</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Word equation:</strong>
                <br />
                Carbon dioxide + Water → Glucose + Oxygen (in the presence of sunlight and chlorophyll)
              </li>
              <li>
                <strong>Chemical equation:</strong>
                <br />
                6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂ (sunlight + chlorophyll)
              </li>
            </ul>

            <AgricultureImage
              fileName="photosynthesis-equation.webp"
              alt="A 2D diagram showing the photosynthesis process with inputs (sunlight, CO2, water) and outputs (glucose, oxygen) and the word/chemical equation"
              caption="Photosynthesis: inputs, outputs, and equations."
            />
          </SubtopicCard>

          <SubtopicCard title="Translocation and Plant Food Storage Organs">
            <p>
              <strong>Definition:</strong> Translocation is the movement of
              organic nutrients (sugars, amino acids) from the leaves (sources) to
              other parts of the plant (sinks) through the phloem.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Translocation process:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>In leaves, glucose is converted into sucrose (transport sugar).</li>
                  <li>Sucrose is loaded into the phloem sieve tubes (active transport).</li>
                  <li>Water enters the phloem by osmosis, creating pressure that drives
                    the sap to sinks (roots, fruits, developing seeds).</li>
                  <li>At the sink, sucrose is unloaded and used or stored.</li>
                </ul>
              </li>
              <li>
                <strong>Plant food storage organs:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Roots:</strong> Carrots, beetroot, sweet potatoes
                    store carbohydrates (sugars, starch).
                  </li>
                  <li>
                    <strong>Tubers:</strong> Potatoes, yams, cassava store starch.
                  </li>
                  <li>
                    <strong>Bulbs:</strong> Onions, garlic store carbohydrates in
                    fleshy leaves.
                  </li>
                  <li>
                    <strong>Seeds:</strong> Beans, maize, groundnuts store food in
                    cotyledons or endosperm.
                  </li>
                  <li>
                    <strong>Fruits:</strong> Tomatoes, oranges, mangoes store sugars
                    and other nutrients.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="translocation-storage-organs.webp"
              alt="A 2D diagram showing translocation (sugar movement in phloem) and plant food storage organs (roots, tubers, bulbs, seeds, fruits)"
              caption="Translocation and plant food storage organs."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Plant Processes</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Uptake:</strong> osmosis, diffusion, active uptake, imbibition</li>
            <li><strong>Transpiration:</strong> water movement, stomata, factors</li>
            <li><strong>Wilting:</strong> temporary vs permanent</li>
            <li><strong>Photosynthesis:</strong> CO₂ + H₂O → glucose + O₂</li>
            <li><strong>Translocation:</strong> food movement in phloem</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'crop-improvement',
      title: 'Crop Improvement',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Importance of Crop Breeding (Maize)">
            <p>
              <strong>Definition:</strong> Crop breeding is the process of selecting
              and crossing plants to develop new varieties with desirable traits such
              as higher yields, disease resistance, drought tolerance, and improved
              quality.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Importance of Crop Breeding – Maize Example</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Higher yields:</strong> Breeding has developed high-yielding
                maize varieties that produce more grain per hectare.
              </li>
              <li>
                <strong>Disease resistance:</strong> Maize varieties resistant to
                diseases like maize streak virus, grey leaf spot, and rust have
                been developed.
              </li>
              <li>
                <strong>Drought tolerance:</strong> Breeding has produced varieties
                that can survive and produce yields under water stress (drought).
              </li>
              <li>
                <strong>Adaptation to different environments:</strong> Different
                varieties are bred for different agro-ecological zones in Zimbabwe
                (Regions 1-5).
              </li>
              <li>
                <strong>Improved quality:</strong> Breeding has improved grain quality
                (protein content, oil content) and milling characteristics.
              </li>
              <li>
                <strong>Reduced production costs:</strong> Resistant varieties reduce
                the need for pesticides, lowering production costs.
              </li>
            </ul>

            <AgricultureImage
              fileName="maize-breeding-importance.webp"
              alt="A 2D diagram showing the importance of maize breeding: higher yields, disease resistance, drought tolerance, adaptation, quality, and cost reduction"
              caption="Importance of crop breeding in maize."
            />
          </SubtopicCard>

          <SubtopicCard title="Heterosis (Hybrid Vigour)">
            <p>
              <strong>Definition:</strong> Heterosis, also known as hybrid vigour,
              is the improved or increased function of any biological quality in
              a hybrid offspring compared to its parents.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics of heterosis:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Increased growth rate and size.</li>
                  <li>Higher yields.</li>
                  <li>Improved resistance to diseases and pests.</li>
                  <li>Better adaptability to adverse conditions.</li>
                </ul>
              </li>
              <li>
                <strong>Why it happens:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Inbreeding depression (reduced vigour from self-pollination) is
                    overcome by crossing different inbred lines.
                  </li>
                  <li>
                    Heterozygosity (different alleles) leads to better performance
                    than homozygosity.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Example in maize:</strong> Hybrid maize varieties show
                significant yield increases over open-pollinated varieties (OPVs).
                Hybrids are widely used in commercial maize production.
              </li>
            </ul>

            <AgricultureImage
              fileName="heterosis-hybrid-vigour.webp"
              alt="A 2D diagram showing heterosis (hybrid vigour): comparison of hybrid offspring with parents showing increased size and yield"
              caption="Heterosis (hybrid vigour) in crop breeding."
            />
          </SubtopicCard>

          <SubtopicCard title="Open vs Controlled Pollination">
            <p>
              <strong>Definition:</strong> Pollination is the transfer of pollen from
              anther to stigma. It can be open (natural) or controlled (human-assisted).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Open Pollination</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Pollination that occurs naturally without
                human intervention, usually by wind, insects, or water.
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Simple and low cost.</li>
                  <li>Maintains genetic diversity.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Uncontrolled crossing leads to variable offspring.</li>
                  <li>Inbreeding can reduce vigour.</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong> Maize, sorghum, and millet are often
                open-pollinated in traditional farming.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Controlled Pollination</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Pollination that is carefully managed
                by humans to achieve specific crosses.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Emasculation (removing anthers) to prevent self-pollination.</li>
                  <li>Bagging (covering flowers) to prevent unwanted pollen.</li>
                  <li>Hand pollination (transferring pollen manually).</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Produces uniform, predictable offspring.</li>
                  <li>Allows selection of desirable traits.</li>
                  <li>Used to create hybrids (heterosis).</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Labour-intensive and costly.</li>
                  <li>Reduces genetic diversity.</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong> Hybrid maize production, hybrid tomato
                and pepper seed production.
              </li>
            </ul>

            <AgricultureImage
              fileName="open-controlled-pollination.webp"
              alt="A 2D diagram comparing open pollination (natural) and controlled pollination (emasculation, bagging, hand pollination)"
              caption="Open vs controlled pollination."
            />
          </SubtopicCard>

          <SubtopicCard title="Single, Double, and Three-Way Hybrids">
            <p>
              <strong>Definition:</strong> Hybrids are produced by crossing different
              inbred lines. The number of lines crossed determines the type of hybrid.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Single cross hybrid:</strong>
                <br />
                <strong>Definition:</strong> Produced by crossing two inbred lines.
                <br />
                <strong>Formula:</strong> A × B
                <br />
                <strong>Characteristics:</strong> Highest heterosis, uniform, but
                expensive to produce (requires inbred lines).
                <br />
                <strong>Example:</strong> SC403 maize hybrid (A × B).
              </li>
              <li>
                <strong>Double cross hybrid:</strong>
                <br />
                <strong>Definition:</strong> Produced by crossing two single-cross
                hybrids.
                <br />
                <strong>Formula:</strong> (A × B) × (C × D)
                <br />
                <strong>Characteristics:</strong> Less heterosis than single cross,
                but cheaper to produce (fewer inbred lines needed).
                <br />
                <strong>Example:</strong> Some older maize hybrids.
              </li>
              <li>
                <strong>Three-way cross hybrid:</strong>
                <br />
                <strong>Definition:</strong> Produced by crossing a single cross
                hybrid with an inbred line.
                <br />
                <strong>Formula:</strong> (A × B) × C
                <br />
                <strong>Characteristics:</strong> Heterosis between single cross and
                double cross. Cheaper than single cross.
                <br />
                <strong>Example:</strong> Many commercial maize hybrids.
              </li>
            </ul>

            <AgricultureImage
              fileName="hybrid-types.webp"
              alt="A 2D diagram showing single cross, double cross, and three-way cross hybrids with their formulas and characteristics"
              caption="Single, double, and three-way hybrid types."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Crop Improvement</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Breeding importance:</strong> yields, resistance, drought tolerance</li>
            <li><strong>Heterosis:</strong> hybrid vigour</li>
            <li><strong>Open pollination:</strong> natural, variable</li>
            <li><strong>Controlled pollination:</strong> human-assisted, uniform</li>
            <li><strong>Hybrids:</strong> single (A×B), double (AB×CD), three-way (AB×C)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'crop-production',
      title: 'Crop Production',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Land Preparation: Reasons, Procedures, Tillage Types">
            <p>
              <strong>Definition:</strong> Land preparation is the process of preparing
              the soil for planting crops. It involves various operations to create
              a suitable seedbed and ensure good crop establishment.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Reasons for Land Preparation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                To create a suitable seedbed (fine, even soil for germination).
              </li>
              <li>
                To control weeds (remove existing weeds and their seeds).
              </li>
              <li>
                To improve soil aeration (allow oxygen to reach roots).
              </li>
              <li>
                To improve water infiltration (reduce runoff and erosion).
              </li>
              <li>
                To incorporate organic matter (crop residues, manure).
              </li>
              <li>
                To control pests and diseases (expose pests to predators).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Land Preparation Procedures</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Clearing:</strong> Remove weeds, stones, and debris.
              </li>
              <li>
                <strong>Primary tillage:</strong> Deep ploughing to break up hardpan
                and incorporate organic matter.
              </li>
              <li>
                <strong>Secondary tillage:</strong> Harrowing and cultivating to
                break up clods and level the soil.
              </li>
              <li>
                <strong>Levelling:</strong> Ensure uniform surface for planting.
              </li>
              <li>
                <strong>Making ridges or furrows:</strong> Depending on the crop.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Primary vs Secondary Tillage</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Primary tillage:</strong> Initial cultivation (ploughing).
                <br />
                <strong>Purpose:</strong> Break hardpan, incorporate residues, prepare
                soil for secondary tillage.
                <br />
                <strong>Implements:</strong> Mould board plough, disc plough, chisel plough.
              </li>
              <li>
                <strong>Secondary tillage:</strong> Lighter cultivation after ploughing.
                <br />
                <strong>Purpose:</strong> Break clods, level soil, create fine seedbed.
                <br />
                <strong>Implements:</strong> Harrow, cultivator, ridger, planter.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Conservation / Minimum Tillage</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Tillage practices that minimise soil
                disturbance and maintain soil cover.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Zero tillage (no-till): Direct planting without ploughing.</li>
                  <li>Minimum tillage: Only shallow tillage.</li>
                  <li>Mulch tillage: Crop residues left on surface.</li>
                </ul>
              </li>
              <li>
                <strong>Benefits:</strong> Reduces erosion, improves soil organic matter,
                saves labour and fuel.
              </li>
              <li>
                <strong>Implements:</strong> No-till planters, direct seeders.
              </li>
            </ul>

            <AgricultureImage
              fileName="land-preparation-tillage.webp"
              alt="A 2D diagram showing land preparation procedures, primary tillage (plough), secondary tillage (harrow), and conservation tillage (no-till)"
              caption="Land preparation: primary and secondary tillage, and conservation tillage."
            />
          </SubtopicCard>

          <SubtopicCard title="Growing a Cereal: Maize">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Maize (Zea mays)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Cultivars (varieties):</strong>
                <br />
                <strong>Open-pollinated varieties (OPV):</strong> SC403, SC513, and
                local varieties. These are less costly and can be saved for seed.
                <br />
                <strong>Hybrid varieties:</strong> SC403, SC519, SC627, and others
                developed by Seed Co and other companies. These have higher yields
                but seed must be bought each year.
              </li>
              <li>
                <strong>Seed rate:</strong>
                <br />
                <strong>Recommended:</strong> 20-25 kg/ha for planting in rows.
                <br />
                <strong>Spacing:</strong> 75 cm between rows, 25-30 cm between plants
                (one seed per station).
              </li>
              <li>
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Planting:</strong> Plant at the onset of the rainy season
                    (October-November). Depth: 3-5 cm.
                  </li>
                  <li>
                    <strong>Fertilisation:</strong> Apply basal fertiliser (e.g., NPK
                    7-14-7) at planting and top-dress with nitrogen (e.g., ammonium
                    nitrate) at knee-high and tasselling.
                  </li>
                  <li>
                    <strong>Weeding:</strong> Weed at least twice (at 2-3 weeks and
                    6-8 weeks after planting).
                  </li>
                  <li>
                    <strong>Irrigation:</strong> In dry areas, supplementary irrigation
                    may be needed.
                  </li>
                  <li>
                    <strong>Pest and disease control:</strong> Monitor for maize
                    stalk borer, armyworm, and maize streak virus. Apply pesticides
                    as needed.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Harvesting:</strong>
                <br />
                <strong>Signs of maturity:</strong> Ears have dried husks; grains are
                hard and shiny with a black layer at the base.
                <br />
                <strong>Method:</strong> Hand picking or mechanical harvesting.
                <br />
                <strong>Time:</strong> 110-140 days after planting, depending on variety.
              </li>
              <li>
                <strong>Storage:</strong>
                <br />
                <strong>Requirements:</strong> Dry, cool, and well-ventilated area.
                Grain moisture should be below 13% to prevent mould and insect damage.
                <br />
                <strong>Methods:</strong> Store in bags, silos, or granaries. Use
                insecticides or hermetic storage (e.g., Purdue Improved Crop Storage –
                PICS bags) to control pests.
              </li>
              <li>
                <strong>Marketing:</strong>
                <br />
                <strong>Channels:</strong> Sell to the Grain Marketing Board (GMB),
                local markets, or directly to processors.
                <br />
                <strong>Quality requirements:</strong> Good grain quality (no mould,
                low moisture, free from insect damage).
              </li>
            </ul>

            <AgricultureImage
              fileName="maize-production.webp"
              alt="A realistic photograph showing maize production stages: planting, growth, harvest, and storage"
              caption="Maize production: from planting to harvest and storage."
            />
          </SubtopicCard>

          <SubtopicCard title="Growing a Legume: Groundnuts">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Groundnuts (Arachis hypogaea)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Cultivars (varieties):</strong>
                <br />
                <strong>Runner types:</strong> Natal Common, Red Spanish.
                <br />
                <strong>Bunch types:</strong> R840, R860, and other improved varieties
                with better disease resistance and higher yields.
              </li>
              <li>
                <strong>Seed rate:</strong>
                <br />
                <strong>Recommended:</strong> 40-60 kg/ha of shelled seed.
                <br />
                <strong>Spacing:</strong> 30-40 cm between rows, 15-20 cm between plants.
              </li>
              <li>
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Planting:</strong> Plant at the onset of the rainy season.
                    Depth: 3-5 cm. Inoculate seed with Rhizobium to improve nitrogen fixation.
                  </li>
                  <li>
                    <strong>Fertilisation:</strong> Apply phosphorus (e.g., single
                    superphosphate) at planting. Nitrogen is usually not needed if
                    the crop is well-nodulated.
                  </li>
                  <li>
                    <strong>Weeding:</strong> Weed at 3-4 weeks and 6-8 weeks after
                    planting. Earthing-up (ridging) around the plants helps pod development.
                  </li>
                  <li>
                    <strong>Irrigation:</strong> Groundnuts are drought-tolerant but
                    benefit from moisture during flowering and pod-filling stages.
                  </li>
                  <li>
                    <strong>Pest and disease control:</strong> Monitor for leaf spot,
                    rust, aphids, and groundnut rosette virus. Apply fungicides and
                    insecticides as needed.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Harvesting:</strong>
                <br />
                <strong>Signs of maturity:</strong> Leaves turn yellow and start
                falling; pods have dark veins and the inside of the shell is dark.
                <br />
                <strong>Method:</strong> Pull the plants by hand or use a digger.
                Leave to dry in the field for a few days.
                <br />
                <strong>Time:</strong> 90-120 days after planting, depending on variety.
              </li>
              <li>
                <strong>Storage:</strong>
                <br />
                <strong>Requirements:</strong> Dry, cool area. Shelled groundnuts
                should be stored in clean, dry containers. Moisture content below 8%
                to prevent aflatoxin contamination.
                <br />
                <strong>Methods:</strong> Store in bags or hermetic containers.
              </li>
              <li>
                <strong>Marketing:</strong>
                <br />
                <strong>Channels:</strong> Sell to local markets, oil processors,
                or export.
                <br />
                <strong>Quality requirements:</strong> Good oil content, low aflatoxin,
                and clean (free from foreign matter).
              </li>
            </ul>

            <AgricultureImage
              fileName="groundnut-production.webp"
              alt="A realistic photograph showing groundnut production: planting, flowering, pegging, harvesting, and drying"
              caption="Groundnut production: from planting to harvest and storage."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Crop Production</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Land prep:</strong> clearing, ploughing, harrowing</li>
            <li><strong>Tillage:</strong> primary (plough), secondary (harrow)</li>
            <li><strong>Conservation tillage:</strong> zero tillage, minimum tillage</li>
            <li><strong>Maize:</strong> OPVs and hybrids, seed rate 20-25 kg/ha, harvest 110-140 days</li>
            <li><strong>Groundnuts:</strong> runner/bunch types, seed rate 40-60 kg/ha, harvest 90-120 days</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'crop-protection',
      title: 'Crop Protection',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Pest Control Methods">
            <p>
              <strong>Definition:</strong> Pest control refers to the management of
              pests that damage crops. There are several methods, each with advantages
              and disadvantages.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Chemical control:</strong>
                <br />
                <strong>Definition:</strong> Use of pesticides (insecticides, fungicides,
                herbicides) to kill pests.
                <br />
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Quick and effective.</li>
                  <li>Can target specific pests.</li>
                  <li>Easy to apply.</li>
                </ul>
                <br />
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Environmental pollution.</li>
                  <li>Health risks to farmers and consumers.</li>
                  <li>Pest resistance can develop.</li>
                  <li>Kills beneficial organisms.</li>
                  <li>Expensive.</li>
                </ul>
              </li>
              <li>
                <strong>Biological control:</strong>
                <br />
                <strong>Definition:</strong> Use of natural enemies (predators,
                parasitoids, pathogens) to control pests.
                <br />
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Environmentally friendly.</li>
                  <li>No health risks.</li>
                  <li>Long-term control.</li>
                  <li>Cost-effective.</li>
                </ul>
                <br />
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Slower than chemical control.</li>
                  <li>May not be effective against all pests.</li>
                  <li>Requires knowledge of natural enemies.</li>
                </ul>
                <br />
                <strong>Examples:</strong> Ladybirds (aphids), parasitic wasps
                (caterpillars), Bacillus thuringiensis (Bt) bacteria.
              </li>
              <li>
                <strong>Cultural control:</strong>
                <br />
                <strong>Definition:</strong> Farming practices that reduce pest problems.
                <br />
                <strong>Examples:</strong> Crop rotation, intercropping, timely planting,
                removal of crop residues.
                <br />
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Environmentally safe.</li>
                  <li>Low cost.</li>
                  <li>Can be integrated with other methods.</li>
                </ul>
                <br />
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>May not be effective alone.</li>
                  <li>Requires planning and knowledge.</li>
                </ul>
              </li>
              <li>
                <strong>Mechanical control:</strong>
                <br />
                <strong>Definition:</strong> Physical removal or destruction of pests.
                <br />
                <strong>Examples:</strong> Hand picking, traps, barriers (nets, fences).
                <br />
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>No chemicals used.</li>
                  <li>Effective for small infestations.</li>
                </ul>
                <br />
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Labour-intensive.</li>
                  <li>Not practical for large areas.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="pest-control-methods.webp"
              alt="A 2D diagram showing pest control methods: chemical, biological, cultural, and mechanical control with advantages and disadvantages"
              caption="Pest control methods: advantages and disadvantages."
            />
          </SubtopicCard>

          <SubtopicCard title="Integrated Pest Management (IPM)">
            <p>
              <strong>Definition:</strong> Integrated Pest Management (IPM) is a
              holistic approach to pest control that combines different methods
              (cultural, biological, mechanical, chemical) in a coordinated way to
              minimise pest damage while reducing risks to health and the environment.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Significance of IPM</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Reduces chemical use:</strong> IPM prioritises non-chemical
                methods, reducing the use of pesticides.
              </li>
              <li>
                <strong>Prevents pest resistance:</strong> By using multiple methods,
                pests are less likely to develop resistance.
              </li>
              <li>
                <strong>Protects beneficial organisms:</strong> Biological control
                and selective pesticides protect natural enemies.
              </li>
              <li>
                <strong>Environmentally sustainable:</strong> Reduces pollution and
                environmental damage.
              </li>
              <li>
                <strong>Cost-effective:</strong> Reduces pesticide costs in the long run.
              </li>
              <li>
                <strong>Promotes healthy ecosystems:</strong> Supports biodiversity
                and ecosystem services.
              </li>
            </ul>

            <AgricultureImage
              fileName="ipm-significance.webp"
              alt="A 2D diagram showing the significance of Integrated Pest Management (IPM): reduces chemical use, prevents resistance, protects beneficials, sustainable, cost-effective"
              caption="Significance of Integrated Pest Management (IPM)."
            />
          </SubtopicCard>

          <SubtopicCard title="Mode of Action of Main Pesticide Groups">
            <p>
              <strong>Definition:</strong> The mode of action is the way a pesticide
              works to kill or control the target pest.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Organophosphates (e.g., malathion, dimethoate):</strong>
                <br />
                <strong>Mode of action:</strong> Inhibit acetylcholinesterase, an
                enzyme essential for nerve function. Causes nervous system failure.
                <br />
                <strong>Use:</strong> Broad-spectrum insecticides.
              </li>
              <li>
                <strong>Carbamates (e.g., carbaryl, methiocarb):</strong>
                <br />
                <strong>Mode of action:</strong> Also inhibit acetylcholinesterase
                but reversibly.
                <br />
                <strong>Use:</strong> Insecticides.
              </li>
              <li>
                <strong>Pyrethroids (e.g., deltamethrin, cypermethrin):</strong>
                <br />
                <strong>Mode of action:</strong> Affect sodium channels in nerve cells,
                causing repetitive nerve firing and paralysis.
                <br />
                <strong>Use:</strong> Synthetic insecticides.
              </li>
              <li>
                <strong>Neonicotinoids (e.g., imidacloprid):</strong>
                <br />
                <strong>Mode of action:</strong> Act on nicotinic acetylcholine
                receptors in insects, causing nervous system disruption.
                <br />
                <strong>Use:</strong> Systemic insecticides.
              </li>
              <li>
                <strong>Fungicides (e.g., mancozeb, copper oxychloride):</strong>
                <br />
                <strong>Mode of action:</strong> Inhibit fungal growth by affecting
                enzymes or cell membranes. Some are contact fungicides (stay on surface),
                others are systemic (absorbed by plant).
              </li>
            </ul>

            <AgricultureImage
              fileName="pesticide-modes-action.webp"
              alt="A 2D diagram showing the mode of action of main pesticide groups: organophosphates, carbamates, pyrethroids, neonicotinoids, and fungicides"
              caption="Mode of action of main pesticide groups."
            />
          </SubtopicCard>

          <SubtopicCard title="Disease Control Methods">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Cultural control:</strong>
                <br />
                <strong>Examples:</strong> Crop rotation, removing infected plant
                debris, adjusting planting date to avoid disease, using disease-free seed.
              </li>
              <li>
                <strong>Chemical control:</strong>
                <br />
                <strong>Examples:</strong> Fungicides, bactericides, and nematicides
                applied to control diseases.
                <br />
                <strong>Correct chemical selection:</strong> Choose chemicals labelled
                for the specific disease. For example, use copper-based fungicides for
                bacterial diseases; use mancozeb or chlorothalonil for fungal blights.
              </li>
              <li>
                <strong>Biological control:</strong>
                <br />
                <strong>Examples:</strong> Use of beneficial microorganisms (Trichoderma,
                Bacillus spp.) to suppress soil-borne pathogens.
              </li>
              <li>
                <strong>Resistant varieties:</strong>
                <br />
                <strong>Examples:</strong> Use crop varieties bred for resistance to
                specific diseases (e.g., maize streak virus resistant maize).
              </li>
            </ul>

            <AgricultureImage
              fileName="disease-control-methods.webp"
              alt="A 2D diagram showing disease control methods: cultural, chemical, biological, and resistant varieties"
              caption="Disease control methods and correct chemical selection."
            />
          </SubtopicCard>

          <SubtopicCard title="Weed Control Methods">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Cultural control:</strong>
                <br />
                <strong>Examples:</strong> Crop rotation, intercropping, using cover
                crops, and timely planting to give crops a competitive advantage.
              </li>
              <li>
                <strong>Mechanical control:</strong>
                <br />
                <strong>Examples:</strong> Hand weeding, hoeing, cultivation, and
                mulching.
              </li>
              <li>
                <strong>Biological control:</strong>
                <br />
                <strong>Examples:</strong> Using natural enemies (e.g., insects or
                pathogens) that attack specific weeds (limited use).
              </li>
              <li>
                <strong>Chemical control:</strong>
                <br />
                <strong>Examples:</strong> Herbicides.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Selective vs Non-Selective Herbicides</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Selective herbicides:</strong>
                <br />
                <strong>Definition:</strong> Kill specific types of plants (e.g.,
                broad-leaved weeds) without harming the crop.
                <br />
                <strong>Examples:</strong> 2,4-D (kills broad-leaved weeds in cereal
                crops), Bentazone (kills weeds in soybean), Atrazine (controls weeds
                in maize).
                <br />
                <strong>Advantages:</strong> Can be applied to growing crops without
                damage.
              </li>
              <li>
                <strong>Non-selective herbicides:</strong>
                <br />
                <strong>Definition:</strong> Kill all plants they contact.
                <br />
                <strong>Examples:</strong> Glyphosate (Roundup), Paraquat.
                <br />
                <strong>Uses:</strong> Used for total vegetation control (e.g., before
                planting, or on roadsides).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Timing of Herbicide Application</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pre-emergence:</strong> Applied before the crop emerges or
                shortly after planting, before weeds germinate.
                <br />
                <strong>Advantage:</strong> Prevents weed competition early.
              </li>
              <li>
                <strong>Post-emergence:</strong> Applied after the crop and weeds
                have emerged.
                <br />
                <strong>Advantage:</strong> Can target specific weed species.
              </li>
              <li>
                <strong>Soil-applied:</strong> Applied to the soil surface to prevent
                weed germination (pre-emergence).
              </li>
              <li>
                <strong>Foliar-applied:</strong> Applied to leaves (post-emergence).
              </li>
            </ul>

            <AgricultureImage
              fileName="herbicide-types-timing.webp"
              alt="A 2D diagram showing selective vs non-selective herbicides and timing of herbicide application (pre-emergence, post-emergence)"
              caption="Selective vs non-selective herbicides and timing of herbicide application."
            />
          </SubtopicCard>

          <SubtopicCard title="Calibrating a Knapsack Sprayer">
            <p>
              <strong>Definition:</strong> Calibration is the process of adjusting
              a sprayer to deliver the correct amount of pesticide per unit area.
              Proper calibration ensures effective pest control and minimises waste.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps for Calibration</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1: Check the sprayer:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Ensure the sprayer is clean and in good working condition.</li>
                  <li>Check nozzles for wear or blockages.</li>
                  <li>Make sure the pressure is correct (recommended for the nozzle type).</li>
                </ul>
              </li>
              <li>
                <strong>Step 2: Determine the nozzle output:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fill the sprayer with water.</li>
                  <li>Spray into a measuring container for a set time (e.g., 1 minute).</li>
                  <li>Measure the volume collected.</li>
                </ul>
              </li>
              <li>
                <strong>Step 3: Determine the walking speed:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Mark a 50m or 100m distance.</li>
                  <li>Walk at a steady pace while spraying (with water only).</li>
                  <li>Measure the time taken.</li>
                  <li>Calculate speed (m/min).</li>
                </ul>
              </li>
              <li>
                <strong>Step 4: Calculate the spray width (swath width):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Measure the effective spray width (distance between nozzle or
                    boom width). For a knapsack, it is the width of the spray fan.</li>
                </ul>
              </li>
              <li>
                <strong>Step 5: Calculate the application rate:</strong>
                <br />
                <strong>Formula:</strong>
                <br />
                Application rate (L/ha) = (output per minute (L/min) × 600) ÷ (swath width (m) × speed (m/min))
              </li>
              <li>
                <strong>Step 6: Adjust settings:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>If the application rate is too high or low, adjust pressure,
                    nozzle size, or walking speed.</li>
                  <li>Re-calibrate until the correct rate is achieved.</li>
                </ul>
              </li>
              <li>
                <strong>Step 7: Mix pesticide correctly:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Calculate the amount of pesticide needed for the water volume
                    to cover the target area.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="knapsack-calibration.webp"
              alt="A 2D diagram showing the steps for calibrating a knapsack sprayer: checking equipment, measuring output, timing walking speed, calculating application rate"
              caption="Calibrating a knapsack sprayer: steps and calculations."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Crop Protection</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Pest control:</strong> chemical, biological, cultural, mechanical</li>
            <li><strong>IPM:</strong> integrated approach, reduces chemical use</li>
            <li><strong>Pesticide groups:</strong> organophosphates, pyrethroids, neonicotinoids</li>
            <li><strong>Disease control:</strong> cultural, chemical, resistant varieties</li>
            <li><strong>Weed control:</strong> herbicides, selective vs non-selective</li>
            <li><strong>Calibration:</strong> adjust sprayer for correct application rate</li>
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
            Explore the internal structure of plants, plant processes (water uptake,
            transpiration, photosynthesis), crop improvement, production of cereals
            and legumes, and comprehensive crop protection methods.
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
                  <strong className="text-white">Plant Structure:</strong> Roots have
                  epidermis, cortex, endodermis, pericycle, and vascular tissue (xylem,
                  phloem). Stems have epidermis, cortex, vascular bundles, and pith.
                  Leaves have epidermis, mesophyll (palisade and spongy), and veins.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Plant Processes:</strong> Water uptake
                  (osmosis, diffusion, active uptake, imbibition), transpiration
                  (stomata, factors affecting rate), photosynthesis (CO₂ + H₂O →
                  glucose + O₂), and translocation (food movement in phloem).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Crop Improvement:</strong> Breeding
                  improves yield, resistance, and drought tolerance. Heterosis (hybrid
                  vigour) enhances performance. Open vs controlled pollination; single,
                  double, and three-way hybrids are used in maize.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Crop Production:</strong> Land
                  preparation includes primary and secondary tillage. Conservation
                  tillage reduces erosion. Maize and groundnuts are key crops with
                  specific cultivars, seed rates, management, and marketing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Crop Protection:</strong> Pest
                  control methods include chemical, biological, cultural, and mechanical.
                  IPM integrates these. Pesticides have different modes of action.
                  Disease control uses cultural, chemical, and resistant varieties.
                  Herbicides can be selective or non-selective; timing is crucial.
                  Knapsack sprayers must be calibrated for effective application.
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

   --- PLANT STRUCTURE IMAGES (2D DIAGRAM STYLE) ---

   1. root-internal-structure.png
      A 2D diagram showing the internal structure of a dicot root with all tissues
      labelled: epidermis, cortex, endodermis, pericycle, xylem, phloem.

   2. stem-internal-structure.png
      A 2D diagram showing the internal structure of a dicot stem with epidermis,
      cortex, vascular bundles (xylem, phloem, cambium), and pith labelled.

   3. leaf-internal-structure.png
      A 2D diagram showing the internal structure of a dicot leaf with upper
      epidermis, palisade mesophyll, spongy mesophyll, lower epidermis, stomata,
      and vascular bundle labelled.

   --- PLANT PROCESSES IMAGES (2D DIAGRAM STYLE) ---

   4. water-nutrient-uptake.png
      A 2D diagram showing water and nutrient uptake mechanisms: osmosis, diffusion,
      active uptake, and imbibition with arrows and explanations.

   5. transpiration-stream.png
      A 2D diagram showing the transpiration stream: water uptake from roots,
      movement up xylem, and evaporation from leaves through stomata.

   6. photosynthesis-equation.png
      A 2D diagram showing the photosynthesis process with inputs (sunlight, CO₂,
      water) and outputs (glucose, oxygen) and the word/chemical equation.

   7. translocation-storage-organs.png
      A 2D diagram showing translocation (sugar movement in phloem) and plant food
      storage organs (roots, tubers, bulbs, seeds, fruits).

   --- CROP IMPROVEMENT IMAGES (2D DIAGRAM STYLE) ---

   8. maize-breeding-importance.png
      A 2D diagram showing the importance of maize breeding: higher yields,
      disease resistance, drought tolerance, adaptation, quality, and cost reduction.

   9. heterosis-hybrid-vigour.png
      A 2D diagram showing heterosis (hybrid vigour): comparison of hybrid offspring
      with parents showing increased size and yield.

   10. open-controlled-pollination.png
       A 2D diagram comparing open pollination (natural) and controlled pollination
       (emasculation, bagging, hand pollination).

   11. hybrid-types.png
       A 2D diagram showing single cross (A×B), double cross (AB×CD), and three-way
       cross (AB×C) hybrids with their formulas and characteristics.

   --- CROP PRODUCTION IMAGES (2D DIAGRAM AND REALISTIC) ---

   12. land-preparation-tillage.png
       A 2D diagram showing land preparation procedures, primary tillage (plough),
       secondary tillage (harrow), and conservation tillage (no-till).

   13. maize-production.png
       A realistic photograph showing maize production stages: planting, growth,
       harvest, and storage.

   14. groundnut-production.png
       A realistic photograph showing groundnut production: planting, flowering,
       pegging, harvesting, and drying.

   --- CROP PROTECTION IMAGES (2D DIAGRAM STYLE) ---

   15. pest-control-methods.png
       A 2D diagram showing pest control methods: chemical, biological, cultural,
       and mechanical control with advantages and disadvantages.

   16. ipm-significance.png
       A 2D diagram showing the significance of Integrated Pest Management (IPM):
       reduces chemical use, prevents resistance, protects beneficials, sustainable,
       cost-effective.

   17. pesticide-modes-action.png
       A 2D diagram showing the mode of action of main pesticide groups:
       organophosphates, carbamates, pyrethroids, neonicotinoids, and fungicides.

   18. disease-control-methods.png
       A 2D diagram showing disease control methods: cultural, chemical, biological,
       and resistant varieties with correct chemical selection.

   19. herbicide-types-timing.png
       A 2D diagram showing selective vs non-selective herbicides and timing of
       herbicide application (pre-emergence, post-emergence).

   20. knapsack-calibration.png
       A 2D diagram showing the steps for calibrating a knapsack sprayer:
       checking equipment, measuring output, timing walking speed, calculating
       application rate.

   ============================================================ */