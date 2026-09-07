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
      id: 'environmental-factors',
      title: 'Environmental Factors',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Effects of Natural Disasters on Agriculture">
            <p>
              <strong>Definition:</strong> Natural disasters are extreme natural
              events that can cause significant damage to agricultural production,
              infrastructure, and livelihoods. In Zimbabwe, several types of natural
              disasters affect agriculture.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Hailstorm</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A storm with falling hail (balls of ice)
                that can damage crops.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Physical damage:</strong> Hailstones bruise, shred, and
                    destroy leaves, stems, and fruits. Can completely destroy a crop.
                  </li>
                  <li>
                    <strong>Reduced yields:</strong> Damaged plants may not recover,
                    leading to significant yield losses.
                  </li>
                  <li>
                    <strong>Secondary infections:</strong> Damaged tissues are
                    susceptible to diseases.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Hailstorms occur in the Eastern
                Highlands and parts of Mashonaland, particularly during summer storms.
                Tobacco and horticultural crops (vegetables, fruits) are most at risk.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Floods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> An overflow of water that submerges land.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Crop loss:</strong> Crops are drowned and die. Floodwaters
                    can wash away soil and seeds.
                  </li>
                  <li>
                    <strong>Soil erosion:</strong> Floodwater washes away fertile topsoil.
                  </li>
                  <li>
                    <strong>Infrastructure damage:</strong> Roads, bridges, and
                    irrigation systems are damaged.
                  </li>
                  <li>
                    <strong>Livestock losses:</strong> Animals may drown or be washed away.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Floods occur in the Lowveld
                (Save, Runde, and Limpopo river basins) and along the Zambezi River.
                Cyclone Idai (2019) caused severe flooding in Chimanimani and
                Chipinge districts.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Cyclones</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Large storm systems with strong winds
                and heavy rainfall.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Wind damage:</strong> Strong winds flatten crops (lodging),
                    break trees, and destroy buildings.
                  </li>
                  <li>
                    <strong>Flooding:</strong> Heavy rainfall causes floods.
                  </li>
                  <li>
                    <strong>Infrastructure damage:</strong> Roads, bridges, and
                    irrigation systems are destroyed.
                  </li>
                  <li>
                    <strong>Loss of life:</strong> Cyclones can cause fatalities.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Cyclone Idai (2019) and Cyclone
                Eline (2000) affected Zimbabwe, causing widespread damage in the
                Eastern Highlands and parts of Manicaland.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Whirlwind (Dust Devil/Tornado)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A small, rotating column of air that
                can cause localised damage.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Crop damage:</strong> Whirlwinds can flatten crops in a
                    small area.
                  </li>
                  <li>
                    <strong>Property damage:</strong> Can damage roofs and structures.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Veld Fires</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Uncontrolled fires that burn through
                grasslands, forests, and agricultural land.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Destruction of crops:</strong> Crops are burned.
                  </li>
                  <li>
                    <strong>Loss of pastures:</strong> Grazing land is destroyed.
                  </li>
                  <li>
                    <strong>Loss of livestock:</strong> Animals may be killed or injured.
                  </li>
                  <li>
                    <strong>Soil degradation:</strong> Organic matter is burned,
                    reducing soil fertility and increasing erosion.
                  </li>
                  <li>
                    <strong>Loss of biodiversity:</strong> Wildlife and habitats are destroyed.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Veld fires are common in the
                dry season (July-October) and can be devastating to agricultural areas.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Drought</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A prolonged period of below-average
                rainfall leading to water shortages.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Crop failure:</strong> Crops die from lack of water.
                  </li>
                  <li>
                    <strong>Livestock losses:</strong> Animals die from lack of
                    water and pasture.
                  </li>
                  <li>
                    <strong>Food insecurity:</strong> Reduced food production leads
                    to hunger and malnutrition.
                  </li>
                  <li>
                    <strong>Poverty:</strong> Farmers lose their livelihoods.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Zimbabwe experiences periodic
                droughts, especially in Matabeleland, Masvingo, and parts of the Midlands.
                The 1991-1992 drought was one of the worst in recent history.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Heatwave</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A prolonged period of excessively hot weather.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Heat stress:</strong> Crops suffer from heat stress,
                    reducing yields and quality.
                  </li>
                  <li>
                    <strong>Water loss:</strong> High temperatures increase
                    evaporation and transpiration.
                  </li>
                  <li>
                    <strong>Livestock stress:</strong> Animals suffer from heat
                    stress, reducing milk production and fertility.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="natural-disasters-effects.png"
              alt="A 2D diagram showing the effects of natural disasters on agriculture: hailstorm, floods, cyclones, whirlwind, veld fires, drought, and heatwave"
              caption="Effects of natural disasters on agriculture in Zimbabwe."
            />
          </SubtopicCard>

          <SubtopicCard title="Precautionary and Risk-Reduction Measures">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Hail protection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Use hail nets in horticulture (vegetables, fruits).</li>
                  <li>Plant windbreaks to reduce wind speed and hail damage.</li>
                  <li>Use early warning systems to forecast hailstorms.</li>
                </ul>
              </li>
              <li>
                <strong>Flood protection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Construct drainage ditches and channels.</li>
                  <li>Use raised beds for crops in flood-prone areas.</li>
                  <li>Protect riverbanks with vegetation to reduce erosion.</li>
                </ul>
              </li>
              <li>
                <strong>Cyclone protection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Build strong, cyclone-resistant structures.</li>
                  <li>Evacuate people and livestock in advance of cyclones.</li>
                  <li>Have emergency food and medical supplies ready.</li>
                </ul>
              </li>
              <li>
                <strong>Fire protection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Create firebreaks (fire guards) around fields and homesteads.</li>
                  <li>Burning early in the dry season to reduce fuel load.</li>
                  <li>Educate communities on fire prevention.</li>
                </ul>
              </li>
              <li>
                <strong>Drought protection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Use drought-tolerant crop varieties (sorghum, millet).</li>
                  <li>Planting early to take advantage of the rainy season.</li>
                  <li>Use irrigation and water harvesting (dams, weirs).</li>
                  <li>Use conservation techniques (tie-ridging, mulching).</li>
                </ul>
              </li>
              <li>
                <strong>Heatwave protection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Use shading to reduce heat stress on crops.</li>
                  <li>Provide shade and water for livestock.</li>
                  <li>Plant heat-tolerant varieties.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="disaster-risk-reduction.png"
              alt="A 2D diagram showing precautionary and risk-reduction measures for natural disasters: hail nets, drainage, firebreaks, drought-tolerant crops, and shading"
              caption="Precautionary and risk-reduction measures for natural disasters."
            />
          </SubtopicCard>

          <SubtopicCard title="Weather Forecasting and Disaster Preparedness">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Weather Forecasting</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Weather forecasting is the prediction
                of future weather conditions using scientific data.
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Planning:</strong> Farmers can plan planting, irrigation,
                    and harvesting activities.
                  </li>
                  <li>
                    <strong>Early warning:</strong> Forecasts provide early warning
                    of extreme weather events (cyclones, floods, hailstorms).
                  </li>
                  <li>
                    <strong>Risk reduction:</strong> Allows farmers to take
                    precautionary measures.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe:</strong> The Zimbabwe Meteorological Services
                Department (ZMSD) provides weather forecasts and warnings to the public.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Disaster Preparedness</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Actions taken to prepare for and respond
                to disasters.
              </li>
              <li>
                <strong>Strategies:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Early warning systems:</strong> Using forecasts and
                    communication networks to warn people.
                  </li>
                  <li>
                    <strong>Evacuation plans:</strong> Plans to move people and
                    livestock to safe areas.
                  </li>
                  <li>
                    <strong>Emergency supplies:</strong> Stockpiling food, water,
                    and medical supplies.
                  </li>
                  <li>
                    <strong>Training and drills:</strong> Training communities on
                    how to respond to disasters.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="weather-forecasting-disaster-preparedness.png"
              alt="A 2D diagram showing weather forecasting (data collection, analysis, communication) and disaster preparedness (early warning, evacuation, emergency supplies, training)"
              caption="Weather forecasting and disaster preparedness for agriculture."
            />
          </SubtopicCard>

          <SubtopicCard title="Conservation Structures">
            <p>
              <strong>Definition:</strong> Conservation structures are physical
              structures built on farms to conserve soil and water, reduce erosion,
              and protect against natural disasters.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Contour ridges (tie-ridging):</strong>
                <br />
                <strong>Description:</strong> Ridges built along the contour of the
                land, with small barriers (ties) to trap water.
                <br />
                <strong>Purpose:</strong> Reduce runoff, increase water infiltration,
                and reduce soil erosion.
              </li>
              <li>
                <strong>Check dams (gabions):</strong>
                <br />
                <strong>Description:</strong> Small dams built across gullies to trap
                sediment and slow water flow.
                <br />
                <strong>Purpose:</strong> Reduce gully erosion, trap soil, and allow
                water to infiltrate.
              </li>
              <li>
                <strong>Drainage channels:</strong>
                <br />
                <strong>Description:</strong> Channels built to direct water away
                from fields and buildings.
                <br />
                <strong>Purpose:</strong> Prevent waterlogging and flooding.
              </li>
              <li>
                <strong>Water harvesting structures (dams, weirs):</strong>
                <br />
                <strong>Description:</strong> Dams and weirs built to collect and
                store water.
                <br />
                <strong>Purpose:</strong> Provide water for irrigation and livestock.
              </li>
              <li>
                <strong>Windbreaks:</strong>
                <br />
                <strong>Description:</strong> Rows of trees or hedges planted to
                reduce wind speed.
                <br />
                <strong>Purpose:</strong> Protect crops from wind damage, reduce
                soil erosion, and conserve water.
              </li>
            </ul>

            <AgricultureImage
              fileName="conservation-structures.png"
              alt="A 2D diagram showing conservation structures: contour ridges, check dams, drainage channels, water harvesting structures, and windbreaks"
              caption="Conservation structures for soil and water conservation."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Natural disasters:</strong> hailstorm, floods, cyclones, drought</li>
            <li><strong>Risk reduction:</strong> hail nets, drainage, firebreaks, drought-tolerant crops</li>
            <li><strong>Weather forecasting:</strong> early warning, planning</li>
            <li><strong>Conservation structures:</strong> contour ridges, check dams, windbreaks</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'forestry',
      title: 'Forestry',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Importance of Agro-Forestry Practices">
            <p>
              <strong>Definition:</strong> Agro-forestry is a land use management
              system that combines trees and shrubs with crops and/or livestock on
              the same piece of land. It is a sustainable farming practice that
              integrates forestry with agriculture.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Environmental benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Soil conservation:</strong> Trees reduce soil erosion
                    by binding soil with their roots.
                  </li>
                  <li>
                    <strong>Soil fertility improvement:</strong> Leguminous trees
                    fix nitrogen, improving soil fertility (e.g., Acacia, Faidherbia).
                  </li>
                  <li>
                    <strong>Microclimate improvement:</strong> Trees provide shade,
                    reduce wind speed, and moderate temperatures.
                  </li>
                  <li>
                    <strong>Biodiversity enhancement:</strong> Agro-forestry provides
                    habitat for wildlife and supports biodiversity.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Economic benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Increased farm productivity:</strong> Improved soil
                    fertility and microclimate lead to higher crop yields.
                  </li>
                  <li>
                    <strong>Diversified income:</strong> Farmers can sell timber,
                    fruit, fuelwood, and other tree products.
                  </li>
                  <li>
                    <strong>Reduced costs:</strong> Nitrogen-fixing trees reduce
                    the need for fertilisers.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Social benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Fuelwood and timber:</strong> Provides wood for cooking,
                    construction, and furniture.
                  </li>
                  <li>
                    <strong>Food and nutrition:</strong> Fruits and nuts from trees
                    provide food and improve nutrition.
                  </li>
                  <li>
                    <strong>Medicinal plants:</strong> Trees provide medicinal
                    products for traditional medicine.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="agroforestry-importance.png"
              alt="A 2D diagram showing the importance of agro-forestry: environmental benefits, economic benefits, and social benefits"
              caption="Importance of agro-forestry practices."
            />
          </SubtopicCard>

          <SubtopicCard title="Agro-Forestry Components">
            <p>
              <strong>Definition:</strong> Agro-forestry systems consist of different
              components that work together to create a productive and sustainable
              farming system.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Trees and shrubs:</strong>
                <br />
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Nitrogen-fixing trees:</strong> Acacia, Faidherbia
                    (Albizia), Leucaena, Sesbania. They fix nitrogen in the soil.
                  </li>
                  <li>
                    <strong>Fruit trees:</strong> Mangoes, citrus, avocados,
                    guavas, macadamia nuts. Provide food and income.
                  </li>
                  <li>
                    <strong>Timber trees:</strong> Teak, pine, eucalyptus. Provide
                    timber and fuelwood.
                  </li>
                  <li>
                    <strong>Fodder trees:</strong> Leucaena, Calliandra. Provide
                    livestock feed.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Crops:</strong>
                <br />
                <strong>Types:</strong> Maize, beans, groundnuts, sorghum, millet,
                vegetables, and other food crops.
              </li>
              <li>
                <strong>Livestock:</strong>
                <br />
                <strong>Types:</strong> Cattle, goats, sheep, poultry, and pigs.
              </li>
              <li>
                <strong>Soil and water:</strong>
                <br />
                <strong>Components:</strong> Soil conservation structures (contour
                ridges, terraces), water harvesting systems.
              </li>
            </ul>

            <AgricultureImage
              fileName="agroforestry-components.png"
              alt="A 2D diagram showing agro-forestry components: trees (nitrogen-fixing, fruit, timber, fodder), crops, livestock, and soil/water conservation"
              caption="Components of agro-forestry systems."
            />
          </SubtopicCard>

          <SubtopicCard title="Establishing Agro-Forestry Plots">
            <p>
              <strong>Definition:</strong> Establishing an agro-forestry plot
              involves careful planning and implementation to ensure the successful
              integration of trees, crops, and livestock.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps for Establishing Agro-Forestry Plots</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Site selection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Choose a suitable site with good soil, water, and climate.</li>
                  <li>Consider the slope, drainage, and exposure to wind and sun.</li>
                </ul>
              </li>
              <li>
                <strong>Species selection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Choose tree species that are suitable for the local conditions.</li>
                  <li>Select trees that provide multiple benefits (nitrogen-fixing,
                    fruit, timber, fodder).</li>
                  <li>Examples: Faidherbia (improves soil fertility), mangoes (food
                    and income), Leucaena (fodder).</li>
                </ul>
              </li>
              <li>
                <strong>Designing the layout:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Plan the arrangement of trees, crops, and livestock areas.</li>
                  <li>Consider alley cropping (trees in rows with crops in between).</li>
                  <li>Plant trees along boundaries, contours, and as windbreaks.</li>
                </ul>
              </li>
              <li>
                <strong>Planting:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Plant trees at the beginning of the rainy season.</li>
                  <li>Use good quality seedlings from a nursery.</li>
                  <li>Provide adequate spacing to avoid competition.</li>
                </ul>
              </li>
              <li>
                <strong>Management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Pruning:</strong> Prune trees to reduce shade and
                    competition with crops.
                  </li>
                  <li>
                    <strong>Weeding:</strong> Keep the area around trees free from weeds.
                  </li>
                  <li>
                    <strong>Irrigation:</strong> Water seedlings during dry periods.
                  </li>
                  <li>
                    <strong>Fertilisation:</strong> Apply organic manure or compost
                    to young trees.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="establishing-agroforestry.png"
              alt="A 2D diagram showing steps for establishing agro-forestry plots: site selection, species selection, design, planting, and management"
              caption="Steps for establishing agro-forestry plots."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Forestry Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Agro-forestry:</strong> trees + crops + livestock</li>
            <li><strong>Benefits:</strong> environmental, economic, social</li>
            <li><strong>Components:</strong> trees, crops, livestock, soil/water</li>
            <li><strong>Establishment:</strong> site selection, species, design, planting, management</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'wildlife',
      title: 'Wildlife',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Human-Wildlife Conflicts">
            <p>
              <strong>Definition:</strong> Human-wildlife conflict occurs when wild
              animals damage crops, livestock, or property, or threaten human safety.
              As human populations expand into wildlife areas, conflicts increase.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Examples of Human-Wildlife Conflicts in Zimbabwe</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Crop damage by elephants:</strong>
                <br />
                <strong>Problem:</strong> Elephants leave protected areas and eat
                crops (maize, sorghum, groundnuts), causing significant losses.
                <br />
                <strong>Location:</strong> Areas near Hwange, Gonarezhou, and
                Zambezi Valley.
              </li>
              <li>
                <strong>Livestock predation by lions and hyenas:</strong>
                <br />
                <strong>Problem:</strong> Lions and hyenas kill cattle, goats, and
                sheep in areas near wildlife reserves.
                <br />
                <strong>Location:</strong> Hwange, Gonarezhou, and other wildlife areas.
              </li>
              <li>
                <strong>Crop damage by baboons and monkeys:</strong>
                <br />
                <strong>Problem:</strong> Baboons and monkeys raid fields, eating
                maize, beans, and fruits.
                <br />
                <strong>Location:</strong> Many parts of Zimbabwe, especially near
                forests and hills.
              </li>
              <li>
                <strong>Attacks on people by crocodiles and hippos:</strong>
                <br />
                <strong>Problem:</strong> Crocodiles and hippos attack people who
                come close to rivers and dams.
                <br />
                <strong>Location:</strong> Zambezi River, Lake Kariba, Limpopo River.
              </li>
              <li>
                <strong>Damage by bushpigs and warthogs:</strong>
                <br />
                <strong>Problem:</strong> Bushpigs and warthogs dig up fields and
                eat crops.
                <br />
                <strong>Location:</strong> Many areas of Zimbabwe.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Solutions to Human-Wildlife Conflicts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Fencing:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Electric fences to keep elephants out of crops.</li>
                  <li>Strong fences to protect livestock at night.</li>
                </ul>
              </li>
              <li>
                <strong>Deterrents:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Chilli bombs and chilli fences to deter elephants.</li>
                  <li>Guard dogs to protect livestock.</li>
                  <li>Scarecrows and bright lights to deter baboons and monkeys.</li>
                </ul>
              </li>
              <li>
                <strong>Relocation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Relocating problem animals to other areas.</li>
                </ul>
              </li>
              <li>
                <strong>Compensation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Compensating farmers for crop and livestock losses.</li>
                </ul>
              </li>
              <li>
                <strong>Community-based management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Involving communities in wildlife management and sharing
                    benefits (CAMPFIRE).</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="human-wildlife-conflict.png"
              alt="A 2D diagram showing examples of human-wildlife conflicts: elephant crop damage, lion predation, baboon raids, and solutions: fencing, deterrents, relocation, compensation"
              caption="Human-wildlife conflicts and solutions in Zimbabwe."
            />
          </SubtopicCard>

          <SubtopicCard title="Wildlife Legislation in Zimbabwe">
            <p>
              <strong>Definition:</strong> Wildlife legislation refers to the laws
              and regulations that protect and manage wildlife in Zimbabwe.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Key Legislation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Parks and Wildlife Act (Chapter 20:14):</strong>
                <br />
                <strong>Purpose:</strong> The primary legislation for wildlife
                management in Zimbabwe.
                <br />
                <strong>Provisions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Establishes national parks, game reserves, and safari areas.</li>
                  <li>Regulates hunting and trade in wildlife products.</li>
                  <li>Protects endangered species.</li>
                  <li>Empowers the Zimbabwe Parks and Wildlife Management Authority
                    (ZIMPARKS) to enforce the law.</li>
                </ul>
              </li>
              <li>
                <strong>Communal Areas Management Programme for Indigenous Resources
                (CAMPFIRE):</strong>
                <br />
                <strong>Purpose:</strong> A community-based natural resource
                management programme.
                <br />
                <strong>Provisions:</strong> Allows communities to manage and benefit
                from wildlife in communal areas.
              </li>
              <li>
                <strong>Forestry Act:</strong>
                <br />
                <strong>Purpose:</strong> Regulates the management and conservation
                of forests.
                <br />
                <strong>Provisions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Establishes forest reserves.</li>
                  <li>Regulates timber harvesting.</li>
                  <li>Promotes sustainable forest management.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="wildlife-legislation-zimbabwe.png"
              alt="A 2D diagram showing wildlife legislation in Zimbabwe: Parks and Wildlife Act, CAMPFIRE, and Forestry Act"
              caption="Wildlife legislation in Zimbabwe: Parks and Wildlife Act, CAMPFIRE, and Forestry Act."
            />
          </SubtopicCard>

          <SubtopicCard title="Role of Government and Voluntary Organisations in Wildlife Management">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Government Organisations</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Zimbabwe Parks and Wildlife Management Authority (ZIMPARKS):</strong>
                <br />
                <strong>Role:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Manages national parks, game reserves, and safari areas.</li>
                  <li>Enforces wildlife laws and regulations.</li>
                  <li>Conducts anti-poaching patrols.</li>
                  <li>Promotes wildlife conservation and research.</li>
                </ul>
              </li>
              <li>
                <strong>Forestry Commission of Zimbabwe:</strong>
                <br />
                <strong>Role:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Manages forest reserves.</li>
                  <li>Promotes afforestation and reforestation.</li>
                  <li>Regulates timber harvesting.</li>
                </ul>
              </li>
              <li>
                <strong>Environmental Management Agency (EMA):</strong>
                <br />
                <strong>Role:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Protects the environment (water, air, land).</li>
                  <li>Enforces environmental regulations.</li>
                  <li>Promotes sustainable development.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Voluntary Organisations</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Zimbabwe Conservation Taskforce (ZCT):</strong>
                <br />
                <strong>Role:</strong> Monitors wildlife and conservation issues,
                raises awareness, and advocates for wildlife protection.
              </li>
              <li>
                <strong>African Wildlife Foundation (AWF):</strong>
                <br />
                <strong>Role:</strong> Works to conserve wildlife and ecosystems in
                Africa, including programmes in Zimbabwe.
              </li>
              <li>
                <strong>International Union for Conservation of Nature (IUCN):</strong>
                <br />
                <strong>Role:</strong> Provides global conservation guidance,
                assesses species status (Red List), and promotes sustainable use.
              </li>
              <li>
                <strong>Local conservation organisations:</strong>
                <br />
                <strong>Examples:</strong> Save Valley Conservancy, Matopos Rhino
                Conservation, Zimbabwe Elephant Conservation Trust.
                <br />
                <strong>Role:</strong> Work on specific conservation issues
                (elephants, rhinos, protected areas).
              </li>
            </ul>

            <AgricultureImage
              fileName="wildlife-management-organisations.png"
              alt="A 2D diagram showing the role of government (ZIMPARKS, Forestry Commission, EMA) and voluntary organisations (ZCT, AWF, IUCN) in wildlife management"
              caption="Role of government and voluntary organisations in wildlife management."
            />
          </SubtopicCard>

          <SubtopicCard title="Role of International Conventions">
            <p>
              <strong>Definition:</strong> International conventions are agreements
              between countries to cooperate on specific issues, including wildlife
              conservation.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Convention on International Trade in Endangered Species (CITES):</strong>
                <br />
                <strong>Purpose:</strong> Regulates international trade in endangered
                species to prevent extinction.
                <br />
                <strong>How it works:</strong> Species are listed in Appendices
                (Appendix I: no trade, Appendix II: regulated trade).
                <br />
                <strong>Zimbabwe's role:</strong> Zimbabwe is a signatory to CITES
                and implements its provisions. CITES influences trade in elephant
                ivory, rhino horn, and other wildlife products.
              </li>
              <li>
                <strong>Convention on Biological Diversity (CBD):</strong>
                <br />
                <strong>Purpose:</strong> To conserve biological diversity, promote
                sustainable use, and ensure fair sharing of benefits.
                <br />
                <strong>Zimbabwe's role:</strong> Zimbabwe is a signatory and has
                developed a National Biodiversity Strategy and Action Plan (NBSAP).
              </li>
              <li>
                <strong>Ramsar Convention (Wetlands):</strong>
                <br />
                <strong>Purpose:</strong> To conserve wetlands and their resources
                (waterfowl habitat).
                <br />
                <strong>Zimbabwe's role:</strong> Zimbabwe has designated several
                Ramsar sites, including Mana Pools, Lake Chivero, and Monavale Vlei.
              </li>
              <li>
                <strong>UN Convention to Combat Desertification (UNCCD):</strong>
                <br />
                <strong>Purpose:</strong> To combat desertification and mitigate
                the effects of drought.
                <br />
                <strong>Zimbabwe's role:</strong> Zimbabwe is a signatory and
                implements programmes to combat land degradation.
              </li>
            </ul>

            <AgricultureImage
              fileName="international-conventions-wildlife.png"
              alt="A 2D diagram showing international conventions: CITES, CBD, Ramsar, and UNCCD with their purposes and Zimbabwe's role"
              caption="Role of international conventions in wildlife conservation in Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Wildlife Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Human-wildlife conflict:</strong> elephants, lions, baboons, crocodiles</li>
            <li><strong>Legislation:</strong> Parks and Wildlife Act, CAMPFIRE, Forestry Act</li>
            <li><strong>Government:</strong> ZIMPARKS, Forestry Commission, EMA</li>
            <li><strong>Voluntary:</strong> ZCT, AWF, IUCN</li>
            <li><strong>International:</strong> CITES, CBD, Ramsar, UNCCD</li>
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
            Explore environmental factors including natural disasters, agro-forestry
            practices, and wildlife management including human-wildlife conflicts,
            legislation, and conservation.
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
                  <strong className="text-white">Natural Disasters:</strong> Hailstorms,
                  floods, cyclones, whirlwinds, veld fires, droughts, and heatwaves
                  affect agriculture. Risk reduction measures include hail nets,
                  drainage, firebreaks, drought-tolerant crops, and early warning
                  systems.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Weather &amp; Preparedness:</strong>
                  Weather forecasting helps farmers plan and provides early warnings.
                  Disaster preparedness includes early warning systems, evacuation
                  plans, and emergency supplies.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Conservation Structures:</strong>
                  Contour ridges, check dams, drainage channels, water harvesting
                  structures, and windbreaks protect soil and water resources.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Agro-Forestry:</strong> Combines
                  trees with crops and livestock. Benefits include soil conservation,
                  fertility improvement, and diversified income. Components include
                  trees (nitrogen-fixing, fruit, timber), crops, and livestock.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Wildlife Management:</strong>
                  Human-wildlife conflicts (elephants, lions, baboons) are managed
                  through fencing, deterrents, and compensation. Legislation includes
                  the Parks and Wildlife Act, CAMPFIRE, and the Forestry Act.
                  Government agencies (ZIMPARKS, EMA) and voluntary organisations
                  (ZCT, AWF) play key roles. International conventions include
                  CITES, CBD, Ramsar, and UNCCD.
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

   --- ENVIRONMENTAL FACTORS IMAGES (2D DIAGRAM AND REALISTIC) ---

   1. natural-disasters-effects.png
      A 2D diagram showing the effects of natural disasters on agriculture:
      - Hailstorm (damaged crops)
      - Floods (submerged fields)
      - Cyclones (wind-damaged crops)
      - Whirlwind (localised damage)
      - Veld fires (burning fields)
      - Drought (dry, cracked soil)
      - Heatwave (wilting crops)
      Use icons and brief explanations.

   2. disaster-risk-reduction.png
      A 2D diagram showing precautionary and risk-reduction measures:
      - Hail nets
      - Drainage channels
      - Firebreaks
      - Drought-tolerant crops
      - Shading
      - Early warning systems

   3. weather-forecasting-disaster-preparedness.png
      A 2D diagram showing weather forecasting (data collection, analysis,
      communication) and disaster preparedness (early warning, evacuation,
      emergency supplies, training).

   4. conservation-structures.png
      A 2D diagram showing conservation structures:
      - Contour ridges (tie-ridging)
      - Check dams (gabions)
      - Drainage channels
      - Water harvesting structures (dams, weirs)
      - Windbreaks

   --- AGRO-FORESTRY IMAGES (2D DIAGRAM AND REALISTIC) ---

   5. agroforestry-importance.png
      A 2D diagram showing the importance of agro-forestry:
      - Environmental benefits (soil conservation, fertility, microclimate, biodiversity)
      - Economic benefits (productivity, diversified income, reduced costs)
      - Social benefits (fuelwood, food, medicinal plants)

   6. agroforestry-components.png
      A 2D diagram showing agro-forestry components:
      - Trees (nitrogen-fixing, fruit, timber, fodder)
      - Crops (maize, beans, vegetables)
      - Livestock (cattle, goats, poultry)
      - Soil and water conservation

   7. establishing-agroforestry.png
      A 2D diagram showing steps for establishing agro-forestry plots:
      - Site selection
      - Species selection
      - Design (layout)
      - Planting
      - Management (pruning, weeding, irrigation)

   --- WILDLIFE IMAGES (2D DIAGRAM AND REALISTIC) ---

   8. human-wildlife-conflict.png
      A 2D diagram showing examples of human-wildlife conflicts:
      - Elephant crop damage
      - Lion/livestock predation
      - Baboon crop damage
      - Crocodile/hippo attacks
      And solutions: fencing, deterrents, relocation, compensation.

   9. wildlife-legislation-zimbabwe.png
      A 2D diagram showing wildlife legislation in Zimbabwe:
      - Parks and Wildlife Act (ZIMPARKS)
      - CAMPFIRE (community-based management)
      - Forestry Act (forest reserves, timber harvesting)

   10. wildlife-management-organisations.png
       A 2D diagram showing the role of government (ZIMPARKS, Forestry Commission,
       EMA) and voluntary organisations (ZCT, AWF, IUCN) in wildlife management.

   11. international-conventions-wildlife.png
       A 2D diagram showing international conventions:
       - CITES (trade in endangered species)
       - CBD (biodiversity conservation)
       - Ramsar (wetlands conservation)
       - UNCCD (desertification)

   ============================================================ */