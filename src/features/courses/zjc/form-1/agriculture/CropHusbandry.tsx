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
      id: 'classification-plants',
      title: 'Classification of Plants',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Classification by Edible Part">
            <p>
              <strong>Definition:</strong> Plants can be classified according to the
              part of the plant that is eaten by humans or animals. This classification
              helps us understand the nutritional value, cultivation methods, and
              storage requirements of different crops.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Leaf vegetables:</strong> The leaves are the edible part.
                <br />
                <strong>Examples:</strong> Cabbage, spinach, lettuce, kale, rape,
                Swiss chard.
                <br />
                <strong>Nutritional value:</strong> Rich in vitamins (A, C, K) and minerals
                (iron, calcium). Low in calories.
                <br />
                <strong>Zimbabwe examples:</strong> Cabbage (common in urban markets),
                rape (grown in communal areas), covo (popular in rural areas).
              </li>
              <li>
                <strong>Root vegetables:</strong> The roots are the edible part.
                <br />
                <strong>Examples:</strong> Carrots, beetroot, radishes, turnips,
                sweet potatoes.
                <br />
                <strong>Nutritional value:</strong> Rich in carbohydrates (sugars, starch),
                vitamins (A, C), and minerals (potassium).
                <br />
                <strong>Zimbabwe examples:</strong> Carrots (grown in commercial farms),
                sweet potatoes (common in communal areas).
              </li>
              <li>
                <strong>Tuber vegetables:</strong> The swollen underground stems
                (tubers) are the edible part.
                <br />
                <strong>Examples:</strong> Potatoes, yams, cassava.
                <br />
                <strong>Nutritional value:</strong> Rich in carbohydrates (starch),
                some vitamins (C, B6), and minerals (potassium).
                <br />
                <strong>Zimbabwe examples:</strong> Potatoes (grown in Eastern Highlands),
                cassava (grown in lowveld areas).
              </li>
              <li>
                <strong>Bulb vegetables:</strong> The bulbs are the edible part.
                <br />
                <strong>Examples:</strong> Onions, garlic, leeks, shallots.
                <br />
                <strong>Nutritional value:</strong> Rich in vitamins (C, B6), minerals
                (potassium), and antioxidants.
                <br />
                <strong>Zimbabwe examples:</strong> Onions (grown commercially), garlic
                (grown on small scale).
              </li>
              <li>
                <strong>Fruit vegetables:</strong> The fruits are the edible part.
                <br />
                <strong>Examples:</strong> Tomatoes, peppers, cucumbers, pumpkins,
                butternut, eggplants, okra.
                <br />
                <strong>Nutritional value:</strong> Rich in vitamins (A, C), minerals,
                and antioxidants. Some are high in carbohydrates (pumpkin).
                <br />
                <strong>Zimbabwe examples:</strong> Tomatoes (grown in all regions),
                peppers (grown commercially), butternut (grown in the Lowveld).
              </li>
              <li>
                <strong>Stem vegetables:</strong> The stems are the edible part.
                <br />
                <strong>Examples:</strong> Asparagus, celery, kohlrabi.
                <br />
                <strong>Nutritional value:</strong> Rich in fibre, vitamins (K, C),
                and minerals.
                <br />
                <strong>Zimbabwe examples:</strong> Asparagus (limited production).
              </li>
              <li>
                <strong>Seed vegetables:</strong> The seeds are the edible part.
                <br />
                <strong>Examples:</strong> Peas, beans, lentils, maize, wheat, sorghum,
                groundnuts, soybeans.
                <br />
                <strong>Nutritional value:</strong> Rich in proteins, carbohydrates,
                fats, vitamins, and minerals.
                <br />
                <strong>Zimbabwe examples:</strong> Maize (staple food), beans
                (common in communal areas), groundnuts (grown in all regions).
              </li>
            </ul>

            <AgricultureImage
              fileName="plants-edible-parts.webp"
              alt="A 2D diagram showing classification of plants by edible part: leaf, root, tuber, bulb, fruit, stem, and seed with examples"
              caption="Classification of plants by edible part: leaf, root, tuber, bulb, fruit, stem, and seed."
            />
          </SubtopicCard>

          <SubtopicCard title="Classification by Life Cycle">
            <p>
              <strong>Definition:</strong> Plants can be classified based on their
              life cycle, which refers to the duration from planting to harvesting
              and the number of growing seasons they survive.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Annual plants:</strong>
                <br />
                <strong>Definition:</strong> Plants that complete their entire life
                cycle in one growing season (from seed to flower to seed to death) within
                a single year.
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fast-growing and produce seeds quickly.</li>
                  <li>Die after producing seeds.</li>
                  <li>Must be replanted each year.</li>
                  <li>Common in temperate and tropical regions.</li>
                </ul>
                <br />
                <strong>Examples:</strong> Maize, wheat, rice, sorghum, millet, beans,
                peas, tomatoes, peppers, cucumbers, lettuce, spinach, cabbage.
                <br />
                <strong>Zimbabwe examples:</strong> Maize (main cereal crop), beans,
                tomatoes, cabbage.
              </li>
              <li>
                <strong>Biennial plants:</strong>
                <br />
                <strong>Definition:</strong> Plants that complete their life cycle
                in two growing seasons. In the first year, they produce vegetative
                growth (leaves, roots). In the second year, they flower, produce seeds,
                and die.
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Need a cold period (vernalisation) to trigger flowering.</li>
                  <li>Store energy in roots or bulbs in the first year.</li>
                  <li>Die after producing seeds in the second year.</li>
                </ul>
                <br />
                <strong>Examples:</strong> Onions, garlic, carrots, beetroot, cabbage
                (in some varieties), parsley, celery.
                <br />
                <strong>Zimbabwe examples:</strong> Onions (grown as biennials), carrots.
              </li>
              <li>
                <strong>Perennial plants:</strong>
                <br />
                <strong>Definition:</strong> Plants that live for more than two years
                and continue to produce crops year after year without needing to be
                replanted.
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Live for many years (some for decades).</li>
                  <li>Produce flowers and seeds multiple times.</li>
                  <li>Include trees, shrubs, and some herbaceous plants.</li>
                  <li>Often have deep root systems.</li>
                </ul>
                <br />
                <strong>Examples:</strong> Sugarcane, bananas, citrus (oranges, lemons),
                mangoes, avocados, coffee, tea, grapes, asparagus, rhubarb.
                <br />
                <strong>Zimbabwe examples:</strong> Sugarcane (Lowveld), citrus (Lowveld),
                mangoes (many regions), coffee (Eastern Highlands), tea (Eastern Highlands).
              </li>
            </ul>

            <AgricultureImage
              fileName="plants-life-cycle.webp"
              alt="A 2D diagram showing classification of plants by life cycle: annual, biennial, and perennial with examples"
              caption="Classification of plants by life cycle: annual, biennial, and perennial."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Edible part:</strong> leaf, root, tuber, bulb, fruit, stem, seed</li>
            <li><strong>Annual:</strong> completes life cycle in one year</li>
            <li><strong>Biennial:</strong> completes life cycle in two years</li>
            <li><strong>Perennial:</strong> lives for more than two years</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'structure-flowering-plants',
      title: 'Structure of Flowering Plants',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="External Parts of a Flowering Plant and Their Functions">
            <p>
              <strong>Definition:</strong> Flowering plants (angiosperms) have distinct
              external parts that perform specific functions. Understanding these parts
              helps us understand how plants grow, reproduce, and respond to their environment.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Roots:</strong>
                <br />
                <strong>Functions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Anchor the plant in the soil.</li>
                  <li>Absorb water and minerals from the soil.</li>
                  <li>Store food (in some plants like carrots, beetroot).</li>
                  <li>Transport water and minerals to the stem.</li>
                </ul>
                <br />
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Tap root:</strong> One main root that grows deep into the
                    soil (e.g., carrots, dandelions).
                  </li>
                  <li>
                    <strong>Fibrous root:</strong> Many thin roots spreading out in
                    the soil (e.g., maize, grasses).
                  </li>
                  <li>
                    <strong>Adventitious roots:</strong> Roots that grow from the stem
                    or leaves (e.g., aerial roots in orchids).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Stem:</strong>
                <br />
                <strong>Functions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Supports the leaves, flowers, and fruits.</li>
                  <li>Transports water and minerals from roots to leaves (xylem).</li>
                  <li>Transports food from leaves to other parts (phloem).</li>
                  <li>Stores food (in some plants like sugar cane).</li>
                </ul>
                <br />
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Herbaceous stem:</strong> Soft, green, and flexible
                    (e.g., maize, tomatoes).
                  </li>
                  <li>
                    <strong>Woody stem:</strong> Hard, brown, and rigid (e.g., trees,
                    shrubs).
                  </li>
                  <li>
                    <strong>Modified stems:</strong> Rhizomes (ginger), tubers (potato),
                    bulbs (onion), stolons (strawberry runners).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Leaves:</strong>
                <br />
                <strong>Functions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Photosynthesis:</strong> Leaves produce food for the plant
                    using sunlight, water, and carbon dioxide.
                  </li>
                  <li>
                    <strong>Transpiration:</strong> Leaves lose water vapour through
                    stomata, helping to cool the plant and transport water.
                  </li>
                  <li>
                    <strong>Respiration:</strong> Leaves take in oxygen and release
                    carbon dioxide (at night).
                  </li>
                </ul>
                <br />
                <strong>Parts of a leaf:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Blade:</strong> The broad, flat part of the leaf (where
                    photosynthesis occurs).
                  </li>
                  <li>
                    <strong>Petiole:</strong> The stalk that attaches the leaf to the stem.
                  </li>
                  <li>
                    <strong>Stomata:</strong> Small openings on the leaf surface that
                    allow gas exchange.
                  </li>
                  <li>
                    <strong>Veins:</strong> Vascular tissue that transports water and food.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Flowers:</strong>
                <br />
                <strong>Functions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Reproduction:</strong> Flowers are the reproductive organs
                    of the plant. They produce seeds through pollination and fertilisation.
                  </li>
                  <li>
                    <strong>Attract pollinators:</strong> Flowers attract insects,
                    birds, and other animals to help with pollination.
                  </li>
                </ul>
                <br />
                <strong>Parts of a flower:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Sepals:</strong> The outermost part of the flower, usually
                    green, protecting the flower bud.
                  </li>
                  <li>
                    <strong>Petals:</strong> The colourful part of the flower, attracting
                    pollinators.
                  </li>
                  <li>
                    <strong>Stamens (male):</strong> Produce pollen. Consists of an
                    anther and filament.
                  </li>
                  <li>
                    <strong>Carpels (female):</strong> Produce ovules. Consists of the
                    stigma, style, and ovary.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Fruits:</strong>
                <br />
                <strong>Functions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Protect seeds:</strong> Fruits protect the developing seeds.
                  </li>
                  <li>
                    <strong>Seed dispersal:</strong> Fruits help disperse seeds through
                    animals, wind, or water.
                  </li>
                </ul>
                <br />
                <strong>Types of fruits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Fleshy fruits:</strong> Tomatoes, oranges, mangoes, pumpkins.
                  </li>
                  <li>
                    <strong>Dry fruits:</strong> Maize (caryopsis), beans (pod),
                    sunflower seeds (achene).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Seeds:</strong>
                <br />
                <strong>Functions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Reproduction:</strong> Seeds contain the embryo of a new plant.
                  </li>
                  <li>
                    <strong>Dispersal:</strong> Seeds are dispersed to new locations
                    where they can grow.
                  </li>
                  <li>
                    <strong>Storage:</strong> Seeds store food for the developing embryo
                    (cotyledons).
                  </li>
                </ul>
                <br />
                <strong>Parts of a seed:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Seed coat:</strong> Protects the seed from damage and drying.
                  </li>
                  <li>
                    <strong>Embryo:</strong> The tiny plant inside the seed.
                  </li>
                  <li>
                    <strong>Cotyledons:</strong> Store food for the embryo (in many plants).
                  </li>
                  <li>
                    <strong>Endosperm:</strong> The food storage tissue (in some plants
                    like maize).
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="flowering-plant-structure.webp"
              alt="A 2D diagram showing the external parts of a flowering plant: roots, stem, leaves, flowers, fruits, and seeds with their functions"
              caption="External parts of a flowering plant and their functions."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Plant Parts</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Roots:</strong> anchor, absorb water and minerals</li>
            <li><strong>Stem:</strong> support, transport water and food</li>
            <li><strong>Leaves:</strong> photosynthesis, transpiration</li>
            <li><strong>Flowers:</strong> reproduction</li>
            <li><strong>Fruits:</strong> protect seeds, seed dispersal</li>
            <li><strong>Seeds:</strong> reproduction, food storage</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'crop-production',
      title: 'Crop Production',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Branches and Importance of Horticulture">
            <p>
              <strong>Definition:</strong> Horticulture is the branch of agriculture
              that deals with the cultivation of fruits, vegetables, flowers, and
              ornamental plants. It is often called "garden cultivation."
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Branches of Horticulture</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Olericulture:</strong> The cultivation of vegetables.
                <br />
                <strong>Examples:</strong> Cabbage, tomatoes, onions, carrots, peas.
              </li>
              <li>
                <strong>Pomology:</strong> The cultivation of fruits.
                <br />
                <strong>Examples:</strong> Oranges, mangoes, apples, bananas, grapes.
              </li>
              <li>
                <strong>Floriculture:</strong> The cultivation of flowers and ornamental plants.
                <br />
                <strong>Examples:</strong> Roses, lilies, chrysanthemums, orchids.
              </li>
              <li>
                <strong>Landscape horticulture:</strong> The design and maintenance
                of gardens, parks, and landscapes.
              </li>
              <li>
                <strong>Post-harvest horticulture:</strong> The handling, storage,
                and processing of horticultural products.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Importance of Horticulture</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Food and nutrition:</strong> Provides fresh fruits and vegetables
                that are essential for a healthy diet.
              </li>
              <li>
                <strong>Income and employment:</strong> Creates employment and income
                for farmers, traders, and processors.
              </li>
              <li>
                <strong>Export earnings:</strong> Horticultural products (flowers,
                fruits, vegetables) are important exports for many countries.
              </li>
              <li>
                <strong>Environmental benefits:</strong> Ornamental plants improve
                the environment by producing oxygen, reducing pollution, and beautifying
                urban areas.
              </li>
            </ul>

            <AgricultureImage
              fileName="horticulture-branches.webp"
              alt="A 2D diagram showing the branches of horticulture: olericulture, pomology, floriculture, landscape horticulture, and post-harvest horticulture"
              caption="Branches and importance of horticulture."
            />
          </SubtopicCard>

          <SubtopicCard title="Reasons for Land Preparation">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>To create a suitable seedbed:</strong> Land preparation breaks
                up large clods, removes weeds, and creates a fine, even soil surface
                for planting.
              </li>
              <li>
                <strong>To improve soil aeration:</strong> Tilling the soil allows
                oxygen to reach the roots, promoting healthy root growth.
              </li>
              <li>
                <strong>To improve water infiltration:</strong> Loose soil allows
                water to penetrate easily, reducing runoff and improving moisture
                availability for plants.
              </li>
              <li>
                <strong>To incorporate organic matter:</strong> Ploughing incorporates
                crop residues, manure, and compost into the soil, improving soil fertility.
              </li>
              <li>
                <strong>To control weeds:</strong> Land preparation removes existing
                weeds and their roots, reducing competition for nutrients and water.
              </li>
              <li>
                <strong>To control pests and diseases:</strong> Tilling the soil can
                expose pests (insects, larvae) and disease organisms to predators and
                the elements, reducing their populations.
              </li>
            </ul>

            <AgricultureImage
              fileName="land-preparation-reasons.webp"
              alt="A 2D diagram showing reasons for land preparation: seedbed creation, soil aeration, water infiltration, organic matter incorporation, weed control, and pest control"
              caption="Reasons for land preparation in crop production."
            />
          </SubtopicCard>

          <SubtopicCard title="Seedbed Preparation">
            <p>
              <strong>Definition:</strong> A seedbed is the area of soil prepared for
              planting seeds. A good seedbed provides the ideal environment for seed
              germination and seedling growth.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps in Seedbed Preparation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Clearing:</strong> Removing weeds, stones, and debris from the area.
              </li>
              <li>
                <strong>Primary tillage (ploughing):</strong> Turning the soil to loosen
                it and incorporate organic matter. This is done with a plough or hoe.
              </li>
              <li>
                <strong>Secondary tillage (harrowing):</strong> Breaking up large clods
                and smoothing the soil surface. This is done with a harrow or rake.
              </li>
              <li>
                <strong>Levelling:</strong> Making the soil surface even to ensure
                uniform water distribution and germination.
              </li>
              <li>
                <strong>Making planting holes or furrows:</strong> Preparing the holes
                or rows where seeds will be planted.
              </li>
            </ul>

            <AgricultureImage
              fileName="seedbed-preparation.webp"
              alt="A 2D diagram showing steps in seedbed preparation: clearing, primary tillage, secondary tillage, levelling, and making planting holes"
              caption="Steps in seedbed preparation."
            />
          </SubtopicCard>

          <SubtopicCard title="Sowing and Planting">
            <p>
              <strong>Definition:</strong> Sowing is the process of placing seeds in
              the soil. Planting is the process of placing seedlings or transplants
              into the soil.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods of Sowing</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Broadcasting:</strong> Scattering seeds randomly over the
                soil surface.
                <br />
                <strong>Advantages:</strong> Quick and easy.
                <br />
                <strong>Disadvantages:</strong> Uneven distribution, more weed competition,
                higher seed rate required.
                <br />
                <strong>Examples:</strong> Small grains (sorghum, millet), cover crops.
              </li>
              <li>
                <strong>Drilling:</strong> Planting seeds in rows using a drill or
                by hand.
                <br />
                <strong>Advantages:</strong> Even distribution, less weed competition,
                easier to manage and harvest.
                <br />
                <strong>Disadvantages:</strong> Slower and more labour-intensive.
                <br />
                <strong>Examples:</strong> Maize, wheat, beans, groundnuts.
              </li>
              <li>
                <strong>Dibbling:</strong> Placing seeds in individual holes in the soil.
                <br />
                <strong>Advantages:</strong> Precise placement, better germination.
                <br />
                <strong>Disadvantages:</strong> Labour-intensive and slow.
                <br />
                <strong>Examples:</strong> Large seeds like maize, pumpkin, beans.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Transplanting</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Transplanting is the process of moving
                seedlings from a nursery to the field.
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Better establishment and growth.</li>
                  <li>Can extend the growing season.</li>
                  <li>More efficient use of land.</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong> Tomatoes, cabbage, onions, tobacco, rice.
              </li>
            </ul>

            <AgricultureImage
              fileName="sowing-methods.webp"
              alt="A 2D diagram showing sowing methods: broadcasting, drilling, dibbling, and transplanting"
              caption="Methods of sowing and planting."
            />
          </SubtopicCard>

          <SubtopicCard title="Crop Management Practices">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Weeding:</strong>
                <br />
                <strong>Definition:</strong> The removal of weeds that compete with
                crops for nutrients, water, and sunlight.
                <br />
                <strong>Methods:</strong> Hand weeding, hoeing, mechanical cultivation,
                herbicides.
                <br />
                <strong>Importance:</strong> Reduces competition, improves crop growth
                and yields.
              </li>
              <li>
                <strong>Irrigation:</strong>
                <br />
                <strong>Definition:</strong> The application of water to crops when
                rainfall is insufficient.
                <br />
                <strong>Methods:</strong> Surface (flood) irrigation, sprinkler irrigation,
                drip irrigation.
                <br />
                <strong>Importance:</strong> Ensures water availability, improves yields,
                allows year-round production.
              </li>
              <li>
                <strong>Fertilisation:</strong>
                <br />
                <strong>Definition:</strong> The application of nutrients to the soil
                to support plant growth.
                <br />
                <strong>Types:</strong> Organic (manure, compost) and inorganic
                (chemical fertilisers: NPK, urea, lime).
                <br />
                <strong>Importance:</strong> Replenishes soil nutrients, improves
                yields and quality.
              </li>
              <li>
                <strong>Pest and disease control:</strong>
                <br />
                <strong>Definition:</strong> The management of pests and diseases
                that can damage crops.
                <br />
                <strong>Methods:</strong> Chemical (pesticides, fungicides), biological
                (natural enemies), cultural (crop rotation, resistant varieties).
                <br />
                <strong>Importance:</strong> Protects crops, improves yields and quality.
              </li>
              <li>
                <strong>Pruning:</strong>
                <br />
                <strong>Definition:</strong> The removal of unwanted plant parts
                (branches, leaves, shoots) to improve growth and yield.
                <br />
                <strong>Importance:</strong> Promotes air circulation, reduces disease,
                improves fruit quality.
              </li>
              <li>
                <strong>Thinning:</strong>
                <br />
                <strong>Definition:</strong> The removal of excess seedlings to give
                remaining plants enough space to grow.
                <br />
                <strong>Importance:</strong> Reduces competition, improves growth and yields.
              </li>
            </ul>

            <AgricultureImage
              fileName="crop-management-practices.webp"
              alt="A 2D diagram showing crop management practices: weeding, irrigation, fertilisation, pest and disease control, pruning, and thinning"
              caption="Crop management practices in crop production."
            />
          </SubtopicCard>

          <SubtopicCard title="Marketing of Horticultural Crops">
            <p>
              <strong>Definition:</strong> Marketing refers to the process of selling
              and distributing horticultural products from the farm to the consumer.
              Good marketing is essential for farmers to get a fair price for their products.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Types of Markets:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Farm gate sales:</strong> Selling directly from the farm.
                    Farmers get a higher price but have limited reach.
                  </li>
                  <li>
                    <strong>Local markets:</strong> Selling at local markets (dhaba,
                    market stalls). Reaches more customers but may have lower prices.
                  </li>
                  <li>
                    <strong>Supermarkets and retail:</strong> Selling to supermarkets
                    and shops. Requires consistent quality and supply.
                  </li>
                  <li>
                    <strong>Export markets:</strong> Selling to international buyers.
                    Requires high quality, certification, and logistics.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Importance of Marketing:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Generates income for farmers.</li>
                  <li>Connects producers with consumers.</li>
                  <li>Creates employment in transport, processing, and retail.</li>
                  <li>Supports economic growth.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="vegetable-marketing.webp"
              alt="A realistic photograph showing vegetable marketing at a local market in Zimbabwe: fresh produce, traders, and customers"
              caption="Marketing of vegetables at a local market in Zimbabwe."
            />
          </SubtopicCard>

          <SubtopicCard title="Case Studies: Vegetable Production">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Leaf Vegetable: Cabbage</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Varieties:</strong> Copenhagen Market, Glory, Savoy.
              </li>
              <li>
                <strong>Land preparation:</strong> Plough and harrow to create a fine
                seedbed. Apply lime if soil is acidic.
              </li>
              <li>
                <strong>Planting:</strong> Transplant seedlings at a spacing of 60cm × 60cm.
              </li>
              <li>
                <strong>Management:</strong> Water regularly, apply fertiliser (NPK),
                control pests (cabbage butterfly) and diseases (black rot).
              </li>
              <li>
                <strong>Marketing:</strong> Sold fresh to local markets, supermarkets,
                and schools.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Root Vegetable: Carrot</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Varieties:</strong> Nantes, Chantenay, Danvers.
              </li>
              <li>
                <strong>Land preparation:</strong> Deep ploughing to 30cm, remove stones
                and clods. Apply well-rotted manure.
              </li>
              <li>
                <strong>Planting:</strong> Sow seeds directly in rows (drilling).
              </li>
              <li>
                <strong>Management:</strong> Thin seedlings to 5cm apart, water regularly,
                control pests (carrot fly) and diseases (leaf blight).
              </li>
              <li>
                <strong>Marketing:</strong> Wash and grade carrots before selling to
                supermarkets and local markets.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Legume: Bean</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Varieties:</strong> Sugar bean, Speckled bean, Navy bean.
              </li>
              <li>
                <strong>Land preparation:</strong> Plough and harrow. Apply lime if
                soil is acidic. Inoculate seeds with rhizobium bacteria.
              </li>
              <li>
                <strong>Planting:</strong> Plant seeds in rows at 10cm spacing.
              </li>
              <li>
                <strong>Management:</strong> Control weeds, apply phosphorus fertiliser,
                control pests (bean fly, aphids) and diseases (rust, blight).
              </li>
              <li>
                <strong>Marketing:</strong> Harvest dry beans, clean, bag, and sell to
                local markets and retailers.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Bulb Vegetable: Onion</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Varieties:</strong> Red Creole, Yellow Granex, Texas Grano.
              </li>
              <li>
                <strong>Land preparation:</strong> Plough and harrow. Apply well-rotted
                manure and fertiliser.
              </li>
              <li>
                <strong>Planting:</strong> Transplant seedlings or plant sets (small bulbs).
              </li>
              <li>
                <strong>Management:</strong> Water regularly, control weeds, apply
                fertiliser (NPK), control pests (thrips) and diseases (downy mildew).
              </li>
              <li>
                <strong>Marketing:</strong> Harvest when tops dry, cure, and sell to
                local markets, supermarkets, and processors.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Tuber Vegetable: Potato</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Varieties:</strong> Sable, BP1, Montclair, Amethyst.
              </li>
              <li>
                <strong>Land preparation:</strong> Plough to 30cm, apply manure and
                fertiliser. Create ridges or furrows.
              </li>
              <li>
                <strong>Planting:</strong> Plant seed potatoes (cut pieces with eyes)
                at 30cm spacing in ridges.
              </li>
              <li>
                <strong>Management:</strong> Earth up (cover with soil), water regularly,
                apply fertiliser, control pests (potato tuber moth, aphids) and
                diseases (blight, scab).
              </li>
              <li>
                <strong>Marketing:</strong> Harvest when plants die back, grade, and
                sell to supermarkets, processors, and local markets.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Fruit Vegetable: Tomato</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Varieties:</strong> Roma, Rambo, Oxheart, Cherry tomatoes.
              </li>
              <li>
                <strong>Land preparation:</strong> Plough and harrow. Apply manure
                and fertiliser. Create ridges or raised beds.
              </li>
              <li>
                <strong>Planting:</strong> Transplant seedlings at 60cm × 60cm spacing.
                Provide staking or trellising.
              </li>
              <li>
                <strong>Management:</strong> Water regularly, apply fertiliser (NPK),
                control pests (aphids, whitefly, bollworm) and diseases (blight,
                leaf curl, blossom end rot).
              </li>
              <li>
                <strong>Marketing:</strong> Harvest when ripe, grade, and sell to
                supermarkets, local markets, and processors.
              </li>
            </ul>

            <AgricultureImage
              fileName="vegetable-production-examples.webp"
              alt="A 2D diagram showing production steps for six vegetables: cabbage (leaf), carrot (root), bean (legume), onion (bulb), potato (tuber), and tomato (fruit)"
              caption="Vegetable production examples: cabbage, carrot, bean, onion, potato, and tomato."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Crop Production</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Horticulture:</strong> vegetables, fruits, flowers</li>
            <li><strong>Land prep:</strong> seedbed, aeration, weed control</li>
            <li><strong>Sowing:</strong> broadcasting, drilling, dibbling</li>
            <li><strong>Management:</strong> weeding, irrigation, fertilisation</li>
            <li><strong>Marketing:</strong> farm gate, local, export</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'crop-protection',
      title: 'Crop Protection',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Effects of Pests on Crops">
            <p>
              <strong>Definition:</strong> Pests are organisms that damage or destroy
              crops. They can be insects, mites, nematodes, rodents, birds, or other
              animals.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Direct damage:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Feeding:</strong> Pests eat leaves, stems, roots, flowers,
                    or fruits, reducing plant growth and yields.
                  </li>
                  <li>
                    <strong>Boring:</strong> Some pests bore into stems, fruits, or
                    seeds, causing internal damage and making plants susceptible to disease.
                  </li>
                  <li>
                    <strong>Lodging:</strong> Pests (e.g., cutworms) can damage stems,
                    causing plants to fall over.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Indirect damage:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Transmission of diseases:</strong> Some pests (e.g., aphids,
                    whiteflies) transmit plant viruses and diseases.
                  </li>
                  <li>
                    <strong>Reduced quality:</strong> Pests can damage the appearance
                    of crops (e.g., blemishes, holes), reducing their market value.
                  </li>
                  <li>
                    <strong>Reduced vigour:</strong> Pest damage can weaken plants,
                    making them more susceptible to diseases and environmental stress.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="crop-pests-effects.webp"
              alt="A 2D diagram showing the effects of pests on crops: direct damage (feeding, boring, lodging) and indirect damage (disease transmission, reduced quality, reduced vigour)"
              caption="Effects of pests on crops."
            />
          </SubtopicCard>

          <SubtopicCard title="Classification of Pests by Feeding Habits">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Chewing pests:</strong>
                <br />
                <strong>Definition:</strong> Pests that have mouthparts for biting
                and chewing plant tissue.
                <br />
                <strong>Examples:</strong> Caterpillars (cabbage butterfly, armyworm),
                grasshoppers, locusts, beetles (leaf beetles, weevils), cutworms.
                <br />
                <strong>Damage:</strong> Holes in leaves, missing leaves, damaged stems
                and fruits.
                <br />
                <strong>Control:</strong> Insecticides, biological control, physical barriers.
                <br />
                <strong>Zimbabwe examples:</strong> Armyworm (damages maize and other
                cereals), locusts (periodic outbreaks), cabbage caterpillar (damages cabbage).
              </li>
              <li>
                <strong>Sucking pests:</strong>
                <br />
                <strong>Definition:</strong> Pests that have mouthparts for piercing
                plant tissue and sucking sap.
                <br />
                <strong>Examples:</strong> Aphids, whiteflies, scale insects, mealybugs,
                thrips, leafhoppers.
                <br />
                <strong>Damage:</strong> Yellowing, wilting, curling leaves, stunted
                growth, and transmitting diseases (viruses).
                <br />
                <strong>Control:</strong> Insecticides, biological control (ladybirds),
                neem oil.
                <br />
                <strong>Zimbabwe examples:</strong> Aphids (damage vegetables, tobacco),
                whiteflies (damage tomatoes, cotton).
              </li>
              <li>
                <strong>Boring pests:</strong>
                <br />
                <strong>Definition:</strong> Pests that bore into plant stems, fruits,
                or seeds.
                <br />
                <strong>Examples:</strong> Stem borers, fruit flies, weevils (seed borers).
                <br />
                <strong>Damage:</strong> Tunnels in stems, holes in fruits, damaged seeds.
                <br />
                <strong>Control:</strong> Insecticides, trap crops, resistant varieties.
                <br />
                <strong>Zimbabwe examples:</strong> Maize stem borer (damages maize),
                fruit flies (damage fruits like mangoes, citrus, tomatoes).
              </li>
              <li>
                <strong>Root pests:</strong>
                <br />
                <strong>Definition:</strong> Pests that feed on plant roots below the ground.
                <br />
                <strong>Examples:</strong> Nematodes, root-knot nematodes, wireworms,
                termites, root maggots.
                <br />
                <strong>Damage:</strong> Root damage leading to wilting, stunted growth,
                and reduced yields.
                <br />
                <strong>Control:</strong> Nematicides, crop rotation, resistant varieties.
                <br />
                <strong>Zimbabwe examples:</strong> Root-knot nematodes (damage vegetables,
                tomatoes, tobacco), termites (damage crops in dry areas).
              </li>
            </ul>

            <AgricultureImage
              fileName="pests-feeding-habits.webp"
              alt="A 2D diagram showing classification of pests by feeding habits: chewing pests, sucking pests, boring pests, and root pests"
              caption="Classification of pests by feeding habits."
            />
          </SubtopicCard>

          <SubtopicCard title="Plant Diseases and Their Effects">
            <p>
              <strong>Definition:</strong> Plant diseases are abnormal conditions
              that affect the health and growth of plants. They are caused by various
              organisms called pathogens.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Classification by Causal Organism</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Fungal diseases:</strong>
                <br />
                <strong>Definition:</strong> Diseases caused by fungi. Fungi are
                microscopic organisms that spread through spores.
                <br />
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Rust:</strong> Orange/brown spots on leaves.</li>
                  <li><strong>Powdery mildew:</strong> White powdery coating on leaves.</li>
                  <li><strong>Downy mildew:</strong> Yellow patches on leaves with
                    fuzzy growth on the underside.</li>
                  <li><strong>Blight:</strong> Rapid wilting and death of leaves and stems.</li>
                  <li><strong>Fusarium wilt:</strong> Wilting caused by blocked xylem.</li>
                </ul>
                <br />
                <strong>Effects:</strong> Reduced photosynthesis, wilting, death of
                plant parts, reduced yields, and reduced quality.
                <br />
                <strong>Zimbabwe examples:</strong> Late blight in tomatoes (common in
                many regions), rust in beans, and powdery mildew in cucurbits (pumpkin,
                butternut).
              </li>
              <li>
                <strong>Bacterial diseases:</strong>
                <br />
                <strong>Definition:</strong> Diseases caused by bacteria. Bacteria
                enter plants through wounds or natural openings.
                <br />
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Bacterial wilt:</strong> Sudden wilting, bacteria oozing
                    from cut stems.</li>
                  <li><strong>Bacterial leaf spot:</strong> Small, water-soaked spots
                    on leaves.</li>
                  <li><strong>Black rot:</strong> Blackened veins and rotting in
                    cruciferous vegetables (cabbage, kale).</li>
                </ul>
                <br />
                <strong>Effects:</strong> Wilting, leaf spots, rotting, reduced yields,
                and death of plants.
                <br />
                <strong>Zimbabwe examples:</strong> Bacterial wilt in tomatoes and
                potatoes, black rot in cabbage (common in humid conditions).
              </li>
              <li>
                <strong>Viral diseases:</strong>
                <br />
                <strong>Definition:</strong> Diseases caused by viruses. Viruses are
                tiny particles that multiply inside plant cells.
                <br />
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Maize streak virus:</strong> Yellow streaks on maize leaves.</li>
                  <li><strong>Tomato mosaic virus:</strong> Mottled yellow and green
                    patterns on leaves.</li>
                  <li><strong>Cassava mosaic virus:</strong> Yellow mosaic pattern on
                    leaves, stunted growth.</li>
                </ul>
                <br />
                <strong>Effects:</strong> Stunted growth, yellowing, reduced yields,
                and plant death.
                <br />
                <strong>Transmission:</strong> Insects (aphids, whiteflies), mechanical
                (tools, hands), and seeds.
                <br />
                <strong>Zimbabwe examples:</strong> Maize streak virus (common in maize),
                cassava mosaic virus (common in lowveld areas).
              </li>
              <li>
                <strong>Nematode diseases:</strong>
                <br />
                <strong>Definition:</strong> Diseases caused by nematodes (microscopic
                worms) that live in the soil and feed on plant roots.
                <br />
                <strong>Examples:</strong> Root-knot nematode (Meloidogyne spp.) – causes
                galls (swellings) on roots.
                <br />
                <strong>Effects:</strong> Root damage, wilting, stunted growth, and
                reduced yields.
                <br />
                <strong>Control:</strong> Crop rotation, nematicides, resistant varieties.
                <br />
                <strong>Zimbabwe examples:</strong> Root-knot nematodes (damage vegetables,
                tomatoes, and tobacco).
              </li>
            </ul>

            <AgricultureImage
              fileName="plant-diseases-classification.webp"
              alt="A 2D diagram showing plant diseases classified by causal organism: fungal, bacterial, viral, and nematode diseases with examples"
              caption="Plant diseases classified by causal organism: fungal, bacterial, viral, and nematode diseases."
            />
          </SubtopicCard>

          <SubtopicCard title="Weeds: Harmful and Beneficial Effects">
            <p>
              <strong>Definition:</strong> Weeds are plants that are considered
              undesirable or unwanted in a particular location. They compete with
              crops for resources and can reduce yields.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Harmful Effects of Weeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Competition:</strong> Weeds compete with crops for water,
                nutrients, and sunlight.
              </li>
              <li>
                <strong>Reduced yields:</strong> Competition from weeds can significantly
                reduce crop yields.
              </li>
              <li>
                <strong>Host for pests and diseases:</strong> Weeds can harbour pests
                and diseases that can spread to crops.
              </li>
              <li>
                <strong>Reduced quality:</strong> Weeds can contaminate harvested
                products, reducing their quality and market value.
              </li>
              <li>
                <strong>Allelopathy:</strong> Some weeds release chemicals that inhibit
                the growth of other plants (e.g., Lantana camara).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Beneficial Effects of Weeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Soil conservation:</strong> Weeds can protect the soil from
                erosion by providing ground cover.
              </li>
              <li>
                <strong>Organic matter:</strong> Weeds can be incorporated into the
                soil to add organic matter and improve soil fertility.
              </li>
              <li>
                <strong>Food and medicine:</strong> Some weeds are edible or have
                medicinal properties (e.g., wild spinach, blackjack).
              </li>
              <li>
                <strong>Habitat for beneficial organisms:</strong> Weeds can provide
                habitat for beneficial insects and pollinators.
              </li>
            </ul>

            <AgricultureImage
              fileName="weeds-harmful-beneficial.webp"
              alt="A 2D diagram showing harmful effects of weeds (competition, reduced yields, pests, reduced quality) and beneficial effects (soil conservation, organic matter, food, habitat)"
              caption="Harmful and beneficial effects of weeds."
            />
          </SubtopicCard>

          <SubtopicCard title="Annual vs Perennial Weeds">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Annual weeds:</strong>
                <br />
                <strong>Definition:</strong> Weeds that complete their life cycle in
                one growing season. They grow from seed, flower, produce seeds, and die
                within a year.
                <br />
                <strong>Examples:</strong> Blackjack (Bidens pilosa), pigweed
                (Amaranthus spp.), goosegrass (Eleusine indica), chickweed.
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Produce many seeds.</li>
                  <li>Seeds can remain dormant in the soil for a long time.</li>
                  <li>Can be controlled by timely weeding before they produce seeds.</li>
                </ul>
                <br />
                <strong>Control:</strong> Early weeding, hoeing, mulching, herbicides.
              </li>
              <li>
                <strong>Perennial weeds:</strong>
                <br />
                <strong>Definition:</strong> Weeds that live for more than two years.
                They can reproduce by seed and vegetatively (through roots, rhizomes,
                stolons, or bulbs).
                <br />
                <strong>Examples:</strong> Bermuda grass (Cynodon dactylon), couch grass,
                nutgrass (Cyperus spp.), katambora (Panicum repens), Lantana camara.
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Difficult to control because they have deep root systems and
                    can regrow from small pieces.</li>
                  <li>Can spread rapidly through underground stems (rhizomes) or
                    creeping stems (stolons).</li>
                </ul>
                <br />
                <strong>Control:</strong> Deep ploughing, persistent weeding, herbicides,
                and preventing seed production.
              </li>
            </ul>

            <AgricultureImage
              fileName="annual-perennial-weeds.webp"
              alt="A 2D diagram showing annual weeds (life cycle in one year) and perennial weeds (live for more than two years) with examples"
              caption="Annual vs perennial weeds: differences and control methods."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Crop Protection</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Pests:</strong> chewing, sucking, boring, root pests</li>
            <li><strong>Diseases:</strong> fungal, bacterial, viral, nematode</li>
            <li><strong>Weeds:</strong> annual (one year), perennial (many years)</li>
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
            Explore the classification of plants, structure of flowering plants,
            crop production practices, and crop protection methods including pest,
            disease, and weed management.
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
                  <strong className="text-white">Plant Classification:</strong> Plants
                  can be classified by edible part (leaf, root, tuber, bulb, fruit,
                  stem, seed) and by life cycle (annual, biennial, perennial).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Plant Structure:</strong> Roots anchor
                  and absorb water; stems support and transport; leaves photosynthesise;
                  flowers reproduce; fruits protect seeds; seeds contain the embryo.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Crop Production:</strong> Horticulture
                  includes olericulture (vegetables), pomology (fruits), and floriculture
                  (flowers). Land preparation, sowing, crop management, and marketing
                  are essential steps.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Crop Protection:</strong> Pests
                  (chewing, sucking, boring, root pests) damage crops. Diseases are
                  caused by fungi, bacteria, viruses, and nematodes. Weeds compete
                  with crops and can be annual or perennial.
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

   --- PLANT CLASSIFICATION IMAGES (2D DIAGRAM STYLE) ---

   1. plants-edible-parts.png
      A 2D diagram showing classification of plants by edible part:
      - Leaf (cabbage, spinach)
      - Root (carrot, beetroot)
      - Tuber (potato, cassava)
      - Bulb (onion, garlic)
      - Fruit (tomato, cucumber)
      - Stem (asparagus, celery)
      - Seed (maize, beans)
      Use icons and labels for each category.

   2. plants-life-cycle.png
      A 2D diagram showing classification by life cycle:
      - Annual (maize, beans, tomatoes) – one year
      - Biennial (onions, carrots) – two years
      - Perennial (sugarcane, citrus, coffee) – many years
      Show the duration and examples for each.

   --- PLANT STRUCTURE IMAGES (2D DIAGRAM STYLE) ---

   3. flowering-plant-structure.png
      A 2D diagram showing the external parts of a flowering plant:
      - Roots (tap root, fibrous root)
      - Stem (herbaceous, woody)
      - Leaves (blade, petiole, veins, stomata)
      - Flowers (sepals, petals, stamens, carpels)
      - Fruits (fleshy, dry)
      - Seeds (seed coat, embryo, cotyledons)
      Label each part and its function.

   --- CROP PRODUCTION IMAGES (2D DIAGRAM AND REALISTIC) ---

   4. horticulture-branches.png
      A 2D diagram showing branches of horticulture:
      - Olericulture (vegetables)
      - Pomology (fruits)
      - Floriculture (flowers)
      - Landscape horticulture
      - Post-harvest horticulture
      Include icons and brief descriptions.

   5. land-preparation-reasons.png
      A 2D diagram showing reasons for land preparation:
      - Seedbed creation
      - Soil aeration
      - Water infiltration
      - Organic matter incorporation
      - Weed control
      - Pest control
      Use icons and brief explanations.

   6. seedbed-preparation.png
      A 2D diagram showing steps in seedbed preparation:
      - Clearing
      - Primary tillage (ploughing)
      - Secondary tillage (harrowing)
      - Levelling
      - Making planting holes
      Show each step with a sketch and label.

   7. sowing-methods.png
      A 2D diagram showing sowing methods:
      - Broadcasting (scattering)
      - Drilling (rows)
      - Dibbling (holes)
      - Transplanting (nursery to field)
      Include examples for each method.

   8. crop-management-practices.png
      A 2D diagram showing crop management practices:
      - Weeding
      - Irrigation
      - Fertilisation
      - Pest and disease control
      - Pruning
      - Thinning
      Use icons and brief explanations.

   9. vegetable-marketing.png
      A realistic photograph showing vegetable marketing at a local market in Zimbabwe:
      fresh produce, traders, and customers.

   10. vegetable-production-examples.png
       A 2D diagram showing production steps for six vegetables:
       - Cabbage (leaf) – transplant, fertilise, harvest
       - Carrot (root) – direct sow, thin, harvest
       - Bean (legume) – direct sow, support, harvest
       - Onion (bulb) – transplant, water, cure
       - Potato (tuber) – plant seed, earth up, harvest
       - Tomato (fruit) – transplant, stake, harvest
       Show key steps for each.

   --- CROP PROTECTION IMAGES (2D DIAGRAM STYLE) ---

   11. crop-pests-effects.png
       A 2D diagram showing effects of pests on crops:
       - Direct: feeding, boring, lodging
       - Indirect: disease transmission, reduced quality, reduced vigour
       Use icons and brief explanations.

   12. pests-feeding-habits.png
       A 2D diagram showing classification of pests by feeding habits:
       - Chewing pests (caterpillars, grasshoppers, beetles)
       - Sucking pests (aphids, whiteflies, thrips)
       - Boring pests (stem borers, fruit flies)
       - Root pests (nematodes, termites)
       Include examples for each category.

   13. plant-diseases-classification.png
       A 2D diagram showing plant diseases classified by causal organism:
       - Fungal (rust, mildew, blight)
       - Bacterial (wilt, leaf spot, black rot)
       - Viral (maize streak, mosaic)
       - Nematode (root-knot)
       Include examples for each category.

   14. weeds-harmful-beneficial.png
       A 2D diagram showing harmful effects of weeds (competition, reduced yields,
       pests, reduced quality, allelopathy) and beneficial effects (soil conservation,
       organic matter, food, habitat).

   15. annual-perennial-weeds.png
       A 2D diagram showing:
       - Annual weeds (life cycle in one year, examples: blackjack, pigweed)
       - Perennial weeds (live for more than two years, examples: Bermuda grass,
         nutgrass, Lantana)
       Show differences and control methods.

   ============================================================ */  
