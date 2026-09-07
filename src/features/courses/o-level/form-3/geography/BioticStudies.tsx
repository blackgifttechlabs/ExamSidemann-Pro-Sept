import React, { useState, useRef } from 'react';

/**
 * Topic: Biotic Studies – Geography
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const BioticStudies: React.FC = () => {
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
      id: 'factors-vegetation',
      title: 'Factors Influencing Vegetation Growth',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Inter-relationship of Climate, Soil and Vegetation">
            <p>
              <strong>Definition:</strong> Vegetation zones are large areas of the Earth's
              surface that have similar plant communities. These zones are determined by
              the inter-relationship between climate, soil, and vegetation itself.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">The Climate-Soil-Vegetation Relationship</h4>
            <p>
              Climate, soil, and vegetation are closely linked. Changes in one factor
              affect the others. This relationship creates the different vegetation zones
              found around the world.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Climate affects soil:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Temperature:</strong> High temperatures speed up chemical
                    weathering, creating deep, weathered soils (e.g., tropical soils).
                    Low temperatures slow down soil formation (e.g., polar soils).
                  </li>
                  <li>
                    <strong>Rainfall:</strong> High rainfall leads to leaching (washing
                    away of nutrients), creating acidic soils. Low rainfall leads to
                    thin, dry soils (e.g., desert soils).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Soil affects vegetation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Nutrient content:</strong> Fertile soils (e.g., volcanic soils,
                    alluvial soils) support dense vegetation. Poor soils (e.g., sandy
                    soils, lateritic soils) support sparse vegetation.
                  </li>
                  <li>
                    <strong>Water holding capacity:</strong> Soils that hold water well
                    (clay soils) support more vegetation than sandy soils that drain quickly.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Vegetation affects soil:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Organic matter:</strong> Plants add organic matter to the soil
                    (leaf litter, roots), which improves soil fertility.
                  </li>
                  <li>
                    <strong>Soil protection:</strong> Plant roots hold the soil together,
                    preventing erosion. Forests protect the soil from rain and wind.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="climate-soil-vegetation-relationship.png"
              alt="A 2D diagram showing the inter-relationship between climate, soil, and vegetation in forming vegetation zones"
              caption="The inter-relationship between climate, soil, and vegetation in forming vegetation zones."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">How This Creates Vegetation Zones</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Tropical rainforest:</strong> High rainfall, high temperatures →
                deep, weathered soils → dense, evergreen vegetation.
              </li>
              <li>
                <strong>Savanna (tropical grassland):</strong> Seasonal rainfall (wet/dry),
                high temperatures → moderate soils → grassland with scattered trees.
              </li>
              <li>
                <strong>Desert:</strong> Very low rainfall, high temperatures → thin,
                dry soils → sparse, drought-resistant vegetation.
              </li>
              <li>
                <strong>Temperate forest:</strong> Moderate rainfall, seasonal temperatures
                → fertile soils → deciduous and mixed forests.
              </li>
              <li>
                <strong>Tundra:</strong> Cold temperatures, low rainfall → thin, frozen
                soils (permafrost) → mosses, lichens, and small shrubs.
              </li>
            </ul>

            <GeographyImage
              fileName="world-vegetation-zones-map.png"
              alt="A world map showing the major vegetation zones: tropical rainforest, savanna, desert, temperate forest, and tundra"
              caption="Major vegetation zones of the world: tropical rainforest, savanna, desert, temperate forest, and tundra."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Vegetation zone:</strong> area with similar plant communities</li>
            <li><strong>Climate:</strong> temperature and rainfall patterns</li>
            <li><strong>Soil:</strong> the top layer of the Earth's surface</li>
            <li><strong>Leaching:</strong> washing away of nutrients from soil</li>
            <li><strong>Inter-relationship:</strong> how factors affect each other</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'ecosystems',
      title: 'Ecosystems',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Structure, Inputs and Outputs of Ecosystems">
            <p>
              <strong>Definition:</strong> An ecosystem is a community of living organisms
              (plants, animals, microorganisms) interacting with each other and with their
              non-living environment (soil, water, air, climate).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Structure of an Ecosystem</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Abiotic (non-living) components:</strong> Climate, soil, water,
                sunlight, oxygen, minerals.
              </li>
              <li>
                <strong>Biotic (living) components:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Producers (autotrophs):</strong> Plants and algae that produce
                    their own food through photosynthesis.
                  </li>
                  <li>
                    <strong>Consumers (heterotrophs):</strong> Animals that eat other
                    organisms. Includes herbivores (plant-eaters), carnivores (meat-eaters),
                    and omnivores (both).
                  </li>
                  <li>
                    <strong>Decomposers:</strong> Bacteria and fungi that break down dead
                    organic matter, returning nutrients to the soil.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Inputs and Outputs</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Energy from the sun (solar radiation), water
                (precipitation), carbon dioxide, oxygen, nutrients from weathering.
              </li>
              <li>
                <strong>Outputs:</strong> Heat (radiated back), oxygen (from photosynthesis),
                water (evapotranspiration), nutrients lost through leaching or erosion.
              </li>
            </ul>

            <GeographyImage
              fileName="ecosystem-structure-inputs-outputs.png"
              alt="A 2D diagram showing the structure of an ecosystem with inputs (sun, water, CO2) and outputs (oxygen, heat, water vapour)"
              caption="Ecosystem structure: inputs, outputs, and the flow of energy and nutrients."
            />
          </SubtopicCard>

          <SubtopicCard title="Savanna Ecosystem">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Characteristics</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Tropical areas with seasonal rainfall (wet and dry seasons).
              </li>
              <li>
                <strong>Climate:</strong> Warm to hot temperatures all year. Rainfall is
                seasonal (500-1500mm per year).
              </li>
              <li>
                <strong>Vegetation:</strong> Grassland with scattered trees and shrubs.
                Trees are often drought-resistant (e.g., baobab, acacia).
              </li>
              <li>
                <strong>Animals:</strong> Large herbivores (zebras, wildebeest, elephants,
                giraffes) and carnivores (lions, leopards, cheetahs, hyenas).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Structure</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Producers:</strong> Grasses, shrubs, and trees (acacia, baobab).
              </li>
              <li>
                <strong>Consumers:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Primary consumers: Herbivores (zebras, wildebeest, antelopes).</li>
                  <li>Secondary consumers: Carnivores (lions, hyenas).</li>
                  <li>Tertiary consumers: Top predators (lions, leopards).</li>
                </ul>
              </li>
              <li>
                <strong>Decomposers:</strong> Bacteria, fungi, termites, dung beetles.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Inputs and Outputs</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Solar energy, seasonal rainfall, nutrients from
                rock weathering.
              </li>
              <li>
                <strong>Outputs:</strong> Heat, oxygen, water vapour, nutrients lost
                through fire and erosion.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ecological Balance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The state of equilibrium in an ecosystem where
                populations are stable and resources are sustainable.
              </li>
              <li>
                <strong>In savanna:</strong> The balance between herbivores and vegetation
                is maintained by predators, fire, and seasonal drought.
              </li>
              <li>
                <strong>Threats:</strong> Overgrazing, poaching, drought, and habitat loss
                disrupt the ecological balance.
              </li>
            </ul>

            <GeographyImage
              fileName="savanna-ecosystem-diagram.png"
              alt="A 2D diagram showing the savanna ecosystem with producers (grasses, trees), consumers (herbivores, carnivores), and decomposers"
              caption="Savanna ecosystem: structure, inputs, outputs, and ecological balance."
            />

            <GeographyImage
              fileName="savanna-ecosystem-realistic.png"
              alt="A realistic photograph of an African savanna landscape showing grassland, acacia trees, and wildlife (zebras, wildebeest)"
              caption="African savanna ecosystem: grassland, scattered trees, and wildlife."
            />
          </SubtopicCard>

          <SubtopicCard title="Equatorial (Tropical Rainforest) Ecosystem">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Characteristics</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Near the equator (e.g., Congo Basin, Amazon,
                South-East Asia).
              </li>
              <li>
                <strong>Climate:</strong> Hot and wet all year. High rainfall (over 2000mm
                per year) and high temperatures (25-30°C).
              </li>
              <li>
                <strong>Vegetation:</strong> Dense, evergreen forest with multiple layers
                (emergent, canopy, understory, forest floor). High biodiversity.
              </li>
              <li>
                <strong>Animals:</strong> High diversity of insects, birds, primates,
                reptiles, and mammals (gorillas, monkeys, parrots, snakes, tigers).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Structure</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Producers:</strong> Tall trees, lianas, epiphytes (orchids, ferns),
                and understory plants.
              </li>
              <li>
                <strong>Consumers:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Primary consumers: Herbivores (monkeys, sloths, insects).</li>
                  <li>Secondary consumers: Carnivores (snakes, birds of prey, jaguars).</li>
                  <li>Tertiary consumers: Top predators (jaguars, eagles).</li>
                </ul>
              </li>
              <li>
                <strong>Decomposers:</strong> Bacteria, fungi, insects, and other organisms
                that break down organic matter rapidly in the warm, wet conditions.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Inputs and Outputs</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> High solar energy, abundant rainfall, high
                temperatures, carbon dioxide.
              </li>
              <li>
                <strong>Outputs:</strong> High oxygen production, water vapour, nutrients
                rapidly cycled through the ecosystem.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ecological Balance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>In tropical rainforest:</strong> The balance is maintained by the
                rapid cycling of nutrients. Most nutrients are stored in the vegetation,
                not the soil.
              </li>
              <li>
                <strong>Threats:</strong> Deforestation, logging, mining, and climate
                change disrupt the ecological balance.
              </li>
            </ul>

            <GeographyImage
              fileName="tropical-rainforest-ecosystem-diagram.png"
              alt="A 2D diagram showing the tropical rainforest ecosystem with layers (emergent, canopy, understory, forest floor) and nutrient cycling"
              caption="Tropical rainforest ecosystem: structure, inputs, outputs, and nutrient cycling."
            />

            <GeographyImage
              fileName="tropical-rainforest-realistic.png"
              alt="A realistic photograph of a tropical rainforest showing dense vegetation, tall trees, and biodiversity"
              caption="Tropical rainforest: dense vegetation, high biodiversity, and multiple layers."
            />
          </SubtopicCard>

          <SubtopicCard title="Hot Desert Ecosystem">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Characteristics</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Subtropical high-pressure belts (e.g., Sahara,
                Kalahari, Namib, Arabian, Australian deserts).
              </li>
              <li>
                <strong>Climate:</strong> Very dry (less than 250mm rainfall per year),
                high temperatures during the day, cold at night.
              </li>
              <li>
                <strong>Vegetation:</strong> Very sparse, drought-resistant plants
                (cacti, succulents, thorny shrubs, ephemerals).
              </li>
              <li>
                <strong>Animals:</strong> Adapted to conserve water and tolerate heat
                (camels, lizards, snakes, scorpions, insects, small mammals).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Structure</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Producers:</strong> Sparse vegetation (cacti, succulents, drought-resistant shrubs).
              </li>
              <li>
                <strong>Consumers:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Primary consumers: Herbivores (camels, antelopes, insects).</li>
                  <li>Secondary consumers: Carnivores (snakes, lizards, foxes).</li>
                  <li>Tertiary consumers: Top predators (foxes, birds of prey).</li>
                </ul>
              </li>
              <li>
                <strong>Decomposers:</strong> Bacteria and fungi that are active during
                rare wet periods.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Inputs and Outputs</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Solar energy, very little rainfall, occasional
                dust and nutrients from wind.
              </li>
              <li>
                <strong>Outputs:</strong> Heat, very little water vapour, nutrients
                lost through wind erosion.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ecological Balance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>In hot deserts:</strong> The balance is fragile due to limited
                resources. Organisms are highly adapted to survive with minimal water.
              </li>
              <li>
                <strong>Threats:</strong> Desertification, overgrazing, climate change,
                water extraction, and mining disrupt the ecological balance.
              </li>
            </ul>

            <GeographyImage
              fileName="hot-desert-ecosystem-diagram.png"
              alt="A 2D diagram showing the hot desert ecosystem with sparse vegetation, adapted animals, and limited inputs and outputs"
              caption="Hot desert ecosystem: structure, inputs, outputs, and ecological balance."
            />

            <GeographyImage
              fileName="hot-desert-realistic.png"
              alt="A realistic photograph of a hot desert landscape showing sand dunes, sparse vegetation, and desert-adapted animals"
              caption="Hot desert landscape: sand dunes, sparse vegetation, and desert-adapted wildlife."
            />
          </SubtopicCard>

          <SubtopicCard title="Concept of Ecological Balance">
            <p>
              <strong>Definition:</strong> Ecological balance is the state of equilibrium
              in an ecosystem where the populations of different species remain stable
              and the resources (food, water, space) are used sustainably.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">How Balance is Maintained</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Predator-prey relationships:</strong> Predators control the
                population of prey species, preventing overpopulation and resource depletion.
              </li>
              <li>
                <strong>Competition:</strong> Species compete for resources, which
                maintains a balance between different populations.
              </li>
              <li>
                <strong>Nutrient cycling:</strong> Nutrients are recycled through the
                ecosystem, ensuring they are available for plant growth.
              </li>
              <li>
                <strong>Succession:</strong> Ecosystems change over time through natural
                succession, eventually reaching a stable climax community.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">When Balance is Disrupted</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Natural causes:</strong> Drought, floods, volcanic eruptions,
                fires, disease.
              </li>
              <li>
                <strong>Human causes:</strong> Deforestation, overgrazing, pollution,
                climate change, introduction of invasive species.
              </li>
              <li>
                <strong>Effects:</strong> Loss of biodiversity, soil erosion, desertification,
                collapse of food webs, extinction of species.
              </li>
            </ul>

            <GeographyImage
              fileName="ecological-balance-disruption.png"
              alt="A 2D diagram showing ecological balance and the factors that disrupt it: deforestation, overgrazing, pollution, and climate change"
              caption="Ecological balance: how balance is maintained and disrupted."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Ecosystem Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Savanna:</strong> seasonal rainfall, grassland, large herbivores</li>
            <li><strong>Rainforest:</strong> hot/wet, dense forest, high biodiversity</li>
            <li><strong>Desert:</strong> very dry, sparse, adapted species</li>
            <li><strong>Ecological balance:</strong> equilibrium, predator-prey, nutrients</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'people-ecosystems',
      title: 'People and Ecosystems',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Role of People in Changing Ecosystems">
            <p>
              <strong>Definition:</strong> Human activities have a significant impact
              on ecosystems. These impacts can be constructive (positive) or destructive
              (negative).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Constructive (Positive) Human Activities</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Reforestation and afforestation:</strong> Planting trees to
                restore forests, prevent erosion, and absorb CO₂.
              </li>
              <li>
                <strong>Conservation and protected areas:</strong> Establishing national
                parks, wildlife reserves, and marine protected areas to preserve biodiversity.
              </li>
              <li>
                <strong>Sustainable agriculture:</strong> Using techniques like crop
                rotation, contour ploughing, and organic farming to protect soil and water.
              </li>
              <li>
                <strong>Environmental education:</strong> Teaching people about the
                importance of ecosystems and how to protect them.
              </li>
              <li>
                <strong>Habitat restoration:</strong> Restoring degraded ecosystems
                (e.g., wetland restoration, river rehabilitation).
              </li>
              <li>
                <strong>Wildlife protection:</strong> Anti-poaching efforts, breeding
                programmes, and protection of endangered species.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Destructive (Negative) Human Activities</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Deforestation:</strong> Clearing forests for agriculture,
                logging, and development. Leads to habitat loss, soil erosion, and
                climate change.
              </li>
              <li>
                <strong>Overgrazing:</strong> Too many livestock eating all the vegetation,
                leading to soil erosion and desertification.
              </li>
              <li>
                <strong>Pollution:</strong> Contaminating air, water, and soil with
                chemicals, waste, and plastics. Harms plants and animals.
              </li>
              <li>
                <strong>Overfishing and poaching:</strong> Unsustainable hunting and
                fishing deplete wildlife populations.
              </li>
              <li>
                <strong>Urbanisation:</strong> Expanding cities destroy habitats and
                replace natural ecosystems with concrete.
              </li>
              <li>
                <strong>Climate change:</strong> Burning fossil fuels increases CO₂
                emissions, causing global warming and ecosystem disruption.
              </li>
            </ul>

            <GeographyImage
              fileName="human-impact-ecosystems.png"
              alt="A split 2D diagram showing constructive (reforestation, conservation) and destructive (deforestation, pollution) human impacts on ecosystems"
              caption="Human impacts on ecosystems: constructive and destructive activities."
            />
          </SubtopicCard>

          <SubtopicCard title="Case Study: Deforestation in Tropical Rainforests">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              <strong>Deforestation</strong> is the permanent removal of forests,
              especially in tropical rainforests. It is one of the most serious
              environmental problems in the world.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes of Deforestation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Commercial logging:</strong> Cutting down trees for timber
                (hardwoods like mahogany, teak) and pulp for paper.
              </li>
              <li>
                <strong>Agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Shifting cultivation (slash and burn):</strong> Farmers
                    clear forest, farm for a few years, then move on.
                  </li>
                  <li>
                    <strong>Commercial agriculture:</strong> Large-scale farming of
                    crops like soybeans, palm oil, and cattle ranching.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Mining:</strong> Clearing forest for mining operations (gold,
                diamonds, oil, minerals).
              </li>
              <li>
                <strong>Infrastructure development:</strong> Building roads, dams,
                and cities in forest areas.
              </li>
              <li>
                <strong>Population pressure:</strong> Growing populations need more
                land for farming and settlement.
              </li>
            </ul>

            <GeographyImage
              fileName="deforestation-causes-diagram.png"
              alt="A 2D diagram showing the causes of deforestation: logging, agriculture, mining, infrastructure, and population pressure"
              caption="Causes of deforestation in tropical rainforests."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods of Deforestation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Slash and burn:</strong> Cutting down trees and burning the
                remaining vegetation. The ash provides nutrients for crops.
              </li>
              <li>
                <strong>Clear-cutting:</strong> Removing all trees in an area, often
                using heavy machinery.
              </li>
              <li>
                <strong>Selective logging:</strong> Removing only the most valuable
                trees, leaving the rest. Can still damage the forest.
              </li>
              <li>
                <strong>Road building:</strong> Opening up forests for access, which
                leads to further deforestation.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects of Deforestation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Environmental effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Biodiversity loss:</strong> Many species lose their habitat
                    and become extinct. Tropical rainforests contain over 50% of the
                    world's species.
                  </li>
                  <li>
                    <strong>Climate change:</strong> Forests absorb CO₂. Deforestation
                    releases this carbon, contributing to global warming.
                  </li>
                  <li>
                    <strong>Soil erosion:</strong> Without tree roots to hold the soil,
                    it is washed away by rain.
                  </li>
                  <li>
                    <strong>Disruption of water cycle:</strong> Forests release water
                    vapour. Deforestation reduces rainfall in the region.
                  </li>
                  <li>
                    <strong>Flooding:</strong> Forests absorb water. Deforestation
                    increases runoff and flooding.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Social effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Loss of livelihoods:</strong> Indigenous peoples and forest
                    communities lose their homes and way of life.
                  </li>
                  <li>
                    <strong>Conflict:</strong> Land disputes arise as people compete
                    for cleared land.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="deforestation-effects-diagram.png"
              alt="A 2D diagram showing the effects of deforestation: biodiversity loss, climate change, soil erosion, flooding, and social impacts"
              caption="Effects of deforestation on the environment and society."
            />

            <GeographyImage
              fileName="deforestation-realistic.png"
              alt="A realistic photograph showing a deforested area in the Amazon or Congo Basin with cleared land and smoke from fires"
              caption="Deforestation in a tropical rainforest: cleared land and burning vegetation."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Solutions and Management</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Protected areas:</strong> Establishing national parks and
                nature reserves to protect remaining forests.
              </li>
              <li>
                <strong>Sustainable logging:</strong> Harvesting trees in a way that
                allows the forest to regenerate.
              </li>
              <li>
                <strong>Reforestation:</strong> Planting trees to restore deforested areas.
              </li>
              <li>
                <strong>Agroforestry:</strong> Integrating trees into farming systems
                to provide shade, soil protection, and income.
              </li>
              <li>
                <strong>Alternative livelihoods:</strong> Providing other income
                sources for forest communities to reduce dependence on logging.
              </li>
              <li>
                <strong>International agreements:</strong> Treaties like the Paris
                Agreement and REDD+ (Reducing Emissions from Deforestation and Forest Degradation).
              </li>
            </ul>

            <GeographyImage
              fileName="deforestation-solutions-diagram.png"
              alt="A 2D diagram showing solutions to deforestation: protected areas, sustainable logging, reforestation, agroforestry, and international agreements"
              caption="Solutions to deforestation: management and conservation measures."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Zimbabwe Example</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Zimbabwe has tropical and subtropical forests
                in the Eastern Highlands and along the Zambezi Valley.
              </li>
              <li>
                <strong>Causes:</strong> Deforestation in Zimbabwe is caused by
                agriculture, firewood collection, tobacco curing, and settlement expansion.
              </li>
              <li>
                <strong>Effects:</strong> Soil erosion, reduced rainfall, loss of
                biodiversity, and reduced agricultural productivity.
              </li>
              <li>
                <strong>Management:</strong> The Forestry Commission promotes
                reforestation, sustainable forestry, and community-based natural
                resource management.
              </li>
            </ul>

            <GeographyImage
              fileName="zimbabwe-deforestation-case-study.png"
              alt="A realistic photograph of deforestation in Zimbabwe showing cleared land, soil erosion, and reforestation efforts"
              caption="Deforestation in Zimbabwe: causes, effects, and management."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">People &amp; Ecosystems</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Constructive:</strong> reforestation, conservation, education</li>
            <li><strong>Destructive:</strong> deforestation, overgrazing, pollution</li>
            <li><strong>Deforestation:</strong> logging, agriculture, mining</li>
            <li><strong>Effects:</strong> biodiversity loss, climate change, soil erosion</li>
            <li><strong>Solutions:</strong> protected areas, sustainable logging, reforestation</li>
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
            Biotic Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the factors influencing vegetation growth, ecosystem structure and
            function, and the role of people in changing ecosystems. Study savanna,
            tropical rainforest, and hot desert ecosystems, and examine human impacts
            like deforestation.
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
                  <strong className="text-white">Factors Influencing Vegetation:</strong> Climate,
                  soil, and vegetation are inter-related. Changes in one affect the others,
                  creating different vegetation zones (rainforest, savanna, desert, tundra).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Ecosystems:</strong> Savanna (seasonal
                  rainfall, grassland, large herbivores), Tropical Rainforest (hot/wet,
                  dense forest, high biodiversity), and Hot Desert (very dry, sparse,
                  adapted species) each have unique structures, inputs, and outputs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Ecological Balance:</strong> Equilibrium
                  maintained by predator-prey relationships, competition, and nutrient
                  cycling. Disrupted by human activities like deforestation and pollution.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">People and Ecosystems:</strong> Humans
                  have constructive (reforestation, conservation) and destructive
                  (deforestation, pollution) impacts on ecosystems.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Deforestation Case Study:</strong>
                  Caused by logging, agriculture, and mining. Effects include biodiversity
                  loss, climate change, and soil erosion. Solutions include protected
                  areas, sustainable logging, and reforestation.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Biotic Studies topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">Population Studies</span>?</>
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
                alert('Proceed to Population Studies (next topic)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Population Studies →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BioticStudies;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/geography/
   Use a mix of 2D diagram style and realistic photographs.

   --- FACTORS INFLUENCING VEGETATION IMAGES (2D DIAGRAM STYLE) ---

   1. climate-soil-vegetation-relationship.png
      A 2D diagram showing the inter-relationship between climate, soil, and vegetation.
      Show arrows connecting the three factors with explanations:
      - Climate affects soil (temperature, rainfall)
      - Soil affects vegetation (nutrients, water)
      - Vegetation affects soil (organic matter, protection)
      Include labels and brief explanations for each arrow.

   2. world-vegetation-zones-map.png
      A world map showing the major vegetation zones:
      - Tropical rainforest (dark green) near the equator
      - Savanna (yellow/green) in tropical areas
      - Desert (brown) in subtropical belts
      - Temperate forest (green) in mid-latitudes
      - Tundra (light blue/white) near the poles
      Use different colours and include a legend.

   --- ECOSYSTEM IMAGES (2D DIAGRAM AND REALISTIC) ---

   3. ecosystem-structure-inputs-outputs.png
      A 2D diagram showing the structure of an ecosystem.
      Show inputs (sun, water, CO₂, nutrients) entering the ecosystem.
      Show producers, consumers, and decomposers.
      Show outputs (oxygen, heat, water vapour, nutrients lost).
      Include arrows showing the flow of energy and nutrients.

   4. savanna-ecosystem-diagram.png
      A 2D diagram showing the savanna ecosystem.
      Show producers (grasses, acacia trees), consumers (zebras, wildebeest, lions, hyenas),
      and decomposers (bacteria, fungi, termites).
      Show inputs (sun, seasonal rain) and outputs (heat, oxygen, fire).
      Include labels for each component.

   5. savanna-ecosystem-realistic.png
      A realistic photograph of an African savanna landscape.
      Show grassland, scattered acacia trees, and wildlife (zebras, wildebeest, or elephants).
      Show a typical savanna scene with a blue sky and golden grass.

   6. tropical-rainforest-ecosystem-diagram.png
      A 2D diagram showing the tropical rainforest ecosystem.
      Show the four layers: emergent, canopy, understory, forest floor.
      Show producers (tall trees, lianas, epiphytes), consumers (monkeys, birds, snakes),
      and decomposers (bacteria, fungi).
      Show nutrient cycling (rapid decomposition, nutrients stored in vegetation).
      Include labels for each layer and component.

   7. tropical-rainforest-realistic.png
      A realistic photograph of a tropical rainforest.
      Show dense vegetation, multiple layers, tall trees, and biodiversity.
      Show the typical lush green environment with vines and epiphytes.

   8. hot-desert-ecosystem-diagram.png
      A 2D diagram showing the hot desert ecosystem.
      Show producers (cacti, succulents), consumers (camels, lizards, snakes),
      and decomposers.
      Show sparse vegetation, limited inputs (sun, little rain), and outputs (heat, wind erosion).
      Include labels for each component.

   9. hot-desert-realistic.png
      A realistic photograph of a hot desert landscape.
      Show sand dunes, rocky outcrops, sparse vegetation, and desert-adapted animals
      (camels or lizards).

   10. ecological-balance-disruption.png
       A 2D diagram showing ecological balance and disruption.
       Show a balanced ecosystem on one side with stable populations and nutrient cycling.
       Show a disrupted ecosystem on the other side with deforestation, overgrazing,
       and species extinction.
       Include labels: "Ecological Balance", "Disruption", "Causes", "Effects".

   --- PEOPLE AND ECOSYSTEMS IMAGES (2D DIAGRAM AND REALISTIC) ---

   11. human-impact-ecosystems.png
       A split 2D diagram showing constructive and destructive human impacts.
       Left side: constructive (reforestation, conservation, sustainable agriculture).
       Right side: destructive (deforestation, pollution, overgrazing, urbanisation).
       Include labels for each activity.

   12. deforestation-causes-diagram.png
       A 2D diagram showing the causes of deforestation.
       Show five main causes: commercial logging, agriculture (slash and burn, commercial),
       mining, infrastructure development, and population pressure.
       Include a visual for each cause and brief explanations.

   13. deforestation-effects-diagram.png
       A 2D diagram showing the effects of deforestation.
       Show environmental effects: biodiversity loss, climate change, soil erosion,
       disruption of water cycle, flooding.
       Show social effects: loss of livelihoods, conflict.
       Include labels and brief explanations.

   14. deforestation-realistic.png
       A realistic photograph showing deforestation in a tropical rainforest.
       Show cleared land, burning vegetation, smoke, and logging equipment.
       Show the contrast between standing forest and cleared land.

   15. deforestation-solutions-diagram.png
       A 2D diagram showing solutions to deforestation.
       Show: protected areas, sustainable logging, reforestation, agroforestry,
       alternative livelihoods, and international agreements.
       Include labels and brief explanations for each solution.

   16. zimbabwe-deforestation-case-study.png
       A realistic photograph showing deforestation in Zimbabwe.
       Show cleared land, soil erosion, and perhaps reforestation efforts.
       Could show a scene in the Eastern Highlands or along the Zambezi Valley.

   ============================================================ */