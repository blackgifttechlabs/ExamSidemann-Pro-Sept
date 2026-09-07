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
      id: 'soil-formation',
      title: 'Soil Formation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Soil Formation?">
            <p>
              <strong>Definition:</strong> Soil formation (pedogenesis) is the
              process by which rocks are broken down and transformed into a
              soil that can support plant life. It takes hundreds to thousands
              of years.
            </p>
            <p>
              The formation of soil involves weathering, the addition of organic
              matter, and the movement of materials within the soil profile.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Various Forms of Weathering">
            <p>
              <strong>Definition:</strong> Weathering is the breakdown of rocks
              and minerals at the Earth's surface. It creates the parent material
              from which soil develops. Weathering can be physical, chemical, or
              biological.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Physical (Mechanical) Weathering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Temperature changes (Thermal expansion):</strong>
                <br />
                Repeated heating and cooling cause rocks to expand and contract,
                creating cracks and eventually breaking the rock apart (exfoliation).
              </li>
              <li>
                <strong>Frost action (Freeze‑thaw):</strong>
                <br />
                Water in cracks freezes, expands (by about 9%), and widens cracks.
                Repeated freezing and thawing breaks rocks apart. Common in
                mountainous areas.
              </li>
              <li>
                <strong>Root action:</strong>
                <br />
                Plant roots grow into cracks in rocks. As roots expand, they
                prise the rock apart.
              </li>
              <li>
                <strong>Abrasion:</strong>
                <br />
                Rock fragments carried by wind, water, or ice scrape against
                other rocks, wearing them down.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Chemical Weathering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Oxidation:</strong>
                <br />
                Oxygen reacts with minerals (especially iron) to form oxides
                (rust). This weakens the rock structure and changes colour
                (often reddish-brown).
              </li>
              <li>
                <strong>Hydrolysis:</strong>
                <br />
                Water reacts with minerals to form new compounds. For example,
                feldspar (in granite) reacts with water to form clay minerals.
              </li>
              <li>
                <strong>Carbonation:</strong>
                <br />
                Carbon dioxide dissolves in rainwater to form weak carbonic acid.
                This acid dissolves limestone and other carbonate rocks, forming
                caves and karst landscapes.
              </li>
              <li>
                <strong>Solution:</strong>
                <br />
                Some minerals (e.g., salt, gypsum) dissolve directly in water
                and are removed.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Biological Weathering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Organisms:</strong>
                <br />
                Lichens, mosses, and bacteria produce acids that dissolve minerals
                and break down rocks.
              </li>
              <li>
                <strong>Burrowing animals:</strong>
                <br />
                Worms, ants, termites, moles, and rodents mix soil and break down
                rocks through their activities.
              </li>
              <li>
                <strong>Plant roots:</strong>
                <br />
                Roots produce acids that dissolve minerals, and they also physically
                break rocks apart.
              </li>
            </ul>

            <SoilImage
              fileName="weathering-forms.png"
              alt="A 2D diagram showing physical (freeze-thaw, root action), chemical (oxidation, hydrolysis, carbonation), and biological (lichens, burrowing) weathering"
              caption="Various forms of weathering: physical, chemical, and biological."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Physical weathering:</strong> freeze-thaw, roots, abrasion</li>
            <li><strong>Chemical weathering:</strong> oxidation, hydrolysis, carbonation</li>
            <li><strong>Biological weathering:</strong> organisms, burrowing, roots</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-texture-structure-profile',
      title: 'Soil Texture, Structure and Profile',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="The Eight Textural Classes in Zimbabwe">
            <p>
              <strong>Definition:</strong> Soil texture refers to the relative
              proportions of different particle sizes in the soil – sand, silt,
              and clay. In Zimbabwe, eight textural classes are used to describe
              soil types.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>1. Sand:</strong> &gt;85% sand, feels gritty.</li>
              <li><strong>2. Loamy sand:</strong> 70-85% sand, some silt and clay.</li>
              <li><strong>3. Sandy loam:</strong> 50-70% sand, moderate clay/silt.</li>
              <li><strong>4. Loam:</strong> Balanced mixture of sand, silt, and clay (ideal).</li>
              <li><strong>5. Silt loam:</strong> High silt content (50-70%).</li>
              <li><strong>6. Silty clay loam:</strong> Silt dominant, with clay and sand.</li>
              <li><strong>7. Clay loam:</strong> 27-40% clay, balanced with silt/sand.</li>
              <li><strong>8. Clay:</strong> &gt;40% clay, sticky and plastic when wet.</li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Determining Texture Using a Soil Textural Triangle">
            <p>
              <strong>Definition:</strong> A soil textural triangle is a graphical
              tool used to determine the textural class of a soil based on its
              percentage of sand, silt, and clay. The three sides of the triangle
              represent the percentages of sand, silt, and clay.
            </p>
            <p>
              <strong>How to use it:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Determine the percentage of sand, silt, and clay in the soil
                sample (using a hydrometer or sedimentation method).
              </li>
              <li>
                Find the clay percentage on the left side of the triangle and
                draw a line parallel to the base.
              </li>
              <li>
                Find the silt percentage on the right side and draw a line
                parallel to the left side.
              </li>
              <li>
                Find the sand percentage on the bottom and draw a line parallel
                to the right side.
              </li>
              <li>
                The point where the three lines intersect indicates the textural
                class.
              </li>
            </ol>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Sample has: 40% sand, 40% silt, 20% clay.</li>
              <li>This falls in the <strong>Loam</strong> category.</li>
            </ul>

            <SoilImage
              fileName="soil-textural-triangle.png"
              alt="A soil textural triangle showing the eight textural classes with percentages of sand, silt, and clay"
              caption="Soil textural triangle – determining textural classes."
            />
          </SubtopicCard>

          <SubtopicCard title="Factors Affecting Soil Structure">
            <p>
              <strong>Definition:</strong> Soil structure is the arrangement of
              soil particles into aggregates (peds). It affects water movement,
              aeration, root penetration, and overall soil health.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Organic matter:</strong>
                <br />
                Acts as a binding agent, helping to form stable aggregates.
                Higher organic matter = better structure (crumb or granular).
              </li>
              <li>
                <strong>Soil organisms:</strong>
                <br />
                Earthworms, termites, and fungi create channels and bind particles
                together, improving structure.
              </li>
              <li>
                <strong>Clay content:</strong>
                <br />
                Clay helps form aggregates due to its sticky nature and ability
                to hold particles together.
              </li>
              <li>
                <strong>Root action:</strong>
                <br />
                Roots penetrate soil, create channels, and exude substances that
                bind particles together.
              </li>
              <li>
                <strong>Farming practices:</strong>
                <br />
                Over‑cultivation, heavy machinery, and ploughing when wet can
                destroy structure (compaction).
              </li>
              <li>
                <strong>Weathering and wetting/drying cycles:</strong>
                <br />
                Natural processes help form aggregates through expansion and
                contraction.
              </li>
              <li>
                <strong>Soil pH:</strong>
                <br />
                Very acidic or very alkaline conditions can break down structure
                by dispersing clay particles.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Importance of Good Soil Structure">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Improved drainage:</strong>
                <br />
                Good structure allows water to infiltrate and drain without
                waterlogging.
              </li>
              <li>
                <strong>Better aeration:</strong>
                <br />
                Aggregates create pores for oxygen exchange, which roots and
                soil organisms need.
              </li>
              <li>
                <strong>Root penetration:</strong>
                <br />
                Roots can easily grow through stable, well‑structured soil.
              </li>
              <li>
                <strong>Water holding capacity:</strong>
                <br />
                Good structure balances drainage and water retention.
              </li>
              <li>
                <strong>Resistance to erosion:</strong>
                <br />
                Stable aggregates are less easily washed or blown away.
              </li>
              <li>
                <strong>Nutrient cycling:</strong>
                <br />
                Good structure supports soil organisms that cycle nutrients.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Methods of Improving/Maintaining Good Structure">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Add organic matter:</strong>
                <br />
                Incorporate manure, compost, crop residues, or green manure.
                This feeds soil organisms and binds particles.
              </li>
              <li>
                <strong>Reduce tillage:</strong>
                <br />
                Use minimum or zero tillage to avoid breaking down aggregates.
              </li>
              <li>
                <strong>Use cover crops:</strong>
                <br />
                Plant legumes or grasses to protect soil and add organic matter
                when ploughed in.
              </li>
              <li>
                <strong>Mulching:</strong>
                <br />
                Apply organic mulch to protect the soil surface and promote
                earthworm activity.
              </li>
              <li>
                <strong>Controlled traffic:</strong>
                <br />
                Limit the use of heavy machinery on wet soil to avoid compaction.
              </li>
              <li>
                <strong>Add lime (if acidic):</strong>
                <br />
                Lime improves structure by flocculating (clumping) clay particles.
              </li>
              <li>
                <strong>Add gypsum (if sodic):</strong>
                <br />
                Gypsum improves structure in soils with high sodium levels.
              </li>
              <li>
                <strong>Crop rotation:</strong>
                <br />
                Rotate crops (e.g., include deep‑rooted crops) to improve
                soil structure.
              </li>
            </ul>

            <SoilImage
              fileName="soil-structure-improvement.png"
              alt="A 2D diagram showing methods to improve soil structure: adding organic matter, cover crops, mulching, reduced tillage, and liming"
              caption="Methods of improving and maintaining good soil structure."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Texture &amp; Structure</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>8 textural classes:</strong> sand, loamy sand, sandy loam, loam, silt loam, silty clay loam, clay loam, clay</li>
            <li><strong>Textural triangle:</strong> determines class from sand/silt/clay %</li>
            <li><strong>Structure:</strong> arrangement of particles (crumbs are best)</li>
            <li><strong>Improve:</strong> organic matter, reduce tillage, cover crops</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-types',
      title: 'Soil Types – Methods of Improving Sand and Clay Soils',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Improving Sandy Soils">
            <p>
              <strong>Definition:</strong> Sandy soils have large particles,
              drain quickly, and have poor nutrient and water holding capacity.
              They need improvement to support good crop growth.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Add organic matter (manure, compost):</strong>
                <br />
                Organic matter improves water and nutrient holding capacity.
                It also provides food for soil organisms.
              </li>
              <li>
                <strong>Add anthill soil (termite mound soil):</strong>
                <br />
                Anthill soil contains fine particles (clay) that help bind
                sandy particles and improve water retention. It is a traditional
                practice in Zimbabwe.
              </li>
              <li>
                <strong>Add clay:</strong>
                <br />
                Mixing clay into sandy soil improves water and nutrient retention.
              </li>
              <li>
                <strong>Use green manures and cover crops:</strong>
                <br />
                Plant legumes (e.g., cowpeas, groundnuts) and incorporate them
                into the soil to add organic matter.
              </li>
              <li>
                <strong>Mulching:</strong>
                <br />
                Apply a thick layer of mulch to reduce water loss and add
                organic matter as it decomposes.
              </li>
              <li>
                <strong>Controlled irrigation:</strong>
                <br />
                Use drip irrigation to reduce water loss through deep drainage.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Improving Clay Soils">
            <p>
              <strong>Definition:</strong> Clay soils have small particles,
              hold water and nutrients well, but drain poorly and are difficult
              to work. They need improvement for better aeration and drainage.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Add organic matter (manure, compost):</strong>
                <br />
                Organic matter improves structure by creating aggregates, and
                it improves drainage and aeration.
              </li>
              <li>
                <strong>Add sand/grit:</strong>
                <br />
                Adding coarse sand or grit improves drainage and creates space
                for air. However, a large amount is needed to make a difference.
              </li>
              <li>
                <strong>Add lime (calcium carbonate):</strong>
                <br />
                Lime flocculates (clumps) clay particles, improving structure
                and drainage. It also raises pH if soil is acidic.
              </li>
              <li>
                <strong>Add gypsum (calcium sulphate):</strong>
                <br />
                Gypsum improves structure in sodic (high sodium) clay soils by
                replacing sodium with calcium.
              </li>
              <li>
                <strong>Use cover crops (deep-rooted):</strong>
                <br />
                Deep‑rooted crops (e.g., sunflower, lucerne) break up clay and
                create channels for water and air.
              </li>
              <li>
                <strong>Avoid working soil when wet:</strong>
                <br />
                Working clay soil when wet destroys structure and causes compaction.
              </li>
              <li>
                <strong>Raised beds:</strong>
                <br />
                Planting on raised beds improves drainage in clay soils.
              </li>
            </ul>

            <SoilImage
              fileName="improving-sand-clay-soils.png"
              alt="A 2D diagram showing methods to improve sandy soils (organic matter, anthill soil) and clay soils (organic matter, lime, gypsum, raised beds)"
              caption="Methods of improving sand and clay soils."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Soil Improvement</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Sandy soils:</strong> organic matter, anthill soil, cover crops</li>
            <li><strong>Clay soils:</strong> organic matter, lime, gypsum, raised beds</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-constituents',
      title: 'Soil Constituents',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Composition of an Agriculturally Viable Soil">
            <p>
              <strong>Definition:</strong> An agriculturally viable soil (ideal
              for farming) has a balanced composition of mineral matter, organic
              matter, water, and air.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Mineral matter (about 45%):</strong>
                <br />
                Sand, silt, and clay particles derived from weathered rocks.
                Provides nutrients and physical support for plants.
              </li>
              <li>
                <strong>Organic matter (about 5%):</strong>
                <br />
                Decomposed plant and animal material (humus). Improves structure,
                water holding, and nutrient supply.
              </li>
              <li>
                <strong>Water (about 25%):</strong>
                <br />
                Held in soil pores. Essential for plant growth, transporting
                nutrients, and cooling plants.
              </li>
              <li>
                <strong>Air (about 25%):</strong>
                <br />
                Oxygen and other gases in soil pores. Needed for root respiration
                and microbial activity.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Types of Soil Water">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Gravitational water:</strong>
                <br />
                Water that drains through the soil due to gravity. It is not
                available to plants as it moves quickly below the root zone.
              </li>
              <li>
                <strong>Capillary water:</strong>
                <br />
                Water held in soil pores by surface tension (capillary forces).
                This is the main water available to plants. Held against gravity.
              </li>
              <li>
                <strong>Hygroscopic water:</strong>
                <br />
                Water held as a thin film around soil particles by adhesion.
                It is not available to plants – it is held too tightly.
              </li>
              <li>
                <strong>Available water:</strong>
                <br />
                The water that plants can absorb (capillary water). It is the
                difference between field capacity and wilting point.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Movement of Water in Soil and Field Capacity">
            <p>
              <strong>Definition:</strong> Water moves in soil through two main
              processes: <strong>infiltration</strong> (downward movement from
              the surface) and <strong>percolation</strong> (water moving through
              the soil profile). It can also move laterally through <strong>throughflow</strong>.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Field capacity:</strong>
                <br />
                The amount of water held in the soil after gravitational water
                has drained away. This is the maximum water available to plants.
                It is reached 2-3 days after heavy rain or irrigation.
              </li>
              <li>
                <strong>Permanent wilting point:</strong>
                <br />
                The soil moisture level at which plants can no longer extract
                water and wilt permanently. Below this, plants die.
              </li>
              <li>
                <strong>Available water capacity:</strong>
                <br />
                The range of water between field capacity and permanent wilting
                point. This is the water plants can use.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Role of Soil Macro‑organisms and Micro‑organisms">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Macro‑organisms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Examples:</strong> Earthworms, termites, ants, moles,
                beetles, nematodes.
              </li>
              <li>
                <strong>Roles:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Burrow and create channels, improving soil aeration and drainage.</li>
                  <li>Mixing soil (bioturbation) – bringing nutrients to the surface.</li>
                  <li>Break down organic matter, contributing to humus formation.</li>
                  <li>Their casts (worm casts) improve soil structure.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Micro‑organisms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Examples:</strong> Bacteria, fungi, actinomycetes, algae.
              </li>
              <li>
                <strong>Roles:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Nitrogen fixation:</strong> Bacteria (e.g., Rhizobium
                    in legumes) convert atmospheric nitrogen into usable forms.
                  </li>
                  <li>
                    <strong>Decomposition:</strong> Break down organic matter into
                    humus, releasing nutrients (mineralisation).
                  </li>
                  <li>
                    <strong>Nutrient cycling:</strong> Convert nutrients into forms
                    that plants can absorb (e.g., nitrification).
                  </li>
                  <li>
                    <strong>Pathogen suppression:</strong> Some microbes compete
                    with or attack plant pathogens.
                  </li>
                  <li>
                    <strong>Soil aggregation:</strong> Fungi produce glomalin, a
                    substance that binds soil particles together.
                  </li>
                </ul>
              </li>
            </ul>

            <SoilImage
              fileName="soil-constituents-organisms.png"
              alt="A 2D diagram showing soil composition (mineral, organic matter, water, air) and the roles of macro-organisms (earthworms) and micro-organisms (bacteria, fungi)"
              caption="Soil constituents and the role of soil organisms."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Soil Constituents</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Composition:</strong> 45% mineral, 5% organic, 25% water, 25% air</li>
            <li><strong>Water types:</strong> gravitational, capillary, hygroscopic</li>
            <li><strong>Field capacity:</strong> water held after drainage</li>
            <li><strong>Macro-organisms:</strong> earthworms (aeration, mixing)</li>
            <li><strong>Micro-organisms:</strong> bacteria (N fixation), fungi (decomposition)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-temperature',
      title: 'Soil Temperature',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Effects of Soil Temperature on Plant Growth and Soil Organisms">
            <p>
              <strong>Definition:</strong> Soil temperature affects seed germination,
              root growth, nutrient uptake, and the activity of soil organisms.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Seed germination:</strong>
                <br />
                Different crops require different soil temperatures for
                germination. For example, maize needs soil temperatures above
                10°C; tomatoes need above 15°C. Too cold or too hot prevents
                germination.
              </li>
              <li>
                <strong>Root growth:</strong>
                <br />
                Roots grow best in moderate soil temperatures (15–25°C). Extreme
                temperatures (too hot or too cold) slow root growth and reduce
                water/nutrient uptake.
              </li>
              <li>
                <strong>Nutrient availability:</strong>
                <br />
                Microbial activity (mineralisation) increases with temperature
                up to an optimum (about 25–35°C). Above this, microbes are killed
                or become inactive, reducing nutrient availability.
              </li>
              <li>
                <strong>Soil organisms:</strong>
                <br />
                Earthworms, bacteria, and fungi are active within a certain
                temperature range. Extreme temperatures kill them or force them
                into dormancy.
              </li>
              <li>
                <strong>Photosynthesis and respiration:</strong>
                <br />
                High soil temperatures increase root respiration, using up oxygen
                and energy, reducing growth.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Effects of Extreme Temperature on Crop Growth Stages">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>High temperatures (heat stress):</strong>
                <br />
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Germination:</strong> Seeds may fail to germinate or
                    seedlings may be scorched.
                  </li>
                  <li>
                    <strong>Vegetative growth:</strong> Wilting, leaf scorch, and
                    reduced growth. Plants may flower early (bolting) in some crops.
                  </li>
                  <li>
                    <strong>Flowering/fruiting:</strong> Flower abortion, poor
                    pollination, reduced fruit set. Quality of fruits may be poor.
                  </li>
                  <li>
                    <strong>Maturation:</strong> Premature ripening, reduced yields.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Low temperatures (cold stress/frost):</strong>
                <br />
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Germination:</strong> Seeds fail to germinate or rot
                    in cold, wet soils.
                  </li>
                  <li>
                    <strong>Vegetative growth:</strong> Stunted growth, leaf
                    yellowing (chlorosis), and wilting.
                  </li>
                  <li>
                    <strong>Flowering/fruiting:</strong> Flowers may be aborted;
                    fruits may be misshapen or fail to set.
                  </li>
                  <li>
                    <strong>Maturation:</strong> Delayed maturity, poor quality
                    (e.g., frost damage to crops like potatoes and tobacco).
                  </li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Measures to Reduce Extreme Soil Temperature Effects">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Mulching:</strong>
                <br />
                Organic mulch insulates the soil, keeping it cooler in summer
                and warmer in winter.
              </li>
              <li>
                <strong>Irrigation:</strong>
                <br />
                Water has a high specific heat capacity – it moderates soil
                temperature. Irrigation can cool the soil in hot conditions.
              </li>
              <li>
                <strong>Shade nets:</strong>
                <br />
                Used in horticulture to reduce solar radiation and soil temperature.
              </li>
              <li>
                <strong>Cover crops:</strong>
                <br />
                Living or dead plant cover reduces temperature extremes by
                shading the soil.
              </li>
              <li>
                <strong>Windbreaks:</strong>
                <br />
                Trees or hedges reduce wind speed, which reduces evaporation
                and soil cooling in winter.
              </li>
              <li>
                <strong>Greenhouses and tunnels:</strong>
                <br />
                Provide controlled temperature environments for crops.
              </li>
              <li>
                <strong>Timely planting:</strong>
                <br />
                Plant at the right time to avoid temperature extremes (e.g.,
                plant after the last frost or before the peak heat).
              </li>
            </ul>

            <SoilImage
              fileName="soil-temperature-effects.png"
              alt="A 2D diagram showing effects of extreme soil temperatures on plant growth and methods to reduce them: mulching, irrigation, shade, cover crops"
              caption="Effects of soil temperature on plant growth and measures to reduce extremes."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Soil Temperature</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Effects:</strong> germination, root growth, nutrient availability, organisms</li>
            <li><strong>Heat stress:</strong> wilting, scorch, flower abortion</li>
            <li><strong>Cold stress:</strong> poor germination, stunting, frost damage</li>
            <li><strong>Control:</strong> mulch, irrigation, shade, windbreaks, timing</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-fertility',
      title: 'Soil Fertility',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Methods and Timing of Fertiliser Application">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods of Application</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Broadcasting:</strong>
                <br />
                Spreading fertiliser evenly over the entire field. Used for
                basal fertilisers or on pastures.
              </li>
              <li>
                <strong>Band placement:</strong>
                <br />
                Placing fertiliser in a band near the seed row (side‑banding)
                or below the seed (deep placement). Reduces contact with soil
                and improves efficiency.
              </li>
              <li>
                <strong>Top dressing:</strong>
                <br />
                Applying fertiliser on the soil surface around growing plants,
                usually for nitrogen (N). Done during the growing season.
              </li>
              <li>
                <strong>Foliar application:</strong>
                <br />
                Applying nutrients through leaves (spraying). Used for
                micronutrients or quick correction of deficiencies.
              </li>
              <li>
                <strong>Fertigation:</strong>
                <br />
                Applying fertilisers through irrigation water (drip or sprinkler).
                Highly efficient.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Timing of Application</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pre‑planting (basal):</strong>
                <br />
                Applied before planting, incorporated into the soil. Used for
                phosphorus (P) and potassium (K) and part of nitrogen (N).
              </li>
              <li>
                <strong>At planting:</strong>
                <br />
                Starter fertilisers applied with the seed to promote early growth.
              </li>
              <li>
                <strong>During growth (top dressing):</strong>
                <br />
                Nitrogen is applied in split applications (e.g., at 4–6 weeks
                after planting) to match crop demand and reduce leaching.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Calculating Fertiliser Quantities per Area">
            <p>
              <strong>Definition:</strong> Calculating fertiliser quantities is
              important to apply the correct amount of nutrients without wasting
              fertiliser or causing environmental damage.
            </p>
            <p>
              <strong>Key terms:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>% Nutrient:</strong> The percentage of N, P₂O₅, or K₂O
                in the fertiliser bag.
              </li>
              <li>
                <strong>Recommended rate:</strong> The amount of a nutrient (kg/ha)
                recommended by soil test results.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Formula</h4>
            <p className="bg-slate-100 p-3 rounded-lg font-mono text-sm">
              <strong>Fertiliser required (kg/ha)</strong> = (Recommended nutrient rate ÷ % Nutrient in fertiliser) × 100
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Problem:</strong> You need to apply 100 kg N per hectare.
                You have Compound D (8-14-7 – 8% N, 14% P₂O₅, 7% K₂O).
              </li>
              <li>
                <strong>Calculation:</strong>
                <br />
                Fertiliser required = (100 ÷ 8) × 100 = 1250 kg/ha of Compound D.
              </li>
              <li>
                <strong>Check:</strong>
                <br />
                1250 kg × 8% = 100 kg N (correct).
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Basal vs Top Dressing">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Basal dressing:</strong>
                <br />
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Definition:</strong> Fertiliser applied before or at
                    planting, incorporated into the soil.
                  </li>
                  <li>
                    <strong>Purpose:</strong> Provides phosphorus (P), potassium (K),
                    and some nitrogen (N) for early root and shoot growth.
                  </li>
                  <li>
                    <strong>Examples:</strong> Compound D (8-14-7), Compound C (7-14-8).
                  </li>
                  <li>
                    <strong>Zimbabwe:</strong> Basal fertilisers are applied for
                    maize, tobacco, and cotton at planting.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Top dressing:</strong>
                <br />
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Definition:</strong> Fertiliser applied to the soil
                    surface around growing plants during the season.
                  </li>
                  <li>
                    <strong>Purpose:</strong> Provides nitrogen (N) when the crop
                    needs it most (during active growth).
                  </li>
                  <li>
                    <strong>Examples:</strong> Ammonium nitrate (35% N), Urea (46% N).
                  </li>
                  <li>
                    <strong>Zimbabwe:</strong> Top dressing is applied to maize at
                    knee‑high stage and again at tasselling.
                  </li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Soil Sampling – Importance, Principles, and Methods">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Importance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Determines nutrient status of the soil.</li>
              <li>Identifies deficiencies or toxicities.</li>
              <li>Helps recommend fertiliser types and rates.</li>
              <li>Prevents over‑application (saves money and environment).</li>
              <li>Monitors changes in soil fertility over time.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Principles</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Take samples from representative areas (not unusual spots).</li>
              <li>Use clean equipment (stainless steel or plastic).</li>
              <li>Sample at a consistent depth (usually 0–20 cm for cultivated soils).</li>
              <li>Collect composite samples (mix several subsamples from one field).</li>
              <li>Label samples clearly and record field history.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>W‑pattern or Zig‑zag sampling:</strong>
                <br />
                Walk in a W‑shaped pattern across the field, taking subsamples
                at regular intervals. Mix subsamples to make a composite sample.
              </li>
              <li>
                <strong>Random sampling:</strong>
                <br />
                Take subsamples randomly across the field.
              </li>
              <li>
                <strong>Grid sampling:</strong>
                <br />
                Divide the field into grids and sample each grid separately.
                Used for precision agriculture.
              </li>
            </ul>

            <SoilImage
              fileName="soil-sampling-methods.png"
              alt="A 2D diagram showing soil sampling methods: W-pattern, random, and grid sampling"
              caption="Soil sampling methods – importance and techniques."
            />
          </SubtopicCard>

          <SubtopicCard title="Soil pH Testing and Influence on Crop Production">
            <p>
              <strong>Definition:</strong> Soil pH is a measure of the acidity
              or alkalinity of the soil, on a scale from 0 (most acidic) to 14
              (most alkaline), with 7 being neutral.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Influence on crop production:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Nutrient availability:</strong> Most nutrients are
                    available at pH 6.0–7.5. At low pH (acidic), phosphorus (P),
                    calcium (Ca), and magnesium (Mg) become unavailable; aluminium
                    and manganese become toxic. At high pH (alkaline), iron (Fe),
                    zinc (Zn), and manganese become unavailable.
                  </li>
                  <li>
                    <strong>Microbial activity:</strong> Soil organisms (bacteria,
                    fungi) are most active at pH 5.5–7.5. Acidic soils have
                    reduced microbial activity.
                  </li>
                  <li>
                    <strong>Root growth:</strong> Extreme pH damages root tips,
                    reducing water and nutrient uptake.
                  </li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Correcting Soil pH – Liming">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Types of Liming Materials</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Agricultural lime (calcium carbonate – CaCO₃):</strong>
                <br />
                Most common, relatively cheap. Contains calcium only.
              </li>
              <li>
                <strong>Dolomitic lime (calcium‑magnesium carbonate – CaMg(CO₃)₂):</strong>
                <br />
                Contains both calcium and magnesium. Useful if magnesium is also deficient.
              </li>
              <li>
                <strong>Burned lime (quicklime – CaO):</strong>
                <br />
                Very reactive, acts quickly but can be caustic. Less commonly used.
              </li>
              <li>
                <strong>Hydrated lime (slaked lime – Ca(OH)₂):</strong>
                <br />
                Reacts faster than agricultural lime but is more expensive.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Lime vs Fertiliser</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Lime:</strong>
                <br />
                Corrects soil pH and provides calcium (and magnesium). It does
                not directly supply major nutrients (N, P, K). It improves
                nutrient availability and soil structure.
              </li>
              <li>
                <strong>Fertiliser:</strong>
                <br />
                Supplies specific nutrients (N, P, K, etc.) to plants. It does
                not correct pH. Over‑application of some fertilisers (e.g.,
                ammonium‑based N) can acidify soil.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Interpreting pH Values</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>pH &lt; 5.0:</strong> Very acidic – lime needed.
              </li>
              <li>
                <strong>pH 5.1 – 5.5:</strong> Acidic – lime recommended.
              </li>
              <li>
                <strong>pH 5.6 – 6.5:</strong> Slightly acidic – lime may be
                needed depending on crop.
              </li>
              <li>
                <strong>pH 6.6 – 7.5:</strong> Neutral to slightly alkaline –
                ideal for most crops.
              </li>
              <li>
                <strong>pH 7.6 – 8.5:</strong> Alkaline – may cause micronutrient
                deficiencies (e.g., iron chlorosis).
              </li>
              <li>
                <strong>pH &gt; 8.5:</strong> Highly alkaline – often requires
                special management (gypsum, acidifying fertilisers).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Correcting pH (Liming)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Amount:</strong> Determined by soil test and lime quality
                (calcium carbonate equivalent).
              </li>
              <li>
                <strong>Timing:</strong> Apply lime 2–3 months before planting
                to allow reaction time. Incorporate into the soil.
              </li>
              <li>
                <strong>Methods:</strong> Broadcast and incorporate into the
                plough layer (0–20 cm).
              </li>
              <li>
                <strong>Benefits:</strong> Raises pH, improves nutrient availability,
                improves structure, increases microbial activity.
              </li>
            </ul>

            <SoilImage
              fileName="soil-ph-liming.png"
              alt="A 2D diagram showing soil pH scale, nutrient availability, liming materials, and pH correction"
              caption="Soil pH, liming materials, and pH correction."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Soil Fertility</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Application:</strong> broadcasting, banding, top dressing, foliar</li>
            <li><strong>Timing:</strong> basal (pre-plant), at planting, top dressing</li>
            <li><strong>Basal:</strong> P, K, some N (Compound D/C)</li>
            <li><strong>Top dressing:</strong> N (ammonium nitrate, urea)</li>
            <li><strong>Soil sampling:</strong> W-pattern, random, grid</li>
            <li><strong>pH:</strong> 6.0-7.5 ideal; lime raises pH (CaCO₃, dolomite)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'soil-erosion-conservation',
      title: 'Soil Erosion and Conservation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Methods of Soil Conservation on Arable Land">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Mechanical (structural) methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Contour ploughing:</strong>
                    <br />
                    Ploughing along the contour lines (across the slope) to
                    reduce runoff and soil loss.
                  </li>
                  <li>
                    <strong>Contour ridges:</strong>
                    <br />
                    Raised earth banks built along contours to trap water and
                    reduce erosion.
                  </li>
                  <li>
                    <strong>Tie‑ridging:</strong>
                    <br />
                    Ridges with small dams (ties) between them to trap water
                    and allow infiltration.
                  </li>
                  <li>
                    <strong>Terracing:</strong>
                    <br />
                    Building steps on steep slopes to reduce gradient and trap
                    soil and water.
                  </li>
                  <li>
                    <strong>Check dams (gully control):</strong>
                    <br />
                    Small dams built in gullies to trap sediment and slow water flow.
                  </li>
                  <li>
                    <strong>Drainage channels:</strong>
                    <br />
                    Waterways (grassed or stone‑lined) to safely carry excess
                    water without causing erosion.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Biological methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Cover crops:</strong>
                    <br />
                    Planting crops that cover the soil (e.g., cowpeas, sweet
                    potatoes) to protect it from raindrop impact.
                  </li>
                  <li>
                    <strong>Mulching:</strong>
                    <br />
                    Covering the soil with organic material to reduce splash
                    erosion and runoff.
                  </li>
                  <li>
                    <strong>Strip cropping:</strong>
                    <br />
                    Planting alternating strips of different crops (e.g., maize
                    and legumes) to break water flow.
                  </li>
                  <li>
                    <strong>Agroforestry:</strong>
                    <br />
                    Planting trees and shrubs among crops to provide cover and
                    reduce erosion.
                  </li>
                  <li>
                    <strong>Grass strips/contour grass strips:</strong>
                    <br />
                    Planting grass along contours to filter runoff and trap soil.
                  </li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Methods of Soil Conservation on Grazing Land">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Controlled grazing:</strong>
                <br />
                Rotational grazing (dividing the land into paddocks and rotating
                livestock) prevents overgrazing and allows grass recovery.
              </li>
              <li>
                <strong>Stocking rate management:</strong>
                <br />
                Keeping the number of animals at a level that the pasture can
                sustain without degradation.
              </li>
              <li>
                <strong>Rest periods:</strong>
                <br />
                Allowing grazing land to rest (recover) after being grazed.
              </li>
              <li>
                <strong>Reseeding degraded areas:</strong>
                <br />
                Planting grasses or legumes to restore cover on bare patches.
              </li>
              <li>
                <strong>Fire management:</strong>
                <br />
                Controlled burning of old grass to promote new growth (but must
                be done carefully to avoid destroying soil cover).
              </li>
              <li>
                <strong>Watering points:</strong>
                <br />
                Spreading watering points to avoid concentrated trampling and
                erosion around one area.
              </li>
              <li>
                <strong>Fencing:</strong>
                <br />
                Excluding livestock from fragile areas (e.g., wetlands, steep slopes).
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Constructing Mechanical Conservation Structures to Standard Dimensions">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Contour Ridges</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Purpose:</strong> To trap water and reduce runoff.
              </li>
              <li>
                <strong>Dimensions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Height: 0.3–0.5 m.</li>
                  <li>Width at base: 0.5–0.8 m.</li>
                  <li>Spacing: 5–10 m apart, depending on slope (closer on steeper slopes).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Tie‑Ridges</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Purpose:</strong> To trap water in furrows between ridges.
              </li>
              <li>
                <strong>Dimensions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Ridge height: 0.2–0.3 m.</li>
                  <li>Tie height: 0.15–0.2 m.</li>
                  <li>Spacing between ties: 1–2 m.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Terraces</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Purpose:</strong> To reduce slope length and prevent erosion.
              </li>
              <li>
                <strong>Dimensions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Broad‑based terraces:</strong>
                    <br />
                    Wide ridges with a gentle slope to allow cultivation.
                    Width: 1–2 m; height: 0.3–0.5 m.
                  </li>
                  <li>
                    <strong>Bench terraces:</strong>
                    <br />
                    Steps on steep slopes. Width depends on the slope and soil
                    depth (often 2–5 m wide).
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Grassed Waterways</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Purpose:</strong> To safely carry excess water without erosion.
              </li>
              <li>
                <strong>Dimensions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Width: 2–5 m (depending on catchment area).</li>
                  <li>Depth: 0.3–0.5 m.</li>
                  <li>Gradient: 2–5% (gentle to prevent scouring).</li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Biological Conservation Methods">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Using living organisms (plants, trees)
                to protect the soil from erosion.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Windbreaks:</strong>
                    <br />
                    Rows of trees or shrubs planted to reduce wind speed and
                    wind erosion.
                  </li>
                  <li>
                    <strong>Agroforestry:</strong>
                    <br />
                    Integrating trees and shrubs with crops to provide cover,
                    shade, and soil protection.
                  </li>
                  <li>
                    <strong>Grass strips:</strong>
                    <br />
                    Planting grass (e.g., vetiver grass) along contours to trap
                    soil and slow runoff.
                  </li>
                  <li>
                    <strong>Live fences:</strong>
                    <br />
                    Using thorny or dense shrubs as fences to protect soil and
                    livestock.
                  </li>
                  <li>
                    <strong>Restoration of degraded land:</strong>
                    <br />
                    Planting trees, grasses, and legumes to restore cover on
                    eroded areas.
                  </li>
                  <li>
                    <strong>Cover crops:</strong>
                    <br />
                    Growing crops that cover the soil (e.g., sweet potatoes,
                    cowpeas, velvet beans) to reduce raindrop impact.
                  </li>
                </ul>
              </li>
            </ul>

            <SoilImage
              fileName="soil-conservation-methods.png"
              alt="A 2D diagram showing mechanical (contour ridges, tie-ridging, terracing, check dams) and biological (cover crops, agroforestry, grass strips) conservation methods"
              caption="Soil conservation methods on arable and grazing land."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Soil Conservation</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Mechanical:</strong> contour ridges, tie-ridging, terracing, check dams</li>
            <li><strong>Biological:</strong> cover crops, agroforestry, grass strips, windbreaks</li>
            <li><strong>Grazing:</strong> rotational grazing, rest periods, controlled stocking</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'water-loss-drainage',
      title: 'Water Loss and Soil Drainage',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Drainage and Waterlogging">
            <p>
              <strong>Definition:</strong> Drainage is the removal of excess water
              from the soil. <strong>Waterlogging</strong> occurs when the soil
              is saturated with water for long periods, preventing air from
              reaching plant roots.
            </p>
            <p>
              Waterlogging is common in clay soils, areas with high rainfall, or
              where drainage is poor.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Effects of Waterlogged Soils on Crop Growth">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Root oxygen deficiency:</strong>
                <br />
                Water fills air spaces, preventing oxygen from reaching roots.
                Roots cannot respire and may die (root rot).
              </li>
              <li>
                <strong>Toxic substances:</strong>
                <br />
                Anaerobic conditions produce toxic compounds (e.g., hydrogen
                sulphide, methane, iron/manganese toxicity) that damage roots.
              </li>
              <li>
                <strong>Nutrient deficiencies:</strong>
                <br />
                Nitrogen is lost through denitrification. Phosphorus becomes
                unavailable in waterlogged soils.
              </li>
              <li>
                <strong>Reduced growth:</strong>
                <br />
                Plants are stunted, leaves turn yellow (chlorosis), and yields
                are reduced.
              </li>
              <li>
                <strong>Disease increase:</strong>
                <br />
                Waterlogging favours fungal diseases (e.g., root rots, damping off).
              </li>
              <li>
                <strong>Death:</strong>
                <br />
                Prolonged waterlogging kills plants.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Methods of Improving Drainage">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Open drains (ditches):</strong>
                <br />
                Digging channels (open ditches) to carry away excess water.
                Common in fields with poor natural drainage.
              </li>
              <li>
                <strong>Tile drains (subsurface drains):</strong>
                <br />
                Perforated pipes (tiles) buried below the soil surface to collect
                and carry away water. Efficient but expensive.
              </li>
              <li>
                <strong>Raised beds (ridge planting):</strong>
                <br />
                Planting crops on raised ridges or beds, keeping roots above
                the water table.
              </li>
              <li>
                <strong>Improving soil structure:</strong>
                <br />
                Adding organic matter and lime to clay soils improves structure
                and drainage.
              </li>
              <li>
                <strong>Deep ploughing:</strong>
                <br />
                Breaking hardpans (compacted layers) to allow water to drain
                through the profile.
              </li>
              <li>
                <strong>Mole drainage:</strong>
                <br />
                Creating channels using a mole plough to improve drainage in
                clay soils.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Causes of Leaching in Arable Land">
            <p>
              <strong>Definition:</strong> Leaching is the downward movement of
              water‑soluble nutrients (and salts) out of the root zone.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Heavy rainfall:</strong>
                <br />
                Excess rainfall percolates through the soil, washing nutrients
                (especially nitrogen and potassium) down.
              </li>
              <li>
                <strong>Over‑irrigation:</strong>
                <br />
                Applying too much water (especially flood irrigation) causes
                nutrients to leach below the root zone.
              </li>
              <li>
                <strong>Sandy soils:</strong>
                <br />
                Sandy soils have low water‑holding capacity, so water drains
                quickly, carrying nutrients with it.
              </li>
              <li>
                <strong>Poor nutrient management:</strong>
                <br />
                Applying nitrogen (especially nitrate) at the wrong time
                (e.g., before heavy rain) increases leaching.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Effects of Drainage on Nutrient Loss">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Nitrogen loss:</strong>
                <br />
                Nitrate (NO₃⁻) is highly soluble and easily leached from the
                root zone. This is the most significant nutrient loss through
                drainage.
              </li>
              <li>
                <strong>Sulphur loss:</strong>
                <br />
                Sulphate (SO₄²⁻) is also soluble and can be leached.
              </li>
              <li>
                <strong>Potassium loss:</strong>
                <br />
                Potassium (K⁺) can be leached from sandy soils or where there
                is high rainfall.
              </li>
              <li>
                <strong>Calcium and magnesium loss:</strong>
                <br />
                These can be leached in acidic soils (as they move with water).
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Methods of Controlling Leaching">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Split fertiliser applications:</strong>
                <br />
                Apply nitrogen in small doses during the growing season, rather
                than all at once. This matches plant demand and reduces the
                amount of nitrate available for leaching.
              </li>
              <li>
                <strong>Use slow‑release fertilisers:</strong>
                <br />
                These release nutrients slowly over time, reducing the risk of
                leaching.
              </li>
              <li>
                <strong>Improve soil water holding capacity:</strong>
                <br />
                Add organic matter to increase water retention, reducing the
                amount of water that percolates through.
              </li>
              <li>
                <strong>Timely irrigation:</strong>
                <br />
                Apply only the amount of water the crop needs, avoiding over‑irrigation.
              </li>
              <li>
                <strong>Cover crops:</strong>
                <br />
                Growing cover crops during the off‑season takes up nutrients
                (especially nitrogen), reducing leaching.
              </li>
              <li>
                <strong>Controlled drainage:</strong>
                <br />
                Managing water levels in drains to reduce nutrient loss.
              </li>
            </ul>

            <SoilImage
              fileName="waterlogging-drainage-leaching.png"
              alt="A 2D diagram showing waterlogging effects, drainage methods, causes of leaching, and leaching control methods"
              caption="Waterlogging, drainage, and leaching in arable land."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Drainage &amp; Leaching</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Waterlogging:</strong> root death, toxicity, nutrient loss</li>
            <li><strong>Drainage:</strong> open drains, tile drains, raised beds</li>
            <li><strong>Leaching:</strong> nutrient loss (N, S, K, Ca, Mg)</li>
            <li><strong>Control:</strong> split fertiliser, slow-release, organic matter</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'water-conservation',
      title: 'Water Conservation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Methods of Rainwater Harvesting and Storage">
            <p>
              <strong>Definition:</strong> Rainwater harvesting is the collection
              and storage of rainwater for later use. It helps reduce pressure on
              groundwater and surface water sources.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Harvesting Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Roof catchment:</strong>
                <br />
                Collecting rainwater from building roofs through gutters and
                downpipes into tanks or drums.
              </li>
              <li>
                <strong>Surface runoff harvesting:</strong>
                <br />
                Collecting runoff from the ground surface (e.g., roads, fields)
                into ponds, dams, or infiltration pits.
              </li>
              <li>
                <strong>In‑field rainwater harvesting:</strong>
                <br />
                Using contour ridges, tie‑ridges, and infiltration pits to trap
                rainwater where it falls, allowing it to infiltrate the soil.
              </li>
              <li>
                <strong>Weirs and diversion channels:</strong>
                <br />
                Diverting water from streams or rivers into storage ponds or
                irrigation channels.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Storage Methods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Storage tanks (above ground):</strong>
                <br />
                Plastic, metal, or concrete tanks for storing household water
                (e.g., Jojo tanks).
              </li>
              <li>
                <strong>Storage tanks (underground):</strong>
                <br />
                Underground concrete or plastic tanks keep water cool and reduce
                evaporation.
              </li>
              <li>
                <strong>Ponds and dams:</strong>
                <br />
                Open water bodies (small ponds or larger dams) for storing
                surface runoff. Used for irrigation and livestock.
              </li>
              <li>
                <strong>Sand dams:</strong>
                <br />
                Constructed in seasonal riverbeds to store water in the sand,
                reducing evaporation.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Ground Water Sources">
            <p>
              <strong>Definition:</strong> Groundwater is water stored beneath
              the Earth's surface in soil pores and rock fractures (aquifers).
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Aquifers:</strong>
                <br />
                Underground layers of rock or sediment that hold and transmit
                water. There are two main types:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Unconfined aquifer:</strong>
                    <br />
                    Water is in direct contact with the atmosphere through the
                    soil. Can be recharged by rainfall.
                  </li>
                  <li>
                    <strong>Confined aquifer:</strong>
                    <br />
                    Water is trapped between impermeable layers (clay or rock).
                    Often pressurised (artesian wells).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Boreholes:</strong>
                <br />
                Drilled holes that access groundwater. Used for domestic water,
                irrigation, and livestock.
              </li>
              <li>
                <strong>Wells (shallow):</strong>
                <br />
                Dug holes that access water in unconfined aquifers (water table).
                Common in rural areas.
              </li>
              <li>
                <strong>Springs:</strong>
                <br />
                Natural outlets where groundwater emerges at the surface.
              </li>
            </ul>

            <SoilImage
              fileName="rainwater-harvesting-groundwater.png"
              alt="A 2D diagram showing rainwater harvesting methods (roof catchment, surface runoff, in-field) and groundwater sources (aquifers, boreholes, wells, springs)"
              caption="Rainwater harvesting methods and groundwater sources."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Water Conservation</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Harvesting:</strong> roof catchment, runoff, in‑field, diversion</li>
            <li><strong>Storage:</strong> tanks (above/underground), ponds, dams, sand dams</li>
            <li><strong>Groundwater:</strong> aquifers, boreholes, wells, springs</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'irrigation',
      title: 'Irrigation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Methods and Types of Irrigation">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Surface (Flood) Irrigation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Water is applied to the soil surface
                and allowed to flow over the field by gravity.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Basin irrigation:</strong>
                    <br />
                    Fields are divided into basins surrounded by ridges; water
                    is ponded in each basin.
                  </li>
                  <li>
                    <strong>Furrow irrigation:</strong>
                    <br />
                    Water flows in small channels (furrows) between rows of crops.
                  </li>
                  <li>
                    <strong>Border strip irrigation:</strong>
                    <br />
                    Water flows in strips of land between parallel ridges.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sprinkler Irrigation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Water is sprayed over the crops like
                rainfall through sprinklers.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Centre pivot:</strong>
                    <br />
                    A rotating sprinkler system that moves in a circular pattern
                    around a pivot point.
                  </li>
                  <li>
                    <strong>Lateral move (side roll):</strong>
                    <br />
                    A sprinkler system that moves in a straight line across the field.
                  </li>
                  <li>
                    <strong>Fixed sprinkler (hand‑move):</strong>
                    <br />
                    Sprinklers are moved manually across the field.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Drip (Trickle) Irrigation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Water is delivered slowly and directly
                to the plant root zone through emitters (drippers).
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Surface drip:</strong>
                    <br />
                    Drip lines laid on the soil surface.
                  </li>
                  <li>
                    <strong>Subsurface drip:</strong>
                    <br />
                    Drip lines buried below the soil surface.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sub‑irrigation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Water is applied below the soil
                surface (e.g., through tile drains or perforated pipes), allowing
                capillary rise to the root zone.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Advantages and Disadvantages of Each Method">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Surface (Flood) Irrigation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Low cost and simple technology.</li>
                  <li>Can be used on flat land with clay soils.</li>
                  <li>Widespread in Zimbabwe (e.g., sugar cane in Lowveld).</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Inefficient water use (loss through evaporation and deep drainage).</li>
                  <li>Not suitable for sandy soils or steep slopes.</li>
                  <li>Can cause waterlogging.</li>
                  <li>Labour‑intensive.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sprinkler Irrigation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Efficient water use (50–70%).</li>
                  <li>Suitable for a wide range of soils and slopes.</li>
                  <li>Can be automated (centre pivot).</li>
                  <li>Can also apply fertilisers (fertigation).</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>High initial cost (equipment, pipes).</li>
                  <li>Wind can affect water distribution.</li>
                  <li>Energy‑intensive (pumping).</li>
                  <li>May cause foliar diseases (wet leaves).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Drip Irrigation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Very efficient (90–95% water use).</li>
                  <li>Reduces weed growth and disease.</li>
                  <li>Can apply fertilisers precisely.</li>
                  <li>Suitable for all soils and slopes.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>High initial cost (drip lines, filters, emitters).</li>
                  <li>Clogging of emitters (requires filtration and maintenance).</li>
                  <li>Requires technical skills.</li>
                  <li>Difficult to use on large fields.</li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Factors Affecting Choice of Irrigation System">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Type of crop:</strong>
                <br />
                Row crops (maize, vegetables) suit drip or furrow. Pastures suit
                sprinkler or flood. High‑value crops (tobacco, fruit) suit drip.
              </li>
              <li>
                <strong>Soil type:</strong>
                <br />
                Sandy soils need frequent, small applications (drip, sprinkler).
                Clay soils can use flood irrigation.
              </li>
              <li>
                <strong>Water availability:</strong>
                <br />
                If water is scarce, choose efficient systems (drip). If water
                is abundant, flood may be cheaper.
              </li>
              <li>
                <strong>Capital and maintenance:</strong>
                <br />
                Drip requires high initial capital but low labour. Flood is
                low capital but labour‑intensive.
              </li>
              <li>
                <strong>Topography (slope):</strong>
                <br />
                Flat land suits flood and sprinkler. Steep slopes need drip or
                sprinkler to avoid runoff.
              </li>
              <li>
                <strong>Labour availability:</strong>
                <br />
                If labour is cheap and available, flood irrigation may be
                chosen. If labour is scarce, use automated systems.
              </li>
              <li>
                <strong>Energy availability:</strong>
                <br />
                Sprinkler and drip need pumps (energy). Flood uses gravity.
              </li>
              <li>
                <strong>Zimbabwe examples:</strong>
                <br />
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Sugar cane (Lowveld):</strong> Flood irrigation
                    (cheap, water from rivers).
                  </li>
                  <li>
                    <strong>Horticulture (vegetables, flowers):</strong> Drip
                    irrigation (high value).
                  </li>
                  <li>
                    <strong>Maize and wheat (commercial):</strong> Centre pivot
                    (sprinkler) for large areas.
                  </li>
                  <li>
                    <strong>Small‑scale gardens:</strong> Manual watering,
                    treadle pumps, or small drip kits.
                  </li>
                </ul>
              </li>
            </ul>

            <SoilImage
              fileName="irrigation-methods-comparison.png"
              alt="A 2D diagram comparing surface (flood), sprinkler, and drip irrigation methods with advantages, disadvantages, and factors affecting choice"
              caption="Irrigation methods: surface, sprinkler, drip – advantages, disadvantages, and choice factors."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Irrigation Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Surface:</strong> cheap, low efficiency, waterlogging risk</li>
            <li><strong>Sprinkler:</strong> efficient, high cost, energy‑intensive</li>
            <li><strong>Drip:</strong> most efficient, high capital, requires maintenance</li>
            <li><strong>Choice:</strong> crop, soil, water, capital, topography, labour</li>
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
            Explore soil formation, texture, structure, types, constituents,
            temperature, fertility, erosion conservation, drainage, water
            conservation, and irrigation – with a focus on Zimbabwe.
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
                  <strong className="text-white">Soil formation:</strong> Physical
                  (freeze‑thaw, roots), chemical (oxidation, hydrolysis), and
                  biological (organisms, burrowing) weathering create soil.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Texture &amp; structure:</strong>
                  Eight textural classes (sand to clay). The textural triangle
                  determines class. Good structure (crumb) is improved with
                  organic matter, reduced tillage, and cover crops.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Soil types:</strong> Sandy soils
                  need organic matter and anthill soil; clay soils need organic
                  matter, lime, and gypsum.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Fertility:</strong> Basal (P, K)
                  vs top dressing (N). Soil sampling guides fertiliser rates.
                  pH 6.0–7.5 is ideal; lime raises pH.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Conservation:</strong> Mechanical
                  (contour ridges, terracing) and biological (cover crops, grass
                  strips) methods prevent erosion.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Drainage &amp; leaching:</strong>
                  Waterlogging harms roots. Drainage uses open drains, tile drains,
                  raised beds. Leaching loses N, S, K; controlled by split
                  fertiliser and organic matter.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Water conservation:</strong>
                  Rainwater harvesting (roof, runoff, in‑field) and storage
                  (tanks, ponds, dams). Groundwater from aquifers, boreholes, and wells.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Irrigation:</strong> Surface
                  (cheap, low efficiency), sprinkler (efficient, high cost), drip
                  (most efficient, high capital). Choice depends on crop, soil,
                  water, capital, and labour.
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
              <>Ready to move on to <span className="text-blue-600">General Agriculture</span>?</>
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
                alert('Proceed to General Agriculture (next topic)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin General Agriculture →' : 'Next Section →'}
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
   Use a mix of 2D diagram style and realistic photographs.

   --- SOIL FORMATION ---
   1. weathering-forms.png
      A 2D diagram showing physical (freeze-thaw, root action, abrasion),
      chemical (oxidation, hydrolysis, carbonation), and biological
      (lichens, burrowing, roots) weathering.

   --- SOIL TEXTURE, STRUCTURE AND PROFILE ---
   2. soil-textural-triangle.png
      A soil textural triangle with the eight textural classes (sand, loamy sand,
      sandy loam, loam, silt loam, silty clay loam, clay loam, clay).

   3. soil-structure-improvement.png
      A 2D diagram showing methods to improve structure: adding organic matter,
      cover crops, mulching, reduced tillage, liming.

   --- SOIL TYPES ---
   4. improving-sand-clay-soils.png
      A split diagram: left – improving sandy soils (organic matter, anthill soil,
      cover crops); right – improving clay soils (organic matter, lime, gypsum,
      raised beds).

   --- SOIL CONSTITUENTS ---
   5. soil-constituents-organisms.png
      A 2D diagram showing soil composition (mineral, organic matter, water, air)
      and the roles of macro-organisms (earthworms) and micro-organisms
      (bacteria, fungi).

   --- SOIL TEMPERATURE ---
   6. soil-temperature-effects.png
      A 2D diagram showing effects of heat and cold on plant growth stages and
      measures to reduce extremes (mulching, irrigation, shade, windbreaks).

   --- SOIL FERTILITY ---
   7. soil-sampling-methods.png
      A 2D diagram showing W-pattern, random, and grid sampling methods.

   8. soil-ph-liming.png
      A 2D diagram showing pH scale, nutrient availability at different pH,
      liming materials (agricultural lime, dolomitic lime), and pH correction.

   --- SOIL EROSION AND CONSERVATION ---
   9. soil-conservation-methods.png
      A 2D diagram showing mechanical (contour ridges, tie-ridging, terracing,
      check dams) and biological (cover crops, agroforestry, grass strips,
      windbreaks) conservation methods.

   --- WATER LOSS AND SOIL DRAINAGE ---
   10. waterlogging-drainage-leaching.png
       A 2D diagram showing waterlogging effects, drainage methods (open drains,
       tile drains, raised beds), causes of leaching, and leaching control methods.

   --- WATER CONSERVATION ---
   11. rainwater-harvesting-groundwater.png
       A 2D diagram showing rainwater harvesting (roof catchment, runoff, in-field)
       and groundwater sources (aquifers, boreholes, wells, springs).

   --- IRRIGATION ---
   12. irrigation-methods-comparison.png
       A 2D diagram comparing surface (flood), sprinkler, and drip irrigation
       with advantages, disadvantages, and factors affecting choice.

   ============================================================ */