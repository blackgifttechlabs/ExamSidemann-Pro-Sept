import React, { useState, useRef } from 'react';

/**
 * Topic: Soil and Water Studies
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const SoilAndWater: React.FC = () => {
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
  const SoilImage: React.FC<{
    fileName: string;
    alt: string;
    caption: string;
  }> = ({ fileName, alt, caption }) => {
    const [isMissing, setIsMissing] = useState(false);

    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        {isMissing ? (
          <div className="flex aspect-video flex-col items-center justify-center bg-slate-100 px-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Image ready to add
            </p>
            <code className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
              {fileName}
            </code>
            <p className="mt-3 text-xs text-slate-500">
              Place this file in <strong>public/images/soil-water/</strong>
            </p>
          </div>
        ) : (
          <img
            src={`/images/soil-water/${fileName}`}
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

  // ---------- Section content ----------
  const sections: TopicSection[] = [
    {
      id: 'soil-texture-structure-profile',
      title: 'Soil Texture, Structure and Profile',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Soil Profile">
            <p>
              <strong>Definition:</strong> A soil profile is a vertical section
              through the soil from the surface down to the parent rock. It shows
              the different layers (horizons) that make up the soil.
            </p>
            <p>
              The profile helps us understand how the soil was formed, its
              fertility, drainage, and suitability for different crops.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Diagram of Soil Profile</h4>
            <p>
              A typical soil profile has six main horizons, each with distinct
              appearance, colour, texture, and composition.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>O Horizon (Organic layer):</strong> Topmost layer of
                undecomposed and partially decomposed plant litter (leaves, twigs).
                Dark brown to black in colour.
              </li>
              <li>
                <strong>A Horizon (Topsoil):</strong> Dark, rich in humus (decayed
                organic matter). Contains most plant roots and soil organisms.
                Usually the most fertile layer.
              </li>
              <li>
                <strong>E Horizon (Eluviation layer):</strong> Light-coloured layer
                where minerals and clay have been leached (washed down) to lower
                layers. Sandy and less fertile.
              </li>
              <li>
                <strong>B Horizon (Subsoil):</strong> Accumulation of clay, iron,
                aluminium, and minerals leached from above. Often reddish or yellowish.
                Contains some roots but less organic matter.
              </li>
              <li>
                <strong>C Horizon (Parent material):</strong> Weathered rock
                fragments with little organic matter. The material from which the
                soil is forming.
              </li>
              <li>
                <strong>R Horizon (Bedrock):</strong> Unweathered solid rock at
                the base of the profile.
              </li>
            </ul>
            <SoilImage
              fileName="soil-profile-horizons.png"
              alt="A 2D diagram showing the O, A, E, B, C, and R horizons of a soil profile"
              caption="Soil profile showing the six main horizons."
            />
          </SubtopicCard>

          <SubtopicCard title="Appearance and Composition of Each Horizon">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>O Horizon:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><strong>Appearance:</strong> Dark brown to black, loose, spongy texture.</li>
                  <li><strong>Composition:</strong> Dead leaves, grass, twigs, roots; high organic matter.</li>
                </ul>
              </li>
              <li>
                <strong>A Horizon:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><strong>Appearance:</strong> Dark brown or greyish, crumbly structure.</li>
                  <li><strong>Composition:</strong> Humus, minerals, sand, silt, clay; many microorganisms.</li>
                </ul>
              </li>
              <li>
                <strong>E Horizon:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><strong>Appearance:</strong> Light grey or pale, sandy texture, often bleached.</li>
                  <li><strong>Composition:</strong> Mostly sand and silt; clay and minerals have been leached out.</li>
                </ul>
              </li>
              <li>
                <strong>B Horizon:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><strong>Appearance:</strong> Reddish, yellowish, or brown; often blocky structure.</li>
                  <li><strong>Composition:</strong> Accumulated clay, iron oxides, and minerals; less organic matter.</li>
                </ul>
              </li>
              <li>
                <strong>C Horizon:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><strong>Appearance:</strong> Similar to parent rock, with fragments and stones.</li>
                  <li><strong>Composition:</strong> Weathered rock, gravel, little or no organic matter.</li>
                </ul>
              </li>
              <li>
                <strong>R Horizon:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><strong>Appearance:</strong> Solid rock layer.</li>
                  <li><strong>Composition:</strong> Unweathered bedrock (granite, basalt, limestone, etc.).</li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Significance of Each Horizon to Crop Growth">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>O Horizon:</strong> Provides organic matter that decomposes
                into humus, which improves soil structure, water holding, and nutrient
                supply. Important for soil life.
              </li>
              <li>
                <strong>A Horizon:</strong> The main zone for plant roots. Contains
                most nutrients and water. Its fertility determines crop yields.
                Good crumb structure here is essential.
              </li>
              <li>
                <strong>E Horizon:</strong> Less important for crops because it is
                leached of nutrients. Often compacted or sandy; roots may penetrate
                it but it is not a major source of food.
              </li>
              <li>
                <strong>B Horizon:</strong> Can be important for deep‑rooted crops
                like maize, tobacco, or fruit trees. It stores water and minerals
                that roots can access. However, excessive clay can cause waterlogging.
              </li>
              <li>
                <strong>C Horizon:</strong> Provides minerals through further weathering.
                Affects drainage – if it is impermeable, it can cause waterlogging.
              </li>
              <li>
                <strong>R Horizon:</strong> Limits root depth. If bedrock is shallow,
                crops will have shallow roots and be prone to drought.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Importance of the Soil Profile">
            <ul className="list-disc list-inside space-y-1">
              <li>Helps identify soil type and its potential for different crops.</li>
              <li>Indicates drainage characteristics – important for irrigation planning.</li>
              <li>Shows fertility levels and where nutrients are concentrated.</li>
              <li>Guides soil management decisions (fertilisation, deep ploughing, drainage).</li>
              <li>Used by farmers and agronomists to decide on suitable crops and farming methods.</li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Soil profile:</strong> vertical section of soil layers</li>
            <li><strong>Horizons:</strong> O, A, E, B, C, R</li>
            <li><strong>Topsoil (A):</strong> most fertile, root zone</li>
            <li><strong>Subsoil (B):</strong> mineral accumulation</li>
            <li><strong>Eluviation:</strong> leaching of minerals</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-types',
      title: 'Soil Types – Sand, Loam, Clay',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Soil Types?">
            <p>
              <strong>Definition:</strong> Soils are classified by their texture,
              which is determined by the size of the mineral particles they contain.
              The three main types are <strong>sand</strong>, <strong>loam</strong>,
              and <strong>clay</strong>. Each has different properties that affect
              how they behave for farming.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Sand Soil">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Particle size:</strong> 0.05–2.0 mm (largest, visible to naked eye).
              </li>
              <li>
                <strong>Feel:</strong> Gritty when rubbed between fingers.
              </li>
              <li>
                <strong>Water holding:</strong> Very low – water drains quickly
                (leaching). Soils are often dry.
              </li>
              <li>
                <strong>Nutrient holding:</strong> Low – nutrients are washed away
                easily. Needs frequent fertilisation.
              </li>
              <li>
                <strong>Aeration:</strong> Excellent – plenty of air spaces.
              </li>
              <li>
                <strong>Workability:</strong> Easy to plough, but can be easily
                eroded by wind.
              </li>
              <li>
                <strong>Warmth:</strong> Warms up quickly in spring.
              </li>
              <li>
                <strong>Suitability:</strong> Good for crops that prefer dry
                conditions (e.g., groundnuts, sweet potatoes, some vegetables).
                Often needs irrigation and organic matter to improve.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Clay Soil">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Particle size:</strong> &lt;0.002 mm (smallest, not visible to naked eye).
              </li>
              <li>
                <strong>Feel:</strong> Smooth, sticky when wet; hard when dry.
              </li>
              <li>
                <strong>Water holding:</strong> Very high – holds water tightly,
                can become waterlogged and anaerobic.
              </li>
              <li>
                <strong>Nutrient holding:</strong> Very high – clay particles hold
                nutrients (cations) well, making them fertile.
              </li>
              <li>
                <strong>Aeration:</strong> Poor – air spaces are small, roots may
                lack oxygen when wet.
              </li>
              <li>
                <strong>Workability:</strong> Difficult – heavy to plough; cracks
                when dry; sticky when wet.
              </li>
              <li>
                <strong>Warmth:</strong> Slow to warm up in spring.
              </li>
              <li>
                <strong>Suitability:</strong> Good for crops that need lots of water
                (e.g., rice, pasture). Can be improved by adding organic matter and
                sand to improve drainage.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Loam Soil">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Particle size:</strong> A mixture of sand, silt, and clay
                (roughly 40% sand, 40% silt, 20% clay).
              </li>
              <li>
                <strong>Feel:</strong> Soft, crumbly, slightly gritty and sticky.
                Ideal texture.
              </li>
              <li>
                <strong>Water holding:</strong> Good – holds enough water but also
                drains well.
              </li>
              <li>
                <strong>Nutrient holding:</strong> Good – holds nutrients well.
              </li>
              <li>
                <strong>Aeration:</strong> Good – enough air spaces for roots.
              </li>
              <li>
                <strong>Workability:</strong> Easy to plough and work with.
              </li>
              <li>
                <strong>Warmth:</strong> Moderate – warms up reasonably well.
              </li>
              <li>
                <strong>Suitability:</strong> Best for most crops – vegetables,
                maize, wheat, fruits, etc. Often considered the ideal soil for farming.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Comparing Properties of Different Soil Types">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border p-2 text-left">Property</th>
                  <th className="border p-2 text-left">Sand</th>
                  <th className="border p-2 text-left">Loam</th>
                  <th className="border p-2 text-left">Clay</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2"><strong>Water holding</strong></td>
                  <td className="border p-2">Low</td>
                  <td className="border p-2">Good</td>
                  <td className="border p-2">High</td>
                </tr>
                <tr>
                  <td className="border p-2"><strong>Drainage</strong></td>
                  <td className="border p-2">Excellent (quick)</td>
                  <td className="border p-2">Good</td>
                  <td className="border p-2">Poor (slow)</td>
                </tr>
                <tr>
                  <td className="border p-2"><strong>Nutrient holding</strong></td>
                  <td className="border p-2">Low</td>
                  <td className="border p-2">Good</td>
                  <td className="border p-2">High</td>
                </tr>
                <tr>
                  <td className="border p-2"><strong>Aeration</strong></td>
                  <td className="border p-2">Excellent</td>
                  <td className="border p-2">Good</td>
                  <td className="border p-2">Poor</td>
                </tr>
                <tr>
                  <td className="border p-2"><strong>Workability</strong></td>
                  <td className="border p-2">Easy</td>
                  <td className="border p-2">Easy</td>
                  <td className="border p-2">Difficult</td>
                </tr>
                <tr>
                  <td className="border p-2"><strong>Best for</strong></td>
                  <td className="border p-2">Drought‑tolerant crops</td>
                  <td className="border p-2">Most crops</td>
                  <td className="border p-2">Rice, pasture</td>
                </tr>
              </tbody>
            </table>
            <SoilImage
              fileName="soil-types-comparison.png"
              alt="A 2D diagram comparing sand, loam, and clay soils – particle size, water retention, and workability"
              caption="Comparing the properties of sand, loam, and clay soils."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Soil Types</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Sand:</strong> gritty, low water/nutrients, easy to work</li>
            <li><strong>Clay:</strong> sticky, high water/nutrients, hard to work</li>
            <li><strong>Loam:</strong> mixture, best for most crops</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-fertility-fertilisers',
      title: 'Soil Fertility – Fertilisers',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Soil Fertility?">
            <p>
              <strong>Definition:</strong> Soil fertility is the ability of soil
              to provide essential nutrients to plants in adequate amounts and in
              proper balance. Fertile soil supports healthy plant growth and high
              crop yields.
            </p>
            <p>
              Fertilisers are added to soil to replace or increase nutrients that
              are lacking. They can be <strong>organic</strong> (natural) or
              <strong>inorganic</strong> (synthetic/chemical).
            </p>
          </SubtopicCard>

          <SubtopicCard title="Organic Fertilisers">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Fertilisers derived from natural sources
                – plant or animal materials.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Cattle manure, poultry litter, and pig manure.</li>
                  <li>Compost (decayed plant material).</li>
                  <li>Green manure (cover crops ploughed in).</li>
                  <li>Bone meal and blood meal.</li>
                  <li>Seaweed and fish emulsion.</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Improves soil structure and water holding.</li>
                  <li>Adds organic matter (humus).</li>
                  <li>Releases nutrients slowly – less risk of burning plants.</li>
                  <li>Encourages soil organisms (worms, beneficial microbes).</li>
                  <li>Environmentally friendly – reduces chemical runoff.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Bulkier and more difficult to handle.</li>
                  <li>Nutrient content is lower and variable.</li>
                  <li>May contain weed seeds or pathogens if not composted properly.</li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Inorganic Fertilisers">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Synthetic or manufactured fertilisers
                made from minerals and chemicals. They are concentrated sources of
                specific nutrients.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Ammonium nitrate (N).</li>
                  <li>Superphosphate (P).</li>
                  <li>Potassium chloride (K).</li>
                  <li>Compound fertilisers (e.g., NPK 20-10-10).</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>High nutrient content – small amounts are effective.</li>
                  <li>Quick release – nutrients are available immediately.</li>
                  <li>Easy to handle and apply.</li>
                  <li>Can be tailored to specific crop needs (e.g., high N for maize).</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Do not improve soil structure.</li>
                  <li>Can burn crops if over‑applied.</li>
                  <li>Contribute to soil acidification.</li>
                  <li>Expensive – many small‑scale farmers cannot afford them.</li>
                  <li>Environmental pollution – runoff causes eutrophication of water bodies.</li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Straight vs Compound Fertilisers">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Straight Fertilisers</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Fertilisers that contain only one
                major nutrient (N, P, or K).
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Nitrogen: Ammonium nitrate (35% N), Urea (46% N).</li>
                  <li>Phosphorus: Single superphosphate (20% P₂O₅).</li>
                  <li>Potassium: Potassium chloride (60% K₂O).</li>
                </ul>
              </li>
              <li>
                <strong>Use:</strong> Used when a specific nutrient is deficient.
                Allows precise application.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Compound Fertilisers</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Fertilisers that contain two or three
                major nutrients (N, P, K) in a single mixture.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>NPK 10-20-10 (10% N, 20% P₂O₅, 10% K₂O).</li>
                  <li>Compound D (Zimbabwe): 8-14-7 (N-P-K).</li>
                  <li>LAN 28% (limestone ammonium nitrate – N only, but often blended).</li>
                </ul>
              </li>
              <li>
                <strong>Use:</strong> Convenient for general fertilisation. Often
                tailored for specific crops (e.g., maize, tobacco).
              </li>
            </ul>
            <SoilImage
              fileName="fertiliser-types-straight-compound.png"
              alt="A 2D diagram showing straight fertilisers (N, P, K bags) and compound fertilisers (NPK bags)"
              caption="Straight vs compound fertilisers."
            />
          </SubtopicCard>

          <SubtopicCard title="Zimbabwe Context – Fertiliser Use">
            <ul className="list-disc list-inside space-y-1">
              <li>
                Commercial farmers in Zimbabwe use a mix of organic and inorganic
                fertilisers. Compound fertilisers like <strong>Compound D</strong>
                (8-14-7) and <strong>Compound C</strong> (7-14-8) are common for
                maize and tobacco.
              </li>
              <li>
                Small‑scale farmers often rely on <strong>cattle manure</strong>
                and <strong>compost</strong> because they are cheaper and improve
                soil structure. Government programmes like <strong>Pfumvudza</strong>
                (conservation agriculture) promote the use of organic and inorganic
                fertilisers together.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Fertilisers</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Organic:</strong> manure, compost, green manure</li>
            <li><strong>Inorganic:</strong> ammonium nitrate, superphosphate</li>
            <li><strong>Straight:</strong> N, P, K only</li>
            <li><strong>Compound:</strong> NPK blends</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'irrigation',
      title: 'Irrigation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Irrigation?">
            <p>
              <strong>Definition:</strong> Irrigation is the artificial application
              of water to the soil to help plants grow. It is used in areas where
              rainfall is insufficient or unreliable, or to supplement natural
              rainfall during dry periods.
            </p>
            <p>
              In Zimbabwe, irrigation is crucial for crop production, especially
              in drier regions like Matabeleland, Masvingo, and the Lowveld.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Importance of Irrigation">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Ensures food security:</strong> Allows crop production even
                during droughts, reducing reliance on seasonal rainfall.
              </li>
              <li>
                <strong>Increased yields:</strong> Irrigated crops produce higher
                and more reliable yields compared to rain‑fed agriculture.
              </li>
              <li>
                <strong>Crop diversification:</strong> Farmers can grow a wider
                range of crops (e.g., vegetables, fruits, sugarcane, tobacco) that
                may not survive under rain‑fed conditions.
              </li>
              <li>
                <strong>Employment:</strong> Irrigation schemes create jobs in
                farming, processing, and maintenance.
              </li>
              <li>
                <strong>Economic growth:</strong> Irrigated agriculture contributes
                to GDP through exports (e.g., sugar, citrus, flowers).
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Sources of Irrigation Water">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Surface water:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Rivers and streams (e.g., Zambezi, Save, Runde).</li>
                  <li>Dams and reservoirs (e.g., Lake Kariba, Mutirikwi Dam, Manyame).</li>
                  <li>Canals and diversion channels.</li>
                </ul>
              </li>
              <li>
                <strong>Groundwater:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Boreholes and wells tapping into aquifers.</li>
                  <li>Common in areas with low surface water availability (e.g., Matabeleland).</li>
                </ul>
              </li>
              <li>
                <strong>Rainwater harvesting:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Collection of rainwater from rooftops or catchment areas into tanks or ponds.</li>
                  <li>Used for small‑scale irrigation in rural areas.</li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Determining Water Suitability for Irrigation (Water Quality)">
            <p>
              Not all water is suitable for irrigation. Poor quality water can
              damage crops and soil. Key factors to consider:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Salinity (salt content):</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Measured by Electrical Conductivity (EC).</li>
                  <li>High salinity (EC &gt; 2.5 dS/m) can damage crops (salt burn).</li>
                  <li>Salt‑tolerant crops (e.g., barley, cotton) can tolerate moderate salinity.</li>
                </ul>
              </li>
              <li>
                <strong>pH (acidity/alkalinity):</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Ideal pH for irrigation water is 6.5–8.4.</li>
                  <li>Very acidic or alkaline water can affect nutrient availability and harm soil microbes.</li>
                </ul>
              </li>
              <li>
                <strong>Sodium content (SAR – Sodium Adsorption Ratio):</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>High sodium can cause soil dispersion (loss of structure), leading to poor drainage.</li>
                </ul>
              </li>
              <li>
                <strong>Toxicity:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Presence of heavy metals (e.g., lead, arsenic) or industrial pollutants.</li>
                  <li>Can harm crops and accumulate in the food chain.</li>
                </ul>
              </li>
              <li>
                <strong>Biological contamination:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Water may contain pathogens (bacteria, viruses) from sewage or animal waste.</li>
                  <li>Can affect crop quality and pose health risks (e.g., cholera).</li>
                </ul>
              </li>
            </ul>
            <SoilImage
              fileName="irrigation-water-quality.png"
              alt="A 2D diagram showing factors for assessing irrigation water quality: salinity, pH, sodium, toxicity, and biological contamination"
              caption="Factors determining water suitability for irrigation."
            />
          </SubtopicCard>

          <SubtopicCard title="Irrigation in Zimbabwe – Examples">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Sugarcane in Lowveld (Triangle, Hippo Valley):</strong>
                Uses water from the Save and Runde rivers (surface water).
              </li>
              <li>
                <strong>Maize and wheat in Mashonaland:</strong> Drip and centre‑pivot
                irrigation from dams (e.g., Manyame, Mazowe).
              </li>
              <li>
                <strong>Tobacco in Marondera and Mvurwi:</strong> Uses groundwater
                from boreholes, especially in dry winter months.
              </li>
              <li>
                <strong>Vegetable gardens:</strong> Small‑scale farmers use rainwater
                harvesting and treadle pumps for irrigation.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Irrigation Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Irrigation:</strong> artificial water supply to crops</li>
            <li><strong>Sources:</strong> surface water, groundwater, rainwater</li>
            <li><strong>Water quality:</strong> salinity, pH, sodium, toxicity</li>
            <li><strong>Zimbabwe:</strong> Lowveld sugar, tobacco, maize, vegetables</li>
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
            Soil and Water Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Understand soil texture, structure, and profile; sand, loam, and clay
            soil types; organic vs inorganic fertilisers; and irrigation – with
            a focus on Zimbabwean agriculture.
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
                  <strong className="text-white">Soil profile</strong> has six
                  horizons (O, A, E, B, C, R). Each has different composition and
                  significance for crop growth – the A horizon is the most fertile.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Soil types</strong> – sand (gritty,
                  drains quickly), clay (sticky, holds water/nutrients), loam (mixture,
                  ideal for most crops). Loam is best for farming.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Fertilisers</strong> – organic
                  (manure, compost) improves structure; inorganic (chemical) gives
                  quick nutrients. Straight fertilisers have N, P, or K alone;
                  compound fertilisers have blends like NPK.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Irrigation</strong> is essential
                  for reliable production. Water sources include surface water
                  (rivers, dams), groundwater (boreholes), and rainwater. Water
                  quality (salinity, pH, sodium) must be checked to avoid crop damage.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Soil and Water Studies topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">another topic</span>?</>
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
                alert('Proceed to next topic');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Next Topic →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SoilAndWater;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/soil-water/
   Use a mix of 2D diagram style and realistic photographs.

   --- SOIL TEXTURE, STRUCTURE AND PROFILE ---
   1. soil-profile-horizons.png
      A vertical cross‑section showing O (organic layer), A (topsoil, dark brown),
      E (eluviation, pale), B (subsoil, reddish), C (parent material, rocky),
      R (bedrock). Labels with brief descriptions.

   --- SOIL TYPES ---
   2. soil-types-comparison.png
      Three panels side‑by‑side: Sand (large particles, water running through),
      Loam (mixed particles, balanced water), Clay (small particles, water held).
      Include icons for water retention, nutrients, drainage.

   --- SOIL FERTILITY – FERTILISERS ---
   3. fertiliser-types-straight-compound.png
      Top: straight fertilisers – separate bags for Nitrogen (N), Phosphorus (P),
      Potassium (K). Bottom: compound fertiliser – NPK blend bag. Include nutrient
      percentages on bags.

   --- IRRIGATION ---
   4. irrigation-water-quality.png
      A diagram with icons: salt crystals (salinity), pH scale (acid/alkaline),
      sodium (Na), toxic chemicals (skull), and bacteria (biological contamination).

   ============================================================ */