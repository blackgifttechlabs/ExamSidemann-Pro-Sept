import React, { useState, useRef } from 'react';

/**
 * Topic: Transport and Trade Studies
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const TransportAndTradeStudies: React.FC = () => {
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
  const TransportImage: React.FC<{
    fileName: string;
    alt: string;
    caption: string;
  }> = ({ fileName, alt, caption }) => {
    const [isMissing, setIsMissing] = useState(false);

    if (isMissing) return null;
    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        <img
          src={`/images/transport/${fileName}`}
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
      id: 'development-transport-routes',
      title: 'Development of Transport Routes in Africa',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Transport Routes?">
            <p>
              <strong>Definition:</strong> Transport routes are the paths or lines
              along which people, goods, and services move. They include roads,
              railways, waterways, and air corridors. The development of these
              routes is essential for economic growth and regional integration.
            </p>
            <p>
              In Africa, transport routes are often poorly developed compared to
              other continents. This is due to a mix of physical, economic, social,
              and political factors.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Physical Factors Influencing Route Development">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Relief (landforms):</strong> Flat land (plains) makes it
                easy to build roads and railways. Steep mountains (e.g., the Drakensberg,
                Ethiopian Highlands) are barriers and make construction expensive.
              </li>
              <li>
                <strong>Climate:</strong> Heavy rainfall causes flooding and damages
                roads. In deserts (Sahara), sand dunes shift and cover routes.
                Extreme heat can also damage road surfaces.
              </li>
              <li>
                <strong>Rivers and water bodies:</strong> Rivers are natural routes
                for water transport (e.g., the Nile, Congo, Zambezi). However, they
                can also be barriers to road and rail unless bridges are built.
              </li>
              <li>
                <strong>Vegetation:</strong> Dense forests (like the Congo Basin)
                make route building slow and costly.
              </li>
              <li>
                <strong>Natural resources:</strong> The discovery of minerals (gold,
                oil, diamonds) often drives the development of transport routes to
                bring these resources to ports.
              </li>
            </ul>
            <TransportImage
              fileName="physical-factors-transport-africa.png"
              alt="A 2D diagram showing physical factors affecting transport routes: relief, climate, rivers, vegetation, and resources"
              caption="Physical factors influencing transport route development in Africa."
            />
          </SubtopicCard>

          <SubtopicCard title="Economic, Social, and Political Factors">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Economic Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Cost and funding:</strong> Building transport infrastructure
                is expensive. Poor countries struggle to afford it.
              </li>
              <li>
                <strong>Trade routes:</strong> Routes are built where there is
                demand – to connect farms to markets, mines to ports, and cities
                to each other.
              </li>
              <li>
                <strong>Economic returns:</strong> Investors and governments focus
                on routes that will generate the most profit (e.g., corridors to
                mineral-rich areas).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Social Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Population density:</strong> Routes are developed where
                many people live (urban areas) or where people need to travel
                (rural-urban migration).
              </li>
              <li>
                <strong>Access to services:</strong> Governments build roads to
                connect remote communities to schools, clinics, and markets.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Political Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Colonial legacy:</strong> Many African transport routes
                were built to extract resources for colonial powers, connecting
                mines to ports (e.g., the Cape-to-Cairo railway). They often do
                not connect neighbouring African countries well.
              </li>
              <li>
                <strong>Government policies:</strong> Some governments invest heavily
                in transport (e.g., South Africa's road network). Others neglect it
                due to corruption or lack of funds.
              </li>
              <li>
                <strong>Regional cooperation:</strong> Organisations like SADC and
                AU work to develop cross-border transport corridors (e.g., the
                North-South Corridor from Durban to Dar es Salaam).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">African Examples</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Trans-African Highways:</strong> A network of highways
                planned to cross Africa, like the Cairo-Dakar Highway and the
                Lagos-Mombasa Highway.
              </li>
              <li>
                <strong>Beira Corridor (Zimbabwe-Mozambique):</strong> A key route
                for Zimbabwean exports (minerals, tobacco) through the port of Beira.
              </li>
              <li>
                <strong>Tazara Railway (Tanzania-Zambia):</strong> Built with Chinese
                aid to give Zambia a route to the sea without passing through
                apartheid South Africa.
              </li>
            </ul>
            <TransportImage
              fileName="africa-transport-networks.png"
              alt="A map of Africa showing major transport routes: Trans-African highways, Beira Corridor, Tazara Railway, and major ports"
              caption="Major transport routes in Africa – physical, economic, and political influences."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Transport route:</strong> path for movement (road, rail, water, air)</li>
            <li><strong>Corridor:</strong> a major transport axis</li>
            <li><strong>Physical barriers:</strong> mountains, deserts, forests</li>
            <li><strong>Colonial legacy:</strong> routes built for resource extraction</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'transport-networks',
      title: 'Transport Networks',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is a Transport Network?">
            <p>
              <strong>Definition:</strong> A transport network is a system of
              routes (lines) and junctions (nodes) that connect places. It is like
              a web that allows movement of people and goods.
            </p>
            <p>
              Geographers use topological diagrams to simplify networks. A topological
              diagram ignores the real distance and shape and just shows connections.
              This helps to understand the structure.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Route Systems and Topological Diagrams">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Route system:</strong> The actual physical layout of roads,
                railways, etc., on a map.
              </li>
              <li>
                <strong>Topological diagram:</strong> A simplified map where only
                the connections (nodes and edges) matter. Think of a subway map
                (e.g., the London Tube map). The distances are not to scale; only
                the sequence of stops matters.
              </li>
              <li>
                <strong>Nodes:</strong> Points where routes meet (e.g., towns,
                junctions, ports).
              </li>
              <li>
                <strong>Edges:</strong> The routes (roads, rail lines) connecting
                the nodes.
              </li>
            </ul>
            <TransportImage
              fileName="topological-diagram-network.png"
              alt="A 2D diagram showing a real map vs a topological diagram of a transport network"
              caption="Converting a route system into a topological diagram."
            />
          </SubtopicCard>

          <SubtopicCard title="Route Density and Node Accessibility">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Route Density</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The number of routes per unit area
                (e.g., kilometres of road per square kilometre).
              </li>
              <li>
                <strong>High density:</strong> Found in developed areas, cities,
                and fertile plains (e.g., South Africa, Zimbabwe's Highveld).
              </li>
              <li>
                <strong>Low density:</strong> Found in deserts, mountains, and
                remote rural areas (e.g., the Kalahari, Sahara).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Node Accessibility</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> How easy it is to reach a node (town)
                from other nodes in the network.
              </li>
              <li>
                <strong>Centrality:</strong> A central node (like a major city) has
                many connections and is highly accessible.
              </li>
              <li>
                <strong>Isolated nodes:</strong> Remote villages with only one road
                connecting them have low accessibility.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Using Networks to Explain Location of Services">
            <p>
              Transport networks help us decide where to place new services like
              hospitals, clinics, schools, and settlements.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Maximising accessibility:</strong> A new clinic should be
                placed at a node with high accessibility so that many people can
                reach it easily.
              </li>
              <li>
                <strong>Serving isolated areas:</strong> Sometimes, a service is
                placed to serve a poorly connected area (rural hospital).
              </li>
              <li>
                <strong>Network analysis:</strong> Using the topological diagram,
                planners can calculate the shortest path, travel times, and the
                number of people who can reach the new service within a certain time.
              </li>
              <li>
                <strong>Zimbabwe example:</strong> New growth points and district
                hospitals are often located at road junctions to maximise access
                for surrounding villages.
              </li>
            </ul>
            <TransportImage
              fileName="network-analysis-services.png"
              alt="A 2D diagram showing how network analysis helps locate a new hospital, clinic, or school based on accessibility"
              caption="Using transport networks to plan the location of new services."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Network Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Network:</strong> routes (edges) + junctions (nodes)</li>
            <li><strong>Topological:</strong> simplified map showing connections</li>
            <li><strong>Density:</strong> routes per area</li>
            <li><strong>Accessibility:</strong> how easy to reach a node</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'longitude-time-idl',
      title: 'Longitude, Time and the International Date Line',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="How Longitude and Earth Rotation Influence Time">
            <p>
              <strong>Definition:</strong> Longitude is the angular distance east
              or west of the Prime Meridian (0°), which passes through Greenwich,
              London. The Earth rotates 360° in 24 hours, so it moves 15° every hour
              (360° ÷ 24 = 15°).
            </p>
            <p>
              This means that places east of Greenwich have a later local time,
              while places west have an earlier time. For example, Zimbabwe is at
              30°E, so it is 2 hours ahead of GMT (30 ÷ 15 = 2).
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Calculation of time difference:</strong> Divide the longitude
                difference by 15 to get the time difference in hours.
              </li>
              <li>
                <strong>East = ahead:</strong> If you go east, you add hours.
              </li>
              <li>
                <strong>West = behind:</strong> If you go west, you subtract hours.
              </li>
            </ul>
            <TransportImage
              fileName="longitude-time-zones.png"
              alt="A 2D diagram showing longitude, the Prime Meridian, and how time zones are divided by 15° intervals"
              caption="How longitude and the Earth's rotation influence time zones."
            />
          </SubtopicCard>

          <SubtopicCard title="Time Zones and the International Date Line (IDL)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Time Zones</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A time zone is a region of the globe
                that observes a uniform standard time. There are 24 main time zones,
                each roughly 15° of longitude wide.
              </li>
              <li>
                <strong>GMT/UTC:</strong> Greenwich Mean Time (now called Universal
                Time Coordinated) is the base time.
              </li>
              <li>
                <strong>Zimbabwe time:</strong> Zimbabwe is in the Central Africa
                Time zone (CAT) – UTC+2.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">International Date Line (IDL)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The IDL is an imaginary line on the
                Earth's surface, roughly following the 180° meridian, where the
                date changes.
              </li>
              <li>
                <strong>Crossing westwards (to Asia):</strong> You add a day
                (e.g., Monday becomes Tuesday).
              </li>
              <li>
                <strong>Crossing eastwards (to the Americas):</strong> You subtract
                a day (e.g., Monday becomes Sunday).
              </li>
              <li>
                <strong>Why it exists:</strong> To avoid confusion with time zones
                wrapping around the globe. It zigzags to avoid splitting countries
                or island groups.
              </li>
            </ul>
            <TransportImage
              fileName="international-date-line.png"
              alt="A world map showing the International Date Line, time zones, and the effect of crossing it"
              caption="The International Date Line – crossing west adds a day, crossing east subtracts a day."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Time &amp; Date</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>15° = 1 hour</strong></li>
            <li><strong>East:</strong> add time</li>
            <li><strong>West:</strong> subtract time</li>
            <li><strong>IDL:</strong> west add day, east subtract day</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'modern-transport-developments',
      title: 'Modern Developments in Transport',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Changing Role of Air, Water, Road, and Rail Transport">
            <p>
              Transport has changed a lot in recent years. New technology has made
              it faster, cheaper, safer, and more efficient. However, it also causes
              environmental problems.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Air Transport</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Role:</strong> Mainly for passenger travel and high‑value
                goods (e.g., electronics, flowers, pharmaceuticals).
              </li>
              <li>
                <strong>Changes:</strong> Low‑cost airlines (e.g., Ryanair) have made
                travel cheaper. Large cargo aircraft (e.g., Boeing 747) carry bulk goods.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Water Transport</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Role:</strong> Bulk goods (oil, grain, minerals, containers).
                Very cheap for heavy goods.
              </li>
              <li>
                <strong>Changes:</strong> Containerisation (standardised metal boxes)
                has revolutionised shipping, making it faster to load/unload and reducing
                theft. Mega‑ships (over 20,000 containers) now operate.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Road Transport</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Role:</strong> Dominant for short‑distance movement of people
                and goods. It is flexible (door‑to‑door).
              </li>
              <li>
                <strong>Changes:</strong> Electric vehicles (EVs) are becoming
                popular. Autonomous (self‑driving) vehicles are being tested.
                GPS navigation makes routing efficient.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Rail Transport</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Role:</strong> Heavy goods over long distances (coal, steel,
                grain). Also commuter transport in cities.
              </li>
              <li>
                <strong>Changes:</strong> High‑speed rail (e.g., Shinkansen in Japan,
                TGV in France) competes with air travel for passenger traffic.
                Electrification reduces pollution.
              </li>
            </ul>
            <TransportImage
              fileName="modern-transport-modes.png"
              alt="A 2D diagram comparing modern developments in air, water, road, and rail transport"
              caption="Modern developments in different transport modes."
            />
          </SubtopicCard>

          <SubtopicCard title="Technological Innovations and Their Importance">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>GPS and SatNav:</strong> Helps drivers find the fastest
                routes, reducing travel time and fuel use.
              </li>
              <li>
                <strong>Automation and AI:</strong> Autonomous ships, drones, and
                self‑driving trucks reduce labour costs and human error.
              </li>
              <li>
                <strong>Electric and hybrid engines:</strong> Reduce reliance on
                fossil fuels, lowering carbon emissions.
              </li>
              <li>
                <strong>Smart traffic management:</strong> Traffic lights and
                monitoring systems reduce congestion.
              </li>
              <li>
                <strong>Impact on cost, speed, capacity, safety, comfort:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li><strong>Cost:</strong> Cheaper operations due to fuel efficiency and automation.</li>
                  <li><strong>Speed:</strong> Faster delivery (e.g., same‑day delivery).</li>
                  <li><strong>Capacity:</strong> Mega‑ships and high‑speed trains carry more.</li>
                  <li><strong>Safety:</strong> Collision avoidance systems reduce accidents.</li>
                  <li><strong>Comfort:</strong> Better suspension, climate control, and connectivity (Wi‑Fi).</li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Environmental Consequences of Modern Transport">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Noise pollution:</strong> Traffic, aircraft, and trains
                create noise that affects health (stress, hearing loss).
              </li>
              <li>
                <strong>Air pollution:</strong> Burning petrol and diesel releases
                CO₂ (greenhouse gas), NOx, and particulates. Contributes to climate
                change and respiratory diseases.
              </li>
              <li>
                <strong>Water pollution:</strong> Oil spills from ships, runoff from
                roads (chemicals), and plastic waste contaminate rivers and oceans.
              </li>
              <li>
                <strong>Land competition:</strong> Roads and railways take up land
                that could be used for farming or housing. They also fragment
                wildlife habitats.
              </li>
              <li>
                <strong>Congestion:</strong> Traffic jams waste time, increase fuel
                use, and increase pollution.
              </li>
            </ul>
            <TransportImage
              fileName="transport-environmental-impacts.png"
              alt="A 2D diagram showing environmental consequences: noise, air pollution, water pollution, land competition, and congestion"
              caption="Environmental consequences of modern transport."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Modern Transport</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Air:</strong> high speed, high value</li>
            <li><strong>Water:</strong> bulk, cheap, containers</li>
            <li><strong>Road:</strong> flexible, EVs, GPS</li>
            <li><strong>Rail:</strong> heavy goods, high‑speed</li>
            <li><strong>Environment:</strong> pollution, congestion, habitat loss</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'trade-patterns',
      title: 'Trade and Trading Patterns',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="The Meaning and Origins of Trade">
            <p>
              <strong>Definition:</strong> Trade is the exchange of goods, services,
              or money between people, businesses, or countries. It allows people
              to get what they need or want that they do not produce themselves.
            </p>
            <p>
              <strong>Origins:</strong> Trade began in prehistoric times with
              bartering (exchanging goods directly, e.g., grain for meat). It
              grew with the development of civilisations (e.g., the Silk Road,
              Indian Ocean trade). Colonialism created global trade networks,
              often exploiting colonies for raw materials.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Types of Trade">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">National (Domestic) Trade</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Wholesale:</strong> Buying goods in large quantities from
                producers and selling them to retailers. (e.g., a grain wholesaler
                buys from farmers and sells to supermarkets).
              </li>
              <li>
                <strong>Retail:</strong> Selling goods directly to the final
                consumer. (e.g., shops, supermarkets, street vendors).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">International Trade</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Exports:</strong> Goods or services sold to other countries
                (e.g., Zimbabwe exports minerals, tobacco, and gold).
              </li>
              <li>
                <strong>Imports:</strong> Goods or services bought from other
                countries (e.g., Zimbabwe imports machinery, fuel, and electronics).
              </li>
              <li>
                <strong>Balance of trade:</strong> The difference between the value
                of exports and imports. A surplus (exports &gt; imports) is good;
                a deficit (imports &gt; exports) can be a problem.
              </li>
            </ul>
            <TransportImage
              fileName="trade-types.png"
              alt="A 2D diagram showing national trade (wholesale, retail) and international trade (exports, imports)"
              caption="Types of trade: national (wholesale/retail) and international (exports/imports)."
            />
          </SubtopicCard>

          <SubtopicCard title="Trading Patterns (Zimbabwe and Africa)">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Zimbabwe:</strong> Main trading partners are South Africa,
                China, and the EU. Exports: gold, platinum, tobacco, nickel.
                Imports: fuels, machinery, chemicals.
              </li>
              <li>
                <strong>Africa:</strong> Most African countries export primary
                products (raw materials) and import manufactured goods. This creates
                a colonial‑type trade pattern.
              </li>
              <li>
                <strong>Intra‑African trade:</strong> Trade between African countries
                is low (about 15% of total trade) compared to Europe (60%). Reasons:
                poor infrastructure, colonial borders, and similar product bases.
              </li>
            </ul>
            <TransportImage
              fileName="zimbabwe-africa-trade-flows.png"
              alt="A map showing Zimbabwe's trade flows with South Africa, China, and EU, and intra-African trade patterns"
              caption="Trade patterns in Zimbabwe and Africa."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Trade Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Trade:</strong> exchange of goods/services</li>
            <li><strong>Wholesale:</strong> bulk to retailers</li>
            <li><strong>Retail:</strong> to consumers</li>
            <li><strong>Exports:</strong> sold abroad</li>
            <li><strong>Imports:</strong> bought from abroad</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'regional-imbalances',
      title: 'Regional Imbalances',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Regional Imbalances?">
            <p>
              <strong>Definition:</strong> Regional imbalances refer to the unequal
              distribution of wealth, resources, and economic activity between
              different areas (regions) within a country or between countries.
            </p>
            <p>
              In trade terms, it means that some regions export valuable goods and
              become wealthy, while others export low‑value goods and remain poor.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Causes of Trade Imbalances">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">National Level (within a country)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Resource distribution:</strong> Areas with minerals (gold,
                diamonds) or fertile land are richer than arid regions.
              </li>
              <li>
                <strong>Infrastructure:</strong> Regions with good roads, ports,
                and electricity attract more industry and trade.
              </li>
              <li>
                <strong>Investment:</strong> Governments and private companies tend
                to invest in areas that are already developed (core regions).
              </li>
              <li>
                <strong>Migration:</strong> Skilled workers leave poor regions for
                rich ones (brain drain within the country).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">International Level (between countries)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Colonial legacy:</strong> Former colonies are locked into
                exporting raw materials and importing expensive manufactured goods
                (unequal exchange).
              </li>
              <li>
                <strong>Terms of trade:</strong> The ratio of export prices to import
                prices. If export prices fall (e.g., coffee) and import prices rise
                (e.g., machinery), the country gets poorer.
              </li>
              <li>
                <strong>Trade barriers:</strong> Developed countries impose tariffs
                and subsidies that make it hard for developing countries to sell
                their goods (e.g., agricultural subsidies in the EU and USA).
              </li>
              <li>
                <strong>Dependence on primary products:</strong> Most African countries
                rely on a few commodities (oil, minerals, coffee). Price fluctuations
                cause economic instability.
              </li>
            </ul>
            <TransportImage
              fileName="regional-trade-imbalances.png"
              alt="A 2D diagram showing causes of trade imbalances at national level (resources, infrastructure) and international level (colonial legacy, terms of trade)"
              caption="Causes of regional trade imbalances."
            />
          </SubtopicCard>

          <SubtopicCard title="Consequences of Trade Imbalances">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Debt:</strong> Countries with persistent trade deficits
                borrow money, leading to debt crises.
              </li>
              <li>
                <strong>Dependency:</strong> Poor countries depend on rich countries
                for aid, loans, and markets.
              </li>
              <li>
                <strong>Poverty and inequality:</strong> Wealth accumulates in
                developed cores while peripheries remain poor.
              </li>
              <li>
                <strong>Migration:</strong> People move from poor regions to rich
                ones, causing brain drain in the poor regions.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Imbalances</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>National:</strong> resource gaps, infrastructure</li>
            <li><strong>International:</strong> colonial legacy, terms of trade</li>
            <li><strong>Effects:</strong> debt, dependency, poverty</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'economic-groupings',
      title: 'Economic Groupings',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Economic Groupings?">
            <p>
              <strong>Definition:</strong> Economic groupings (or trade blocs) are
              organisations of countries that agree to reduce trade barriers among
              themselves. They aim to promote economic integration, growth, and
              development.
            </p>
            <p>
              The spatial arrangement of groupings often follows geographic regions
              (neighbouring countries), but can also be political (e.g., COMECON).
            </p>
          </SubtopicCard>

          <SubtopicCard title="Economic Groupings – Aims, Methods, and Effects">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">General Aims</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Remove trade barriers (tariffs, quotas).</li>
              <li>Promote free movement of goods, services, capital, and labour.</li>
              <li>Increase trade between member countries.</li>
              <li>Attract foreign investment.</li>
              <li>Promote economic development and political stability.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">General Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Reduce or eliminate import duties.</li>
              <li>Harmonise customs procedures.</li>
              <li>Build joint infrastructure (roads, power, etc.).</li>
              <li>Establish common external tariffs (for non‑members).</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">General Effects (Positive and Negative)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Positive:</strong> Larger markets, more competition, lower
                prices, economies of scale, increased investment, political cooperation.
              </li>
              <li>
                <strong>Negative:</strong> Loss of sovereignty, unequal benefits
                (larger countries benefit more), small industries may be crushed by
                competition, exclusion of non‑members.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Detailed Case Study 1: SADC (Southern African Development Community)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Origins</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Established:</strong> 1980 as SADCC (Southern African
                Development Coordination Conference). Transformed into SADC in 1992.
              </li>
              <li>
                <strong>Background:</strong> Created to reduce dependence on apartheid
                South Africa and promote regional development.
              </li>
              <li>
                <strong>Headquarters:</strong> Gaborone, Botswana.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Aims</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Promote sustainable and equitable economic growth.</li>
              <li>Develop economic integration (Free Trade Area, Customs Union).</li>
              <li>Co‑operate in infrastructure, energy, water, and security.</li>
              <li>Reduce poverty and improve the quality of life.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>SADC Free Trade Area (FTA) launched in 2008 – most tariffs removed.</li>
              <li>SADC Protocol on Trade.</li>
              <li>Cross‑border infrastructure projects (e.g., North‑South Corridor).</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Problems</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Overlapping memberships (countries belong to SADC, COMESA, EAC).</li>
              <li>Political instability in some members (e.g., DRC, Zimbabwe).</li>
              <li>Poor infrastructure and funding gaps.</li>
              <li>Unequal development – South Africa dominates the economy.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Achievements</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Increased intra‑regional trade (from 5% to over 15% of total trade).</li>
              <li>Joint infrastructure projects (e.g., regional power pool).</li>
              <li>Peacekeeping and security co‑operation (SADC Mission in DRC).</li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Detailed Case Study 2: PTA (Preferential Trade Area) – now COMESA">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Origins</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Established:</strong> 1981 as the PTA for Eastern and
                Southern Africa.
              </li>
              <li>
                <strong>Transformed:</strong> Into COMESA (Common Market for Eastern
                and Southern Africa) in 1994.
              </li>
              <li>
                <strong>Headquarters:</strong> Lusaka, Zambia.
              </li>
              <li>
                <strong>Members:</strong> 21 member states (e.g., Zimbabwe, Egypt,
                Kenya, Zambia).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Aims</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Create a large economic and trading bloc.</li>
              <li>Promote free movement of goods, services, capital, and labour.</li>
              <li>Harmonise monetary and financial policies.</li>
              <li>Establish a Customs Union and ultimately a Common Market.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Reduction of tariffs (COMESA FTA established in 2000).</li>
              <li>Harmonisation of customs documentation.</li>
              <li>Trade and investment promotion.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Problems</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Overlapping memberships with SADC and EAC create confusion.</li>
              <li>Political and economic instability in some members.</li>
              <li>Intra‑regional trade remains relatively low.</li>
              <li>Lack of strong implementation mechanisms.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Achievements</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Free Trade Area among most member states.</li>
              <li>Increased trade volumes.</li>
              <li>Development of regional infrastructure (e.g., COMESA‑EU cooperation).</li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Other Groupings (EU and COMECON)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">EU (European Union)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A political and economic union of 27
                European countries.
              </li>
              <li>
                <strong>Aims:</strong> Single market, free movement, common currency
                (euro), political integration.
              </li>
              <li>
                <strong>Methods:</strong> Common external tariff, harmonised laws,
                structural funds.
              </li>
              <li>
                <strong>Effects:</strong> High level of integration; world's largest
                trading bloc.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">COMECON (Council for Mutual Economic Assistance)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A now‑defunct economic organisation of
                communist states (Eastern Europe, Soviet Union, Cuba, etc.)
                established in 1949.
              </li>
              <li>
                <strong>Aims:</strong> Co‑ordinate economic planning and trade among
                socialist countries.
              </li>
              <li>
                <strong>Methods:</strong> Bilateral trade agreements, specialisation
                of production.
              </li>
              <li>
                <strong>Effects:</strong> It promoted trade between members but was
                largely controlled by the Soviet Union. It collapsed in 1991 with the
                fall of communism.
              </li>
            </ul>
            <TransportImage
              fileName="economic-groupings-map.png"
              alt="A map of the world showing the spatial arrangement of SADC, COMESA/PTA, EU, and former COMECON members"
              caption="Spatial arrangement of economic groupings: SADC, COMESA, EU, and COMECON."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Groupings Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>SADC:</strong> Southern Africa, aims at integration (1980)</li>
            <li><strong>PTA/COMESA:</strong> Eastern/Southern Africa, free trade (1981)</li>
            <li><strong>EU:</strong> European single market</li>
            <li><strong>COMECON:</strong> former socialist bloc (disbanded)</li>
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
            Transport and Trade Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore transport route development, topological networks, longitude/time,
            modern transport advances, trade patterns, regional imbalances, and
            economic groupings like SADC, COMESA, EU, and COMECON.
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
                  <strong className="text-white">Transport routes</strong> in Africa
                  are shaped by physical factors (relief, climate), economic needs
                  (trade), social demands, and political history (colonialism).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Transport networks</strong> are
                  studied using topological diagrams. They help planners decide
                  where to build schools and clinics based on accessibility.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Longitude and time:</strong> Earth
                  rotates 15° per hour. The IDL is at 180° – crossing west adds a
                  day, crossing east subtracts a day.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Modern transport</strong> uses
                  technology (GPS, EVs, automation) to improve speed, cost, and
                  safety, but causes environmental issues (pollution, congestion).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Trade</strong> involves national
                  (wholesale, retail) and international (exports, imports) exchange.
                  Zimbabwe trades minerals and tobacco for machinery and fuel.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Regional imbalances</strong> occur
                  due to resource distribution, colonial history, and poor terms of
                  trade, leading to debt and dependency.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Economic groupings</strong> like
                  SADC and COMESA aim to boost regional trade. They have had some
                  success but face challenges like overlapping memberships and
                  unequal development.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Transport and Trade Studies topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
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

export default TransportAndTradeStudies;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/transport/
   Use a mix of 2D diagram style and realistic photographs.

   --- DEVELOPMENT OF TRANSPORT ROUTES ---
   1. physical-factors-transport-africa.png
      Icons for relief, climate, rivers, vegetation, resources affecting route building.
   2. africa-transport-networks.png
      Map of Africa showing Trans-African Highways, Beira Corridor, Tazara Railway, major ports.

   --- TRANSPORT NETWORKS ---
   3. topological-diagram-network.png
      Side‑by‑side comparison: real map vs topological diagram (simplified nodes/edges).
   4. network-analysis-services.png
      Diagram showing a transport network with a new hospital/clinic placed at the most accessible node.

   --- LONGITUDE, TIME AND IDL ---
   5. longitude-time-zones.png
      Diagram showing the Prime Meridian, 15° intervals, and time zones across the globe.
   6. international-date-line.png
      World map focused on the Pacific showing the IDL, arrows for crossing (add/subtract day).

   --- MODERN TRANSPORT DEVELOPMENTS ---
   7. modern-transport-modes.png
      Split diagram: air (plane), water (container ship), road (EV, GPS), rail (high‑speed train).
   8. transport-environmental-impacts.png
      Icons for noise, air pollution, water pollution, land competition, congestion.

   --- TRADE AND TRADING PATTERNS ---
   9. trade-types.png
      Diagram: National (wholesale → retailer → consumer), International (exports/imports).
   10. zimbabwe-africa-trade-flows.png
      Map of Zimbabwe and Africa with arrows showing trade to SA, China, EU, and intra‑Africa.

   --- REGIONAL IMBALANCES ---
   11. regional-trade-imbalances.png
      Diagram showing causes (national: resources, infrastructure; international: colonial, terms of trade) and consequences (debt, dependency).

   --- ECONOMIC GROUPINGS ---
   12. economic-groupings-map.png
      World map highlighting SADC (southern Africa), COMESA (eastern/southern Africa), EU (Europe), COMECON (historically Soviet bloc).

   ============================================================ */