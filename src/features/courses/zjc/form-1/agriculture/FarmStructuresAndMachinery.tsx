import React, { useState, useRef } from 'react';

/**
 * Topic: Farm Structures and Machinery – Full component with sticky navigation,
 * container cards (9px border-radius), image placeholders,
 * and auto‑scroll + double‑highlight on heading.
 */
export const FarmStructuresAndMachinery: React.FC = () => {
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

    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        {isMissing ? (
          <div className="flex aspect-video flex-col items-center justify-center bg-slate-100 px-6 text-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-green-600">
              Image ready to add
            </p>
            <code className="mt-3 break-all rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
              {fileName}
            </code>
            <p className="mt-3 text-xs text-slate-500">
              Place this file in <strong>public/images/agriculture/</strong>
            </p>
          </div>
        ) : (
          <img
            src={`/images/agriculture/${fileName}`}
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
      id: 'farm-implements',
      title: 'Farm Implements',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Introduction to Tillage Implements">
            <p>
              <strong>Definition:</strong> Tillage implements are tools and machines
              used to prepare the soil for planting. They are essential for breaking
              up soil, controlling weeds, incorporating organic matter, and creating
              a suitable seedbed for crops. Farm implements can be classified by
              their function and the type of tillage they perform.
            </p>
            <p>
              There are two main types of tillage:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Primary tillage:</strong> The initial, deep cultivation of
                the soil. It breaks up hard soil, incorporates crop residues, and
                prepares the soil for secondary tillage. Examples: mould board plough,
                disc plough, chisel plough.
              </li>
              <li>
                <strong>Secondary tillage:</strong> The lighter cultivation that
                follows primary tillage. It breaks up clods, levels the soil, and
                creates a fine seedbed. Examples: harrow, cultivator, ridger, planter.
              </li>
            </ul>

            <AgricultureImage
              fileName="tillage-implements-overview.png"
              alt="A 2D diagram showing the overview of tillage implements: primary tillage (mould board plough, disc plough) and secondary tillage (harrow, cultivator, ridger, planter)"
              caption="Overview of tillage implements: primary and secondary tillage."
            />
          </SubtopicCard>

          <SubtopicCard title="1. Mould Board Plough">
            <p>
              <strong>Definition:</strong> A mould board plough is a primary tillage
              implement used to turn over the soil, bury crop residues, weeds, and
              organic matter. It is one of the oldest and most important farm implements.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Parts of a Mould Board Plough and Their Functions</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Mould board:</strong> The curved metal plate that turns the
                soil over. It lifts and inverts the soil, burying weeds and crop
                residues. This is the most distinctive part of the plough.
              </li>
              <li>
                <strong>Share (point):</strong> The cutting edge at the bottom of the
                plough that cuts through the soil. It makes a horizontal cut in the soil.
              </li>
              <li>
                <strong>Frog:</strong> The part that connects the share and the mould
                board. It is the central part of the plough body.
              </li>
              <li>
                <strong>Beam:</strong> The long wooden or metal bar that connects the
                plough to the draught animal or tractor. It transmits the pulling force.
              </li>
              <li>
                <strong>Handle:</strong> The long handles at the back of the plough
                that the farmer holds to control the depth and direction of the plough.
              </li>
              <li>
                <strong>Wheel:</strong> The wheel that supports the plough and helps
                control the depth of ploughing. Some ploughs have one wheel, while
                others have two.
              </li>
              <li>
                <strong>Depth regulator:</strong> A mechanism that controls how deep
                the plough goes into the soil. It can be adjusted to suit different
                soil types and conditions.
              </li>
              <li>
                <strong>Landside:</strong> The flat surface on the side of the plough
                that runs against the uncut soil, keeping the plough stable and preventing
                it from moving sideways.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">How a Mould Board Plough Works</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                The plough is pulled forward by a tractor or draught animal (oxen, donkeys).
              </li>
              <li>
                The share cuts a slice of soil horizontally.
              </li>
              <li>
                The mould board lifts the slice of soil and turns it over (inverts it).
              </li>
              <li>
                The soil is deposited upside down, burying weeds, crop residues, and
                organic matter.
              </li>
              <li>
                The result is a furrow (a long, narrow trench) and a ridge of inverted soil.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Advantages and Disadvantages</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Buries weeds and crop residues effectively.</li>
                  <li>Incorporates organic matter into the soil.</li>
                  <li>Breaks up hard soil and improves soil structure.</li>
                  <li>Controls pests and diseases by burying them.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Can cause soil erosion if used on steep slopes.</li>
                  <li>Can damage soil structure if used excessively.</li>
                  <li>Requires significant draft power (animals or tractor).</li>
                  <li>Can create a hard pan (compacted layer) at the plough depth.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="mould-board-plough-parts.png"
              alt="A 2D diagram showing the parts of a mould board plough: mould board, share, frog, beam, handle, wheel, depth regulator, and landside with labels"
              caption="Parts of a mould board plough and their functions."
            />
          </SubtopicCard>

          <SubtopicCard title="2. Cultivator">
            <p>
              <strong>Definition:</strong> A cultivator is a secondary tillage implement
              used to break up soil clods, remove weeds, and aerate the soil. It is
              used after ploughing to prepare the soil for planting.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Parts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Tines (teeth):</strong> The metal spikes that penetrate
                    the soil and break up clods. They are the main working parts.
                  </li>
                  <li>
                    <strong>Frame:</strong> The structure that holds the tines in place.
                  </li>
                  <li>
                    <strong>Wheels:</strong> Support the cultivator and help control depth.
                  </li>
                  <li>
                    <strong>Hitch:</strong> The part that connects the cultivator to
                    the tractor or draught animal.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Function:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Breaks up soil clods left after ploughing.</li>
                  <li>Removes shallow-rooted weeds.</li>
                  <li>Aerates the soil, allowing oxygen to reach plant roots.</li>
                  <li>Mixes the soil and prepares a fine seedbed.</li>
                </ul>
              </li>
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Spring tine cultivator:</strong> Has flexible tines that
                    vibrate as they move, breaking up soil effectively.
                  </li>
                  <li>
                    <strong>Rigid tine cultivator:</strong> Has fixed, rigid tines
                    that are strong and durable for heavy soils.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Cultivators are used on both commercial
                and small-scale farms to prepare seedbeds for crops like maize, tobacco,
                and vegetables.
              </li>
            </ul>

            <AgricultureImage
              fileName="cultivator-diagram.png"
              alt="A 2D diagram showing a cultivator with tines, frame, wheels, and hitch labelled"
              caption="Cultivator: parts and functions."
            />
          </SubtopicCard>

          <SubtopicCard title="3. Harrow">
            <p>
              <strong>Definition:</strong> A harrow is a secondary tillage implement
              used to break up soil clods, level the soil, and remove weeds. It is
              often used after ploughing and cultivating to create a fine, even seedbed.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Parts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Discs or tines:</strong> The working parts that break up
                    the soil. Disc harrows have circular discs, while tine harrows
                    have metal teeth.
                  </li>
                  <li>
                    <strong>Frame:</strong> The structure that holds the discs or tines.
                  </li>
                  <li>
                    <strong>Wheels:</strong> Support the harrow and help control depth.
                  </li>
                  <li>
                    <strong>Hitch:</strong> Connects the harrow to the tractor or
                    draught animal.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Function:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Breaks up soil clods into smaller particles.</li>
                  <li>Levels the soil surface, removing ridges and depressions.</li>
                  <li>Removes shallow-rooted weeds.</li>
                  <li>Creates a fine, even seedbed for planting.</li>
                </ul>
              </li>
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Disc harrow:</strong> Has a set of concave discs that cut
                    and break up soil. Good for heavy soils.
                  </li>
                  <li>
                    <strong>Tine harrow:</strong> Has metal teeth (tines) that drag
                    through the soil. Good for lighter soils.
                  </li>
                  <li>
                    <strong>Chain harrow:</strong> A simple harrow made of chains
                    that drag over the soil. Used for light cultivation and smoothing.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Disc harrows are commonly used on
                commercial farms in Zimbabwe, while tine harrows are used on small-scale farms.
              </li>
            </ul>

            <AgricultureImage
              fileName="harrow-types.png"
              alt="A 2D diagram showing types of harrows: disc harrow, tine harrow, and chain harrow"
              caption="Types of harrows: disc harrow, tine harrow, and chain harrow."
            />
          </SubtopicCard>

          <SubtopicCard title="4. Planter">
            <p>
              <strong>Definition:</strong> A planter is a secondary tillage implement
              used to plant seeds in the soil. It places seeds at the correct depth
              and spacing, ensuring uniform germination and crop establishment.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Parts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Seed hopper:</strong> The container that holds the seeds.
                  </li>
                  <li>
                    <strong>Seed metering mechanism:</strong> Regulates the flow of
                    seeds to ensure uniform spacing.
                  </li>
                  <li>
                    <strong>Seed tubes:</strong> Guide the seeds from the hopper to
                    the planting furrow.
                  </li>
                  <li>
                    <strong>Furrow openers:</strong> Create a furrow in the soil for
                    the seed.
                  </li>
                  <li>
                    <strong>Covering wheels:</strong> Cover the seeds with soil after
                    they are planted.
                  </li>
                  <li>
                    <strong>Press wheels:</strong> Firm the soil over the seed to
                    ensure good seed-to-soil contact.
                  </li>
                  <li>
                    <strong>Frame and wheels:</strong> Support the planter and allow
                    it to move across the field.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Function:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Opens a furrow in the soil.</li>
                  <li>Drops the seed at the correct depth and spacing.</li>
                  <li>Covers the seed with soil.</li>
                  <li>Firms the soil over the seed.</li>
                  <li>Ensures uniform germination and crop establishment.</li>
                </ul>
              </li>
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Hand planter:</strong> A simple planter operated by hand.
                    Used on small farms.
                  </li>
                  <li>
                    <strong>Tractor-mounted planter:</strong> Attached to a tractor
                    for large-scale planting.
                  </li>
                  <li>
                    <strong>Precision planter:</strong> Places seeds at very precise
                    spacing and depth. Used for high-value crops.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Planters are used for planting maize,
                beans, groundnuts, and other row crops. Precision planters are used
                for tobacco and horticultural crops.
              </li>
            </ul>

            <AgricultureImage
              fileName="planter-parts.png"
              alt="A 2D diagram showing the parts of a planter: seed hopper, seed metering mechanism, seed tubes, furrow openers, covering wheels, and press wheels"
              caption="Parts of a planter and their functions."
            />
          </SubtopicCard>

          <SubtopicCard title="5. Ridger">
            <p>
              <strong>Definition:</strong> A ridger is a secondary tillage implement
              used to create ridges (raised rows of soil) in the field. Ridges are
              used for crops like potatoes, sugarcane, and maize in some systems.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Parts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Mould boards (wings):</strong> Shaped metal plates that
                    push soil to the centre to form a ridge.
                  </li>
                  <li>
                    <strong>Frame:</strong> Holds the mould boards and connects them
                    to the tractor or draught animal.
                  </li>
                  <li>
                    <strong>Depth regulator:</strong> Controls the depth of the ridges.
                  </li>
                  <li>
                    <strong>Wheels:</strong> Support the ridger and help control depth.
                  </li>
                  <li>
                    <strong>Hitch:</strong> Connects the ridger to the tractor or
                    draught animal.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Function:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Creates ridges (raised rows) for planting.</li>
                  <li>Helps with drainage in wet areas.</li>
                  <li>Facilitates irrigation in dry areas.</li>
                  <li>Makes harvesting easier for root crops (potatoes).</li>
                </ul>
              </li>
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Single-row ridger:</strong> Makes one ridge at a time.
                  </li>
                  <li>
                    <strong>Multi-row ridger:</strong> Makes multiple ridges at once
                    (tractor-mounted).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe uses:</strong> Ridgers are used in potato production
                (Eastern Highlands) and in sugarcane production (Lowveld).
              </li>
            </ul>

            <AgricultureImage
              fileName="ridger-diagram.png"
              alt="A 2D diagram showing a ridger with mould boards, frame, depth regulator, wheels, and hitch labelled"
              caption="Ridger: parts and functions."
            />
          </SubtopicCard>

          <SubtopicCard title="Comparison of Tillage Implements">
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Implement</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Type</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Function</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Main Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Mould Board Plough</td>
                  <td className="border border-slate-300 px-4 py-2">Primary tillage</td>
                  <td className="border border-slate-300 px-4 py-2">Turns and inverts soil</td>
                  <td className="border border-slate-300 px-4 py-2">Initial ploughing</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Cultivator</td>
                  <td className="border border-slate-300 px-4 py-2">Secondary tillage</td>
                  <td className="border border-slate-300 px-4 py-2">Breaks clods, removes weeds</td>
                  <td className="border border-slate-300 px-4 py-2">Seedbed preparation</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Harrow</td>
                  <td className="border border-slate-300 px-4 py-2">Secondary tillage</td>
                  <td className="border border-slate-300 px-4 py-2">Levels soil, breaks clods</td>
                  <td className="border border-slate-300 px-4 py-2">Finishing seedbed</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Planter</td>
                  <td className="border border-slate-300 px-4 py-2">Secondary tillage</td>
                  <td className="border border-slate-300 px-4 py-2">Plants seeds at correct depth/spacing</td>
                  <td className="border border-slate-300 px-4 py-2">Planting</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Ridger</td>
                  <td className="border border-slate-300 px-4 py-2">Secondary tillage</td>
                  <td className="border border-slate-300 px-4 py-2">Creates ridges for planting</td>
                  <td className="border border-slate-300 px-4 py-2">Potato, sugarcane</td>
                </tr>
              </tbody>
            </table>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Tillage:</strong> soil preparation for planting</li>
            <li><strong>Primary tillage:</strong> initial deep cultivation</li>
            <li><strong>Secondary tillage:</strong> lighter cultivation after ploughing</li>
            <li><strong>Mould board:</strong> curved plate that turns soil</li>
            <li><strong>Share:</strong> cutting edge of a plough</li>
            <li><strong>Furrow:</strong> trench created by ploughing</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'fencing',
      title: 'Fencing',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Reasons for Fencing">
            <p>
              <strong>Definition:</strong> Fencing is the construction of barriers
              (fences) around fields, paddocks, and farm boundaries. Fencing is an
              essential part of farm management and serves many purposes.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Livestock management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Containment:</strong> Fences keep livestock within a
                    designated area, preventing them from wandering off or mixing
                    with other herds.
                  </li>
                  <li>
                    <strong>Grazing management:</strong> Fences allow farmers to
                    practice rotational grazing, dividing pastures into paddocks
                    for controlled grazing.
                  </li>
                  <li>
                    <strong>Separation:</strong> Fences separate different types of
                    livestock (cattle, goats, sheep) and different herds.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Crop protection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Preventing damage:</strong> Fences protect crops from
                    being eaten or trampled by livestock and wild animals.
                  </li>
                  <li>
                    <strong>Wildlife exclusion:</strong> Fences keep wild animals
                    (elephants, impala, warthogs) out of crop fields.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Boundary demarcation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Property boundaries:</strong> Fences mark the boundaries
                    of a farm, preventing disputes with neighbours.
                  </li>
                  <li>
                    <strong>Land tenure:</strong> Fences indicate ownership and
                    help enforce land rights.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Security:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Theft prevention:</strong> Fences deter thieves and
                    protect farm property (equipment, livestock, crops).
                  </li>
                  <li>
                    <strong>Safety:</strong> Fences can prevent people from entering
                    dangerous areas (e.g., dams, quarries).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Environmental management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Soil conservation:</strong> Fences can prevent overgrazing
                    and soil erosion by controlling livestock movement.
                  </li>
                  <li>
                    <strong>Water protection:</strong> Fences can prevent livestock
                    from damaging water sources (rivers, dams) and polluting them.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="fencing-reasons.png"
              alt="A 2D diagram showing reasons for fencing: livestock management, crop protection, boundary demarcation, security, and environmental management"
              caption="Reasons for fencing on a farm."
            />
          </SubtopicCard>

          <SubtopicCard title="Types of Fences">
            <p>
              <strong>Definition:</strong> Different types of fences are used for
              different purposes. The choice of fencing depends on the animals being
              contained, the terrain, the budget, and the intended use.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Barbed wire fence:</strong>
                <br />
                <strong>Description:</strong> A fence made of twisted wire with sharp
                barbs (points) at intervals.
                <br />
                <strong>Uses:</strong> Cattle, boundary fencing, security.
                <br />
                <strong>Advantages:</strong> Strong, durable, relatively cheap,
                effective for cattle.
                <br />
                <strong>Disadvantages:</strong> Can injure animals if not maintained,
                not effective for small animals (goats, sheep).
                <br />
                <strong>Zimbabwe uses:</strong> Common on commercial farms and
                ranches for cattle and boundary fences.
              </li>
              <li>
                <strong>Diamond mesh fence:</strong>
                <br />
                <strong>Description:</strong> A fence made of galvanised wire woven
                into a diamond-shaped mesh.
                <br />
                <strong>Uses:</strong> Sheep, goats, poultry, small animals, gardens.
                <br />
                <strong>Advantages:</strong> Effective for small animals, strong,
                durable, good for gardens and crop protection.
                <br />
                <strong>Disadvantages:</strong> More expensive than barbed wire.
                <br />
                <strong>Zimbabwe uses:</strong> Common for goats, sheep, and poultry
                on small-scale and commercial farms.
              </li>
              <li>
                <strong>Electric fence:</strong>
                <br />
                <strong>Description:</strong> A fence that uses an electric current
                to deliver a shock to animals that touch it.
                <br />
                <strong>Uses:</strong> Cattle, wildlife exclusion (elephants, pigs),
                rotational grazing.
                <br />
                <strong>Advantages:</strong> Highly effective, can be moved (temporary),
                low maintenance.
                <br />
                <strong>Disadvantages:</strong> Requires a power source (electricity
                or battery), can be expensive to install.
                <br />
                <strong>Zimbabwe uses:</strong> Used on commercial farms for cattle
                and for wildlife exclusion, especially in areas with elephants.
              </li>
              <li>
                <strong>Palisade fence:</strong>
                <br />
                <strong>Description:</strong> A fence made of vertical wooden poles
                placed close together.
                <br />
                <strong>Uses:</strong> Security, boundary fencing.
                <br />
                <strong>Advantages:</strong> Strong, durable, good for security.
                <br />
                <strong>Disadvantages:</strong> Expensive, requires timber.
                <br />
                <strong>Zimbabwe uses:</strong> Used for security around homesteads
                and in high-value areas.
              </li>
              <li>
                <strong>Live fence (hedge):</strong>
                <br />
                <strong>Description:</strong> A fence made of living plants (thorny
                bushes, trees) planted in a row.
                <br />
                <strong>Uses:</strong> Boundary fencing, livestock containment, windbreaks.
                <br />
                <strong>Advantages:</strong> Cheap, environmentally friendly, provides
                habitat for wildlife, can be used as a windbreak.
                <br />
                <strong>Disadvantages:</strong> Takes time to grow, requires maintenance,
                not effective for all animals.
                <br />
                <strong>Zimbabwe examples:</strong> Kei apple (Dovyalis caffra),
                Mauritius thorn (Caesalpinia decapetala), and other thorny species.
              </li>
              <li>
                <strong>Game fence:</strong>
                <br />
                <strong>Description:</strong> A strong, high fence designed to contain
                wild animals (game) in wildlife areas or game ranches.
                <br />
                <strong>Uses:</strong> Wildlife management, game ranching.
                <br />
                <strong>Advantages:</strong> Strong, can contain large animals
                (elephants, buffalo, giraffe).
                <br />
                <strong>Disadvantages:</strong> Very expensive, requires strong
                posts and heavy wire.
                <br />
                <strong>Zimbabwe uses:</strong> Used in game reserves, national
                parks, and game ranches (e.g., Save Valley Conservancy).
              </li>
            </ul>

            <AgricultureImage
              fileName="fence-types.png"
              alt="A 2D diagram showing types of fences: barbed wire, diamond mesh, electric, palisade, live fence (hedge), and game fence"
              caption="Types of fences used on farms and their purposes."
            />
          </SubtopicCard>

          <SubtopicCard title="Choosing the Right Fence">
            <p>
              When choosing a fence, farmers should consider:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Purpose:</strong> What is the fence for? (livestock, crops,
                security, boundary?)
              </li>
              <li>
                <strong>Type of animal:</strong> What animals need to be contained?
                (cattle, goats, sheep, poultry?)
              </li>
              <li>
                <strong>Budget:</strong> How much money is available for fencing?
              </li>
              <li>
                <strong>Terrain:</strong> Is the land flat, hilly, or rocky?
              </li>
              <li>
                <strong>Durability:</strong> How long does the fence need to last?
              </li>
              <li>
                <strong>Maintenance:</strong> How much time and effort can be spent
                on maintaining the fence?
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Fencing Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Reasons:</strong> livestock, crop protection, boundaries, security</li>
            <li><strong>Barbed wire:</strong> cattle, boundaries</li>
            <li><strong>Diamond mesh:</strong> goats, sheep, poultry</li>
            <li><strong>Electric:</strong> cattle, wildlife exclusion</li>
            <li><strong>Live fence:</strong> cheap, environmental</li>
            <li><strong>Game fence:</strong> wildlife management</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'harnessing',
      title: 'Harnessing',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Introduction to Harnessing">
            <p>
              <strong>Definition:</strong> Harnessing refers to the equipment and
              methods used to attach draught animals (oxen, donkeys, horses) to
              farm implements (ploughs, carts, cultivators) so that they can pull them.
            </p>
            <p>
              In Zimbabwe, draught animals are still widely used on small-scale farms
              for ploughing, cultivating, and transport. Proper harnessing is essential
              for the welfare of the animals and the efficiency of the work.
            </p>

            <AgricultureImage
              fileName="harnessing-overview.png"
              alt="A realistic photograph or 2D diagram showing an ox or donkey wearing a yoke and pulling a plough or cart"
              caption="Harnessing: draught animals pulling farm implements."
            />
          </SubtopicCard>

          <SubtopicCard title="Types of Yokes">
            <p>
              <strong>Definition:</strong> A yoke is a wooden beam or frame that is
              placed across the necks or shoulders of draught animals to allow them
              to pull a load. There are several types of yokes used in Zimbabwe.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Neck yoke:</strong>
                <br />
                <strong>Description:</strong> A wooden beam that is placed across the
                necks of two animals. It is held in place by straps or chains that
                go under the animals' necks.
                <br />
                <strong>Uses:</strong> Oxen, cattle.
                <br />
                <strong>Advantages:</strong> Simple to make and use, comfortable for
                animals (when fitted well).
                <br />
                <strong>Disadvantages:</strong> Can slip or move if not fitted properly.
                <br />
                <strong>Parts:</strong> Yoke beam, neck straps (or chains), pegs or
                pins to hold the straps.
              </li>
              <li>
                <strong>Shoulder yoke:</strong>
                <br />
                <strong>Description:</strong> A yoke that fits across the shoulders
                of the animal, rather than the neck. It is often used for donkeys
                and horses.
                <br />
                <strong>Uses:</strong> Donkeys, horses.
                <br />
                <strong>Advantages:</strong> More comfortable for animals that are
                not suited to neck yokes.
                <br />
                <strong>Disadvantages:</strong> More complex to make.
              </li>
              <li>
                <strong>Single yoke (Shaft yoke):</strong>
                <br />
                <strong>Description:</strong> A yoke designed for a single animal
                pulling a cart or implement. It often consists of two shafts that
                attach to the animal's harness.
                <br />
                <strong>Uses:</strong> Single ox, donkey, or horse pulling a cart.
                <br />
                <strong>Advantages:</strong> Allows the animal to move freely.
                <br />
                <strong>Disadvantages:</strong> Not suitable for heavy loads.
              </li>
              <li>
                <strong>Forecart yoke:</strong>
                <br />
                <strong>Description:</strong> A yoke attached to a forecart
                (a wheeled frame) that is pulled by animals and to which implements
                are attached.
                <br />
                <strong>Uses:</strong> Commercial farming, heavy work.
                <br />
                <strong>Advantages:</strong> Allows heavier implements to be pulled,
                more efficient.
              </li>
            </ul>

            <AgricultureImage
              fileName="yoke-types.png"
              alt="A 2D diagram showing types of yokes: neck yoke, shoulder yoke, single yoke, and forecart yoke"
              caption="Types of yokes used for harnessing draught animals."
            />
          </SubtopicCard>

          <SubtopicCard title="Parts of a Yoke">
            <p>
              <strong>Definition:</strong> A yoke consists of several parts that
              work together to attach the animal to the implement and ensure efficient
              pulling.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Yoke beam:</strong>
                <br />
                <strong>Description:</strong> The main wooden beam that goes across
                the necks or shoulders of the animals. It is the central part of the yoke.
                <br />
                <strong>Function:</strong> Transmits the pulling force from the animal
                to the implement.
              </li>
              <li>
                <strong>Neck straps (or chains):</strong>
                <br />
                <strong>Description:</strong> Straps or chains that go under the
                animals' necks to hold the yoke in place.
                <br />
                <strong>Function:</strong> Keeps the yoke securely on the animals'
                necks, preventing it from slipping.
              </li>
              <li>
                <strong>Pins or pegs:</strong>
                <br />
                <strong>Description:</strong> Wooden or metal pins used to secure the
                neck straps to the yoke beam.
                <br />
                <strong>Function:</strong> Holds the straps in place and allows for
                adjustment.
              </li>
              <li>
                <strong>Span (or spreader):</strong>
                <br />
                <strong>Description:</strong> A wooden or metal bar that keeps the
                two animals at the correct distance apart.
                <br />
                <strong>Function:</strong> Prevents the animals from bumping into
                each other and keeps them moving together.
              </li>
              <li>
                <strong>Hame (or harness):</strong>
                <br />
                <strong>Description:</strong> A metal or wooden frame that fits over
                the animal's neck and attaches to the yoke.
                <br />
                <strong>Function:</strong> Provides a secure attachment point for
                the yoke and traces.
              </li>
              <li>
                <strong>Traces (or chains):</strong>
                <br />
                <strong>Description:</strong> Straps or chains that connect the yoke
                or hames to the implement.
                <br />
                <strong>Function:</strong> Transmits the pulling force from the yoke
                to the plough, cart, or other implement.
              </li>
            </ul>

            <AgricultureImage
              fileName="yoke-parts.png"
              alt="A 2D diagram showing the parts of a yoke: yoke beam, neck straps, pins, span, hame, and traces"
              caption="Parts of a yoke and their functions."
            />
          </SubtopicCard>

          <SubtopicCard title="Characteristics of Wood Used for Yokes">
            <p>
              <strong>Definition:</strong> The wood used to make yokes must have
              specific characteristics to ensure the yoke is strong, durable, and
              comfortable for the animals.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Strength:</strong>
                <br />
                <strong>Requirement:</strong> The wood must be strong enough to
                withstand the pulling force of the animals without breaking or bending.
                <br />
                <strong>Examples:</strong> Hardwoods like teak, mahogany, and mopane
                are strong and durable.
              </li>
              <li>
                <strong>Durability:</strong>
                <br />
                <strong>Requirement:</strong> The wood must be resistant to weathering,
                rot, and insect attack, as yokes are used outdoors and exposed to
                the elements.
                <br />
                <strong>Examples:</strong> Teak, mopane, and mukwa are naturally
                durable and resistant to termites and rot.
              </li>
              <li>
                <strong>Workability:</strong>
                <br />
                <strong>Requirement:</strong> The wood should be easy to shape and
                carve using hand tools (adzes, chisels, knives) to create a smooth,
                comfortable yoke.
                <br />
                <strong>Examples:</strong> Wood that is not too hard or too brittle
                is easier to work with.
              </li>
              <li>
                <strong>Smoothness:</strong>
                <br />
                <strong>Requirement:</strong> The wood must be smooth and free from
                splinters, rough edges, or sharp corners that could injure the animals.
                <br />
                <strong>Examples:</strong> Well-seasoned wood that has been sanded
                or polished is smooth and comfortable.
              </li>
              <li>
                <strong>Lightness:</strong>
                <br />
                <strong>Requirement:</strong> The yoke should be light enough so that
                it does not add unnecessary weight, making it harder for the animals
                to pull.
                <br />
                <strong>Examples:</strong> Wood that is both strong and relatively
                light (e.g., teak) is ideal.
              </li>
              <li>
                <strong>Shock absorption:</strong>
                <br />
                <strong>Requirement:</strong> The wood should be able to absorb some
                shock and vibration from the implement, making the work more comfortable
                for the animals.
                <br />
                <strong>Examples:</strong> Hardwoods with some natural resilience
                (e.g., teak, mahogany) are good at absorbing shock.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Common Woods Used for Yokes in Zimbabwe</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Teak (Baikiaea plurijuga):</strong>
                <br />
                <strong>Characteristics:</strong> Very strong, durable, resistant to
                rot and termites. Smooth when finished.
                <br />
                <strong>Uses:</strong> Commonly used for yokes, handles, and tool shafts.
              </li>
              <li>
                <strong>Mopane (Colophospermum mopane):</strong>
                <br />
                <strong>Characteristics:</strong> Hard, strong, and durable. Very
                resistant to rot and insects.
                <br />
                <strong>Uses:</strong> Used for yokes, poles, and fuelwood.
              </li>
              <li>
                <strong>Mukwa (Pterocarpus angolensis):</strong>
                <br />
                <strong>Characteristics:</strong> Strong, durable, and resistant to
                rot. Has a smooth finish and is easy to work with.
                <br />
                <strong>Uses:</strong> Used for yokes, furniture, and carvings.
              </li>
              <li>
                <strong>Mahogany (Khaya anthotheca):</strong>
                <br />
                <strong>Characteristics:</strong> Strong, durable, and easy to work
                with. Resistant to rot.
                <br />
                <strong>Uses:</strong> Used for yokes, furniture, and high-quality woodwork.
              </li>
            </ul>

            <AgricultureImage
              fileName="yoke-wood-types.png"
              alt="A 2D diagram showing types of wood used for yokes: teak, mopane, mukwa, and mahogany with their characteristics"
              caption="Types of wood used for yokes and their characteristics."
            />
          </SubtopicCard>

          <SubtopicCard title="Yoke Maintenance">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Regular inspection:</strong> Check yokes for cracks, splinters,
                or damage. Repair or replace damaged yokes.
              </li>
              <li>
                <strong>Sanding and smoothing:</strong> Sand rough areas to prevent
                chafing and injury to animals.
              </li>
              <li>
                <strong>Treatment:</strong> Apply oil or grease to wood to prevent
                cracking and to keep it smooth.
              </li>
              <li>
                <strong>Storage:</strong> Store yokes in a dry place to prevent rot
                and insect damage.
              </li>
              <li>
                <strong>Proper fitting:</strong> Ensure yokes are correctly fitted
                to the animals to prevent discomfort and injury.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Harnessing Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Neck yoke:</strong> across necks of oxen</li>
            <li><strong>Shoulder yoke:</strong> across shoulders (donkeys, horses)</li>
            <li><strong>Yoke parts:</strong> beam, straps, pins, span, hame, traces</li>
            <li><strong>Wood:</strong> teak, mopane, mukwa, mahogany</li>
            <li><strong>Characteristics:</strong> strong, durable, smooth, light</li>
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
            Farm Structures and Machinery
          </h1>
          <p className="text-lg text-green-100 max-w-2xl leading-relaxed">
            Explore farm implements including tillage tools, fencing types and their
            purposes, and harnessing equipment used for draught animals in agriculture.
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
                  <strong className="text-white">Farm Implements:</strong> Five
                  tillage implements are mould board plough (primary), cultivator,
                  harrow, planter, and ridger (secondary). The mould board plough
                  has parts including mould board, share, frog, beam, handle, wheel,
                  depth regulator, and landside.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Fencing:</strong> Fences are used
                  for livestock management, crop protection, boundary demarcation,
                  security, and environmental management. Types include barbed wire
                  (cattle), diamond mesh (sheep, goats), electric (cattle/wildlife),
                  palisade (security), live fence (hedge), and game fence (wildlife).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Harnessing:</strong> Yokes are
                  used to attach draught animals to implements. Types include neck
                  yoke, shoulder yoke, single yoke, and forecart yoke. Parts include
                  yoke beam, neck straps, pins, span, hame, and traces. Wood used
                  must be strong, durable, smooth, and light (teak, mopane, mukwa,
                  mahogany).
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Farm Structures and Machinery topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-green-600">Soil Science</span>?</>
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
                alert('Proceed to Soil Science (next topic)');
              }
            }}
            className="px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Soil Science →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FarmStructuresAndMachinery;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/agriculture/
   Use a mix of 2D diagram style and realistic photographs.

   --- FARM IMPLEMENTS IMAGES (2D DIAGRAM AND REALISTIC) ---

   1. tillage-implements-overview.png
      A 2D diagram showing primary tillage (mould board plough, disc plough) and
      secondary tillage (harrow, cultivator, ridger, planter) implements.
      Use icons and labels for each implement.

   2. mould-board-plough-parts.png
      A 2D diagram showing the parts of a mould board plough:
      - Mould board (curved metal plate)
      - Share (point/cutting edge)
      - Frog (connector)
      - Beam (wooden or metal bar)
      - Handle
      - Wheel
      - Depth regulator
      - Landside
      Label each part with an arrow and brief description of function.

   3. cultivator-diagram.png
      A 2D diagram showing a cultivator with labelled parts:
      - Tines (teeth)
      - Frame
      - Wheels
      - Hitch
      Include brief descriptions of function.

   4. harrow-types.png
      A 2D diagram showing types of harrows:
      - Disc harrow (with concave discs)
      - Tine harrow (with metal teeth)
      - Chain harrow (with chains)
      Label each type and describe its use.

   5. planter-parts.png
      A 2D diagram showing the parts of a planter:
      - Seed hopper
      - Seed metering mechanism
      - Seed tubes
      - Furrow openers
      - Covering wheels
      - Press wheels
      - Frame and wheels
      Label each part and its function.

   6. ridger-diagram.png
      A 2D diagram showing a ridger with labelled parts:
      - Mould boards (wings)
      - Frame
      - Depth regulator
      - Wheels
      - Hitch
      Include a brief description of function.

   --- FENCING IMAGES (2D DIAGRAM AND REALISTIC) ---

   7. fencing-reasons.png
      A 2D diagram showing reasons for fencing:
      - Livestock management (containment, grazing, separation)
      - Crop protection (preventing damage, wildlife exclusion)
      - Boundary demarcation
      - Security (theft prevention, safety)
      - Environmental management (soil conservation, water protection)
      Use icons and brief explanations.

   8. fence-types.png
      A 2D diagram showing types of fences:
      - Barbed wire fence
      - Diamond mesh fence
      - Electric fence
      - Palisade fence
      - Live fence (hedge) with plants like Kei apple
      - Game fence
      Label each type and describe its uses.

   --- HARNESSING IMAGES (2D DIAGRAM AND REALISTIC) ---

   9. harnessing-overview.png
      A realistic photograph or 2D diagram showing an ox or donkey with a yoke
      pulling a plough or cart. Show the harness in action.

   10. yoke-types.png
       A 2D diagram showing types of yokes:
       - Neck yoke (across necks of oxen)
       - Shoulder yoke (across shoulders for donkeys/horses)
       - Single yoke (for one animal)
       - Forecart yoke (with wheeled frame)
       Label each type and describe its uses.

   11. yoke-parts.png
       A 2D diagram showing the parts of a yoke:
       - Yoke beam
       - Neck straps (or chains)
       - Pins or pegs
       - Span (spreader)
       - Hame (or harness)
       - Traces (or chains)
       Label each part and describe its function.

   12. yoke-wood-types.png
       A 2D diagram showing types of wood used for yokes:
       - Teak (strong, durable)
       - Mopane (hard, strong)
       - Mukwa (strong, smooth)
       - Mahogany (strong, easy to work)
       Include characteristics for each type.

   ============================================================ */