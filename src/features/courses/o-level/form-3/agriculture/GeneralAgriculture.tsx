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
          <SubtopicCard title="Importance of Physical Farm Planning">
            <p>
              <strong>Definition:</strong> Physical farm planning is the process of
              designing the layout of a farm to make it efficient, productive, and
              sustainable. It involves deciding where to place fields, buildings,
              roads, fences, water sources, and other farm features.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Improves efficiency:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Reduces movement:</strong> Good planning reduces the
                    distance workers and animals need to travel between fields,
                    buildings, and water sources.
                  </li>
                  <li>
                    <strong>Saves time:</strong> Farms that are well-planned are
                    easier to manage, saving time and labour.
                  </li>
                  <li>
                    <strong>Increases productivity:</strong> Efficient use of land
                    and resources leads to higher productivity.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Enhances environmental sustainability:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Reduces soil erosion:</strong> Planning can prevent
                    erosion by preserving natural vegetation, creating contour
                    ridges, and avoiding steep slopes.
                  </li>
                  <li>
                    <strong>Protects water resources:</strong> Proper siting of
                    buildings and waste disposal areas prevents water pollution.
                  </li>
                  <li>
                    <strong>Conserves natural habitats:</strong> Planning can set
                    aside areas for wildlife and conservation.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Improves animal welfare:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Shelter:</strong> Farm planning ensures animals have
                    adequate shelter from sun, wind, and rain.
                  </li>
                  <li>
                    <strong>Water supply:</strong> Animals have access to clean
                    water at all times.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Reduces costs:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Infrastructure:</strong> Planning reduces the cost of
                    building roads, fences, and water systems.
                  </li>
                  <li>
                    <strong>Labour:</strong> Efficient layouts reduce labour costs.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Improves safety:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Farm buildings:</strong> Proper siting of buildings
                    reduces fire risks and improves access for emergency vehicles.
                  </li>
                  <li>
                    <strong>Worker safety:</strong> Good planning reduces the risk
                    of accidents and injuries.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="physical-farm-planning.png"
              alt="A 2D diagram showing the importance of physical farm planning: efficiency, sustainability, animal welfare, cost reduction, and safety"
              caption="Importance of physical farm planning."
            />
          </SubtopicCard>

          <SubtopicCard title="Principles of Crop Rotation">
            <p>
              <strong>Definition:</strong> Crop rotation is the practice of growing
              different crops in a planned sequence on the same land over several
              seasons. It is an important soil management practice that helps to
              maintain soil fertility, control pests and diseases, and improve yields.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Include legumes:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Legumes (beans, groundnuts, cowpeas, soybeans) fix nitrogen
                    in the soil through their root nodules.
                  </li>
                  <li>
                    Including legumes in the rotation replenishes nitrogen,
                    reducing the need for nitrogen fertilisers.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Rotate crops with different nutrient needs:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Different crops remove different nutrients from the soil.
                  </li>
                  <li>
                    For example, maize removes nitrogen, while potatoes remove
                    potassium. Rotating crops prevents the depletion of specific nutrients.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Rotate crops with different root depths:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Deep-rooted crops (e.g., maize, sorghum) draw nutrients from
                    deeper soil layers.
                  </li>
                  <li>
                    Shallow-rooted crops (e.g., beans, vegetables) draw nutrients
                    from the topsoil.
                  </li>
                  <li>
                    Rotating deep- and shallow-rooted crops improves soil structure
                    and nutrient availability.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Rotate crops to break pest and disease cycles:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Many pests and diseases are crop-specific. Growing the same
                    crop repeatedly allows pests and diseases to build up.
                  </li>
                  <li>
                    Rotating crops disrupts pest and disease cycles, reducing the
                    need for pesticides and fungicides.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Include cover crops:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Cover crops (e.g., cowpeas, mucuna, lablab) protect the soil
                    from erosion, suppress weeds, and add organic matter.
                  </li>
                  <li>
                    They can be grown during fallow periods or between main crops.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="crop-rotation-principles.png"
              alt="A 2D diagram showing principles of crop rotation: include legumes, rotate nutrient needs, rotate root depths, break pest cycles, include cover crops"
              caption="Principles of crop rotation."
            />
          </SubtopicCard>

          <SubtopicCard title="Designing a Four-Crop Rotation Cycle">
            <p>
              <strong>Definition:</strong> A four-crop rotation cycle is a sequence
              of four different crops grown on the same land over four seasons or
              years. This is a common rotation system that balances soil fertility,
              pest control, and productivity.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example of a Four-Crop Rotation Cycle</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Year/Season</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Crop</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Crop Type</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Year 1</td>
                  <td className="border border-slate-300 px-4 py-2">Maize</td>
                  <td className="border border-slate-300 px-4 py-2">Cereal (grass)</td>
                  <td className="border border-slate-300 px-4 py-2">Main staple crop, high nitrogen demand</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Year 2</td>
                  <td className="border border-slate-300 px-4 py-2">Beans (or groundnuts)</td>
                  <td className="border border-slate-300 px-4 py-2">Legume</td>
                  <td className="border border-slate-300 px-4 py-2">Fix nitrogen, break maize pest cycle</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Year 3</td>
                  <td className="border border-slate-300 px-4 py-2">Potatoes (or cassava)</td>
                  <td className="border border-slate-300 px-4 py-2">Tuber</td>
                  <td className="border border-slate-300 px-4 py-2">Break pest cycles, use different nutrients</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Year 4</td>
                  <td className="border border-slate-300 px-4 py-2">Cover crop (or fallow with legumes)</td>
                  <td className="border border-slate-300 px-4 py-2">Cover crop</td>
                  <td className="border border-slate-300 px-4 py-2">Improve soil health, add organic matter</td>
                </tr>
              </tbody>
            </table>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Why This Rotation Works</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Year 1 (Maize):</strong> Maize is a high-nitrogen crop.
                It is followed by a legume to replenish soil nitrogen.
              </li>
              <li>
                <strong>Year 2 (Beans):</strong> Legumes fix nitrogen in the soil,
                reducing the need for nitrogen fertiliser in the next season.
              </li>
              <li>
                <strong>Year 3 (Potatoes):</strong> Potatoes have different nutrient
                requirements than maize and beans. They also help break pest and
                disease cycles.
              </li>
              <li>
                <strong>Year 4 (Cover crop):</strong> Cover crops protect the soil,
                suppress weeds, and add organic matter. They prepare the soil for
                the next cycle.
              </li>
            </ul>

            <AgricultureImage
              fileName="four-crop-rotation.png"
              alt="A 2D diagram showing a four-crop rotation cycle: Year 1 Maize, Year 2 Beans, Year 3 Potatoes, Year 4 Cover crop"
              caption="A four-crop rotation cycle: maize, beans, potatoes, and cover crop."
            />
          </SubtopicCard>

          <SubtopicCard title="Advantages of Crop Rotation">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Improves soil fertility:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Legumes fix nitrogen in the soil.</li>
                  <li>Different crops use different nutrients, preventing depletion.</li>
                  <li>Organic matter is added through crop residues and cover crops.</li>
                </ul>
              </li>
              <li>
                <strong>Controls pests and diseases:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Breaking the pest cycle reduces pest populations.</li>
                  <li>Reduces the need for chemical pesticides.</li>
                </ul>
              </li>
              <li>
                <strong>Reduces soil erosion:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Soil is covered with crops throughout the year.</li>
                  <li>Cover crops protect the soil from wind and water erosion.</li>
                </ul>
              </li>
              <li>
                <strong>Improves crop yields:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Better soil fertility and pest control lead to higher yields.</li>
                </ul>
              </li>
              <li>
                <strong>Reduces reliance on fertilisers:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Legumes fix nitrogen, reducing the need for nitrogen fertilisers.</li>
                </ul>
              </li>
              <li>
                <strong>Diversifies income:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Growing different crops provides income from multiple sources.</li>
                  <li>Reduces risk if one crop fails.</li>
                </ul>
              </li>
              <li>
                <strong>Improves soil structure:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Different root systems improve soil aeration and water infiltration.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="crop-rotation-advantages.png"
              alt="A 2D diagram showing advantages of crop rotation: soil fertility, pest control, erosion control, yields, fertiliser reduction, income diversification, soil structure"
              caption="Advantages of crop rotation."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Physical farm planning:</strong> designing farm layout</li>
            <li><strong>Crop rotation:</strong> growing different crops in sequence</li>
            <li><strong>Legumes:</strong> nitrogen-fixing plants (beans, groundnuts)</li>
            <li><strong>Cover crops:</strong> protect and improve soil</li>
            <li><strong>Four-crop rotation:</strong> maize → beans → potatoes → cover crop</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'environmental-factors',
      title: 'Environmental Factors',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Distribution, Effectiveness, Reliability, and Intensity of Rainfall in Zimbabwe">
            <p>
              <strong>Definition:</strong> Rainfall is the most important climatic
              factor affecting agriculture in Zimbabwe. The amount, timing, and
              reliability of rainfall determine what crops can be grown and the
              productivity of farming.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Distribution of Rainfall</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Distribution refers to the spatial
                (geographical) pattern of rainfall across the country.
              </li>
              <li>
                <strong>Pattern in Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Rainfall is seasonal:</strong> Most rainfall occurs in
                    the summer months (November to March) due to the Inter-Tropical
                    Convergence Zone (ITCZ).
                  </li>
                  <li>
                    <strong>Variation from east to west:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>
                        <strong>Eastern Highlands:</strong> Receive the highest
                        rainfall (over 1000mm per year) due to orographic rainfall
                        (moist air rising over mountains).
                      </li>
                      <li>
                        <strong>Central Plateau:</strong> Moderate rainfall
                        (650-850mm per year).
                      </li>
                      <li>
                        <strong>Lowveld (south-east):</strong> Low rainfall
                        (less than 450mm per year).
                      </li>
                      <li>
                        <strong>Matabeleland (west):</strong> Low rainfall
                        (450-650mm per year).
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Effect on agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Eastern Highlands:</strong> Suitable for high-value
                    crops (tea, coffee, dairy) and intensive farming.
                  </li>
                  <li>
                    <strong>Central Plateau:</strong> Suitable for commercial crops
                    (maize, tobacco, cotton) and mixed farming.
                  </li>
                  <li>
                    <strong>Lowveld and Matabeleland:</strong> Suitable for
                    drought-resistant crops (sorghum, millet) and extensive
                    livestock farming (cattle, goats).
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effectiveness of Rainfall</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Effectiveness refers to how much of
                the rainfall is actually available for plant growth.
              </li>
              <li>
                <strong>Factors affecting effectiveness:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Intensity:</strong> Heavy rain (high intensity) often
                    causes runoff and erosion, reducing effectiveness. Gentle rain
                    (low intensity) is more effective because it soaks into the soil.
                  </li>
                  <li>
                    <strong>Timing:</strong> Rainfall at the right time (during
                    the growing season) is more effective than rain outside the
                    growing season.
                  </li>
                  <li>
                    <strong>Soil type:</strong> Sandy soils allow water to percolate
                    quickly (less runoff), while clay soils hold water but are
                    prone to waterlogging.
                  </li>
                  <li>
                    <strong>Slope:</strong> Steep slopes cause runoff and erosion,
                    reducing effectiveness.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Effect on agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Low effectiveness means that even with moderate rainfall,
                    crops may not get enough water.
                  </li>
                  <li>
                    Farmers use conservation techniques (tie-ridging, mulching)
                    to improve rainfall effectiveness.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Reliability of Rainfall</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Reliability refers to how consistent
                and predictable rainfall is from year to year.
              </li>
              <li>
                <strong>Pattern in Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Rainfall is highly variable:</strong> Zimbabwe experiences
                    significant year-to-year variation in rainfall.
                  </li>
                  <li>
                    <strong>Drought years:</strong> In some years, rainfall is
                    much lower than average (El Niño years).
                  </li>
                  <li>
                    <strong>Flood years:</strong> In other years, rainfall is
                    much higher than average (La Niña years).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Effect on agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Unreliable rainfall:</strong> Makes farming risky.
                    Farmers may invest in irrigation to reduce risk.
                  </li>
                  <li>
                    <strong>Drought:</strong> Leads to crop failure, food
                    insecurity, and livestock losses.
                  </li>
                  <li>
                    <strong>Floods:</strong> Damage crops and infrastructure.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Intensity of Rainfall</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Intensity refers to the rate at which
                rain falls (mm per hour or day).
              </li>
              <li>
                <strong>Pattern in Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Rainfall in Zimbabwe can be very intense, especially during
                    thunderstorms and cyclones.
                  </li>
                  <li>
                    Heavy rainfall events are becoming more common due to climate change.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Effect on agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>High intensity:</strong> Causes runoff, soil erosion,
                    and waterlogging. Damages crops and infrastructure.
                  </li>
                  <li>
                    <strong>Low intensity:</strong> Allows water to soak into the
                    soil, benefiting crops.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="rainfall-characteristics-zimbabwe.png"
              alt="A map of Zimbabwe showing rainfall distribution, intensity, and reliability patterns"
              caption="Distribution, effectiveness, reliability, and intensity of rainfall in Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects of Rainfall Characteristics on Agricultural Activities</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Crop selection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>High rainfall areas:</strong> Maize, tobacco, tea,
                    coffee, dairy farming.
                  </li>
                  <li>
                    <strong>Moderate rainfall areas:</strong> Maize, cotton,
                    groundnuts, mixed farming.
                  </li>
                  <li>
                    <strong>Low rainfall areas:</strong> Sorghum, millet, cattle
                    ranching, game ranching.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Irrigation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    In areas with low or unreliable rainfall, farmers invest in
                    irrigation to ensure water availability.
                  </li>
                  <li>
                    Examples: Lowveld (sugarcane, citrus), Eastern Highlands
                    (horticulture).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Land preparation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Farmers use conservation techniques (tie-ridging, mulching,
                    contour ploughing) to conserve water and reduce runoff.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Planting time:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Farmers plant at the beginning of the rainy season to take
                    advantage of available moisture.
                  </li>
                  <li>
                    Early planting allows crops to mature before the dry season.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Risk management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Farmers use drought-tolerant varieties, crop diversification,
                    and insurance to manage risk.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="rainfall-effects-agriculture.png"
              alt="A 2D diagram showing the effects of rainfall characteristics on agricultural activities: crop selection, irrigation, land preparation, planting time, and risk management"
              caption="Effects of rainfall characteristics on agricultural activities."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Rainfall Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Distribution:</strong> east (high) → west (low)</li>
            <li><strong>Effectiveness:</strong> intensity, timing, soil, slope</li>
            <li><strong>Reliability:</strong> highly variable, droughts, floods</li>
            <li><strong>Intensity:</strong> often heavy thunderstorms</li>
            <li><strong>Effects:</strong> crop selection, irrigation, land prep</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'forestry',
      title: 'Forestry',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Methods of Harvesting and Treating Timber">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Harvesting Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Selective logging:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Definition:</strong> Only mature or valuable trees are
                    harvested, leaving other trees to grow.
                  </li>
                  <li>
                    <strong>Advantages:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Less environmental damage.</li>
                      <li>Allows forest to regenerate naturally.</li>
                      <li>Maintains biodiversity.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Disadvantages:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Can still cause damage to remaining trees.</li>
                      <li>Access roads can cause erosion.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Zimbabwe example:</strong> Selective logging of teak
                    in Matabeleland and mahogany in the Eastern Highlands.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Clear-cutting:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Definition:</strong> All trees in an area are cut down
                    (clear-felling).
                  </li>
                  <li>
                    <strong>Advantages:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Efficient for harvesting (all trees removed at once).</li>
                      <li>Suitable for replanting (plantation forestry).</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Disadvantages:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Severe environmental damage (soil erosion, habitat loss).</li>
                      <li>Loss of biodiversity.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Zimbabwe example:</strong> Clear-cutting in pine and
                    eucalyptus plantations in the Eastern Highlands.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Shelterwood system:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Definition:</strong> Trees are harvested in stages.
                    Some mature trees are left to provide shade (shelter) for
                    regeneration.
                  </li>
                  <li>
                    <strong>Advantages:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>Allows natural regeneration.</li>
                      <li>Reduces environmental damage.</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Disadvantages:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>More complex and costly.</li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Timber Treatment Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Timber treatment is the process of
                preserving wood to protect it from rot, insects, and weathering.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Seasoning (drying):</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>
                        <strong>Air drying:</strong> Timber is stacked and left to
                        dry naturally in the air. Takes several months.
                      </li>
                      <li>
                        <strong>Kiln drying:</strong> Timber is dried in a kiln
                        (heated chamber) to speed up the process.
                      </li>
                    </ul>
                  </li>
                  <li>
                    <strong>Chemical treatment (preservation):</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>
                        <strong>Pressure treatment:</strong> Timber is placed in a
                        pressure chamber and treated with preservative chemicals
                        (e.g., CCA – Copper Chromium Arsenate).
                      </li>
                      <li>
                        <strong>Brushing or dipping:</strong> Preservative is
                        brushed or dipped onto the timber surface.
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="timber-harvesting-treatment.png"
              alt="A 2D diagram showing timber harvesting methods (selective logging, clear-cutting, shelterwood system) and treatment methods (seasoning, chemical preservation)"
              caption="Methods of harvesting and treating timber."
            />
          </SubtopicCard>

          <SubtopicCard title="Possible Markets for Timber">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Local markets:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Construction:</strong> Timber is used for building
                    houses, schools, and bridges.
                  </li>
                  <li>
                    <strong>Furniture:</strong> Used for making furniture (chairs,
                    tables, beds, cabinets).
                  </li>
                  <li>
                    <strong>Fuelwood:</strong> Used for cooking and heating.
                  </li>
                  <li>
                    <strong>Wood carvings:</strong> Used for art and crafts.
                  </li>
                  <li>
                    <strong>Railway sleepers:</strong> Used in railway construction.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Regional markets:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Export to neighbouring countries:</strong> South Africa,
                    Zambia, Botswana, Mozambique.
                  </li>
                  <li>
                    <strong>Examples:</strong> Teak from Zimbabwe is exported to
                    South Africa for furniture and flooring.
                  </li>
                </ul>
              </li>
              <li>
                <strong>International markets:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Export to Europe, Asia, and the Americas:</strong> High-value
                    hardwoods (teak, mahogany) are exported for furniture, flooring,
                    and decorative woodwork.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Processing industries:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Sawmills:</strong> Process logs into sawn timber (planks, beams).
                  </li>
                  <li>
                    <strong>Pulp and paper:</strong> Some timber is used to make
                    paper and cardboard (e.g., pine plantations).
                  </li>
                  <li>
                    <strong>Pallet and packaging:</strong> Used for making pallets
                    and packaging materials.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="timber-markets.png"
              alt="A 2D diagram showing timber markets: local markets (construction, furniture, fuelwood), regional markets (exports to neighbouring countries), and international markets (exports to Europe, Asia)"
              caption="Possible markets for timber."
            />
          </SubtopicCard>

          <SubtopicCard title="Causes, Effects, and Solutions to Deforestation">
            <p>
              <strong>Definition:</strong> Deforestation is the permanent removal
              of forests and woodlands. It is a major environmental problem in
              Zimbabwe and around the world.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes of Deforestation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Clearing land for farming:</strong> Forests are cleared
                    to create new farmland (crops and pasture).
                  </li>
                  <li>
                    <strong>Shifting cultivation:</strong> Farmers clear forest,
                    farm for a few years, then move to new areas.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Firewood and charcoal:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Many people in Zimbabwe depend on firewood for cooking and
                    heating, leading to deforestation.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Logging:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Commercial logging:</strong> Trees are harvested for
                    timber (teak, mahogany) and paper (pine).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Urbanisation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Cities and towns expand, consuming forest land.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Mining:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Forests are cleared for mining operations (gold, diamonds, coal).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Forest fires:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Uncontrolled fires destroy large areas of forest (especially in
                    dry seasons).
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects of Deforestation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Biodiversity loss:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Forests provide habitat for plants and animals. Deforestation
                    leads to loss of species.</li>
                </ul>
              </li>
              <li>
                <strong>Soil erosion:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Tree roots hold the soil together. Without trees, soil is
                    washed away by rain.</li>
                </ul>
              </li>
              <li>
                <strong>Climate change:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Forests absorb carbon dioxide. Deforestation releases carbon,
                    contributing to global warming.</li>
                </ul>
              </li>
              <li>
                <strong>Reduced rainfall:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Forests release water vapour. Deforestation reduces rainfall
                    and leads to drier conditions.</li>
                </ul>
              </li>
              <li>
                <strong>Flooding:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Forests absorb water. Deforestation increases runoff and
                    flooding.</li>
                </ul>
              </li>
              <li>
                <strong>Loss of livelihoods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>People who depend on forests for food, medicine, and income
                    lose their livelihoods.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Solutions to Deforestation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Reforestation and afforestation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Reforestation:</strong> Planting trees in deforested areas.
                  </li>
                  <li>
                    <strong>Afforestation:</strong> Planting trees in areas that
                    were not previously forested.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Protected areas:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Establishing national parks, forest reserves, and protected
                    areas to conserve forests.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Sustainable logging:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Using selective logging and harvesting methods that allow
                    forests to regenerate.</li>
                </ul>
              </li>
              <li>
                <strong>Alternative energy sources:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Promoting solar, biogas, and alternative energy sources to
                    reduce dependence on firewood.</li>
                </ul>
              </li>
              <li>
                <strong>Community-based forestry:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Involving local communities in forest management and
                    benefit-sharing.</li>
                </ul>
              </li>
              <li>
                <strong>Education and awareness:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Teaching people about the importance of forests and the
                    need for conservation.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="deforestation-causes-effects-solutions.png"
              alt="A 2D diagram showing causes of deforestation (agriculture, firewood, logging, urbanisation, mining, fires), effects (biodiversity loss, soil erosion, climate change), and solutions (reforestation, protected areas, sustainable logging)"
              caption="Causes, effects, and solutions to deforestation."
            />
          </SubtopicCard>

          <SubtopicCard title="Importance of Afforestation and Reforestation">
            <p>
              <strong>Definition:</strong> Afforestation is the process of planting
              trees in areas that have not been forested. Reforestation is the
              process of replanting trees in areas that have been deforested.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Environmental benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Restores biodiversity (provides habitat for plants and animals).</li>
                  <li>Prevents soil erosion (roots hold the soil together).</li>
                  <li>Reduces climate change (absorbs carbon dioxide).</li>
                  <li>Increases rainfall (releases water vapour).</li>
                  <li>Reduces flooding (absorbs water).</li>
                </ul>
              </li>
              <li>
                <strong>Economic benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Provides timber and fuelwood (source of income and energy).</li>
                  <li>Provides employment (tree planting, forestry management).</li>
                  <li>Supports tourism (forests attract tourists).</li>
                </ul>
              </li>
              <li>
                <strong>Social benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Improves livelihoods (provides food, medicine, and income).</li>
                  <li>Protects water sources (rivers and springs).</li>
                  <li>Enhances community resilience (reduces impacts of drought and floods).</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="afforestation-reforestation-importance.png"
              alt="A 2D diagram showing the importance of afforestation and reforestation: environmental benefits, economic benefits, and social benefits"
              caption="Importance of afforestation and reforestation."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Forestry Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Harvesting:</strong> selective logging, clear-cutting, shelterwood</li>
            <li><strong>Treatment:</strong> seasoning, chemical preservation</li>
            <li><strong>Markets:</strong> local, regional, international</li>
            <li><strong>Deforestation:</strong> causes (agriculture, firewood, logging), effects (biodiversity loss, erosion), solutions (reforestation, protection)</li>
            <li><strong>Afforestation:</strong> planting new forests, environmental, economic, social benefits</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'wildlife',
      title: 'Wildlife',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="How Cultural Values and Beliefs Affect Natural Resource Management">
            <p>
              <strong>Definition:</strong> Cultural values and beliefs shape how
              people view and interact with natural resources. In Zimbabwe, and
              across Africa, traditional beliefs influence how wildlife and natural
              resources are managed.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Totems and taboos:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Totems:</strong> Animals or plants that represent a clan.
                    People with a certain totem may not kill or eat that animal,
                    protecting the species.
                  </li>
                  <li>
                    <strong>Taboos:</strong> Forbidden actions that protect natural
                    resources. For example, it may be taboo to cut down certain
                    trees or to hunt during certain seasons.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Respect for nature:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Many cultures believe that nature is sacred and should be respected.
                    This encourages conservation and sustainable use.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Ancestral spirits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Ancestors are believed to protect natural resources. People may
                    be reluctant to harm wildlife or forests for fear of angering
                    the ancestors.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Traditional leaders:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Chiefs and elders play a role in managing natural resources.
                    They enforce rules and resolve disputes over resources.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Community-based management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    Traditional systems of resource management are often community-based,
                    with shared responsibility for conservation.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="cultural-values-resource-management.png"
              alt="A 2D diagram showing how cultural values affect natural resource management: totems, taboos, respect for nature, ancestral spirits, traditional leaders, community-based management"
              caption="How cultural values and beliefs affect natural resource management."
            />
          </SubtopicCard>

          <SubtopicCard title="Conservation and Preservation Principles">
            <p>
              <strong>Definition:</strong> Conservation is the sustainable use and
              management of natural resources to ensure they are available for future
              generations. Preservation is the protection of natural resources from
              human use (setting aside areas where human activity is limited).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Conservation Principles</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Sustainable use:</strong> Using resources in a way that does
                not deplete them.
              </li>
              <li>
                <strong>Ecosystem approach:</strong> Managing whole ecosystems rather
                than individual species.
              </li>
              <li>
                <strong>Community involvement:</strong> Involving local communities
                in resource management.
              </li>
              <li>
                <strong>Science-based management:</strong> Using scientific research
                to guide conservation decisions.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Preservation Principles</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Protected areas:</strong> Setting aside areas where human
                activity is limited (national parks, game reserves).
              </li>
              <li>
                <strong>Biodiversity protection:</strong> Protecting all species
                and their habitats.
              </li>
              <li>
                <strong>Wilderness preservation:</strong> Keeping areas in their
                natural state, free from human development.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effect on Trading and Ecosystems</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Positive effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Sustainable trade:</strong> Conservation allows for
                    sustainable harvesting and trade of wildlife products (e.g.,
                    CITES – Convention on International Trade in Endangered Species).
                  </li>
                  <li>
                    <strong>Eco-tourism:</strong> Protected areas generate income
                    through tourism, supporting conservation.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Negative effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Restrictions on trade:</strong> Preservation can restrict
                    trade in wildlife products, affecting livelihoods.
                  </li>
                  <li>
                    <strong>Human-wildlife conflict:</strong> Protected areas can
                    lead to conflicts with communities (e.g., elephants destroying crops).
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="conservation-preservation-principles.png"
              alt="A 2D diagram showing conservation principles (sustainable use, ecosystem approach) and preservation principles (protected areas, biodiversity protection), with effects on trading and ecosystems"
              caption="Conservation and preservation principles and their effects on trading and ecosystems."
            />
          </SubtopicCard>

          <SubtopicCard title="Effects of Poaching">
            <p>
              <strong>Definition:</strong> Poaching is the illegal hunting, killing,
              or capturing of wild animals. It is a major threat to wildlife
              conservation in Zimbabwe and across Africa.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Effects on wildlife populations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Population decline:</strong> Poaching reduces animal
                    populations, sometimes to the point of extinction.
                  </li>
                  <li>
                    <strong>Loss of keystone species:</strong> Some species (e.g.,
                    elephants, rhinos) play a critical role in ecosystems. Their
                    loss affects the entire ecosystem.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Effects on ecosystems:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Disruption of food chains:</strong> Removing top
                    predators (lions, leopards) leads to an increase in prey
                    populations, causing habitat degradation.
                  </li>
                  <li>
                    <strong>Loss of biodiversity:</strong> Poaching reduces the
                    diversity of species in an area.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Effects on communities:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Loss of income:</strong> Poaching reduces the income
                    from eco-tourism, affecting local livelihoods.
                  </li>
                  <li>
                    <strong>Increased conflict:</strong> Communities may become
                    involved in poaching, leading to conflict with authorities.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Effects on conservation efforts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Undermines conservation:</strong> Poaching undermines
                    conservation efforts and makes it harder to protect wildlife.
                  </li>
                  <li>
                    <strong>Costs of anti-poaching:</strong> Governments and
                    conservation organisations spend large amounts of money on
                    anti-poaching efforts.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="poaching-effects.png"
              alt="A 2D diagram showing effects of poaching: wildlife population decline, ecosystem disruption, community impacts, and undermining conservation"
              caption="Effects of poaching on wildlife, ecosystems, and communities."
            />
          </SubtopicCard>

          <SubtopicCard title="Biodiversity">
            <p>
              <strong>Definition:</strong> Biodiversity is the variety of all life
              on Earth. It includes the different species, the genetic variation
              within species, and the different ecosystems in which they live.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Genetic Diversity</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The variety of genes within a species.
                It allows species to adapt to changing environments.
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Increases resilience to diseases and pests.</li>
                  <li>Allows adaptation to climate change.</li>
                  <li>Provides genetic resources for breeding and agriculture.</li>
                </ul>
              </li>
              <li>
                <strong>Example:</strong> Different varieties of maize or cattle
                have different genes that allow them to survive in different conditions.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Species Diversity</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The variety of different species in an
                area. It includes all animals, plants, fungi, and microorganisms.
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Ecosystems with high species diversity are more stable and productive.</li>
                  <li>Provides food, medicine, and other resources.</li>
                </ul>
              </li>
              <li>
                <strong>Example:</strong> The Eastern Highlands of Zimbabwe have
                high species diversity, including many endemic (unique) species.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ecosystem Diversity</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The variety of different ecosystems
                (habitats) in a region. It includes forests, grasslands, wetlands,
                deserts, and marine ecosystems.
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Provides a wide range of ecosystem services (water purification,
                    climate regulation, soil formation).</li>
                  <li>Supports a wide range of species.</li>
                </ul>
              </li>
              <li>
                <strong>Example:</strong> Zimbabwe has diverse ecosystems, including
                miombo woodlands, teak forests, savannah grasslands, wetlands
                (Mana Pools), and the Zambezi River ecosystem.
              </li>
            </ul>

            <AgricultureImage
              fileName="biodiversity-types.png"
              alt="A 2D diagram showing the three types of biodiversity: genetic diversity, species diversity, and ecosystem diversity with examples"
              caption="Types of biodiversity: genetic, species, and ecosystem diversity."
            />
          </SubtopicCard>

          <SubtopicCard title="Habitats of Wild Animals">
            <p>
              <strong>Definition:</strong> A habitat is the natural environment in
              which a wild animal lives. Different animals have different habitat
              requirements, and understanding these is important for conservation.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Types of Habitats in Zimbabwe</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Forest habitats:</strong>
                <br />
                <strong>Description:</strong> Areas covered with trees (miombo,
                teak, riverine forests).
                <br />
                <strong>Animals:</strong> Elephants, buffalo, leopards, monkeys,
                birds (fish eagles, hornbills), and many insects.
                <br />
                <strong>Location:</strong> Eastern Highlands, Zambezi Valley,
                Gokwe, Matopos Hills.
              </li>
              <li>
                <strong>Savannah (grassland) habitats:</strong>
                <br />
                <strong>Description:</strong> Grasslands with scattered trees
                (acacia, baobab).
                <br />
                <strong>Animals:</strong> Zebras, wildebeest, giraffes, antelopes,
                lions, cheetahs, hyenas.
                <br />
                <strong>Location:</strong> Hwange, Gonarezhou, Mana Pools,
                Matabeleland.
              </li>
              <li>
                <strong>Wetland habitats:</strong>
                <br />
                <strong>Description:</strong> Areas with water (rivers, lakes,
                swamps, floodplains).
                <br />
                <strong>Animals:</strong> Hippos, crocodiles, waterbirds (storks,
                herons, fish eagles), fish (tigerfish, tilapia).
                <br />
                <strong>Location:</strong> Mana Pools, Zambezi River, Lake Kariba,
                Lake Chivero.
              </li>
              <li>
                <strong>Rocky habitats (kopjes):</strong>
                <br />
                <strong>Description:</strong> Areas with granite boulders and rocky outcrops.
                <br />
                <strong>Animals:</strong> Hyraxes (dassies), rock hyraxes, baboons,
                leopards, reptiles (lizards, snakes).
                <br />
                <strong>Location:</strong> Matopos Hills, Domboshava, many parts
                of the Central Plateau.
              </li>
              <li>
                <strong>Desert and semi-desert habitats:</strong>
                <br />
                <strong>Description:</strong> Arid areas with sparse vegetation.
                <br />
                <strong>Animals:</strong> Oryx (gemsbok), springbok, ostriches,
                lizards, snakes, and other desert-adapted species.
                <br />
                <strong>Location:</strong> Parts of the Lowveld and Matabeleland.
              </li>
            </ul>

            <AgricultureImage
              fileName="animal-habitats-zimbabwe.png"
              alt="A map of Zimbabwe showing different animal habitats: forest, savannah, wetland, rocky, and desert habitats with representative animals"
              caption="Habitats of wild animals in Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Wildlife Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Cultural values:</strong> totems, taboos, ancestors, traditional leaders</li>
            <li><strong>Conservation:</strong> sustainable use, ecosystem approach</li>
            <li><strong>Preservation:</strong> protected areas, wilderness</li>
            <li><strong>Poaching effects:</strong> population decline, ecosystem disruption, conflict</li>
            <li><strong>Biodiversity:</strong> genetic, species, ecosystem diversity</li>
            <li><strong>Habitats:</strong> forest, savannah, wetland, rocky, desert</li>
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
            Explore land use and crop rotation, environmental factors affecting
            agriculture, forestry management and deforestation, and wildlife
            conservation, biodiversity, and habitats.
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
                  <strong className="text-white">Land Use &amp; Crop Rotation:</strong>
                  Physical farm planning improves efficiency, sustainability, and
                  safety. Crop rotation principles include including legumes,
                  rotating nutrient needs, and breaking pest cycles. A four-crop
                  rotation (maize → beans → potatoes → cover crop) improves soil
                  fertility, controls pests, and increases yields.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Rainfall in Zimbabwe:</strong>
                  Distribution varies from east (high) to west (low). Effectiveness
                  depends on intensity, timing, and soil type. Rainfall is highly
                  variable (unreliable), with droughts and floods. Intensity is
                  often high during thunderstorms, causing runoff and erosion.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Forestry:</strong> Harvesting
                  methods include selective logging, clear-cutting, and shelterwood
                  systems. Timber is treated through seasoning and chemical preservation.
                  Deforestation is caused by agriculture, firewood, logging, and
                  urbanisation, leading to biodiversity loss, erosion, and climate
                  change. Solutions include reforestation, protected areas, and
                  sustainable logging.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Wildlife:</strong> Cultural values
                  (totems, taboos, ancestors) affect natural resource management.
                  Conservation is sustainable use, while preservation is protection.
                  Poaching reduces populations, disrupts ecosystems, and undermines
                  conservation. Biodiversity includes genetic, species, and ecosystem
                  diversity. Habitats include forest, savannah, wetland, rocky,
                  and desert areas.
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

   --- LAND USE & CROP ROTATION IMAGES (2D DIAGRAM STYLE) ---

   1. physical-farm-planning.png
      A 2D diagram showing the importance of physical farm planning:
      - Improves efficiency (reduces movement, saves time, increases productivity)
      - Enhances sustainability (reduces erosion, protects water, conserves habitats)
      - Improves animal welfare (shelter, water supply)
      - Reduces costs (infrastructure, labour)
      - Improves safety (buildings, worker safety)
      Use icons and brief explanations.

   2. crop-rotation-principles.png
      A 2D diagram showing principles of crop rotation:
      - Include legumes (fix nitrogen)
      - Rotate crops with different nutrient needs (prevent depletion)
      - Rotate crops with different root depths (improve soil structure)
      - Rotate crops to break pest and disease cycles
      - Include cover crops (protect soil, suppress weeds)
      Use icons and brief explanations.

   3. four-crop-rotation.png
      A 2D diagram showing a four-crop rotation cycle:
      - Year 1: Maize (cereal, high nitrogen demand)
      - Year 2: Beans (legume, fixes nitrogen)
      - Year 3: Potatoes (tuber, different nutrients)
      - Year 4: Cover crop (improves soil health)
      Show each crop in sequence with arrows.

   4. crop-rotation-advantages.png
      A 2D diagram showing advantages of crop rotation:
      - Improves soil fertility
      - Controls pests and diseases
      - Reduces soil erosion
      - Improves crop yields
      - Reduces reliance on fertilisers
      - Diversifies income
      - Improves soil structure
      Use icons and brief explanations.

   --- RAINFALL IMAGES (2D DIAGRAM AND MAP STYLE) ---

   5. rainfall-characteristics-zimbabwe.png
      A map of Zimbabwe showing rainfall distribution (east to west), intensity (thunderstorms), and reliability (drought years, flood years).
      Use colour gradients and labels.

   6. rainfall-effects-agriculture.png
      A 2D diagram showing the effects of rainfall characteristics on agricultural activities:
      - Crop selection (maize, sorghum, millet)
      - Irrigation (Lowveld, Eastern Highlands)
      - Land preparation (tie-ridging, mulching)
      - Planting time (beginning of rainy season)
      - Risk management (drought-tolerant varieties, insurance)
      Use icons and brief explanations.

   --- FORESTRY IMAGES (2D DIAGRAM AND REALISTIC) ---

   7. timber-harvesting-treatment.png
      A 2D diagram showing timber harvesting methods:
      - Selective logging (only mature trees harvested)
      - Clear-cutting (all trees removed)
      - Shelterwood system (staged harvesting)
      And treatment methods:
      - Seasoning (air drying, kiln drying)
      - Chemical treatment (pressure treatment, brushing/dipping)
      Use icons and labels.

   8. timber-markets.png
      A 2D diagram showing timber markets:
      - Local markets (construction, furniture, fuelwood, carvings)
      - Regional markets (exports to South Africa, Zambia, Botswana, Mozambique)
      - International markets (exports to Europe, Asia)
      - Processing industries (sawmills, pulp and paper, pallets)
      Use icons and labels.

   9. deforestation-causes-effects-solutions.png
      A 2D diagram showing:
      - Causes of deforestation (agriculture, firewood, logging, urbanisation, mining, fires)
      - Effects (biodiversity loss, soil erosion, climate change, reduced rainfall, flooding, loss of livelihoods)
      - Solutions (reforestation, protected areas, sustainable logging, alternative energy, community-based forestry, education)
      Use icons and brief explanations.

   10. afforestation-reforestation-importance.png
       A 2D diagram showing the importance of afforestation and reforestation:
       - Environmental benefits (biodiversity restoration, erosion control, climate change reduction)
       - Economic benefits (timber, fuelwood, employment, tourism)
       - Social benefits (livelihoods, water protection, community resilience)
       Use icons and brief explanations.

   --- WILDLIFE IMAGES (2D DIAGRAM AND REALISTIC) ---

   11. cultural-values-resource-management.png
       A 2D diagram showing how cultural values affect natural resource management:
       - Totems (clan symbols protecting species)
       - Taboos (forbidden actions protecting resources)
       - Respect for nature (sacred natural resources)
       - Ancestral spirits (protection of resources)
       - Traditional leaders (enforcing rules)
       - Community-based management (shared responsibility)
       Use icons and brief explanations.

   12. conservation-preservation-principles.png
       A 2D diagram showing conservation principles (sustainable use, ecosystem approach, community involvement, science-based management) and preservation principles (protected areas, biodiversity protection, wilderness preservation).
       Show effects on trading (sustainable trade, eco-tourism) and ecosystems (human-wildlife conflict).

   13. poaching-effects.png
       A 2D diagram showing effects of poaching:
       - Wildlife population decline (extinction risk)
       - Ecosystem disruption (food chain imbalance)
       - Community impacts (loss of income, conflict)
       - Undermining conservation (costs of anti-poaching)
       Use icons and brief explanations.

   14. biodiversity-types.png
       A 2D diagram showing the three types of biodiversity:
       - Genetic diversity (variety of genes, adaptation)
       - Species diversity (variety of species, ecosystem stability)
       - Ecosystem diversity (variety of habitats, ecosystem services)
       Use icons and examples.

   15. animal-habitats-zimbabwe.png
       A map of Zimbabwe showing different animal habitats:
       - Forest habitats (Eastern Highlands, Zambezi Valley)
       - Savannah habitats (Hwange, Gonarezhou, Matabeleland)
       - Wetland habitats (Mana Pools, Lake Kariba)
       - Rocky habitats (Matopos Hills, Domboshava)
       - Desert/semi-desert habitats (Lowveld)
       Show representative animals for each habitat.

   ============================================================ */