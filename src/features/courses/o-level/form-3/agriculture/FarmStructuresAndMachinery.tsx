import { AgricultureLessonImage as AgricultureImage } from '../../../common/AgricultureLessonImage';
import React, { useState, useRef } from 'react';

/**
 * Topic: Farm Structures and Machinery – Full component with sticky navigation,
 * container cards (9px border-radius), lesson illustrations,
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
      id: 'farm-implements-maintenance',
      title: 'Farm Implements – Routine Maintenance',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Importance of Routine Maintenance">
            <p>
              <strong>Definition:</strong> Routine maintenance is the regular care
              and servicing of farm implements to keep them in good working condition.
              Proper maintenance extends the life of implements, ensures efficient
              operation, and reduces the risk of breakdowns.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Benefits of routine maintenance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Extends implement life:</strong> Regular maintenance
                    prevents wear and tear, prolonging the useful life of the implement.
                  </li>
                  <li>
                    <strong>Improves efficiency:</strong> Well-maintained implements
                    work better, requiring less effort from the farmer or animals.
                  </li>
                  <li>
                    <strong>Reduces breakdowns:</strong> Preventive maintenance
                    catches problems early, reducing unexpected breakdowns during
                    critical farming periods.
                  </li>
                  <li>
                    <strong>Saves costs:</strong> Maintenance is cheaper than major
                    repairs or replacement.
                  </li>
                  <li>
                    <strong>Improves safety:</strong> Well-maintained implements are
                    safer to operate, reducing the risk of accidents.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="implement-maintenance-importance.webp"
              alt="A 2D diagram showing the importance of routine implement maintenance: extends life, improves efficiency, reduces breakdowns, saves costs, improves safety"
              caption="Importance of routine maintenance for farm implements."
            />
          </SubtopicCard>

          <SubtopicCard title="Routine Maintenance of Mould Board Plough">
            <p>
              <strong>Definition:</strong> The mould board plough is a primary
              tillage implement. Regular maintenance ensures it continues to work
              effectively and efficiently.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Daily Maintenance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Clean the plough:</strong> Remove soil, mud, and plant debris
                from the plough body, share, mould board, and wheel.
              </li>
              <li>
                <strong>Check for damage:</strong> Inspect the share, mould board,
                frog, and beam for cracks, bends, or excessive wear.
              </li>
              <li>
                <strong>Check bolts and nuts:</strong> Tighten any loose bolts or nuts
                on the plough (share, mould board, wheel, depth regulator).
              </li>
              <li>
                <strong>Lubricate moving parts:</strong> Apply oil or grease to
                moving parts (wheels, depth regulator, and hitching mechanism).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Periodic Maintenance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Sharpen the share:</strong> A sharp share cuts through soil
                more easily, reducing draft power. Sharpen the share using a file
                or grinder.
              </li>
              <li>
                <strong>Check and adjust depth regulator:</strong> Ensure the depth
                regulator is working correctly and adjusts the plough depth as needed.
              </li>
              <li>
                <strong>Inspect and replace worn parts:</strong> Replace the share,
                mould board, or landside if they are worn out or damaged.
              </li>
              <li>
                <strong>Check the wheel:</strong> Ensure the wheel is properly
                inflated (if pneumatic) and rotates freely.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Seasonal Maintenance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Paint the plough:</strong> Repaint the plough to prevent rust
                and corrosion, especially on the beam and wheel.
              </li>
              <li>
                <strong>Store properly:</strong> Store the plough in a dry, covered
                place to protect it from moisture and weather damage.
              </li>
              <li>
                <strong>Complete overhaul:</strong> At the end of the season, inspect
                all parts, replace worn components, and prepare the plough for the
                next season.
              </li>
            </ul>

            <AgricultureImage
              fileName="plough-maintenance.webp"
              alt="A 2D diagram showing routine maintenance of a mould board plough: daily cleaning, bolt tightening, lubrication, and periodic sharpening and adjustments"
              caption="Routine maintenance of a mould board plough: daily, periodic, and seasonal tasks."
            />
          </SubtopicCard>

          <SubtopicCard title="Routine Maintenance of Cultivator">
            <p>
              <strong>Definition:</strong> A cultivator is a secondary tillage
              implement used to break up soil clods and remove weeds. Regular
              maintenance keeps it in good working order.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Daily Maintenance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Clean the cultivator:</strong> Remove soil, mud, and plant
                debris from the tines, frame, and wheels.
              </li>
              <li>
                <strong>Check for damage:</strong> Inspect the tines (teeth) for
                bends, breaks, or excessive wear.
              </li>
              <li>
                <strong>Check bolts and nuts:</strong> Tighten any loose bolts or
                nuts on the cultivator (tines, frame, wheels, depth regulator).
              </li>
              <li>
                <strong>Lubricate moving parts:</strong> Apply oil or grease to
                moving parts (wheels, depth regulator).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Periodic Maintenance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Sharpen tines:</strong> Sharpen tines that have become blunt
                to improve soil penetration.
              </li>
              <li>
                <strong>Check and adjust depth regulator:</strong> Ensure the depth
                regulator is working correctly and adjusts the cultivation depth as needed.
              </li>
              <li>
                <strong>Replace worn tines:</strong> Replace tines that are bent,
                broken, or excessively worn.
              </li>
              <li>
                <strong>Check wheels:</strong> Ensure wheels are properly inflated
                (if pneumatic) and rotate freely.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Seasonal Maintenance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Paint the cultivator:</strong> Repaint the frame and other
                metal parts to prevent rust.
              </li>
              <li>
                <strong>Store properly:</strong> Store the cultivator in a dry,
                covered place.
              </li>
            </ul>

            <AgricultureImage
              fileName="cultivator-maintenance.webp"
              alt="A 2D diagram showing routine maintenance of a cultivator: daily cleaning, bolt tightening, lubrication, and periodic tine sharpening and replacement"
              caption="Routine maintenance of a cultivator."
            />
          </SubtopicCard>

          <SubtopicCard title="Routine Maintenance of Harrow">
            <p>
              <strong>Definition:</strong> A harrow is a secondary tillage implement
              used to break up soil clods, level the soil, and remove weeds. Regular
              maintenance ensures effective operation.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Daily Maintenance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Clean the harrow:</strong> Remove soil, mud, and plant debris
                from the discs, tines, or chains.
              </li>
              <li>
                <strong>Check for damage:</strong> Inspect the discs (disc harrow),
                tines (tine harrow), or chains (chain harrow) for damage or wear.
              </li>
              <li>
                <strong>Check bolts and nuts:</strong> Tighten any loose bolts or nuts.
              </li>
              <li>
                <strong>Lubricate moving parts:</strong> Apply oil or grease to
                moving parts (bearings, wheels).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Periodic Maintenance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Sharpen or replace discs/tines:</strong> Sharpen discs or
                tines that have become blunt. Replace worn or damaged parts.
              </li>
              <li>
                <strong>Check and adjust depth:</strong> Adjust the depth regulator
                to ensure correct working depth.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Seasonal Maintenance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Paint the harrow:</strong> Repaint to prevent rust.
              </li>
              <li>
                <strong>Store properly:</strong> Store in a dry, covered place.
              </li>
            </ul>

            <AgricultureImage
              fileName="harrow-maintenance.webp"
              alt="A 2D diagram showing routine maintenance of a harrow: daily cleaning, bolt tightening, lubrication, and periodic disc/tine maintenance"
              caption="Routine maintenance of a harrow."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Routine maintenance:</strong> regular care and servicing</li>
            <li><strong>Daily maintenance:</strong> cleaning, checking, lubricating</li>
            <li><strong>Periodic maintenance:</strong> sharpening, adjusting, replacing parts</li>
            <li><strong>Seasonal maintenance:</strong> painting, overhauling, storing</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'fencing',
      title: 'Fencing',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Treatment of Wooden Fencing Materials">
            <p>
              <strong>Definition:</strong> Wooden fencing materials (posts, poles)
              need to be treated to protect them from rot, termites, and weather damage.
              Treatment extends the life of wooden posts and reduces replacement costs.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Treatment methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Painting:</strong> Applying paint to the surface of
                    wooden posts.
                    <br />
                    <strong>Advantages:</strong> Easy to apply, cheap.
                    <br />
                    <strong>Disadvantages:</strong> Only surface protection, needs
                    regular reapplication.
                  </li>
                  <li>
                    <strong>Creosote treatment:</strong> Applying creosote (a tar-based
                    preservative) to wooden posts.
                    <br />
                    <strong>Advantages:</strong> Effective against rot and termites.
                    <br />
                    <strong>Disadvantages:</strong> Toxic, can harm the environment
                    and skin.
                  </li>
                  <li>
                    <strong>Pressure treatment:</strong> Wood is placed in a pressure
                    chamber and preservative chemicals (e.g., CCA – Copper Chromium
                    Arsenate) are forced into the wood.
                    <br />
                    <strong>Advantages:</strong> Deep penetration, long-lasting
                    protection.
                    <br />
                    <strong>Disadvantages:</strong> Expensive, requires specialised
                    equipment.
                  </li>
                  <li>
                    <strong>Burning (charring):</strong> The surface of the wood is
                    charred (burned) to create a protective carbon layer.
                    <br />
                    <strong>Advantages:</strong> Simple, traditional method, effective
                    against rot and insects.
                    <br />
                    <strong>Disadvantages:</strong> Only surface protection.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="wooden-post-treatment.webp"
              alt="A 2D diagram showing methods of treating wooden fencing materials: painting, creosote, pressure treatment, and burning"
              caption="Treatment methods for wooden fencing materials."
            />
          </SubtopicCard>

          <SubtopicCard title="Treatment of Metal Fencing Materials">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Galvanising:</strong>
                <br />
                <strong>Definition:</strong> Coating metal (steel) with a layer of
                zinc to prevent rust.
                <br />
                <strong>Advantages:</strong> Long-lasting protection, resistant to
                rust and corrosion.
                <br />
                <strong>Disadvantages:</strong> Expensive, can be damaged by scratching.
                <br />
                <strong>Uses:</strong> Fence wire, posts, and fittings.
              </li>
              <li>
                <strong>Painting:</strong>
                <br />
                <strong>Definition:</strong> Applying paint to metal surfaces to
                prevent rust.
                <br />
                <strong>Advantages:</strong> Easy to apply, can be used on existing
                structures.
                <br />
                <strong>Disadvantages:</strong> Needs regular reapplication, can be
                damaged by scratching.
              </li>
              <li>
                <strong>Powder coating:</strong>
                <br />
                <strong>Definition:</strong> Applying a dry powder to metal and then
                heating to form a protective layer.
                <br />
                <strong>Advantages:</strong> Durable, resistant to chipping and scratching.
                <br />
                <strong>Disadvantages:</strong> Expensive, requires specialised equipment.
              </li>
            </ul>

            <AgricultureImage
              fileName="metal-post-treatment.webp"
              alt="A 2D diagram showing treatment methods for metal fencing materials: galvanising, painting, and powder coating"
              caption="Treatment methods for metal fencing materials."
            />
          </SubtopicCard>

          <SubtopicCard title="Fencing Specifications">
            <p>
              <strong>Definition:</strong> Fencing specifications refer to the
              standards for pole spacing, strand spacing, and other characteristics
              of a fence. Proper specifications ensure the fence is effective and durable.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Pole Spacing</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The distance between fence posts.
              </li>
              <li>
                <strong>General guidelines:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Corner posts:</strong> Strong, large posts at corners
                    and gates. Spacing: 1 per corner.
                  </li>
                  <li>
                    <strong>Strainer posts:</strong> Strong posts placed at intervals
                    to tension the wire. Spacing: every 100-200m.
                  </li>
                  <li>
                    <strong>Intermediate posts:</strong> Smaller posts between
                    strainer posts. Spacing: 3-5m apart.
                  </li>
                  <li>
                    <strong>Droppers:</strong> Small posts placed between intermediate
                    posts to support the wire. Spacing: 1-2m apart.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Strand Spacing</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The distance between each strand of wire
                on the fence.
              </li>
              <li>
                <strong>Guidelines by animal type:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Cattle:</strong> 4-6 strands of barbed wire. Spacing:
                    20-30cm between strands. Bottom strand 30-40cm from the ground.
                  </li>
                  <li>
                    <strong>Sheep and goats:</strong> Diamond mesh or 6-8 strands
                    of wire. Spacing: 15-20cm between strands. Bottom strand 10-15cm
                    from the ground.
                  </li>
                  <li>
                    <strong>Poultry:</strong> Diamond mesh (1-inch or 2-inch mesh).
                    Height: 1-1.5m.
                  </li>
                  <li>
                    <strong>Wildlife (game fence):</strong> 2.4-3m high. Heavy wire
                    with close spacing (10-15cm).
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example Specifications</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Fence Type</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Pole Spacing</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Strand Spacing</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Height</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Cattle fence</td>
                  <td className="border border-slate-300 px-4 py-2">3-5m (posts), 1-2m (droppers)</td>
                  <td className="border border-slate-300 px-4 py-2">20-30cm</td>
                  <td className="border border-slate-300 px-4 py-2">1.2-1.5m</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Sheep/goat fence</td>
                  <td className="border border-slate-300 px-4 py-2">3-4m (posts), 1-2m (droppers)</td>
                  <td className="border border-slate-300 px-4 py-2">15-20cm</td>
                  <td className="border border-slate-300 px-4 py-2">1-1.2m</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Poultry fence</td>
                  <td className="border border-slate-300 px-4 py-2">3-4m (posts)</td>
                  <td className="border border-slate-300 px-4 py-2">Diamond mesh (2.5-5cm)</td>
                  <td className="border border-slate-300 px-4 py-2">1-1.5m</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Game fence</td>
                  <td className="border border-slate-300 px-4 py-2">3-5m (posts)</td>
                  <td className="border border-slate-300 px-4 py-2">10-15cm</td>
                  <td className="border border-slate-300 px-4 py-2">2.4-3m</td>
                </tr>
              </tbody>
            </table>

            <AgricultureImage
              fileName="fencing-specifications.webp"
              alt="A 2D diagram showing fencing specifications: pole spacing and strand spacing for cattle, sheep/goat, poultry, and game fences"
              caption="Fencing specifications: pole spacing and strand spacing for different types of fences."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Fencing Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Wood treatment:</strong> painting, creosote, pressure treatment, burning</li>
            <li><strong>Metal treatment:</strong> galvanising, painting, powder coating</li>
            <li><strong>Pole spacing:</strong> corner, strainer, intermediate, droppers</li>
            <li><strong>Strand spacing:</strong> cattle (20-30cm), sheep/goats (15-20cm)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'farm-buildings',
      title: 'Farm Buildings',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Materials Used for Farm Building Construction">
            <p>
              <strong>Definition:</strong> Farm buildings are structures used for
              housing animals, storing produce and equipment, and sheltering workers.
              The choice of construction materials depends on the purpose, cost,
              and availability of materials.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Wood:</strong>
                <br />
                <strong>Uses:</strong> Frames, roofs, walls, and fencing.
                <br />
                <strong>Advantages:</strong> Readily available, easy to work with,
                renewable resource.
                <br />
                <strong>Disadvantages:</strong> Can rot, vulnerable to termites and
                fire, needs treatment.
              </li>
              <li>
                <strong>Metal (steel, iron, aluminium):</strong>
                <br />
                <strong>Uses:</strong> Roofing sheets, frames, water tanks, and
                structural supports.
                <br />
                <strong>Advantages:</strong> Strong, durable, fire-resistant.
                <br />
                <strong>Disadvantages:</strong> Expensive, can rust (needs galvanising
                or painting), conducts heat.
              </li>
              <li>
                <strong>Concrete:</strong>
                <br />
                <strong>Uses:</strong> Floor slabs, foundations, walls, water troughs,
                and silos.
                <br />
                <strong>Advantages:</strong> Strong, durable, fire-resistant.
                <br />
                <strong>Disadvantages:</strong> Heavy, expensive, requires skilled labour.
              </li>
              <li>
                <strong>Brick/Stone:</strong>
                <br />
                <strong>Uses:</strong> Walls for animal housing, stores, and houses.
                <br />
                <strong>Advantages:</strong> Strong, durable, fire-resistant, good
                insulation (keeps buildings cool in summer, warm in winter).
                <br />
                <strong>Disadvantages:</strong> Expensive, labour-intensive, slow to build.
              </li>
              <li>
                <strong>Thatch:</strong>
                <br />
                <strong>Uses:</strong> Roofs for traditional buildings.
                <br />
                <strong>Advantages:</strong> Cheap, good insulation, environmentally friendly.
                <br />
                <strong>Disadvantages:</strong> Fire risk, short lifespan (needs
                regular replacement), harbours pests.
              </li>
              <li>
                <strong>Plastic/PVC:</strong>
                <br />
                <strong>Uses:</strong> Pipes, water troughs, silage covers, and
                greenhouse covers.
                <br />
                <strong>Advantages:</strong> Lightweight, durable, resistant to rot
                and corrosion.
                <br />
                <strong>Disadvantages:</strong> Can be damaged by sunlight (UV),
                not as strong as metal or concrete.
              </li>
            </ul>

            <AgricultureImage
              fileName="building-materials.webp"
              alt="A 2D diagram showing materials used for farm building construction: wood, metal, concrete, brick, thatch, and plastic"
              caption="Materials used for farm building construction."
            />
          </SubtopicCard>

          <SubtopicCard title="Properties of Building Materials">
            <p>
              <strong>Definition:</strong> The properties of building materials
              determine their suitability for different farm building applications.
              Key properties include quality, durability, strength, and resistance
              to fire, termites, and temperature.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Quality</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The standard of the material (fitness
                for purpose).
              </li>
              <li>
                <strong>Factors:</strong> Good quality materials are made to high
                standards, with consistent properties.
              </li>
              <li>
                <strong>Examples:</strong> High-quality timber is straight, free
                from knots and splits. High-quality concrete has the correct mix
                ratios and is properly cured.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Durability</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The ability of a material to resist
                wear, decay, and weathering over time.
              </li>
              <li>
                <strong>Factors:</strong> Durability depends on the material's
                composition and treatment.
              </li>
              <li>
                <strong>Examples:</strong> Treated timber, galvanised metal, and
                concrete are durable. Untreated timber and thatch are less durable.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Strength</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The ability of a material to withstand
                loads (weight, pressure, wind) without breaking or deforming.
              </li>
              <li>
                <strong>Factors:</strong> Strength depends on the material's structure
                and design.
              </li>
              <li>
                <strong>Examples:</strong> Steel and concrete are strong (load-bearing).
                Wood has good strength for its weight. Plastic is less strong.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Fire Resistance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The ability of a material to resist
                ignition and slow the spread of fire.
              </li>
              <li>
                <strong>Factors:</strong> Non-combustible materials (metal, concrete,
                brick) are fire-resistant. Combustible materials (wood, thatch)
                are not.
              </li>
              <li>
                <strong>Examples:</strong> Metal, concrete, and brick are fire-resistant.
                Wood and thatch are fire hazards.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Termite Resistance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The ability of a material to resist
                termite attack.
              </li>
              <li>
                <strong>Factors:</strong> Some materials (treated wood, metal,
                concrete, brick) are resistant to termites. Untreated wood is vulnerable.
              </li>
              <li>
                <strong>Examples:</strong> Treated timber, metal, concrete, and
                brick are termite-resistant.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Temperature Resistance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The ability of a material to insulate
                against heat and cold.
              </li>
              <li>
                <strong>Factors:</strong> Materials with good insulation properties
                (wood, brick, thatch) help keep buildings cool in summer and warm
                in winter. Metal conducts heat (gets hot in summer, cold in winter).
              </li>
              <li>
                <strong>Examples:</strong> Brick, wood, and thatch provide good
                temperature insulation. Metal is a poor insulator.
              </li>
            </ul>

            <AgricultureImage
              fileName="building-material-properties.webp"
              alt="A 2D diagram showing the properties of building materials: quality, durability, strength, fire resistance, termite resistance, and temperature resistance"
              caption="Properties of farm building materials: quality, durability, strength, fire resistance, termite resistance, and temperature resistance."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Building Materials</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Wood:</strong> available, easy, but rots and burns</li>
            <li><strong>Metal:</strong> strong, durable, but expensive, conducts heat</li>
            <li><strong>Concrete:</strong> strong, fire-resistant, but heavy</li>
            <li><strong>Brick:</strong> durable, good insulation, but labour-intensive</li>
            <li><strong>Thatch:</strong> cheap, good insulation, but fire risk</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'farm-roads',
      title: 'Farm Roads',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Features of a Farm Road">
            <p>
              <strong>Definition:</strong> A farm road is a road built on a farm
              to provide access to fields, buildings, and other facilities. It must
              be designed and constructed to meet the needs of the farm.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Good drainage:</strong>
                <br />
                <strong>Definition:</strong> The road should have a camber (slope)
                to allow water to drain off the surface. Ditches or culverts should
                be provided to carry water away.
                <br />
                <strong>Importance:</strong> Prevents waterlogging and damage to
                the road surface.
              </li>
              <li>
                <strong>Stable surface:</strong>
                <br />
                <strong>Definition:</strong> The road surface should be firm and
                stable, able to support vehicles without rutting (deep tracks).
                <br />
                <strong>Materials:</strong> Gravel, crushed stone, or compacted soil.
              </li>
              <li>
                <strong>Adequate camber:</strong>
                <br />
                <strong>Definition:</strong> The road should have a slight slope
                (camber) from the centre to the edges to allow water to drain off.
                <br />
                <strong>Typical camber:</strong> 2-4% slope.
              </li>
              <li>
                <strong>Adequate width:</strong>
                <br />
                <strong>Definition:</strong> The road should be wide enough for
                vehicles to pass each other and for turning.
                <br />
                <strong>Typical width:</strong> 3-5m for single lane, 5-7m for
                two-lane roads.
              </li>
              <li>
                <strong>Gentle curves and slopes:</strong>
                <br />
                <strong>Definition:</strong> The road should follow the contour of
                the land with gentle curves and slopes.
                <br />
                <strong>Importance:</strong> Makes the road safe and easy to use.
              </li>
              <li>
                <strong>Durable:</strong>
                <br />
                <strong>Definition:</strong> The road should be constructed with
                durable materials (gravel, stone) and built to last.
              </li>
            </ul>

            <AgricultureImage
              fileName="farm-road-features.webp"
              alt="A 2D diagram showing features of a farm road: drainage, stable surface, camber, width, gentle curves, and durability"
              caption="Features of a well-constructed farm road."
            />
          </SubtopicCard>

          <SubtopicCard title="Dimensions of Farm Road Features">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Typical Dimensions</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Feature</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Dimension</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Road width (single lane)</td>
                  <td className="border border-slate-300 px-4 py-2">3-4 metres</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Road width (two lane)</td>
                  <td className="border border-slate-300 px-4 py-2">5-7 metres</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Camber (slope)</td>
                  <td className="border border-slate-300 px-4 py-2">2-4% (20-40cm per 10m)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Ditch width</td>
                  <td className="border border-slate-300 px-4 py-2">0.5-1 metre</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Ditch depth</td>
                  <td className="border border-slate-300 px-4 py-2">0.3-0.5 metre</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Gravel/stone layer thickness</td>
                  <td className="border border-slate-300 px-4 py-2">10-15 cm</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Base layer thickness (compacted)</td>
                  <td className="border border-slate-300 px-4 py-2">20-30 cm</td>
                </tr>
              </tbody>
            </table>

            <AgricultureImage
              fileName="farm-road-dimensions.webp"
              alt="A 2D diagram showing typical dimensions of farm road features: width, camber, ditches, and gravel layer"
              caption="Dimensions of farm road features."
            />
          </SubtopicCard>

          <SubtopicCard title="Repairing a Farm Road">
            <p>
              <strong>Definition:</strong> Farm roads require regular maintenance
              and repair to keep them in good condition. Repairing a farm road
              involves addressing damage caused by weather, vehicles, and erosion.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Grading (re-shaping):</strong>
                <br />
                <strong>Definition:</strong> Using a grader or tractor-drawn blade
                to re-shape the road surface, restoring the camber and removing ruts.
                <br />
                <strong>When:</strong> When the road surface becomes uneven, rutted,
                or waterlogged.
              </li>
              <li>
                <strong>Filling potholes:</strong>
                <br />
                <strong>Definition:</strong> Filling holes in the road surface with
                gravel, crushed stone, or compacted soil.
                <br />
                <strong>Method:</strong> Remove loose material, fill the hole with
                gravel, compact, and add a final layer.
              </li>
              <li>
                <strong>Cleaning ditches:</strong>
                <br />
                <strong>Definition:</strong> Removing silt, debris, and vegetation
                from ditches to ensure they drain properly.
                <br />
                <strong>Method:</strong> Use a shovel, spade, or excavator to clear
                the ditches.
              </li>
              <li>
                <strong>Repairing culverts:</strong>
                <br />
                <strong>Definition:</strong> Fixing damaged or blocked culverts
                (pipes or channels under the road) that allow water to flow.
                <br />
                <strong>Method:</strong> Clear blockages, repair broken pipes, or
                replace damaged culverts.
              </li>
              <li>
                <strong>Adding gravel/stone:</strong>
                <br />
                <strong>Definition:</strong> Adding new gravel or crushed stone to
                the road surface to maintain thickness and stability.
                <br />
                <strong>Method:</strong> Spread gravel evenly and compact with a
                roller or by traffic.
              </li>
            </ul>

            <AgricultureImage
              fileName="farm-road-repair.webp"
              alt="A 2D diagram showing methods of repairing a farm road: grading, filling potholes, cleaning ditches, repairing culverts, and adding gravel"
              caption="Methods of repairing a farm road."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Farm Roads Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Features:</strong> drainage, stable surface, camber, width</li>
            <li><strong>Dimensions:</strong> width 3-7m, camber 2-4%, gravel 10-15cm</li>
            <li><strong>Repair:</strong> grading, potholes, ditches, culverts</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'appropriate-technology',
      title: 'Appropriate Technology – Irrigation Pumps',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Parts of Hand and Power-Operated Irrigation Pumps">
            <p>
              <strong>Definition:</strong> Irrigation pumps are machines used to
              move water from a source (river, dam, borehole) to the field for
              irrigation. They can be hand-operated (manual) or power-operated
              (motorised).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Hand-Operated Pumps (e.g., Treadle Pump)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Cylinder:</strong> A tube or cylinder where water is drawn
                and pushed. Contains a piston or plunger.
              </li>
              <li>
                <strong>Plunger (or piston):</strong> A disc that moves up and down
                inside the cylinder to draw water (suction stroke) and push water
                (delivery stroke).
              </li>
              <li>
                <strong>Foot valves:</strong> One-way valves at the bottom of the
                cylinder that allow water to enter but not to flow back.
              </li>
              <li>
                <strong>Delivery valve:</strong> A one-way valve at the top of the
                cylinder that allows water to exit but not to flow back.
              </li>
              <li>
                <strong>Handle (lever):</strong> A lever attached to the plunger
                that the operator moves up and down to operate the pump.
              </li>
              <li>
                <strong>Suction pipe:</strong> A pipe that connects the pump to the
                water source (river, dam). It has a strainer to prevent debris
                from entering the pump.
              </li>
              <li>
                <strong>Delivery pipe:</strong> A pipe that carries water from the
                pump to the field or storage tank.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Power-Operated Pumps (e.g., Motorised Centrifugal Pump)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Motor (engine):</strong> Provides the power to drive the
                pump. Can be electric, diesel, or petrol.
              </li>
              <li>
                <strong>Impeller:</strong> A rotating disc with vanes that spins to
                create centrifugal force, drawing water in and pushing it out.
              </li>
              <li>
                <strong>Casing (housing):</strong> A cover that surrounds the impeller
                and contains the water. It directs the flow of water.
              </li>
              <li>
                <strong>Suction pipe:</strong> A pipe with a strainer that draws
                water from the source.
              </li>
              <li>
                <strong>Delivery pipe:</strong> A pipe that carries water to the field.
              </li>
              <li>
                <strong>Priming plug:</strong> A plug used to fill the pump with
                water before starting (priming is necessary for centrifugal pumps).
              </li>
            </ul>

            <AgricultureImage
              fileName="irrigation-pump-parts.webp"
              alt="A 2D diagram showing the parts of hand-operated (treadle pump) and power-operated (centrifugal pump) irrigation pumps"
              caption="Parts of hand and power-operated irrigation pumps."
            />
          </SubtopicCard>

          <SubtopicCard title="Working Principles of Irrigation Pumps">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Hand-Operated Treadle Pump</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Principle:</strong> Operated by foot (treadling), using a
                lever system to move a plunger up and down.
              </li>
              <li>
                <strong>Suction stroke:</strong> The plunger moves up, creating a
                vacuum that draws water through the foot valve into the cylinder.
              </li>
              <li>
                <strong>Delivery stroke:</strong> The plunger moves down, forcing
                water out through the delivery valve and into the delivery pipe.
              </li>
              <li>
                <strong>Advantages:</strong> Cheap, easy to operate, suitable for
                small-scale irrigation.
              </li>
              <li>
                <strong>Disadvantages:</strong> Limited flow rate, requires human
                effort, only suitable for shallow water sources (less than 7m deep).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Power-Operated Centrifugal Pump</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Principle:</strong> Uses a motor to spin an impeller,
                creating centrifugal force that draws water in and pushes it out.
              </li>
              <li>
                <strong>Priming:</strong> The pump must be filled with water before
                starting (priming) to remove air from the casing.
              </li>
              <li>
                <strong>Suction:</strong> The impeller spins, creating a vacuum at
                the centre, drawing water into the casing.
              </li>
              <li>
                <strong>Delivery:</strong> Centrifugal force pushes water out of the
                casing through the delivery pipe.
              </li>
              <li>
                <strong>Advantages:</strong> High flow rate, can lift water from
                deeper sources (up to 7-8m suction lift), can be used for large areas.
              </li>
              <li>
                <strong>Disadvantages:</strong> Requires fuel or electricity, more
                expensive, needs maintenance.
              </li>
            </ul>

            <AgricultureImage
              fileName="pump-working-principles.webp"
              alt="A 2D diagram showing the working principles of a treadle pump (suction and delivery strokes) and a centrifugal pump (priming, suction, delivery)"
              caption="Working principles of hand-operated and power-operated irrigation pumps."
            />
          </SubtopicCard>

          <SubtopicCard title="Routine Maintenance of Irrigation Pumps">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Hand-Operated Treadle Pump</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Daily maintenance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Check for leaks at joints and valves.</li>
                  <li>Lubricate moving parts (handle pivot, plunger mechanism) with oil.</li>
                  <li>Clean the foot valve and strainer to prevent blockages.</li>
                  <li>Check the handle and lever for damage.</li>
                </ul>
              </li>
              <li>
                <strong>Periodic maintenance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Replace worn washers and seals.</li>
                  <li>Replace damaged foot valves or delivery valves.</li>
                  <li>Check and tighten bolts and nuts.</li>
                  <li>Paint metal parts to prevent rust.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Power-Operated Centrifugal Pump</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Daily maintenance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Check oil level (engine) and fuel level.</li>
                  <li>Check for leaks (water and oil).</li>
                  <li>Clean the strainer on the suction pipe.</li>
                  <li>Check the impeller and casing for wear or damage.</li>
                  <li>Check the priming plug and ensure pump is properly primed.</li>
                </ul>
              </li>
              <li>
                <strong>Periodic maintenance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Change engine oil and oil filter (as per manufacturer's schedule).</li>
                  <li>Check and replace spark plug (petrol engine).</li>
                  <li>Replace worn impeller or casing.</li>
                  <li>Check and replace seals and gaskets.</li>
                  <li>Clean the fuel system (petrol/diesel).</li>
                </ul>
              </li>
              <li>
                <strong>Seasonal maintenance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Drain fuel from engine before storage.</li>
                  <li>Clean and store the pump in a dry place.</li>
                  <li>Cover the pump to protect from dust and moisture.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="pump-maintenance.webp"
              alt="A 2D diagram showing routine maintenance of hand-operated and power-operated irrigation pumps: daily checks, periodic servicing, and seasonal storage"
              caption="Routine maintenance of irrigation pumps."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Irrigation Pumps</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Hand pump (treadle):</strong> cylinder, plunger, valves, lever</li>
            <li><strong>Power pump (centrifugal):</strong> motor, impeller, casing, pipes</li>
            <li><strong>Working principles:</strong> suction and delivery strokes (treadle); impeller centrifugal force (centrifugal)</li>
            <li><strong>Maintenance:</strong> daily checks, lubrication, replacing worn parts</li>
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
            Explore farm implement maintenance, fencing treatment and specifications,
            farm building materials and properties, farm road features and repair,
            and appropriate technology for irrigation pumps.
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
                  <strong className="text-white">Farm Implement Maintenance:</strong>
                  Daily, periodic, and seasonal maintenance of ploughs, cultivators,
                  and harrows includes cleaning, lubrication, tightening bolts,
                  sharpening shares/tines, and painting to prevent rust.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Fencing:</strong> Wooden posts are
                  treated with painting, creosote, pressure treatment, or burning.
                  Metal is treated with galvanising, painting, or powder coating.
                  Pole spacing: corners, strainers (100-200m), intermediates (3-5m),
                  droppers (1-2m). Strand spacing varies by animal.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farm Buildings:</strong> Materials
                  include wood, metal, concrete, brick, thatch, and plastic.
                  Properties: quality, durability, strength, fire resistance,
                  termite resistance, and temperature resistance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farm Roads:</strong> Features
                  include drainage, stable surface, camber, adequate width, and
                  gentle curves. Dimensions: width 3-7m, camber 2-4%. Repair methods:
                  grading, filling potholes, cleaning ditches, repairing culverts,
                  and adding gravel.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Irrigation Pumps:</strong> Hand
                  pumps (treadle) have cylinder, plunger, valves, and handle.
                  Power pumps (centrifugal) have motor, impeller, and casing.
                  Maintenance includes daily checks, lubrication, replacing worn
                  parts, and seasonal storage.
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

   --- FARM IMPLEMENT MAINTENANCE IMAGES (2D DIAGRAM STYLE) ---

   1. implement-maintenance-importance.png
      A 2D diagram showing the importance of routine implement maintenance:
      extends life, improves efficiency, reduces breakdowns, saves costs,
      improves safety.

   2. plough-maintenance.png
      A 2D diagram showing routine maintenance of a mould board plough:
      - Daily: cleaning, bolt tightening, lubrication
      - Periodic: sharpening share, adjusting depth regulator, replacing parts
      - Seasonal: painting, storing, overhauling

   3. cultivator-maintenance.png
      A 2D diagram showing routine maintenance of a cultivator:
      - Daily: cleaning, bolt tightening, lubrication
      - Periodic: sharpening tines, adjusting depth, replacing tines

   4. harrow-maintenance.png
      A 2D diagram showing routine maintenance of a harrow:
      - Daily: cleaning, bolt tightening, lubrication
      - Periodic: sharpening discs/tines, adjusting depth

   --- FENCING IMAGES (2D DIAGRAM STYLE) ---

   5. wooden-post-treatment.png
      A 2D diagram showing treatment methods for wooden fencing materials:
      painting, creosote, pressure treatment, and burning.

   6. metal-post-treatment.png
      A 2D diagram showing treatment methods for metal fencing materials:
      galvanising, painting, and powder coating.

   7. fencing-specifications.png
      A 2D diagram showing fencing specifications: pole spacing (corner,
      strainer, intermediate, droppers) and strand spacing for cattle,
      sheep/goats, poultry, and game fences.

   --- FARM BUILDINGS IMAGES (2D DIAGRAM STYLE) ---

   8. building-materials.png
      A 2D diagram showing materials used for farm building construction:
      wood, metal, concrete, brick, thatch, and plastic.

   9. building-material-properties.png
      A 2D diagram showing properties of building materials: quality,
      durability, strength, fire resistance, termite resistance, and
      temperature resistance.

   --- FARM ROADS IMAGES (2D DIAGRAM STYLE) ---

   10. farm-road-features.png
       A 2D diagram showing features of a farm road: drainage, stable surface,
       camber, width, gentle curves, and durability.

   11. farm-road-dimensions.png
       A 2D diagram showing typical dimensions of farm road features: width
       (3-7m), camber (2-4%), ditches (0.5-1m wide, 0.3-0.5m deep), gravel
       layer (10-15cm).

   12. farm-road-repair.png
       A 2D diagram showing methods of repairing a farm road: grading,
       filling potholes, cleaning ditches, repairing culverts, and adding gravel.

   --- IRRIGATION PUMP IMAGES (2D DIAGRAM STYLE) ---

   13. irrigation-pump-parts.png
       A 2D diagram showing the parts of hand-operated (treadle pump) and
       power-operated (centrifugal pump) irrigation pumps.

   14. pump-working-principles.png
       A 2D diagram showing the working principles of a treadle pump (suction
       and delivery strokes) and a centrifugal pump (priming, suction, delivery).

   15. pump-maintenance.png
       A 2D diagram showing routine maintenance of hand-operated and
       power-operated irrigation pumps: daily checks, periodic servicing,
       and seasonal storage.

   ============================================================ */