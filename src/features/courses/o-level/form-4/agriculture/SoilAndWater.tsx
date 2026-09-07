import React, { useState, useRef } from 'react';

/**
 * Topic: Soil and Water Studies
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const SoilAndWater: React.FC = () => {
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
  const SoilImage: React.FC<{
    fileName: string;
    alt: string;
    caption: string;
  }> = ({ fileName, alt, caption }) => {
    const [isMissing, setIsMissing] = useState(false);

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
              Place this file in <strong>public/images/soil-water/</strong>
            </p>
          </div>
        ) : (
          <img
            src={`/images/soil-water/${fileName}`}
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

  // ---------- Section content ----------
  const sections: TopicSection[] = [
    {
      id: 'soil-fertility',
      title: 'Soil Fertility – The Nitrogen Cycle',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="The Nitrogen Cycle">
            <p>
              <strong>Definition:</strong> The nitrogen cycle is the continuous
              movement of nitrogen between the atmosphere, soil, and living
              organisms. Nitrogen is an essential nutrient for plants (needed
              for proteins, chlorophyll, and DNA), but most plants cannot use
              atmospheric nitrogen directly. The nitrogen cycle converts
              nitrogen into usable forms.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Stages of the Nitrogen Cycle</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Nitrogen fixation:</strong>
                <br />
                Atmospheric nitrogen (N₂) is converted into ammonia (NH₃) or
                nitrate (NO₃⁻) by:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Biological fixation:</strong> Bacteria like <em>Rhizobium</em>
                    (in root nodules of legumes) and free‑living bacteria (e.g.,
                    <em>Azotobacter</em>).
                  </li>
                  <li>
                    <strong>Industrial fixation:</strong> The Haber‑Bosch process
                    (manufacture of fertilisers).
                  </li>
                  <li>
                    <strong>Atmospheric fixation:</strong> Lightning converts N₂
                    to nitrate.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Nitrogen assimilation:</strong>
                <br />
                Plants absorb ammonium (NH₄⁺) and nitrate (NO₃⁻) from the soil
                and use them to make amino acids, proteins, and nucleic acids.
              </li>
              <li>
                <strong>Ammonification (mineralisation):</strong>
                <br />
                Decomposition of organic matter (dead plants, animals, manure)
                by bacteria and fungi releases ammonium (NH₄⁺) back into the soil.
              </li>
              <li>
                <strong>Nitrification:</strong>
                <br />
                Conversion of ammonium (NH₄⁺) to nitrite (NO₂⁻) by bacteria like
                <em>Nitrosomonas</em>, and then to nitrate (NO₃⁻) by <em>Nitrobacter</em>.
                Nitrate is the form most readily taken up by plants.
              </li>
              <li>
                <strong>Denitrification:</strong>
                <br />
                Conversion of nitrate (NO₃⁻) back to atmospheric nitrogen (N₂)
                by bacteria (e.g., <em>Pseudomonas</em>) in anaerobic (waterlogged)
                conditions. This causes nitrogen loss from the soil.
              </li>
            </ul>

            <SoilImage
              fileName="nitrogen-cycle-diagram.png"
              alt="A 2D diagram showing the nitrogen cycle: nitrogen fixation (bacteria, lightning), assimilation (plants), ammonification (decomposers), nitrification (Nitrosomonas, Nitrobacter), denitrification (Pseudomonas)"
              caption="The nitrogen cycle – stages and processes."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Nitrogen fixation:</strong> N₂ → NH₃/NO₃⁻</li>
            <li><strong>Nitrification:</strong> NH₄⁺ → NO₂⁻ → NO₃⁻</li>
            <li><strong>Denitrification:</strong> NO₃⁻ → N₂</li>
            <li><strong>Ammonification:</strong> organic N → NH₄⁺</li>
            <li><strong>Assimilation:</strong> plants take up N</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'water-conservation',
      title: 'Water Conservation – Pollution and Management',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Causes of Water Pollution">
            <p>
              <strong>Definition:</strong> Water pollution is the contamination
              of water bodies (rivers, dams, groundwater) by harmful substances,
              making the water unfit for human use, livestock, or crop production.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Agricultural runoff:</strong>
                <br />
                Fertiliser (nitrates, phosphates) and pesticides washed into
                water sources by rain or irrigation. Causes eutrophication
                (excessive algae growth) and contamination.
              </li>
              <li>
                <strong>Industrial waste:</strong>
                <br />
                Chemicals, heavy metals, and untreated effluent discharged
                into rivers from factories.
              </li>
              <li>
                <strong>Domestic sewage:</strong>
                <br />
                Untreated human waste from households, especially in urban
                areas without proper sanitation. Contains pathogens and nutrients.
              </li>
              <li>
                <strong>Mining activities:</strong>
                <br />
                Acid mine drainage (AMD) and heavy metals (e.g., arsenic, lead)
                from mining operations contaminate water.
              </li>
              <li>
                <strong>Solid waste dumping:</strong>
                <br />
                Plastic, chemicals, and other refuse dumped in or near water
                bodies.
              </li>
              <li>
                <strong>Livestock waste:</strong>
                <br />
                Manure and urine from feedlots and grazing areas washed into
                streams during rains.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Effects of Water Pollution on Agricultural Production">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Reduced crop yields:</strong>
                <br />
                Contaminated irrigation water damages plants (e.g., salt burn,
                heavy metal toxicity). Poor water quality reduces growth and yields.
              </li>
              <li>
                <strong>Animal health problems:</strong>
                <br />
                Livestock drinking polluted water get sick (e.g., diarrhoea,
                poisoning, parasite infections), leading to lower productivity
                and mortality.
              </li>
              <li>
                <strong>Soil degradation:</strong>
                <br />
                Accumulation of salts, heavy metals, or pathogens in the soil
                reduces soil fertility and may render land unusable.
              </li>
              <li>
                <strong>Loss of aquatic resources:</strong>
                <br />
                Fish stocks decline, affecting livelihoods of those who depend
                on fishing.
              </li>
              <li>
                <strong>Human health risks:</strong>
                <br />
                Contaminated water and food crops cause diseases (e.g., cholera,
                typhoid) in farming communities.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Ways of Reducing Water Pollution">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Better agricultural practices:</strong>
                <br />
                Apply fertilisers and pesticides only when needed and in correct
                amounts. Use buffer strips (vegetated areas) along watercourses
                to filter runoff.
              </li>
              <li>
                <strong>Proper waste management:</strong>
                <br />
                Treat industrial and domestic sewage before disposal. Compost
                livestock manure and store it away from water sources.
              </li>
              <li>
                <strong>Legislation and enforcement:</strong>
                <br />
                Enforce environmental laws that limit pollutant discharges.
                Monitor water quality regularly.
              </li>
              <li>
                <strong>Public education:</strong>
                <br />
                Teach farmers and communities about the dangers of pollution and
                how to prevent it.
              </li>
              <li>
                <strong>Construct wetlands and retention ponds:</strong>
                <br />
                Natural or constructed wetlands can filter pollutants from runoff
                before they enter rivers.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Water Use Legislation and Management – ZINWA">
            <p>
              <strong>Definition:</strong> The Zimbabwe National Water Authority
              (ZINWA) is a state‑owned company responsible for the management
              and development of Zimbabwe's water resources.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Key functions of ZINWA:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Water supply:</strong> Provides bulk water to urban
                    and rural areas.
                  </li>
                  <li>
                    <strong>Dam management:</strong> Operates and maintains major
                    dams (e.g., Mutirikwi, Manyame).
                  </li>
                  <li>
                    <strong>Water quality monitoring:</strong> Tests water quality
                    and ensures compliance with standards.
                  </li>
                  <li>
                    <strong>Water allocation:</strong> Issues permits for water
                    use (irrigation, industry, domestic).
                  </li>
                  <li>
                    <strong>Pollution control:</strong> Enforces laws against
                    water pollution.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Water legislation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Water Act (Chapter 20:24):</strong> Governs the use,
                    management, and conservation of water in Zimbabwe.
                  </li>
                  <li>
                    <strong>Environmental Management Act:</strong> Controls
                    pollution and protects water resources.
                  </li>
                  <li>
                    <strong>Catchment councils:</strong> Manage water resources
                    at the catchment level (e.g., Save, Manyame, Mazowe catchments).
                  </li>
                </ul>
              </li>
            </ul>

            <SoilImage
              fileName="water-pollution-management.png"
              alt="A 2D diagram showing causes of water pollution, effects on agriculture, reduction measures, and the role of ZINWA"
              caption="Water pollution: causes, effects, and management in Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Water Pollution</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Causes:</strong> agrochemical runoff, industrial waste, sewage, mining</li>
            <li><strong>Effects:</strong> crop damage, animal health, soil degradation</li>
            <li><strong>Reduction:</strong> better farming, waste treatment, legislation</li>
            <li><strong>ZINWA:</strong> water supply, dams, permits, pollution control</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'irrigation-equipment',
      title: 'Irrigation Equipment – Identification, Structure, and Functions',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Irrigation Equipment Used in Zimbabwe">
            <p>
              <strong>Definition:</strong> Irrigation equipment includes all the
              tools, machinery, and structures used to apply water to crops
              artificially. Selection depends on the type of irrigation system,
              scale of farming, and water source.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Pumps</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Centrifugal pump:</strong>
                <br />
                <strong>Structure:</strong> An impeller (rotating disc) inside a
                casing that spins water outward by centrifugal force.
                <br />
                <strong>Function:</strong> Lifts water from a source (river, dam,
                borehole) and pushes it through pipes to the field.
              </li>
              <li>
                <strong>Submersible pump:</strong>
                <br />
                <strong>Structure:</strong> A sealed motor and pump unit that
                operates underwater.
                <br />
                <strong>Function:</strong> Pumps water from deep boreholes or wells.
              </li>
              <li>
                <strong>Treadle pump:</strong>
                <br />
                <strong>Structure:</strong> A foot‑operated piston pump.
                <br />
                <strong>Function:</strong> Used by small‑scale farmers to draw
                water from shallow wells or streams.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sprinkler Systems</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Centre pivot:</strong>
                <br />
                <strong>Structure:</strong> A rotating boom with sprinklers mounted
                on wheeled towers, moving in a circular pattern.
                <br />
                <strong>Function:</strong> Irrigates large, circular fields
                (common for maize, wheat).
              </li>
              <li>
                <strong>Lateral move (side roll):</strong>
                <br />
                <strong>Structure:</strong> A straight sprinkler line that moves
                across the field on wheels.
                <br />
                <strong>Function:</strong> Irrigates rectangular fields.
              </li>
              <li>
                <strong>Hand‑move sprinklers:</strong>
                <br />
                <strong>Structure:</strong> Pipes and sprinkler heads that are
                moved manually.
                <br />
                <strong>Function:</strong> Used on small to medium farms.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Drip Irrigation Components</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Drip line (drip tube):</strong>
                <br />
                <strong>Structure:</strong> Thin plastic tube with emitters
                (drippers) at regular intervals.
                <br />
                <strong>Function:</strong> Delivers water directly to the plant
                root zone at a slow, steady rate.
              </li>
              <li>
                <strong>Emitter (dripper):</strong>
                <br />
                <strong>Structure:</strong> Small device that regulates water
                flow (usually 2–8 L/hour).
                <br />
                <strong>Function:</strong> Releases water drop by drop.
              </li>
              <li>
                <strong>Filter:</strong>
                <br />
                <strong>Structure:</strong> Mesh or disc filter.
                <br />
                <strong>Function:</strong> Removes particles to prevent clogging
                of emitters.
              </li>
              <li>
                <strong>Pressure regulator:</strong>
                <br />
                <strong>Structure:</strong> Valve that maintains constant pressure.
                <br />
                <strong>Function:</strong> Ensures uniform water delivery across
                the system.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Other Equipment</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pipes and fittings:</strong>
                <br />
                PVC, HDPE, or metal pipes used to convey water. Includes couplings,
                elbows, and tees.
              </li>
              <li>
                <strong>Fertigation injectors:</strong>
                <br />
                Devices that inject fertiliser into the irrigation system for
                efficient nutrient delivery.
              </li>
              <li>
                <strong>Gated pipes:</strong>
                <br />
                Used in surface (flood) irrigation to distribute water from a
                main supply to furrows.
              </li>
            </ul>

            <SoilImage
              fileName="irrigation-equipment.png"
              alt="A 2D diagram showing irrigation equipment: pumps (centrifugal, submersible, treadle), sprinkler systems (centre pivot, lateral move), and drip components (drip line, emitter, filter, pressure regulator)"
              caption="Irrigation equipment – identification, structure, and functions."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Irrigation Equipment</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Pumps:</strong> centrifugal, submersible, treadle</li>
            <li><strong>Sprinklers:</strong> centre pivot, lateral move, hand‑move</li>
            <li><strong>Drip:</strong> drip line, emitter, filter, pressure regulator</li>
            <li><strong>Others:</strong> pipes, fertigator, gated pipes</li>
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
            AGRICULTURE
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Soil and Water Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Understand the nitrogen cycle, water pollution and management
            (including ZINWA), and irrigation equipment – identification,
            structure, and functions.
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
                  <strong className="text-white">Nitrogen cycle:</strong> Nitrogen
                  fixation (N₂ → NH₃/NO₃⁻), assimilation (plant uptake), ammonification
                  (decomposition), nitrification (NH₄⁺ → NO₂⁻ → NO₃⁻), denitrification
                  (NO₃⁻ → N₂). Essential for soil fertility.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Water pollution:</strong> Caused
                  by agricultural runoff, industrial waste, sewage, mining.
                  Effects include reduced yields, animal health problems, and
                  human disease. Reduction: better practices, waste treatment,
                  legislation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">ZINWA:</strong> Manages water
                  resources, supplies water, operates dams, issues permits, and
                  enforces pollution control under the Water Act.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Irrigation equipment:</strong>
                  Pumps (centrifugal, submersible, treadle), sprinkler systems
                  (centre pivot, lateral move), drip components (drip line,
                  emitter, filter, regulator). Each has specific structure and function.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Soil and Water Studies topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
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

export default SoilAndWater;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/soil-water/

   1. nitrogen-cycle-diagram.png
      A 2D diagram showing: N₂ in atmosphere → fixation (Rhizobium, lightning,
      Haber) → NH₄⁺/NO₃⁻ → assimilation into plants → proteins → ammonification
      (decomposers) → NH₄⁺ → nitrification (Nitrosomonas → NO₂⁻, Nitrobacter →
      NO₃⁻) → denitrification (Pseudomonas) → N₂ back to atmosphere.

   2. water-pollution-management.png
      A 2D diagram showing causes (agricultural runoff, industrial waste,
      sewage, mining), effects (crop damage, animal health, soil degradation),
      reduction methods (better farming, waste treatment, education), and the
      role of ZINWA (dams, water supply, permits, pollution control).

   3. irrigation-equipment.png
      A 2D diagram with labelled illustrations of: pumps (centrifugal,
      submersible, treadle), sprinkler systems (centre pivot, lateral move,
      hand‑move), drip components (drip line, emitter, filter, pressure
      regulator), and pipes.

   ============================================================ */