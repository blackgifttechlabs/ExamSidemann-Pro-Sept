import React, { useState, useRef } from 'react';

/**
 * Topic: Settlement and Population Studies
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const SettlementAndPopulationStudies: React.FC = () => {
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
  const SettlementImage: React.FC<{
    fileName: string;
    alt: string;
    caption: string;
  }> = ({ fileName, alt, caption }) => {
    const [isMissing, setIsMissing] = useState(false);

    if (isMissing) return null;
    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        <img
          src={`/images/settlement/${fileName}`}
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

  // ---------- Section content ----------
  const sections: TopicSection[] = [
    {
      id: 'rural-settlement-patterns',
      title: 'Factors Influencing Rural Settlement Patterns',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Rural Settlement Patterns?">
            <p>
              <strong>Definition:</strong> A rural settlement is a community where
              people live in villages, hamlets, or isolated homesteads, often
              engaged in agriculture, forestry, or mining. Settlement pattern refers
              to the shape and layout of these settlements – for example, clustered
              (nucleated), dispersed, or linear.
            </p>
            <p>
              The pattern of rural settlements is influenced by a combination of
              physical, social, economic, and cultural factors. Understanding these
              helps explain why villages look the way they do and why they are
              located where they are.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Physical Factors">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Relief (landform):</strong> Flat, well‑drained land is
                preferred for farming and building. Steep slopes are avoided.
                Valleys and plains often have linear or clustered settlements.
              </li>
              <li>
                <strong>Water supply:</strong> Access to rivers, lakes, or springs
                is crucial. Settlements often grow along water sources (linear pattern)
                or around water points (clustered).
              </li>
              <li>
                <strong>Soil fertility:</strong> Rich soils attract farmers, leading
                to denser settlement patterns. Poor soils lead to dispersed settlements
                or abandonment.
              </li>
              <li>
                <strong>Climate:</strong> Moderate rainfall and temperatures support
                agriculture. Arid or very cold areas have sparse settlement.
              </li>
              <li>
                <strong>Natural resources:</strong> Forests, minerals, and grazing
                land influence where people settle to exploit these resources.
              </li>
            </ul>
            <SettlementImage
              fileName="physical-factors-rural-settlement.png"
              alt="A 2D diagram showing physical factors: relief, water, soil, climate, and natural resources influencing rural settlement patterns"
              caption="Physical factors influencing rural settlement patterns."
            />
          </SubtopicCard>

          <SubtopicCard title="Social, Economic, and Cultural Factors">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Social:</strong> Family ties, tribal affiliations, and
                community bonds encourage clustered settlements. Shared services
                (schools, clinics) also promote nucleation.
              </li>
              <li>
                <strong>Economic:</strong> Access to markets, roads, and employment
                opportunities draws people together. Trade routes often create
                linear settlements.
              </li>
              <li>
                <strong>Cultural:</strong> Traditions, religion, and land‑tenure
                systems affect settlement layout. For example, some cultures prefer
                dispersed homesteads to maintain privacy and farmland.
              </li>
              <li>
                <strong>Government policy:</strong> Growth points and service centres
                are deliberately established by the state to stimulate development
                and provide services in rural areas.
              </li>
            </ul>
            <SettlementImage
              fileName="social-economic-cultural-rural-settlement.png"
              alt="A 2D diagram showing social, economic, and cultural factors influencing rural settlement patterns"
              caption="Social, economic, and cultural factors influencing rural settlement patterns."
            />
          </SubtopicCard>

          <SubtopicCard title="African Rural Settlement Patterns (Examples)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Barotse Plain (Zambia)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pattern:</strong> Linear and clustered villages along the
                Zambezi River and its floodplains.
              </li>
              <li>
                <strong>Why?</strong> The plain is flooded annually, so people
                build on higher ground (mounds) and move seasonally. Fishing and
                cattle grazing are the main activities.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Gezira (Sudan)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pattern:</strong> Clustered villages along irrigation canals
                and the Blue Nile.
              </li>
              <li>
                <strong>Why?</strong> The Gezira Scheme is a large irrigation project
                for cotton and other crops. Settlements are concentrated near water
                and farm blocks.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Southern Nigeria</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pattern:</strong> Dispersed and compound‑type settlements
                among the Yoruba and Igbo.
              </li>
              <li>
                <strong>Why?</strong> The tropical rainforest environment and
                traditional farming systems (shifting cultivation) encourage
                dispersed homesteads. However, some areas have dense clustering
                due to trade and cultural ties.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Growth Points in Zimbabwe</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Growth points are planned rural service
                centres designed to decentralise development and provide employment.
              </li>
              <li>
                <strong>Examples:</strong> Mvurwi, Macheke, and Nembudziya.
              </li>
              <li>
                <strong>Features:</strong> They have clinics, schools, markets, and
                small industries to serve surrounding farming communities.
              </li>
            </ul>
            <SettlementImage
              fileName="african-rural-settlement-examples.png"
              alt="A map of Africa showing rural settlement patterns in Barotse Plain, Gezira, and southern Nigeria"
              caption="African rural settlement patterns: Barotse Plain (Zambia), Gezira (Sudan), and southern Nigeria."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rural settlement:</strong> community in countryside</li>
            <li><strong>Nucleated:</strong> clustered around a centre</li>
            <li><strong>Dispersed:</strong> scattered individual farms</li>
            <li><strong>Linear:</strong> along a road or river</li>
            <li><strong>Growth point:</strong> planned rural service centre</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'rural-resettlement',
      title: 'Rural Resettlement in Zimbabwe and Africa',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Rural Resettlement?">
            <p>
              <strong>Definition:</strong> Rural resettlement is the planned
              movement of people from one rural area to another. It is usually
              carried out by governments to address land inequalities, reduce
              pressure on overpopulated areas, or develop new agricultural regions.
            </p>
            <p>
              In Africa, resettlement programmes have been used in countries like
              Zimbabwe, Kenya, Tanzania, and Ethiopia. They aim to improve rural
              livelihoods and achieve more equitable land distribution.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Factors Influencing Resettlement">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Land scarcity:</strong> Population pressure in some areas
                makes land too small for farming. Resettlement moves people to
                underutilised land.
              </li>
              <li>
                <strong>Land reform:</strong> Correcting historical inequalities
                (e.g., colonial land grabs) – a key driver in Zimbabwe.
              </li>
              <li>
                <strong>Environmental degradation:</strong> Overgrazing, deforestation,
                and soil erosion force people to relocate to more sustainable areas.
              </li>
              <li>
                <strong>Development projects:</strong> Dams, irrigation schemes, or
                mining projects may require displacement and resettlement.
              </li>
              <li>
                <strong>Government policy:</strong> Nations may actively plan
                resettlement to boost agricultural production or reduce regional
                disparities.
              </li>
            </ul>
            <SettlementImage
              fileName="resettlement-factors.png"
              alt="A 2D diagram showing factors influencing rural resettlement: land scarcity, land reform, degradation, projects, and policy"
              caption="Factors influencing rural resettlement."
            />
          </SubtopicCard>

          <SubtopicCard title="Aims, Methods, Problems, and Achievements">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Aims</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide land to the landless and poor.</li>
              <li>Increase agricultural productivity.</li>
              <li>Reduce rural poverty and inequality.</li>
              <li>Decongest overpopulated areas.</li>
              <li>Promote regional development.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Identification:</strong> Government identifies suitable land
                with water, soil, and access.
              </li>
              <li>
                <strong>Selection:</strong> Beneficiaries are chosen (often from
                overcrowded areas).
              </li>
              <li>
                <strong>Allocation:</strong> Plots are surveyed and allocated, with
                infrastructure (roads, boreholes) provided.
              </li>
              <li>
                <strong>Support:</strong> Extension services, seeds, tools, and
                training are offered.
              </li>
              <li>
                <strong>Monitoring:</strong> Government tracks progress and provides
                follow-up support.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Problems</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Poor planning:</strong> Some schemes lack adequate water,
                soil, or market access.
              </li>
              <li>
                <strong>Lack of resources:</strong> Insufficient funding for
                infrastructure and inputs.
              </li>
              <li>
                <strong>Political interference:</strong> Resettlement may be driven
                by political motives, not needs.
              </li>
              <li>
                <strong>Social disruption:</strong> Moving people breaks community
                ties and can cause conflict.
              </li>
              <li>
                <strong>Environmental damage:</strong> Clearing new land may lead
                to deforestation and soil erosion.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Achievements</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Zimbabwe:</strong> The Fast Track Land Reform Programme
                (2000s) resettled thousands of families, though outcomes are mixed.
              </li>
              <li>
                <strong>Kenya:</strong> The Mwea Irrigation Scheme resettled farmers
                and increased rice production.
              </li>
              <li>
                <strong>Tanzania:</strong> Ujamaa villages aimed to collectivise
                agriculture and improve social services.
              </li>
              <li>
                <strong>Ethiopia:</strong> Resettlement in the western lowlands has
                opened new farming areas.
              </li>
            </ul>
            <SettlementImage
              fileName="resettlement-zimbabwe-africa.png"
              alt="A realistic photograph showing resettlement schemes in Zimbabwe or Africa: new farms, houses, and infrastructure"
              caption="Rural resettlement in Zimbabwe and Africa – examples of new farming communities."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Resettlement Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Aims:</strong> land, productivity, poverty reduction</li>
            <li><strong>Methods:</strong> land allocation, support, monitoring</li>
            <li><strong>Problems:</strong> poor planning, lack of resources, conflicts</li>
            <li><strong>Examples:</strong> Zimbabwe, Kenya, Tanzania, Ethiopia</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'urbanisation',
      title: 'Urbanisation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Urbanisation?">
            <p>
              <strong>Definition:</strong> Urbanisation is the process by which an
              increasing proportion of a country's population lives in towns and
              cities. It involves the growth of urban areas, both in number and in
              size, and the migration of people from rural to urban areas.
            </p>
            <p>
              Globally, more than half of the world's population now lives in urban
              areas. The process is fastest in developing countries, where cities
              are expanding rapidly.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Driving Factors Behind Urbanisation">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Economic Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Better job opportunities in industry and services.</li>
              <li>Higher wages and more reliable incomes in cities.</li>
              <li>Access to markets and business networks.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Social Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Better education, healthcare, and housing.</li>
              <li>Access to entertainment, culture, and social networks.</li>
              <li>Family and friends already in the city (chain migration).</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Political Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Government investment in urban infrastructure.</li>
              <li>Political stability in cities (vs. rural conflicts).</li>
              <li>Policies that favour urban development.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Physical Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Cities often located in favourable environments (coasts, rivers).</li>
              <li>Climate and natural resources attract settlement.</li>
            </ul>
            <SettlementImage
              fileName="urbanisation-drivers.png"
              alt="A 2D diagram showing economic, social, political, and physical factors driving urbanisation"
              caption="Factors driving urbanisation worldwide."
            />
          </SubtopicCard>

          <SubtopicCard title="Problems of Urbanisation and Solutions">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Problems</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Housing shortages:</strong> Informal settlements (slums) grow rapidly.</li>
              <li><strong>Unemployment:</strong> Not enough jobs for all migrants.</li>
              <li><strong>Traffic congestion:</strong> More vehicles, longer travel times.</li>
              <li><strong>Pollution:</strong> Air, water, and noise pollution affect health.</li>
              <li><strong>Inadequate services:</strong> Water, sanitation, electricity, and waste management are overwhelmed.</li>
              <li><strong>Crime and social problems:</strong> Inequality and anonymity can lead to crime.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Solutions</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Urban planning:</strong> Zoning, green belts, and satellite towns.</li>
              <li><strong>Investment in infrastructure:</strong> Expand water, transport, and power networks.</li>
              <li><strong>Affordable housing schemes:</strong> Government-built flats and slum upgrading.</li>
              <li><strong>Job creation:</strong> Encourage industries and small businesses.</li>
              <li><strong>Decentralisation:</strong> Develop secondary cities and growth points to reduce pressure on mega-cities.</li>
              <li><strong>Environmental management:</strong> Pollution controls, recycling, and green spaces.</li>
            </ul>
            <SettlementImage
              fileName="urbanisation-problems-solutions.png"
              alt="A split 2D diagram showing urban problems (housing, traffic, pollution) and solutions (planning, investment, housing)"
              caption="Problems of urbanisation and possible solutions."
            />
          </SubtopicCard>

          <SubtopicCard title="Case Studies: Urbanisation in Developed and Developing Countries">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Developed Country: London (UK)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Urbanisation pattern:</strong> Industrial revolution drove growth; now stabilised with suburbanisation.</li>
              <li><strong>Problems:</strong> High housing costs, congestion, pollution, social inequality.</li>
              <li><strong>Solutions:</strong> Green belt, congestion charging, affordable housing targets, Crossrail.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Developing Country: Mexico City (Mexico)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Urbanisation pattern:</strong> Rapid growth due to rural‑urban migration; now one of the largest cities.</li>
              <li><strong>Problems:</strong> Slums, air pollution, water shortages, traffic, crime.</li>
              <li><strong>Solutions:</strong> Metro expansion, bike lanes, slum upgrading, water recycling.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Developing Country: Gaborone (Botswana)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Pattern:</strong> Fast growth driven by diamond mining and government employment.</li>
              <li><strong>Problems:</strong> Urban sprawl, limited public transport, unemployment.</li>
              <li><strong>Solutions:</strong> Planned extension, bus rapid transit, and housing schemes.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Developing Country: Calcutta (Kolkata, India)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Pattern:</strong> High density, poor infrastructure, large informal sector.</li>
              <li><strong>Problems:</strong> Overcrowding, poverty, waterlogging, pollution.</li>
              <li><strong>Solutions:</strong> Metro railway, slum rehabilitation, river cleanup.</li>
            </ul>
            <SettlementImage
              fileName="urbanisation-case-studies.png"
              alt="A 2D diagram comparing urbanisation in London, Mexico City, Gaborone, and Calcutta"
              caption="Case studies of urbanisation in developed (London) and developing countries (Mexico City, Gaborone, Calcutta)."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Urbanisation Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Urbanisation:</strong> growth of cities</li>
            <li><strong>Drivers:</strong> economic, social, political, physical</li>
            <li><strong>Problems:</strong> housing, jobs, pollution, services</li>
            <li><strong>Solutions:</strong> planning, investment, decentralisation</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'town-morphology',
      title: 'Town Morphology and Functional Zones',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Town Morphology?">
            <p>
              <strong>Definition:</strong> Town morphology refers to the form,
              structure, and layout of a town or city – its physical shape and
              the arrangement of its land uses (residential, commercial, industrial,
              etc.).
            </p>
            <p>
              Geographers have developed models to explain the internal structure
              of cities. The two most famous are the concentric zone model and the
              sector model.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Simple Models of Urban Structure">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Concentric Zone Model (Burgess, 1925)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Structure:</strong> City grows outward from a central
                business district (CBD) in a series of rings:
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>1. CBD (shops, offices, entertainment)</li>
                  <li>2. Zone of transition (industry, poor housing, slums)</li>
                  <li>3. Zone of working‑class homes (older terraced houses)</li>
                  <li>4. Zone of better housing (middle‑class suburbs)</li>
                  <li>5. Commuter zone (wealthy suburbs, rural‑urban fringe)</li>
                </ul>
              </li>
              <li>
                <strong>Assumptions:</strong> Flat land, free market, equal transport
                in all directions.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sector Model (Hoyt, 1939)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Structure:</strong> City grows in wedges or sectors
                radiating from the CBD, along transport routes.
              </li>
              <li>
                <strong>Key idea:</strong> High‑rent residential areas develop in
                one sector, low‑rent in another, and industry in a third.
              </li>
              <li>
                <strong>Why?</strong> Transport routes (railways, roads) and
                physical features (rivers, coasts) guide development.
              </li>
            </ul>

            <SettlementImage
              fileName="urban-models-concentric-sector.png"
              alt="A 2D diagram comparing the concentric zone model and the sector model of urban structure"
              caption="Concentric zone model (Burgess) and sector model (Hoyt)."
            />
          </SubtopicCard>

          <SubtopicCard title="Evaluating the Models Against African Examples">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Strengths</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Both models provide a useful starting point for understanding urban land use.</li>
              <li>They highlight the importance of the CBD and transport links.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Weaknesses – Are They Useful for African Cities?</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Colonial legacy:</strong> Many African cities have a dual
                structure – a modern centre (colonial) and traditional areas (indigenous).
              </li>
              <li>
                <strong>Informal sector:</strong> Large areas of informal housing
                (slums) and street trading do not fit the neat zones.
              </li>
              <li>
                <strong>Multiple centres:</strong> Many African cities have several
                business nodes (e.g., Harare has the CBD, but also Avondale, Borrowdale).
              </li>
              <li>
                <strong>Ethnic and tribal segregation:</strong> Historical patterns
                of land allocation create ethnic neighbourhoods.
              </li>
              <li>
                <strong>Rapid growth:</strong> Peripheral sprawl and unplanned
                settlements make the ring structure less clear.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">African Examples</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Nairobi (Kenya):</strong> Has a CBD, but also informal
                settlements (Kibera) and industrial areas along the railway.
                The sector model fits better because of transport routes.
              </li>
              <li>
                <strong>Lagos (Nigeria):</strong> Dispersed business centres
                (Victoria Island, Ikeja) and extensive slums; neither model fits well.
              </li>
              <li>
                <strong>Harare (Zimbabwe):</strong> A small CBD with high‑income
                northern suburbs (Borrowdale) and low‑income southern areas
                (Highfield) – a sector pattern influenced by colonial racial zoning.
              </li>
            </ul>
            <SettlementImage
              fileName="urban-models-african-cities.png"
              alt="A 2D diagram evaluating concentric and sector models against African city examples like Nairobi, Lagos, and Harare"
              caption="Evaluating urban models against African cities."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Town Morphology</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Morphology:</strong> form and layout of a city</li>
            <li><strong>Concentric:</strong> rings around CBD</li>
            <li><strong>Sector:</strong> wedges along transport</li>
            <li><strong>African cities:</strong> often less neat, informal sectors</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'urban-functions-sphere',
      title: 'Urban Functions and Sphere of Influence',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Urban Functions?">
            <p>
              <strong>Definition:</strong> Urban functions are the services and
              activities provided by a town or city to its own population and to
              the surrounding hinterland. These include retail, education, health,
              administration, entertainment, transport, and industry.
            </p>
            <p>
              The <strong>sphere of influence</strong> (or catchment area) is the
              region that a town serves – the area from which people travel to use
              its services. Larger cities have larger spheres.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Types of Urban Functions">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Central Place functions:</strong> Services like shops,
                schools, clinics, and banks that serve daily needs.
              </li>
              <li>
                <strong>Specialist functions:</strong> Higher‑order services like
                universities, specialist hospitals, courts, and airports – found
                only in large cities.
              </li>
              <li>
                <strong>Administrative functions:</strong> Government offices,
                parliament, regional headquarters.
              </li>
              <li>
                <strong>Economic functions:</strong> Industry, commerce, finance,
                and transport hubs.
              </li>
              <li>
                <strong>Cultural and recreational:</strong> Museums, theatres,
                sports stadiums, parks.
              </li>
            </ul>
            <SettlementImage
              fileName="urban-functions.png"
              alt="A 2D diagram showing different urban functions: retail, health, education, administration, industry, culture"
              caption="Types of urban functions."
            />
          </SubtopicCard>

          <SubtopicCard title="Sphere of Influence – Hierarchy of Settlements">
            <p>
              Settlements are arranged in a hierarchy from small villages to large
              cities. The higher the settlement in the hierarchy, the more functions
              it has and the larger its sphere of influence.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Village:</strong> Basic services (primary school, small shop,
                clinic) – sphere of a few kilometres.
              </li>
              <li>
                <strong>Small town:</strong> Secondary school, bank, market – sphere
                of several towns.
              </li>
              <li>
                <strong>Large city:</strong> University, specialist hospital, airport,
                regional government – sphere of the whole region or country.
              </li>
              <li>
                <strong>Mega‑city:</strong> Global functions (financial centre,
                international airport, world‑class culture) – sphere of global reach.
              </li>
            </ul>
            <SettlementImage
              fileName="sphere-of-influence.png"
              alt="A 2D diagram showing settlement hierarchy and sphere of influence: village, town, city, mega-city"
              caption="Settlement hierarchy and sphere of influence."
            />
          </SubtopicCard>

          <SubtopicCard title="Study of Functions in Zimbabwe and Africa">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Zimbabwe Examples</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Harare:</strong> National capital – highest order functions
                (parliament, supreme court, international airport, major banks,
                universities). Sphere covers the whole country and beyond.
              </li>
              <li>
                <strong>Bulawayo:</strong> Industrial and commercial centre – sphere
                covers the southern and western regions.
              </li>
              <li>
                <strong>Mutare:</strong> Regional centre for Manicaland – serves the
                eastern provinces and eastern highlands.
              </li>
              <li>
                <strong>Growth points (e.g., Mvurwi):</strong> Low‑order functions
                – serve local farming communities within a 20‑30 km radius.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">African Examples</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Nairobi (Kenya):</strong> East African hub – functions:
                UNEP, regional banking, transport hub. Sphere covers East Africa.
              </li>
              <li>
                <strong>Lagos (Nigeria):</strong> Megacity – financial and
                commercial centre for West Africa.
              </li>
              <li>
                <strong>Gaborone (Botswana):</strong> Capital – functions:
                government, diamond industry, education – sphere covers Botswana.
              </li>
            </ul>
            <SettlementImage
              fileName="urban-functions-zimbabwe-africa.png"
              alt="A map of Zimbabwe and Africa showing urban centres and their spheres of influence"
              caption="Urban functions and spheres of influence in Zimbabwe and Africa."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Functions &amp; Sphere</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Functions:</strong> services a town provides</li>
            <li><strong>Sphere of influence:</strong> area served</li>
            <li><strong>Hierarchy:</strong> village → town → city → mega-city</li>
            <li><strong>Zimbabwe:</strong> Harare (national), Bulawayo (regional)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'quality-of-life',
      title: 'Quality of Rural and Urban Life',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Quality of Life?">
            <p>
              <strong>Definition:</strong> Quality of life refers to the general
              well‑being of individuals and communities. It encompasses not only
              material wealth (income, housing) but also health, education, social
              connections, environment, and personal satisfaction.
            </p>
            <p>
              In this section, we compare the quality of life in rural and urban
              areas, using examples from Zimbabwe and other African countries.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Advantages and Disadvantages of Rural Life">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Advantages</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Cleaner environment (fresh air, less pollution).</li>
              <li>Lower cost of living (land, food).</li>
              <li>Strong community ties and cultural traditions.</li>
              <li>Less traffic, noise, and crime.</li>
              <li>Access to natural resources (wood, water, land for farming).</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Disadvantages</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Limited access to healthcare, education, and other services.</li>
              <li>Poor infrastructure (bad roads, unreliable electricity).</li>
              <li>Fewer job opportunities, lower incomes.</li>
              <li>Isolation and lack of entertainment.</li>
              <li>Vulnerability to droughts, floods, and crop failure.</li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Advantages and Disadvantages of Urban Life">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Advantages</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Better access to healthcare, schools, and universities.</li>
              <li>More employment opportunities and higher wages.</li>
              <li>Good transport and communication networks.</li>
              <li>Variety of entertainment, restaurants, and culture.</li>
              <li>Better housing and utilities (water, electricity, internet).</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Disadvantages</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>High cost of living (rent, transport, food).</li>
              <li>Pollution, noise, and overcrowding.</li>
              <li>Traffic congestion and long commutes.</li>
              <li>Higher crime rates and social inequality.</li>
              <li>Stress and lack of community spirit.</li>
            </ul>
            <SettlementImage
              fileName="rural-urban-quality-of-life.png"
              alt="A split 2D diagram comparing advantages and disadvantages of rural and urban life"
              caption="Comparing quality of life in rural and urban areas."
            />
          </SubtopicCard>

          <SubtopicCard title="How Various Factors Affect Quality of Life (Zimbabwe/Africa Case Studies)">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Work:</strong> Urban areas offer formal jobs, but many are
                in the informal sector. Rural work is mainly farming, often
                subsistence and weather‑dependent.
              </li>
              <li>
                <strong>Health:</strong> Urban hospitals are better equipped, but
                overstretched. Rural clinics are scarce, and many rely on traditional
                healers. HIV/AIDS and malaria are significant challenges.
              </li>
              <li>
                <strong>Education:</strong> Urban schools have better facilities and
                qualified teachers. Rural schools often lack resources, and children
                may drop out to help on farms.
              </li>
              <li>
                <strong>Transport:</strong> Urban areas have buses, taxis, and roads.
                Rural areas have poor roads, making travel difficult, especially in
                rainy seasons.
              </li>
              <li>
                <strong>Nutrition:</strong> Rural families often grow their own food
                but may suffer from seasonal shortages. Urban families buy food but
                may lack variety or affordability.
              </li>
              <li>
                <strong>Water:</strong> Urban areas have piped water, though
                shortages occur. Rural areas rely on boreholes, wells, and rivers
                – quality may be poor.
              </li>
              <li>
                <strong>Goods and services:</strong> Urban areas have shops, markets,
                and banks. Rural areas have limited options, sometimes only periodic
                markets.
              </li>
              <li>
                <strong>Social amenities:</strong> Urban areas have parks, cinemas,
                and sports. Rural areas have community gatherings, ceremonies, and
                traditional events.
              </li>
            </ul>
            <SettlementImage
              fileName="quality-of-life-zimbabwe.png"
              alt="A 2D diagram showing how work, health, education, transport, nutrition, water, goods, and social amenities affect quality of life in Zimbabwe"
              caption="Factors affecting quality of life in Zimbabwe – rural vs urban."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Quality of Life</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Rural:</strong> clean, cheap, community – but poor services</li>
            <li><strong>Urban:</strong> jobs, services, culture – but expensive, stressful</li>
            <li><strong>Key factors:</strong> work, health, education, transport</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'distribution-population-africa',
      title: 'Distribution of Population in Africa',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Population Distribution in Africa – The Pattern">
            <p>
              <strong>Definition:</strong> Population distribution refers to the
              spread of people across a geographical area. In Africa, population
              is very unevenly distributed – some areas are densely populated,
              while others are almost empty.
            </p>
            <p>
              The map of Africa shows that population is concentrated in certain
              regions: along the Nile Valley, around the Great Lakes, in West Africa
              (Nigeria, Ghana), and along the coasts. Many interior areas are sparsely
              populated.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Factors Explaining the Variation in Population Distribution">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Physical Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Climate:</strong> Favorable climates (moderate rainfall,
                warm temperatures) attract people. Arid regions (Sahara, Kalahari)
                and humid tropical areas (Congo Basin) have low densities.
              </li>
              <li>
                <strong>Water supply:</strong> Rivers, lakes, and groundwater
                support settlement – e.g., Nile Valley, Lake Victoria basin.
              </li>
              <li>
                <strong>Relief:</strong> Flat plains and valleys are preferred;
                mountains and steep slopes have fewer people.
              </li>
              <li>
                <strong>Soils:</strong> Fertile soils (volcanic, alluvial) support
                agriculture – e.g., Ethiopian highlands, East African Rift.
              </li>
              <li>
                <strong>Natural resources:</strong> Minerals, forests, and grazing
                land attract populations (e.g., gold in South Africa, oil in Nigeria).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Human Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Economic opportunities:</strong> Jobs in cities, mines,
                and plantations draw people – e.g., South Africa's Gauteng region.
              </li>
              <li>
                <strong>Infrastructure:</strong> Transport routes (roads, railways)
                and ports encourage settlement – e.g., coastal cities.
              </li>
              <li>
                <strong>Historical factors:</strong> Colonial trade routes, missions,
                and administrative centres created population clusters.
              </li>
              <li>
                <strong>Political stability:</strong> Peaceful areas attract migrants
                – e.g., Botswana vs. conflict zones.
              </li>
              <li>
                <strong>Cultural and ethnic factors:</strong> Tribal homelands and
                traditional migration patterns influence distribution.
              </li>
            </ul>

            <SettlementImage
              fileName="africa-population-distribution.png"
              alt="A map of Africa showing population density – high density in West Africa, Nile Valley, Great Lakes, and coasts; low density in Sahara, Congo Basin, and deserts"
              caption="Distribution of population in Africa – factors and patterns."
            />
          </SubtopicCard>

          <SubtopicCard title="Consequences of Uneven Distribution">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Overpopulation in some areas:</strong> Pressure on land,
                resources, and services – leads to poverty and environmental
                degradation.
              </li>
              <li>
                <strong>Underpopulation in others:</strong> Lack of labour,
                underutilised resources, and low economic development.
              </li>
              <li>
                <strong>Migration:</strong> People move from low‑density to
                high‑density areas in search of opportunities – causing urban
                growth and rural decline.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Population Distribution</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Physical:</strong> climate, water, relief, soils</li>
            <li><strong>Human:</strong> economy, infrastructure, history, stability</li>
            <li><strong>Dense areas:</strong> Nile, West Africa, coasts</li>
            <li><strong>Sparse:</strong> Sahara, Congo Basin, deserts</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'population-growth-structure',
      title: 'Growth and Structure of Population',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Population Growth and Structure">
            <p>
              <strong>Definition:</strong> Population growth is the increase in the
              number of people in a population over time. Population structure
              refers to the composition of a population by age, sex, and other
              characteristics (e.g., urban/rural, education level).
            </p>
            <p>
              Different countries have very different growth rates and structures
              depending on economic development, health, and social policies.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Factors Influencing Population Growth">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Birth rate:</strong> The number of live births per 1,000
                people per year. High in developing countries due to low education,
                lack of contraception, and cultural values.
              </li>
              <li>
                <strong>Death rate:</strong> The number of deaths per 1,000 people
                per year. Falls with better healthcare, nutrition, and sanitation.
              </li>
              <li>
                <strong>Migration:</strong> Net migration (in‑minus‑out) adds or
                subtracts from population.
              </li>
              <li>
                <strong>Demographic transition:</strong> Countries move from high
                birth/death rates to low birth/death rates as they develop.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Contrasting Examples: Developing African Country and Developed Country">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Developing African Country: Nigeria</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Population:</strong> ~220 million (2025), growing rapidly.
              </li>
              <li>
                <strong>Growth rate:</strong> ~2.5% per year – high due to high
                birth rate (~36/1000) and declining death rate.
              </li>
              <li>
                <strong>Structure:</strong> Very young population – median age ~18
                years. Wide base on population pyramid.
              </li>
              <li>
                <strong>Challenges:</strong> Pressure on education, healthcare, and
                jobs; high youth unemployment.
              </li>
              <li>
                <strong>Factors:</strong> Low contraceptive use, high fertility,
                improving healthcare, cultural preference for large families.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Developed Country: Japan</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Population:</strong> ~125 million, shrinking slowly.
              </li>
              <li>
                <strong>Growth rate:</strong> Negative (-0.2% per year) – low birth
                rate (~7/1000) and low death rate, but ageing population.
              </li>
              <li>
                <strong>Structure:</strong> Old population – median age ~48 years.
                Narrow base and wide top on population pyramid.
              </li>
              <li>
                <strong>Challenges:</strong> Labour shortages, pension costs,
                slow economic growth.
              </li>
              <li>
                <strong>Factors:</strong> High education, contraception, delayed
                marriage, urban lifestyle, women in workforce.
              </li>
            </ul>

            <SettlementImage
              fileName="population-pyramids-nigeria-japan.png"
              alt="Population pyramids for Nigeria (young, expanding) and Japan (ageing, contracting)"
              caption="Population structures of Nigeria (developing) and Japan (developed)."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Growth &amp; Structure</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Growth:</strong> birth rate, death rate, migration</li>
            <li><strong>Nigeria:</strong> young, high growth</li>
            <li><strong>Japan:</strong> old, shrinking</li>
            <li><strong>Demographic transition:</strong> shift from high to low</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'migration',
      title: 'Migration',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Migration?">
            <p>
              <strong>Definition:</strong> Migration is the movement of people from
              one place to another with the intention of settling (permanently or
              temporarily) in the new location. It can be internal (within a country)
              or international (between countries).
            </p>
            <p>
              Migration is a key demographic process and has significant social,
              economic, and environmental impacts.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Types of Migration">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Rural‑urban migration:</strong> Movement from countryside
                to cities – the most common type in developing countries.
              </li>
              <li>
                <strong>Rural‑rural migration:</strong> Movement between rural areas
                (e.g., resettlement schemes).
              </li>
              <li>
                <strong>Urban‑urban migration:</strong> Moving between cities (e.g.,
                from secondary city to capital).
              </li>
              <li>
                <strong>International migration:</strong> Crossing national borders
                (e.g., Zimbabweans to South Africa).
              </li>
              <li>
                <strong>Forced migration:</strong> Movement due to conflict, natural
                disasters, or persecution (refugees).
              </li>
              <li>
                <strong>Voluntary migration:</strong> Choice to move for economic,
                social, or personal reasons.
              </li>
              <li>
                <strong>Return migration:</strong> Moving back to origin after some
                time abroad.
              </li>
            </ul>
            <SettlementImage
              fileName="migration-types.png"
              alt="A 2D diagram showing types of migration: rural-urban, rural-rural, urban-urban, international, forced, voluntary, return"
              caption="Types of migration."
            />
          </SubtopicCard>

          <SubtopicCard title="Push‑Pull Factors">
            <p>
              Migration is often explained by push factors (reasons to leave an area)
              and pull factors (reasons to go to a new area).
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Push factors (origin):</strong> Poverty, unemployment, poor
                healthcare/education, drought, conflict, overcrowding, environmental
                degradation.
              </li>
              <li>
                <strong>Pull factors (destination):</strong> Jobs, higher wages,
                better schools/hospitals, political freedom, safety, family and
                friends, pleasant climate.
              </li>
            </ul>
            <SettlementImage
              fileName="push-pull-factors.png"
              alt="A 2D diagram showing push factors (left) and pull factors (right) influencing migration"
              caption="Push and pull factors of migration."
            />
          </SubtopicCard>

          <SubtopicCard title="Causes and Consequences of Migration">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes (Examples)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Zimbabwe – South Africa:</strong> Economic collapse in
                Zimbabwe (push) and job opportunities in South Africa (pull).
              </li>
              <li>
                <strong>Rural‑urban in Nigeria:</strong> Rural poverty (push) and
                urban jobs (pull).
              </li>
              <li>
                <strong>Conflict in Sudan:</strong> War forces people to flee to
                neighbouring countries (forced migration).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Consequences</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>For origin area:</strong> Loss of young working‑age people
                (brain drain), reduced pressure on resources, remittances sent back
                improve family welfare.
              </li>
              <li>
                <strong>For destination area:</strong> Increased labour supply,
                cultural diversity, but also pressure on housing, jobs, and services;
                social tensions may arise.
              </li>
              <li>
                <strong>For migrants:</strong> Better income, new skills, but also
                loneliness, exploitation, and challenges of integration.
              </li>
            </ul>
            <SettlementImage
              fileName="migration-consequences.png"
              alt="A 2D diagram showing causes and consequences of migration for origin, destination, and migrants"
              caption="Causes and consequences of migration."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Migration Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Migration:</strong> movement with intent to settle</li>
            <li><strong>Push:</strong> poverty, war, drought</li>
            <li><strong>Pull:</strong> jobs, safety, services</li>
            <li><strong>Effects:</strong> brain drain, remittances, urban growth</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'population-health-disease',
      title: 'Population, Health and Disease',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="The Link Between Population and Disease">
            <p>
              <strong>Definition:</strong> Health and disease are closely linked to
              population dynamics. Overcrowding, poor sanitation, malnutrition, and
              lack of healthcare contribute to the spread of diseases. In Africa,
              many diseases are preventable but remain major causes of death and
              disability.
            </p>
            <p>
              We will examine one disease from each of three groups: nutritional,
              water‑linked, and vector‑associated.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Nutritional Disease – Kwashiorkor">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              Kwashiorkor is a form of severe protein‑energy malnutrition. It is
              common in children who have been weaned onto a starchy diet with
              insufficient protein.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Lack of protein in the diet (e.g., replacing milk with porridge).</li>
              <li>Poverty and food insecurity.</li>
              <li>Inadequate breastfeeding or early weaning.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Distribution</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Common in sub‑Saharan Africa, South Asia, and parts of Latin America.</li>
              <li>In Zimbabwe, it occurs in rural areas with poor food diversity.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Swollen belly (oedema), skin lesions, hair discolouration.</li>
              <li>Stunted growth, weakened immune system, high mortality if untreated.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods of Combating</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Nutrition education (balanced diets).</li>
              <li>Supplementation with protein‑rich foods (e.g., fortified porridge).</li>
              <li>Food aid and school feeding programmes.</li>
              <li>Improving agricultural diversity and income.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Problems in Control</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Poverty persists; food insecurity remains.</li>
              <li>Limited access to healthcare and nutritionists.</li>
              <li>Cultural beliefs about food may hinder change.</li>
            </ul>
            <SettlementImage
              fileName="kwashiorkor-population-disease.png"
              alt="A 2D diagram showing causes, effects, and control of kwashiorkor"
              caption="Nutritional disease: Kwashiorkor – causes, effects, and control."
            />
          </SubtopicCard>

          <SubtopicCard title="Water‑Linked Disease – Cholera">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              Cholera is an acute diarrhoeal infection caused by the bacterium
              <em>Vibrio cholerae</em>. It is transmitted through contaminated water
              and food.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Drinking water contaminated with faeces from infected people.</li>
              <li>Poor sanitation and hygiene (open defecation, lack of toilets).</li>
              <li>Flooding and overcrowding (as in urban slums).</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Distribution</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Endemic in parts of Africa, Asia, and Latin America.</li>
              <li>Outbreaks occur in areas with poor water and sanitation, e.g., after cyclones or in refugee camps.</li>
              <li>In Zimbabwe, cholera outbreaks have occurred in Harare and other cities during rainy seasons.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Severe watery diarrhoea, vomiting, dehydration.</li>
              <li>Can be fatal within hours if untreated.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods of Combating</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Oral rehydration therapy (ORT) and intravenous fluids.</li>
              <li>Providing safe drinking water (chlorination, boreholes).</li>
              <li>Improving sanitation (toilets, waste management).</li>
              <li>Health education on handwashing and food hygiene.</li>
              <li>Vaccination campaigns in high‑risk areas.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Problems in Control</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Rapid spread in overcrowded areas.</li>
              <li>Limited resources for water and sanitation infrastructure.</li>
              <li>Floods and climate change can exacerbate outbreaks.</li>
            </ul>
            <SettlementImage
              fileName="cholera-population-disease.png"
              alt="A 2D diagram showing causes, distribution, effects, and control of cholera"
              caption="Water‑linked disease: Cholera – causes, effects, and control."
            />
          </SubtopicCard>

          <SubtopicCard title="Vector‑Associated Disease – Malaria">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              Malaria is a life‑threatening disease caused by parasites of the
              <em>Plasmodium</em> genus, transmitted to humans through the bite
              of infected female <em>Anopheles</em> mosquitoes.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Mosquito breeding in stagnant water (puddles, swamps, rice fields).</li>
              <li>Lack of mosquito control (insecticide‑treated nets, indoor spraying).</li>
              <li>Climate: tropical and subtropical regions with rainfall and warmth.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Distribution</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Widespread across sub‑Saharan Africa, parts of Asia, and South America.</li>
              <li>In Zimbabwe, malaria is endemic in low‑lying areas (e.g., Zambezi Valley, Victoria Falls, and parts of Masvingo).</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Fever, chills, headache, vomiting; severe cases can cause anaemia, cerebral malaria, and death.</li>
              <li>Children under five and pregnant women are most vulnerable.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods of Combating</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Insecticide‑treated bed nets (ITNs).</li>
              <li>Indoor residual spraying (IRS).</li>
              <li>Antimalarial drugs (artemisinin‑based combination therapies).</li>
              <li>Environmental management (drain stagnant water).</li>
              <li>Research into vaccines.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Problems in Control</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Mosquito resistance to insecticides.</li>
              <li>Parasite resistance to drugs.</li>
              <li>Limited access to nets and medication in remote areas.</li>
              <li>Climate change may expand mosquito habitats.</li>
            </ul>
            <SettlementImage
              fileName="malaria-population-disease.png"
              alt="A 2D diagram showing causes, distribution, effects, and control of malaria"
              caption="Vector‑associated disease: Malaria – causes, effects, and control."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Health &amp; Disease</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Nutritional:</strong> Kwashiorkor (protein deficiency)</li>
            <li><strong>Water‑linked:</strong> Cholera (contaminated water)</li>
            <li><strong>Vector‑associated:</strong> Malaria (mosquitoes)</li>
            <li><strong>Solutions:</strong> nutrition, clean water, vector control</li>
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
            Settlement and Population Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore rural settlement patterns, resettlement, urbanisation, town
            morphology, urban functions, quality of life, population distribution,
            growth and structure, migration, and population health and disease –
            with a focus on Zimbabwe and Africa.
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
                  <strong className="text-white">Rural settlement patterns</strong> are
                  influenced by physical, social, economic, and cultural factors.
                  African examples include Barotse Plain, Gezira, and southern Nigeria.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Rural resettlement</strong> aims to
                  provide land and improve livelihoods, but faces challenges like
                  poor planning and resource shortages.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Urbanisation</strong> is driven by
                  economic, social, political, and physical factors. Problems include
                  housing, pollution, and crime; solutions involve planning and investment.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Town morphology</strong> models
                  (concentric, sector) are useful but often do not fit African cities
                  due to colonial legacies and informal sectors.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Urban functions</strong> range from
                  basic services (villages) to global functions (mega‑cities), with
                  spheres of influence varying accordingly.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Quality of life</strong> differs
                  between rural and urban areas; rural offers community and low cost,
                  urban offers services but higher stress.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Population distribution</strong> in
                  Africa is uneven due to climate, water, economy, and history.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Population growth</strong> varies:
                  Nigeria has a young, growing population; Japan is ageing and shrinking.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Migration</strong> is driven by
                  push‑pull factors and has significant impacts on both origin and
                  destination areas.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Diseases</strong> like kwashiorkor
                  (nutritional), cholera (water‑linked), and malaria (vector‑associated)
                  are major health challenges in Africa; control requires multifaceted
                  approaches.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Settlement and Population Studies topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
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

export default SettlementAndPopulationStudies;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/settlement/
   Use a mix of 2D diagram style and realistic photographs.

   --- RURAL SETTLEMENT PATTERNS (2D DIAGRAM) ---
   1. physical-factors-rural-settlement.png
      Icons for relief, water, soil, climate, resources with brief labels.
   2. social-economic-cultural-rural-settlement.png
      Icons for social bonds, markets, culture, government policy.
   3. african-rural-settlement-examples.png
      Map of Africa with three insets: Barotse Plain (Zambia), Gezira (Sudan), southern Nigeria, plus growth points in Zimbabwe.

   --- RURAL RESETTLEMENT ---
   4. resettlement-factors.png
      Icons for land scarcity, land reform, degradation, projects, policy.
   5. resettlement-zimbabwe-africa.png
      A realistic photo showing resettlement farms/homes (Zimbabwe, Kenya, Tanzania).

   --- URBANISATION ---
   6. urbanisation-drivers.png
      Diagram: economic, social, political, physical factors with icons.
   7. urbanisation-problems-solutions.png
      Split: left (problems – housing, traffic, pollution), right (solutions – planning, investment, housing).
   8. urbanisation-case-studies.png
      Comparative diagram: London (developed) and Mexico City, Gaborone, Calcutta (developing) with key points.

   --- TOWN MORPHOLOGY ---
   9. urban-models-concentric-sector.png
      Two concentric rings and sector wedges diagrams side‑by‑side.
   10. urban-models-african-cities.png
      Diagrams showing Nairobi, Lagos, Harare with annotations on why models don't fit perfectly.

   --- URBAN FUNCTIONS AND SPHERE ---
   11. urban-functions.png
      Icons for retail, health, education, admin, industry, culture.
   12. sphere-of-influence.png
      Hierarchy diagram: village → town → city → mega‑city with expanding circles.
   13. urban-functions-zimbabwe-africa.png
      Map of Zimbabwe and Africa with labelled cities and their spheres.

   --- QUALITY OF LIFE ---
   14. rural-urban-quality-of-life.png
      Split diagram: advantages/disadvantages for rural and urban.
   15. quality-of-life-zimbabwe.png
      Icons for work, health, education, transport, nutrition, water, goods, social amenities – rural vs urban.

   --- DISTRIBUTION OF POPULATION IN AFRICA ---
   16. africa-population-distribution.png
      Map of Africa with density shading; labels for high‑density regions (Nile, West Africa, lakes) and low‑density (Sahara, Congo).

   --- POPULATION GROWTH AND STRUCTURE ---
   17. population-pyramids-nigeria-japan.png
      Two pyramids: Nigeria (wide base, young) and Japan (narrow base, wide top).

   --- MIGRATION ---
   18. migration-types.png
      Icons for rural‑urban, rural‑rural, urban‑urban, international, forced, voluntary, return.
   19. push-pull-factors.png
      Push factors (poverty, drought, conflict) vs Pull factors (jobs, safety, services).
   20. migration-consequences.png
      Diagram: effects on origin, destination, migrants.

   --- POPULATION, HEALTH AND DISEASE ---
   21. kwashiorkor-population-disease.png
      Diagram: causes, distribution, effects, control (nutrition education, supplementation).
   22. cholera-population-disease.png
      Diagram: causes (contaminated water), distribution (Africa, Asia), control (water treatment, ORT).
   23. malaria-population-disease.png
      Diagram: mosquito life cycle, distribution (sub‑Saharan Africa), control (nets, spraying, drugs).

   ============================================================ */