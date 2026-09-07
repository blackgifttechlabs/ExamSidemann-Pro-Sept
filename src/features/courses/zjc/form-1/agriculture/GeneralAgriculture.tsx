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
    // The lesson outline was authored with .png names, while the optimized
    // assets in public/images/agriculture are stored as .jpg files.
    const resolvedFileName = fileName.replace(/\.(png|jpeg|webp)$/i, '.jpg');

    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        {isMissing ? (
          <div className="flex aspect-video flex-col items-center justify-center bg-slate-100 px-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-600">
              Image ready to add
            </p>
            <code className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
              {resolvedFileName}
            </code>
            <p className="mt-3 text-xs text-slate-500">
              Place this file in <strong>public/images/agriculture/</strong>
            </p>
          </div>
        ) : (
          <img
            src={`/images/agriculture/${resolvedFileName}`}
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
      id: 'introduction-agriculture',
      title: 'Introduction to Agriculture and Land Use',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Agriculture">
            <p>
              <strong>Definition:</strong> Agriculture is the science, art, and practice
              of cultivating the soil, growing crops, and raising animals for food,
              fibre, medicine, and other products used to sustain and enhance human life.
            </p>
            <p>
              Agriculture is one of the oldest and most important human activities.
              It is the foundation of civilisation and provides the food and raw materials
              that people need to survive. Agriculture also provides employment,
              generates income, and supports rural livelihoods.
            </p>

            <AgricultureImage
              fileName="agriculture-overview.png"
              alt="A 2D diagram showing the scope of agriculture: crop farming, livestock rearing, forestry, and wildlife management"
              caption="The scope of agriculture: crop farming, livestock rearing, forestry, and wildlife management."
            />
          </SubtopicCard>

          <SubtopicCard title="Branches of Agriculture">
            <p>
              Agriculture is a broad field with many specialised branches.
              Each branch focuses on a different aspect of agricultural production
              and management. Understanding these branches helps us appreciate the
              diversity and importance of agriculture.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Crop Husbandry:</strong> The cultivation of crops for food,
                fibre, and other products. It includes growing cereals (maize, wheat,
                sorghum), legumes (beans, groundnuts), oilseeds (soybeans, sunflower),
                vegetables, and fruits.
              </li>
              <li>
                <strong>Animal Husbandry:</strong> The breeding and rearing of animals
                for food (meat, milk, eggs), fibre (wool), and other products (hides,
                manure). It includes cattle, goats, sheep, pigs, and poultry.
              </li>
              <li>
                <strong>Horticulture:</strong> The cultivation of fruits, vegetables,
                flowers, and ornamental plants. It includes market gardening, fruit
                production, floriculture, and landscaping.
              </li>
              <li>
                <strong>Soil Science:</strong> The study of soil as a natural resource,
                including its formation, classification, properties, and management.
                It is essential for sustainable crop production.
              </li>
              <li>
                <strong>Wildlife Management:</strong> The management of wild animals
                and their habitats for conservation, tourism, and sustainable use.
              </li>
              <li>
                <strong>Forestry:</strong> The management of forests and woodlands for
                timber, fuelwood, and environmental benefits.
              </li>
              <li>
                <strong>Agricultural Engineering:</strong> The application of engineering
                principles to agriculture, including the design and use of farm machinery,
                irrigation systems, and storage facilities.
              </li>
              <li>
                <strong>Agribusiness:</strong> The business side of agriculture,
                including the production, processing, marketing, and distribution of
                agricultural products. It involves business management, finance, and
                entrepreneurship.
              </li>
            </ul>

            <AgricultureImage
              fileName="branches-agriculture.png"
              alt="A 2D diagram showing the branches of agriculture: Crop Husbandry, Animal Husbandry, Horticulture, Soil Science, Wildlife Management, Forestry, Agricultural Engineering, and Agribusiness"
              caption="The branches of agriculture: crop husbandry, animal husbandry, horticulture, soil science, wildlife management, forestry, agricultural engineering, and agribusiness."
            />
          </SubtopicCard>

          <SubtopicCard title="Importance of Agriculture">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Social Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Food security:</strong> Agriculture provides the food that
                people need to live and stay healthy. Without agriculture, there would
                be no food.
              </li>
              <li>
                <strong>Employment:</strong> Agriculture provides employment for
                millions of people around the world, especially in rural areas.
              </li>
              <li>
                <strong>Rural livelihoods:</strong> Agriculture supports rural communities
                by providing income, food, and a way of life.
              </li>
              <li>
                <strong>Cultural heritage:</strong> Agriculture is deeply connected to
                culture and traditions. Many festivals, customs, and practices are
                linked to farming.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Economic Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Contribution to GDP:</strong> Agriculture is a significant
                contributor to the Gross Domestic Product (GDP) of many countries,
                especially in Africa.
              </li>
              <li>
                <strong>Export earnings:</strong> Agricultural products like tobacco,
                sugar, coffee, tea, and cotton are important exports for many countries.
              </li>
              <li>
                <strong>Linkages to other sectors:</strong> Agriculture supports other
                industries, including food processing, transport, and retail.
              </li>
              <li>
                <strong>Poverty reduction:</strong> Agriculture provides income and
                employment, helping to reduce poverty in rural areas.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ecological Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Ecosystem services:</strong> Agriculture can provide ecosystem
                services like soil conservation, water purification, and carbon
                sequestration when managed sustainably.
              </li>
              <li>
                <strong>Biodiversity:</strong> Agriculture can support biodiversity
                through the conservation of crop varieties and livestock breeds.
              </li>
              <li>
                <strong>Land management:</strong> Agriculture is a major land use that
                shapes landscapes and affects the environment.
              </li>
              <li>
                <strong>Sustainability:</strong> Sustainable agriculture practices
                help to protect the environment and maintain the productivity of land
                for future generations.
              </li>
            </ul>

            <AgricultureImage
              fileName="agriculture-importance.png"
              alt="A 2D diagram showing the social, economic, and ecological importance of agriculture"
              caption="The social, economic, and ecological importance of agriculture."
            />
          </SubtopicCard>

          <SubtopicCard title="Career Opportunities in Agriculture">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Farming and production:</strong> Farmers, farm managers, crop
                production specialists, livestock managers, horticulturists.
              </li>
              <li>
                <strong>Agricultural science and research:</strong> Agronomists, soil
                scientists, plant breeders, animal scientists, entomologists,
                plant pathologists.
              </li>
              <li>
                <strong>Agricultural engineering:</strong> Agricultural engineers,
                irrigation specialists, farm machinery designers.
              </li>
              <li>
                <strong>Agribusiness:</strong> Agricultural economists, farm business
                managers, marketing specialists, supply chain managers, agricultural
                finance specialists.
              </li>
              <li>
                <strong>Extension and education:</strong> Agricultural extension
                officers, teachers, trainers, and educators.
              </li>
              <li>
                <strong>Environmental management:</strong> Conservationists, natural
                resource managers, environmental consultants.
              </li>
              <li>
                <strong>Wildlife and forestry:</strong> Wildlife managers, foresters,
                park rangers, ecologists.
              </li>
            </ul>

            <AgricultureImage
              fileName="agriculture-careers.png"
              alt="A 2D diagram showing career opportunities in agriculture: farming, research, engineering, agribusiness, extension, conservation, and wildlife management"
              caption="Career opportunities in agriculture: farming, research, engineering, agribusiness, extension, conservation, and wildlife management."
            />
          </SubtopicCard>

          <SubtopicCard title="Forms of Land Use">
            <p>
              <strong>Definition:</strong> Land use refers to the way land is used
              by people. Different types of land use are determined by the physical
              characteristics of the land, economic factors, and human needs.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Forestry:</strong> The management of forests and woodlands
                for timber, fuelwood, and environmental benefits. Forests are used
                for timber production, conservation, and recreation.
              </li>
              <li>
                <strong>Wildlife Management:</strong> The management of wild animals
                and their habitats for conservation, tourism, and sustainable use.
                This includes national parks, game reserves, and safari areas.
              </li>
              <li>
                <strong>Crop Husbandry:</strong> The cultivation of crops for food,
                fibre, and other products. This includes arable farming, market
                gardening, and plantation agriculture.
              </li>
              <li>
                <strong>Livestock Husbandry:</strong> The breeding and rearing of
                animals for food, fibre, and other products. This includes cattle
                ranching, dairy farming, and small-scale livestock production.
              </li>
              <li>
                <strong>Mixed Farming:</strong> A system that combines crop production
                and livestock rearing on the same farm. This is common in many parts
                of Zimbabwe.
              </li>
              <li>
                <strong>Urban and built-up land:</strong> Land used for cities,
                towns, villages, and infrastructure (roads, railways, airports).
              </li>
            </ul>

            <AgricultureImage
              fileName="land-use-forms.png"
              alt="A 2D diagram showing forms of land use: forestry, wildlife management, crop husbandry, livestock husbandry, mixed farming, and urban land"
              caption="Forms of land use: forestry, wildlife management, crop husbandry, livestock husbandry, mixed farming, and urban land."
            />
          </SubtopicCard>

          <SubtopicCard title="Factors Limiting Land Use">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Physical factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Climate:</strong> Temperature, rainfall, and sunlight
                    affect what crops can be grown and what animals can be raised.
                  </li>
                  <li>
                    <strong>Soil:</strong> Soil fertility, texture, depth, and drainage
                    affect land use. Poor soils limit agricultural production.
                  </li>
                  <li>
                    <strong>Relief:</strong> Steep slopes are difficult to farm and
                    are prone to soil erosion. Flat land is ideal for agriculture.
                  </li>
                  <li>
                    <strong>Water availability:</strong> Lack of water limits crop
                    production and livestock rearing. Irrigation can overcome this
                    but is expensive.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Economic factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Market access:</strong> Farms far from markets have higher
                    transport costs and may be less profitable.
                  </li>
                  <li>
                    <strong>Capital:</strong> Lack of capital limits investment in
                    inputs, machinery, and infrastructure.
                  </li>
                  <li>
                    <strong>Technology:</strong> Limited access to technology reduces
                    productivity and efficiency.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Social factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Land tenure:</strong> Insecure land rights discourage
                    investment and sustainable land management.
                  </li>
                  <li>
                    <strong>Population pressure:</strong> High population density
                    leads to land fragmentation and overuse of resources.
                  </li>
                  <li>
                    <strong>Skills and knowledge:</strong> Lack of agricultural skills
                    and knowledge reduces productivity.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Political factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Government policies:</strong> Policies on land use,
                    subsidies, and trade affect agricultural development.
                  </li>
                  <li>
                    <strong>Land reform:</strong> Land redistribution affects land
                    use and agricultural production.
                  </li>
                  <li>
                    <strong>Political stability:</strong> Political instability
                    disrupts agricultural production and investment.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="factors-limiting-land-use.png"
              alt="A 2D diagram showing factors limiting land use: physical (climate, soil, relief, water), economic (market access, capital, technology), social (land tenure, population, skills), and political (policies, land reform, stability)"
              caption="Factors limiting land use: physical, economic, social, and political factors."
            />
          </SubtopicCard>

          <SubtopicCard title="Protected Areas in Zimbabwe">
            <p>
              <strong>Definition:</strong> Protected areas are areas of land set aside
              for the conservation of wildlife, natural habitats, and cultural heritage.
              They are protected by law and managed for conservation, research, and tourism.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>National Parks:</strong> Areas of outstanding natural beauty
                and biodiversity, managed for conservation and tourism.
                <br />
                <strong>Examples:</strong> Hwange National Park (largest in Zimbabwe),
                Mana Pools National Park (UNESCO World Heritage Site), Gonarezhou
                National Park, Matopos National Park, Nyanga National Park.
              </li>
              <li>
                <strong>Game Reserves:</strong> Areas managed for wildlife conservation,
                often with limited tourism.
                <br />
                <strong>Examples:</strong> Mushandike Game Reserve, Chizarira Game Reserve.
              </li>
              <li>
                <strong>Safari Areas:</strong> Areas where wildlife viewing and
                hunting are managed sustainably.
                <br />
                <strong>Examples:</strong> Dande Safari Area, Chewore Safari Area.
              </li>
              <li>
                <strong>Botanical Reserves:</strong> Areas protected for the conservation
                of plant species and unique vegetation.
                <br />
                <strong>Examples:</strong> Victoria Falls Botanical Reserve.
              </li>
              <li>
                <strong>Forest Reserves:</strong> Areas managed for timber production
                and forest conservation.
                <br />
                <strong>Examples:</strong> Chikanga Forest Reserve, Zaka Forest Reserve.
              </li>
            </ul>

            <AgricultureImage
              fileName="protected-areas-zimbabwe-map.png"
              alt="A map of Zimbabwe showing protected areas: national parks, game reserves, safari areas, and forest reserves"
              caption="Protected areas in Zimbabwe: national parks, game reserves, safari areas, and forest reserves."
            />
          </SubtopicCard>

          <SubtopicCard title="Land Tenure Systems in Zimbabwe">
            <p>
              <strong>Definition:</strong> Land tenure refers to the system of rights
              and responsibilities that people have over land. It determines who can
              use the land, for how long, and under what conditions.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Freehold (Private) Tenure:</strong> Land is owned by an
                individual or company. The owner has full rights to use, sell, or
                lease the land. This is common in commercial farming areas.
              </li>
              <li>
                <strong>Leasehold Tenure:</strong> Land is leased from the government
                or a private owner for a specified period. The leaseholder has rights
                to use the land but does not own it. This is common in resettlement areas.
              </li>
              <li>
                <strong>Communal Tenure:</strong> Land is owned and managed by the
                community. Families have rights to use specific plots but cannot sell
                them. This is common in communal areas (Tribal Trust Lands).
              </li>
              <li>
                <strong>Resettlement Tenure:</strong> Land allocated to people through
                land reform programmes. This includes A1 (small-scale resettlement)
                and A2 (large-scale commercial resettlement) models.
              </li>
            </ul>

            <AgricultureImage
              fileName="land-tenure-zimbabwe.png"
              alt="A 2D diagram showing land tenure systems in Zimbabwe: freehold, leasehold, communal, and resettlement"
              caption="Land tenure systems in Zimbabwe: freehold, leasehold, communal, and resettlement."
            />
          </SubtopicCard>

          <SubtopicCard title="Land as National Heritage">
            <p>
              Land is a precious national heritage. It provides food, shelter, and
              livelihoods for the people. It is also the foundation of culture and
              identity. The history of land ownership in Zimbabwe reflects the country's
              colonial and post-colonial struggles.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Pre-Colonial Period</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Before colonisation, land was owned and managed by communities and
                chiefs. Land was a communal resource, with families having rights to
                use specific areas for farming and grazing.
              </li>
              <li>
                Land was not bought or sold. It was held in trust for the community
                by the chief, who allocated land to families.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Colonial Period</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                The arrival of European colonisers (British South Africa Company in 1890)
                led to the dispossession of African people from their land.
              </li>
              <li>
                The Land Apportionment Act of 1930 and the Land Tenure Act of 1969
                created a system of racial segregation in land ownership.
              </li>
              <li>
                The best agricultural land was reserved for white commercial farmers,
                while Africans were confined to communal areas (Tribal Trust Lands)
                and Native Purchase Areas.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects of Colonial Rule</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Land dispossession:</strong> African people lost their land
                and were forced to live in overcrowded communal areas.
              </li>
              <li>
                <strong>Poverty:</strong> The loss of land led to poverty, food
                insecurity, and lack of economic opportunities.
              </li>
              <li>
                <strong>Social disruption:</strong> People were displaced from their
                ancestral land, leading to loss of culture and identity.
              </li>
              <li>
                <strong>Inequality:</strong> A system of racial inequality was
                established, with white farmers owning the best land.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Post-Independence Land Reform</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                After independence in 1980, the government of Zimbabwe began land
                reform to redistribute land to the majority of the population.
              </li>
              <li>
                <strong>Third Chimurenga/Umvukela (Fast-Track Land Reform Programme,
                2000-2003):</strong> A land reform programme that involved the
                compulsory acquisition of land from commercial farmers for resettlement.
              </li>
              <li>
                <strong>Rationale:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>To correct the colonial injustices of land dispossession.</li>
                  <li>To redistribute land to the landless and poor.</li>
                  <li>To increase agricultural production and food security.</li>
                  <li>To empower the majority of the population economically.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">A1 and A2 Resettlement Models</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>A1 Model:</strong> Small-scale resettlement for subsistence
                farming. Families are allocated plots of land (5-20 hectares) for
                crop production and livestock rearing. This model aims to provide
                land for the landless and poor.
              </li>
              <li>
                <strong>A2 Model:</strong> Large-scale commercial resettlement for
                commercial farming. Farmers are allocated larger plots (20-100+
                hectares) for commercial crop production and livestock rearing.
                This model aims to create a new class of commercial farmers.
              </li>
            </ul>

            <AgricultureImage
              fileName="land-reform-zimbabwe.png"
              alt="A 2D diagram showing the history of land reform in Zimbabwe: pre-colonial, colonial, post-independence, and the A1/A2 resettlement models"
              caption="Land as national heritage: pre-colonial, colonial, post-independence, and the A1/A2 resettlement models."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Agriculture:</strong> cultivation of soil, crops, and animals</li>
            <li><strong>Branches:</strong> crop husbandry, animal husbandry, horticulture, soil science, wildlife, forestry, engineering, agribusiness</li>
            <li><strong>Land use:</strong> forestry, wildlife, crop, livestock, mixed, urban</li>
            <li><strong>Land tenure:</strong> freehold, leasehold, communal, resettlement</li>
            <li><strong>Land reform:</strong> A1 (small-scale), A2 (commercial)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'environmental-factors',
      title: 'Environmental Factors',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Environmental Factors Affecting Agriculture">
            <p>
              <strong>Definition:</strong> Environmental factors are the physical
              conditions that affect the growth and development of plants and animals.
              These factors include wind, light, temperature, rainfall, and humidity.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Wind</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Wind is the movement of air across the
                Earth's surface. It is caused by differences in air pressure.
              </li>
              <li>
                <strong>Effects on agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Positive effects:</strong> Wind helps to pollinate crops,
                    spreads seeds, and reduces humidity (which can reduce disease).
                  </li>
                  <li>
                    <strong>Negative effects:</strong> Strong winds can damage crops
                    (lodging), cause soil erosion, and increase transpiration (water loss).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Mitigation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Planting windbreaks (trees, hedges) to reduce wind speed.</li>
                  <li>Growing crops that are resistant to wind damage.</li>
                  <li>Using staking and trellising for tall crops.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Light (Sunlight)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Light is the energy from the sun that is
                essential for photosynthesis (the process by which plants make food).
              </li>
              <li>
                <strong>Effects on agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Positive effects:</strong> Sunlight is essential for plant
                    growth. Plants need adequate light for photosynthesis, which
                    produces food and energy.
                  </li>
                  <li>
                    <strong>Negative effects:</strong> Too much sunlight can cause
                    sunburn, heat stress, and water loss (transpiration). Too little
                    sunlight can reduce growth and yields.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Mitigation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Shade nets for greenhouses and nursery beds.</li>
                  <li>Planting trees to provide shade for shade-loving crops.</li>
                  <li>Choosing crops that are suitable for the available sunlight.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Temperature</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Temperature is the degree of hotness or
                coldness of the air or soil. It is a major factor affecting plant
                growth and animal production.
              </li>
              <li>
                <strong>Effects on agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Growth rate:</strong> Plants grow faster in warm
                    temperatures (optimal temperature range). Extreme temperatures
                    (too hot or too cold) can damage or kill plants.
                  </li>
                  <li>
                    <strong>Germination:</strong> Seeds need certain temperatures to
                    germinate. Some crops need warm soils (maize), while others need
                    cool soils (wheat).
                  </li>
                  <li>
                    <strong>Flowering and fruiting:</strong> Temperature affects
                    flowering, fruit set, and fruit development. Some crops need
                    specific temperatures to flower (vernalisation).
                  </li>
                  <li>
                    <strong>Water loss:</strong> High temperatures increase
                    transpiration (water loss from plants), which can lead to wilting.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Mitigation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Shading and windbreaks to reduce temperature stress.</li>
                  <li>Irrigation to cool crops and reduce water loss.</li>
                  <li>Choosing heat-tolerant or cold-tolerant crop varieties.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Rainfall</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Rainfall is the amount of precipitation
                (rain, snow, sleet) that falls in a specific area. It is a critical
                factor for rainfed agriculture.
              </li>
              <li>
                <strong>Effects on agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Water supply:</strong> Rainfall provides water for crop
                    growth. Adequate rainfall is essential for good yields.
                  </li>
                  <li>
                    <strong>Timing:</strong> The timing and distribution of rainfall
                    are as important as the total amount. Rain at the wrong time
                    (e.g., during flowering) can reduce yields.
                  </li>
                  <li>
                    <strong>Drought:</strong> Low or erratic rainfall causes drought,
                    leading to crop failure and food insecurity.
                  </li>
                  <li>
                    <strong>Floods:</strong> Excessive rainfall can cause flooding,
                    damaging crops and eroding soil.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Mitigation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Irrigation to supplement rainfall.</li>
                  <li>Rainwater harvesting (dams, catchment areas).</li>
                  <li>Choosing drought-tolerant crop varieties.</li>
                  <li>Planting crops that match the rainfall pattern (e.g., early-maturing varieties).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Humidity</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Humidity is the amount of moisture
                (water vapour) in the air. It affects evaporation, transpiration,
                and disease development.
              </li>
              <li>
                <strong>Effects on agriculture:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Disease:</strong> High humidity promotes the growth of
                    fungal diseases (e.g., rust, mildew, blight). Low humidity can
                    reduce disease.
                  </li>
                  <li>
                    <strong>Transpiration:</strong> High humidity reduces transpiration
                    (water loss), while low humidity increases it.
                  </li>
                  <li>
                    <strong>Pollination:</strong> High humidity can affect pollination
                    by making pollen sticky.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Mitigation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Good air circulation to reduce humidity in greenhouses.</li>
                  <li>Planting crops at the right spacing to reduce humidity.</li>
                  <li>Using fungicides to control diseases in humid conditions.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="environmental-factors-agriculture.png"
              alt="A 2D diagram showing environmental factors affecting agriculture: wind, light, temperature, rainfall, and humidity"
              caption="Environmental factors affecting agriculture: wind, light, temperature, rainfall, and humidity."
            />
          </SubtopicCard>

          <SubtopicCard title="Temperature Effects on Water Loss">
            <p>
              Temperature has a significant effect on water loss from plants and soil.
              Understanding this relationship is important for managing irrigation
              and preventing crop damage.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Transpiration</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Transpiration is the loss of water vapour
                from plant leaves through stomata (small openings). It is a natural
                process that helps plants cool down and transport nutrients.
              </li>
              <li>
                <strong>Effect of temperature:</strong> As temperature increases,
                transpiration increases. High temperatures cause plants to lose more
                water, which can lead to wilting if water is not available.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Evaporation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Evaporation is the loss of water from
                the soil surface. It is affected by temperature, wind, and humidity.
              </li>
              <li>
                <strong>Effect of temperature:</strong> Higher temperatures increase
                evaporation, drying out the soil and reducing water availability for plants.
              </li>
            </ul>

            <AgricultureImage
              fileName="temperature-water-loss.png"
              alt="A 2D diagram showing how temperature affects transpiration and evaporation, leading to water loss in plants and soil"
              caption="Temperature effects on water loss: transpiration and evaporation."
            />
          </SubtopicCard>

          <SubtopicCard title="Wilting">
            <p>
              <strong>Definition:</strong> Wilting is the drooping or loss of rigidity
              in plant leaves and stems due to lack of water. It occurs when plants
              lose more water through transpiration than they can absorb from the soil.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Types of Wilting</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Temporary Wilting:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Definition:</strong> Wilting that occurs during the
                    hottest part of the day but recovers at night when temperatures
                    cool down.
                  </li>
                  <li>
                    <strong>Cause:</strong> Transpiration exceeds water uptake during
                    the hot daytime hours.
                  </li>
                  <li>
                    <strong>Recovery:</strong> Plants recover when temperatures cool
                    and transpiration decreases. No permanent damage occurs.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Permanent Wilting:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Definition:</strong> Wilting that does not recover, even
                    at night. Plants eventually die if water is not provided.
                  </li>
                  <li>
                    <strong>Cause:</strong> The soil has dried out and the plant
                    cannot absorb enough water. This can be due to drought, poor
                    soil water-holding capacity, or root damage.
                  </li>
                  <li>
                    <strong>Recovery:</strong> Plants do not recover without
                    irrigation or rainfall. Permanent damage and death can occur.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes of Wilting</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Water deficiency:</strong> Lack of water in the soil due to
                drought, poor irrigation, or dry conditions.
              </li>
              <li>
                <strong>High temperatures:</strong> High temperatures increase
                transpiration, causing plants to lose water faster than they can absorb it.
              </li>
              <li>
                <strong>Strong winds:</strong> Winds increase transpiration by
                removing water vapour from the leaf surface.
              </li>
              <li>
                <strong>Root damage:</strong> Damaged roots cannot absorb water
                effectively. This can be caused by pests, diseases, or poor cultivation.
              </li>
              <li>
                <strong>Salinity:</strong> High salt concentrations in the soil make
                it difficult for plants to absorb water (osmotic stress).
              </li>
            </ul>

            <AgricultureImage
              fileName="wilting-types-causes.png"
              alt="A 2D diagram showing temporary and permanent wilting, and the causes of wilting: water deficiency, high temperatures, strong winds, root damage, and salinity"
              caption="Types of wilting: temporary and permanent. Causes of wilting: water deficiency, high temperatures, strong winds, root damage, and salinity."
            />
          </SubtopicCard>

          <SubtopicCard title="Frost Damage and Protection">
            <p>
              <strong>Definition:</strong> Frost occurs when temperatures drop below
              freezing point (0°C). Frost can damage or kill plants by freezing the
              water inside plant cells, causing them to burst.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects of Frost</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Damage to leaves and stems:</strong> Freezing kills plant
                tissue, causing leaves and stems to turn brown and die.
              </li>
              <li>
                <strong>Damage to flowers and fruit:</strong> Frost can kill flowers
                and young fruit, reducing yields.
              </li>
              <li>
                <strong>Damage to roots:</strong> Frost can damage shallow roots,
                affecting plant growth and survival.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Frost Protection Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Mulching:</strong> Applying a layer of organic material
                (straw, leaves, compost) around plants to insulate the soil and
                protect roots.
              </li>
              <li>
                <strong>Irrigation:</strong> Watering plants before a frost. The
                water releases heat as it freezes, protecting the plants.
              </li>
              <li>
                <strong>Smoke:</strong> Burning materials to create a layer of smoke
                that traps heat near the ground.
              </li>
              <li>
                <strong>Windbreaks:</strong> Planting trees or hedges to reduce wind
                speed and temperature fluctuations.
              </li>
              <li>
                <strong>Covering:</strong> Using cloth, plastic, or straw to cover
                plants and trap heat.
              </li>
              <li>
                <strong>Greenhouses and tunnels:</strong> Growing plants in protected
                environments to prevent frost damage.
              </li>
              <li>
                <strong>Choosing frost-resistant varieties:</strong> Growing crop
                varieties that are tolerant to frost.
              </li>
            </ul>

            <AgricultureImage
              fileName="frost-protection-methods.png"
              alt="A 2D diagram showing frost protection methods: mulching, irrigation, smoke, windbreaks, covering, greenhouses, and frost-resistant varieties"
              caption="Frost protection methods: mulching, irrigation, smoke, windbreaks, covering, greenhouses, and frost-resistant varieties."
            />
          </SubtopicCard>

          <SubtopicCard title="Measures to Minimise Adverse Temperature Effects">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Shading:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Using shade nets, trees, or structures to protect plants from
                    excessive sunlight and heat.</li>
                  <li>Reduces temperature stress and water loss.</li>
                </ul>
              </li>
              <li>
                <strong>Windbreaks:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Planting trees, hedges, or fences to reduce wind speed.</li>
                  <li>Reduces wind damage and transpiration.</li>
                </ul>
              </li>
              <li>
                <strong>Irrigation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Providing water to cool plants and maintain soil moisture.</li>
                  <li>Reduces heat stress and wilting.</li>
                </ul>
              </li>
              <li>
                <strong>Mulching:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Applying organic material to the soil surface.</li>
                  <li>Reduces soil temperature and retains moisture.</li>
                </ul>
              </li>
              <li>
                <strong>Choosing appropriate crop varieties:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Growing varieties that are heat-tolerant or cold-tolerant.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="minimise-temperature-effects.png"
              alt="A 2D diagram showing measures to minimise adverse temperature effects: shading, windbreaks, irrigation, mulching, and choosing appropriate varieties"
              caption="Measures to minimise adverse temperature effects: shading, windbreaks, irrigation, mulching, and choosing appropriate varieties."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Environmental Factors</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Wind:</strong> damage, erosion, transpiration</li>
            <li><strong>Light:</strong> photosynthesis, heat stress</li>
            <li><strong>Temperature:</strong> growth, water loss, frost</li>
            <li><strong>Rainfall:</strong> water supply, drought, floods</li>
            <li><strong>Humidity:</strong> diseases, transpiration</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'natural-farming-regions',
      title: 'Natural Farming Regions',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Zimbabwe's Natural Farming Regions">
            <p>
              <strong>Definition:</strong> Zimbabwe has been divided into five natural
              farming regions based on climate, soil type, and rainfall. These regions
              determine what crops can be grown and what farming systems are suitable.
            </p>
            <p>
              The regions are numbered from Region 1 (best) to Region 5 (worst) in
              terms of agricultural potential. Understanding these regions is essential
              for planning agricultural production and land use.
            </p>

            <AgricultureImage
              fileName="zimbabwe-farming-regions-map.png"
              alt="A map of Zimbabwe showing the five natural farming regions (Region 1 to Region 5) with different colours and boundaries"
              caption="Zimbabwe's natural farming regions: Region 1 to Region 5."
            />
          </SubtopicCard>

          <SubtopicCard title="Region 1: Specialised and Diversified Farming">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Eastern Highlands (Nyanga, Vumba, Chimanimani).
              </li>
              <li>
                <strong>Rainfall:</strong> High (over 1000mm per year). Reliable and well-distributed.
              </li>
              <li>
                <strong>Climate:</strong> Cool to temperate with moderate temperatures.
              </li>
              <li>
                <strong>Soils:</strong> Fertile soils (volcanic, deep, well-drained).
              </li>
              <li>
                <strong>Suitable farming systems:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Intensive crop production (vegetables, fruits, tea, coffee).</li>
                  <li>Dairy farming (pasture-based).</li>
                  <li>Timber and forestry (commercial timber plantations).</li>
                  <li>Floriculture (flowers for export).</li>
                  <li>Pig and poultry production.</li>
                </ul>
              </li>
              <li>
                <strong>Challenges:</strong> Frost risk in winter, steep slopes in some areas.
              </li>
            </ul>

            <AgricultureImage
              fileName="region1-farming.png"
              alt="A realistic photograph of farming in Region 1 (Eastern Highlands): tea plantations, dairy cattle, and lush green vegetation"
              caption="Region 1: Specialised and diversified farming in the Eastern Highlands."
            />
          </SubtopicCard>

          <SubtopicCard title="Region 2: Intensive Farming">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Parts of Mashonaland East, Mashonaland Central, and Manicaland.
              </li>
              <li>
                <strong>Rainfall:</strong> Moderate to high (750-1000mm per year). Reliable.
              </li>
              <li>
                <strong>Climate:</strong> Warm and favourable for crop growth.
              </li>
              <li>
                <strong>Soils:</strong> Fertile soils (red clay, loam) with good water-holding capacity.
              </li>
              <li>
                <strong>Suitable farming systems:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Commercial crop production (maize, tobacco, cotton, wheat).</li>
                  <li>Commercial livestock production (dairy, beef).</li>
                  <li>Mixed farming (crops and livestock).</li>
                  <li>Horticulture (vegetables, fruits).</li>
                </ul>
              </li>
              <li>
                <strong>Challenges:</strong> Some risk of dry spells, soil erosion if not managed.
              </li>
            </ul>

            <AgricultureImage
              fileName="region2-farming.png"
              alt="A realistic photograph of farming in Region 2: commercial maize and tobacco fields, and mixed farming"
              caption="Region 2: Intensive farming with commercial crops."
            />
          </SubtopicCard>

          <SubtopicCard title="Region 3: Semi-Intensive Farming">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Parts of Mashonaland West, Midlands, and Manicaland.
              </li>
              <li>
                <strong>Rainfall:</strong> Moderate (650-800mm per year). Unreliable, with dry spells.
              </li>
              <li>
                <strong>Climate:</strong> Warm with periodic droughts.
              </li>
              <li>
                <strong>Soils:</strong> Moderate fertility (sandy and loamy soils).
              </li>
              <li>
                <strong>Suitable farming systems:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Mixed farming (crops and livestock).</li>
                  <li>Crop production (maize, sorghum, groundnuts, cotton).</li>
                  <li>Livestock production (beef cattle, goats, sheep).</li>
                  <li>Dairy farming with supplementary feeding.</li>
                </ul>
              </li>
              <li>
                <strong>Challenges:</strong> Drought risk, soil fertility decline, and water scarcity.
              </li>
            </ul>

            <AgricultureImage
              fileName="region3-farming.png"
              alt="A realistic photograph of farming in Region 3: mixed farming with maize, livestock, and semi-arid conditions"
              caption="Region 3: Semi-intensive farming with mixed crops and livestock."
            />
          </SubtopicCard>

          <SubtopicCard title="Region 4: Extensive Farming">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Parts of Matabeleland North, Matabeleland South, and parts of the Lowveld.
              </li>
              <li>
                <strong>Rainfall:</strong> Low (450-650mm per year). Unreliable and erratic.
              </li>
              <li>
                <strong>Climate:</strong> Hot and dry with frequent droughts.
              </li>
              <li>
                <strong>Soils:</strong> Poor fertility (sandy, shallow, low organic matter).
              </li>
              <li>
                <strong>Suitable farming systems:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Extensive livestock production (cattle, goats, sheep).</li>
                  <li>Drought-resistant crops (sorghum, millet, cowpeas).</li>
                  <li>Game ranching and wildlife management.</li>
                  <li>Irrigation farming (in areas with water).</li>
                </ul>
              </li>
              <li>
                <strong>Challenges:</strong> Severe drought risk, land degradation, and water scarcity.
              </li>
            </ul>

            <AgricultureImage
              fileName="region4-farming.png"
              alt="A realistic photograph of farming in Region 4: extensive livestock rearing, drought-resistant crops, and dry conditions"
              caption="Region 4: Extensive farming with livestock and drought-resistant crops."
            />
          </SubtopicCard>

          <SubtopicCard title="Region 5: Extensive Livestock Farming">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> The Lowveld (south-eastern Zimbabwe) and parts of Matabeleland.
              </li>
              <li>
                <strong>Rainfall:</strong> Very low (less than 450mm per year). Highly unreliable.
              </li>
              <li>
                <strong>Climate:</strong> Hot and arid with frequent and severe droughts.
              </li>
              <li>
                <strong>Soils:</strong> Very poor fertility (sandy, shallow, prone to erosion).
              </li>
              <li>
                <strong>Suitable farming systems:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Extensive livestock production (cattle, goats, sheep).</li>
                  <li>Game ranching and wildlife management.</li>
                  <li>Irrigation farming (with water from rivers and dams).</li>
                  <li>Mining and tourism are more important than agriculture.</li>
                </ul>
              </li>
              <li>
                <strong>Challenges:</strong> Extreme drought risk, land degradation, water scarcity, and low productivity.
              </li>
            </ul>

            <AgricultureImage
              fileName="region5-farming.png"
              alt="A realistic photograph of farming in Region 5 (Lowveld): arid conditions, extensive livestock, and game ranching"
              caption="Region 5: Extensive livestock farming and game ranching in the arid Lowveld."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Farming Regions</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Region 1:</strong> Specialised (tea, coffee, dairy)</li>
            <li><strong>Region 2:</strong> Intensive (maize, tobacco, cotton)</li>
            <li><strong>Region 3:</strong> Semi-intensive (mixed crops/livestock)</li>
            <li><strong>Region 4:</strong> Extensive (livestock, dryland crops)</li>
            <li><strong>Region 5:</strong> Very extensive (livestock, game ranching)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'forestry',
      title: 'Forestry',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Importance of Forests">
            <p>
              <strong>Definition:</strong> Forests are large areas of land covered with
              trees and undergrowth. They are one of the most important natural resources
              in the world. Forests provide many social, economic, cultural, and
              ecological benefits.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Social Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Livelihoods:</strong> Forests provide livelihoods for millions
                of people through timber, fuelwood, and non-timber forest products
                (fruit, honey, medicinal plants).
              </li>
              <li>
                <strong>Employment:</strong> Forestry provides employment in logging,
                timber processing, and forest management.
              </li>
              <li>
                <strong>Recreation:</strong> Forests provide opportunities for
                recreation, tourism, and leisure activities.
              </li>
              <li>
                <strong>Cultural and spiritual value:</strong> Forests have cultural
                and spiritual significance for many communities. They are used for
                ceremonies, rituals, and traditional practices.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Economic Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Timber:</strong> Forests provide timber for construction,
                furniture, and fuelwood. Timber is a valuable export product.
              </li>
              <li>
                <strong>Non-timber forest products:</strong> Forests provide products
                like fruit, nuts, honey, medicinal plants, and fibres.
              </li>
              <li>
                <strong>Tourism:</strong> Forests attract tourists, generating income
                for local communities and the country.
              </li>
              <li>
                <strong>Employment:</strong> Forestry provides employment in logging,
                processing, and management.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Cultural Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Traditional practices:</strong> Forests are used for traditional
                ceremonies, rituals, and cultural practices.
              </li>
              <li>
                <strong>Spiritual significance:</strong> Some forests are considered
                sacred and are used for religious ceremonies.
              </li>
              <li>
                <strong>Knowledge and skills:</strong> Forestry preserves traditional
                knowledge of forest management and use of forest products.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ecological Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Biodiversity:</strong> Forests provide habitat for plants,
                animals, and other organisms. They are the most diverse ecosystems on Earth.
              </li>
              <li>
                <strong>Climate regulation:</strong> Forests absorb carbon dioxide
                and release oxygen, helping to regulate the climate.
              </li>
              <li>
                <strong>Water cycle:</strong> Forests affect the water cycle by
                absorbing and releasing water. They help to prevent flooding and
                maintain river flow.
              </li>
              <li>
                <strong>Soil conservation:</strong> Forest roots hold the soil
                together, preventing erosion and maintaining soil fertility.
              </li>
            </ul>

            <AgricultureImage
              fileName="forest-importance.png"
              alt="A 2D diagram showing the social, economic, cultural, and ecological importance of forests"
              caption="The social, economic, cultural, and ecological importance of forests."
            />
          </SubtopicCard>

          <SubtopicCard title="Major Forests in Zimbabwe">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Eastern Highlands Forests:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Located in the Eastern Highlands (Nyanga, Vumba, Chimanimani).</li>
                  <li>Includes indigenous forests (miombo, teak) and exotic plantations
                    (pine, eucalyptus).</li>
                  <li>Supports timber production, biodiversity, and tourism.</li>
                </ul>
              </li>
              <li>
                <strong>Zambezi Valley Forests:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Located along the Zambezi River and its tributaries.</li>
                  <li>Includes forests in Kariba, Chewore, and Mana Pools.</li>
                  <li>Supports timber, biodiversity, and wildlife.</li>
                </ul>
              </li>
              <li>
                <strong>Gokwe and Kwekwe Forests:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Located in the Midlands and parts of Matabeleland.</li>
                  <li>Includes miombo woodlands and teak forests.</li>
                  <li>Supports timber and fuelwood production.</li>
                </ul>
              </li>
              <li>
                <strong>Mazowe Valley Forests:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Located along the Mazowe River.</li>
                  <li>Includes indigenous and exotic forests.</li>
                  <li>Supports timber and biodiversity.</li>
                </ul>
              </li>
              <li>
                <strong>Matopos Hills Forests:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Located in the Matopos Hills.</li>
                  <li>Includes miombo and teak forests.</li>
                  <li>Supports biodiversity and tourism.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="major-forests-zimbabwe-map.png"
              alt="A map of Zimbabwe showing the major forests: Eastern Highlands, Zambezi Valley, Gokwe, Mazowe Valley, and Matopos Hills"
              caption="Major forests in Zimbabwe: Eastern Highlands, Zambezi Valley, Gokwe, Mazowe Valley, and Matopos Hills."
            />
          </SubtopicCard>

          <SubtopicCard title="Indigenous and Exotic Timber Trees">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Indigenous Timber Trees</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Teak (Baikiaea plurijuga):</strong> Found in western Zimbabwe
                (Matabeleland). It is a hardwood used for furniture and construction.
                It is valued for its durability and resistance to termites.
              </li>
              <li>
                <strong>Mahogany (Khaya anthotheca):</strong> Found in the Eastern
                Highlands and parts of the Zambezi Valley. It is a hardwood used for
                furniture and high-quality woodwork.
              </li>
              <li>
                <strong>Mukwa (Pterocarpus angolensis):</strong> Found in miombo
                woodlands throughout Zimbabwe. It is a hardwood used for furniture,
                carvings, and building.
              </li>
              <li>
                <strong>Msasa (Brachystegia spiciformis):</strong> Found in miombo
                woodlands. It is used for building, fuelwood, and charcoal.
              </li>
              <li>
                <strong>Mopane (Colophospermum mopane):</strong> Found in hot, dry
                areas (Matabeleland, Lowveld). It is used for building, fuelwood,
                and charcoal. It is also used for carving.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Exotic Timber Trees</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pine (Pinus species):</strong> Planted in commercial plantations
                in the Eastern Highlands. Used for timber, paper, and construction.
              </li>
              <li>
                <strong>Eucalyptus (Eucalyptus species):</strong> Planted in many areas
                for timber, fuelwood, and poles. Fast-growing and adaptable.
              </li>
              <li>
                <strong>Wattle (Acacia species):</strong> Planted for tannin production
                and timber. Used for fencing and building.
              </li>
              <li>
                <strong>Gum trees (Eucalyptus):</strong> Planted for timber and fuelwood.
              </li>
            </ul>

            <AgricultureImage
              fileName="timber-trees-zimbabwe.png"
              alt="A 2D diagram showing indigenous timber trees (teak, mahogany, mukwa, msasa, mopane) and exotic timber trees (pine, eucalyptus, wattle, gum trees)"
              caption="Indigenous and exotic timber trees in Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Forestry Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Importance:</strong> social, economic, cultural, ecological</li>
            <li><strong>Major forests:</strong> Eastern Highlands, Zambezi Valley, Gokwe</li>
            <li><strong>Indigenous trees:</strong> teak, mahogany, mukwa, msasa, mopane</li>
            <li><strong>Exotic trees:</strong> pine, eucalyptus, wattle</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'wildlife',
      title: 'Wildlife',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Importance of Wildlife">
            <p>
              <strong>Definition:</strong> Wildlife refers to all living organisms
              (animals, plants, fungi) that are not domesticated. Wildlife includes
              mammals, birds, reptiles, fish, insects, and plants.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Socio-Economic Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Tourism:</strong> Wildlife is a major tourist attraction.
                Wildlife tourism generates income for the country and supports
                local communities through employment and business opportunities.
              </li>
              <li>
                <strong>Employment:</strong> Wildlife management provides employment
                for game rangers, guides, and conservation professionals.
              </li>
              <li>
                <strong>Income and revenue:</strong> Wildlife tourism generates foreign
                currency and government revenue through park fees, licenses, and taxes.
              </li>
              <li>
                <strong>Sustainable use:</strong> Sustainable hunting and wildlife
                products can generate income for local communities.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Cultural Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Traditional practices:</strong> Wildlife is part of traditional
                practices, including hunting, medicine, and ceremonies.
              </li>
              <li>
                <strong>Cultural identity:</strong> Wildlife is part of cultural
                identity for many communities. It is featured in art, stories, and
                folklore.
              </li>
              <li>
                <strong>Spiritual significance:</strong> Some animals have spiritual
                significance and are associated with totems, rituals, and beliefs.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ecological Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Biodiversity:</strong> Wildlife contributes to biodiversity,
                making ecosystems more resilient and productive.
              </li>
              <li>
                <strong>Ecosystem services:</strong> Wildlife provides ecosystem
                services, including pollination, seed dispersal, pest control, and
                nutrient cycling.
              </li>
              <li>
                <strong>Food chains:</strong> Wildlife is part of food chains and
                food webs, maintaining the balance of ecosystems.
              </li>
              <li>
                <strong>Indicator species:</strong> Some wildlife species are indicators
                of ecosystem health. Their presence or absence can show the condition
                of the environment.
              </li>
            </ul>

            <AgricultureImage
              fileName="wildlife-importance.png"
              alt="A 2D diagram showing the socio-economic, cultural, and ecological importance of wildlife"
              caption="The socio-economic, cultural, and ecological importance of wildlife."
            />
          </SubtopicCard>

          <SubtopicCard title="Flora and Fauna Identification">
            <p>
              <strong>Flora:</strong> The plant life of a region. In Zimbabwe,
              important flora includes miombo woodlands, teak forests, grasslands,
              and riverine vegetation.
            </p>
            <p>
              <strong>Fauna:</strong> The animal life of a region. In Zimbabwe,
              important fauna includes mammals, birds, reptiles, and fish.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Examples of Flora in Zimbabwe</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Miombo woodlands:</strong> Dominated by Brachystegia species (msasa, mutondo).</li>
              <li><strong>Teak forests:</strong> Dominated by Baikiaea plurijuga (teak).</li>
              <li><strong>Mopane woodlands:</strong> Dominated by Colophospermum mopane (mopane).</li>
              <li><strong>Savanna grasslands:</strong> Grasses like Hyparrhenia, Themeda, and Aristida.</li>
              <li><strong>Riverine vegetation:</strong> Trees like Acacia, Faidherbia, and Syzygium.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Examples of Fauna in Zimbabwe</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Mammals:</strong> Elephant, lion, leopard, buffalo, rhino (the "Big Five"), zebra, giraffe, wildebeest, antelope.</li>
              <li><strong>Birds:</strong> African fish eagle, secretary bird, ostrich, vultures, kingfishers, hornbills.</li>
              <li><strong>Reptiles:</strong> Crocodile, monitor lizard, snakes (puff adder, black mamba, python).</li>
              <li><strong>Fish:</strong> Tigerfish, tilapia, catfish, bream.</li>
            </ul>

            <AgricultureImage
              fileName="flora-fauna-zimbabwe.png"
              alt="A 2D diagram showing examples of flora (miombo woodlands, teak, mopane, savanna grasses) and fauna (elephant, lion, buffalo, fish eagle, crocodile) in Zimbabwe"
              caption="Examples of flora and fauna in Zimbabwe."
            />
          </SubtopicCard>

          <SubtopicCard title="Classification by Feeding Habits">
            <p>
              Animals can be classified into different groups based on what they eat.
              Understanding feeding habits helps us understand the role of animals
              in the ecosystem and how they interact with each other.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Herbivores:</strong> Animals that eat only plants.
                <br />
                <strong>Examples:</strong> Elephant, buffalo, zebra, giraffe, antelope,
                wildebeest, hippopotamus.
                <br />
                <strong>Role:</strong> Herbivores are primary consumers. They convert
                plant material into animal biomass.
              </li>
              <li>
                <strong>Carnivores:</strong> Animals that eat other animals.
                <br />
                <strong>Examples:</strong> Lion, leopard, cheetah, hyena, crocodile,
                wild dog, birds of prey (eagle, hawk).
                <br />
                <strong>Role:</strong> Carnivores are secondary and tertiary consumers.
                They control the populations of herbivores and other animals.
              </li>
              <li>
                <strong>Omnivores:</strong> Animals that eat both plants and animals.
                <br />
                <strong>Examples:</strong> Baboon, monkey, warthog, bush pig, honey badger.
                <br />
                <strong>Role:</strong> Omnivores are flexible consumers that can
                adapt to different food sources.
              </li>
              <li>
                <strong>Insectivores:</strong> Animals that eat insects.
                <br />
                <strong>Examples:</strong> Aardvark, pangolin, anteater, some birds
                (bee-eaters, rollers).
                <br />
                <strong>Role:</strong> Insectivores control insect populations and
                are important for ecosystem balance.
              </li>
              <li>
                <strong>Scavengers:</strong> Animals that eat dead animals.
                <br />
                <strong>Examples:</strong> Hyena, vulture, marabou stork, jackal.
                <br />
                <strong>Role:</strong> Scavengers clean up dead animals and recycle
                nutrients back into the ecosystem.
              </li>
              <li>
                <strong>Decomposers:</strong> Organisms that break down dead organic
                matter (plants and animals).
                <br />
                <strong>Examples:</strong> Bacteria, fungi, termites, dung beetles.
                <br />
                <strong>Role:</strong> Decomposers recycle nutrients and maintain
                soil fertility.
              </li>
            </ul>

            <AgricultureImage
              fileName="feeding-habits-animals.png"
              alt="A 2D diagram showing classification of animals by feeding habits: herbivores, carnivores, omnivores, insectivores, scavengers, and decomposers"
              caption="Classification of animals by feeding habits: herbivores, carnivores, omnivores, insectivores, scavengers, and decomposers."
            />
          </SubtopicCard>

          <SubtopicCard title="The 'Big Five'">
            <p>
              <strong>Definition:</strong> The "Big Five" are the five most iconic
              and sought-after animals for wildlife viewing (safari) in Africa.
              They were originally named because they were the most difficult and
              dangerous animals to hunt on foot.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>African Elephant:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Scientific name:</strong> Loxodonta africana</li>
                  <li><strong>Characteristics:</strong> The largest land animal.
                    Lives in herds. Feeds on leaves, bark, and fruits.</li>
                  <li><strong>Zimbabwe:</strong> Found in Hwange, Gonarezhou, Mana Pools.</li>
                </ul>
              </li>
              <li>
                <strong>Lion:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Scientific name:</strong> Panthera leo</li>
                  <li><strong>Characteristics:</strong> The second-largest big cat.
                    Lives in prides. Hunts in groups.</li>
                  <li><strong>Zimbabwe:</strong> Found in Hwange, Gonarezhou, Mana Pools.</li>
                </ul>
              </li>
              <li>
                <strong>Leopard:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Scientific name:</strong> Panthera pardus</li>
                  <li><strong>Characteristics:</strong> A solitary, nocturnal predator.
                    Excellent climber and swimmer.</li>
                  <li><strong>Zimbabwe:</strong> Found in most national parks and game reserves.</li>
                </ul>
              </li>
              <li>
                <strong>African Buffalo:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Scientific name:</strong> Syncerus caffer</li>
                  <li><strong>Characteristics:</strong> A large, powerful bovine.
                    Lives in herds. Known for its aggression when threatened.</li>
                  <li><strong>Zimbabwe:</strong> Found in Hwange, Gonarezhou, Mana Pools.</li>
                </ul>
              </li>
              <li>
                <strong>Rhino:</strong> (Black Rhino and White Rhino)
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Black Rhino (Diceros bicornis):</strong> Smaller, with a
                    hooked upper lip. Found in Matopos, Save Valley.
                  </li>
                  <li>
                    <strong>White Rhino (Ceratotherium simum):</strong> Larger, with a
                    square upper lip. Found in Hwange, Matopos, and private reserves.
                  </li>
                  <li><strong>Both are endangered:</strong> Threatened by poaching.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="big-five-animals.png"
              alt="A realistic photograph or 2D diagram showing the African Big Five: elephant, lion, leopard, buffalo, and rhino"
              caption="The African Big Five: elephant, lion, leopard, buffalo, and rhino."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Wildlife Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Importance:</strong> socio-economic, cultural, ecological</li>
            <li><strong>Flora:</strong> miombo, teak, mopane, savanna grasses</li>
            <li><strong>Fauna:</strong> mammals, birds, reptiles, fish</li>
            <li><strong>Feeding habits:</strong> herbivores, carnivores, omnivores, insectivores, scavengers, decomposers</li>
            <li><strong>Big Five:</strong> elephant, lion, leopard, buffalo, rhino</li>
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
            Explore the introduction to agriculture, environmental factors affecting
            farming, Zimbabwe's natural farming regions, forestry, and wildlife
            management in Zimbabwe.
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
                  <strong className="text-white">Agriculture:</strong> The science and
                  practice of growing crops and raising animals. Branches include crop
                  husbandry, animal husbandry, horticulture, soil science, wildlife
                  management, forestry, agricultural engineering, and agribusiness.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Land Use &amp; Tenure:</strong> Forms
                  include forestry, wildlife, crop, livestock, and mixed farming. Land
                  tenure systems include freehold, leasehold, communal, and resettlement
                  (A1 and A2 models). Land reform addresses historical injustices.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Environmental Factors:</strong> Wind,
                  light, temperature, rainfall, and humidity affect crop and animal
                  production. Wilting (temporary and permanent) is caused by water
                  deficiency. Frost can be prevented with mulching, irrigation, and
                  windbreaks.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farming Regions:</strong> Region 1
                  (specialised, Eastern Highlands), Region 2 (intensive, commercial),
                  Region 3 (semi-intensive, mixed), Region 4 (extensive, livestock),
                  and Region 5 (very extensive, game ranching).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Forestry:</strong> Forests provide
                  timber, fuelwood, biodiversity, climate regulation, and livelihoods.
                  Major forests in Zimbabwe include Eastern Highlands, Zambezi Valley,
                  Gokwe, Mazowe Valley, and Matopos Hills.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Wildlife:</strong> Wildlife has
                  socio-economic, cultural, and ecological importance. Animals are
                  classified by feeding habits: herbivores, carnivores, omnivores,
                  insectivores, scavengers, and decomposers. The "Big Five" are elephant,
                  lion, leopard, buffalo, and rhino.
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
              <>Ready to move on to <span className="text-green-600">Crop Production</span>?</>
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
                alert('Proceed to Crop Production (next topic)');
              }
            }}
            className="px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Crop Production →' : 'Next Section →'}
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

   --- INTRODUCTION TO AGRICULTURE IMAGES (2D DIAGRAM AND REALISTIC) ---

   1. agriculture-overview.png
      A 2D diagram showing the scope of agriculture: crop farming, livestock rearing,
      forestry, and wildlife management.
      Use icons and brief labels for each component.

   2. branches-agriculture.png
      A 2D diagram showing the branches of agriculture: Crop Husbandry, Animal Husbandry,
      Horticulture, Soil Science, Wildlife Management, Forestry, Agricultural Engineering,
      and Agribusiness.
      Use icons and brief labels for each branch.

   3. agriculture-importance.png
      A 2D diagram showing the social (food, employment, livelihoods, culture), economic
      (GDP, exports, linkages, poverty reduction), and ecological (ecosystem services,
      biodiversity, land management, sustainability) importance of agriculture.

   4. agriculture-careers.png
      A 2D diagram showing career opportunities in agriculture: farming, research,
      engineering, agribusiness, extension, conservation, and wildlife management.

   5. land-use-forms.png
      A 2D diagram showing forms of land use: forestry, wildlife management, crop
      husbandry, livestock husbandry, mixed farming, and urban land.

   6. factors-limiting-land-use.png
      A 2D diagram showing factors limiting land use: physical (climate, soil, relief,
      water), economic (market access, capital, technology), social (land tenure,
      population, skills), and political (policies, land reform, stability).

   7. protected-areas-zimbabwe-map.png
      A map of Zimbabwe showing protected areas: national parks (Hwange, Mana Pools,
      Gonarezhou, Matopos, Nyanga), game reserves, safari areas, and forest reserves.
      Use different colours for each type.

   8. land-tenure-zimbabwe.png
      A 2D diagram showing land tenure systems in Zimbabwe: freehold (private), leasehold,
      communal, and resettlement (A1, A2).

   9. land-reform-zimbabwe.png
      A 2D diagram showing the history of land reform in Zimbabwe: pre-colonial
      (communal ownership), colonial (land dispossession), post-independence (land reform),
      and the A1/A2 resettlement models.

   --- ENVIRONMENTAL FACTORS IMAGES (2D DIAGRAM AND REALISTIC) ---

   10. environmental-factors-agriculture.png
       A 2D diagram showing environmental factors affecting agriculture: wind, light,
       temperature, rainfall, and humidity.
       Use icons and brief explanations for each factor.

   11. temperature-water-loss.png
       A 2D diagram showing how temperature affects transpiration and evaporation,
       leading to water loss in plants and soil.

   12. wilting-types-causes.png
       A 2D diagram showing temporary and permanent wilting, and the causes of wilting:
       water deficiency, high temperatures, strong winds, root damage, and salinity.

   13. frost-protection-methods.png
       A 2D diagram showing frost protection methods: mulching, irrigation, smoke,
       windbreaks, covering, greenhouses, and frost-resistant varieties.

   14. minimise-temperature-effects.png
       A 2D diagram showing measures to minimise adverse temperature effects: shading,
       windbreaks, irrigation, mulching, and choosing appropriate varieties.

   --- NATURAL FARMING REGIONS IMAGES (2D DIAGRAM AND REALISTIC) ---

   15. zimbabwe-farming-regions-map.png
       A map of Zimbabwe showing the five natural farming regions (Region 1 to Region 5)
       with different colours and boundaries. Include a legend.

   16. region1-farming.png
       A realistic photograph of farming in Region 1 (Eastern Highlands): tea plantations,
       dairy cattle, and lush green vegetation.

   17. region2-farming.png
       A realistic photograph of farming in Region 2: commercial maize and tobacco fields,
       and mixed farming.

   18. region3-farming.png
       A realistic photograph of farming in Region 3: mixed farming with maize, livestock,
       and semi-arid conditions.

   19. region4-farming.png
       A realistic photograph of farming in Region 4: extensive livestock rearing,
       drought-resistant crops, and dry conditions.

   20. region5-farming.png
       A realistic photograph of farming in Region 5 (Lowveld): arid conditions,
       extensive livestock, and game ranching.

   --- FORESTRY IMAGES (2D DIAGRAM AND REALISTIC) ---

   21. forest-importance.png
       A 2D diagram showing the social (livelihoods, employment), economic (timber,
       tourism), cultural (traditional practices), and ecological (biodiversity, climate)
       importance of forests.

   22. major-forests-zimbabwe-map.png
       A map of Zimbabwe showing the major forests: Eastern Highlands, Zambezi Valley,
       Gokwe, Mazowe Valley, and Matopos Hills.

   23. timber-trees-zimbabwe.png
       A 2D diagram showing indigenous timber trees (teak, mahogany, mukwa, msasa,
       mopane) and exotic timber trees (pine, eucalyptus, wattle, gum trees).

   --- WILDLIFE IMAGES (2D DIAGRAM AND REALISTIC) ---

   24. wildlife-importance.png
       A 2D diagram showing the socio-economic (tourism, employment), cultural
       (traditional practices, cultural identity), and ecological (biodiversity,
       ecosystem services) importance of wildlife.

   25. flora-fauna-zimbabwe.png
       A 2D diagram showing examples of flora (miombo woodlands, teak, mopane,
       savanna grasses) and fauna (elephant, lion, buffalo, fish eagle, crocodile)
       in Zimbabwe.

   26. feeding-habits-animals.png
       A 2D diagram showing classification of animals by feeding habits: herbivores,
       carnivores, omnivores, insectivores, scavengers, and decomposers.

   27. big-five-animals.png
       A realistic photograph or 2D diagram showing the African Big Five: elephant,
       lion, leopard, buffalo, and rhino.

   ============================================================ */
