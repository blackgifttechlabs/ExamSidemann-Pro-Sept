import { AgricultureLessonImage as AnimalImage } from '../../../common/AgricultureLessonImage';
import React, { useState, useRef } from 'react';

/**
 * Topic: Animal Husbandry
 * Full component with sticky navigation, container cards (9px border-radius),
 * lesson illustrations, and auto‑scroll + double‑highlight on heading.
 */
export const AnimalHusbandry: React.FC = () => {
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

  // ---------- Section content ----------
  const sections: TopicSection[] = [
    {
      id: 'anatomy-physiology',
      title: 'Anatomy and Physiology – Digestive Systems',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Parts and Functions of the Digestive System of a Ruminant">
            <p>
              <strong>Definition:</strong> Ruminants are animals that digest
              plant‑based food through fermentation in a specialised stomach with
              four compartments. The digestive system is adapted to break down
              cellulose (plant fibre) using symbiotic microbes.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Structure of the Ruminant Digestive System</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Mouth:</strong>
                <br />
                <strong>Function:</strong> Prehension (grasping) and initial chewing
                of food. Saliva contains enzymes (amylase) and buffers (bicarbonate)
                to neutralise acid.
              </li>
              <li>
                <strong>Oesophagus:</strong>
                <br />
                <strong>Function:</strong> Transports food from the mouth to the
                rumen. Allows regurgitation for rumination (chewing the cud).
              </li>
              <li>
                <strong>Rumen (largest chamber – 80% of stomach volume):</strong>
                <br />
                <strong>Function:</strong> Fermentation vat. Houses billions of
                bacteria, protozoa, and fungi that break down cellulose into
                volatile fatty acids (VFAs). Absorbs VFAs and some nutrients.
              </li>
              <li>
                <strong>Reticulum (honeycomb – 5% of volume):</strong>
                <br />
                <strong>Function:</strong> Traps heavy objects (e.g., stones) and
                assists in regurgitation for rumination. Fermentation also occurs here.
              </li>
              <li>
                <strong>Omasum (manyplies – 8% of volume):</strong>
                <br />
                <strong>Function:</strong> Absorbs water, electrolytes, and some
                nutrients. Mechanically grinds and squeezes food particles.
              </li>
              <li>
                <strong>Abomasum (true stomach – 7% of volume):</strong>
                <br />
                <strong>Function:</strong> Secretes gastric juices (hydrochloric
                acid and enzymes). Digestive process similar to monogastric
                animals. Digests microbial protein and remaining nutrients.
              </li>
              <li>
                <strong>Small intestine:</strong>
                <br />
                <strong>Function:</strong> Digestion of proteins, fats, and
                carbohydrates by enzymes. Absorption of nutrients (amino acids,
                fatty acids, simple sugars) through the intestinal wall.
              </li>
              <li>
                <strong>Caecum and large intestine:</strong>
                <br />
                <strong>Function:</strong> Fermentation of undigested fibre,
                absorption of water and electrolytes, formation of faeces.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Parts and Functions of the Digestive System of a Non‑Ruminant (Monogastric)">
            <p>
              <strong>Definition:</strong> Non‑ruminants (monogastrics) have a
              single‑chambered stomach. They cannot efficiently digest cellulose
              and rely on enzymatic digestion.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Mouth:</strong>
                <br />
                <strong>Function:</strong> Prehension, chewing, and mixing food
                with saliva. Enzymes (salivary amylase) begin starch digestion.
              </li>
              <li>
                <strong>Oesophagus:</strong>
                <br />
                <strong>Function:</strong> Transports food from mouth to stomach
                via peristalsis.
              </li>
              <li>
                <strong>Stomach (simple, single‑chambered):</strong>
                <br />
                <strong>Function:</strong> Stores and churns food. Secretes
                gastric juice (HCl and pepsin) to digest proteins. Kills pathogens.
                No fermentation.
              </li>
              <li>
                <strong>Small intestine (duodenum, jejunum, ileum):</strong>
                <br />
                <strong>Function:</strong> Digestion of proteins, fats, and
                carbohydrates. Absorption of nutrients into the bloodstream.
                Enzymes from the pancreas and bile from the liver aid digestion.
              </li>
              <li>
                <strong>Caecum (large, in some animals e.g., pigs, horses):</strong>
                <br />
                <strong>Function:</strong> Some fermentation of fibre, especially
                in non‑ruminants like horses and rabbits (hindgut fermenters).
              </li>
              <li>
                <strong>Large intestine:</strong>
                <br />
                <strong>Function:</strong> Absorption of water, electrolytes, and
                remaining nutrients. Formation of faeces.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Differences Between Ruminant and Non‑Ruminant Digestive Systems">
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Feature</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Ruminant</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Non‑Ruminant</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Stomach</td>
                  <td className="border border-slate-300 px-4 py-2">Four chambers (rumen, reticulum, omasum, abomasum)</td>
                  <td className="border border-slate-300 px-4 py-2">Single chamber (simple stomach)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Rumination (cud chewing)</td>
                  <td className="border border-slate-300 px-4 py-2">Yes</td>
                  <td className="border border-slate-300 px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Cellulose digestion</td>
                  <td className="border border-slate-300 px-4 py-2">Efficient (microbial fermentation)</td>
                  <td className="border border-slate-300 px-4 py-2">Limited (no fermentation; rely on fibre in hindgut)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Microbes</td>
                  <td className="border border-slate-300 px-4 py-2">Present (bacteria, protozoa, fungi in rumen)</td>
                  <td className="border border-slate-300 px-4 py-2">Limited (mostly in caecum/large intestine of some species)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Feed type</td>
                  <td className="border border-slate-300 px-4 py-2">Herbivores (grass, hay, silage)</td>
                  <td className="border border-slate-300 px-4 py-2">Omnivores (pigs, poultry) or herbivores with hindgut fermentation (horses, rabbits)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Examples</td>
                  <td className="border border-slate-300 px-4 py-2">Cattle, sheep, goats</td>
                  <td className="border border-slate-300 px-4 py-2">Pigs, poultry, horses, rabbits</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Protein quality</td>
                  <td className="border border-slate-300 px-4 py-2">Microbial protein provides high‑quality protein</td>
                  <td className="border border-slate-300 px-4 py-2">Need dietary protein sources</td>
                </tr>
              </tbody>
            </table>

            <AnimalImage
              fileName="ruminant-nonruminant-digestive-systems.webp"
              alt="A 2D diagram showing the ruminant digestive system (four stomach chambers) and the non-ruminant digestive system (single stomach) with labelled parts and functions"
              caption="Comparison of ruminant and non‑ruminant digestive systems."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Ruminant:</strong> four‑stomach animal (cattle, sheep, goats)</li>
            <li><strong>Rumen:</strong> fermentation vat (microbes break down fibre)</li>
            <li><strong>Abomasum:</strong> true stomach (gastric digestion)</li>
            <li><strong>Non‑ruminant:</strong> single stomach (pigs, poultry, rabbits)</li>
            <li><strong>Monogastric:</strong> single‑chambered stomach</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'nutrition',
      title: 'Nutrition',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Classification of Feedstuffs">
            <p>
              <strong>Definition:</strong> Feedstuffs are the materials given to
              livestock to meet their nutritional needs. They are classified into
              three main categories: roughages, concentrates, and straight feeds.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Roughages</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Feeds that are high in fibre (cellulose)
                and low in digestible energy. They are bulky and have low nutrient
                density.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Dry roughages:</strong> Hay (grass hay, lucerne hay),
                    straw, crop residues (maize stover, groundnut shells).
                  </li>
                  <li>
                    <strong>Silages:</strong> Maize silage, grass silage (fermented
                    moist roughages).
                  </li>
                  <li>
                    <strong>Pastures and fodders:</strong> Natural pasture,
                    planted pastures (e.g., Rhodes grass, Kikuyu grass), forage
                    crops (lucerne, fodder maize).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Nutritional value:</strong> High fibre (15–35%), low protein
                (except legumes), low energy. Important for rumen function.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Concentrates</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Feeds that are low in fibre and high
                in digestible nutrients (energy or protein). They are used to
                supplement roughages and improve animal performance.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Energy concentrates:</strong> Grains (maize, wheat,
                    sorghum, barley), maize meal, wheat bran, molasses.
                  </li>
                  <li>
                    <strong>Protein concentrates:</strong> Soyabean meal, cottonseed
                    cake, sunflower cake, fish meal, meat and bone meal.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Nutritional value:</strong> Low fibre (&lt;15%), high
                energy, moderate to high protein.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Straight Feeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Feeds that are made from a single
                ingredient and used individually. They are usually mixed with
                other feeds to create a balanced diet.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Maize (whole grain).</li>
                  <li>Cottonseed cake.</li>
                  <li>Lucerne hay (as a single feed).</li>
                  <li>Fish meal.</li>
                </ul>
              </li>
              <li>
                <strong>Nutritional value:</strong> Varies by ingredient. They are
                mixed in rations to meet specific nutrient requirements.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Preparing a Balanced Ration">
            <p>
              <strong>Definition:</strong> A balanced ration is a feed mixture that
              provides all the nutrients an animal needs in the correct proportions
              for maintenance, growth, reproduction, or production (meat, milk, eggs).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps in Preparing a Balanced Ration</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>1. Identify the animal's requirements:</strong>
                <br />
                Determine the specific nutrient needs (energy, protein, minerals,
                vitamins) based on age, weight, production stage (e.g., lactating,
                growing, laying), and production level.
              </li>
              <li>
                <strong>2. Select available feedstuffs:</strong>
                <br />
                List locally available and affordable feedstuffs – roughages and
                concentrates. Know their nutrient composition (using feed tables).
              </li>
              <li>
                <strong>3. Formulate the mixture:</strong>
                <br />
                Use the Pearson square method (for two ingredients) or linear
                programming (for multiple ingredients) to calculate proportions.
              </li>
              <li>
                <strong>4. Mix ingredients:</strong>
                <br />
                Weigh and mix ingredients thoroughly to ensure even distribution
                of nutrients. Add vitamins and mineral premixes.
              </li>
              <li>
                <strong>5. Test and adjust:</strong>
                <br />
                Observe animal performance and adjust the ration as needed
                (e.g., increase protein if animals are not growing).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example: Pearson Square Method</h4>
            <p>
              <strong>Problem:</strong> Formulate a ration for growing pigs with
              16% crude protein (CP) using maize (8% CP) and soyabean meal (44% CP).
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1:</strong> Draw a square.
              </li>
              <li>
                <strong>Step 2:</strong> Put the desired protein (16%) in the centre.
              </li>
              <li>
                <strong>Step 3:</strong> Put the protein of each feed in the
                corners (left side).
              </li>
              <li>
                <strong>Step 4:</strong> Subtract diagonally (always use positive
                numbers):
                <br />
                44 – 16 = 28 parts maize
                <br />
                16 – 8 = 8 parts soyabean meal
              </li>
              <li>
                <strong>Step 5:</strong> Total parts = 28 + 8 = 36
              </li>
              <li>
                <strong>Step 6:</strong> Percentage of each feed:
                <br />
                Maize: (28 ÷ 36) × 100 = 77.8%
                <br />
                Soyabean meal: (8 ÷ 36) × 100 = 22.2%
              </li>
            </ul>

            <AnimalImage
              fileName="balanced-ration-pearson-square.webp"
              alt="A 2D diagram showing the Pearson square method for ration formulation"
              caption="Preparing a balanced ration using the Pearson square method."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Nutrition Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Roughages:</strong> high fibre (hay, silage, pastures)</li>
            <li><strong>Concentrates:</strong> low fibre, high energy/protein (grains, oil cakes)</li>
            <li><strong>Straight feeds:</strong> single ingredients (maize, fish meal)</li>
            <li><strong>Balanced ration:</strong> correct nutrients for the animal</li>
            <li><strong>Pearson square:</strong> calculates proportions of two feeds</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'small-livestock-production',
      title: 'Small Livestock Production – Rabbits, Layers, Indigenous Chickens',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Rabbits">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Breeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Meat breeds:</strong> New Zealand White, California White,
                Flemish Giant. High growth rate, good meat yield.
              </li>
              <li>
                <strong>Fur breeds:</strong> Angora, Rex. Produced for wool/fur.
              </li>
              <li>
                <strong>Dual‑purpose:</strong> Chinchilla, Satin. Good for meat
                and fur.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Housing Site Selection and Design</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Site selection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Well‑drained area (avoid waterlogging).</li>
                  <li>Sheltered from strong winds.</li>
                  <li>Access to clean water and electricity.</li>
                  <li>Away from predators (dogs, snakes, birds of prey).</li>
                </ul>
              </li>
              <li>
                <strong>Housing design:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Hutches:</strong> Individual cages for breeding animals.
                    Size: 60×60×45 cm for medium breeds. Wire floor for hygiene.
                  </li>
                  <li>
                    <strong>Colony housing:</strong> Group pens for young rabbits.
                    Floor: 0.5–0.8 m² per animal. Deep litter (wood shavings, straw).
                  </li>
                  <li>
                    <strong>Features:</strong> Cleanable, predator‑proof, good
                    ventilation, nesting boxes for does.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Nutritional Requirements</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>High fibre:</strong> Hay (lucerne, grass) ad libitum.
                Fresh grass, vegetables, and weeds.
              </li>
              <li>
                <strong>Concentrates:</strong> Commercial rabbit pellets (16–18% CP)
                or a mixture of maize, wheat bran, soyabean meal, and minerals.
              </li>
              <li>
                <strong>Fresh water:</strong> Clean, fresh water available at all times.
              </li>
              <li>
                <strong>Succulents:</strong> Carrots, cabbage, leaves (supplement
                for vitamins and water).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Young Animal Management (Kindling – Birth)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide nesting box with soft bedding (straw) 5–7 days before kindling.</li>
              <li>Does pull hair from their belly to line the nest.</li>
              <li>After kindling, check kits (babies) and remove dead ones.</li>
              <li>Does only nurse 1–2 times per day (natural). Ensure kits are warm and protected.</li>
              <li>Start offering solid feed (pellets, hay) to kits at 2–3 weeks.</li>
              <li>Wean at 4–6 weeks (separate bucks from does).</li>
              <li>Vaccinate against viral diseases (myxomatosis, rabbit haemorrhagic disease).</li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Layers (Commercial Egg Production)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Breeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Commercial layers:</strong> Hy‑Line, Lohmann, ISA Brown,
                Rhode Island Red. Bred for high egg production (250–300 eggs/year).
              </li>
              <li>
                <strong>Dual‑purpose:</strong> Sussex, Plymouth Rock. Good eggs
                and meat.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Housing Site Selection and Design</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Site:</strong> Well‑drained, sunny, sheltered from wind,
                access to water and electricity.
              </li>
              <li>
                <strong>Housing types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Deep litter:</strong> Floor system with wood shavings
                    or rice hulls. Space: 4–5 birds/m². Good ventilation, regular
                    litter turnover.
                  </li>
                  <li>
                    <strong>Battery cages (commercial):</strong> Stacked cages with
                    automatic feeding and watering. High density, easy management,
                    but welfare concerns.
                  </li>
                  <li>
                    <strong>Free‑range:</strong> Birds have outdoor access. Lower
                    density, better welfare, but higher disease risk.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Nutritional Requirements</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Starter feed (0–6 weeks):</strong> 20–22% CP, high energy.
              </li>
              <li>
                <strong>Grower feed (6–18 weeks):</strong> 16–18% CP, controlled
                growth to prevent obesity.
              </li>
              <li>
                <strong>Layer feed (18+ weeks):</strong> 16–18% CP, 3–4% calcium
                for eggshell formation.
              </li>
              <li>
                <strong>Water:</strong> Clean, fresh water available at all times.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Young Animal Management (Chicks – Pullets)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Brooding (0–4 weeks):</strong>
                <br />
                Temperature: 32–35°C in week 1, reduce by 2°C/week. Provide starter
                feed and water. Vaccinate against Marek's disease, Newcastle, and
                infectious bronchitis.
              </li>
              <li>
                <strong>Growing period (4–18 weeks):</strong>
                <br />
                Transfer to grower house. Provide grower feed. De‑beak at 8–10 weeks
                to prevent feather pecking.
              </li>
              <li>
                <strong>Laying period (18+ weeks):</strong>
                <br />
                Transfer to layer house. Provide layer feed and supplement with
                calcium (oyster shell, limestone). Increase light gradually to
                14–16 hours/day for egg production.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Indigenous Chickens (Local Breeds)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Breeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong> Hardy, disease‑resistant, low
                management requirements. Good for scavenging. Examples: Naked Neck,
                Zulu, Ovambo, Potchefstroom Koekoek (South Africa).
              </li>
              <li>
                <strong>Zimbabwe:</strong> Local breeds are kept in rural areas for
                meat, eggs, and income.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Housing Site Selection and Design</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Site:</strong> Well‑drained, sheltered, with access to
                scavenging area (grass, insects).
              </li>
              <li>
                <strong>Housing:</strong> Simple shelters (huts, small houses) with
                perches (roosts) for sleeping. Nests for laying. Deep litter or
                sweep daily.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Nutritional Requirements</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Scavenging:</strong> Supplement with grains (maize, sorghum),
                kitchen scraps, and protein sources (insects, worms).
              </li>
              <li>
                <strong>Supplemental feed:</strong> Provide commercial layers' mash
                or home‑mixed feed (maize + soyabean meal + minerals).
              </li>
              <li>
                <strong>Water:</strong> Clean water available at all times.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Young Animal Management</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Breeding: Natural incubation (broody hens) or artificial incubators.</li>
              <li>Chicks: Provide warmth (natural or artificial). Feed chick starter.</li>
              <li>Weaning: Chicks are independent after 6–8 weeks.</li>
              <li>Vaccination: Newcastle disease (important).</li>
            </ul>

            <AnimalImage
              fileName="small-livestock-production.webp"
              alt="A 2D diagram showing breeds, housing, nutrition, and young animal management for rabbits, layers, and indigenous chickens"
              caption="Small livestock production: rabbits, layers, and indigenous chickens."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Small Livestock</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rabbits:</strong> hutches, high fibre, wean at 4–6 weeks</li>
            <li><strong>Layers:</strong> cage/deep litter, layer feed (16–18% CP, Ca), brooding</li>
            <li><strong>Indigenous:</strong> hardy, scavenging, simple housing</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'non-ruminants',
      title: 'Non‑Ruminants – Pigs',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Pig Breeds">
            <p>
              <strong>Definition:</strong> Pigs are non‑ruminant (monogastric)
              animals, kept for pork (meat) and bacon. Different breeds are suited
              for different purposes.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Large White (Yorkshire):</strong>
                <br />
                White colour, large litters, good mothering ability. Used as a
                dam (female) breed.
              </li>
              <li>
                <strong>Landrace:</strong>
                <br />
                White, long body with large ears. High fertility and milk production.
                Common dam breed.
              </li>
              <li>
                <strong>Duroc:</strong>
                <br />
                Red/brown colour, fast growth, good carcass quality. Used as a
                sire (male) breed.
              </li>
              <li>
                <strong>Hampshire:</strong>
                <br />
                Black with white belt, good meat quality. Used as a sire breed.
              </li>
              <li>
                <strong>Berkshire:</strong>
                <br />
                Black with white points, excellent meat marbling. Good for high‑quality pork.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Housing Systems for Pigs">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Site selection:</strong>
                <br />
                Well‑drained, sheltered from wind, access to water and electricity,
                away from residential areas (odour concerns).
              </li>
              <li>
                <strong>Housing types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Farrowing houses:</strong>
                    <br />
                    For sows and piglets. Equipped with farrowing crates to prevent
                    piglets being crushed. Warm (30°C for piglets, 20°C for sows).
                    Space: 2×2 m per sow.
                  </li>
                  <li>
                    <strong>Creep areas:</strong>
                    <br />
                    For young piglets to access feed and warmth while sow is excluded.
                  </li>
                  <li>
                    <strong>Weaner/grower houses:</strong>
                    <br />
                    For pigs from weaning (6–8 weeks) to finishing. Space: 0.5–1 m²/pig.
                    Deep litter (straw, sawdust) or slatted floors.
                  </li>
                  <li>
                    <strong>Finishing houses:</strong>
                    <br />
                    For pigs to market weight (80–100 kg). Space: 1–2 m²/pig.
                  </li>
                  <li>
                    <strong>Boar pens:</strong>
                    <br />
                    Separate pens for breeding boars. Strong fences, large area for exercise.
                  </li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Management to Maturity (Growth Phases)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Breeding and Farrowing</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Breeding:</strong>
                <br />
                Sows reach puberty at 5–8 months. Oestrus cycle every 18–21 days.
                Serve (mating) occurs 2–3 times during oestrus.
              </li>
              <li>
                <strong>Gestation:</strong>
                <br />
                114 days (3 months, 3 weeks, 3 days). Provide pregnancy feed (sow
                ration) and increase during late pregnancy.
              </li>
              <li>
                <strong>Farrowing:</strong>
                <br />
                Move sow to farrowing house 5–7 days before due date. Provide nesting
                material (straw). Assist if necessary.
              </li>
              <li>
                <strong>Piglet management:</strong>
                <br />
                Clean piglets, clip teeth (to prevent injury to udder), and cut
                umbilical cord. Ensure they suckle colostrum (first milk) within
                the first 24 hours.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Lactation and Weaning</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Lactation:</strong>
                <br />
                Sow feeds piglets for 3–4 weeks. Provide high‑quality feed (lactation
                ration) to the sow. Creep feed piglets from 2 weeks.
              </li>
              <li>
                <strong>Weaning:</strong>
                <br />
                Wean at 3–4 weeks. Separate piglets from sow. Provide weaner feed
                (18–20% CP) and clean water.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Growing (Weaner to Finishing)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Weaner stage (6–20 kg):</strong>
                <br />
                Provide weaner feed (18–20% CP). Control temperature and ventilation.
                Vaccinate against common diseases (erysipelas, parvovirus).
              </li>
              <li>
                <strong>Grower stage (20–50 kg):</strong>
                <br />
                Transition to grower feed (16–18% CP). Maintain group housing (10–15 pigs per pen).
              </li>
              <li>
                <strong>Finishing stage (50–100+ kg):</strong>
                <br />
                Provide finisher feed (14–16% CP). Animals reach market weight at
                5–6 months. Monitor daily weight gain (700–900 g/day).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Marketing</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Pigs are marketed at 80–110 kg live weight.</li>
              <li>Slaughter at approved abattoirs.</li>
              <li>Marketing channels: live markets, direct to abattoirs, or contracts.</li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Nutritional Requirements of Pigs">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Starter (0–10 kg):</strong> 20–22% CP, high energy, creep feed.
              </li>
              <li>
                <strong>Weaner (10–25 kg):</strong> 18–20% CP, feed pellets or mash.
              </li>
              <li>
                <strong>Grower (25–50 kg):</strong> 16–18% CP, increasing fibre.
              </li>
              <li>
                <strong>Finisher (50–100 kg):</strong> 14–16% CP, lower protein.
              </li>
              <li>
                <strong>Gestating sow:</strong> 12–14% CP, controlled energy to
                prevent obesity.
              </li>
              <li>
                <strong>Lactating sow:</strong> 16–18% CP, high energy for milk production.
              </li>
              <li>
                <strong>Boars:</strong> 14–16% CP, maintain condition.
              </li>
            </ul>

            <AnimalImage
              fileName="pig-production-cycle.webp"
              alt="A 2D diagram showing pig breeds, housing systems, and management stages from farrowing to marketing"
              caption="Pig production: breeds, housing, and management to maturity."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Pig Production</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Breeds:</strong> Large White, Landrace, Duroc, Hampshire</li>
            <li><strong>Housing:</strong> farrowing, weaner, grower, finishing</li>
            <li><strong>Stages:</strong> breeding → farrowing → weaning → growing → finishing</li>
            <li><strong>Nutrition:</strong> starter (22%), weaner (20%), grower (18%), finisher (16%)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'animal-health',
      title: 'Animal Health – Notifiable Diseases',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Notifiable Diseases?">
            <p>
              <strong>Definition:</strong> Notifiable diseases are diseases that
              must be reported to government veterinary authorities by law. They
              are usually highly contagious, have a significant economic impact,
              or can affect human health (zoonotic).
            </p>
            <p>
              In Zimbabwe, notifiable diseases include anthrax, foot‑and‑mouth
              disease, Newcastle disease, and trypanosomiasis.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Bacterial Disease – Anthrax">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              <strong>Anthrax</strong> is a bacterial disease caused by <em>Bacillus anthracis</em>.
              It affects cattle, sheep, goats, and humans (zoonotic). The bacteria
              produce spores that survive in the environment for years.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Signs and Symptoms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Acute (peracute):</strong> Sudden death without warning
                (common in cattle).
              </li>
              <li>
                <strong>Sub‑acute:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>High fever (40–42°C).</li>
                  <li>Difficulty breathing (dyspnoea).</li>
                  <li>Swelling of neck, throat, or other body parts.</li>
                  <li>Bloody discharge from nostrils, mouth, and anus.</li>
                  <li>Bloody, black, tarry faeces.</li>
                  <li>Death within 1–3 days.</li>
                </ul>
              </li>
              <li>
                <strong>In humans:</strong> Skin anthrax (black sore), inhalation
                anthrax (flu‑like symptoms), or gastrointestinal anthrax.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Control Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Vaccination:</strong>
                <br />
                Annual vaccination of livestock in high‑risk areas.
              </li>
              <li>
                <strong>Quarantine:</strong>
                <br />
                Isolate and quarantine sick animals to prevent spread.
              </li>
              <li>
                <strong>Proper disposal:</strong>
                <br />
                Burn or bury dead animals deeply (with lime) to kill spores.
                <strong>Do not open carcasses</strong> (spores are released).
              </li>
              <li>
                <strong>Treatment:</strong>
                <br />
                Antibiotics (penicillin, tetracycline) in early stages.
              </li>
              <li>
                <strong>Biosecurity:</strong>
                <br />
                Limit contact between livestock and contaminated areas (known
                anthrax zones).
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Viral Disease – Foot‑and‑Mouth Disease (FMD)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              <strong>Foot‑and‑mouth disease</strong> is a highly contagious viral
              disease caused by the <em>FMD virus</em> (seven serotypes). It affects
              cloven‑hoofed animals (cattle, sheep, goats, pigs). It does not affect
              humans.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Signs and Symptoms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Fever (40–41°C).</strong>
              </li>
              <li>
                <strong>Blisters (vesicles):</strong>
                <br />
                On the tongue, gums, lips, nostrils, and between the hooves.
              </li>
              <li>
                <strong>Excessive salivation (drooling) and frothing.</strong>
              </li>
              <li>
                <strong>Lameness:</strong>
                <br />
                Animals are reluctant to walk due to painful hooves.
              </li>
              <li>
                <strong>Reduced appetite, weight loss, and drop in milk production.</strong>
              </li>
              <li>
                <strong>Abortion in pregnant females.</strong>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Control Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Vaccination:</strong>
                <br />
                Routine vaccination in high‑risk areas (serotype‑specific).
              </li>
              <li>
                <strong>Quarantine and movement restrictions:</strong>
                <br />
                Strict quarantine of infected areas. Ban on movement of animals
                and animal products.
              </li>
              <li>
                <strong>Culling (slaughter):</strong>
                <br />
                Infected animals are slaughtered and destroyed to prevent spread.
              </li>
              <li>
                <strong>Biosecurity:</strong>
                <br />
                Disinfection of vehicles, equipment, and footwear. Limit visitors
                to farms.
              </li>
              <li>
                <strong>Surveillance:</strong>
                <br />
                Regular monitoring and reporting of outbreaks.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Viral Disease – Newcastle Disease (Poultry)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              <strong>Newcastle disease</strong> is a highly contagious viral
              disease of poultry, caused by the <em>Newcastle disease virus (NDV)</em>.
              It affects chickens, turkeys, and other birds.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Signs and Symptoms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Respiratory signs:</strong>
                <br />
                Sneezing, coughing, gasping, nasal discharge.
              </li>
              <li>
                <strong>Nervous signs:</strong>
                <br />
                Twisting of the head, circling, paralysis of legs and wings.
              </li>
              <li>
                <strong>Digestive signs:</strong>
                <br />
                Greenish diarrhoea, loss of appetite.
              </li>
              <li>
                <strong>Drop in egg production:</strong>
                <br />
                Soft‑shelled or misshapen eggs.
              </li>
              <li>
                <strong>High mortality:</strong>
                <br />
                Up to 100% in unvaccinated flocks.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Control Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Vaccination:</strong>
                <br />
                Routine vaccination using live (e.g., La Sota) or inactivated vaccines.
              </li>
              <li>
                <strong>Biosecurity:</strong>
                <br />
                Limit visitors, disinfect equipment, and isolate sick birds.
              </li>
              <li>
                <strong>Quarantine:</strong>
                <br />
                Quarantine infected flocks and restrict movement.
              </li>
              <li>
                <strong>Culling (stamping out):</strong>
                <br />
                In severe outbreaks, destroy infected flocks.
              </li>
              <li>
                <strong>Clean and disinfect:</strong>
                <br />
                Thorough cleaning and disinfection of houses and equipment after
                depopulation.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Protozoan Disease – Trypanosomiasis (Nagana)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              <strong>Trypanosomiasis</strong> is a parasitic disease caused by
              protozoa of the genus <em>Trypanosoma</em>. It is transmitted by
              tsetse flies (<em>Glossina</em> species). It affects cattle, sheep,
              goats, horses, and other animals. It is also called <strong>nagana</strong>.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Signs and Symptoms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Intermittent fever</strong>
              </li>
              <li>
                <strong>Progressive weight loss</strong>
              </li>
              <li>
                <strong>Anaemia</strong>
              </li>
              <li>
                <strong>Rough coat</strong>
              </li>
              <li>
                <strong>Oedema (swelling) of lower parts (legs, sheath)</strong>
              </li>
              <li>
                <strong>Reduced milk production and infertility</strong>
              </li>
              <li>
                <strong>Death in chronic cases</strong>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Control Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Tsetse fly control:</strong>
                <br />
                Use of traps, targets, and insecticide‑treated cattle to reduce
                fly populations.
              </li>
              <li>
                <strong>Chemotherapy:</strong>
                <br />
                Use of trypanocidal drugs (e.g., diminazene, isometamidium).
              </li>
              <li>
                <strong>Breeding for resistance:</strong>
                <br />
                Some breeds (e.g., N'Dama cattle) are trypanotolerant.
              </li>
              <li>
                <strong>Vector control:</strong>
                <br />
                Clear vegetation (tsetse fly habitat) and use aerial spraying
                in high‑risk areas.
              </li>
              <li>
                <strong>Quarantine and movement control:</strong>
                <br />
                Restrict movement of animals from tsetse‑infested areas.
              </li>
            </ul>

            <AnimalImage
              fileName="notifiable-diseases.webp"
              alt="A 2D diagram showing signs, symptoms, and control methods for anthrax, foot-and-mouth disease, Newcastle disease, and trypanosomiasis"
              caption="Notifiable diseases: anthrax (bacterial), foot-and-mouth/Newcastle (viral), trypanosomiasis (protozoan)."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Notifiable Diseases</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Anthrax (bacterial):</strong> sudden death, blood discharge. Control: vaccination, burning.</li>
            <li><strong>FMD (viral):</strong> blisters, lameness, drooling. Control: vaccination, quarantine, culling.</li>
            <li><strong>Newcastle (viral):</strong> respiratory, nervous signs, high mortality. Control: vaccination, biosecurity.</li>
            <li><strong>Trypanosomiasis (protozoan):</strong> fever, weight loss, anaemia. Control: tsetse control, drugs.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'animal-improvement-genetics',
      title: 'Animal Improvement – Genetics',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Stages of Mitosis">
            <p>
              <strong>Definition:</strong> Mitosis is a type of cell division that
              produces two genetically identical daughter cells from a single
              parent cell. It is used for growth, repair, and replacement of cells
              in the body (somatic cells).
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Interphase (preparation):</strong>
                <br />
                The cell grows (G1), replicates its DNA (S phase), and prepares
                for division (G2). Chromosomes are not visible.
              </li>
              <li>
                <strong>Prophase:</strong>
                <br />
                Chromosomes condense and become visible. Nuclear membrane breaks
                down. Spindle fibres form.
              </li>
              <li>
                <strong>Metaphase:</strong>
                <br />
                Chromosomes align at the equator (centre) of the cell. Each
                chromosome is attached to spindle fibres.
              </li>
              <li>
                <strong>Anaphase:</strong>
                <br />
                Centromeres split, and sister chromatids are pulled to opposite
                poles of the cell. This is the shortest stage.
              </li>
              <li>
                <strong>Telophase:</strong>
                <br />
                Chromosomes arrive at poles. Nuclear membrane reforms. Chromosomes
                decondense.
              </li>
              <li>
                <strong>Cytokinesis:</strong>
                <br />
                The cytoplasm divides, creating two identical daughter cells
                (each with the same number of chromosomes as the parent).
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Stages of Meiosis">
            <p>
              <strong>Definition:</strong> Meiosis is a type of cell division that
              produces four genetically different haploid gametes (sperm or egg
              cells) from a diploid parent cell. It occurs in the reproductive
              organs. It has two divisions: Meiosis I and Meiosis II.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Meiosis I</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Prophase I:</strong>
                <br />
                Chromosomes condense. <strong>Synapsis:</strong> homologous
                chromosomes pair up (bivalent). <strong>Crossing over:</strong>
                exchange of genetic material between non‑sister chromatids.
              </li>
              <li>
                <strong>Metaphase I:</strong>
                <br />
                Homologous pairs align at the equator. Independent assortment
                occurs (random orientation).
              </li>
              <li>
                <strong>Anaphase I:</strong>
                <br />
                Homologous chromosomes separate (each still has two chromatids).
                Sister chromatids remain together.
              </li>
              <li>
                <strong>Telophase I:</strong>
                <br />
                Two haploid cells are formed (n, but chromosomes are still duplicated).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Meiosis II</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Prophase II:</strong>
                <br />
                Chromosomes condense again (no DNA replication).
              </li>
              <li>
                <strong>Metaphase II:</strong>
                <br />
                Chromosomes align at the equator.
              </li>
              <li>
                <strong>Anaphase II:</strong>
                <br />
                Centromeres split, sister chromatids separate and move to opposite poles.
              </li>
              <li>
                <strong>Telophase II:</strong>
                <br />
                Four haploid gametes are formed (each with n chromosomes,
                genetically different due to crossing over and independent assortment).
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Effects of the Environment on Genes">
            <p>
              <strong>Definition:</strong> The environment can influence how genes
              are expressed. This is called <strong>phenotypic plasticity</strong>.
              The phenotype (observable characteristics) is the result of the
              genotype (genetic makeup) interacting with the environment.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Examples</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Heat stress:</strong>
                <br />
                High temperatures can reduce milk yield in dairy cattle, even
                if the genotype has high production potential. Heat affects
                feed intake and metabolism.
              </li>
              <li>
                <strong>Nutrition:</strong>
                <br />
                Poor nutrition can result in stunted growth and poor production,
                even in animals with good genetic potential. For example, a pig
                with a high growth rate genotype will not reach that potential
                if feed is deficient.
              </li>
              <li>
                <strong>Disease and parasites:</strong>
                <br />
                Exposure to parasites or disease can reduce growth and production.
                Environmental management (hygiene, vaccination) can minimise
                these effects.
              </li>
              <li>
                <strong>Climate and altitude:</strong>
                <br />
                Some breeds are better adapted to cold, hot, or high‑altitude
                environments. A breed that performs well in one environment may
                not perform well in another.
              </li>
              <li>
                <strong>Light (for poultry):</strong>
                <br />
                Day length affects egg production in layers. Artificial lighting
                can be used to stimulate production.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Implications for Animal Breeding</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Select for adaptability:</strong>
                <br />
                Choose breeds that are adapted to the local environment.
              </li>
              <li>
                <strong>Manage the environment:</strong>
                <br />
                Provide good nutrition, health care, housing, and climate control
                to allow animals to express their genetic potential.
              </li>
              <li>
                <strong>Record keeping:</strong>
                <br />
                Record environmental conditions and animal performance to identify
                the best combinations of genetics and management.
              </li>
            </ul>

            <AnimalImage
              fileName="mitosis-meiosis-environmental-effects.webp"
              alt="A 2D diagram showing the stages of mitosis, meiosis, and the effects of environmental factors on gene expression"
              caption="Mitosis, meiosis, and environmental effects on genes."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Genetics</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Mitosis:</strong> growth, repair – 2 identical cells</li>
            <li><strong>Meiosis:</strong> gametes – 4 different cells (crossing over, independent assortment)</li>
            <li><strong>Environment:</strong> affects phenotype (nutrition, heat, disease)</li>
            <li><strong>Genotype:</strong> genetic potential; <strong>phenotype:</strong> actual expression</li>
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
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
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
      <div className="bg-[#064e3b] dark:bg-[#022c22] border-b border-emerald-800/80 pt-12 pb-10 shadow-sm">
        <div className="w-full px-[5px] sm:px-6 md:px-8 md:px-[5px] sm:px-6 md:px-8">
          <div className="inline-block px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold mb-4 backdrop-blur-sm">
            AGRICULTURE
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Animal Husbandry
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore digestive anatomy and physiology, feedstuff classification,
            small livestock production (rabbits, layers, indigenous chickens),
            pig production, notifiable diseases, and animal genetics (mitosis,
            meiosis, environmental effects).
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
          <div className="mt-12 p-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded-[9px] text-white shadow-lg">
            <h3 className="font-bold text-2xl mb-3">Key Takeaways</h3>
            <ul className="space-y-2 text-blue-100 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Digestive systems:</strong>
                  Ruminants (four stomach chambers) ferment fibre; non‑ruminants
                  (single stomach) use enzymatic digestion. Ruminants chew cud
                  and have microbes for cellulose breakdown.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Nutrition:</strong> Feedstuffs
                  are roughages (hay, silage), concentrates (grains, oil cakes),
                  and straight feeds. A balanced ration is formulated using
                  methods like the Pearson square.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Small livestock:</strong> Rabbits
                  (hutches, hay), layers (deep litter/cages, layer feed), indigenous
                  chickens (scavenging, simple housing). Each requires specific
                  management and nutrition.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Pigs:</strong> Breeds include
                  Large White, Landrace, Duroc. Housing includes farrowing, weaner,
                  grower, and finishing units. Management covers breeding,
                  farrowing, weaning, and growth phases.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Notifiable diseases:</strong>
                  Anthrax (bacterial – sudden death, vaccination, burning), FMD/Newcastle
                  (viral – blisters/respiratory signs, vaccination, quarantine),
                  Trypanosomiasis (protozoan – fever, weight loss, tsetse control).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Genetics:</strong> Mitosis (2
                  identical cells for growth), Meiosis (4 different gametes,
                  with crossing over). Environment affects gene expression
                  (phenotype), e.g., nutrition, heat, disease.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Animal Husbandry topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">Agri‑Business</span>?</>
            ) : (
              <>Next: <span className="text-blue-600">{sections[activeIndex + 1].title}</span></>
            )}
          </h3>
          <button
            type="button"
            onClick={() => {
              if (!isLastChapter) {
                handleNavigate(sections[activeIndex + 1].id);
              } else {
                alert('Proceed to Agri‑Business (next topic)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Agri‑Business →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalHusbandry;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/animal-husbandry/
   Use a mix of 2D diagram style and realistic photographs.

   --- ANATOMY AND PHYSIOLOGY ---
   1. ruminant-nonruminant-digestive-systems.png
      A split diagram: left – ruminant digestive system (mouth, rumen, reticulum,
      omasum, abomasum, intestines) with labels; right – non‑ruminant digestive
      system (mouth, oesophagus, stomach, small intestine, large intestine) with labels.

   --- NUTRITION ---
   2. balanced-ration-pearson-square.png
      A 2D diagram showing the Pearson square method with an example (maize 8% CP,
      soyabean meal 44% CP, desired 16% CP) and calculations.

   --- SMALL LIVESTOCK PRODUCTION ---
   3. small-livestock-production.png
      A 2D diagram with three sections: rabbits (hutch, breed, feed), layers
      (cage/deep litter, layer feed, brooding), indigenous chickens (scavenging,
      simple shelter, chicks).

   --- NON‑RUMINANTS (PIGS) ---
   4. pig-production-cycle.png
      A flowchart diagram showing pig breeds, housing (farrowing, weaner, grower,
      finishing), and management stages (breeding → farrowing → weaning → growing → finishing).

   --- ANIMAL HEALTH ---
   5. notifiable-diseases.png
      A 2D diagram with three panels: anthrax (bacterial – sudden death, burning),
      FMD/Newcastle (viral – blisters/respiratory signs, vaccination), trypanosomiasis
      (protozoan – tsetse fly, fever, weight loss).

   --- ANIMAL IMPROVEMENT GENETICS ---
   6. mitosis-meiosis-environmental-effects.png
      A 2D diagram showing the stages of mitosis (interphase, prophase, metaphase,
      anaphase, telophase, cytokinesis) and meiosis (Meiosis I and II, crossing over,
      independent assortment), plus environmental effects (heat, nutrition, disease)
      on gene expression.

   ============================================================ */