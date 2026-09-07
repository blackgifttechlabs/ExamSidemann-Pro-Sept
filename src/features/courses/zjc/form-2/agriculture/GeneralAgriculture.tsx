import React, { useState, useRef } from 'react';

/**
 * Topic: General Agriculture – Full component with sticky navigation,
 * container cards (9px border-radius), image placeholders,
 * and auto‑scroll + double‑highlight on heading.
 */
export const GeneralAgriculture: React.FC = () => {
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
      id: 'land-use',
      title: 'Land Use',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Effects of Population Growth on Land Use (Land Pressure)">
            <p>
              <strong>Definition:</strong> Land use refers to the way land is utilised
              by people for various purposes such as agriculture, forestry, wildlife
              management, settlement, and industry. Population growth has a significant
              impact on how land is used, often leading to land pressure.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">What is Land Pressure?</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Land pressure occurs when the demand for
                land exceeds its availability or carrying capacity. This happens when
                the population grows faster than the land's ability to support it.
              </li>
              <li>
                <strong>Causes:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Population growth:</strong> More people need more land
                    for farming, housing, and infrastructure.
                  </li>
                  <li>
                    <strong>Urbanisation:</strong> Cities expand into agricultural
                    and natural land.
                  </li>
                  <li>
                    <strong>Land degradation:</strong> Poor land management reduces
                    the productivity of land, forcing people to clear more land.
                  </li>
                  <li>
                    <strong>Economic development:</strong> Industry and infrastructure
                    take up land that was previously used for farming or conservation.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects of Population Growth on Land Use</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Agricultural land:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Land fragmentation:</strong> As families grow, land is
                    divided among children, leading to smaller and smaller plots.
                    Small plots are often uneconomic and difficult to farm efficiently.
                  </li>
                  <li>
                    <strong>Intensification:</strong> To produce more food from
                    limited land, farmers intensify production through increased
                    use of fertilisers, pesticides, and irrigation. This can lead
                    to land degradation.
                  </li>
                  <li>
                    <strong>Encroachment on marginal land:</strong> People move onto
                    marginal land (steep slopes, semi-arid areas) that is unsuitable
                    for farming, leading to soil erosion and land degradation.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Forest land:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Deforestation:</strong> More people need more land for
                    farming and firewood, leading to clearing of forests. This results
                    in loss of biodiversity, soil erosion, and climate change.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Urban land:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Urban expansion:</strong> Cities and towns grow, consuming
                    agricultural land and natural habitats. This reduces the land
                    available for food production.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Water resources:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Water scarcity:</strong> More people need more water for
                    domestic, agricultural, and industrial use. This leads to
                    over-extraction of water from rivers and aquifers.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Zimbabwe Example</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Zimbabwe's population has grown from about 7 million in 1980 to over
                15 million in 2022. This has led to:
              </li>
              <li>
                <strong>Land fragmentation:</strong> In communal areas, plots have
                become smaller and smaller as families divide land among children.
              </li>
              <li>
                <strong>Deforestation:</strong> Forests have been cleared for farming
                and firewood, especially in areas like the Eastern Highlands and
                around urban centres.
              </li>
              <li>
                <strong>Soil erosion:</strong> Farming on steep slopes and overgrazing
                have led to severe soil erosion in many areas.
              </li>
              <li>
                <strong>Urban expansion:</strong> Cities like Harare and Bulawayo
                have expanded, consuming agricultural land on their outskirts.
              </li>
            </ul>

            <AgricultureImage
              fileName="population-growth-land-use.png"
              alt="A 2D diagram showing the effects of population growth on land use: land fragmentation, deforestation, urban expansion, and water scarcity"
              caption="Effects of population growth on land use in Zimbabwe."
            />
          </SubtopicCard>

          <SubtopicCard title="Farming Systems">
            <p>
              <strong>Definition:</strong> A farming system is the way in which a
              farm is organised and managed. It includes the choice of crops, livestock,
              and the methods used to produce them. Different farming systems are
              used depending on the physical environment, economic factors, and the
              goals of the farmer.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Mixed Farming</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Mixed farming is a system where both
                crops and livestock are produced on the same farm. The crops provide
                food for the livestock, and the livestock provide manure for the crops.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Integration of crop and livestock production.</li>
                  <li>Nutrient recycling (manure used as fertiliser).</li>
                  <li>Diversified income sources.</li>
                  <li>Reduced risk (if one enterprise fails, the other may succeed).</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Improves soil fertility through manure.</li>
                  <li>Reduces risk through diversification.</li>
                  <li>More efficient use of labour and resources.</li>
                  <li>Provides a balanced diet (crops and animal products).</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Requires more skills and knowledge.</li>
                  <li>Can be labour-intensive.</li>
                  <li>Requires more capital investment.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Small-scale farms:</strong> Many communal and resettlement
                    farmers practise mixed farming, growing maize and other crops
                    while also keeping cattle, goats, and poultry.
                  </li>
                  <li>
                    <strong>Commercial farms:</strong> Some commercial farms combine
                    crop production (maize, wheat) with livestock (cattle, dairy).
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="mixed-farming.png"
              alt="A realistic photograph or 2D diagram showing mixed farming: crops and livestock together on the same farm"
              caption="Mixed farming: integration of crop and livestock production."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Monoculture</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Monoculture is the practice of growing
                a single crop on the same land year after year. It is common in
                commercial agriculture.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Single crop grown repeatedly.</li>
                  <li>High use of machinery and technology.</li>
                  <li>Specialised management.</li>
                  <li>Often used for cash crops (tobacco, cotton, sugar).</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Economies of scale (lower costs per unit).</li>
                  <li>Specialised knowledge and equipment.</li>
                  <li>High yields (with proper management).</li>
                  <li>Simplified management.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Soil nutrient depletion (same crop removes same nutrients).</li>
                  <li>Increased pest and disease problems (pests build up over time).</li>
                  <li>Risk of crop failure (if pest/disease strikes).</li>
                  <li>Reduced biodiversity.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Tobacco:</strong> Grown as a monoculture in parts of
                    Mashonaland.
                  </li>
                  <li>
                    <strong>Sugarcane:</strong> Grown as a monoculture in the Lowveld
                    (Triangle, Hippo Valley).
                  </li>
                  <li>
                    <strong>Maize:</strong> Grown as a monoculture on many commercial
                    farms.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="monoculture-farming.png"
              alt="A realistic photograph or 2D diagram showing monoculture farming: a single crop growing across a large field"
              caption="Monoculture: growing a single crop on the same land."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Intercropping</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Intercropping is the practice of growing
                two or more crops on the same land at the same time. It is common in
                small-scale farming.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Multiple crops grown together.</li>
                  <li>Often used by small-scale farmers.</li>
                  <li>Can be done in rows or mixed randomly.</li>
                </ul>
              </li>
              <li>
                <strong>Types of intercropping:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Mixed intercropping:</strong> Crops are mixed randomly
                    in the field.
                  </li>
                  <li>
                    <strong>Row intercropping:</strong> Crops are planted in
                    alternating rows.
                  </li>
                  <li>
                    <strong>Relay intercropping:</strong> A second crop is planted
                    before the first crop is harvested.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Efficient use of resources:</strong> Different crops use
                    different nutrients and light, making better use of the land.
                  </li>
                  <li>
                    <strong>Risk reduction:</strong> If one crop fails, the other
                    may still survive.
                  </li>
                  <li>
                    <strong>Pest and disease control:</strong> Diversification
                    reduces pest and disease build-up.
                  </li>
                  <li>
                    <strong>Soil conservation:</strong> Ground cover protects the
                    soil from erosion.
                  </li>
                  <li>
                    <strong>Improved nutrition:</strong> Provides a variety of foods
                    for the family.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Competition between crops.</li>
                  <li>More complex to manage.</li>
                  <li>Reduced yields for individual crops.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Maize and beans:</strong> Commonly intercropped in
                    communal areas.
                  </li>
                  <li>
                    <strong>Maize, groundnuts, and pumpkins:</strong> Often grown
                    together in small-scale farming.
                  </li>
                  <li>
                    <strong>Sorghum and cowpeas:</strong> Grown together in drier areas.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="intercropping.png"
              alt="A realistic photograph or 2D diagram showing intercropping: maize and beans growing together in the same field"
              caption="Intercropping: growing multiple crops together."
            />
          </SubtopicCard>

          <SubtopicCard title="Comparison of Farming Systems">
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Feature</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Mixed Farming</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Monoculture</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Intercropping</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Crops</td>
                  <td className="border border-slate-300 px-4 py-2">Multiple crops + livestock</td>
                  <td className="border border-slate-300 px-4 py-2">Single crop</td>
                  <td className="border border-slate-300 px-4 py-2">Multiple crops together</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Risk</td>
                  <td className="border border-slate-300 px-4 py-2">Low (diversified)</td>
                  <td className="border border-slate-300 px-4 py-2">High (single crop)</td>
                  <td className="border border-slate-300 px-4 py-2">Low (diversified)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Labour</td>
                  <td className="border border-slate-300 px-4 py-2">High</td>
                  <td className="border border-slate-300 px-4 py-2">Low (mechanised)</td>
                  <td className="border border-slate-300 px-4 py-2">High</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Capital</td>
                  <td className="border border-slate-300 px-4 py-2">Moderate</td>
                  <td className="border border-slate-300 px-4 py-2">High</td>
                  <td className="border border-slate-300 px-4 py-2">Low</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Soil fertility</td>
                  <td className="border border-slate-300 px-4 py-2">Maintained (manure)</td>
                  <td className="border border-slate-300 px-4 py-2">Depleted</td>
                  <td className="border border-slate-300 px-4 py-2">Improved (diverse)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Scale</td>
                  <td className="border border-slate-300 px-4 py-2">Small to large</td>
                  <td className="border border-slate-300 px-4 py-2">Large</td>
                  <td className="border border-slate-300 px-4 py-2">Small</td>
                </tr>
              </tbody>
            </table>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Land pressure:</strong> demand exceeds supply of land</li>
            <li><strong>Mixed farming:</strong> crops + livestock</li>
            <li><strong>Monoculture:</strong> single crop</li>
            <li><strong>Intercropping:</strong> multiple crops together</li>
            <li><strong>Land fragmentation:</strong> division of land into small plots</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'environmental-factors',
      title: 'Environmental Factors',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Ways of Reducing Adverse Environmental Effects on Agriculture">
            <p>
              <strong>Definition:</strong> Agriculture is affected by environmental
              factors such as temperature, wind, rainfall, and soil conditions.
              Farmers use various methods to reduce the negative effects of these
              factors and improve crop production.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Shading</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Shading is the practice of providing
                shade to crops to protect them from excessive sunlight and heat.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Using shade nets in greenhouses.</li>
                  <li>Planting trees or tall crops to provide shade.</li>
                  <li>Using temporary shade structures.</li>
                </ul>
              </li>
              <li>
                <strong>Benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Reduces heat stress and sunburn.</li>
                  <li>Reduces water loss (transpiration).</li>
                  <li>Improves quality of crops (e.g., vegetables, flowers).</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="shading-agriculture.png"
              alt="A 2D diagram showing shading methods: shade nets, tree shade, and temporary shade structures"
              caption="Shading methods to protect crops from excessive sunlight."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Mulching</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Mulching is the application of a layer
                of organic or inorganic material to the soil surface around plants.
              </li>
              <li>
                <strong>Materials:</strong> Straw, grass, leaves, compost, wood chips,
                plastic film, stones.
              </li>
              <li>
                <strong>Benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Conserves soil moisture by reducing evaporation.</li>
                  <li>Suppresses weed growth.</li>
                  <li>Moderates soil temperature (keeps soil cool in summer, warm in winter).</li>
                  <li>Adds organic matter to the soil (when organic mulch decomposes).</li>
                  <li>Reduces soil erosion.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Mulching is used in horticulture
                (vegetables, fruits) and in small-scale farming to conserve soil moisture.
              </li>
            </ul>

            <AgricultureImage
              fileName="mulching-techniques.png"
              alt="A 2D diagram showing mulching techniques: organic mulch (straw, leaves) and plastic mulch"
              caption="Mulching techniques to conserve soil moisture and control weeds."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Pot-Holing</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Pot-holing is a technique where planting
                holes are dug deep and filled with organic matter and fertiliser.
                It is used to concentrate nutrients and water for the plant.
              </li>
              <li>
                <strong>Method:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Dig holes (30-50cm deep, 30-50cm wide).</li>
                  <li>Mix soil with manure and fertiliser.</li>
                  <li>Fill the holes with the mixture and plant.</li>
                </ul>
              </li>
              <li>
                <strong>Benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Concentrates nutrients and water for the plant.</li>
                  <li>Improves root development.</li>
                  <li>Increases yields on poor soils.</li>
                  <li>Reduces water loss.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Pot-holing is used in small-scale
                farming, especially in communal areas with poor soils.
              </li>
            </ul>

            <AgricultureImage
              fileName="pot-holing-technique.png"
              alt="A 2D diagram showing the pot-holing technique: digging holes, adding manure, and planting"
              caption="Pot-holing technique for improving plant growth on poor soils."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Manuring</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Manuring is the application of organic
                matter (animal manure, compost) to the soil to improve fertility.
              </li>
              <li>
                <strong>Types of manure:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Animal manure:</strong> Cattle dung, goat manure, poultry manure.
                  </li>
                  <li>
                    <strong>Compost:</strong> Decomposed plant material.
                  </li>
                  <li>
                    <strong>Green manure:</strong> Plants grown and ploughed into the soil.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Adds nutrients to the soil (nitrogen, phosphorus, potassium).</li>
                  <li>Improves soil structure.</li>
                  <li>Increases water-holding capacity.</li>
                  <li>Encourages beneficial soil organisms.</li>
                  <li>Recycles nutrients.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Manuring is widely used in communal
                and resettlement areas, as well as on commercial farms.
              </li>
            </ul>

            <AgricultureImage
              fileName="manuring-techniques.png"
              alt="A 2D diagram showing manuring techniques: applying animal manure, compost, and green manure"
              caption="Manuring techniques for improving soil fertility."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Tie-Ridging</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Tie-ridging is a soil and water conservation
                technique where ridges are made in the field and small dams (ties)
                are created between ridges to trap water.
              </li>
              <li>
                <strong>Method:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Create ridges (raised rows) along the contour.</li>
                  <li>Create small barriers (ties) between the ridges.</li>
                  <li>Water is trapped in the furrows and absorbed by the soil.</li>
                </ul>
              </li>
              <li>
                <strong>Benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Reduces runoff and soil erosion.</li>
                  <li>Increases water infiltration.</li>
                  <li>Improves moisture availability for crops.</li>
                  <li>Increases yields in dry areas.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Tie-ridging is used in semi-arid
                areas of Zimbabwe (Matabeleland, Masvingo) to conserve water and
                improve crop yields.
              </li>
            </ul>

            <AgricultureImage
              fileName="tie-ridging-diagram.png"
              alt="A 2D diagram showing tie-ridging: ridges with small dams to trap water"
              caption="Tie-ridging: soil and water conservation technique."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Watering (Irrigation)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Watering (irrigation) is the artificial
                application of water to crops when rainfall is insufficient.
              </li>
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Surface (flood) irrigation:</strong> Water flows over the soil.
                  </li>
                  <li>
                    <strong>Sprinkler irrigation:</strong> Water is sprayed over the crops.
                  </li>
                  <li>
                    <strong>Drip irrigation:</strong> Water is delivered directly to
                    the plant roots.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Ensures water availability for crops.</li>
                  <li>Allows year-round production.</li>
                  <li>Increases yields and quality.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Irrigation is used in the Lowveld
                (sugarcane), Eastern Highlands (horticulture), and along rivers
                (small-scale irrigation schemes).
              </li>
            </ul>

            <AgricultureImage
              fileName="irrigation-types.png"
              alt="A 2D diagram showing types of irrigation: surface, sprinkler, and drip irrigation"
              caption="Types of irrigation: surface, sprinkler, and drip irrigation."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Conservation Tillage</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Conservation tillage is a farming practice
                that minimises soil disturbance and maintains soil cover to reduce
                erosion and improve soil health.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Zero tillage (no-till):</strong> No ploughing is done.
                    Seeds are planted directly into the soil.
                  </li>
                  <li>
                    <strong>Minimum tillage:</strong> Only limited ploughing is done.
                  </li>
                  <li>
                    <strong>Mulch tillage:</strong> Crop residues are left on the soil
                    surface to protect the soil.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Reduces soil erosion.</li>
                  <li>Improves soil structure and water infiltration.</li>
                  <li>Increases soil organic matter.</li>
                  <li>Saves labour and fuel.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Conservation tillage (especially
                zero tillage) is promoted in Zimbabwe through the Pfumvudza
                conservation agriculture programme.
              </li>
            </ul>

            <AgricultureImage
              fileName="conservation-tillage.png"
              alt="A 2D diagram showing conservation tillage methods: zero tillage, minimum tillage, and mulch tillage"
              caption="Conservation tillage methods for soil protection."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Windbreaks</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Windbreaks are rows of trees, hedges,
                or fences planted to reduce wind speed and protect crops from wind damage.
              </li>
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Shelterbelts:</strong> Rows of trees planted to protect
                    crops from wind.
                  </li>
                  <li>
                    <strong>Hedges:</strong> Thick rows of shrubs or trees.
                  </li>
                  <li>
                    <strong>Fences:</strong> Solid or semi-solid barriers.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Reduces wind damage to crops.</li>
                  <li>Reduces soil erosion by wind.</li>
                  <li>Reduces water loss (transpiration).</li>
                  <li>Provides habitat for wildlife.</li>
                  <li>Provides timber and fuelwood.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Windbreaks are used on commercial
                farms to protect crops like tobacco and vegetables. In rural areas,
                trees are planted around homesteads to provide shelter.
              </li>
            </ul>

            <AgricultureImage
              fileName="windbreaks-agriculture.png"
              alt="A 2D diagram showing windbreaks: shelterbelts, hedges, and fences protecting crops from wind"
              caption="Windbreaks: protecting crops from wind damage."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Environmental Methods</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Shading:</strong> protects from heat</li>
            <li><strong>Mulching:</strong> conserves moisture</li>
            <li><strong>Pot-holing:</strong> concentrates nutrients</li>
            <li><strong>Manuring:</strong> adds organic matter</li>
            <li><strong>Tie-ridging:</strong> traps water</li>
            <li><strong>Watering:</strong> irrigates crops</li>
            <li><strong>Conservation tillage:</strong> reduces erosion</li>
            <li><strong>Windbreaks:</strong> reduces wind damage</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'forestry',
      title: 'Forestry',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Softwood vs Hardwood">
            <p>
              <strong>Definition:</strong> Timber is classified into two main categories:
              softwood and hardwood. This classification is based on the type of tree
              and the characteristics of the wood.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Softwood</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Softwood comes from coniferous trees
                (gymnosperms) that have needles and cones. They are usually evergreen.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Generally lighter and less dense.</li>
                  <li>Grows faster than hardwoods.</li>
                  <li>Straight grain, easy to work with.</li>
                  <li>Used for construction, paper, and furniture.</li>
                  <li>Examples: Pine, spruce, fir, cedar.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Pine (planted in the Eastern
                Highlands for timber and paper production).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Hardwood</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Hardwood comes from broad-leaved trees
                (angiosperms) that have flowers and seeds enclosed in fruits.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Generally heavier and denser.</li>
                  <li>Grows slower than softwoods.</li>
                  <li>Often more durable and resistant to rot and insects.</li>
                  <li>Used for high-quality furniture, flooring, and construction.</li>
                  <li>Examples: Teak, mahogany, oak, maple, mopane, mukwa.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Teak, mahogany, mopane, and mukwa
                are all hardwoods found in Zimbabwe.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Comparison of Softwood and Hardwood</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Feature</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Softwood</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Hardwood</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Tree type</td>
                  <td className="border border-slate-300 px-4 py-2">Coniferous (needles, cones)</td>
                  <td className="border border-slate-300 px-4 py-2">Broad-leaved (flowers, fruits)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Growth rate</td>
                  <td className="border border-slate-300 px-4 py-2">Fast</td>
                  <td className="border border-slate-300 px-4 py-2">Slow</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Density</td>
                  <td className="border border-slate-300 px-4 py-2">Light</td>
                  <td className="border border-slate-300 px-4 py-2">Heavy</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Durability</td>
                  <td className="border border-slate-300 px-4 py-2">Moderate</td>
                  <td className="border border-slate-300 px-4 py-2">High</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Uses</td>
                  <td className="border border-slate-300 px-4 py-2">Construction, paper</td>
                  <td className="border border-slate-300 px-4 py-2">Furniture, flooring</td>
                </tr>
              </tbody>
            </table>

            <AgricultureImage
              fileName="softwood-hardwood.png"
              alt="A 2D diagram showing the difference between softwood (pine) and hardwood (teak, mahogany) with characteristics"
              caption="Softwood vs hardwood: characteristics and uses."
            />
          </SubtopicCard>

          <SubtopicCard title="Factors Influencing Choice of a Nursery Site">
            <p>
              <strong>Definition:</strong> A tree nursery is a place where tree
              seedlings are raised before they are transplanted to their permanent
              location. Choosing the right nursery site is essential for producing
              healthy, vigorous seedlings.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Water supply:</strong>
                <br />
                <strong>Requirement:</strong> The nursery must have access to a
                reliable water source (river, borehole, dam) for irrigation.
                <br />
                <strong>Importance:</strong> Seedlings need regular watering to
                survive and grow.
              </li>
              <li>
                <strong>Soil type:</strong>
                <br />
                <strong>Requirement:</strong> The soil should be well-drained,
                fertile, and with good water-holding capacity.
                <br />
                <strong>Importance:</strong> Good soil promotes healthy root growth
                and reduces disease.
              </li>
              <li>
                <strong>Topography:</strong>
                <br />
                <strong>Requirement:</strong> The site should be flat or gently
                sloping, with good drainage.
                <br />
                <strong>Importance:</strong> Flat land is easier to manage and
                prevents waterlogging.
              </li>
              <li>
                <strong>Accessibility:</strong>
                <br />
                <strong>Requirement:</strong> The nursery should be accessible by
                road for transporting inputs (seeds, manure, pots) and outputs
                (seedlings).
                <br />
                <strong>Importance:</strong> Reduces transport costs and makes
                management easier.
              </li>
              <li>
                <strong>Protection from animals:</strong>
                <br />
                <strong>Requirement:</strong> The site should be protected from
                livestock and wild animals that may damage seedlings.
                <br />
                <strong>Importance:</strong> Fencing is essential to protect seedlings.
              </li>
              <li>
                <strong>Protection from wind:</strong>
                <br />
                <strong>Requirement:</strong> The site should be sheltered from
                strong winds (windbreaks or natural shelter).
                <br />
                <strong>Importance:</strong> Wind can damage seedlings and increase
                water loss.
              </li>
              <li>
                <strong>Sunlight:</strong>
                <br />
                <strong>Requirement:</strong> The site should receive adequate
                sunlight for seedling growth, but some shade may be needed for certain species.
                <br />
                <strong>Importance:</strong> Sunlight is essential for photosynthesis.
              </li>
              <li>
                <strong>Proximity to planting site:</strong>
                <br />
                <strong>Requirement:</strong> The nursery should be located near
                the area where seedlings will be planted.
                <br />
                <strong>Importance:</strong> Reduces transport stress on seedlings.
              </li>
            </ul>

            <AgricultureImage
              fileName="nursery-site-factors.png"
              alt="A 2D diagram showing factors influencing choice of a nursery site: water, soil, topography, accessibility, protection, sunlight, and proximity"
              caption="Factors influencing the choice of a tree nursery site."
            />
          </SubtopicCard>

          <SubtopicCard title="Tree Nursery Establishment and Management">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Establishment</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Site preparation:</strong> Clear the site of weeds, grass,
                and debris. Level the ground and prepare the soil.
              </li>
              <li>
                <strong>Fencing:</strong> Erect a fence around the nursery to protect
                it from livestock and wild animals.
              </li>
              <li>
                <strong>Water supply:</strong> Install a water supply system
                (pipes, sprinklers, drip irrigation) for watering seedlings.
              </li>
              <li>
                <strong>Nursery beds:</strong> Prepare raised beds for seedlings.
                Beds should be 1-1.2m wide and of convenient length.
              </li>
              <li>
                <strong>Shade structure:</strong> Install shade structures (shade
                nets, thatch) to protect seedlings from excessive sunlight.
              </li>
              <li>
                <strong>Seed selection:</strong> Select high-quality seeds from
                healthy trees. Seeds should be viable and free from pests and diseases.
              </li>
              <li>
                <strong>Sowing:</strong> Sow seeds in nursery beds or in containers
                (polythene bags, pots). The sowing depth depends on the species.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Management</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Watering:</strong> Water seedlings regularly to keep the
                soil moist but not waterlogged.
              </li>
              <li>
                <strong>Weeding:</strong> Remove weeds from nursery beds to reduce
                competition for nutrients and water.
              </li>
              <li>
                <strong>Fertilising:</strong> Apply fertiliser to promote healthy
                growth. Use balanced fertilisers (NPK) at recommended rates.
              </li>
              <li>
                <strong>Pest and disease control:</strong> Monitor for pests and
                diseases (e.g., damping off, aphids, termites). Control using
                appropriate methods (biological, chemical).
              </li>
              <li>
                <strong>Thinning:</strong> Remove weak or overcrowded seedlings to
                give remaining seedlings space to grow.
              </li>
              <li>
                <strong>Hardening off:</strong> Gradually expose seedlings to
                outside conditions (sunlight, wind) before transplanting to reduce
                transplant shock.
              </li>
              <li>
                <strong>Record keeping:</strong> Keep records of seed sources,
                sowing dates, watering, fertilising, and pest control.
              </li>
            </ul>

            <AgricultureImage
              fileName="tree-nursery-management.png"
              alt="A 2D diagram showing tree nursery establishment and management practices: watering, weeding, fertilising, pest control, and hardening off"
              caption="Tree nursery establishment and management practices."
            />
          </SubtopicCard>

          <SubtopicCard title="Tree Plantation Establishment and Management Practices">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Establishment</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Species selection:</strong> Choose tree species that are
                suitable for the site (climate, soil, water availability).
              </li>
              <li>
                <strong>Site preparation:</strong> Clear the site of vegetation
                and debris. Prepare the soil by ploughing or pitting.
              </li>
              <li>
                <strong>Planting:</strong> Plant seedlings at the correct spacing
                and depth. The spacing depends on the species and the purpose of
                the plantation.
              </li>
              <li>
                <strong>Fencing:</strong> Fence the plantation to protect it from
                livestock and wild animals.
              </li>
              <li>
                <strong>Filling blanks:</strong> Replace dead seedlings in the
                first year.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Management Practices</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Weeding:</strong> Control weeds to reduce competition for
                nutrients and water.
              </li>
              <li>
                <strong>Pruning:</strong> Remove lower branches to produce straight,
                knot-free timber.
              </li>
              <li>
                <strong>Thinning:</strong> Remove weak or overcrowded trees to
                allow remaining trees to grow better.
              </li>
              <li>
                <strong>Fire protection:</strong> Create firebreaks (clear strips
                of land) to prevent fires from spreading. Patrol to detect and
                extinguish fires.
              </li>
              <li>
                <strong>Pest and disease control:</strong> Monitor for pests and
                diseases. Control using appropriate methods (biological, chemical).
              </li>
              <li>
                <strong>Fertilising:</strong> Apply fertiliser to promote growth,
                especially in young plantations.
              </li>
              <li>
                <strong>Harvesting:</strong> Harvest trees when they reach maturity
                (the rotation age depends on the species). Use sustainable methods.
              </li>
              <li>
                <strong>Replanting:</strong> Replant harvested areas to ensure
                continued forest cover.
              </li>
            </ul>

            <AgricultureImage
              fileName="tree-plantation-management.png"
              alt="A 2D diagram showing tree plantation management practices: weeding, pruning, thinning, fire protection, pest control, harvesting, and replanting"
              caption="Tree plantation establishment and management practices."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Forestry Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Softwood:</strong> pine, fast-growing, light</li>
            <li><strong>Hardwood:</strong> teak, mahogany, slow-growing, heavy</li>
            <li><strong>Nursery:</strong> water, soil, accessibility, protection</li>
            <li><strong>Management:</strong> watering, weeding, fertilising, pests</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'wildlife',
      title: 'Wildlife',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Sustainable Methods of Wildlife Utilisation">
            <p>
              <strong>Definition:</strong> Sustainable wildlife utilisation is the
              use of wildlife resources in a way that maintains their populations
              and habitats for the future. It balances the needs of people with the
              need to conserve wildlife.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Eco-tourism:</strong>
                <br />
                <strong>Definition:</strong> Tourism that is environmentally responsible
                and focuses on wildlife viewing and nature-based activities.
                <br />
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Generates income for conservation and local communities.</li>
                  <li>Provides employment for guides, rangers, and hospitality staff.</li>
                  <li>Raises awareness about wildlife conservation.</li>
                </ul>
                <br />
                <strong>Zimbabwe examples:</strong> Victoria Falls, Hwange National
                Park, Mana Pools, and Gonarezhou are major eco-tourism destinations.
              </li>
              <li>
                <strong>Game ranching:</strong>
                <br />
                <strong>Definition:</strong> The farming of wild animals (game)
                for meat, hides, and trophy hunting on private land.
                <br />
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Provides meat (venison) for local consumption and export.</li>
                  <li>Generates income from trophy hunting.</li>
                  <li>Conserves wildlife habitats.</li>
                </ul>
                <br />
                <strong>Zimbabwe examples:</strong> Game ranching is practised in
                the Lowveld (Save Valley Conservancy) and parts of Matabeleland.
              </li>
              <li>
                <strong>Cull harvesting (sustainable off-take):</strong>
                <br />
                <strong>Definition:</strong> The controlled harvesting of wildlife
                populations to maintain them at sustainable levels.
                <br />
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Prevents overpopulation and habitat degradation.</li>
                  <li>Provides meat and income.</li>
                  <li>Maintains ecological balance.</li>
                </ul>
              </li>
              <li>
                <strong>Conservation education:</strong>
                <br />
                <strong>Definition:</strong> Educating people about the importance
                of wildlife and the need for conservation.
                <br />
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Raises awareness about conservation.</li>
                  <li>Encourages sustainable behaviour.</li>
                  <li>Builds support for conservation efforts.</li>
                </ul>
              </li>
              <li>
                <strong>Community-based natural resource management (CBNRM):</strong>
                <br />
                <strong>Definition:</strong> Involving local communities in the
                management and benefit-sharing of wildlife resources.
                <br />
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Empowers communities to manage their own resources.</li>
                  <li>Creates incentives for conservation.</li>
                  <li>Shares benefits (income, meat, employment) with communities.</li>
                </ul>
                <br />
                <strong>Zimbabwe examples:</strong> CAMPFIRE (Communal Areas
                Management Programme for Indigenous Resources) is a well-known
                CBNRM programme in Zimbabwe.
              </li>
              <li>
                <strong>Rehabilitation of injured animals:</strong>
                <br />
                <strong>Definition:</strong> Caring for and rehabilitating injured
                or orphaned wild animals before releasing them back into the wild.
                <br />
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Contributes to conservation of endangered species.</li>
                  <li>Promotes animal welfare.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="sustainable-wildlife-utilisation.png"
              alt="A 2D diagram showing sustainable methods of wildlife utilisation: eco-tourism, game ranching, cull harvesting, conservation education, CBNRM, and rehabilitation"
              caption="Sustainable methods of wildlife utilisation."
            />
          </SubtopicCard>

          <SubtopicCard title="Specially Protected Plants and Animals in Zimbabwe">
            <p>
              <strong>Definition:</strong> Specially protected species are plants
              and animals that are protected by law in Zimbabwe. It is illegal to
              hunt, collect, or trade these species without a permit.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Specially Protected Animals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>African Elephant (Loxodonta africana):</strong>
                <br />
                <strong>Status:</strong> Protected, threatened by poaching for ivory.
                <br />
                <strong>Protection:</strong> Hunting is strictly controlled; ivory
                trade is illegal.
              </li>
              <li>
                <strong>Black Rhino (Diceros bicornis):</strong>
                <br />
                <strong>Status:</strong> Critically endangered.
                <br />
                <strong>Protection:</strong> Highly protected, anti-poaching patrols
                in Matopos, Save Valley, and other areas.
              </li>
              <li>
                <strong>White Rhino (Ceratotherium simum):</strong>
                <br />
                <strong>Status:</strong> Endangered.
                <br />
                <strong>Protection:</strong> Protected, with populations in Hwange,
                Matopos, and private reserves.
              </li>
              <li>
                <strong>African Lion (Panthera leo):</strong>
                <br />
                <strong>Status:</strong> Vulnerable.
                <br />
                <strong>Protection:</strong> Hunting is regulated to ensure sustainable populations.
              </li>
              <li>
                <strong>Leopard (Panthera pardus):</strong>
                <br />
                <strong>Status:</strong> Protected.
                <br />
                <strong>Protection:</strong> Hunting is strictly controlled.
              </li>
              <li>
                <strong>Cheetah (Acinonyx jubatus):</strong>
                <br />
                <strong>Status:</strong> Vulnerable.
                <br />
                <strong>Protection:</strong> Protected, with conservation programmes
                in some areas.
              </li>
              <li>
                <strong>African Wild Dog (Lycaon pictus):</strong>
                <br />
                <strong>Status:</strong> Endangered.
                <br />
                <strong>Protection:</strong> Highly protected, with conservation
                efforts in Hwange and other areas.
              </li>
              <li>
                <strong>Hippopotamus (Hippopotamus amphibius):</strong>
                <br />
                <strong>Status:</strong> Vulnerable.
                <br />
                <strong>Protection:</strong> Hunting is controlled.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Specially Protected Plants</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Baobab (Adansonia digitata):</strong>
                <br />
                <strong>Status:</strong> Protected. It is illegal to cut down baobab trees.
                <br />
                <strong>Importance:</strong> Iconic tree, provides food, shelter, and cultural value.
              </li>
              <li>
                <strong>Mopane (Colophospermum mopane):</strong>
                <br />
                <strong>Status:</strong> Protected in some areas.
                <br />
                <strong>Importance:</strong> Important for timber, fuelwood, and wildlife.
              </li>
              <li>
                <strong>Teak (Baikiaea plurijuga):</strong>
                <br />
                <strong>Status:</strong> Protected in some areas.
                <br />
                <strong>Importance:</strong> Valuable hardwood for furniture and construction.
              </li>
              <li>
                <strong>Aloe species:</strong>
                <br />
                <strong>Status:</strong> Protected.
                <br />
                <strong>Importance:</strong> Medicinal uses, ornamental value.
              </li>
              <li>
                <strong>Cycads (Encephalartos species):</strong>
                <br />
                <strong>Status:</strong> Highly protected, endangered.
                <br />
                <strong>Importance:</strong> Ancient plants, threatened by habitat loss and collection.
              </li>
            </ul>

            <AgricultureImage
              fileName="protected-species-zimbabwe.png"
              alt="A 2D diagram showing specially protected animals and plants in Zimbabwe: elephant, rhino, lion, leopard, baobab, teak, cycads"
              caption="Specially protected animals and plants in Zimbabwe."
            />
          </SubtopicCard>

          <SubtopicCard title="Dangerous and Problem Animals in Zimbabwe">
            <p>
              <strong>Definition:</strong> Dangerous and problem animals are those
              that pose a threat to human safety, livestock, or crops. They can
              cause conflict with people and require management.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Dangerous Animals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Elephant:</strong>
                <br />
                <strong>Threat:</strong> Can destroy crops, damage property, and
                kill people if threatened or when foraging.
                <br />
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Electric fences to keep elephants out of farms.</li>
                  <li>Chilli-based deterrents (chilli bombs, chilli fences).</li>
                  <li>Relocation of problem elephants.</li>
                  <li>Compensation schemes for crop damage.</li>
                </ul>
              </li>
              <li>
                <strong>Lion:</strong>
                <br />
                <strong>Threat:</strong> Can attack and kill livestock and, rarely, people.
                <br />
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Lion-proof bomas (enclosures) for livestock.</li>
                  <li>Livestock guarding dogs.</li>
                  <li>Relocation of problem lions.</li>
                </ul>
              </li>
              <li>
                <strong>Crocodile:</strong>
                <br />
                <strong>Threat:</strong> Can attack and kill people and livestock
                near rivers and dams.
                <br />
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Warning signs at water sources.</li>
                  <li>Controlled harvesting (culling) of problem crocodiles.</li>
                  <li>Education on crocodile safety.</li>
                </ul>
              </li>
              <li>
                <strong>Buffalo:</strong>
                <br />
                <strong>Threat:</strong> Can charge and kill people, especially
                when wounded or threatened.
                <br />
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Keep a safe distance.</li>
                  <li>Controlled hunting.</li>
                </ul>
              </li>
              <li>
                <strong>Snakes (e.g., Black Mamba, Puff Adder):</strong>
                <br />
                <strong>Threat:</strong> Venomous snakes can bite and kill people.
                <br />
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Education on snake safety.</li>
                  <li>Antivenom availability.</li>
                  <li>Relocation of snakes (by trained handlers).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Problem Animals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Baboon:</strong>
                <br />
                <strong>Problem:</strong> Destroys crops, raids homes, and damages property.
                <br />
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fencing, guard dogs, and scare tactics.</li>
                  <li>Controlled culling.</li>
                </ul>
              </li>
              <li>
                <strong>Warthog:</strong>
                <br />
                <strong>Problem:</strong> Destroys crops, digs up fields, and damages fences.
                <br />
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fencing, controlled hunting.</li>
                </ul>
              </li>
              <li>
                <strong>Vervet Monkey:</strong>
                <br />
                <strong>Problem:</strong> Steals crops, raids homes, and damages property.
                <br />
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fencing, scare tactics, and controlled culling.</li>
                </ul>
              </li>
              <li>
                <strong>Bushpig:</strong>
                <br />
                <strong>Problem:</strong> Destroys crops (especially maize), damages fences.
                <br />
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fencing, controlled hunting.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">How to Deal with Dangerous and Problem Animals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Prevention:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Fencing:</strong> Strong fences (electric, game fences)
                    to keep animals out of farms and homesteads.
                  </li>
                  <li>
                    <strong>Deterrents:</strong> Chilli bombs, scarecrows, and
                    bright lights to scare animals away.
                  </li>
                  <li>
                    <strong>Livestock protection:</strong> Guard dogs, bomas
                    (enclosures) to protect livestock at night.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Response:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Alert authorities:</strong> Contact the Parks and Wildlife
                    Management Authority or local authorities.
                  </li>
                  <li>
                    <strong>Controlled culling:</strong> In some cases, problem
                    animals may be killed under permit.
                  </li>
                  <li>
                    <strong>Relocation:</strong> Problem animals may be relocated
                    to a different area.
                  </li>
                  <li>
                    <strong>Compensation:</strong> Some compensation schemes exist
                    for crop and livestock damage.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Education:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Awareness:</strong> Educating communities about how to
                    avoid conflict with dangerous animals.
                  </li>
                  <li>
                    <strong>Safety:</strong> Teaching people how to behave in
                    areas where dangerous animals are present.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="dangerous-problem-animals.png"
              alt="A 2D diagram showing dangerous and problem animals in Zimbabwe: elephant, lion, crocodile, buffalo, baboon, warthog, and their management methods"
              caption="Dangerous and problem animals in Zimbabwe and how to deal with them."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Wildlife Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Sustainable use:</strong> eco-tourism, game ranching, CBNRM</li>
            <li><strong>Protected:</strong> elephant, rhino, lion, baobab, teak</li>
            <li><strong>Dangerous:</strong> elephant, lion, crocodile, buffalo, snakes</li>
            <li><strong>Problem animals:</strong> baboon, warthog, monkey, bushpig</li>
            <li><strong>Management:</strong> fencing, deterrents, relocation</li>
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
            General Agriculture
          </h1>
          <p className="text-lg text-green-100 max-w-2xl leading-relaxed">
            Explore land use and its effects, environmental factors and mitigation
            techniques, forestry management, and wildlife utilisation and protection
            in Zimbabwe.
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
                  <strong className="text-white">Land Use:</strong> Population growth
                  causes land pressure, fragmentation, deforestation, and urban expansion.
                  Farming systems include mixed farming (crops + livestock), monoculture
                  (single crop), and intercropping (multiple crops together).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Environmental Factors:</strong> Shading,
                  mulching, pot-holing, manuring, tie-ridging, watering, conservation
                  tillage, and windbreaks all help reduce adverse environmental effects
                  on agriculture.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Forestry:</strong> Softwood (pine,
                  fast-growing, light) differs from hardwood (teak, mahogany, slow-growing,
                  heavy). Nursery establishment requires water, soil, accessibility,
                  and protection. Plantation management includes weeding, pruning,
                  thinning, and fire protection.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Wildlife:</strong> Sustainable
                  utilisation includes eco-tourism, game ranching, cull harvesting,
                  CBNRM, and rehabilitation. Specially protected species include
                  elephant, rhino, lion, baobab, and cycads. Dangerous animals include
                  elephant, lion, crocodile, and buffalo; problem animals include
                  baboon, warthog, and bushpig.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the General Agriculture topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
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

export default GeneralAgriculture;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/agriculture/
   Use a mix of 2D diagram style and realistic photographs.

   --- LAND USE IMAGES (2D DIAGRAM AND REALISTIC) ---

   1. population-growth-land-use.png
      A 2D diagram showing the effects of population growth on land use:
      - Land fragmentation (smaller plots)
      - Deforestation (clearing forests)
      - Urban expansion (city growing)
      - Water scarcity (dry river)
      Use icons and brief explanations.

   2. mixed-farming.png
      A realistic photograph or 2D diagram showing mixed farming:
      crops (maize, vegetables) and livestock (cattle, goats) on the same farm.

   3. monoculture-farming.png
      A realistic photograph or 2D diagram showing a large field of a single crop
      (maize, tobacco, or sugarcane) with machinery in the background.

   4. intercropping.png
      A realistic photograph or 2D diagram showing intercropping:
      maize and beans growing together in the same field in rows.

   --- ENVIRONMENTAL FACTORS IMAGES (2D DIAGRAM AND REALISTIC) ---

   5. shading-agriculture.png
      A 2D diagram showing shading methods: shade nets (greenhouse), tree shade,
      and temporary shade structures.

   6. mulching-techniques.png
      A 2D diagram showing mulching techniques: organic mulch (straw, leaves)
      and plastic mulch.

   7. pot-holing-technique.png
      A 2D diagram showing the pot-holing technique: digging holes, adding manure,
      and planting.

   8. manuring-techniques.png
      A 2D diagram showing manuring techniques: applying animal manure, compost,
      and green manure.

   9. tie-ridging-diagram.png
      A 2D diagram showing tie-ridging: ridges with small dams (ties) to trap water.

   10. irrigation-types.png
       A 2D diagram showing types of irrigation: surface (flood), sprinkler,
       and drip irrigation.

   11. conservation-tillage.png
       A 2D diagram showing conservation tillage methods: zero tillage, minimum
       tillage, and mulch tillage.

   12. windbreaks-agriculture.png
       A 2D diagram showing windbreaks: shelterbelts, hedges, and fences protecting
       crops from wind.

   --- FORESTRY IMAGES (2D DIAGRAM AND REALISTIC) ---

   13. softwood-hardwood.png
       A 2D diagram showing the difference between softwood (pine) and hardwood
       (teak, mahogany) with characteristics and uses.

   14. nursery-site-factors.png
       A 2D diagram showing factors influencing choice of a nursery site:
       water, soil, topography, accessibility, protection, sunlight, and proximity.

   15. tree-nursery-management.png
       A 2D diagram showing tree nursery management practices:
       watering, weeding, fertilising, pest control, thinning, and hardening off.

   16. tree-plantation-management.png
       A 2D diagram showing tree plantation management practices:
       weeding, pruning, thinning, fire protection, pest control, harvesting,
       and replanting.

   --- WILDLIFE IMAGES (2D DIAGRAM AND REALISTIC) ---

   17. sustainable-wildlife-utilisation.png
       A 2D diagram showing sustainable methods of wildlife utilisation:
       eco-tourism, game ranching, cull harvesting, conservation education,
       CBNRM, and rehabilitation.

   18. protected-species-zimbabwe.png
       A 2D diagram showing specially protected animals and plants in Zimbabwe:
       elephant, rhino, lion, leopard, baobab, teak, cycads.

   19. dangerous-problem-animals.png
       A 2D diagram showing dangerous animals (elephant, lion, crocodile,
       buffalo, snakes) and problem animals (baboon, warthog, monkey, bushpig)
       with management methods.

   ============================================================ */