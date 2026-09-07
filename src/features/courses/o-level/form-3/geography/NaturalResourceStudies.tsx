import React, { useState, useRef } from 'react';

// ---------------------------------------------------------------------------
// Image helper – defined at module scope so React sees a stable component
// type and never unmounts/remounts it (which would reset useState and cause
// onError to fire the missing-image fallback on every render).
// ---------------------------------------------------------------------------
const GeographyImage: React.FC<{
  fileName: string;
  alt: string;
  caption: string;
}> = ({ fileName, alt, caption }) => {
  const [isMissing, setIsMissing] = useState(false);
  const [imgSrc, setImgSrc] = useState(`/images/geography/natural-resources/${fileName}`);

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
            Place this file in <strong>public/images/geography/natural-resources/</strong>
          </p>
        </div>
      ) : (
        <img
          src={imgSrc}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full object-cover"
          onError={() => {
            if (imgSrc.startsWith('/images/geography/natural-resources/')) {
              setImgSrc(`/images/geography/${fileName}`);
            } else if (imgSrc.startsWith('/images/geography/')) {
              setImgSrc(`/images/courses/o-level/geography/${fileName}`);
            } else {
              setIsMissing(true);
            }
          }}
        />
      )}
      <figcaption className="border-t border-slate-100 px-4 py-3 text-sm font-medium leading-6 text-slate-600">
        {caption}
      </figcaption>
    </figure>
  );
};

// ---------------------------------------------------------------------------
// Subtopic Card – also at module scope for the same stability reason.
// ---------------------------------------------------------------------------
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

