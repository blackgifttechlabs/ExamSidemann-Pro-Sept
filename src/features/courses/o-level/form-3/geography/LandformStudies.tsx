import React, { useState, useRef } from 'react';

/**
 * Topic: Landform Studies – Geography
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const LandformStudies: React.FC = () => {
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
  const GeographyImage: React.FC<{
    fileName: string;
    alt: string;
    caption: string;
  }> = ({ fileName, alt, caption }) => {
    const [isMissing, setIsMissing] = useState(false);

    if (isMissing) return null;
    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        <img
          src={`/images/geography/${fileName}`}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full object-cover"
          onError={() => setIsMissing(true)}
        />
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
      id: 'earths-crust',
      title: "The Earth's Crust",
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Main Rock Types">
            <p>
              <strong>Definition:</strong> Rocks are solid natural materials that make up
              the Earth's crust. They are classified into three main types based on how they are formed:
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Igneous Rocks</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Formation:</strong> Formed from the cooling and solidification of
                molten rock (magma or lava).
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Granite:</strong> Intrusive (cooled slowly underground) – found in the Eastern Highlands of Zimbabwe.</li>
                  <li><strong>Basalt:</strong> Extrusive (cooled quickly on the surface) – found in the Great Dyke of Zimbabwe.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe Examples:</strong> Granite in the Matopos Hills, basalt in the Great Dyke.
              </li>
            </ul>

            <GeographyImage
              fileName="igneous-rocks-granite-basalt.png"
              alt="A 2D diagram showing granite and basalt rock formations with their formation processes labelled"
              caption="Igneous rocks: Granite (intrusive) and Basalt (extrusive)."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sedimentary Rocks</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Formation:</strong> Formed from the accumulation and compaction of
                sediments (rock fragments, shells, organic matter) over time.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Sandstone:</strong> Formed from sand grains.</li>
                  <li><strong>Limestone:</strong> Formed from shells and marine organisms.</li>
                  <li><strong>Shale:</strong> Formed from compacted mud and clay.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe Examples:</strong> Sandstone in the Zambezi Valley, limestone deposits in some areas.
              </li>
            </ul>

            <GeographyImage
              fileName="sedimentary-rocks-diagram.png"
              alt="A 2D diagram showing sedimentary rock formation through deposition, compaction, and cementation"
              caption="Sedimentary rocks: formation through deposition, compaction, and cementation."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Metamorphic Rocks</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Formation:</strong> Formed when existing rocks are changed by heat,
                pressure, or chemical reactions (metamorphism).
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Marble:</strong> Formed from limestone.</li>
                  <li><strong>Slate:</strong> Formed from shale.</li>
                  <li><strong>Gneiss:</strong> Formed from granite.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe Examples:</strong> Gneiss found in many parts of the Zimbabwean shield.
              </li>
            </ul>

            <GeographyImage
              fileName="metamorphic-rocks-diagram.png"
              alt="A 2D diagram showing metamorphic rock formation through heat and pressure"
              caption="Metamorphic rocks: formation through heat and pressure."
            />
          </SubtopicCard>

          <SubtopicCard title="Causes of Crustal Instability">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Crustal instability refers to movements and
                deformations in the Earth's crust caused by internal forces.
              </li>
              <li>
                <strong>Causes:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Plate tectonics:</strong> Movement of tectonic plates due to
                    convection currents in the mantle.
                  </li>
                  <li>
                    <strong>Volcanic activity:</strong> Movement of magma towards the surface.
                  </li>
                  <li>
                    <strong>Isostatic adjustment:</strong> The crust rising or falling due to
                    changes in weight (e.g., melting ice caps).
                  </li>
                  <li>
                    <strong>Earthquakes:</strong> Sudden release of stress along fault lines.
                  </li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Internal Structure of the Earth">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The Earth is composed of several layers,
                each with different properties.
              </li>
              <li>
                <strong>Layers:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Crust:</strong> The outermost layer (5-70 km thick). Made of
                    solid rock (continental and oceanic crust).
                  </li>
                  <li>
                    <strong>Mantle:</strong> The layer below the crust (up to 2900 km thick).
                    Made of semi-molten rock (asthenosphere) with convection currents.
                  </li>
                  <li>
                    <strong>Outer core:</strong> Liquid layer (about 2200 km thick) made of
                    iron and nickel.
                  </li>
                  <li>
                    <strong>Inner core:</strong> Solid centre (about 1200 km radius) made of
                    iron and nickel, at very high temperatures and pressure.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="earth-internal-structure-diagram.png"
              alt="A 2D cross-section diagram showing the internal structure of the Earth: crust, mantle, outer core, and inner core"
              caption="Internal structure of the Earth: crust, mantle, outer core, and inner core."
            />
          </SubtopicCard>

          <SubtopicCard title="Plate Tectonics and Resulting World Landforms">
            <p>
              <strong>Definition:</strong> Plate tectonics is the theory that the Earth's
              crust is divided into large plates that move slowly over the mantle.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Types of Plate Boundaries</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Divergent (Constructive) Boundaries:</strong> Plates move apart.
                Magma rises to fill the gap, creating new crust.
                <br />
                <strong>Landforms:</strong> Mid-ocean ridges, rift valleys (e.g., East African Rift Valley).
              </li>
              <li>
                <strong>Convergent (Destructive) Boundaries:</strong> Plates move towards
                each other. The denser plate subducts beneath the other.
                <br />
                <strong>Landforms:</strong> Fold mountains (e.g., Himalayas), ocean trenches,
                volcanic arcs (e.g., Andes).
              </li>
              <li>
                <strong>Transform (Conservative) Boundaries:</strong> Plates slide past
                each other horizontally.
                <br />
                <strong>Landforms:</strong> Fault lines, earthquakes (e.g., San Andreas Fault).
              </li>
            </ul>

            <GeographyImage
              fileName="plate-tectonics-boundaries.png"
              alt="A 2D diagram showing divergent, convergent, and transform plate boundaries with resulting landforms"
              caption="Plate tectonic boundaries: divergent, convergent, and transform."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Distribution of Major Landforms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Fold mountains:</strong> Himalayas (Asia), Alps (Europe), Rockies
                (North America), Andes (South America).
              </li>
              <li>
                <strong>Earthquake zones:</strong> Pacific Ring of Fire, Mediterranean belt,
                East African Rift Valley.
              </li>
              <li>
                <strong>Volcanoes:</strong> Pacific Ring of Fire, East African Rift Valley,
                Iceland, Hawaii.
              </li>
              <li>
                <strong>Rift valleys:</strong> East African Rift Valley (stretching from
                Ethiopia to Mozambique).
              </li>
            </ul>

            <GeographyImage
              fileName="world-landforms-distribution-map.png"
              alt="A world map showing the distribution of fold mountains, earthquake zones, volcanoes, and rift valleys"
              caption="Global distribution of fold mountains, earthquake zones, volcanoes, and rift valleys."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Igneous:</strong> formed from cooling magma/lava</li>
            <li><strong>Sedimentary:</strong> formed from compacted sediments</li>
            <li><strong>Metamorphic:</strong> changed by heat and pressure</li>
            <li><strong>Plate tectonics:</strong> movement of crustal plates</li>
            <li><strong>Convergent:</strong> plates moving together</li>
            <li><strong>Divergent:</strong> plates moving apart</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'folding-faulting-volcanoes',
      title: 'Folding, Faulting, Vulcanicity & Volcanoes',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Folding and Resulting Landforms">
            <p>
              <strong>Definition:</strong> Folding is the bending of rock layers caused by
              compressional forces (plates pushing together). It occurs in sedimentary rocks
              that are exposed to pressure over long periods.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Process of Folding</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Compressional forces:</strong> Plates push together, squeezing rock layers.
              </li>
              <li>
                <strong>Rock layers:</strong> Sedimentary rocks bend, fold, and buckle.
              </li>
              <li>
                <strong>Time:</strong> Folding takes millions of years.
              </li>
            </ul>

            <GeographyImage
              fileName="folding-process-diagram.png"
              alt="A 2D diagram showing the folding process: compressional forces causing rock layers to bend and fold"
              caption="The process of folding: compressional forces bending rock layers."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Resulting Landforms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Fold mountains:</strong> Large mountain ranges formed by folding
                (e.g., Himalayas, Andes, Alps).
              </li>
              <li>
                <strong>Anticline:</strong> An upward fold (arch) in the rock layers.
                The oldest rocks are in the centre.
              </li>
              <li>
                <strong>Syncline:</strong> A downward fold (trough) in the rock layers.
                The youngest rocks are in the centre.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Eastern Highlands are partially
                formed by folding and faulting.
              </li>
            </ul>

            <GeographyImage
              fileName="anticline-syncline-diagram.png"
              alt="A 2D diagram showing anticline (upward fold) and syncline (downward fold) with rock layers labelled"
              caption="Anticline (upward fold) and syncline (downward fold) in folded rock layers."
            />
          </SubtopicCard>

          <SubtopicCard title="Faulting and Resulting Landforms">
            <p>
              <strong>Definition:</strong> Faulting is the fracturing and displacement of
              rock layers caused by tensional (pulling apart) or compressional (pushing together) forces.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Process of Faulting</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Tensional forces:</strong> Plates pull apart, causing rocks to crack and slip.
              </li>
              <li>
                <strong>Compressional forces:</strong> Plates push together, causing rocks to fracture.
              </li>
              <li>
                <strong>Fault line:</strong> The plane along which the rocks have moved.
              </li>
            </ul>

            <GeographyImage
              fileName="faulting-process-diagram.png"
              alt="A 2D diagram showing the faulting process: tensional and compressional forces causing rock displacement"
              caption="The process of faulting: tensional and compressional forces."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Resulting Landforms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Rift valleys:</strong> A long, narrow valley formed when a block of
                land drops between two parallel faults.
                <br />
                <strong>Example:</strong> East African Rift Valley (extends from Ethiopia to Mozambique).
              </li>
              <li>
                <strong>Block mountains (Horsts):</strong> A raised block of land between two faults.
                <br />
                <strong>Example:</strong> The Eastern Highlands in Zimbabwe.
              </li>
              <li>
                <strong>Graben:</strong> A down-dropped block of land (same as a rift valley).
              </li>
              <li>
                <strong>Escarpments:</strong> Steep slopes formed by faulting.
              </li>
            </ul>

            <GeographyImage
              fileName="rift-valley-block-mountain-diagram.png"
              alt="A 2D diagram showing a rift valley (graben) and block mountain (horst) formed by faulting"
              caption="Rift valley (graben) and block mountain (horst) formed by faulting."
            />

            <GeographyImage
              fileName="east-african-rift-valley-map.png"
              alt="A map showing the East African Rift Valley extending from Ethiopia to Mozambique through Kenya, Tanzania, and Malawi"
              caption="The East African Rift Valley: a major faulting landform in Africa."
            />
          </SubtopicCard>

          <SubtopicCard title="Volcanic Activity and Related Landforms">
            <p>
              <strong>Definition:</strong> Vulcanicity (volcanic activity) is the movement
              of molten rock (magma) from the Earth's interior to the surface.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Process of Volcanic Activity</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Magma rises:</strong> Magma from the mantle rises through cracks
                in the crust.
              </li>
              <li>
                <strong>Lava:</strong> Magma that reaches the surface is called lava.
              </li>
              <li>
                <strong>Eruption:</strong> Volcanoes erupt when pressure builds up.
              </li>
            </ul>

            <GeographyImage
              fileName="volcanic-eruption-diagram.png"
              alt="A 2D cross-section diagram showing a volcanic eruption with magma chamber, main vent, crater, and lava flow"
              caption="Volcanic eruption: magma chamber, main vent, crater, and lava flow."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Resulting Landforms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Volcanoes:</strong> Mountains formed by the accumulation of lava
                and ash around the vent.
                <br />
                <strong>Types:</strong> Shield volcanoes (broad, gentle slopes), composite
                volcanoes (steep, alternating lava and ash).
              </li>
              <li>
                <strong>Lava plateaus:</strong> Large flat areas formed by extensive lava flows.
                <br />
                <strong>Example:</strong> The Great Dyke in Zimbabwe (formed by ancient volcanic activity).
              </li>
              <li>
                <strong>Calderas:</strong> Large circular depressions formed by the collapse
                of a volcano after an eruption.
              </li>
              <li>
                <strong>Crater lakes:</strong> Lakes that form in the craters of extinct volcanoes.
              </li>
              <li>
                <strong>Hot springs and geysers:</strong> Heated groundwater that emerges
                at the surface.
              </li>
            </ul>

            <GeographyImage
              fileName="volcanic-landforms-diagram.png"
              alt="A 2D diagram showing volcanic landforms: shield volcano, composite volcano, caldera, and lava plateau"
              caption="Volcanic landforms: shield volcano, composite volcano, caldera, and lava plateau."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Landform Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Folding:</strong> anticline, syncline, fold mountains</li>
            <li><strong>Faulting:</strong> rift valleys, block mountains, escarpments</li>
            <li><strong>Volcanic:</strong> volcanoes, lava plateaus, calderas</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'earthquakes-volcanoes-human',
      title: 'Earthquakes/Volcanoes & Human Activity',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Beneficial Effects of Volcanic Activity">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Geothermal Energy</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Energy generated from heat within the Earth.
              </li>
              <li>
                <strong>Uses:</strong> Used to generate electricity and heat buildings.
              </li>
              <li>
                <strong>Example:</strong> Kenya has geothermal power plants in the Rift Valley.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Hot Springs and Geysers</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Naturally heated groundwater that emerges at
                the surface.
              </li>
              <li>
                <strong>Uses:</strong> Recreation, health treatments (spas), and heating.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> Hot springs at Binga, Nyanyadzi, and
                other areas.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Minerals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Volcanic activity brings minerals to the surface.
              </li>
              <li>
                <strong>Examples:</strong> Gold, diamonds, copper, platinum, and other metals.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Great Dyke contains platinum, gold,
                and other minerals from ancient volcanic activity.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Volcanic Soils</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Soils formed from weathered volcanic ash and lava.
              </li>
              <li>
                <strong>Benefits:</strong> Very fertile, rich in minerals, support intensive
                agriculture.
              </li>
              <li>
                <strong>Example:</strong> The highlands of Kenya and Tanzania have fertile
                volcanic soils.
              </li>
            </ul>

            <GeographyImage
              fileName="volcanic-benefits-diagram.png"
              alt="A 2D diagram showing the beneficial effects of volcanic activity: geothermal energy, minerals, hot springs, and fertile soils"
              caption="Beneficial effects of volcanic activity: geothermal energy, minerals, hot springs, and fertile soils."
            />
          </SubtopicCard>

          <SubtopicCard title="Harmful Effects of Earthquakes and Volcanoes">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Earthquakes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Sudden shaking of the ground caused by the
                release of stress along fault lines.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Collapse of buildings and infrastructure.</li>
                  <li>Loss of life and injury.</li>
                  <li>Tsunamis (if underwater).</li>
                  <li>Landslides and ground rupture.</li>
                </ul>
              </li>
              <li>
                <strong>Example:</strong> The 2010 Haiti earthquake (magnitude 7.0) killed
                over 200,000 people.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Volcanic Eruptions</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The release of lava, ash, and gases from a volcano.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Lava flows destroy property and land.</li>
                  <li>Ash falls cover crops and buildings.</li>
                  <li>Poisonous gases (sulphur dioxide) harm health.</li>
                  <li>Pyroclastic flows (fast-moving hot ash and rock) are deadly.</li>
                </ul>
              </li>
              <li>
                <strong>Example:</strong> Mount Nyiragongo in the DRC (2021) destroyed
                homes and displaced thousands.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Landslides and Mudslides</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The rapid movement of rock, soil, and debris
                down a slope.
              </li>
              <li>
                <strong>Causes:</strong> Earthquakes, heavy rain, volcanic activity.
              </li>
              <li>
                <strong>Effects:</strong> Destruction of property, loss of life, blocking
                of roads and rivers.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Atmospheric Pollution</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Release of gases and ash into the atmosphere.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Climate cooling (ash blocks sunlight).</li>
                  <li>Acid rain (sulphur dioxide).</li>
                  <li>Respiratory health problems.</li>
                </ul>
              </li>
              <li>
                <strong>Example:</strong> The 1991 Mount Pinatubo eruption caused global
                cooling for several months.
              </li>
            </ul>

            <GeographyImage
              fileName="volcanic-earthquake-hazards.png"
              alt="A 2D diagram showing the harmful effects of earthquakes and volcanoes: collapsed buildings, ash fall, lava flows, and landslides"
              caption="Harmful effects of earthquakes and volcanoes: destruction and hazards."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Volcanic Impact</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Benefits:</strong> geothermal, minerals, fertile soils</li>
            <li><strong>Hazards:</strong> earthquakes, eruptions, landslides</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'weathering',
      title: 'Weathering (Definition, Processes, Landforms)',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Weathering vs Erosion">
            <p>
              <strong>Definition:</strong> Weathering is the breakdown of rocks at or near
              the Earth's surface. Unlike erosion, weathering does not involve the movement
              of material.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Weathering:</strong> Rocks break down in place. No movement involved.
              </li>
              <li>
                <strong>Erosion:</strong> Rocks are broken down and moved away by agents
                like water, wind, or ice.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Main Types of Weathering">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Mechanical Weathering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Physical breakdown of rocks without changing
                their chemical composition.
              </li>
              <li>
                <strong>Processes:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Freeze-thaw (frost shattering):</strong> Water freezes in cracks,
                    expands, and breaks the rock. Common in temperate climates.
                  </li>
                  <li>
                    <strong>Exfoliation (pressure release):</strong> Rocks expand when
                    pressure is removed, causing outer layers to peel off. Common in
                    tropical regions.
                  </li>
                  <li>
                    <strong>Root action:</strong> Plant roots grow into cracks and force
                    them apart.
                  </li>
                  <li>
                    <strong>Abrasion:</strong> Rocks are worn down by friction from wind,
                    water, or ice.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="mechanical-weathering-diagram.png"
              alt="A 2D diagram showing mechanical weathering processes: freeze-thaw, exfoliation, root action, and abrasion"
              caption="Mechanical weathering processes: freeze-thaw, exfoliation, root action, and abrasion."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Chemical Weathering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Breakdown of rocks through chemical reactions
                that change their composition.
              </li>
              <li>
                <strong>Processes:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Oxidation:</strong> Oxygen reacts with minerals (e.g., iron
                    rusting). Common in tropical climates.
                  </li>
                  <li>
                    <strong>Hydrolysis:</strong> Water reacts with minerals to form new
                    compounds (e.g., feldspar to clay).
                  </li>
                  <li>
                    <strong>Carbonation:</strong> Carbon dioxide dissolves in rainwater
                    to form weak carbonic acid, which dissolves limestone. Common in
                    tropical and temperate areas.
                  </li>
                  <li>
                    <strong>Solution:</strong> Minerals dissolve in water (e.g., salt).
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="chemical-weathering-diagram.png"
              alt="A 2D diagram showing chemical weathering processes: oxidation, hydrolysis, carbonation, and solution"
              caption="Chemical weathering processes: oxidation, hydrolysis, carbonation, and solution."
            />
          </SubtopicCard>

          <SubtopicCard title="Factors Influencing Weathering">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Climate:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Tropical climates:</strong> Chemical weathering is dominant
                    due to high temperatures and rainfall. Processes like hydrolysis and
                    carbonation are very active.
                  </li>
                  <li>
                    <strong>Temperate climates:</strong> Mechanical weathering (freeze-thaw)
                    and chemical weathering are both active.
                  </li>
                  <li>
                    <strong>Polar climates:</strong> Mechanical weathering (freeze-thaw) is
                    dominant.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Rock type:</strong> Some rocks are more resistant to weathering
                (granite) than others (limestone).
              </li>
              <li>
                <strong>Time:</strong> Weathering takes a long time to create significant
                changes.
              </li>
              <li>
                <strong>Vegetation:</strong> Plant roots accelerate mechanical weathering
                and produce organic acids that contribute to chemical weathering.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Landforms from Weathering">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Dwala (Inselberg)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A small, isolated hill of resistant rock that
                remains after surrounding softer rock has been weathered away.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Matopos Hills are classic examples
                of inselbergs (kopjes) formed from granite weathering.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Kopjes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A large, rounded rock outcrop that stands above
                the surrounding plain. Formed by exfoliation and chemical weathering.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The granite kopjes of the Matopos Hills.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Karst Landscape</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A landscape formed by the dissolution of
                soluble rocks, especially limestone, by acidic rainwater.
              </li>
              <li>
                <strong>Features:</strong> Caves, sinkholes, underground rivers, limestone
                pavements, stalactites, and stalagmites.
              </li>
              <li>
                <strong>Examples:</strong> The Karst region in Slovenia, and limestone
                areas in South Africa.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Mountain Peaks</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> High points of mountain ranges often shaped
                by weathering and erosion.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> Mount Nyangani (the highest peak in
                Zimbabwe) has been shaped by both mechanical and chemical weathering.
              </li>
            </ul>

            <GeographyImage
              fileName="weathering-landforms-zimbabwe.png"
              alt="A 2D diagram showing weathering landforms: inselbergs, kopjes, karst landscape, and mountain peaks"
              caption="Landforms from weathering: inselbergs, kopjes, karst landscape, and mountain peaks."
            />

            <GeographyImage
              fileName="matopos-kopjes-landscape.png"
              alt="A realistic photograph of the granite kopjes (inselbergs) in the Matopos Hills, Zimbabwe"
              caption="Granite kopjes (inselbergs) in the Matopos Hills, Zimbabwe – a classic weathering landform."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Weathering Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Mechanical:</strong> freeze-thaw, exfoliation, root action</li>
            <li><strong>Chemical:</strong> oxidation, hydrolysis, carbonation</li>
            <li><strong>Landforms:</strong> kopjes, inselbergs, karst</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'rivers',
      title: 'Rivers',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Seasonal Water Flow Pattern and Its Effect on Erosion, Transport, and Deposition">
            <p>
              <strong>Definition:</strong> Seasonal water flow refers to the variation in
              river discharge throughout the year. In Zimbabwe, rivers are seasonal, with
              high flow in summer (rainy season) and low flow in winter (dry season).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effect on Erosion</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>High flow (summer):</strong> Increased volume and speed cause
                more erosion (vertical and lateral). Rivers cut deeper valleys and widen
                their channels.
              </li>
              <li>
                <strong>Low flow (winter):</strong> Less erosion, with only small amounts
                of sediment being moved.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effect on Transport</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>High flow:</strong> More sediment is transported (suspended load,
                bedload, dissolved load). Rivers carry large amounts of silt and sand.
              </li>
              <li>
                <strong>Low flow:</strong> Less sediment is transported. Coarse material
                may be deposited in the river channel.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effect on Deposition</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>High flow:</strong> Sediment is carried downstream and deposited
                on floodplains and deltas.
              </li>
              <li>
                <strong>Low flow:</strong> Sediment is deposited in the river channel,
                creating sandbars and islands.
              </li>
            </ul>

            <GeographyImage
              fileName="seasonal-river-flow-zimbabwe.png"
              alt="A diagram showing seasonal river flow in Zimbabwe: high flow in summer and low flow in winter"
              caption="Seasonal river flow in Zimbabwe: summer high flow and winter low flow."
            />
          </SubtopicCard>

          <SubtopicCard title="Processes of Erosion, Transportation, and Deposition">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Erosion</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The wearing away of the riverbed and banks.
              </li>
              <li>
                <strong>Processes:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Hydraulic action:</strong> The force of water hitting the banks
                    and bed.
                  </li>
                  <li>
                    <strong>Abrasion (corrasion):</strong> Sediment hitting the bed and banks,
                    wearing them away.
                  </li>
                  <li>
                    <strong>Attrition:</strong> Sediment particles hitting each other and
                    becoming smaller and smoother.
                  </li>
                  <li>
                    <strong>Solution (corrosion):</strong> Minerals dissolving in the water.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Transportation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The movement of sediment by the river.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Solution:</strong> Dissolved minerals carried in the water.
                  </li>
                  <li>
                    <strong>Suspension:</strong> Fine particles (clay, silt) carried in the water.
                  </li>
                  <li>
                    <strong>Saltation:</strong> Particles bouncing along the riverbed.
                  </li>
                  <li>
                    <strong>Traction:</strong> Large particles rolling along the riverbed.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Deposition</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The dropping of sediment when the river loses
                energy.
              </li>
              <li>
                <strong>When it happens:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>When the river enters a lake or sea (delta formation).</li>
                  <li>When the river floods and spreads across a floodplain.</li>
                  <li>When the river's volume decreases (dry season).</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="river-erosion-transport-deposition.png"
              alt="A 2D diagram showing river processes: erosion (hydraulic action, abrasion, attrition), transportation (solution, suspension, saltation, traction), and deposition"
              caption="River processes: erosion, transportation, and deposition."
            />
          </SubtopicCard>

          <SubtopicCard title="Landforms from Rivers">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Valleys</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Low areas between hills or mountains, formed
                by river erosion.
              </li>
              <li>
                <strong>Types:</strong> V-shaped valleys (youthful stage), U-shaped valleys
                (glacial, not river), and flat-bottomed valleys (mature stage).
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Zambezi Valley is a large river valley.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Meanders</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A bend or curve in a river.
              </li>
              <li>
                <strong>Formation:</strong> Rivers erode the outside bank (undercutting)
                and deposit on the inside bank (point bar).
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Zambezi River has many meanders
                in its middle course.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Waterfalls</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A vertical drop in a river where water flows
                over a resistant rock layer.
              </li>
              <li>
                <strong>Formation:</strong> Rivers flow over a resistant rock layer
                (cap rock) over a softer rock layer. The softer rock erodes, creating
                an overhang and a plunge pool.
              </li>
              <li>
                <strong>African Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Victoria Falls (Zimbabwe/Zambia):</strong> One of the largest waterfalls in the world.</li>
                  <li><strong>Mosi-oa-Tunya:</strong> The local name for Victoria Falls.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Rapids</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> An area where a river flows over uneven bedrock,
                creating turbulent water.
              </li>
              <li>
                <strong>Formation:</strong> Occur where the river flows over alternating
                bands of hard and soft rock.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Zambezi River has rapids below
                Victoria Falls (the Batoka Gorge).
              </li>
            </ul>

            <GeographyImage
              fileName="river-landforms-africa.png"
              alt="A 2D diagram showing river landforms: valley, meander, waterfall, and rapids with African examples"
              caption="River landforms: valley, meander, waterfall (Victoria Falls), and rapids."
            />

            <GeographyImage
              fileName="victoria-falls-waterfall.png"
              alt="A realistic photograph of Victoria Falls on the Zambezi River, showing the waterfall, gorge, and spray"
              caption="Victoria Falls, Zimbabwe/Zambia – one of the world's largest waterfalls."
            />
          </SubtopicCard>

          <SubtopicCard title="River Control, Land Drainage, Multipurpose Development, and River Diversion">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Aims</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Flood control and prevention.</li>
              <li>Water supply for domestic and industrial use.</li>
              <li>Irrigation for agriculture.</li>
              <li>Hydroelectric power generation.</li>
              <li>Navigation improvement.</li>
              <li>Recreation and tourism.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Dams and reservoirs:</strong> Constructed to store water and
                control floods. Provide water for irrigation and generate electricity.
              </li>
              <li>
                <strong>Levees and embankments:</strong> Raised banks to contain floodwater.
              </li>
              <li>
                <strong>Channelisation:</strong> Straightening and deepening rivers to
                increase flow.
              </li>
              <li>
                <strong>Diversion:</strong> Redirecting water from one river to another.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Consequences</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Positive:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Reliable water supply.</li>
                  <li>Increased food production (irrigation).</li>
                  <li>Electricity generation.</li>
                  <li>Flood protection.</li>
                </ul>
              </li>
              <li>
                <strong>Negative:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Displacement of people (reservoir creation).</li>
                  <li>Loss of fertile land.</li>
                  <li>Environmental damage (ecosystem disruption).</li>
                  <li>Increased evaporation.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Zimbabwe Example: Kariba Dam</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> On the Zambezi River, border between Zimbabwe and Zambia.
              </li>
              <li>
                <strong>Purpose:</strong> Hydroelectric power generation (Kariba South
                Power Station), flood control, and irrigation.
              </li>
              <li>
                <strong>Consequences:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Lake Kariba was created (one of the largest artificial lakes in the world).</li>
                  <li>Displacement of people (Tonga people).</li>
                  <li>Development of fisheries and tourism.</li>
                  <li>Changes in the ecosystem downstream.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="kariba-dam-river-control.png"
              alt="A 2D diagram and realistic photograph showing the Kariba Dam on the Zambezi River, its purpose, and consequences"
              caption="Kariba Dam: multipurpose river development on the Zambezi River."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">River Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Erosion:</strong> hydraulic, abrasion, attrition, solution</li>
            <li><strong>Transport:</strong> solution, suspension, saltation, traction</li>
            <li><strong>Landforms:</strong> valleys, meanders, waterfalls, rapids</li>
            <li><strong>Control:</strong> dams, levees, channelisation</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'hot-deserts',
      title: 'Hot Deserts',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition, Characteristics, and Factors Influencing Location and Extent">
            <p>
              <strong>Definition:</strong> A hot desert is a region that receives very
              little rainfall (less than 250mm per year) and has high temperatures.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Characteristics</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Climate:</strong> Very hot days (over 40°C), cold nights (can
                drop below freezing). Very low rainfall (less than 250mm per year).
              </li>
              <li>
                <strong>Vegetation:</strong> Sparse, drought-resistant plants (cacti,
                succulents, thorny shrubs).
              </li>
              <li>
                <strong>Soil:</strong> Thin, dry, often sandy or rocky. Low organic content.
              </li>
              <li>
                <strong>Landforms:</strong> Sand dunes, rocky plateaus, dry riverbeds (wadis).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Factors Influencing Location and Extent</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Subtropical high-pressure belts:</strong> Deserts are found around
                20-30°N and 20-30°S (e.g., Sahara, Kalahari).
              </li>
              <li>
                <strong>Rain shadow effect:</strong> Mountains block moist air, creating
                dry areas on the leeward side (e.g., Atacama Desert).
              </li>
              <li>
                <strong>Cold ocean currents:</strong> Cold currents cool the air, reducing
                evaporation and rainfall (e.g., Namib Desert).
              </li>
              <li>
                <strong>Continental interior:</strong> Far from the ocean, so little moisture
                reaches the area (e.g., Gobi Desert).
              </li>
            </ul>

            <GeographyImage
              fileName="hot-deserts-world-map.png"
              alt="A world map showing the location of major hot deserts: Sahara, Kalahari, Namib, Arabian, Australian, Atacama, and Mojave"
              caption="Major hot deserts of the world: Sahara, Kalahari, Namib, Arabian, and others."
            />
          </SubtopicCard>

          <SubtopicCard title="Wind Action and Resulting Landforms">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Wind Processes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Deflation:</strong> The removal of fine particles by wind,
                leaving behind a stony surface. Creates deflation hollows.
              </li>
              <li>
                <strong>Abrasion (Corrasion):</strong> Sand particles carried by wind
                wear away rock surfaces. Creates ventifacts and yardangs.
              </li>
              <li>
                <strong>Saltation:</strong> Sand particles bounce along the surface,
                moving large amounts of sand.
              </li>
              <li>
                <strong>Surface creep:</strong> Coarse particles roll along the surface
                due to wind friction.
              </li>
            </ul>

            <GeographyImage
              fileName="wind-erosion-processes.png"
              alt="A 2D diagram showing wind erosion processes: deflation, abrasion, saltation, and surface creep"
              caption="Wind erosion processes: deflation, abrasion, saltation, and surface creep."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Resulting Landforms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Deflation hollows:</strong> Depressions in the ground created by
                wind removing fine material.
                <br />
                <strong>Zimbabwe Example:</strong> Deflation hollows can be found in dry
                areas of Zimbabwe (e.g., parts of Matabeleland).
              </li>
              <li>
                <strong>Barchan dunes:</strong> Crescent-shaped dunes with horns pointing
                downwind. Formed in areas with limited sand and unidirectional wind.
              </li>
              <li>
                <strong>Seif dunes:</strong> Long, parallel dunes with sharp crests.
                Formed by winds from different directions.
              </li>
              <li>
                <strong>Transverse dunes:</strong> Dunes that form perpendicular to
                the wind direction. Formed when there is abundant sand.
              </li>
              <li>
                <strong>Sand ripples:</strong> Small, wavy ridges on the surface of sand
                caused by wind.
              </li>
              <li>
                <strong>Yardangs:</strong> Streamlined rock ridges formed by wind abrasion.
                Common in desert areas.
              </li>
              <li>
                <strong>Mesas:</strong> Flat-topped tablelands with steep sides.
              </li>
              <li>
                <strong>Zeugen:</strong> Rock formations with a resistant cap rock and
                softer rock beneath, eroded by wind.
              </li>
            </ul>

            <GeographyImage
              fileName="wind-landforms-desert.png"
              alt="A 2D diagram showing wind landforms: barchan dunes, seif dunes, yardangs, mesas, and zeugen"
              caption="Wind landforms in deserts: barchan dunes, seif dunes, yardangs, mesas, and zeugen."
            />
          </SubtopicCard>

          <SubtopicCard title="Water Action and Resulting Landforms">
            <p>
              Although deserts are dry, water still plays a role in shaping the landscape,
              especially during rare but intense rainfall events.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Wadis:</strong> Dry riverbeds that fill with water after heavy rain.
              </li>
              <li>
                <strong>Inselbergs:</strong> Isolated hills of resistant rock that rise
                above the surrounding plain. Formed by chemical weathering.
              </li>
              <li>
                <strong>Pediments:</strong> Gently sloping rock surfaces at the base of
                hills, formed by the combined action of water and wind.
              </li>
              <li>
                <strong>Bahadas:</strong> Alluvial fans formed at the base of mountains
                by flash floods.
              </li>
              <li>
                <strong>Playas:</strong> Dry lake beds that fill with water after heavy
                rain and then evaporate, leaving behind salt deposits.
              </li>
            </ul>

            <GeographyImage
              fileName="water-landforms-desert.png"
              alt="A 2D diagram showing water landforms in deserts: wadis, inselbergs, pediments, bahadas, and playas"
              caption="Water landforms in deserts: wadis, inselbergs, pediments, bahadas, and playas."
            />
          </SubtopicCard>

          <SubtopicCard title="Human Activity in Deserts">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Soils</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Desert soils are thin, sandy, and low in organic matter. However, some
                desert soils are rich in minerals and can be used for agriculture with
                irrigation.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Water</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Water is scarce in deserts. Groundwater (aquifers) and rivers (like the
                Nile and Zambezi) are used for irrigation and drinking water.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Agriculture</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Irrigation is essential for agriculture in deserts. Crops like dates,
                citrus, and cotton are grown in desert oases and irrigated areas.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Save Valley Conservancy in
                Zimbabwe has irrigation schemes in semi-arid areas.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Settlement</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Settlement in deserts is usually limited to oases and areas near water
                sources. Cities like Cairo, Dubai, and Windhoek are located in desert regions.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Transport</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Transport is difficult in deserts due to sand, heat, and lack of water.
                Roads and railways are built along easier routes, and air transport
                is important for long distances.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Mineral Exploitation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Deserts are rich in minerals. Examples include oil (Middle East),
                diamonds (Namibia), gold (Sahara, Australian deserts), and salt.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Great Dyke, which has some
                desert-like areas, contains platinum, gold, and other minerals.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Desertification – Causes, Processes, and Conservation Measures">
            <p>
              <strong>Definition:</strong> Desertification is the process by which
              productive land becomes desert-like due to human activities and climate change.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes of Desertification</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Climate change:</strong> Reduced rainfall, increasing temperatures,
                and more frequent droughts.
              </li>
              <li>
                <strong>Deforestation:</strong> Cutting down trees reduces soil stability
                and rainfall.
              </li>
              <li>
                <strong>Overgrazing:</strong> Too many animals eat all the vegetation,
                leaving the soil exposed to erosion.
              </li>
              <li>
                <strong>Overcultivation:</strong> Farming the same land repeatedly without
                rest, depleting soil nutrients.
              </li>
              <li>
                <strong>Population pressure:</strong> More people need more resources,
                leading to overexploitation.
              </li>
              <li>
                <strong>Inappropriate farming techniques:</strong> Ploughing in dry areas
                without conservation measures.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Processes of Desertification</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Soil erosion:</strong> Wind and water remove fertile topsoil.
              </li>
              <li>
                <strong>Loss of vegetation:</strong> Plants die or are removed, reducing
                soil stability.
              </li>
              <li>
                <strong>Soil compaction:</strong> Overgrazing and machinery compact the
                soil, reducing water infiltration.
              </li>
              <li>
                <strong>Salinisation:</strong> Irrigation can cause salt to build up in
                the soil, making it unsuitable for crops.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Conservation Measures</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Afforestation:</strong> Planting trees to reduce wind erosion
                and increase rainfall.
              </li>
              <li>
                <strong>Controlled grazing:</strong> Managing livestock numbers and
                movement to prevent overgrazing.
              </li>
              <li>
                <strong>Crop rotation and fallowing:</strong> Resting land to allow it
                to recover.
              </li>
              <li>
                <strong>Contour ploughing:</strong> Ploughing across slopes to reduce
                water erosion.
              </li>
              <li>
                <strong>Water conservation:</strong> Building dams, check dams, and
                rainwater harvesting to retain water.
              </li>
              <li>
                <strong>Education and awareness:</strong> Teaching communities about
                sustainable land management.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Pfumvudza farming technique
                (conservation agriculture) is being promoted in Zimbabwe to combat
                desertification and land degradation.
              </li>
            </ul>

            <GeographyImage
              fileName="desertification-processes-conservation.png"
              alt="A 2D diagram showing desertification causes, processes, and conservation measures"
              caption="Desertification: causes, processes, and conservation measures."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Hot Deserts Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Wind:</strong> deflation, abrasion, dunes</li>
            <li><strong>Water:</strong> wadis, inselbergs, playas</li>
            <li><strong>Human activity:</strong> irrigation, mining, transport</li>
            <li><strong>Desertification:</strong> causes, processes, conservation</li>
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
            Landform Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the Earth's crust, rock types, plate tectonics, folding, faulting,
            volcanic activity, weathering, river landforms, and hot desert environments.
            Learn about the processes that shape our planet's surface.
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
                  <strong className="text-white">Rock Types:</strong> Igneous (granite,
                  basalt), Sedimentary (sandstone, limestone, shale), and Metamorphic
                  (marble, slate, gneiss) each formed by different processes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Plate Tectonics:</strong> Divergent
                  (rift valleys), Convergent (fold mountains, volcanoes), and Transform
                  (earthquakes) boundaries create major world landforms.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Folding &amp; Faulting:</strong> Folding
                  creates anticlines, synclines, and fold mountains; faulting creates
                  rift valleys, block mountains, and escarpments.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Weathering:</strong> Mechanical
                  (freeze-thaw, exfoliation) and Chemical (oxidation, hydrolysis,
                  carbonation) weathering create inselbergs, kopjes, and karst landscapes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Rivers:</strong> Erosion, transportation,
                  and deposition create valleys, meanders, waterfalls (Victoria Falls),
                  and rapids. River control includes dams (Kariba Dam) for hydroelectricity
                  and irrigation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Hot Deserts:</strong> Wind creates
                  dunes, yardangs, and deflation hollows; water creates wadis, inselbergs,
                  and playas. Desertification is caused by climate change, overgrazing,
                  and deforestation.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Landform Studies topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">Mapwork</span>?</>
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
                alert('Proceed to Mapwork (next topic)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Mapwork →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandformStudies;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/geography/
   Use a mix of 2D diagram style and realistic photographs.

   --- EARTH'S CRUST IMAGES (2D DIAGRAM STYLE) ---

   1. igneous-rocks-granite-basalt.png
      A 2D diagram showing the formation of igneous rocks: granite (intrusive, cooling slowly underground) and basalt (extrusive, cooling quickly on the surface).
      Show a cross-section with magma, lava, and the resulting rock formations.
      Include labels: "Magma", "Lava", "Granite", "Basalt", "Intrusive", "Extrusive".

   2. sedimentary-rocks-diagram.png
      A 2D diagram showing sedimentary rock formation: deposition, compaction, and cementation.
      Show layers of sediment being deposited, compressed, and cemented into sandstone, limestone, and shale.
      Include labels: "Deposition", "Compaction", "Cementation", "Sediments", "Sandstone", "Limestone".

   3. metamorphic-rocks-diagram.png
      A 2D diagram showing metamorphic rock formation: heat and pressure changing existing rocks.
      Show limestone turning into marble, and shale turning into slate.
      Include labels: "Heat and Pressure", "Marble", "Slate", "Gneiss", "Metamorphism".

   4. earth-internal-structure-diagram.png
      A 2D cross-section diagram showing the Earth's internal structure.
      Show the crust, mantle, outer core, and inner core.
      Include labels with thickness and composition (crust: solid rock, mantle: semi-molten, outer core: liquid iron/nickel, inner core: solid iron/nickel).

   5. plate-tectonics-boundaries.png
      A 2D diagram showing the three types of plate boundaries: divergent (plates moving apart), convergent (plates moving together), and transform (plates sliding past each other).
      Show the resulting landforms: mid-ocean ridges, rift valleys, fold mountains, ocean trenches, and fault lines.
      Include labels for each type of boundary and landform.

   6. world-landforms-distribution-map.png
      A world map showing the global distribution of fold mountains (Himalayas, Andes, Rockies, Alps), earthquake zones (Pacific Ring of Fire, Mediterranean belt), volcanoes (Ring of Fire, East Africa), and rift valleys (East African Rift Valley).
      Use different colours and symbols for each feature.

   --- FOLDING, FAULTING, VOLCANOES IMAGES (2D DIAGRAM STYLE) ---

   7. folding-process-diagram.png
      A 2D diagram showing the folding process: compressional forces pushing rock layers together, causing them to bend and buckle.
      Show the rock layers folding into anticlines and synclines.
      Include labels: "Compressional forces", "Anticline", "Syncline", "Rock layers".

   8. anticline-syncline-diagram.png
      A 2D diagram showing anticline (upward fold, oldest rocks in centre) and syncline (downward fold, youngest rocks in centre).
      Show the rock layers and their relative ages.
      Include labels: "Anticline", "Syncline", "Oldest rocks", "Youngest rocks".

   9. faulting-process-diagram.png
      A 2D diagram showing tensional forces (pulling apart) and compressional forces (pushing together) causing rock layers to fracture and slip.
      Show the fault line and displacement.
      Include labels: "Tensional forces", "Compressional forces", "Fault line", "Displacement".

   10. rift-valley-block-mountain-diagram.png
       A 2D diagram showing a rift valley (graben) and block mountain (horst) formed by faulting.
       Show two parallel faults with the central block dropped down (graben) and the outer blocks raised up (horst).
       Include labels: "Rift valley (Graben)", "Block mountain (Horst)", "Fault lines".

   11. east-african-rift-valley-map.png
       A map of East Africa showing the East African Rift Valley extending from Ethiopia to Mozambique.
       Show the rift valley, lakes (Lake Tanganyika, Lake Malawi, Lake Victoria), and volcanoes (Kilimanjaro, Kenya, Nyiragongo).
       Include labels for countries and major features.

   12. volcanic-eruption-diagram.png
       A 2D cross-section diagram showing a volcanic eruption.
       Show the magma chamber, main vent, crater, lava flow, ash cloud, and pyroclastic flow.
       Include labels: "Magma chamber", "Main vent", "Crater", "Lava flow", "Ash cloud", "Pyroclastic flow".

   13. volcanic-landforms-diagram.png
       A 2D diagram showing volcanic landforms: shield volcano (broad, gentle slopes), composite volcano (steep, alternating lava and ash), caldera (collapsed volcano), and lava plateau.
       Include labels for each landform type.

   --- EARTHQUAKES/VOLCANOES & HUMAN ACTIVITY IMAGES ---

   14. volcanic-benefits-diagram.png
       A 2D diagram showing the beneficial effects of volcanic activity: geothermal energy (power plant), hot springs (spa), minerals (gold, diamonds, platinum), and fertile soils (agriculture).
       Include labels: "Geothermal energy", "Hot springs", "Minerals", "Fertile soils".

   15. volcanic-earthquake-hazards.png
       A 2D diagram showing the harmful effects of earthquakes and volcanoes: collapsed buildings, ash fall, lava flows, and landslides.
       Include labels: "Earthquake damage", "Volcanic eruption", "Lava flow", "Ash fall", "Landslide".

   --- WEATHERING IMAGES (2D DIAGRAM AND REALISTIC) ---

   16. mechanical-weathering-diagram.png
       A 2D diagram showing mechanical weathering processes: freeze-thaw (water freezing in cracks), exfoliation (peeling of outer layers), root action (roots breaking rocks), and abrasion (rock particles wearing down surfaces).
       Include labels for each process.

   17. chemical-weathering-diagram.png
       A 2D diagram showing chemical weathering processes: oxidation (iron rusting), hydrolysis (feldspar to clay), carbonation (limestone dissolving), and solution (minerals dissolving in water).
       Include labels for each process.

   18. weathering-landforms-zimbabwe.png
       A 2D diagram showing weathering landforms: inselbergs, kopjes, karst landscape (caves, stalactites, sinkholes), and mountain peaks.
       Include examples: Matopos Hills (kopjes), Mount Nyangani (mountain peak).

   19. matopos-kopjes-landscape.png
       A realistic photograph of the granite kopjes (inselbergs) in the Matopos Hills, Zimbabwe.
       Show the large rounded granite boulders and the surrounding savannah landscape.

   --- RIVER IMAGES (2D DIAGRAM AND REALISTIC) ---

   20. seasonal-river-flow-zimbabwe.png
       A diagram showing seasonal river flow in Zimbabwe: high flow in summer (rainy season, November to March) and low flow in winter (dry season, May to October).
       Show a bar graph comparing the two seasons and a sketch of the river in both seasons.

   21. river-erosion-transport-deposition.png
       A 2D diagram showing river processes: erosion (hydraulic action, abrasion, attrition, solution), transportation (solution, suspension, saltation, traction), and deposition.
       Include labels for each process.

   22. river-landforms-africa.png
       A 2D diagram showing river landforms: valley (V-shaped, flat-bottomed), meander (bend, point bar, undercut), waterfall (cap rock, plunge pool), and rapids.
       Include African examples: Victoria Falls (Zimbabwe/Zambia), Zambezi River.

   23. victoria-falls-waterfall.png
       A realistic photograph of Victoria Falls on the Zambezi River, showing the waterfall, gorge, spray, and surrounding vegetation.

   24. kariba-dam-river-control.png
       A combination of a 2D diagram and realistic photograph showing the Kariba Dam on the Zambezi River.
       Show the dam structure, Lake Kariba, hydroelectric power station, and the purpose (irrigation, power, flood control).

   --- HOT DESERT IMAGES (2D DIAGRAM AND REALISTIC) ---

   25. hot-deserts-world-map.png
       A world map showing the location of major hot deserts: Sahara, Kalahari, Namib, Arabian, Australian, Atacama, and Mojave.
       Use a colour gradient to show desert regions.

   26. wind-erosion-processes.png
       A 2D diagram showing wind erosion processes: deflation (removal of fine particles), abrasion (sand particles wearing away rock), saltation (bouncing sand), and surface creep (rolling particles).
       Include labels for each process.

   27. wind-landforms-desert.png
       A 2D diagram showing wind landforms: barchan dunes (crescent-shaped), seif dunes (long parallel), transverse dunes (perpendicular to wind), yardangs (streamlined rock ridges), mesas (flat-topped tablelands), and zeugen (cap rock with softer rock beneath).
       Include labels for each landform.

   28. water-landforms-desert.png
       A 2D diagram showing water landforms in deserts: wadis (dry riverbeds), inselbergs (isolated hills), pediments (gently sloping rock surfaces), bahadas (alluvial fans), and playas (dry lake beds).
       Include labels for each landform.

   29. desertification-processes-conservation.png
       A 2D diagram showing desertification: causes (climate change, deforestation, overgrazing, overcultivation), processes (soil erosion, loss of vegetation, salinisation), and conservation measures (afforestation, controlled grazing, contour ploughing, water conservation).
       Include labels for each.

   ============================================================ */