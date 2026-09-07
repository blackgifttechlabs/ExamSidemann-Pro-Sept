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
    const resolvedFileName = fileName === 'water-conservation-methods.png'
      ? fileName
      : fileName.replace(/\.(png|jpeg|webp)$/i, '.jpg');

    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        {isMissing ? (
          <div className="flex aspect-video flex-col items-center justify-center bg-slate-100 px-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-600">
              Image ready to add
            </p>
            <code className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
              {resolvedFileName}
            </code>
            <p className="mt-3 text-xs text-slate-500">
              Place this file in <strong>public/images/agriculture/soil-water/</strong>
            </p>
          </div>
        ) : (
          <img
            src={`/images/agriculture/soil-water/${resolvedFileName}`}
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
      id: 'soil-formation',
      title: 'Soil Formation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Soil Formation?">
            <p>
              <strong>Definition:</strong> Soil formation (pedogenesis) is the
              process by which rocks are broken down and transformed into a
              soil that can support plant life. It takes hundreds to thousands
              of years.
            </p>
            <p>
              The formation of soil involves weathering, the addition of organic
              matter, and the movement of materials within the soil profile.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Role of Weathering in Soil Formation">
            <p>
              Weathering is the breakdown of rocks and minerals at the Earth's
              surface. It creates the parent material from which soil develops.
              Weathering can be physical, chemical, or biological.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Physical Weathering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Temperature changes:</strong> Repeated heating and cooling
                cause rocks to expand and contract, creating cracks (exfoliation).
              </li>
              <li>
                <strong>Frost action:</strong> Water in cracks freezes, expands,
                and widens cracks (frost wedging).
              </li>
              <li>
                <strong>Root action:</strong> Plant roots grow into cracks and
                prise rocks apart.
              </li>
              <li>
                <strong>Abrasion:</strong> Rock fragments carried by wind, water,
                or ice scrape against other rocks.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Chemical Weathering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Oxidation:</strong> Oxygen reacts with minerals (e.g., iron)
                to form oxides (rust).
              </li>
              <li>
                <strong>Hydrolysis:</strong> Water reacts with minerals to form
                new compounds (e.g., feldspar to clay).
              </li>
              <li>
                <strong>Carbonation:</strong> Carbon dioxide in water forms weak
                carbonic acid, which dissolves limestone.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Biological Weathering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Organisms:</strong> Lichens, mosses, and bacteria produce
                acids that dissolve minerals.
              </li>
              <li>
                <strong>Burrowing animals:</strong> Worms, ants, and rodents mix
                soil and break down rocks.
              </li>
            </ul>
            <SoilImage
              fileName="weathering-types.png"
              alt="A 2D diagram showing physical, chemical, and biological weathering processes"
              caption="Types of weathering: physical, chemical, and biological."
            />
          </SubtopicCard>

          <SubtopicCard title="Types of Parent Rock and Factors Influencing Soil Formation">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Parent Rock</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Igneous rocks (e.g., granite, basalt):</strong> Weather to
                form sandy or clayey soils.
              </li>
              <li>
                <strong>Sedimentary rocks (e.g., sandstone, limestone):</strong>
                Sandstone gives sandy soils; limestone gives alkaline, calcium-rich soils.
              </li>
              <li>
                <strong>Metamorphic rocks (e.g., slate, marble):</strong> Produce
                soils with varying properties depending on the original rock.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Factors Influencing Soil Formation (CLORPT)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Climate:</strong> Temperature and rainfall affect weathering
                rates and organic matter. Tropical areas have deep, weathered soils;
                deserts have thin soils.
              </li>
              <li>
                <strong>Organisms:</strong> Plants add organic matter (humus) and
                roots break rocks. Animals mix soil. Microbes decompose matter.
              </li>
              <li>
                <strong>Relief (topography):</strong> On slopes, soils are shallow
                and well‑drained. In valleys, soils are deep and waterlogged.
              </li>
              <li>
                <strong>Parent material:</strong> The mineral composition of the
                underlying rock affects soil chemistry and texture.
              </li>
              <li>
                <strong>Time:</strong> Soils take thousands of years to develop.
                Older soils are more weathered and have distinct horizons.
              </li>
            </ul>
            <SoilImage
              fileName="soil-formation-factors.png"
              alt="A 2D diagram showing the CLORPT factors: Climate, Organisms, Relief, Parent material, Time"
              caption="Factors influencing soil formation: Climate, Organisms, Relief, Parent material, and Time."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Weathering:</strong> breakdown of rocks</li>
            <li><strong>Parent rock:</strong> original rock</li>
            <li><strong>Physical:</strong> freeze‑thaw, roots</li>
            <li><strong>Chemical:</strong> oxidation, hydrolysis</li>
            <li><strong>Biological:</strong> organisms, burrowing</li>
            <li><strong>CLORPT:</strong> Climate, Organisms, Relief, Parent material, Time</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-texture-structure-profile',
      title: 'Soil Texture, Structure and Profile',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Soil Texture">
            <p>
              <strong>Definition:</strong> Soil texture refers to the relative
              proportions of different particle sizes in the soil. The main sizes
              are sand, silt, and clay.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Sand:</strong> Largest particles (0.05–2.0 mm). Feels gritty.
                Drains quickly, low nutrient retention.
              </li>
              <li>
                <strong>Silt:</strong> Medium particles (0.002–0.05 mm). Feels smooth.
                Good water holding, moderate nutrients.
              </li>
              <li>
                <strong>Clay:</strong> Smallest particles (&lt;0.002 mm). Feels sticky.
                Holds water and nutrients well, but drains poorly.
              </li>
            </ul>
            <p>
              The texture determines how much water, air, and nutrients a soil can
              hold. A <strong>loam</strong> – a mixture of sand, silt, and clay –
              is best for farming because it has good drainage and nutrient retention.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Significance of Texture to Crop Growth</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Water holding capacity:</strong> Clay holds more water but
                can become waterlogged. Sandy soils dry out quickly.
              </li>
              <li>
                <strong>Nutrient availability:</strong> Clay and silt have a high
                surface area, so they hold nutrients (cations) better than sand.
              </li>
              <li>
                <strong>Aeration:</strong> Sandy soils have good aeration, but clay
                soils may become compacted and lack oxygen for roots.
              </li>
              <li>
                <strong>Workability:</strong> Loam is easy to plough. Clay is sticky
                when wet and hard when dry; sand is easy to cultivate but poor in nutrients.
              </li>
            </ul>
            <SoilImage
              fileName="soil-texture-triangle.png"
              alt="A soil texture triangle showing the proportions of sand, silt, and clay"
              caption="Soil texture triangle – particle size classes."
            />
          </SubtopicCard>

          <SubtopicCard title="Soil Structure">
            <p>
              <strong>Definition:</strong> Soil structure refers to the arrangement
              of soil particles into aggregates (clumps) called peds. It describes
              how the particles are held together.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Single grain:</strong> Particles are separate, like in sandy
                soils. No aggregation. This leads to poor water and nutrient retention.
              </li>
              <li>
                <strong>Crumb (or granular):</strong> Particles form small, rounded
                aggregates. This is ideal for plant growth – it provides good
                aeration, drainage, and root penetration.
              </li>
              <li>
                <strong>Other types:</strong> Blocky, prismatic, platy – all depend
                on how the soil was formed and the amount of organic matter.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Difference Between Texture and Structure</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Texture:</strong> The <em>size</em> of individual particles
                – it cannot be changed easily (it is an inherent property).
              </li>
              <li>
                <strong>Structure:</strong> The <em>arrangement</em> of particles
                – it can be improved by adding organic matter, reducing tillage,
                and avoiding compaction.
              </li>
            </ul>
            <SoilImage
              fileName="soil-structure-types.png"
              alt="A 2D diagram showing single grain, crumb, blocky, prismatic, and platy structures"
              caption="Types of soil structure: single grain, crumb, blocky, prismatic, platy."
            />
          </SubtopicCard>

          <SubtopicCard title="Soil Profile">
            <p>
              <strong>Definition:</strong> A soil profile is a vertical section
              of the soil from the surface down to the parent rock. It shows
              different layers (horizons).
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>O Horizon (Organic):</strong> Leaf litter and decomposed
                organic matter (humus) at the surface.
              </li>
              <li>
                <strong>A Horizon (Topsoil):</strong> Dark, rich in humus and
                minerals. Most plant roots and soil organisms are here.
              </li>
              <li>
                <strong>E Horizon (Eluviation):</strong> Zone of leaching where
                minerals and clay are washed down.
              </li>
              <li>
                <strong>B Horizon (Subsoil):</strong> Accumulation of clay, iron,
                and minerals washed from above.
              </li>
              <li>
                <strong>C Horizon (Parent material):</strong> Weathered rock
                fragments, little organic matter.
              </li>
              <li>
                <strong>R Horizon (Bedrock):</strong> Unweathered solid rock.
              </li>
            </ul>
            <SoilImage
              fileName="soil-profile-horizons.png"
              alt="A 2D diagram showing the O, A, E, B, C, and R horizons of a soil profile"
              caption="Soil profile: O, A, E, B, C, and R horizons."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Texture &amp; Structure</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Texture:</strong> particle size (sand, silt, clay)</li>
            <li><strong>Structure:</strong> arrangement of particles</li>
            <li><strong>Crumb:</strong> ideal for crops</li>
            <li><strong>Horizons:</strong> O, A, E, B, C, R</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-fertility',
      title: 'Soil Fertility',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Soil Fertility?">
            <p>
              <strong>Definition:</strong> Soil fertility is the ability of soil
              to provide essential nutrients to plants in adequate amounts and
              in proper balance. It depends on both the mineral content (from
              weathering) and the organic matter (humus) in the soil.
            </p>
            <p>
              Plants need many nutrients. These are divided into <strong>major</strong>
              (macronutrients) and <strong>minor</strong> (micronutrients).
            </p>
          </SubtopicCard>

          <SubtopicCard title="Major Plant Nutrients">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Nitrogen (N):</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Function: promotes leafy growth and green colour (chlorophyll).</li>
                  <li>Deficiency: stunted growth, yellowing of older leaves (chlorosis).</li>
                  <li>Over‑supply: excessive leafy growth, weak stems, delayed maturity.</li>
                </ul>
              </li>
              <li>
                <strong>Phosphorus (P):</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Function: root development, flowering, fruiting, energy transfer.</li>
                  <li>Deficiency: slow growth, poor root system, purple or dark green leaves.</li>
                  <li>Over‑supply: may cause zinc or iron deficiencies.</li>
                </ul>
              </li>
              <li>
                <strong>Potassium (K):</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Function: water regulation, enzyme activation, disease resistance.</li>
                  <li>Deficiency: scorching of leaf margins, weak stems, poor fruit quality.</li>
                  <li>Over‑supply: can cause magnesium deficiency.</li>
                </ul>
              </li>
              <li>
                <strong>Calcium (Ca):</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Function: cell wall structure, root and leaf development.</li>
                  <li>Deficiency: stunted roots, leaf curling, blossom‑end rot in tomatoes.</li>
                </ul>
              </li>
              <li>
                <strong>Magnesium (Mg):</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Function: central component of chlorophyll; enzyme activator.</li>
                  <li>Deficiency: yellowing between leaf veins (interveinal chlorosis).</li>
                </ul>
              </li>
              <li>
                <strong>Sulfur (S):</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Function: protein synthesis, enzyme function.</li>
                  <li>Deficiency: yellowing of young leaves, stunted growth.</li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Minor (Micronutrients)">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Iron (Fe), Zinc (Zn), Manganese (Mn), Copper (Cu), Boron (B), Molybdenum (Mo), Chlorine (Cl):</strong>
                Needed in small amounts but are essential for enzyme functions,
                chlorophyll formation, and other processes.
              </li>
              <li>
                Deficiencies cause various symptoms: iron chlorosis (yellowing),
                zinc stunted growth, etc.
              </li>
            </ul>
            <SoilImage
              fileName="nutrient-deficiency-symptoms.png"
              alt="A 2D diagram showing symptoms of nutrient deficiencies in plants (e.g., yellowing, stunting, leaf scorch)"
              caption="Common symptoms of nutrient deficiencies in plants."
            />
          </SubtopicCard>

          <SubtopicCard title="Effects of Nutrients on Plant Growth">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Balanced supply:</strong> Healthy growth, high yields, good
                resistance to pests and diseases.
              </li>
              <li>
                <strong>Deficiency:</strong> Poor growth, low yields, visible
                symptoms, increased susceptibility.
              </li>
              <li>
                <strong>Over‑supply (toxicity):</strong> Can burn roots, cause
                nutrient imbalances (e.g., too much nitrogen reduces fruiting),
                and harm soil organisms.
              </li>
            </ul>
            <p>
              Farmers use fertilisers (organic or chemical) to correct deficiencies,
              but they must apply the right amounts at the right time.
            </p>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Fertility Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Major:</strong> N (leaf), P (roots/fruit), K (water/disease)</li>
            <li><strong>Minor:</strong> Fe, Zn, Mn, Cu, B, etc.</li>
            <li><strong>Deficiency:</strong> stunting, yellowing, poor yields</li>
            <li><strong>Fertilisers:</strong> correct shortages</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-erosion-conservation',
      title: 'Soil Erosion and Conservation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Soil Erosion?">
            <p>
              <strong>Definition:</strong> Soil erosion is the removal of the
              topsoil layer by natural agents (water, wind, ice) or human activities.
              It is a serious problem because topsoil contains most of the organic
              matter and nutrients that plants need.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Types of Soil Erosion">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">By Water</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Sheet erosion:</strong> Thin layers of topsoil are removed
                evenly over a large area by rainwater. Hard to see but very damaging.
              </li>
              <li>
                <strong>Rill erosion:</strong> Small channels (rills) are formed by
                running water on the surface. Can be filled by ploughing.
              </li>
              <li>
                <strong>Gully erosion:</strong> Large, deep channels that cannot be
                crossed by farm machinery. They develop when rills are not controlled.
              </li>
              <li>
                <strong>Splash erosion:</strong> Raindrops hit the bare soil and
                dislodge particles, which then wash away.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">By Wind</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Wind erosion:</strong> Occurs in dry, bare areas. Fine soil
                particles are lifted and carried away (dust storms). Common in
                semi‑arid regions like parts of Zimbabwe.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">By Mass Movement (e.g., landslides)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Movement of soil down a slope under gravity, often triggered by heavy rain or deforestation.</li>
            </ul>
            <SoilImage
              fileName="soil-erosion-types.png"
              alt="A 2D diagram showing sheet, rill, gully, and wind erosion"
              caption="Types of soil erosion: sheet, rill, gully, and wind."
            />
          </SubtopicCard>

          <SubtopicCard title="Causes and Consequences of Soil Erosion">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Deforestation:</strong> Removing trees exposes soil to
                rain and wind.
              </li>
              <li>
                <strong>Overgrazing:</strong> Livestock trample vegetation, leaving
                soil bare.
              </li>
              <li>
                <strong>Poor farming practices:</strong> Ploughing up and down slopes,
                leaving fields bare, not using contour ridges.
              </li>
              <li>
                <strong>Climate:</strong> Heavy rainfall and strong winds increase
                erosion risk.
              </li>
              <li>
                <strong>Construction and mining:</strong> Remove vegetation and
                disturb soil.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Consequences</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Loss of topsoil and fertility – reduced crop yields.</li>
              <li>Sedimentation of rivers, dams, and lakes – silting leads to flooding and reduced water storage.</li>
              <li>Land degradation – land becomes unusable.</li>
              <li>Desertification – in extreme cases, land turns to desert.</li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Prevention and Control Methods">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Contour ploughing:</strong> Ploughing across the slope,
                not up and down – reduces water runoff.
              </li>
              <li>
                <strong>Terracing:</strong> Building steps on steep slopes to slow
                water flow and trap soil.
              </li>
              <li>
                <strong>Strip cropping:</strong> Planting rows of different crops
                across the slope to break water flow.
              </li>
              <li>
                <strong>Cover crops and mulching:</strong> Protecting soil with
                vegetation or organic material reduces splash erosion.
              </li>
              <li>
                <strong>Afforestation/reforestation:</strong> Planting trees
                stabilises soil and reduces runoff.
              </li>
              <li>
                <strong>Windbreaks:</strong> Rows of trees or shrubs to reduce
                wind speed.
              </li>
              <li>
                <strong>Drainage and gully control:</strong> Building check dams,
                filling gullies with stones or vegetation.
              </li>
              <li>
                <strong>Conservation tillage:</strong> Reducing ploughing to keep
                soil covered (minimum tillage, no‑till).
              </li>
            </ul>
            <SoilImage
              fileName="soil-conservation-methods.png"
              alt="A 2D diagram showing conservation methods: contour ploughing, terracing, strip cropping, windbreaks, and cover crops"
              caption="Soil conservation methods."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Erosion &amp; Conservation</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Types:</strong> sheet, rill, gully, wind</li>
            <li><strong>Causes:</strong> deforestation, overgrazing, poor farming</li>
            <li><strong>Effects:</strong> fertility loss, siltation, desertification</li>
            <li><strong>Control:</strong> contours, terraces, cover crops, windbreaks</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'water-conservation',
      title: 'Water Conservation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Water Conservation?">
            <p>
              <strong>Definition:</strong> Water conservation is the careful use
              and protection of water resources to ensure they are available for
              future generations. It involves reducing water waste, preventing
              pollution, and increasing water efficiency.
            </p>
            <p>
              In agriculture, water conservation is crucial because farming uses
              about 70% of the world's freshwater. With growing populations and
              climate change, water is becoming scarce.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Importance of Water Conservation">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Ensures food security:</strong> Without enough water, crops
                fail, leading to hunger.
              </li>
              <li>
                <strong>Protects ecosystems:</strong> Rivers, wetlands, and lakes
                need water to survive.
              </li>
              <li>
                <strong>Reduces conflicts:</strong> Water scarcity can lead to
                disputes between users and regions.
              </li>
              <li>
                <strong>Saves energy:</strong> Pumping and treating water uses
                a lot of energy; conserving water saves energy.
              </li>
              <li>
                <strong>Adapts to climate change:</strong> Conservation helps
                communities cope with droughts and variable rainfall.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Methods of Conserving Water on Arable Land">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Rainwater harvesting:</strong> Collecting rainwater from
                roofs or catchment areas into tanks, dams, or ponds for later use.
              </li>
              <li>
                <strong>Drip irrigation:</strong> Water is delivered slowly and
                directly to plant roots through pipes and emitters. It reduces
                evaporation and runoff.
              </li>
              <li>
                <strong>Mulching:</strong> Covering the soil with organic material
                (e.g., straw, grass) or plastic. This reduces evaporation, keeps
                soil cool, and suppresses weeds.
              </li>
              <li>
                <strong>Contour bunds and ridges:</strong> Small earth barriers
                built along contours to trap water and allow it to soak in.
              </li>
              <li>
                <strong>Zai pits (planting pits):</strong> Small holes dug to
                concentrate water and nutrients around crops, common in dry areas.
              </li>
              <li>
                <strong>Reduced tillage:</strong> Leaving crop residues on the
                surface reduces runoff and increases infiltration.
              </li>
              <li>
                <strong>Improved soil structure:</strong> Adding organic matter
                improves water holding capacity, reducing the need for frequent irrigation.
              </li>
              <li>
                <strong>Timely planting:</strong> Sowing at the start of the rainy
                season to make best use of natural rainfall.
              </li>
            </ul>
            <SoilImage
              fileName="water-conservation-methods.png"
              alt="A 2D diagram showing water conservation methods: rainwater harvesting, drip irrigation, mulching, contour bunds, and zai pits"
              caption="Methods of conserving water on arable land."
            />
          </SubtopicCard>

          <SubtopicCard title="Zimbabwe and African Context">
            <p>
              In Zimbabwe, water conservation is critical, especially in the
              drier regions (e.g., Matabeleland, lowveld). Farmers use techniques
              like <strong>in-field rainwater harvesting</strong>, <strong>dead-level contours</strong>,
              and <strong>small dams</strong> to capture and store water.
            </p>
            <p>
              In sub‑Saharan Africa, conservation agriculture (minimum tillage,
              cover crops, crop rotation) is promoted to improve water efficiency
              and soil health.
            </p>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Water Conservation</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Importance:</strong> food, ecosystems, energy, peace</li>
            <li><strong>Methods:</strong> rainwater harvest, drip irrigation, mulching</li>
            <li><strong>Traditional:</strong> zai pits, contour bunds</li>
            <li><strong>Zimbabwe:</strong> dead‑level contours, small dams</li>
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
            GEOGRAPHY
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Soil and Water Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Understand soil formation, texture, structure, fertility, erosion,
            conservation, and water conservation – with a focus on sustainable
            management for agriculture.
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
                  <strong className="text-white">Soil formation</strong> involves
                  weathering (physical, chemical, biological) and is influenced by
                  climate, organisms, relief, parent material, and time (CLORPT).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Soil texture</strong> (sand, silt,
                  clay) affects drainage and nutrient holding. <strong>Structure</strong>
                  (e.g., crumb) is the arrangement of particles – crumb is best for
                  crops.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Soil fertility</strong> depends on
                  major nutrients (N, P, K, Ca, Mg, S) and micronutrients. Deficiency
                  causes stunting, yellowing, and poor yields; fertilisers can correct
                  imbalances.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Soil erosion</strong> (sheet, rill,
                  gully, wind) is caused by deforestation, overgrazing, and poor
                  farming. It leads to fertility loss and siltation. Control methods
                  include contour ploughing, terracing, and cover crops.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Water conservation</strong> is vital
                  for agriculture. Techniques like rainwater harvesting, drip irrigation,
                  mulching, and zai pits help save water and improve crop resilience.
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

   --- SOIL FORMATION ---
   1. weathering-types.png
      Side‑by‑side panels: physical (freeze‑thaw, roots), chemical (oxidation, hydrolysis), biological (burrowing, lichens).
   2. soil-formation-factors.png
      Diagram with icons for Climate (sun/rain), Organisms (tree/worm), Relief (mountain/valley), Parent material (rock), Time (clock) – CLORPT.

   --- SOIL TEXTURE, STRUCTURE AND PROFILE ---
   3. soil-texture-triangle.png
      Triangle diagram showing sand, silt, clay percentages with labels for textural classes (loam, sandy loam, clay, etc.).
   4. soil-structure-types.png
      Drawings of single grain, crumb (granular), blocky, prismatic, platy structures.
   5. soil-profile-horizons.png
      Vertical section showing O (organic), A (topsoil), E (eluviation), B (subsoil), C (parent material), R (bedrock).

   --- SOIL FERTILITY ---
   6. nutrient-deficiency-symptoms.png
      Composite of plant leaves showing yellowing (N), purple/red (P), scorching (K), interveinal chlorosis (Mg), etc.

   --- SOIL EROSION AND CONSERVATION ---
   7. soil-erosion-types.png
      Diagrams: sheet (thin layer removed), rill (small channels), gully (large channels), wind (dust storm).
   8. soil-conservation-methods.png
      Icons: contour ploughing, terracing, strip cropping, windbreaks, cover crops, mulching.

   --- WATER CONSERVATION ---
   9. water-conservation-methods.png
      Icons: rainwater tank, drip irrigation, mulch, contour bunds, zai pits, dead‑level contours.

   ============================================================ */