/**
 * Topic: Natural Resource Studies – Geography
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const NaturalResourceStudies: React.FC = () => {
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

  const sections: TopicSection[] = [
    {
      id: 'types-resources',
      title: 'Types of Natural Resources',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Classification of Natural Resources">
            <p>
              <strong>Definition:</strong> Natural resources are materials or substances
              that occur naturally in the environment and can be used by people.
              They are classified into two main categories: renewable and non-renewable.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Renewable Resources</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Resources that can be replenished naturally
                within a short time period (human lifespan) or are virtually inexhaustible.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Solar energy:</strong> Energy from the sun – inexhaustible.</li>
                  <li><strong>Wind energy:</strong> Energy from wind – inexhaustible.</li>
                  <li><strong>Water (hydroelectric):</strong> Energy from flowing water – renewable.</li>
                  <li><strong>Biomass:</strong> Wood, crop residues – renewable if managed sustainably.</li>
                  <li><strong>Forests:</strong> Can be replanted and regrow.</li>
                  <li><strong>Fish stocks:</strong> Can reproduce if not overfished.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe Examples:</strong> Forests (Eastern Highlands), water resources
                (Zambezi, Save, and Limpopo rivers), solar energy (abundant sunlight).
              </li>
            </ul>

            <GeographyImage
              fileName="renewable-resources-diagram.jpeg"
              alt="A 2D diagram showing renewable resources: solar, wind, water, biomass, and forests with arrows indicating replenishment"
              caption="Renewable resources: solar, wind, water, biomass, and forests."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Non-Renewable Resources</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Resources that exist in finite quantities
                and cannot be replenished within a human lifespan. Once used, they are gone.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Fossil fuels:</strong> Coal, oil, natural gas.</li>
                  <li><strong>Minerals:</strong> Gold, copper, iron ore, platinum, diamonds.</li>
                  <li><strong>Nuclear fuels:</strong> Uranium.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Gold:</strong> Mined in the Midlands and other areas.</li>
                  <li><strong>Platinum:</strong> Mined in the Great Dyke.</li>
                  <li><strong>Coal:</strong> Mined in Hwange.</li>
                  <li><strong>Nickel:</strong> Mined in Bindura and other areas.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="non-renewable-resources-diagram.jpeg"
              alt="A 2D diagram showing non-renewable resources: fossil fuels (coal, oil, gas), minerals, and nuclear fuels"
              caption="Non-renewable resources: fossil fuels, minerals, and nuclear fuels."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Recyclable Resources</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Resources that can be recycled and reused
                after they have been used. This reduces the demand for new resources and
                reduces waste.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Metals:</strong> Iron, steel, aluminium, copper, gold.</li>
                  <li><strong>Glass:</strong> Bottles and jars can be melted and remade.</li>
                  <li><strong>Paper:</strong> Can be recycled into new paper products.</li>
                  <li><strong>Plastics:</strong> Can be recycled (though limited).</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> Recycling programmes are growing in
                urban areas like Harare and Bulawayo, with collection of plastics, paper,
                and metals.
              </li>
            </ul>

            <GeographyImage
              fileName="recyclable-resources-diagram.jpeg"
              alt="A 2D diagram showing recyclable resources: metals, glass, paper, and plastics with recycling symbols"
              caption="Recyclable resources: metals, glass, paper, and plastics."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Renewable:</strong> can be replenished (solar, wind, water)</li>
            <li><strong>Non-renewable:</strong> finite, cannot be replaced (fossil fuels, minerals)</li>
            <li><strong>Recyclable:</strong> can be reused (metals, glass, paper)</li>
            <li><strong>Sustainability:</strong> using resources without depleting them</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'exploitation',
      title: 'The Exploitation of Resources',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Factors Influencing the Exploitation of Resources">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Technology:</strong> Advances in technology make it easier and
                cheaper to extract resources. For example, deep-sea drilling, fracking,
                and improved mining techniques.
              </li>
              <li>
                <strong>Demand:</strong> High demand for resources drives exploitation.
                For example, demand for copper for electronics, and oil for energy.
              </li>
              <li>
                <strong>Distance from market:</strong> Resources that are close to markets
                are cheaper to transport and exploit.
              </li>
              <li>
                <strong>Transport costs:</strong> High transport costs can make exploitation
                uneconomic. Resources near ports or railways are more profitable.
              </li>
              <li>
                <strong>Physical conditions:</strong> Climate, topography, and accessibility
                affect exploitation. Resources in remote or harsh areas are harder to extract.
              </li>
              <li>
                <strong>Accessibility:</strong> Resources that are easy to reach (near
                roads, railways, ports) are more likely to be exploited.
              </li>
            </ul>

            <GeographyImage
              fileName="factors-resource-exploitation.jpeg"
              alt="A 2D diagram showing factors influencing resource exploitation: technology, demand, distance, transport, physical conditions, and accessibility"
              caption="Factors influencing the exploitation of natural resources."
            />
          </SubtopicCard>

          <SubtopicCard title="Case Study: Forestry in West Africa (Renewable Resource)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Introduction</h4>
            <p>
              West Africa has extensive tropical rainforests, particularly in countries
              like Ghana, Côte d'Ivoire, Nigeria, and Cameroon. Forestry is an important
              economic activity, providing timber, employment, and export revenue.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods of Exploitation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Selective logging:</strong> Harvesting only the most valuable
                trees (hardwoods like mahogany, teak, ebony) while leaving others.
              </li>
              <li>
                <strong>Clear-cutting:</strong> Removing all trees in an area. This is
                destructive and leads to deforestation.
              </li>
              <li>
                <strong>Slash and burn:</strong> Cutting and burning forest to clear land
                for agriculture, often combined with timber extraction.
              </li>
              <li>
                <strong>Logging concessions:</strong> Governments grant companies rights
                to log specific areas.
              </li>
            </ul>

            <GeographyImage
              fileName="west-africa-forestry-map.jpeg"
              alt="A map of West Africa showing the tropical rainforest zones in Ghana, Côte d'Ivoire, Nigeria, and Cameroon"
              caption="Tropical rainforests of West Africa: key forestry areas."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Factors Influencing Exploitation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Technology:</strong> Mechanised logging equipment (chainsaws,
                bulldozers, skidders) makes logging faster and more efficient.
              </li>
              <li>
                <strong>Demand:</strong> High global demand for tropical hardwoods for
                furniture, construction, and flooring.
              </li>
              <li>
                <strong>Transport:</strong> Many forests are near rivers and ports,
                making it easy to transport timber to markets.
              </li>
              <li>
                <strong>Accessibility:</strong> Roads built for logging open up forests
                for exploitation.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects of Exploitation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Positive effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Provides employment and income.</li>
                  <li>Generates government revenue (taxes, export earnings).</li>
                  <li>Supports local communities and infrastructure.</li>
                </ul>
              </li>
              <li>
                <strong>Negative effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Deforestation and biodiversity loss.</li>
                  <li>Soil erosion and land degradation.</li>
                  <li>Disruption of water cycles and local climate.</li>
                  <li>Displacement of indigenous communities.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="west-africa-forestry-effects.jpeg"
              alt="A realistic photograph showing logging in West Africa, with cleared forest, timber trucks, and deforestation"
              caption="Forestry exploitation in West Africa: methods and effects."
            />
          </SubtopicCard>

          <SubtopicCard title="Case Study: Copper Mining in Zambia (Non-Renewable Resource)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Introduction</h4>
            <p>
              Zambia is one of Africa's largest producers of copper. Copper mining is the
              backbone of the Zambian economy, accounting for about 70% of export earnings.
              The Copperbelt province, near the border with the Democratic Republic of Congo,
              is the main mining area.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods of Exploitation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Open-pit mining:</strong> Extracting copper ore from large,
                open excavations.
              </li>
              <li>
                <strong>Underground mining:</strong> Mining copper ore from deep
                underground shafts and tunnels.
              </li>
              <li>
                <strong>Processing:</strong> Crushing and milling ore, then using chemical
                processes (flotation, smelting) to extract copper.
              </li>
            </ul>

            <GeographyImage
              fileName="zambia-copperbelt-map.jpeg"
              alt="A map of Zambia showing the Copperbelt province and major copper mining areas near the DRC border"
              caption="Copper mining in Zambia: the Copperbelt province."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Factors Influencing Exploitation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Technology:</strong> Modern mining technology (heavy machinery,
                processing plants) allows for large-scale extraction.
              </li>
              <li>
                <strong>Demand:</strong> High global demand for copper in electronics,
                construction, and renewable energy (electric vehicles, solar panels).
              </li>
              <li>
                <strong>Transport:</strong> Copper is exported via railway to ports in
                Dar es Salaam (Tanzania), Beira (Mozambique), and Durban (South Africa).
              </li>
              <li>
                <strong>Accessibility:</strong> The Copperbelt is near roads, railways,
                and the DRC border, making it accessible.
              </li>
              <li>
                <strong>Physical conditions:</strong> The area has rich copper deposits,
                making mining economically viable.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects of Exploitation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Positive effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Generates significant export revenue.</li>
                  <li>Provides employment and supports local economies.</li>
                  <li>Supports infrastructure development (roads, railways, electricity).</li>
                </ul>
              </li>
              <li>
                <strong>Negative effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Environmental pollution (water, air, soil contamination).</li>
                  <li>Acid mine drainage from waste rock and tailings.</li>
                  <li>Deforestation and land degradation.</li>
                  <li>Health problems for mining communities (respiratory diseases).</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="zambia-copper-mining-effects.jpeg"
              alt="A realistic photograph of a copper mine in Zambia showing open-pit mining, processing plants, and environmental impacts"
              caption="Copper mining in Zambia: methods, benefits, and environmental effects."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Exploitation Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Forestry (W. Africa):</strong> timber, selective logging</li>
            <li><strong>Copper (Zambia):</strong> open-pit, underground mining</li>
            <li><strong>Factors:</strong> technology, demand, transport, accessibility</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'population-resources',
      title: 'Population and Resources',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Zimbabwean Population Growth and Its Effects">
            <p>
              <strong>Definition:</strong> Population growth is the increase in the number
              of people living in a country. Zimbabwe's population has grown significantly
              since independence in 1980, from about 7 million to over 15 million people
              in 2022. This growth puts pressure on the country's natural resources.
            </p>

            <GeographyImage
              fileName="zimbabwe-population-growth-graph..png"
              alt="A line graph showing Zimbabwe's population growth from 1980 to 2022 with projected growth"
              caption="Population growth in Zimbabwe: 1980 to 2022."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects on Soil Resources</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Soil erosion:</strong> More people need more land for farming.
                This leads to cultivation of marginal land, deforestation, and overgrazing,
                causing soil erosion.
              </li>
              <li>
                <strong>Soil exhaustion:</strong> Continuous farming without fallow periods
                depletes soil nutrients, reducing agricultural productivity.
              </li>
              <li>
                <strong>Loss of fertile land:</strong> Urban expansion covers productive
                agricultural land with buildings and roads.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects on Forest Resources</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Deforestation:</strong> More people need more land for farming
                and settlements, leading to clearing of forests.
              </li>
              <li>
                <strong>Firewood collection:</strong> Many Zimbabweans rely on firewood
                for cooking and heating, leading to depletion of forests.
              </li>
              <li>
                <strong>Loss of biodiversity:</strong> Forest destruction reduces habitat
                for wildlife, leading to loss of species.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> Deforestation is severe in areas like
                the Eastern Highlands, Chiredzi, and along the Zambezi Valley.
              </li>
            </ul>

            <GeographyImage
              fileName="zimbabwe-deforestation-soil-erosion.jpeg"
              alt="A realistic photograph showing deforestation and soil erosion in Zimbabwe"
              caption="Deforestation and soil erosion in Zimbabwe caused by population pressure."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects on Water Resources</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Water scarcity:</strong> More people need more water for domestic,
                agricultural, and industrial use. This leads to over-extraction of water
                from rivers and aquifers.
              </li>
              <li>
                <strong>Pollution:</strong> Increased population leads to more waste and
                pollution of water sources (rivers, dams, lakes).
              </li>
              <li>
                <strong>Reduced water quality:</strong> Agricultural runoff, sewage,
                and industrial waste contaminate water sources.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects on Wildlife Resources</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Habitat loss:</strong> Population growth leads to expansion of
                farms and settlements, destroying wildlife habitats.
              </li>
              <li>
                <strong>Poaching:</strong> More people and poverty lead to increased
                poaching for bushmeat and illegal wildlife products.
              </li>
              <li>
                <strong>Human-wildlife conflict:</strong> As people and wildlife compete
                for space, conflicts increase (e.g., elephants destroying crops).
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> Wildlife in national parks (Hwange,
                Gonarezhou, Mana Pools) is threatened by poaching and habitat loss.
              </li>
            </ul>

            <GeographyImage
              fileName="zimbabwe-wildlife-habitat-loss.jpeg"
              alt="A realistic photograph showing wildlife habitat loss and human-wildlife conflict in Zimbabwe"
              caption="Wildlife habitat loss and human-wildlife conflict in Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects on Land Resources</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Land degradation:</strong> Overuse of land leads to degradation
                through soil erosion, compaction, and loss of fertility.
              </li>
              <li>
                <strong>Urban expansion:</strong> Cities and towns expand, consuming
                agricultural and natural land.
              </li>
              <li>
                <strong>Land conflicts:</strong> Competition for land leads to conflicts
                between farmers, herders, and urban developers.
              </li>
            </ul>

            <GeographyImage
              fileName="zimbabwe-population-resources-summary.jpeg"
              alt="A 2D diagram showing the effects of population growth on soil, forest, water, wildlife, and land resources in Zimbabwe"
              caption="Effects of population growth on Zimbabwe's natural resources."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Population Impact</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Soil:</strong> erosion, exhaustion, loss of fertility</li>
            <li><strong>Forest:</strong> deforestation, firewood, biodiversity loss</li>
            <li><strong>Water:</strong> scarcity, pollution, reduced quality</li>
            <li><strong>Wildlife:</strong> habitat loss, poaching, conflict</li>
            <li><strong>Land:</strong> degradation, urban expansion, conflict</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'effects-development',
      title: 'The Effects of Resource Development',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Negative Environmental Consequences of Resource Exploitation">
            <p>
              <strong>Definition:</strong> Resource development can cause significant
              environmental damage. This includes effects on water, land, and air.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects on Water</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Water pollution:</strong> Mining, industry, and agriculture
                release pollutants into rivers, lakes, and groundwater.
              </li>
              <li>
                <strong>Acid mine drainage:</strong> Mining exposes sulphide minerals,
                which react with water and oxygen to form acid. This acid can contaminate
                water sources, killing aquatic life and making water unsafe.
              </li>
              <li>
                <strong>Sedimentation:</strong> Deforestation and mining cause soil
                erosion, which washes sediments into rivers, damaging habitats and
                reducing water quality.
              </li>
              <li>
                <strong>Water scarcity:</strong> Resource development consumes large
                amounts of water, reducing water availability for other uses.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> Mining operations in the Great Dyke
                have caused water pollution in some rivers, affecting communities
                downstream.
              </li>
            </ul>

            <GeographyImage
              fileName="water-pollution-resource-development.jpeg"
              alt="A 2D diagram showing water pollution from mining and industry: acid mine drainage, sedimentation, and chemical contamination"
              caption="Water pollution from resource development: acid mine drainage, sedimentation, and chemical contamination."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects on Land</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Land degradation:</strong> Mining, deforestation, and agriculture
                can degrade land, making it unproductive.
              </li>
              <li>
                <strong>Soil erosion:</strong> Removal of vegetation (forests, grasslands)
                exposes soil to wind and water erosion.
              </li>
              <li>
                <strong>Mine tailings:</strong> Waste material from mining (tailings)
                is often stored in large dams. If these fail, they can release toxic
                material into the environment.
              </li>
              <li>
                <strong>Loss of agricultural land:</strong> Resource extraction (mining,
                urban development) takes land out of agricultural production.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> Deforestation and gold mining in
                the Midlands have caused land degradation and soil erosion.
              </li>
            </ul>

            <GeographyImage
              fileName="land-degradation-resource-development.jpeg"
              alt="A 2D diagram showing land degradation from resource development: mining, deforestation, soil erosion, and tailings dams"
              caption="Land degradation from resource development: mining, deforestation, and soil erosion."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects on Air</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Air pollution:</strong> Burning fossil fuels, industrial
                processes, and mining release pollutants into the air.
              </li>
              <li>
                <strong>Greenhouse gas emissions:</strong> Resource exploitation
                contributes to CO₂ emissions, driving climate change.
              </li>
              <li>
                <strong>Dust and particulates:</strong> Mining, quarrying, and
                construction release dust and particulates into the air, causing
                respiratory health problems.
              </li>
              <li>
                <strong>Acid rain:</strong> Sulphur dioxide from burning coal and oil
                can form acid rain, damaging forests, soils, and buildings.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> Coal mining in Hwange and thermal
                power plants contribute to air pollution in the area.
              </li>
            </ul>

            <GeographyImage
              fileName="air-pollution-resource-development.jpeg"
              alt="A 2D diagram showing air pollution from resource development: factory emissions, dust, and greenhouse gases"
              caption="Air pollution from resource development: factory emissions, dust, and greenhouse gases."
            />

            <GeographyImage
              fileName="environmental-impacts-resource-exploitation.jpeg"
              alt="A split 2D diagram showing the negative environmental impacts of resource exploitation on water, land, and air"
              caption="Negative environmental impacts of resource exploitation: water, land, and air pollution."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Environmental Impacts</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Water:</strong> pollution, acid mine drainage, sedimentation</li>
            <li><strong>Land:</strong> degradation, soil erosion, tailings</li>
            <li><strong>Air:</strong> pollution, greenhouse gases, dust</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'conservation',
      title: 'The Conservation of Resources',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Integrated Resource Conservation in a Named River Basin">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Case Study: The Zambezi River Basin</h4>
            <p>
              <strong>Definition:</strong> Integrated resource conservation is an
              approach that considers all resources (water, land, forests, wildlife)
              together in a sustainable way. It aims to balance development with
              environmental protection.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Introduction to the Zambezi River Basin</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> The Zambezi River flows through eight countries:
                Zambia, Angola, Namibia, Botswana, Zimbabwe, Mozambique, Malawi, and Tanzania.
              </li>
              <li>
                <strong>Length:</strong> About 2,700 km long, making it Africa's fourth-largest river.
              </li>
              <li>
                <strong>Basin area:</strong> About 1.4 million km².
              </li>
              <li>
                <strong>Importance:</strong> The basin supports millions of people through
                agriculture, fishing, tourism, and hydroelectric power.
              </li>
            </ul>

            <GeographyImage
              fileName="zambezi-river-basin-map.jpeg"
              alt="A map showing the Zambezi River Basin with its eight countries, major tributaries, and key features (Kariba Dam, Cahora Bassa Dam, Victoria Falls)"
              caption="The Zambezi River Basin: countries, tributaries, and key features."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Integrated Conservation in the Zambezi Basin</h4>
            <p>
              Integrated conservation in the Zambezi Basin involves managing water, land,
              forests, and wildlife together to ensure sustainable development.
            </p>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Water Resource Management</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Dams and reservoirs:</strong> Kariba Dam and Cahora Bassa Dam
                generate hydroelectric power and provide water for irrigation.
              </li>
              <li>
                <strong>Water sharing agreements:</strong> The Zambezi Watercourse
                Commission (ZAMCOM) coordinates water sharing among the eight basin
                countries.
              </li>
              <li>
                <strong>Conservation:</strong> Protecting wetlands and floodplains to
                maintain water quality and support biodiversity.
              </li>
            </ul>

            <GeographyImage
              fileName="zambezi-water-management.jpeg"
              alt="A 2D diagram showing water resource management in the Zambezi Basin: dams, irrigation, and water sharing agreements"
              caption="Water resource management in the Zambezi Basin: dams, irrigation, and water sharing."

            />

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Land and Forest Conservation</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Protected areas:</strong> National parks and game reserves
                protect forests and wildlife. Examples: Hwange National Park (Zimbabwe),
                Mana Pools National Park (Zimbabwe), Kafue National Park (Zambia).
              </li>
              <li>
                <strong>Reforestation:</strong> Planting trees to restore deforested
                areas and prevent soil erosion.
              </li>
              <li>
                <strong>Sustainable agriculture:</strong> Promoting farming practices
                that protect soil and water, such as conservation tillage and crop rotation.
              </li>
            </ul>

            <GeographyImage
              fileName="zambezi-land-forest-conservation.jpeg"
              alt="A realistic photograph showing forest conservation and protected areas in the Zambezi Basin"
              caption="Land and forest conservation in the Zambezi Basin: protected areas and reforestation."
            />

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Wildlife Conservation</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Anti-poaching:</strong> Patrols and community programmes to
                protect elephants, rhinos, lions, and other wildlife.
              </li>
              <li>
                <strong>Community-based natural resource management (CBNRM):</strong>
                Involving local communities in wildlife conservation and sharing benefits
                from tourism and hunting.
              </li>
              <li>
                <strong>Wildlife corridors:</strong> Creating corridors to allow animals
                to move between protected areas.
              </li>
            </ul>

            <GeographyImage
              fileName="zambezi-wildlife-conservation.jpeg"
              alt="A realistic photograph showing wildlife conservation in the Zambezi Basin: elephants, anti-poaching patrols, and community involvement"
              caption="Wildlife conservation in the Zambezi Basin: anti-poaching, CBNRM, and wildlife corridors."
            />

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Sustainable Tourism</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Eco-tourism:</strong> Promoting tourism that benefits local
                communities and protects the environment.
              </li>
              <li>
                <strong>Victoria Falls:</strong> A major tourist attraction that generates
                income for both Zimbabwe and Zambia.
              </li>
              <li>
                <strong>Tourism revenue:</strong> Used to fund conservation efforts and
                support local communities.
              </li>
            </ul>

            <GeographyImage
              fileName="zambezi-sustainable-tourism.jpeg"
              alt="A realistic photograph of Victoria Falls and eco-tourism activities in the Zambezi Basin"
              caption="Sustainable tourism in the Zambezi Basin: Victoria Falls and eco-tourism."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Challenges and Solutions</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Challenges:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Climate change (droughts and floods).</li>
                  <li>Population growth and increasing demand for resources.</li>
                  <li>Illegal logging, mining, and poaching.</li>
                  <li>Water pollution and over-extraction.</li>
                </ul>
              </li>
              <li>
                <strong>Solutions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Strengthening ZAMCOM for better water management.</li>
                  <li>Expanding protected areas and wildlife corridors.</li>
                  <li>Promoting sustainable livelihoods for local communities.</li>
                  <li>International cooperation and funding for conservation.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="zambezi-conservation-summary.jpeg"
              alt="A 2D diagram summarising integrated conservation in the Zambezi Basin: water management, land conservation, wildlife protection, and sustainable tourism"
              caption="Integrated conservation in the Zambezi River Basin: water, land, wildlife, and tourism."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Conservation Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Zambezi Basin:</strong> 8 countries, 2,700 km long</li>
            <li><strong>Water:</strong> dams, sharing agreements, wetlands</li>
            <li><strong>Land/Forest:</strong> protected areas, reforestation</li>
            <li><strong>Wildlife:</strong> anti-poaching, CBNRM, corridors</li>
            <li><strong>Tourism:</strong> eco-tourism, Victoria Falls</li>
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
            Natural Resource Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the classification of natural resources, the exploitation of renewable
            and non-renewable resources, population growth and its effects, environmental
            impacts, and integrated conservation strategies.
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
                  <strong className="text-white">Types of Resources:</strong> Renewable
                  (solar, wind, water, forests, fish) can be replenished; Non-renewable
                  (fossil fuels, minerals) are finite; Recyclable resources (metals,
                  glass, paper) can be reused.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Exploitation:</strong> Forestry in
                  West Africa (selective logging, clear-cutting) and Copper mining in
                  Zambia (open-pit, underground) are influenced by technology, demand,
                  transport, and accessibility.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Population Growth:</strong> Zimbabwe's
                  growing population causes soil erosion, deforestation, water scarcity,
                  wildlife habitat loss, and land degradation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Environmental Effects:</strong> Resource
                  exploitation pollutes water (acid mine drainage), degrades land (soil
                  erosion, tailings), and pollutes air (greenhouse gases, dust).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Conservation:</strong> Integrated
                  conservation in the Zambezi Basin manages water (dams, sharing
                  agreements), land (protected areas, reforestation), wildlife (anti-poaching,
                  CBNRM), and sustainable tourism.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Natural Resource Studies topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">Geographical Skills</span>?</>
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
                alert('Proceed to Geographical Skills (next topic)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Geographical Skills →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NaturalResourceStudies;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/geography/natural-resources/
   Use a mix of 2D diagram style and realistic photographs.

   --- TYPES OF RESOURCES IMAGES (2D DIAGRAM STYLE) ---

   1. renewable-resources-diagram.jpeg
      A 2D diagram showing renewable resources: solar (sun), wind (wind turbines), water (hydroelectric dam), biomass (trees), and fish.
      Include arrows showing replenishment cycle.
      Label each resource clearly.

   2. non-renewable-resources-diagram.jpeg
      A 2D diagram showing non-renewable resources: coal (mine), oil (oil rig), natural gas, gold, copper, platinum.
      Include labels showing they are finite and cannot be replaced.

   3. recyclable-resources-diagram.jpeg
      A 2D diagram showing recyclable resources: metals (aluminium can), glass (bottle), paper (newspaper), plastics (plastic bottle).
      Include recycling symbols and arrows showing the recycling loop.

   --- EXPLOITATION IMAGES (2D DIAGRAM AND REALISTIC) ---

   4. factors-resource-exploitation.jpeg
      A 2D diagram showing six factors influencing resource exploitation: technology, demand, distance from market, transport costs, physical conditions, and accessibility.
      Use icons and brief explanations for each factor.

   5. west-africa-forestry-map.png
      A map of West Africa showing the tropical rainforest zones in Ghana, Côte d'Ivoire, Nigeria, and Cameroon.
      Show major logging areas and export ports.

   6. west-africa-forestry-effects.png
      A realistic photograph showing logging in West Africa, with cleared forest, timber trucks, and deforestation.
      Show the contrast between standing forest and cleared areas.

   7. zambia-copperbelt-map.png
      A map of Zambia showing the Copperbelt province and major copper mining areas (Kitwe, Ndola, Luanshya, Mufulira) near the DRC border.
      Show railways and roads to ports.

   8. zambia-copper-mining-effects.png
      A realistic photograph of a copper mine in Zambia showing open-pit mining, processing plants, and environmental impacts (dust, waste rock).

   --- POPULATION AND RESOURCES IMAGES (2D DIAGRAM AND REALISTIC) ---

   9. zimbabwe-population-growth-graph.png
      A line graph showing Zimbabwe's population growth from 1980 (7 million) to 2022 (15+ million) with projected growth to 2030.
      Use clear labels and a title.

   10. zimbabwe-deforestation-soil-erosion.png
       A realistic photograph showing deforestation and soil erosion in Zimbabwe.
       Show cleared land, exposed soil, and perhaps some reforestation efforts.

   11. zimbabwe-wildlife-habitat-loss.png
       A realistic photograph showing wildlife habitat loss and human-wildlife conflict.
       Show elephants or other wildlife near farms or villages.

   12. zimbabwe-population-resources-summary.png
       A 2D diagram summarising the effects of population growth on soil, forest, water, wildlife, and land resources.
       Use five sections with icons and brief explanations.

   --- EFFECTS OF RESOURCE DEVELOPMENT IMAGES (2D DIAGRAM AND REALISTIC) ---

   13. water-pollution-resource-development.png
       A 2D diagram showing water pollution from mining and industry: acid mine drainage, sedimentation, and chemical contamination.
       Show polluted water, dead fish, and warning signs.

   14. land-degradation-resource-development.png
       A 2D diagram showing land degradation from resource development: mining (open-pit), deforestation, soil erosion, and tailings dams.
       Show degraded land and erosion.

   15. air-pollution-resource-development.png
       A 2D diagram showing air pollution from resource development: factory emissions (smoke), dust from mining, and greenhouse gases.
       Show polluted sky and health impacts.

   16. environmental-impacts-resource-exploitation.png
       A split 2D diagram showing the three main environmental impacts: water pollution, land degradation, and air pollution.
       Use icons and brief explanations for each.

   --- CONSERVATION IMAGES (2D DIAGRAM AND REALISTIC) ---

   17. zambezi-river-basin-map.png
       A detailed map of the Zambezi River Basin showing the eight countries (Zambia, Angola, Namibia, Botswana, Zimbabwe, Mozambique, Malawi, Tanzania), major tributaries, and key features (Kariba Dam, Cahora Bassa Dam, Victoria Falls, Lake Malawi, Lake Kariba).

   18. zambezi-water-management.png
       A 2D diagram showing water resource management in the Zambezi Basin: dams (Kariba, Cahora Bassa), irrigation schemes, and water sharing agreements (ZAMCOM).
       Show the flow of water and management structures.

   19. zambezi-land-forest-conservation.png
       A realistic photograph showing forest conservation and protected areas in the Zambezi Basin: Hwange National Park, Mana Pools, or reforestation projects.
       Show healthy forest and wildlife.

   20. zambezi-wildlife-conservation.png
       A realistic photograph showing wildlife conservation in the Zambezi Basin: elephants, anti-poaching patrols, and community involvement (CBNRM).
       Show community members and rangers working together.

   21. zambezi-sustainable-tourism.png
       A realistic photograph of Victoria Falls and eco-tourism activities in the Zambezi Basin.
       Show tourists, boats, and wildlife viewing.

   22. zambezi-conservation-summary.png
       A 2D diagram summarising integrated conservation in the Zambezi Basin: water management, land conservation, wildlife protection, and sustainable tourism.
       Use four sections with icons and brief explanations.

   ============================================================ */
