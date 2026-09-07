import React, { useState, useRef } from 'react';

/**
 * Topic: Agricultural Studies – Geography
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const AgriculturalStudies: React.FC = () => {
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
      id: 'factors-farming',
      title: 'Factors Influencing Farming',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Factors Influencing Farm Output">
            <p>
              <strong>Definition:</strong> Farm output refers to the quantity and quality
              of agricultural products (crops and livestock) produced by a farm.
              Various factors – physical, economic, social, and political – influence
              how much a farm can produce.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Physical Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Climate:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Temperature:</strong> Crops need specific temperature ranges.
                    Maize grows best in warm temperatures (20-30°C), while wheat prefers
                    cooler conditions (15-20°C).
                  </li>
                  <li>
                    <strong>Rainfall:</strong> The amount and distribution of rainfall
                    determine what crops can be grown. Rainfed agriculture depends on
                    adequate and reliable rainfall (500-1500mm per year).
                  </li>
                  <li>
                    <strong>Sunshine:</strong> Plants need sunlight for photosynthesis.
                    Areas with more sunshine have higher crop yields.
                  </li>
                  <li>
                    <strong>Frost:</strong> Frost can damage or kill crops, especially
                    in winter months.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Soil:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Soil fertility:</strong> Fertile soils (e.g., volcanic soils,
                    alluvial soils) produce higher yields. Poor soils (e.g., sandy soils)
                    produce lower yields.
                  </li>
                  <li>
                    <strong>Soil pH:</strong> Different crops prefer different pH levels.
                    Most crops prefer neutral to slightly acidic soils (pH 6.0-7.0).
                  </li>
                  <li>
                    <strong>Soil texture:</strong> Clay soils hold water well but can be
                    waterlogged. Sandy soils drain quickly but have low fertility.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Relief (Topography):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Slope:</strong> Steep slopes are difficult to farm and are
                    prone to soil erosion. Gentle slopes and flat land are ideal for farming.
                  </li>
                  <li>
                    <strong>Altitude:</strong> Higher altitudes are cooler and may have
                    shorter growing seasons.
                  </li>
                  <li>
                    <strong>Aspect:</strong> South-facing slopes (in the Southern Hemisphere)
                    receive more sunlight and are warmer.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Water availability:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Rainfed farming:</strong> Depends entirely on rainfall.
                    Common in areas with reliable rainfall (e.g., parts of Zimbabwe).
                  </li>
                  <li>
                    <strong>Irrigation:</strong> Provides water for farming in dry areas.
                    Allows farmers to grow crops year-round (e.g., in the Lowveld of Zimbabwe).
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="physical-factors-farming.png"
              alt="A 2D diagram showing physical factors influencing farming: climate (temperature, rainfall), soil (fertility, pH), relief (slope, altitude), and water availability"
              caption="Physical factors influencing farming output: climate, soil, relief, and water availability."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Economic Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Market access:</strong> Farms near markets can sell their produce
                more easily and at lower transport costs. This increases profitability.
              </li>
              <li>
                <strong>Transport costs:</strong> High transport costs reduce profits
                for farmers, especially for bulky products like maize and potatoes.
              </li>
              <li>
                <strong>Price of inputs:</strong> The cost of seeds, fertiliser,
                pesticides, and machinery affects the profitability of farming.
                High input costs reduce profits.
              </li>
              <li>
                <strong>Government subsidies:</strong> Governments may subsidise inputs
                (fertiliser, seeds) or provide price supports for agricultural products.
                This encourages production.
              </li>
              <li>
                <strong>Access to credit:</strong> Farmers need loans to buy inputs
                and machinery. Access to affordable credit is essential for commercial farming.
              </li>
              <li>
                <strong>Demand for products:</strong> High demand for agricultural
                products (e.g., tobacco, maize, sugar) encourages farmers to produce more.
              </li>
            </ul>

            <GeographyImage
              fileName="economic-factors-farming.png"
              alt="A 2D diagram showing economic factors influencing farming: market access, transport costs, input prices, subsidies, credit, and demand"
              caption="Economic factors influencing farming output: markets, transport, inputs, subsidies, and credit."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Social Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Labour availability:</strong> Farming requires labour for
                planting, weeding, harvesting, and caring for livestock.
                Areas with sufficient labour have higher farm output.
              </li>
              <li>
                <strong>Education and skills:</strong> Educated farmers use better
                farming techniques (e.g., crop rotation, conservation tillage, irrigation).
                This increases yields.
              </li>
              <li>
                <strong>Land tenure:</strong> Farmers who own their land are more likely
                to invest in improvements (e.g., terracing, irrigation, fencing).
                Tenants may not have this incentive.
              </li>
              <li>
                <strong>Population pressure:</strong> High population density leads to
                fragmentation of land into small, uneconomic plots. This reduces farm output.
              </li>
              <li>
                <strong>Traditional practices:</strong> Some traditional practices
                (e.g., shifting cultivation, overgrazing) can degrade the land and
                reduce yields.
              </li>
            </ul>

            <GeographyImage
              fileName="social-factors-farming.png"
              alt="A 2D diagram showing social factors influencing farming: labour availability, education, land tenure, population pressure, and traditional practices"
              caption="Social factors influencing farming output: labour, education, land tenure, and population pressure."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Political Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Government policies:</strong> Agricultural policies (e.g., pricing,
                subsidies, trade policies) affect farm output. Supportive policies
                encourage production.
              </li>
              <li>
                <strong>Land reform:</strong> Redistribution of land can affect farm
                output. Land reform programmes that provide land to previously
                disadvantaged people can increase production.
              </li>
              <li>
                <strong>Trade policies:</strong> Import tariffs and export restrictions
                affect the profitability of agricultural products.
              </li>
              <li>
                <strong>Political stability:</strong> Political instability and conflict
                disrupt farming activities, reducing output.
              </li>
              <li>
                <strong>Infrastructure:</strong> Government investment in roads,
                electricity, and irrigation infrastructure supports farming.
              </li>
            </ul>

            <GeographyImage
              fileName="political-factors-farming.png"
              alt="A 2D diagram showing political factors influencing farming: government policies, land reform, trade policies, political stability, and infrastructure"
              caption="Political factors influencing farming output: policies, land reform, trade, stability, and infrastructure."
            />
          </SubtopicCard>

          <SubtopicCard title="Case Studies">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Case Study 1: Cereal Production (Maize) in Zimbabwe</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Maize is grown throughout Zimbabwe, with the
                main production areas in Mashonaland, Manicaland, and parts of the Midlands.
              </li>
              <li>
                <strong>Physical factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Climate: Maize requires 500-1000mm of rainfall annually.</li>
                  <li>Soil: Well-drained, fertile soils (red clay, loam).</li>
                  <li>Relief: Gentle slopes and flat land are ideal.</li>
                </ul>
              </li>
              <li>
                <strong>Economic factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Demand: Maize is the staple food in Zimbabwe.</li>
                  <li>Inputs: Seeds, fertiliser, and pesticides are essential.</li>
                  <li>Transport: Near markets and roads.</li>
                </ul>
              </li>
              <li>
                <strong>Social factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Labour: Family labour is common, with hired labour during peak seasons.</li>
                  <li>Land tenure: Resettlement and communal areas.</li>
                </ul>
              </li>
              <li>
                <strong>Political factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Government support: Subsidies for fertiliser and seeds.</li>
                  <li>Land reform: Affected commercial maize production.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="maize-production-zimbabwe.png"
              alt="A realistic photograph showing maize production in Zimbabwe: fields, harvest, and farming activities"
              caption="Maize production in Zimbabwe – a key cereal crop."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Case Study 2: Dairy Farming in the Eastern Highlands</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Dairy farming is concentrated in the Eastern
                Highlands (Nyanga, Vumba, Chimanimani) and parts of the Midlands.
              </li>
              <li>
                <strong>Physical factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Climate: Cool, moist conditions suitable for pasture.</li>
                  <li>Rainfall: High rainfall (1000-1500mm) supports lush pasture.</li>
                  <li>Temperature: Mild temperatures, no extreme heat or cold.</li>
                </ul>
              </li>
              <li>
                <strong>Economic factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Market: Demand for milk and dairy products in urban areas.</li>
                  <li>Inputs: Dairy cattle, feed, veterinary care, milking equipment.</li>
                  <li>Transport: Refrigerated trucks to transport milk to processing plants.</li>
                </ul>
              </li>
              <li>
                <strong>Social factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Labour: Skilled labour required for milking and herd management.</li>
                  <li>Tradition: Dairy farming is often a family enterprise.</li>
                </ul>
              </li>
              <li>
                <strong>Political factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Government policies: Support for dairy development and processing.</li>
                  <li>Import policies: Protection against cheap imported dairy products.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="dairy-farming-eastern-highlands.png"
              alt="A realistic photograph showing dairy farming in the Eastern Highlands: pasture, cattle, and milking"
              caption="Dairy farming in the Eastern Highlands of Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Case Study 3: Market Gardening (Irrigation Farming) in the Lowveld</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Market gardening is practised in the Lowveld
                of Zimbabwe (Chiredzi, Triangle, Hippo Valley) and other irrigated areas.
              </li>
              <li>
                <strong>Physical factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Climate: Hot and dry (semi-arid) with low rainfall (less than 500mm).</li>
                  <li>Soil: Fertile alluvial soils along rivers.</li>
                  <li>Water: Irrigation from rivers (Save, Runde, Limpopo) is essential.</li>
                </ul>
              </li>
              <li>
                <strong>Economic factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Demand: High demand for vegetables, fruits, and flowers in urban
                    markets and for export (e.g., to South Africa, Europe).</li>
                  <li>Inputs: Irrigation equipment, seeds, fertiliser, pesticides.</li>
                  <li>Transport: Road networks to markets and airports for export.</li>
                </ul>
              </li>
              <li>
                <strong>Social factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Labour: Labour-intensive farming, often hiring seasonal workers.</li>
                  <li>Skills: Farmers need technical knowledge of irrigation and crop management.</li>
                </ul>
              </li>
              <li>
                <strong>Political factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Government support: Irrigation schemes and export incentives.</li>
                  <li>Land reform: Some large estates have been affected by land reform.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="market-gardening-lowveld.png"
              alt="A realistic photograph showing market gardening in the Lowveld: irrigation, vegetable fields, and harvest"
              caption="Market gardening (irrigation farming) in the Lowveld of Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Physical factors:</strong> climate, soil, relief, water</li>
            <li><strong>Economic factors:</strong> markets, transport, inputs, subsidies</li>
            <li><strong>Social factors:</strong> labour, education, land tenure</li>
            <li><strong>Political factors:</strong> policies, land reform, infrastructure</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'farm-system',
      title: 'The Farm as a System',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="The Farm System Model">
            <p>
              <strong>Definition:</strong> A farm is a system that converts inputs
              into outputs through a series of processes. Understanding the farm as a
              system helps us analyse how farms work and how they can be improved.
            </p>

            <GeographyImage
              fileName="farm-system-model.png"
              alt="A 2D diagram showing the farm system model: inputs, processes, and outputs with arrows showing the flow"
              caption="The farm as a system: inputs, processes, and outputs."
            />
          </SubtopicCard>

          <SubtopicCard title="Natural Inputs">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Sunshine:</strong> Plants need sunlight for photosynthesis.
                The amount of sunshine affects crop growth and yields.
              </li>
              <li>
                <strong>Rainfall:</strong> Water is essential for plant growth. Rainfall
                determines what crops can be grown and whether irrigation is needed.
              </li>
              <li>
                <strong>Soil:</strong> Provides nutrients and support for plant roots.
                Soil fertility, texture, and pH affect plant growth.
              </li>
              <li>
                <strong>Temperature:</strong> Affects plant growth rates, germination,
                and flowering. Different crops have different temperature requirements.
              </li>
              <li>
                <strong>Wind:</strong> Can damage crops, spread seeds, and affect
                transpiration rates.
              </li>
            </ul>

            <GeographyImage
              fileName="natural-inputs-farming.png"
              alt="A 2D diagram showing natural inputs to a farm: sunshine, rainfall, soil, temperature, and wind"
              caption="Natural inputs to a farm: sunshine, rainfall, soil, temperature, and wind."
            />
          </SubtopicCard>

          <SubtopicCard title="Human Inputs">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Labour:</strong> Workers are needed for planting, weeding,
                harvesting, and caring for livestock. Labour can be family labour
                or hired labour.
              </li>
              <li>
                <strong>Machinery and equipment:</strong> Tractors, ploughs, harvesters,
                irrigation equipment, milking machines, and other tools are used to
                increase efficiency and productivity.
              </li>
              <li>
                <strong>Seeds and livestock:</strong> High-quality seeds and improved
                livestock breeds produce higher yields and better products.
              </li>
              <li>
                <strong>Fertiliser:</strong> Adds nutrients to the soil to improve
                plant growth and yields. Can be organic (manure, compost) or
                inorganic (chemical fertilisers).
              </li>
              <li>
                <strong>Pesticides and herbicides:</strong> Control pests and weeds
                that can damage crops. Increase crop yields and quality.
              </li>
              <li>
                <strong>Capital (money):</strong> Needed to buy inputs, machinery,
                and land. Access to credit is essential for commercial farming.
              </li>
            </ul>

            <GeographyImage
              fileName="human-inputs-farming.png"
              alt="A 2D diagram showing human inputs to a farm: labour, machinery, seeds, fertiliser, pesticides, and capital"
              caption="Human inputs to a farm: labour, machinery, seeds, fertiliser, pesticides, and capital."
            />
          </SubtopicCard>

          <SubtopicCard title="Farm Elements and Characteristics">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Size:</strong> The size of the farm affects the scale of
                production. Small farms (less than 5 hectares) are common in
                subsistence farming. Large farms (over 100 hectares) are common in
                commercial farming.
              </li>
              <li>
                <strong>Site:</strong> The location of the farm (e.g., near water,
                near roads, on a slope, in a valley) affects what can be grown
                and how easy it is to access markets.
              </li>
              <li>
                <strong>Ownership:</strong> Farms can be privately owned, state-owned,
                co-operatively owned, or communally owned. Ownership affects
                investment and management decisions.
              </li>
              <li>
                <strong>Layout:</strong> The arrangement of fields, buildings,
                fences, and water sources on the farm. A good layout increases
                efficiency and productivity.
              </li>
              <li>
                <strong>Fields:</strong> The areas where crops are grown. Fields can
                be large (commercial farms) or small (subsistence farms). The
                number and size of fields affect production.
              </li>
              <li>
                <strong>Buildings:</strong> Farm buildings include storage sheds,
                barns, milking parlours, processing facilities, and houses for
                workers. These are essential for farm operations.
              </li>
              <li>
                <strong>Fencing:</strong> Fences protect crops from animals, enclose
                livestock, and mark boundaries.
              </li>
            </ul>

            <GeographyImage
              fileName="farm-elements-characteristics.png"
              alt="A 2D diagram showing farm elements: size, site, ownership, layout, fields, buildings, and fencing"
              caption="Farm elements and characteristics: size, site, ownership, layout, fields, buildings, and fencing."
            />
          </SubtopicCard>

          <SubtopicCard title="Processes on the Farm">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Ploughing:</strong> Turning over the soil to prepare it for
                planting. This aerates the soil and incorporates organic matter.
              </li>
              <li>
                <strong>Planting:</strong> Sowing seeds in the prepared soil. Can be
                done by hand (small farms) or using mechanical planters (large farms).
              </li>
              <li>
                <strong>Weeding:</strong> Removing weeds that compete with crops
                for nutrients, water, and sunlight. Can be done by hand or using
                herbicides.
              </li>
              <li>
                <strong>Fertilising:</strong> Adding nutrients to the soil to support
                plant growth. Can be organic or inorganic.
              </li>
              <li>
                <strong>Irrigation:</strong> Applying water to crops when rainfall
                is insufficient. Methods include sprinkler, drip, and flood irrigation.
              </li>
              <li>
                <strong>Pest control:</strong> Managing pests that can damage crops.
                Methods include chemical sprays, biological control, and crop rotation.
              </li>
              <li>
                <strong>Milking:</strong> The process of extracting milk from dairy
                cows. Can be done by hand or using milking machines.
              </li>
              <li>
                <strong>Harvesting:</strong> Gathering mature crops from the fields.
                Can be done by hand (e.g., maize picking) or using machinery (e.g., combine harvesters).
              </li>
              <li>
                <strong>Marketing:</strong> Selling farm produce to buyers. This can
                be done directly to consumers, through intermediaries, or through
                contracts with processors.
              </li>
            </ul>

            <GeographyImage
              fileName="farm-processes.png"
              alt="A 2D diagram showing farm processes: ploughing, planting, weeding, fertilising, irrigation, pest control, milking, harvesting, and marketing"
              caption="Farm processes: ploughing, planting, weeding, fertilising, irrigation, pest control, milking, harvesting, and marketing."
            />
          </SubtopicCard>

          <SubtopicCard title="Outputs from the Farm">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Crops:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Cash crops:</strong> Grown for sale and export (e.g.,
                    tobacco, cotton, sugar, coffee, tea).
                  </li>
                  <li>
                    <strong>Food crops:</strong> Grown for local consumption (e.g.,
                    maize, millet, sorghum, groundnuts, vegetables).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Animal products:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Livestock:</strong> Cattle, goats, sheep, pigs, poultry.
                  </li>
                  <li>
                    <strong>Dairy:</strong> Milk, butter, cheese, yogurt.
                  </li>
                  <li>
                    <strong>Meat:</strong> Beef, pork, mutton, poultry, and fish.
                  </li>
                  <li>
                    <strong>Other products:</strong> Eggs, wool, hides and skins,
                    honey, and manure.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Waste:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Organic waste:</strong> Crop residues (stalks, leaves),
                    animal manure, and food waste. Can be used as compost or fertiliser.
                  </li>
                  <li>
                    <strong>Inorganic waste:</strong> Plastic packaging, chemical
                    containers, and other non-biodegradable waste.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="farm-outputs.png"
              alt="A 2D diagram showing farm outputs: crops (cash crops, food crops), animal products (milk, meat, eggs), and waste (organic, inorganic)"
              caption="Farm outputs: crops, animal products, and waste."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Farm System Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Natural inputs:</strong> sunshine, rainfall, soil, temperature</li>
            <li><strong>Human inputs:</strong> labour, machinery, seeds, fertiliser, capital</li>
            <li><strong>Processes:</strong> ploughing, planting, weeding, harvesting</li>
            <li><strong>Outputs:</strong> crops, animal products, waste</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'farming-types',
      title: 'Farming Types in Africa',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Farming Types in Africa: A Systems Approach">
            <p>
              <strong>Definition:</strong> Different types of farming are practised
              across Africa. These range from traditional subsistence farming to
              modern commercial agriculture. Each type has its own characteristics,
              methods, and importance.
            </p>

            <GeographyImage
              fileName="farming-types-africa-map.png"
              alt="A map of Africa showing the distribution of different farming types: subsistence, commercial, nomadic, plantation, irrigation, co-operative, dairy, and ranching"
              caption="Distribution of farming types across Africa."
            />
          </SubtopicCard>

          <SubtopicCard title="1. Subsistence Farming">
            <p>
              <strong>Definition:</strong> Subsistence farming is farming that produces
              mainly for the farmer's own consumption. Surplus, if any, is sold locally.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Small farms (0.5-5 hectares).</li>
                  <li>Labour-intensive (family labour).</li>
                  <li>Low use of technology and machinery.</li>
                  <li>Low yields (low inputs).</li>
                  <li>Mixed farming (crops and livestock).</li>
                  <li>Diversity of crops to reduce risk.</li>
                </ul>
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Hand tools (hoes, axes, machetes).</li>
                  <li>Shifting cultivation (slash and burn) in some areas.</li>
                  <li>Intercropping (growing multiple crops together).</li>
                  <li>Rainfed farming (no irrigation).</li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Feeds the majority of Africa's rural population.</li>
                  <li>Provides employment and livelihoods.</li>
                  <li>Preserves traditional farming knowledge.</li>
                </ul>
              </li>
              <li>
                <strong>Case Study: Subsistence Farming in Zimbabwe's Communal Areas</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Location:</strong> Communal areas (e.g., Masvingo, Matabeleland South, Manicaland).</li>
                  <li><strong>Inputs:</strong> Family labour, hand tools, limited fertiliser.</li>
                  <li><strong>Processes:</strong> Hand ploughing, planting, weeding, harvesting.</li>
                  <li><strong>Outputs:</strong> Maize, millet, groundnuts, and some livestock.</li>
                  <li><strong>Challenges:</strong> Low yields, soil degradation, drought, and poverty.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="subsistence-farming-zimbabwe.png"
              alt="A realistic photograph showing subsistence farming in a communal area of Zimbabwe: small fields, hand tools, and family labour"
              caption="Subsistence farming in a communal area of Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Systems Approach</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Natural (sun, rain, soil) + Human (family labour, hand tools, limited capital).
              </li>
              <li>
                <strong>Processes:</strong> Ploughing (hand), planting, weeding, harvesting.
              </li>
              <li>
                <strong>Outputs:</strong> Food crops (maize, millet), some livestock, waste.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="2. Commercial Crop Farming">
            <p>
              <strong>Definition:</strong> Commercial crop farming is large-scale farming
              that produces crops for sale (cash crops). It is highly mechanised and
              uses modern technology.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Large farms (over 100 hectares).</li>
                  <li>High use of technology and machinery.</li>
                  <li>High inputs (fertiliser, pesticides, improved seeds).</li>
                  <li>High yields.</li>
                  <li>Specialised crops (monoculture).</li>
                  <li>Export-oriented.</li>
                </ul>
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Mechanised ploughing, planting, and harvesting.</li>
                  <li>Irrigation (in many areas).</li>
                  <li>Use of chemical fertilisers and pesticides.</li>
                  <li>Use of improved seed varieties.</li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Generates export revenue for African countries.</li>
                  <li>Provides employment.</li>
                  <li>Supports agro-processing industries.</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Tobacco:</strong> Zimbabwe, Malawi, Tanzania.</li>
                  <li><strong>Cotton:</strong> Mali, Burkina Faso, Zimbabwe.</li>
                  <li><strong>Coffee:</strong> Ethiopia, Kenya, Uganda, Tanzania.</li>
                  <li><strong>Tea:</strong> Kenya, Malawi, Tanzania.</li>
                  <li><strong>Sugar:</strong> South Africa, Mozambique, Zimbabwe.</li>
                </ul>
              </li>
              <li>
                <strong>Case Study: Tobacco Farming in Zimbabwe</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Location:</strong> Mashonaland (East, West, Central), parts of Manicaland.</li>
                  <li><strong>Inputs:</strong> Tobacco seedlings, fertiliser, chemicals, irrigation.</li>
                  <li><strong>Processes:</strong> Planting, weeding, irrigation, curing, grading, marketing.</li>
                  <li><strong>Outputs:</strong> Flue-cured tobacco for export.</li>
                  <li><strong>Challenges:</strong> Climate change, disease, and market volatility.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="commercial-tobacco-farming-zimbabwe.png"
              alt="A realistic photograph showing commercial tobacco farming in Zimbabwe: tobacco fields, curing barns, and harvesting"
              caption="Commercial tobacco farming in Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Systems Approach</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Natural (sun, rain, soil) + Human (machinery, fertiliser, chemicals, capital).
              </li>
              <li>
                <strong>Processes:</strong> Mechanised ploughing, planting, weeding, irrigation, harvesting, processing.
              </li>
              <li>
                <strong>Outputs:</strong> Cash crops (tobacco, cotton, sugar, coffee), waste.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="3. Commercial Ranching">
            <p>
              <strong>Definition:</strong> Commercial ranching is large-scale farming
              of livestock (cattle, sheep, goats) for meat, wool, and hides. It is
              practised in areas with extensive grazing land.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Large ranches (over 1,000 hectares).</li>
                  <li>Low inputs (extensive system).</li>
                  <li>Low labour per animal.</li>
                  <li>Specialised breeds (e.g., beef cattle, Merino sheep).</li>
                </ul>
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fencing and paddocks (rotational grazing).</li>
                  <li>Water supply (dams, boreholes).</li>
                  <li>Veterinary care (disease control).</li>
                  <li>Marketing through abattoirs and export markets.</li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Produces meat, wool, and hides for domestic and export markets.</li>
                  <li>Provides employment.</li>
                  <li>Uses land unsuitable for crops.</li>
                </ul>
              </li>
              <li>
                <strong>Case Study: Commercial Ranching in Zimbabwe</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Location:</strong> Matabeleland (South, North), parts of the Lowveld.</li>
                  <li><strong>Breeds:</strong> Beef cattle (Brahman, Hereford, Afrikaner).</li>
                  <li><strong>Inputs:</strong> Pasture, water, veterinary care, fencing.</li>
                  <li><strong>Processes:</strong> Breeding, calving, weaning, marketing.</li>
                  <li><strong>Outputs:</strong> Beef, hides, cattle for export.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="commercial-ranching-zimbabwe.png"
              alt="A realistic photograph showing commercial ranching in Matabeleland: cattle, pastures, and fencing"
              caption="Commercial ranching in Matabeleland, Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Systems Approach</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Natural (pasture, water, climate) + Human (labour, veterinary care, fencing).
              </li>
              <li>
                <strong>Processes:</strong> Breeding, grazing management, disease control, marketing.
              </li>
              <li>
                <strong>Outputs:</strong> Meat, hides, wool, manure.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="4. Dairy Farming">
            <p>
              <strong>Definition:</strong> Dairy farming is the production of milk
              and milk products for sale. It is often practised near urban areas
              to supply fresh milk.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Intensive farming (high inputs).</li>
                  <li>Specialised dairy breeds (Friesian, Jersey, Guernsey).</li>
                  <li>Requires year-round feed and water.</li>
                  <li>Near markets (cities, towns).</li>
                </ul>
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Zero-grazing or paddock grazing.</li>
                  <li>Mechanised milking (milking machines).</li>
                  <li>Artificial insemination for breeding.</li>
                  <li>Cold storage and refrigerated transport.</li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Provides milk and dairy products for urban populations.</li>
                  <li>Creates employment.</li>
                  <li>Supports agro-processing industries (cheese, butter, yogurt).</li>
                </ul>
              </li>
              <li>
                <strong>Case Study: Dairy Farming in the Eastern Highlands</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Location:</strong> Nyanga, Vumba, Chimanimani, and parts of the Midlands.</li>
                  <li><strong>Breeds:</strong> Friesian, Jersey, Ayrshire.</li>
                  <li><strong>Inputs:</strong> Pasture, feed, water, veterinary care.</li>
                  <li><strong>Processes:</strong> Milking (machine), pasteurisation, cooling, transport.</li>
                  <li><strong>Outputs:</strong> Milk, cheese, butter, yogurt.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="dairy-farming-zimbabwe.png"
              alt="A realistic photograph showing dairy farming in Zimbabwe: dairy cattle, milking parlour, and milk processing"
              caption="Dairy farming in Zimbabwe: production and processing."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Systems Approach</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Natural (pasture, water) + Human (labour, feed, machinery, veterinary care).
              </li>
              <li>
                <strong>Processes:</strong> Milking, pasteurisation, cooling, packaging, marketing.
              </li>
              <li>
                <strong>Outputs:</strong> Milk, dairy products (cheese, butter, yogurt), waste.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="5. Co-operative Farming">
            <p>
              <strong>Definition:</strong> Co-operative farming is where farmers pool
              their resources (land, labour, capital) to work together. They share
              inputs, machinery, and marketing.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Group of farmers working together.</li>
                  <li>Shared resources (machinery, land, labour).</li>
                  <li>Shared costs and benefits.</li>
                  <li>Common marketing of produce.</li>
                </ul>
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Collective planning and decision-making.</li>
                  <li>Shared use of machinery and equipment.</li>
                  <li>Bulk purchasing of inputs (fertiliser, seeds).</li>
                  <li>Collective marketing and processing.</li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Small farmers can access resources they cannot afford individually.</li>
                  <li>Better prices through collective bargaining.</li>
                  <li>Shared risk and support.</li>
                </ul>
              </li>
              <li>
                <strong>Case Study: Co-operative Farming in Zimbabwe</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Location:</strong> Resettlement areas and communal areas.</li>
                  <li><strong>Inputs:</strong> Shared machinery, group labour.</li>
                  <li><strong>Processes:</strong> Joint planning, shared planting and harvesting.</li>
                  <li><strong>Outputs:</strong> Crops for sale and home consumption.</li>
                  <li><strong>Challenges:</strong> Management issues, disagreements, and lack of capital.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="co-operative-farming-zimbabwe.png"
              alt="A realistic photograph showing co-operative farming in Zimbabwe: farmers working together in fields"
              caption="Co-operative farming in Zimbabwe: farmers working together."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Systems Approach</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Shared land, labour, machinery, capital, and inputs.
              </li>
              <li>
                <strong>Processes:</strong> Shared planning, planting, weeding, harvesting, marketing.
              </li>
              <li>
                <strong>Outputs:</strong> Crops shared among members, surplus sold.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="6. Nomadic Herding (Pastoralism)">
            <p>
              <strong>Definition:</strong> Nomadic herding is the movement of livestock
              from one grazing area to another in search of water and pasture. It is
              practised in arid and semi-arid areas.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Seasonal movement of livestock.</li>
                  <li>Low inputs (extensive).</li>
                  <li>Small herds (family-based).</li>
                  <li>Livelihood depends on livestock.</li>
                </ul>
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Herding with family labour.</li>
                  <li>Seasonal migration (transhumance).</li>
                  <li>Traditional knowledge of water sources and pasture.</li>
                  <li>Trade in livestock and livestock products.</li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Provides livelihoods for pastoral communities.</li>
                  <li>Uses land unsuitable for farming.</li>
                  <li>Produces meat, milk, and hides.</li>
                  <li>Part of cultural heritage.</li>
                </ul>
              </li>
              <li>
                <strong>Case Study: Nomadic Herding in the Sahel (West Africa)</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Location:</strong> Sahel region (Mali, Niger, Chad, Burkina Faso, etc.).</li>
                  <li><strong>Livestock:</strong> Cattle, goats, sheep, camels.</li>
                  <li><strong>Inputs:</strong> Pasture, water, seasonal rainfall.</li>
                  <li><strong>Processes:</strong> Seasonal migration, herding, trading.</li>
                  <li><strong>Outputs:</strong> Meat, milk, hides, and trade products.</li>
                  <li><strong>Challenges:</strong> Drought, desertification, and conflicts with farmers.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="nomadic-herding-sahel.png"
              alt="A realistic photograph showing nomadic herding in the Sahel: livestock and herders moving across the landscape"
              caption="Nomadic herding in the Sahel region of West Africa."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Systems Approach</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Natural (pasture, water) + Human (family labour, traditional knowledge).
              </li>
              <li>
                <strong>Processes:</strong> Seasonal migration, herding, trading.
              </li>
              <li>
                <strong>Outputs:</strong> Meat, milk, hides, traded goods.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="7. Plantation Agriculture">
            <p>
              <strong>Definition:</strong> Plantation agriculture is large-scale farming
              of a single crop for export. It is often owned by multinational companies
              and uses large amounts of labour.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Large estates (over 100 hectares).</li>
                  <li>Single crop (monoculture).</li>
                  <li>High inputs (fertiliser, pesticides, irrigation).</li>
                  <li>Labour-intensive (hired labour).</li>
                  <li>Export-oriented.</li>
                </ul>
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Mechanised farming where possible.</li>
                  <li>Irrigation to ensure year-round production.</li>
                  <li>Chemical inputs (fertilisers, pesticides).</li>
                  <li>Processing on-site (e.g., sugar mills, coffee processing).</li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Generates significant export revenue.</li>
                  <li>Provides large-scale employment.</li>
                  <li>Supports agro-processing industries.</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Sugar:</strong> South Africa, Mozambique, Zimbabwe (Triangle, Hippo Valley).</li>
                  <li><strong>Palm oil:</strong> Nigeria, Ghana, Côte d'Ivoire.</li>
                  <li><strong>Cocoa:</strong> Ghana, Côte d'Ivoire, Nigeria.</li>
                  <li><strong>Tea:</strong> Kenya, Malawi, Tanzania.</li>
                </ul>
              </li>
              <li>
                <strong>Case Study: Sugar Plantations in Zimbabwe (Lowveld)</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Location:</strong> Chiredzi, Triangle, Hippo Valley (Lowveld).</li>
                  <li><strong>Inputs:</strong> Irrigation water, fertiliser, labour.</li>
                  <li><strong>Processes:</strong> Planting, irrigation, harvesting, processing in sugar mills.</li>
                  <li><strong>Outputs:</strong> Sugar for domestic and export markets.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="sugar-plantation-zimbabwe.png"
              alt="A realistic photograph showing a sugar plantation in the Lowveld: sugarcane fields, irrigation, and harvesting"
              caption="Sugar plantation in the Lowveld, Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Systems Approach</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Natural (sun, water, soil) + Human (labour, fertiliser, machinery, capital).
              </li>
              <li>
                <strong>Processes:</strong> Planting, irrigation, harvesting, processing, packaging, marketing.
              </li>
              <li>
                <strong>Outputs:</strong> Processed product (sugar, tea, coffee, etc.), waste.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="8. Irrigation Farming">
            <p>
              <strong>Definition:</strong> Irrigation farming is the application of
              water to crops when rainfall is insufficient. It allows farming in
              areas with low rainfall.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Controlled water supply.</li>
                  <li>High inputs (irrigation infrastructure, energy).</li>
                  <li>High yields.</li>
                  <li>Allows multiple cropping (several harvests per year).</li>
                </ul>
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Surface (flood) irrigation:</strong> Water flows over the field.</li>
                  <li><strong>Sprinkler irrigation:</strong> Water is sprayed over crops.</li>
                  <li><strong>Drip irrigation:</strong> Water is delivered directly to plant roots.</li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Allows farming in arid and semi-arid areas.</li>
                  <li>Increases food production.</li>
                  <li>Supports commercial crop production (sugar, wheat, vegetables).</li>
                </ul>
              </li>
              <li>
                <strong>Case Study: Irrigation Farming in Zimbabwe (Lowveld)</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Location:</strong> Chiredzi, Triangle, Hippo Valley.</li>
                  <li><strong>Source of water:</strong> Save River, Runde River, and Lake Mutirikwi.</li>
                  <li><strong>Crops:</strong> Sugarcane, citrus, vegetables, wheat.</li>
                  <li><strong>Inputs:</strong> Irrigation infrastructure, labour, fertiliser, pesticides.</li>
                  <li><strong>Processes:</strong> Pumping water, irrigation, planting, harvesting, processing.</li>
                  <li><strong>Outputs:</strong> Sugar, citrus, vegetables for export and domestic markets.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="irrigation-farming-lowveld.png"
              alt="A realistic photograph showing irrigation farming in the Lowveld: irrigation equipment, crops, and water supply"
              caption="Irrigation farming in the Lowveld, Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Systems Approach</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Inputs:</strong> Natural (sun, soil, water from rivers) + Human (labour, irrigation equipment, energy, capital).
              </li>
              <li>
                <strong>Processes:</strong> Water pumping, irrigation, planting, weeding, harvesting, processing.
              </li>
              <li>
                <strong>Outputs:</strong> Crops (sugar, vegetables, fruits, wheat), waste.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Farming Types Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Subsistence:</strong> small, family labour, low inputs</li>
            <li><strong>Commercial:</strong> large, mechanised, high inputs</li>
            <li><strong>Ranching:</strong> large, extensive livestock</li>
            <li><strong>Dairy:</strong> intensive, near urban areas</li>
            <li><strong>Co-operative:</strong> shared resources</li>
            <li><strong>Nomadic:</strong> seasonal movement of livestock</li>
            <li><strong>Plantation:</strong> large, single crop, export</li>
            <li><strong>Irrigation:</strong> water supply in dry areas</li>
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
            Agricultural Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the factors influencing farming, the farm as a system, and the
            different farming types practised in Africa – from subsistence farming
            to commercial agriculture, ranching, dairy, co-operative, nomadic,
            plantation, and irrigation farming.
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
                  <strong className="text-white">Factors Influencing Farming:</strong> Physical
                  (climate, soil, relief, water), Economic (markets, transport, inputs, subsidies),
                  Social (labour, education, land tenure), and Political (policies, land reform,
                  infrastructure) all affect farm output.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farm as a System:</strong> Natural inputs
                  (sunshine, rainfall, soil), Human inputs (labour, machinery, seeds, fertiliser,
                  capital), Processes (ploughing, planting, weeding, harvesting), and Outputs
                  (crops, animal products, waste) form a complete system.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farming Types:</strong> Subsistence (small,
                  family labour), Commercial (large, mechanised), Ranching (extensive livestock),
                  Dairy (intensive, near urban), Co-operative (shared resources), Nomadic
                  (seasonal movement), Plantation (large, single crop, export), and Irrigation
                  (water supply in dry areas) – each with distinct characteristics, methods,
                  and importance.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Agricultural Studies topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">Settlement Studies</span>?</>
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
                alert('Proceed to Settlement Studies (next topic)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Settlement Studies →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgriculturalStudies;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/geography/
   Use a mix of 2D diagram style and realistic photographs.

   --- FACTORS INFLUENCING FARMING IMAGES (2D DIAGRAM AND REALISTIC) ---

   1. physical-factors-farming.png
      A 2D diagram showing physical factors influencing farming: climate (temperature, rainfall, sunshine, frost), soil (fertility, pH, texture), relief (slope, altitude, aspect), and water availability (rainfed, irrigation).
      Use icons and brief explanations for each factor.

   2. economic-factors-farming.png
      A 2D diagram showing economic factors influencing farming: market access, transport costs, input prices, government subsidies, access to credit, and demand for products.
      Use icons and brief explanations for each factor.

   3. social-factors-farming.png
      A 2D diagram showing social factors influencing farming: labour availability, education and skills, land tenure, population pressure, and traditional practices.
      Use icons and brief explanations for each factor.

   4. political-factors-farming.png
      A 2D diagram showing political factors influencing farming: government policies, land reform, trade policies, political stability, and infrastructure investment.
      Use icons and brief explanations for each factor.

   5. maize-production-zimbabwe.png
      A realistic photograph showing maize production in Zimbabwe: large maize fields, farmers harvesting, or maize cobs.
      Show the scale of production and the farming activities.

   6. dairy-farming-eastern-highlands.png
      A realistic photograph showing dairy farming in the Eastern Highlands: dairy cattle grazing on lush pasture, milking parlour, or milk processing.
      Show the green, cool environment typical of the area.

   7. market-gardening-lowveld.png
      A realistic photograph showing market gardening in the Lowveld: irrigation equipment, vegetable fields, or harvesting of vegetables.
      Show the contrast between the dry environment and the irrigated fields.

   --- FARM SYSTEM IMAGES (2D DIAGRAM STYLE) ---

   8. farm-system-model.png
      A 2D diagram showing the farm system model with inputs, processes, and outputs.
      Show natural inputs (sun, rain, soil), human inputs (labour, machinery, seeds, fertiliser, capital), processes (ploughing, planting, weeding, harvesting), and outputs (crops, animal products, waste).
      Use arrows to show the flow.

   9. natural-inputs-farming.png
      A 2D diagram showing natural inputs to a farm: sunshine, rainfall, soil, temperature, and wind.
      Use icons and brief explanations for each input.

   10. human-inputs-farming.png
       A 2D diagram showing human inputs to a farm: labour, machinery and equipment, seeds and livestock, fertiliser, pesticides and herbicides, and capital (money).
       Use icons and brief explanations for each input.

   11. farm-elements-characteristics.png
       A 2D diagram showing farm elements: size, site, ownership, layout, fields, buildings, and fencing.
       Use icons and brief explanations for each element.

   12. farm-processes.png
       A 2D diagram showing farm processes: ploughing, planting, weeding, fertilising, irrigation, pest control, milking, harvesting, and marketing.
       Use icons and brief explanations for each process.

   13. farm-outputs.png
       A 2D diagram showing farm outputs: crops (cash crops, food crops), animal products (milk, meat, eggs, wool), and waste (organic, inorganic).
       Use icons and brief explanations for each output.

   --- FARMING TYPES IMAGES (2D DIAGRAM AND REALISTIC) ---

   14. farming-types-africa-map.png
       A map of Africa showing the distribution of different farming types: subsistence, commercial, nomadic, plantation, irrigation, co-operative, dairy, and ranching.
       Use different colours or patterns for each type with a legend.

   15. subsistence-farming-zimbabwe.png
       A realistic photograph showing subsistence farming in a communal area of Zimbabwe: small fields, hand tools, family labour.
       Show the traditional nature of the farming.

   16. commercial-tobacco-farming-zimbabwe.png
       A realistic photograph showing commercial tobacco farming in Zimbabwe: tobacco fields, curing barns, or harvesting.
       Show the scale and equipment used.

   17. commercial-ranching-zimbabwe.png
       A realistic photograph showing commercial ranching in Matabeleland: cattle on extensive pastures, fencing, or water points.
       Show the extensive nature of the ranching.

   18. dairy-farming-zimbabwe.png
       A realistic photograph showing dairy farming in Zimbabwe: dairy cattle, milking parlour, or milk processing.
       Show the intensive nature of dairy farming.

   19. co-operative-farming-zimbabwe.png
       A realistic photograph showing co-operative farming in Zimbabwe: farmers working together in fields or sharing equipment.
       Show the collective nature of the farming.

   20. nomadic-herding-sahel.png
       A realistic photograph showing nomadic herding in the Sahel region of West Africa: livestock and herders moving across the landscape.
       Show the traditional lifestyle and movement.

   21. sugar-plantation-zimbabwe.png
       A realistic photograph showing a sugar plantation in the Lowveld: sugarcane fields, irrigation, or harvesting.
       Show the large-scale, commercial nature of plantation agriculture.

   22. irrigation-farming-lowveld.png
       A realistic photograph showing irrigation farming in the Lowveld: irrigation equipment, crops, and water supply.
       Show the technology used for irrigation.

   ============================================================ */