import React, { useState, useRef } from 'react';

/**
 * Topic: Industrial Studies – Geography
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const IndustrialStudies: React.FC = () => {
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
      id: 'factors-location',
      title: 'Factors Influencing Industrial Location',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Factors Affecting Where Industry Locates">
            <p>
              <strong>Definition:</strong> Industrial location refers to the geographical
              position where a factory or industry is established. The location of an
              industry is influenced by a range of factors that affect its profitability
              and efficiency. These factors are grouped into four main categories:
              physical, economic, social, and political factors.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Physical Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Raw materials:</strong> Industries that process raw materials
                need to be located near the source of those materials to reduce transport
                costs. This is especially important for heavy or bulky raw materials
                like iron ore, coal, and sugar cane.
              </li>
              <li>
                <strong>Energy sources:</strong> Industries that require large amounts
                of energy (e.g., aluminium smelting, steel production) need to be located
                near sources of cheap energy like hydroelectric power or coal.
              </li>
              <li>
                <strong>Water supply:</strong> Many industries require large amounts of
                water for cooling, washing, and processing. Industries like textile
                manufacturing, paper production, and food processing need reliable
                water sources.
              </li>
              <li>
                <strong>Climate:</strong> Some industries are affected by climate.
                For example, the textile industry prefers humid conditions to prevent
                thread breakage, while certain food processing industries need specific
                temperature conditions.
              </li>
              <li>
                <strong>Site and land:</strong> Industries need flat, stable land for
                factory construction. The land must be able to support heavy machinery
                and allow for future expansion.
              </li>
            </ul>

            <GeographyImage
              fileName="physical-factors-industrial-location.png"
              alt="A 2D diagram showing physical factors influencing industrial location: raw materials, energy, water supply, climate, and site"
              caption="Physical factors influencing industrial location: raw materials, energy, water, climate, and site."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Economic Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Markets:</strong> Industries that produce consumer goods need
                to be located near their markets to reduce transport costs and respond
                quickly to consumer demand. This is especially important for perishable
                goods like bread, milk, and fresh produce.
              </li>
              <li>
                <strong>Labour supply:</strong> Industries need workers. They tend to
                locate in areas with a large, skilled, and affordable labour force.
                This is why many industries are located in or near cities.
              </li>
              <li>
                <strong>Transport and infrastructure:</strong> Industries need good
                transport links (roads, railways, ports) to bring in raw materials
                and send out finished products. Areas with good infrastructure are
                more attractive to industry.
              </li>
              <li>
                <strong>Capital and investment:</strong> Industries need money to
                start and operate. They locate in areas where banks and investors
                are willing to provide capital.
              </li>
              <li>
                <strong>Economies of scale:</strong> Industries benefit from locating
                near other industries (agglomeration). This allows them to share
                infrastructure, services, and skilled labour, reducing costs.
              </li>
            </ul>

            <GeographyImage
              fileName="economic-factors-industrial-location.png"
              alt="A 2D diagram showing economic factors influencing industrial location: markets, labour, transport, capital, and agglomeration"
              caption="Economic factors influencing industrial location: markets, labour, transport, capital, and agglomeration."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Social Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Availability of skilled labour:</strong> Industries that require
                specialised skills need to locate in areas where there is a pool of
                skilled workers. This often means being near technical colleges,
                universities, or established industrial areas.
              </li>
              <li>
                <strong>Quality of life:</strong> To attract skilled workers, industries
                often locate in areas with good housing, schools, healthcare, and
                recreational facilities.
              </li>
              <li>
                <strong>Cultural and social amenities:</strong> Workers are attracted
                to areas with cultural activities, entertainment, and good social
                infrastructure.
              </li>
              <li>
                <strong>Housing:</strong> Industries need to ensure that workers have
                access to affordable housing. Areas with housing shortages may be
                less attractive.
              </li>
            </ul>

            <GeographyImage
              fileName="social-factors-industrial-location.png"
              alt="A 2D diagram showing social factors influencing industrial location: skilled labour, quality of life, amenities, and housing"
              caption="Social factors influencing industrial location: skilled labour, quality of life, amenities, and housing."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Political Factors</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Government policies:</strong> Governments can encourage or
                discourage industry through taxes, subsidies, and regulations.
                Industries may locate in areas with favourable tax policies or
                government incentives.
              </li>
              <li>
                <strong>Political stability:</strong> Industries prefer to locate in
                politically stable areas where there is little risk of conflict,
                nationalisation, or policy changes that could affect their operations.
              </li>
              <li>
                <strong>Trade policies:</strong> Tariffs, quotas, and trade agreements
                affect where industries locate. Industries may locate in countries
                with favourable trade agreements to access larger markets.
              </li>
              <li>
                <strong>Infrastructure development:</strong> Government investment in
                roads, railways, ports, and electricity makes an area more attractive
                to industry.
              </li>
              <li>
                <strong>Land use planning:</strong> Zoning laws and planning regulations
                affect where industries can locate. Some areas are designated for
                industrial use, while others are reserved for residential or commercial use.
              </li>
            </ul>

            <GeographyImage
              fileName="political-factors-industrial-location.png"
              alt="A 2D diagram showing political factors influencing industrial location: government policies, stability, trade policies, infrastructure, and planning"
              caption="Political factors influencing industrial location: policies, stability, trade, infrastructure, and planning."
            />
          </SubtopicCard>

          <SubtopicCard title="African Examples of Industrial Location">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example 1: Sugar Processing in Zimbabwe (Raw Material-Based)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Triangle and Hippo Valley in the Lowveld
                of Zimbabwe.
              </li>
              <li>
                <strong>Why here?</strong> The sugar industry is located near the
                sugarcane plantations to reduce transport costs. Sugarcane is bulky
                and heavy, so it is cheaper to process it near the source.
              </li>
              <li>
                <strong>Factors:</strong> Physical (fertile soils, water from rivers),
                Economic (labour, transport), Political (government support for
                irrigation schemes).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example 2: Iron and Steel Industry in South Africa</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Vanderbijlpark and Newcastle (South Africa).
              </li>
              <li>
                <strong>Why here?</strong> Located near sources of iron ore and coal,
                as well as transport routes (railways, rivers).
              </li>
              <li>
                <strong>Factors:</strong> Physical (iron ore, coal, water), Economic
                (markets, labour), Political (government support for industrialisation).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example 3: Oil Refining in Durban (Port Break-of-Bulk)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Durban, South Africa (port city).
              </li>
              <li>
                <strong>Why here?</strong> Crude oil is imported by ship and refined
                at the port. The port acts as a break-of-bulk point where raw materials
                are transferred from ships to processing plants.
              </li>
              <li>
                <strong>Factors:</strong> Physical (port facilities), Economic (markets,
                transport), Political (trade policies).
              </li>
            </ul>

            <GeographyImage
              fileName="african-industrial-location-examples.png"
              alt="A map of Africa showing the locations of sugar processing in Zimbabwe, iron and steel in South Africa, and oil refining in Durban"
              caption="African examples of industrial location: sugar processing (Zimbabwe), iron and steel (South Africa), and oil refining (Durban)."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Industrial location:</strong> where an industry is situated</li>
            <li><strong>Physical factors:</strong> raw materials, energy, water, climate</li>
            <li><strong>Economic factors:</strong> markets, labour, transport, capital</li>
            <li><strong>Social factors:</strong> skilled labour, quality of life</li>
            <li><strong>Political factors:</strong> policies, stability, infrastructure</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'types-location',
      title: 'Types of Industrial Location',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Types of Industrial Location">
            <p>
              <strong>Definition:</strong> Industries locate in different ways depending
              on what they produce and what they need. The three main types of industrial
              location are: raw-material-based industries, market-based industries,
              and port break-of-bulk industries.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Raw-Material-Based Industry</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Industries that locate near the source of
                their raw materials because the raw materials are heavy, bulky, or
                perishable, making transport expensive.
              </li>
              <li>
                <strong>How it works:</strong> The industry processes the raw material
                on-site or nearby to reduce the volume and weight before transporting
                the finished product to markets.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Sugarcane processing:</strong> Sugarcane is heavy and
                    bulky. It is processed near the plantations to extract sugar,
                    which is lighter and easier to transport. (Triangle and Hippo
                    Valley, Zimbabwe).
                  </li>
                  <li>
                    <strong>Iron and steel industry:</strong> Iron ore and coal are
                    heavy and bulky. Steel plants are often located near iron ore
                    and coal deposits (e.g., Vanderbijlpark, South Africa).
                  </li>
                  <li>
                    <strong>Timber processing:</strong> Sawmills are located near
                    forests to reduce the cost of transporting logs.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="raw-material-based-industry.png"
              alt="A 2D diagram showing raw-material-based industry: sugarcane processing near plantations, iron and steel near mines, and timber processing near forests"
              caption="Raw-material-based industry: locating near the source of raw materials."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Market-Based Industry</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Industries that locate near their markets
                because the finished products are perishable, fragile, or bulky, making
                transport to the consumer expensive.
              </li>
              <li>
                <strong>How it works:</strong> The industry produces goods close to
                where they will be sold to reduce transport costs and respond quickly
                to consumer demand.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Bread manufacture:</strong> Bread is perishable and needs
                    to be delivered fresh. Bakeries are located in or near cities and
                    towns where consumers live.
                  </li>
                  <li>
                    <strong>Soft drink bottling:</strong> Soft drinks are heavy and
                    bulky. They are bottled near markets to reduce transport costs.
                  </li>
                  <li>
                    <strong>Newspaper printing:</strong> Newspapers need to be
                    distributed quickly. Printing presses are located in cities where
                    readers are concentrated.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="market-based-industry.png"
              alt="A 2D diagram showing market-based industry: bakeries, soft drink bottling, and newspaper printing located near cities"
              caption="Market-based industry: locating near consumers."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Port Break-of-Bulk Industry</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Industries that locate at ports where raw
                materials are unloaded from ships (break-of-bulk point) and processed
                before being sent to markets.
              </li>
              <li>
                <strong>How it works:</strong> Raw materials are imported by ship and
                processed at the port. The finished products are then transported by
                rail or road to inland markets.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Oil refining:</strong> Crude oil is imported by tanker
                    and refined at coastal refineries (e.g., Durban, South Africa).
                  </li>
                  <li>
                    <strong>Grain milling:</strong> Imported grain (wheat, maize) is
                    unloaded at ports and milled into flour for distribution inland.
                  </li>
                  <li>
                    <strong>Vehicle assembly:</strong> Cars are imported in parts
                    (knocked down) and assembled at ports before distribution.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="port-break-of-bulk-industry.png"
              alt="A 2D diagram showing port break-of-bulk industry: oil refining, grain milling, and vehicle assembly at ports"
              caption="Port break-of-bulk industry: locating at ports for processing imported materials."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Location Types Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Raw-material-based:</strong> near source (sugar, steel, timber)</li>
            <li><strong>Market-based:</strong> near consumers (bread, soft drinks)</li>
            <li><strong>Port break-of-bulk:</strong> at ports (oil refining, grain milling)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'changing-location',
      title: 'Changing Industrial Location',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Reasons Behind Industry Relocation">
            <p>
              <strong>Definition:</strong> Industries sometimes relocate from one area
              to another. This can happen for several reasons, including changes in
              technology, raw materials, markets, labour, and government policies.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Reasons for Relocation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Depletion of raw materials:</strong> When raw materials run
                out, industries must move to new sources. For example, iron ore mines
                being exhausted.
              </li>
              <li>
                <strong>Changes in technology:</strong> New technology may make it
                cheaper to locate elsewhere. For example, the development of container
                shipping has reduced transport costs, allowing industries to move to
                coastal ports.
              </li>
              <li>
                <strong>Changes in markets:</strong> As populations grow and move,
                markets shift. Industries may relocate to be closer to new markets.
              </li>
              <li>
                <strong>Labour costs:</strong> Industries may relocate to areas with
                cheaper labour, especially for labour-intensive manufacturing.
              </li>
              <li>
                <strong>Government policies:</strong> Governments may offer incentives
                (tax breaks, subsidies) to attract industries to certain areas.
              </li>
              <li>
                <strong>Land costs:</strong> As land prices rise in established
                industrial areas, industries may relocate to cheaper areas.
              </li>
              <li>
                <strong>Environmental regulations:</strong> Strict environmental laws
                may encourage industries to relocate to areas with less regulation.
              </li>
            </ul>

            <GeographyImage
              fileName="industry-relocation-reasons.png"
              alt="A 2D diagram showing reasons for industry relocation: depletion of raw materials, technology, markets, labour, policies, land costs, and regulations"
              caption="Reasons for industry relocation."
            />
          </SubtopicCard>

          <SubtopicCard title="Case Study: Iron and Steel Industry Relocation (UK/USA)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Introduction</h4>
            <p>
              The iron and steel industry has undergone significant relocation in
              both the United Kingdom and the United States. This case study examines
              the reasons behind these changes and their effects.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">United Kingdom Case Study</h4>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Traditional Location (19th – 20th Century)</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Inland areas near coal and iron ore
                deposits – South Wales, Sheffield, and the Midlands.
              </li>
              <li>
                <strong>Why there?</strong> The industry was located near raw materials
                (coal and iron ore) to reduce transport costs. Coal and iron ore were
                heavy and bulky, so it was cheaper to process them near the source.
              </li>
              <li>
                <strong>Key plants:</strong> Ebbw Vale (South Wales), Sheffield,
                Consett, and Corby.
              </li>
            </ul>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Recent Relocation (Late 20th – 21st Century)</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>New location:</strong> Coastal locations – Port Talbot
                (South Wales) and Scunthorpe (near the coast).
              </li>
              <li>
                <strong>Why relocate?</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Depletion of raw materials:</strong> UK coal and iron ore
                    deposits were running out. The industry became dependent on
                    imported raw materials.
                  </li>
                  <li>
                    <strong>Cheaper imports:</strong> It was cheaper to import
                    high-quality iron ore from countries like Brazil, Australia,
                    and Sweden by ship.
                  </li>
                  <li>
                    <strong>Technology:</strong> Bulk carriers and container ships
                    made it cheaper to transport raw materials over long distances.
                  </li>
                  <li>
                    <strong>Declining demand:</strong> The UK steel industry faced
                    competition from cheaper imports from countries like China,
                    Japan, and South Korea.
                  </li>
                  <li>
                    <strong>Government policy:</strong> The UK government encouraged
                    rationalisation and closure of uneconomic steel plants.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Consequences:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Closure of many inland steel plants (e.g., Consett, Corby).</li>
                  <li>Loss of thousands of jobs in traditional steel areas.</li>
                  <li>Economic decline in former steel towns.</li>
                  <li>Development of modern, efficient coastal steel plants (e.g., Port Talbot).</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="uk-steel-industry-relocation.png"
              alt="A map of the UK showing the relocation of the steel industry from inland areas (South Wales, Sheffield, Midlands) to coastal locations (Port Talbot, Scunthorpe)"
              caption="Relocation of the UK steel industry: from inland to coastal locations."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">United States Case Study</h4>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Traditional Location (19th – 20th Century)</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> The "Rust Belt" – Pittsburgh, Cleveland,
                Detroit, and Chicago (Great Lakes region).
              </li>
              <li>
                <strong>Why there?</strong> Located near coal and iron ore deposits,
                with water transport on the Great Lakes. The region became the
                centre of US steel production.
              </li>
            </ul>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Recent Relocation (Late 20th – 21st Century)</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>New locations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Coastal locations (e.g., Mobile, Alabama; Portland, Oregon).</li>
                  <li>Southern states (e.g., Texas, Alabama, South Carolina).</li>
                  <li>International relocation to China, India, and other developing countries.</li>
                </ul>
              </li>
              <li>
                <strong>Why relocate?</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Depletion of raw materials:</strong> High-grade iron ore
                    and coal deposits were running out.
                  </li>
                  <li>
                    <strong>Cheaper imports:</strong> Steel from countries with lower
                    labour costs (e.g., China, South Korea) was cheaper.
                  </li>
                  <li>
                    <strong>Labour costs:</strong> Labour costs in the Rust Belt were
                    high due to strong unions.
                  </li>
                  <li>
                    <strong>Technology:</strong> New technologies (electric arc furnaces)
                    allowed steel production using scrap metal, reducing the need for
                    raw materials.
                  </li>
                  <li>
                    <strong>Environmental regulations:</strong> Stricter environmental
                    laws in the Rust Belt encouraged relocation to areas with less
                    regulation (e.g., Southern states).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Consequences:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Closure of many steel plants in the Rust Belt.</li>
                  <li>Loss of thousands of jobs and economic decline in cities
                    like Pittsburgh and Detroit.</li>
                  <li>Development of new steel plants in coastal and southern areas.</li>
                  <li>Shift of steel production to developing countries (globalisation).</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="us-steel-industry-relocation.png"
              alt="A map of the USA showing the relocation of the steel industry from the Rust Belt (Pittsburgh, Cleveland, Detroit) to coastal and southern locations"
              caption="Relocation of the US steel industry: from the Rust Belt to coastal and southern states."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Relocation Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>UK:</strong> inland (coal/iron) → coastal (imports)</li>
            <li><strong>USA:</strong> Rust Belt → coastal, southern states</li>
            <li><strong>Reasons:</strong> depletion, cheaper imports, technology, labour, environment</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'transnational-industries',
      title: 'Transnational Industries',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Transnational Corporations">
            <p>
              <strong>Definition:</strong> A Transnational Corporation (TNC), also known
              as a Multinational Corporation (MNC), is a company that operates in more
              than one country. It has its headquarters in one country (the home country)
              and has subsidiaries, factories, or offices in other countries (host countries).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Role and Structure of Transnational Corporations</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Structure:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Headquarters:</strong> Located in the home country
                    (usually a developed country like the USA, UK, Japan, or Germany).
                  </li>
                  <li>
                    <strong>Subsidiaries:</strong> Located in host countries
                    (often developing countries) where they produce goods, provide
                    services, or sell products.
                  </li>
                  <li>
                    <strong>Global supply chains:</strong> TNCs have complex supply
                    chains that span multiple countries, sourcing raw materials from
                    one country, manufacturing in another, and selling in a third.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Role in locating industry:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Taking advantage of low-cost labour:</strong> TNCs often
                    locate factories in developing countries where labour costs are
                    lower.
                  </li>
                  <li>
                    <strong>Access to raw materials:</strong> TNCs locate where raw
                    materials are available and cheap.
                  </li>
                  <li>
                    <strong>Access to markets:</strong> TNCs locate in countries
                    with large consumer markets.
                  </li>
                  <li>
                    <strong>Incentives:</strong> Host countries often offer tax breaks,
                    subsidies, and other incentives to attract TNCs.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="tnc-structure-diagram.png"
              alt="A 2D diagram showing the structure of a Transnational Corporation: headquarters in home country (USA), subsidiaries in host countries (Africa, Asia, South America)"
              caption="Structure of a Transnational Corporation: headquarters and subsidiaries."
            />
          </SubtopicCard>

          <SubtopicCard title="Importance of Transnational Corporations in the Zimbabwean Economy">
            <p>
              Zimbabwe has several TNCs operating in various sectors, including mining,
              manufacturing, and agriculture. These companies contribute significantly
              to the Zimbabwean economy.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Anglo-American</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Anglo-American is a mining TNC headquartered
                in the United Kingdom. It is one of the world's largest mining companies.
              </li>
              <li>
                <strong>Operations in Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Mines gold, platinum, and other minerals.</li>
                  <li>Operates through subsidiaries like Anglo-American Zimbabwe.</li>
                </ul>
              </li>
              <li>
                <strong>Importance to Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Generates foreign currency through mineral exports.</li>
                  <li>Provides employment for thousands of Zimbabweans.</li>
                  <li>Contributes to government revenue through taxes and royalties.</li>
                  <li>Supports infrastructure development in mining areas.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="anglo-american-zimbabwe.png"
              alt="A realistic photograph showing Anglo-American mining operations in Zimbabwe: open-pit mine, processing plant, and workers"
              caption="Anglo-American mining operations in Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Lonrho</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Lonrho (London and Rhodesia) was a major
                TNC with diverse interests in agriculture, mining, transport, and
                manufacturing. It was headquartered in the UK.
              </li>
              <li>
                <strong>Operations in Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Agriculture (sugar, tea, coffee, cotton).</li>
                  <li>Mining (gold, diamonds).</li>
                  <li>Manufacturing (textiles, food processing).</li>
                  <li>Transport (railways, aviation).</li>
                </ul>
              </li>
              <li>
                <strong>Importance to Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Played a key role in Zimbabwe's industrial development.</li>
                  <li>Provided employment and training.</li>
                  <li>Contributed to export earnings.</li>
                  <li>Developed infrastructure (roads, railways).</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="lonrho-zimbabwe-operations.png"
              alt="A realistic photograph showing Lonrho's agricultural and industrial operations in Zimbabwe: sugar plantation, factory, and transport"
              caption="Lonrho operations in Zimbabwe: agriculture, manufacturing, and transport."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Bata</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Bata is a shoe manufacturing TNC headquartered
                in Switzerland. It is one of the world's largest footwear companies.
              </li>
              <li>
                <strong>Operations in Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Bata has a shoe factory in Gweru, Zimbabwe.</li>
                  <li>Produces shoes for the domestic market and for export.</li>
                </ul>
              </li>
              <li>
                <strong>Importance to Zimbabwe:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Provides employment and training.</li>
                  <li>Produces affordable footwear for Zimbabweans.</li>
                  <li>Contributes to export earnings.</li>
                  <li>Supports local leather and textile industries.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="bata-factory-zimbabwe.png"
              alt="A realistic photograph showing the Bata shoe factory in Gweru, Zimbabwe: factory building, workers, and production line"
              caption="Bata shoe factory in Gweru, Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">TNC Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>TNC:</strong> operates in multiple countries</li>
            <li><strong>Anglo-American:</strong> mining (gold, platinum)</li>
            <li><strong>Lonrho:</strong> agriculture, mining, manufacturing</li>
            <li><strong>Bata:</strong> shoe manufacturing (Gweru)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'zimbabwe-industry',
      title: 'Character and Distribution of Industry in Zimbabwe',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Character of Zimbabwean Industry">
            <p>
              <strong>Definition:</strong> The character of industry refers to the types,
              scale, and nature of industrial activities in a country. Zimbabwe's
              industry is diverse but has specific characteristics.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Key Characteristics</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Import substitution industrialisation:</strong> After
                independence, Zimbabwe pursued import substitution, producing goods
                that were previously imported. This led to the development of a
                diversified manufacturing sector.
              </li>
              <li>
                <strong>Importance of mining:</strong> Mining is a major industry,
                including gold, platinum, coal, nickel, and chrome. The mining sector
                is a key source of export earnings.
              </li>
              <li>
                <strong>Agricultural processing:</strong> Zimbabwe has significant
                agro-processing industries, including sugar refining, tobacco
                processing, cotton ginning, and food processing.
              </li>
              <li>
                <strong>Declining manufacturing:</strong> Since the early 2000s,
                manufacturing has declined due to economic challenges, including
                lack of investment, competition from imports, and currency problems.
              </li>
              <li>
                <strong>Small and medium enterprises (SMEs):</strong> SMEs are
                increasingly important in the Zimbabwean economy, especially in
                manufacturing, textiles, and food processing.
              </li>
            </ul>

            <GeographyImage
              fileName="zimbabwe-industry-character.png"
              alt="A 2D diagram showing the character of Zimbabwean industry: mining, agro-processing, manufacturing, and SMEs"
              caption="Character of Zimbabwean industry: mining, agro-processing, manufacturing, and SMEs."
            />
          </SubtopicCard>

          <SubtopicCard title="Distribution of Industry in Zimbabwe">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Major Industrial Areas</h4>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Harare</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Industries:</strong> Manufacturing, food processing,
                textiles, printing, engineering, and plastics.
              </li>
              <li>
                <strong>Why here?</strong> Harare is the capital city, with the
                largest population and market. It has good transport links, a
                skilled labour force, and access to services.
              </li>
            </ul>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Bulawayo</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Industries:</strong> Heavy industry (steel, engineering),
                food processing, textiles, and footwear.
              </li>
              <li>
                <strong>Why here?</strong> Bulawayo is Zimbabwe's second-largest city
                and a former industrial centre. It has good transport links (roads,
                railways) and access to coal and steel.
              </li>
            </ul>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Mutare</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Industries:</strong> Timber processing, tea and coffee
                processing, textiles, and manufacturing.
              </li>
              <li>
                <strong>Why here?</strong> Located near the Eastern Highlands with
                access to timber, tea, and coffee plantations. Good transport links
                to Mozambique.
              </li>
            </ul>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Gweru</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Industries:</strong> Shoe manufacturing (Bata), engineering,
                and food processing.
              </li>
              <li>
                <strong>Why here?</strong> Located in the Midlands with access to
                labour and markets. Good transport links.
              </li>
            </ul>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Kwekwe</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Industries:</strong> Steel and iron (ZISCO), engineering,
                and mining.
              </li>
              <li>
                <strong>Why here?</strong> Located near iron ore and coal deposits.
                Home to the Zimbabwe Iron and Steel Company (ZISCO).
              </li>
            </ul>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Triangle and Hippo Valley</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Industries:</strong> Sugar processing, citrus processing.
              </li>
              <li>
                <strong>Why here?</strong> Located near sugarcane plantations with
                access to irrigation water from the Save and Runde rivers.
              </li>
            </ul>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Hwange</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Industries:</strong> Coal mining, electricity generation
                (Hwange Thermal Power Station).
              </li>
              <li>
                <strong>Why here?</strong> Located on the country's largest coal deposits.
              </li>
            </ul>

            <GeographyImage
              fileName="zimbabwe-industrial-distribution-map.png"
              alt="A map of Zimbabwe showing the distribution of major industrial areas: Harare, Bulawayo, Mutare, Gweru, Kwekwe, Triangle, and Hwange"
              caption="Distribution of industry in Zimbabwe: major industrial areas."
            />
          </SubtopicCard>

          <SubtopicCard title="Consequences of Industrial Development">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Positive Consequences</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Economic growth:</strong> Industry contributes to GDP, export
                earnings, and government revenue.
              </li>
              <li>
                <strong>Employment:</strong> Industry provides jobs for thousands of
                Zimbabweans, reducing unemployment and poverty.
              </li>
              <li>
                <strong>Infrastructure development:</strong> Industry supports the
                development of roads, railways, electricity, and water supply.
              </li>
              <li>
                <strong>Skills development:</strong> Industry trains workers and
                develops technical skills.
              </li>
              <li>
                <strong>Innovation:</strong> Industry encourages research and
                development, leading to innovation.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Negative Consequences</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Environmental pollution:</strong> Industry pollutes air,
                water, and land with waste and emissions. This affects health and
                the environment.
              </li>
              <li>
                <strong>Resource depletion:</strong> Industry uses up natural
                resources (minerals, water, energy), reducing their availability
                for future generations.
              </li>
              <li>
                <strong>Urbanisation:</strong> Industry attracts people to cities,
                leading to overcrowding, housing shortages, and strain on services.
              </li>
              <li>
                <strong>Declining traditional industries:</strong> Some traditional
                industries (e.g., small-scale agriculture) may be neglected as
                people move to industrial areas.
              </li>
              <li>
                <strong>Economic vulnerability:</strong> Dependence on a few industries
                (e.g., mining) makes the economy vulnerable to price changes and
                demand fluctuations.
              </li>
            </ul>

            <GeographyImage
              fileName="industrial-consequences.png"
              alt="A split 2D diagram showing positive consequences (economic growth, employment, infrastructure) and negative consequences (pollution, resource depletion, urbanisation) of industrial development"
              caption="Consequences of industrial development: positive and negative impacts."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Zimbabwe Industry</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Major cities:</strong> Harare, Bulawayo, Mutare, Gweru</li>
            <li><strong>Key sectors:</strong> mining, agro-processing, manufacturing</li>
            <li><strong>Positive:</strong> jobs, GDP, infrastructure</li>
            <li><strong>Negative:</strong> pollution, resource depletion, urbanisation</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'service-industries',
      title: 'Service Industries',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition of Service Industries">
            <p>
              <strong>Definition:</strong> Service industries, also known as the
              tertiary sector, are businesses that provide services rather than
              physical goods. They include banking, insurance, transport, tourism,
              retail, healthcare, and education.
            </p>
            <p>
              The service sector is the fastest-growing sector in most economies,
              especially in developed countries. In developing countries, the service
              sector is also growing rapidly as economies diversify.
            </p>

            <GeographyImage
              fileName="service-industries-examples.png"
              alt="A 2D diagram showing examples of service industries: banking, insurance, transport, tourism, retail, healthcare, and education"
              caption="Examples of service industries: banking, insurance, transport, tourism, retail, healthcare, and education."
            />
          </SubtopicCard>

          <SubtopicCard title="Factors Influencing the Development of Service Industries">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Economic development:</strong> As countries develop, there
                is more demand for services like banking, insurance, and tourism.
                People have more disposable income to spend on services.
              </li>
              <li>
                <strong>Urbanisation:</strong> Cities provide a large market for
                services. As people move to cities, demand for services grows.
              </li>
              <li>
                <strong>Technology:</strong> Advances in technology (e.g., the internet,
                mobile phones) have enabled the growth of many service industries,
                such as e-commerce, call centres, and financial services.
              </li>
              <li>
                <strong>Government policies:</strong> Governments can encourage the
                growth of service industries through deregulation, investment in
                infrastructure, and education.
              </li>
              <li>
                <strong>Globalisation:</strong> Globalisation has led to the growth
                of international trade in services, including tourism, finance,
                and outsourcing.
              </li>
              <li>
                <strong>Demographics:</strong> An ageing population increases demand
                for healthcare services. A young population increases demand for
                education and training.
              </li>
            </ul>

            <GeographyImage
              fileName="factors-service-industries.png"
              alt="A 2D diagram showing factors influencing service industry development: economic development, urbanisation, technology, government policies, globalisation, and demographics"
              caption="Factors influencing the development of service industries."
            />
          </SubtopicCard>

          <SubtopicCard title="Role of Key Service Industries">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Banking</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Banking is the business of accepting
                deposits, lending money, and providing financial services.
              </li>
              <li>
                <strong>Role:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Provides financial services to individuals, businesses, and governments.</li>
                  <li>Facilitates investment and economic growth through lending.</li>
                  <li>Enables international trade through foreign exchange and trade finance.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe:</strong> Banks in Zimbabwe include CBZ, Stanbic,
                Standard Chartered, and the Reserve Bank of Zimbabwe.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Insurance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Insurance is the business of providing
                financial protection against risks (e.g., accidents, illness, fire,
                theft).
              </li>
              <li>
                <strong>Role:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Provides financial protection to individuals and businesses.</li>
                  <li>Encourages investment and risk-taking by reducing risk.</li>
                  <li>Supports economic stability by spreading risk.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe:</strong> Insurance companies include Old Mutual,
                ZimRe, and Nyaradzo.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Distribution and Transport</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Distribution involves moving goods from
                producers to consumers. Transport is the movement of people and goods.
              </li>
              <li>
                <strong>Role:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Connects producers and consumers, enabling trade.</li>
                  <li>Supports other industries by moving raw materials and finished goods.</li>
                  <li>Provides employment and supports economic growth.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Tourism</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Tourism is the business of providing
                services to people who are travelling for leisure, business, or other purposes.
              </li>
              <li>
                <strong>Role:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Generates foreign currency earnings.</li>
                  <li>Provides employment (hotels, restaurants, tour operators).</li>
                  <li>Promotes cultural exchange and international understanding.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Information Services</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Information services include the collection,
                processing, and distribution of information (e.g., IT services, media,
                telecommunications).
              </li>
              <li>
                <strong>Role:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Enables communication and data transfer.</li>
                  <li>Supports other industries through IT services.</li>
                  <li>Creates employment in IT, media, and telecommunications.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="service-industries-roles.png"
              alt="A 2D diagram showing the roles of key service industries: banking, insurance, distribution, tourism, and information services"
              caption="Roles of key service industries: banking, insurance, distribution, tourism, and information services."
            />
          </SubtopicCard>

          <SubtopicCard title="Comparing Zimbabwe's Tertiary Sector to a Developed Country">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Comparison: Zimbabwe vs United Kingdom</h4>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Zimbabwe</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Share of GDP:</strong> Services account for about 60-65% of GDP.
              </li>
              <li>
                <strong>Key sectors:</strong> Banking, distribution (retail and wholesale),
                tourism, transport.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Growing but constrained by economic challenges.</li>
                  <li>Informal sector is large and important.</li>
                  <li>Tourism is important but underdeveloped.</li>
                  <li>IT services are growing but limited.</li>
                </ul>
              </li>
              <li>
                <strong>Challenges:</strong> Lack of investment, skills shortages,
                and infrastructure limitations.
              </li>
            </ul>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">United Kingdom (Developed Country)</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Share of GDP:</strong> Services account for about 80-85% of GDP.
              </li>
              <li>
                <strong>Key sectors:</strong> Financial services, insurance, IT,
                tourism, healthcare, education, creative industries.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Highly developed and diversified.</li>
                  <li>Global financial centre (City of London).</li>
                  <li>Strong IT and technology sector.</li>
                  <li>World-class tourism and cultural industries.</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong> High investment, skilled workforce,
                advanced infrastructure, and strong government support.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Key Differences</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Size:</strong> The UK service sector is much larger and more
                diversified than Zimbabwe's.
              </li>
              <li>
                <strong>Technology:</strong> The UK has advanced technology and
                digital services, while Zimbabwe's technology sector is still developing.
              </li>
              <li>
                <strong>Skills:</strong> The UK has a highly skilled workforce,
                while Zimbabwe faces skills shortages.
              </li>
              <li>
                <strong>Infrastructure:</strong> The UK has advanced infrastructure,
                while Zimbabwe's infrastructure is aging and limited.
              </li>
              <li>
                <strong>Formal vs Informal:</strong> Zimbabwe has a large informal
                service sector, while the UK's service sector is mostly formal.
              </li>
            </ul>

            <GeographyImage
              fileName="service-sector-comparison.png"
              alt="A split 2D diagram comparing Zimbabwe's service sector (60-65% GDP) with the UK's service sector (80-85% GDP)"
              caption="Comparison of Zimbabwe's tertiary sector with the United Kingdom."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Services Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Services:</strong> banking, insurance, distribution, tourism, IT</li>
            <li><strong>Zimbabwe:</strong> 60-65% GDP, growing, informal</li>
            <li><strong>UK:</strong> 80-85% GDP, highly developed, diverse</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'tourism',
      title: 'Tourism (Case Study)',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Tourism Case Study: Zimbabwe and South Africa">
            <p>
              <strong>Definition:</strong> Tourism is the activity of people travelling
              to and staying in places outside their usual environment for leisure,
              business, or other purposes. It includes the services and industries
              that support this activity (hotels, restaurants, tour operators).
            </p>

            <GeographyImage
              fileName="tourism-overview.png"
              alt="A 2D diagram showing the key components of tourism: attractions, accommodation, transport, and services"
              caption="Key components of tourism: attractions, accommodation, transport, and services."
            />
          </SubtopicCard>

          <SubtopicCard title="Case Study: Tourism in Zimbabwe">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Introduction</h4>
            <p>
              Zimbabwe has significant tourism potential due to its natural attractions,
              wildlife, and cultural heritage. Tourism is an important sector of the
              Zimbabwean economy, contributing to GDP, employment, and foreign currency earnings.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Key Attractions</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Victoria Falls:</strong> One of the Seven Natural Wonders of
                the World. Located on the Zambezi River, it is a major tourist attraction.
              </li>
              <li>
                <strong>National Parks and Wildlife:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Hwange National Park:</strong> Zimbabwe's largest national park, famous for elephants.</li>
                  <li><strong>Mana Pools National Park:</strong> A UNESCO World Heritage Site with wildlife and floodplains.</li>
                  <li><strong>Gonarezhou National Park:</strong> Known for its diverse wildlife and landscapes.</li>
                  <li><strong>Matopos Hills:</strong> Granite kopjes and wildlife, including rhinos.</li>
                </ul>
              </li>
              <li>
                <strong>Cultural and Historical Sites:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Great Zimbabwe Ruins:</strong> A UNESCO World Heritage Site and the remains of an ancient city.</li>
                  <li><strong>Khami Ruins:</strong> Another UNESCO World Heritage Site near Bulawayo.</li>
                </ul>
              </li>
              <li>
                <strong>Scenic Landscapes:</strong> Eastern Highlands (Nyanga, Vumba, Chimanimani) with mountains, forests, and waterfalls.
              </li>
            </ul>

            <GeographyImage
              fileName="zimbabwe-tourism-attractions.png"
              alt="A map of Zimbabwe showing major tourist attractions: Victoria Falls, Hwange, Mana Pools, Gonarezhou, Great Zimbabwe, Eastern Highlands"
              caption="Major tourist attractions in Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Importance of Tourism in Zimbabwe</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Economic contribution:</strong> Tourism contributes to GDP,
                generates foreign currency, and supports businesses.
              </li>
              <li>
                <strong>Employment:</strong> Tourism provides direct employment in
                hotels, lodges, tour operators, and transport. It also creates indirect
                employment in related industries.
              </li>
              <li>
                <strong>Infrastructure development:</strong> Tourism supports the
                development of roads, airports, and communication networks.
              </li>
              <li>
                <strong>Conservation:</strong> Tourism revenue funds conservation
                efforts in national parks and wildlife areas.
              </li>
              <li>
                <strong>Community development:</strong> Community-based tourism projects
                benefit local communities through income and employment.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Challenges Facing Tourism in Zimbabwe</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Political and economic instability:</strong> Political uncertainty
                and economic challenges have deterred some tourists and investors.
              </li>
              <li>
                <strong>Infrastructure limitations:</strong> Poor roads, unreliable
                electricity, and limited airport capacity affect tourism.
              </li>
              <li>
                <strong>Competition from other destinations:</strong> South Africa,
                Kenya, and Tanzania compete for the same tourist market.
              </li>
              <li>
                <strong>Poaching:</strong> Poaching threatens wildlife populations,
                especially elephants and rhinos.
              </li>
              <li>
                <strong>Climate change:</strong> Droughts and changing weather patterns
                affect wildlife and the attractiveness of natural attractions.
              </li>
            </ul>

            <GeographyImage
              fileName="zimbabwe-tourism-challenges.png"
              alt="A 2D diagram showing challenges facing tourism in Zimbabwe: political instability, infrastructure, competition, poaching, and climate change"
              caption="Challenges facing tourism in Zimbabwe."
            />
          </SubtopicCard>

          <SubtopicCard title="Case Study: Tourism in South Africa">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Introduction</h4>
            <p>
              South Africa is one of Africa's most popular tourist destinations.
              It attracts millions of visitors each year due to its diverse attractions,
              well-developed infrastructure, and strong tourism industry.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Key Attractions</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Natural Attractions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Table Mountain:</strong> A flat-topped mountain in Cape Town, a major landmark.</li>
                  <li><strong>Kruger National Park:</strong> One of Africa's largest game reserves, famous for the "Big Five".</li>
                  <li><strong>Garden Route:</strong> A scenic coastal route with forests, beaches, and lagoons.</li>
                  <li><strong>Drakensberg Mountains:</strong> A mountain range with hiking, climbing, and stunning views.</li>
                </ul>
              </li>
              <li>
                <strong>Cultural and Historical Sites:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Robben Island:</strong> A UNESCO World Heritage Site where Nelson Mandela was imprisoned.</li>
                  <li><strong>Cape Town's V&A Waterfront:</strong> A major tourist and shopping destination.</li>
                  <li><strong>Johannesburg's Apartheid Museum:</strong> A museum documenting the history of apartheid.</li>
                </ul>
              </li>
              <li>
                <strong>Scenic Landscapes:</strong> Beaches, mountains, forests, and winelands (Stellenbosch, Franschhoek).
              </li>
            </ul>

            <GeographyImage
              fileName="south-africa-tourism-attractions.png"
              alt="A map of South Africa showing major tourist attractions: Table Mountain, Kruger National Park, Garden Route, Drakensberg, Robben Island"
              caption="Major tourist attractions in South Africa."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Importance of Tourism in South Africa</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Economic contribution:</strong> Tourism contributes significantly
                to GDP, foreign currency earnings, and job creation.
              </li>
              <li>
                <strong>Employment:</strong> Tourism provides millions of jobs across
                the country, especially in hospitality, transport, and services.
              </li>
              <li>
                <strong>Infrastructure:</strong> Tourism supports world-class
                infrastructure (airports, roads, hotels).
              </li>
              <li>
                <strong>Conservation:</strong> Tourism revenue funds wildlife and
                environmental conservation.
              </li>
              <li>
                <strong>Cultural and international exchange:</strong> Tourism promotes
                cultural understanding and international relations.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Comparison: Zimbabwe vs South Africa</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Size of industry:</strong> South Africa's tourism industry is
                much larger and more developed than Zimbabwe's.
              </li>
              <li>
                <strong>Infrastructure:</strong> South Africa has world-class infrastructure,
                while Zimbabwe's is limited.
              </li>
              <li>
                <strong>Marketing and promotion:</strong> South Africa spends more on
                tourism marketing and promotion.
              </li>
              <li>
                <strong>Diversity:</strong> South Africa offers a wider range of
                attractions (beaches, cities, winelands, wildlife).
              </li>
              <li>
                <strong>Accessibility:</strong> South Africa has better international
                connections and more accessible airports.
              </li>
              <li>
                <strong>Political stability:</strong> South Africa is generally more
                politically stable, which attracts more tourists.
              </li>
            </ul>

            <GeographyImage
              fileName="tourism-comparison-zimbabwe-south-africa.png"
              alt="A split 2D diagram comparing tourism in Zimbabwe and South Africa: attractions, infrastructure, visitors, and economic impact"
              caption="Comparison of tourism in Zimbabwe and South Africa."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Tourism Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Zimbabwe:</strong> Victoria Falls, Hwange, Great Zimbabwe</li>
            <li><strong>South Africa:</strong> Table Mountain, Kruger, Garden Route</li>
            <li><strong>Benefits:</strong> GDP, employment, conservation</li>
            <li><strong>Challenges:</strong> instability, infrastructure, competition</li>
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
            Industrial Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the factors influencing industrial location, types of industrial
            location, changing industrial patterns, transnational corporations,
            Zimbabwe's industrial character and distribution, service industries,
            and tourism case studies in Zimbabwe and South Africa.
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
                  <strong className="text-white">Factors Influencing Location:</strong> Physical
                  (raw materials, energy, water), Economic (markets, labour, transport),
                  Social (skilled labour, quality of life), and Political (government
                  policies, stability) all affect where industry locates.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Types of Location:</strong> Raw-material-based
                  (sugar processing), Market-based (bread manufacture), and Port
                  break-of-bulk (oil refining) each have distinct location patterns.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Changing Location:</strong> Iron and steel
                  industries in the UK and USA have relocated from inland areas to
                  coastal locations due to depletion of raw materials, cheaper imports,
                  and technology changes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Transnational Corporations:</strong> TNCs
                  like Anglo-American, Lonrho, and Bata play a significant role in
                  Zimbabwe's economy through mining, agriculture, and manufacturing.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Zimbabwe's Industry:</strong> Characterised
                  by mining, agro-processing, and manufacturing. Major industrial areas
                  include Harare, Bulawayo, Mutare, and Gweru.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Service Industries:</strong> Banking,
                  insurance, distribution, tourism, and IT services are growing.
                  Zimbabwe's service sector (60-65% GDP) is smaller than developed
                  countries like the UK (80-85% GDP).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Tourism:</strong> Zimbabwe's attractions
                  include Victoria Falls, Hwange, and Great Zimbabwe. South Africa has
                  a larger, more developed tourism industry with attractions like
                  Table Mountain, Kruger, and the Garden Route.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Industrial Studies topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
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

export default IndustrialStudies;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/geography/
   Use a mix of 2D diagram style and realistic photographs.

   --- FACTORS INFLUENCING INDUSTRIAL LOCATION IMAGES (2D DIAGRAM STYLE) ---

   1. physical-factors-industrial-location.png
      A 2D diagram showing physical factors: raw materials (mining, agriculture), energy (coal, hydro), water supply (river, dam), climate, and site (flat land).
      Use icons and brief explanations for each factor.

   2. economic-factors-industrial-location.png
      A 2D diagram showing economic factors: markets (city, shops), labour (factory workers), transport (roads, railways, port), capital (money, bank), and agglomeration (multiple factories together).
      Use icons and brief explanations for each factor.

   3. social-factors-industrial-location.png
      A 2D diagram showing social factors: skilled labour (college, training), quality of life (housing, schools, healthcare), amenities (parks, entertainment), and housing.
      Use icons and brief explanations for each factor.

   4. political-factors-industrial-location.png
      A 2D diagram showing political factors: government policies (tax breaks, subsidies), political stability (peace), trade policies (tariffs, agreements), infrastructure (roads, electricity), and land use planning (industrial zones).
      Use icons and brief explanations for each factor.

   5. african-industrial-location-examples.png
      A map of Africa showing the locations of: sugar processing in Zimbabwe (Triangle/Hippo Valley), iron and steel in South Africa (Vanderbijlpark, Newcastle), and oil refining in Durban (South Africa).
      Use labels and brief explanations for each location.

   --- TYPES OF INDUSTRIAL LOCATION IMAGES (2D DIAGRAM STYLE) ---

   6. raw-material-based-industry.png
      A 2D diagram showing raw-material-based industry: sugarcane fields leading to a sugar mill, iron ore mine leading to a steel plant, and forest leading to a sawmill.
      Show the flow from raw material to processing factory.

   7. market-based-industry.png
      A 2D diagram showing market-based industry: a city with bakeries, soft drink bottling plants, and newspaper printing presses located near consumers.
      Show arrows indicating products going to consumers.

   8. port-break-of-bulk-industry.png
      A 2D diagram showing port break-of-bulk industry: oil refinery at a port, grain mill at a port, and vehicle assembly at a port.
      Show ships bringing raw materials and processed products going inland.

   --- CHANGING INDUSTRIAL LOCATION IMAGES (2D DIAGRAM AND REALISTIC) ---

   9. industry-relocation-reasons.png
      A 2D diagram showing reasons for industry relocation: depletion of raw materials, changes in technology, changes in markets, labour costs, government policies, land costs, and environmental regulations.
      Use icons and brief explanations for each reason.

   10. uk-steel-industry-relocation.png
       A map of the UK showing the relocation of the steel industry from inland areas (South Wales, Sheffield, Midlands) to coastal locations (Port Talbot, Scunthorpe).
       Show arrows indicating the movement and label the key locations.

   11. us-steel-industry-relocation.png
       A map of the USA showing the relocation of the steel industry from the Rust Belt (Pittsburgh, Cleveland, Detroit) to coastal and southern states (Mobile, Alabama; Portland, Oregon; Texas).
       Show arrows indicating the movement and label the key locations.

   --- TRANSNATIONAL INDUSTRIES IMAGES (2D DIAGRAM AND REALISTIC) ---

   12. tnc-structure-diagram.png
       A 2D diagram showing the structure of a Transnational Corporation: headquarters in the USA, subsidiaries in Africa, Asia, and South America.
       Show the flow of goods, capital, and information between headquarters and subsidiaries.

   13. anglo-american-zimbabwe.png
       A realistic photograph showing Anglo-American mining operations in Zimbabwe: open-pit mine, processing plant, or workers.
       Show the scale of mining operations.

   14. lonrho-zimbabwe-operations.png
       A realistic photograph showing Lonrho's agricultural and industrial operations in Zimbabwe: sugar plantation, factory, or transport.
       Show the diversity of Lonrho's operations.

   15. bata-factory-zimbabwe.png
       A realistic photograph showing the Bata shoe factory in Gweru, Zimbabwe: factory building, workers, or production line.
       Show the manufacturing process.

   --- ZIMBABWE INDUSTRY IMAGES (2D DIAGRAM AND REALISTIC) ---

   16. zimbabwe-industry-character.png
       A 2D diagram showing the character of Zimbabwean industry: mining (gold, platinum), agro-processing (sugar, tobacco), manufacturing (textiles, engineering), and SMEs.
       Use icons and brief explanations for each sector.

   17. zimbabwe-industrial-distribution-map.png
       A map of Zimbabwe showing the distribution of major industrial areas: Harare, Bulawayo, Mutare, Gweru, Kwekwe, Triangle, and Hwange.
       Label each location and the main industries there.

   18. industrial-consequences.png
       A split 2D diagram showing positive consequences (economic growth, employment, infrastructure, skills, innovation) and negative consequences (pollution, resource depletion, urbanisation, decline of traditional industries, economic vulnerability).
       Use icons and brief explanations for each consequence.

   --- SERVICE INDUSTRIES IMAGES (2D DIAGRAM STYLE) ---

   19. service-industries-examples.png
       A 2D diagram showing examples of service industries: banking (bank building, money), insurance (shield), transport (truck, plane), tourism (hotel, beach), retail (shop), healthcare (hospital), and education (school).
       Use icons and brief explanations for each example.

   20. factors-service-industries.png
       A 2D diagram showing factors influencing service industry development: economic development (GDP growth), urbanisation (city), technology (internet, mobile), government policies (investment), globalisation (world map), and demographics (ageing population, youth).
       Use icons and brief explanations for each factor.

   21. service-industries-roles.png
       A 2D diagram showing the roles of key service industries: banking (financial services), insurance (risk protection), distribution (connecting producers and consumers), tourism (recreation), and information services (communication, data).
       Use icons and brief explanations for each role.

   22. service-sector-comparison.png
       A split 2D diagram comparing Zimbabwe's service sector (60-65% GDP, key sectors: banking, distribution, tourism, transport) with the UK's service sector (80-85% GDP, key sectors: financial services, IT, tourism, healthcare, creative industries).
       Use icons and brief explanations.

   --- TOURISM IMAGES (2D DIAGRAM AND REALISTIC) ---

   23. tourism-overview.png
       A 2D diagram showing the key components of tourism: attractions (natural, cultural), accommodation (hotels, lodges), transport (planes, cars), and services (tour operators, restaurants).
       Use icons and brief explanations for each component.

   24. zimbabwe-tourism-attractions.png
       A map of Zimbabwe showing major tourist attractions: Victoria Falls (Zambezi River), Hwange National Park, Mana Pools, Gonarezhou, Great Zimbabwe Ruins, and Eastern Highlands.
       Label each attraction with a brief description.

   25. zimbabwe-tourism-challenges.png
       A 2D diagram showing challenges facing tourism in Zimbabwe: political/economic instability, infrastructure limitations, competition from other destinations, poaching, and climate change.
       Use icons and brief explanations for each challenge.

   26. south-africa-tourism-attractions.png
       A map of South Africa showing major tourist attractions: Table Mountain (Cape Town), Kruger National Park, Garden Route, Drakensberg Mountains, and Robben Island.
       Label each attraction with a brief description.

   27. tourism-comparison-zimbabwe-south-africa.png
       A split 2D diagram comparing tourism in Zimbabwe and South Africa: attractions, infrastructure, visitors, and economic impact.
       Use icons and brief explanations for the comparison.

   ============================================================ */