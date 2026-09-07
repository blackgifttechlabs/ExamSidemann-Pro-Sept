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
      id: 'farm-implements-adjustments',
      title: 'Farm Implements – Adjustments',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Introduction to Implement Adjustments">
            <p>
              <strong>Definition:</strong> Farm implement adjustments are changes
              made to the settings of agricultural tools to ensure they work
              effectively and efficiently. Proper adjustments are essential for
              achieving the desired depth, width, and quality of tillage.
            </p>
            <p>
              For animal-drawn implements, adjustments are particularly important
              because the power source (oxen, donkeys) is not as powerful as a
              tractor. Correct adjustments reduce the workload on animals and
              improve the quality of work.
            </p>

            <AgricultureImage
              fileName="implement-adjustments-overview.png"
              alt="A 2D diagram showing the overview of implement adjustments: depth adjustment, width adjustment, and level adjustment"
              caption="Overview of farm implement adjustments for animal-drawn tools."
            />
          </SubtopicCard>

          <SubtopicCard title="Mould Board Plough Adjustments">
            <p>
              <strong>Definition:</strong> The mould board plough is the primary
              tillage implement used for turning soil. Proper adjustments are
              essential for achieving the correct ploughing depth and width.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Depth Adjustment</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Depth adjustment controls how deep the
                plough goes into the soil.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Using the depth regulator:</strong> The depth regulator
                    is a mechanism that controls the depth of ploughing.
                    <br />
                    <strong>How it works:</strong> Turning the depth regulator
                    changes the angle of the plough, adjusting how deep the share
                    cuts into the soil.
                    <br />
                    <strong>Example:</strong> To plough deeper, turn the depth
                    regulator to lower the plough into the soil. To plough shallower,
                    raise the plough.
                  </li>
                  <li>
                    <strong>Adjusting the wheel:</strong> The wheel supports the
                    plough and helps control depth.
                    <br />
                    <strong>How it works:</strong> Changing the height of the wheel
                    changes the depth of ploughing.
                    <br />
                    <strong>Example:</strong> Lowering the wheel raises the plough,
                    making it plough shallower. Raising the wheel lowers the plough,
                    making it plough deeper.
                  </li>
                  <li>
                    <strong>Using the beam:</strong> The beam connects the plough
                    to the animal.
                    <br />
                    <strong>How it works:</strong> Adjusting the beam height changes
                    the angle of the plough and affects depth.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Factors affecting depth:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Soil type:</strong> Sandy soils require shallower
                    ploughing, while clay soils need deeper ploughing.
                  </li>
                  <li>
                    <strong>Crop type:</strong> Root crops (potatoes, carrots) need
                    deeper ploughing than cereals (maize).
                  </li>
                  <li>
                    <strong>Previous crop:</strong> Plough depth may vary depending
                    on the previous crop and the amount of crop residue on the surface.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Typical ploughing depths:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Maize:</strong> 15-20 cm.</li>
                  <li><strong>Tobacco:</strong> 20-25 cm.</li>
                  <li><strong>Potatoes:</strong> 25-30 cm.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Width Adjustment</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Width adjustment controls the width of
                the furrow (the trench created by the plough).
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Adjusting the plough share:</strong> The share (point)
                    cuts the soil horizontally. A wider share creates a wider furrow.
                  </li>
                  <li>
                    <strong>Using the mould board:</strong> The mould board turns
                    the soil over. The width of the mould board affects the furrow width.
                  </li>
                  <li>
                    <strong>Adjusting the plough position:</strong> Moving the
                    plough sideways changes the furrow width.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Factors affecting width:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Plough type:</strong> Different ploughs have different
                    widths (single furrow, double furrow, etc.).
                  </li>
                  <li>
                    <strong>Animal strength:</strong> The width should be suitable
                    for the animal pulling the plough.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="mould-board-plough-adjustments.png"
              alt="A 2D diagram showing mould board plough adjustments: depth adjustment (depth regulator, wheel, beam) and width adjustment (share, mould board)"
              caption="Mould board plough adjustments: depth and width settings."
            />
          </SubtopicCard>

          <SubtopicCard title="Cultivator Adjustments">
            <p>
              <strong>Definition:</strong> A cultivator is a secondary tillage
              implement used to break up soil clods, remove weeds, and aerate the soil.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Depth Adjustment</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Adjusting the tines:</strong> The tines (teeth) of the
                    cultivator can be adjusted to change the depth of cultivation.
                  </li>
                  <li>
                    <strong>Using the depth regulator:</strong> Similar to the plough,
                    the cultivator has a depth regulator to control depth.
                  </li>
                  <li>
                    <strong>Adjusting the wheels:</strong> The wheels support the
                    cultivator and help control depth. Changing wheel height
                    changes cultivation depth.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Typical depths:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Weed control:</strong> 5-10 cm (shallow).</li>
                  <li><strong>Seedbed preparation:</strong> 10-15 cm.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Width Adjustment</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Adjusting tine spacing:</strong> The distance between
                    tines can be adjusted to change the working width.
                  </li>
                  <li>
                    <strong>Adding or removing tines:</strong> More tines increase
                    the working width, fewer tines decrease it.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="cultivator-adjustments.png"
              alt="A 2D diagram showing cultivator adjustments: depth adjustment (tines, depth regulator, wheels) and width adjustment (tine spacing, adding/removing tines)"
              caption="Cultivator adjustments: depth and width settings."
            />
          </SubtopicCard>

          <SubtopicCard title="Harrow Adjustments">
            <p>
              <strong>Definition:</strong> A harrow is a secondary tillage implement
              used to break up soil clods, level the soil, and remove weeds.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Depth Adjustment</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Adjusting the angle:</strong> The angle of the harrow
                    affects the depth. A steeper angle goes deeper.
                  </li>
                  <li>
                    <strong>Adding weight:</strong> Adding weight to the harrow
                    increases depth.
                  </li>
                  <li>
                    <strong>Using a depth regulator:</strong> Some harrows have a
                    depth regulator.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Typical depths:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Levelling:</strong> 2-5 cm (shallow).</li>
                  <li><strong>Seedbed preparation:</strong> 5-10 cm.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Width Adjustment</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Adjusting the frame:</strong> Some harrows have
                    adjustable frames to change the working width.
                  </li>
                  <li>
                    <strong>Adding or removing sections:</strong> Harrows are often
                    made of sections that can be added or removed to change width.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="harrow-adjustments.png"
              alt="A 2D diagram showing harrow adjustments: depth adjustment (angle, weight, depth regulator) and width adjustment (frame, sections)"
              caption="Harrow adjustments: depth and width settings."
            />
          </SubtopicCard>

          <SubtopicCard title="Importance of Proper Adjustments">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Reduces animal fatigue:</strong> Correct adjustments reduce
                the workload on animals, preventing injury and fatigue.
              </li>
              <li>
                <strong>Improves work quality:</strong> Proper adjustments result
                in better soil preparation, improving crop growth and yields.
              </li>
              <li>
                <strong>Increases efficiency:</strong> Correct adjustments allow
                the farmer to work faster and more efficiently.
              </li>
              <li>
                <strong>Reduces implement wear:</strong> Proper adjustments reduce
                wear and tear on implements, prolonging their life.
              </li>
              <li>
                <strong>Fuel efficiency:</strong> Properly adjusted implements
                reduce fuel consumption (if tractor-drawn).
              </li>
            </ul>

            <AgricultureImage
              fileName="proper-adjustments-importance.png"
              alt="A 2D diagram showing the importance of proper implement adjustments: reduces animal fatigue, improves work quality, increases efficiency, reduces wear"
              caption="Importance of proper implement adjustments."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Depth adjustment:</strong> controls how deep the implement goes</li>
            <li><strong>Width adjustment:</strong> controls the width of the furrow</li>
            <li><strong>Depth regulator:</strong> mechanism for controlling depth</li>
            <li><strong>Share:</strong> cutting edge of a plough</li>
            <li><strong>Tines:</strong> teeth of a cultivator</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'fencing',
      title: 'Fencing',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Fencing Materials and Tools">
            <p>
              <strong>Definition:</strong> Fencing requires various materials and
              tools for construction and maintenance. The choice of materials
              depends on the type of fence, the animals being contained, and the budget.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Fencing Materials</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Wire:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Barbed wire:</strong> Twisted wire with sharp barbs
                    (points). Used for cattle and boundary fences.
                  </li>
                  <li>
                    <strong>Diamond mesh (wire mesh):</strong> Woven wire with
                    diamond-shaped gaps. Used for sheep, goats, and poultry.
                  </li>
                  <li>
                    <strong>Electric fence wire:</strong> Galvanised wire that
                    carries an electric current. Used for cattle, wildlife exclusion.
                  </li>
                  <li>
                    <strong>Plain wire:</strong> Smooth wire used for binding and
                    as strainers.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Poles and posts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Wooden posts:</strong> From trees (teak, mopane,
                    eucalyptus). Need to be treated to prevent rot.
                    <br />
                    <strong>Types:</strong> Corner posts (larger), intermediate posts,
                    droppers (smaller).
                  </li>
                  <li>
                    <strong>Metal (steel) posts:</strong> Strong and durable, but
                    more expensive. Used for permanent fences.
                  </li>
                  <li>
                    <strong>Concrete posts:</strong> Very strong and durable, but
                    heavy and expensive.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Strainers and fasteners:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Strainers:</strong> Used to tension (strain) the wire.
                    Includes wire strainers, wire grippers, and ratchet strainers.
                  </li>
                  <li>
                    <strong>Fasteners:</strong> Used to attach wire to posts.
                    Includes fencing staples, nails, and clips.
                  </li>
                  <li>
                    <strong>Binding wire:</strong> Used to tie wires together.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Gates and hinges:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Gates:</strong> Used for access. Can be made of wood,
                    metal, or wire. Size depends on the purpose (vehicle access,
                    pedestrian access).
                  </li>
                  <li>
                    <strong>Hinges:</strong> Used to attach gates to posts.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Insulators (for electric fences):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Plastic or ceramic insulators to prevent the electric current
                    from grounding through the posts.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="fencing-materials.png"
              alt="A 2D diagram showing fencing materials: wire (barbed, diamond mesh, electric), posts (wooden, metal, concrete), strainers, fasteners, gates, and insulators"
              caption="Fencing materials and tools."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Fencing Tools</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Post hole digger:</strong> Used to dig holes for posts.
                Can be manual (clam shell digger) or mechanical (auger).
              </li>
              <li>
                <strong>Wire strainer:</strong> Used to tension the wire.
              </li>
              <li>
                <strong>Fencing pliers:</strong> Used for cutting wire, twisting,
                and hammering staples.
              </li>
              <li>
                <strong>Hammer and mallet:</strong> Used to drive posts and staples.
              </li>
              <li>
                <strong>Spade and shovel:</strong> Used for digging and backfilling.
              </li>
              <li>
                <strong>Level:</strong> Used to ensure posts are vertical.
              </li>
              <li>
                <strong>Tape measure:</strong> Used to measure distances and
                ensure correct spacing.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Advantages and Disadvantages of Different Fencing Materials">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Barbed Wire</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Strong and durable.</li>
                  <li>Relatively cheap.</li>
                  <li>Effective for cattle.</li>
                  <li>Easy to install.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Can injure animals if not maintained.</li>
                  <li>Not effective for small animals (goats, sheep) – they can
                    pass through or get stuck.</li>
                  <li>Can be dangerous to handle.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Diamond Mesh (Wire Mesh)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Effective for small animals (goats, sheep, poultry).</li>
                  <li>Strong and durable.</li>
                  <li>Can be used for gardens and crop protection.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>More expensive than barbed wire.</li>
                  <li>Requires more posts for support.</li>
                  <li>Heavy and difficult to handle.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Electric Fence</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Highly effective for cattle and wildlife exclusion.</li>
                  <li>Can be moved (temporary fencing).</li>
                  <li>Low maintenance.</li>
                  <li>Cost-effective over the long term.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Requires a power source (electricity or battery).</li>
                  <li>Initial installation can be expensive.</li>
                  <li>Can be dangerous if not installed correctly.</li>
                  <li>Can be affected by power outages.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Wooden Posts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Readily available (in many areas).</li>
                  <li>Relatively cheap.</li>
                  <li>Easy to work with.</li>
                  <li>Environmentally friendly (if sustainably sourced).</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Can rot and decay over time.</li>
                  <li>Vulnerable to termites and insects.</li>
                  <li>Needs to be treated (with preservatives).</li>
                  <li>Less durable than metal or concrete posts.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Metal (Steel) Posts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Strong and very durable.</li>
                  <li>Resistant to rot and insects.</li>
                  <li>Long-lasting.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Expensive.</li>
                  <li>Can rust (if not galvanised).</li>
                  <li>Heavy and difficult to handle.</li>
                  <li>Conducts electricity (needs insulators for electric fences).</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="fencing-materials-comparison.png"
              alt="A 2D diagram comparing fencing materials: barbed wire, diamond mesh, electric fence, wooden posts, and metal posts with advantages and disadvantages"
              caption="Comparison of fencing materials: advantages and disadvantages."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Fencing Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Materials:</strong> wire, posts, strainers, gates, insulators</li>
            <li><strong>Tools:</strong> post hole digger, wire strainer, pliers, hammer</li>
            <li><strong>Barbed wire:</strong> cheap, strong, but can injure animals</li>
            <li><strong>Diamond mesh:</strong> effective for small animals, expensive</li>
            <li><strong>Electric:</strong> effective, needs power source</li>
            <li><strong>Wooden posts:</strong> cheap, but rot and decay</li>
            <li><strong>Metal posts:</strong> durable, but expensive</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'farm-roads',
      title: 'Farm Roads',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Factors Considered When Siting a Farm Road">
            <p>
              <strong>Definition:</strong> Farm roads are essential for accessing
              fields, moving produce, and transporting inputs. Proper siting of
              farm roads is important for efficiency, safety, and environmental protection.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Drainage:</strong>
                <br />
                <strong>Requirement:</strong> The road should be on well-drained
                ground to prevent waterlogging and erosion.
                <br />
                <strong>Importance:</strong> Waterlogged roads are difficult to use
                and can be damaged by vehicles.
              </li>
              <li>
                <strong>Slope:</strong>
                <br />
                <strong>Requirement:</strong> Gentle slopes are best for roads.
                Steep slopes are difficult for vehicles (especially when loaded)
                and are prone to erosion.
                <br />
                <strong>Importance:</strong> Gentle slopes make transport easier
                and reduce road maintenance.
              </li>
              <li>
                <strong>Soil type:</strong>
                <br />
                <strong>Requirement:</strong> The road should be on stable soil
                that can support vehicles.
                <br />
                <strong>Importance:</strong> Sandy or unstable soils may require
                additional material (gravel, stone) to make the road passable.
              </li>
              <li>
                <strong>Accessibility:</strong>
                <br />
                <strong>Requirement:</strong> The road should connect fields,
                homesteads, and public roads.
                <br />
                <strong>Importance:</strong> Good access reduces transport time
                and costs.
              </li>
              <li>
                <strong>Proximity to infrastructure:</strong>
                <br />
                <strong>Requirement:</strong> The road should be near power lines,
                irrigation systems, or other infrastructure.
                <br />
                <strong>Importance:</strong> Reduces the cost of extending utilities
                to the fields.
              </li>
              <li>
                <strong>Environmental impact:</strong>
                <br />
                <strong>Requirement:</strong> Avoid sensitive areas (wetlands,
                steep slopes, watercourses).
                <br />
                <strong>Importance:</strong> Prevents environmental damage and
                complies with regulations.
              </li>
              <li>
                <strong>Cost:</strong>
                <br />
                <strong>Requirement:</strong> The cost of constructing and
                maintaining the road should be considered.
                <br />
                <strong>Importance:</strong> The road should be cost-effective
                for the farm.
              </li>
            </ul>

            <AgricultureImage
              fileName="farm-road-siting-factors.png"
              alt="A 2D diagram showing factors considered when siting a farm road: drainage, slope, soil type, accessibility, proximity to infrastructure, environmental impact, and cost"
              caption="Factors considered when siting a farm road."
            />
          </SubtopicCard>

          <SubtopicCard title="Equipment Needed for Farm Roads">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>For construction:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Bulldozer:</strong> For clearing and shaping the road.
                  </li>
                  <li>
                    <strong>Grader:</strong> For levelling and shaping the road surface.
                  </li>
                  <li>
                    <strong>Tractor with plough:</strong> For initial breaking of ground.
                  </li>
                  <li>
                    <strong>Compactor (roller):</strong> For compacting the road
                    surface to make it stable.
                  </li>
                  <li>
                    <strong>Trucks:</strong> For transporting materials (gravel, stone).
                  </li>
                </ul>
              </li>
              <li>
                <strong>For maintenance:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Grader:</strong> For re-shaping the road surface after
                    use or weather damage.
                  </li>
                  <li>
                    <strong>Compactor (roller):</strong> For re-compacting the surface.
                  </li>
                  <li>
                    <strong>Drainage equipment:</strong> For cleaning culverts and
                    ditches to maintain drainage.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="farm-road-equipment.png"
              alt="A 2D diagram showing equipment needed for farm roads: bulldozer, grader, tractor, compactor, and trucks"
              caption="Equipment needed for farm road construction and maintenance."
            />
          </SubtopicCard>

          <SubtopicCard title="Characteristics of Well-Sited Roads">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Good drainage:</strong> Water drains off the road surface
                easily, preventing waterlogging and erosion.
              </li>
              <li>
                <strong>Stable surface:</strong> The road surface is firm and
                stable, able to support vehicles without rutting (deep tracks).
              </li>
              <li>
                <strong>Gentle curves and slopes:</strong> The road follows the
                contour of the land with gentle curves and slopes, making it safe
                and easy to use.
              </li>
              <li>
                <strong>Adequate width:</strong> The road is wide enough for
                vehicles to pass each other and for turning.
              </li>
              <li>
                <strong>Durable:</strong> The road is constructed with durable
                materials (gravel, stone) and is built to last.
              </li>
              <li>
                <strong>Low maintenance:</strong> The road requires minimal
                maintenance due to good siting and construction.
              </li>
              <li>
                <strong>Accessible:</strong> The road connects all parts of the
                farm efficiently and provides access to public roads.
              </li>
            </ul>

            <AgricultureImage
              fileName="well-sited-farm-road.png"
              alt="A 2D diagram showing characteristics of a well-sited farm road: good drainage, stable surface, gentle curves, adequate width, durability, low maintenance, and accessibility"
              caption="Characteristics of a well-sited farm road."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Farm Roads Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Siting factors:</strong> drainage, slope, soil, accessibility, infrastructure, environment, cost</li>
            <li><strong>Equipment:</strong> bulldozer, grader, tractor, compactor, trucks</li>
            <li><strong>Characteristics:</strong> drainage, stable, gentle slopes, durable</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'harnessing',
      title: 'Harnessing',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Breast Band vs Collar Harness">
            <p>
              <strong>Definition:</strong> Harnessing refers to the equipment used
              to attach draught animals to farm implements. The two main types of
              harnesses are the breast band harness and the collar harness.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Breast Band Harness</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> A harness that fits across the
                animal's chest (breast). It is used for lighter work (cultivating,
                small carts).
              </li>
              <li>
                <strong>Parts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Breast band:</strong> A strap that goes across the
                    animal's chest, transmitting the pulling force.
                  </li>
                  <li>
                    <strong>Saddle (back pad):</strong> A pad on the animal's back
                    to distribute weight and prevent chafing.
                  </li>
                  <li>
                    <strong>Girth (belly band):</strong> A strap around the animal's
                    belly to keep the harness in place.
                  </li>
                  <li>
                    <strong>Hames:</strong> Metal or wooden frames that attach to
                    the breast band and connect to the traces.
                  </li>
                  <li>
                    <strong>Traces:</strong> Straps or chains that connect the
                    harness to the implement.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Simple and easy to fit.</li>
                  <li>Cheaper than collar harness.</li>
                  <li>Suitable for lighter work.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Can restrict breathing if too tight.</li>
                  <li>Not suitable for heavy work (ploughing).</li>
                  <li>Can slip or move if not fitted properly.</li>
                </ul>
              </li>
              <li>
                <strong>Animals:</strong> Donkeys, mules, small oxen.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Collar Harness</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> A harness that fits around the
                animal's neck. It is used for heavier work (ploughing, heavy carts).
              </li>
              <li>
                <strong>Parts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Collar:</strong> A padded ring that fits around the
                    animal's neck. It transmits the pulling force from the shoulders.
                  </li>
                  <li>
                    <strong>Hames:</strong> Metal or wooden frames that attach to
                    the collar and connect to the traces.
                  </li>
                  <li>
                    <strong>Traces:</strong> Straps or chains that connect the
                    harness to the implement.
                  </li>
                  <li>
                    <strong>Saddle (back pad):</strong> A pad on the animal's back
                    to distribute weight.
                  </li>
                  <li>
                    <strong>Girth (belly band):</strong> A strap around the animal's
                    belly to keep the harness in place.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>More comfortable for the animal (does not restrict breathing).</li>
                  <li>Allows the animal to pull more weight (more efficient).</li>
                  <li>Suitable for heavy work.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>More complex and expensive.</li>
                  <li>Requires careful fitting.</li>
                </ul>
              </li>
              <li>
                <strong>Animals:</strong> Oxen, horses.
              </li>
            </ul>

            <AgricultureImage
              fileName="breast-band-collar-harness.png"
              alt="A 2D diagram comparing breast band harness and collar harness with parts labelled"
              caption="Breast band harness vs collar harness: parts and uses."
            />
          </SubtopicCard>

          <SubtopicCard title="Parts of a Harness and Their Functions">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Common Parts of Both Harness Types</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Breast band (or collar):</strong>
                <br />
                <strong>Function:</strong> Transmits the pulling force from the
                animal to the implement.
                <br />
                <strong>Location:</strong> Across the chest (breast band) or around
                the neck (collar).
              </li>
              <li>
                <strong>Hames:</strong>
                <br />
                <strong>Function:</strong> Attach the breast band or collar to the
                traces. Provide a secure connection point.
                <br />
                <strong>Location:</strong> On the sides of the animal's neck or chest.
              </li>
              <li>
                <strong>Traces:</strong>
                <br />
                <strong>Function:</strong> Connect the harness to the implement.
                Transmit the pulling force.
                <br />
                <strong>Location:</strong> From the hames to the implement.
              </li>
              <li>
                <strong>Saddle (back pad):</strong>
                <br />
                <strong>Function:</strong> Distributes the weight of the harness
                and prevents chafing on the animal's back.
                <br />
                <strong>Location:</strong> On the animal's back, behind the withers.
              </li>
              <li>
                <strong>Girth (belly band):</strong>
                <br />
                <strong>Function:</strong> Keeps the harness in place by wrapping
                around the animal's belly.
                <br />
                <strong>Location:</strong> Around the animal's belly, behind the front legs.
              </li>
              <li>
                <strong>Breeching (breaching strap):</strong>
                <br />
                <strong>Function:</strong> Helps the animal slow down or stop a load
                (especially when going downhill).
                <br />
                <strong>Location:</strong> Around the animal's hindquarters (rump).
              </li>
              <li>
                <strong>Holding back strap:</strong>
                <br />
                <strong>Function:</strong> Connects the breeching to the implement
                for braking.
                <br />
                <strong>Location:</strong> From the breeching to the implement.
              </li>
            </ul>

            <AgricultureImage
              fileName="harness-parts-labeled.png"
              alt="A 2D diagram showing the parts of a harness: breast band/collar, hames, traces, saddle, girth, breeching, and holding back strap with labels"
              caption="Parts of a harness and their functions."
            />
          </SubtopicCard>

          <SubtopicCard title="Materials for Making Harnesses">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Leather:</strong>
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Strong, durable, and flexible.</li>
                  <li>Breathable (comfortable for the animal).</li>
                  <li>Requires regular maintenance (cleaning, oiling).</li>
                </ul>
                <br />
                <strong>Uses:</strong> Straps, bands, and padding.
              </li>
              <li>
                <strong>Synthetic materials (nylon, polyester):</strong>
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Strong, durable, and lightweight.</li>
                  <li>Resistant to rot and moisture.</li>
                  <li>Does not require as much maintenance as leather.</li>
                </ul>
                <br />
                <strong>Uses:</strong> Straps, traces, and girths.
              </li>
              <li>
                <strong>Metal (steel, iron):</strong>
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Very strong and durable.</li>
                  <li>Used for chains, buckles, rings, and hames.</li>
                </ul>
                <br />
                <strong>Uses:</strong> Chains, hames, buckles, rings, and fasteners.
              </li>
              <li>
                <strong>Wood:</strong>
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Strong and durable (hardwoods like teak, mopane).</li>
                  <li>Used for yokes and some harness parts (hames).</li>
                </ul>
                <br />
                <strong>Uses:</strong> Yokes, hames (in some cases).
              </li>
            </ul>

            <AgricultureImage
              fileName="harness-materials.png"
              alt="A 2D diagram showing materials used for harnesses: leather, synthetic materials, metal, and wood"
              caption="Materials for making harnesses and their characteristics."
            />
          </SubtopicCard>

          <SubtopicCard title="Harnessing Specific Animals">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Oxen (Cattle)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Best harness type:</strong> Collar harness (for heavy work)
                or yoke (traditional).
              </li>
              <li>
                <strong>How to harness:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Place the collar around the animal's neck.</li>
                  <li>Attach the hames to the collar.</li>
                  <li>Place the saddle on the back.</li>
                  <li>Fasten the girth around the belly.</li>
                  <li>Attach the traces to the hames and the implement.</li>
                </ul>
              </li>
              <li>
                <strong>Important considerations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>The collar must fit properly (not too tight or too loose).</li>
                  <li>Use trained, responsive oxen.</li>
                  <li>Adjust the traces so the implement is at the correct angle.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Donkeys</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Best harness type:</strong> Breast band harness (for lighter work)
                or collar harness (for heavier work).
              </li>
              <li>
                <strong>How to harness:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Place the breast band across the chest.</li>
                  <li>Attach the hames to the breast band.</li>
                  <li>Place the saddle on the back.</li>
                  <li>Fasten the girth around the belly.</li>
                  <li>Attach the traces to the hames and the implement.</li>
                </ul>
              </li>
              <li>
                <strong>Important considerations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Donkeys have a different body shape than oxen (narrower chest).</li>
                  <li>Harnesses must be fitted specifically for donkeys.</li>
                  <li>Donkeys are not as strong as oxen, so use lighter implements.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Horses</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Best harness type:</strong> Collar harness (for heavy work)
                or breast band harness (for lighter work).
              </li>
              <li>
                <strong>How to harness:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Place the collar around the neck.</li>
                  <li>Attach the hames to the collar.</li>
                  <li>Place the saddle on the back.</li>
                  <li>Fasten the girth around the belly.</li>
                  <li>Attach the traces to the hames and the implement.</li>
                </ul>
              </li>
              <li>
                <strong>Important considerations:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Horses require a different type of collar (horse collar)
                    designed for their anatomy.</li>
                  <li>Horses are sensitive and respond well to gentle handling.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="harnessing-animals.png"
              alt="A 2D diagram showing how to harness oxen (collar), donkeys (breast band), and horses (collar) with labels"
              caption="Harnessing specific animals: oxen, donkeys, and horses."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Harnessing Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Breast band:</strong> lighter work (donkeys)</li>
            <li><strong>Collar:</strong> heavier work (oxen, horses)</li>
            <li><strong>Parts:</strong> breast band/collar, hames, traces, saddle, girth, breeching</li>
            <li><strong>Materials:</strong> leather, synthetic, metal, wood</li>
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
            Explore farm implement adjustments, fencing materials and tools,
            farm road siting and construction, and harnessing equipment for
            draught animals.
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
                  <strong className="text-white">Farm Implements Adjustments:</strong>
                  Depth and width adjustments are essential for mould board ploughs,
                  cultivators, and harrows. Proper adjustments reduce animal fatigue,
                  improve work quality, and increase efficiency.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Fencing:</strong> Materials include
                  wire (barbed, diamond mesh, electric), posts (wooden, metal,
                  concrete), strainers, gates, and insulators. Barbed wire is cheap
                  but can injure animals; diamond mesh is effective for small animals;
                  electric fences are highly effective but need power.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farm Roads:</strong> Siting factors
                  include drainage, slope, soil type, accessibility, infrastructure,
                  environmental impact, and cost. Equipment includes bulldozers,
                  graders, tractors, and compactors. Well-sited roads have good
                  drainage, stable surfaces, and gentle slopes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Harnessing:</strong> Breast band
                  harness (lighter work, donkeys) vs collar harness (heavier work,
                  oxen, horses). Parts include breast band/collar, hames, traces,
                  saddle, girth, and breeching. Materials include leather, synthetic,
                  metal, and wood.
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
              <>Ready to move on to <span className="text-green-600">Animal Husbandry</span>?</>
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
                alert('Proceed to Animal Husbandry (next topic)');
              }
            }}
            className="px-8 py-3 bg-green-600 text-white rounded-full font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-green-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Animal Husbandry →' : 'Next Section →'}
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

   --- FARM IMPLEMENT ADJUSTMENTS IMAGES (2D DIAGRAM STYLE) ---

   1. implement-adjustments-overview.png
      A 2D diagram showing the overview of implement adjustments:
      - Depth adjustment (how deep the implement goes)
      - Width adjustment (how wide the furrow is)
      - Level adjustment (keeping the implement level)
      Label all parts.

   2. mould-board-plough-adjustments.png
      A 2D diagram showing mould board plough adjustments:
      - Depth adjustment: depth regulator, wheel adjustment, beam adjustment
      - Width adjustment: share adjustment, mould board adjustment, plough position
      Label all parts and explain how each adjustment works.

   3. cultivator-adjustments.png
      A 2D diagram showing cultivator adjustments:
      - Depth adjustment: tine adjustment, depth regulator, wheel adjustment
      - Width adjustment: tine spacing, adding/removing tines
      Label all parts.

   4. harrow-adjustments.png
      A 2D diagram showing harrow adjustments:
      - Depth adjustment: angle adjustment, adding weight, depth regulator
      - Width adjustment: frame adjustment, adding/removing sections
      Label all parts.

   5. proper-adjustments-importance.png
      A 2D diagram showing the importance of proper implement adjustments:
      - Reduces animal fatigue
      - Improves work quality
      - Increases efficiency
      - Reduces implement wear
      - Fuel efficiency (if tractor-drawn)

   --- FENCING IMAGES (2D DIAGRAM AND REALISTIC) ---

   6. fencing-materials.png
      A 2D diagram showing fencing materials:
      - Wire (barbed wire, diamond mesh, electric fence wire, plain wire)
      - Posts (wooden, metal, concrete)
      - Strainers and fasteners (wire strainers, staples, nails, binding wire)
      - Gates and hinges
      - Insulators (for electric fences)

   7. fencing-materials-comparison.png
      A 2D diagram comparing fencing materials:
      - Barbed wire (advantages: cheap, strong; disadvantages: can injure animals)
      - Diamond mesh (advantages: effective for small animals; disadvantages: expensive)
      - Electric fence (advantages: highly effective; disadvantages: needs power)
      - Wooden posts (advantages: cheap; disadvantages: rot, termites)
      - Metal posts (advantages: durable; disadvantages: expensive)

   --- FARM ROADS IMAGES (2D DIAGRAM STYLE) ---

   8. farm-road-siting-factors.png
      A 2D diagram showing factors considered when siting a farm road:
      - Drainage (well-drained ground)
      - Slope (gentle slopes)
      - Soil type (stable soil)
      - Accessibility (connection to fields and roads)
      - Proximity to infrastructure (power lines, irrigation)
      - Environmental impact (avoid sensitive areas)
      - Cost (construction and maintenance)

   9. farm-road-equipment.png
      A 2D diagram showing equipment needed for farm roads:
      - Bulldozer (clearing and shaping)
      - Grader (levelling and shaping)
      - Tractor with plough (initial breaking)
      - Compactor (roller) (compacting surface)
      - Trucks (transporting materials)

   10. well-sited-farm-road.png
       A 2D diagram showing characteristics of a well-sited farm road:
       - Good drainage
       - Stable surface
       - Gentle curves and slopes
       - Adequate width
       - Durable
       - Low maintenance
       - Accessible

   --- HARNESSING IMAGES (2D DIAGRAM STYLE) ---

   11. breast-band-collar-harness.png
       A 2D diagram comparing breast band harness and collar harness:
       - Breast band harness (across chest, lighter work, donkeys)
       - Collar harness (around neck, heavier work, oxen, horses)
       Label all parts for each type.

   12. harness-parts-labeled.png
       A 2D diagram showing the parts of a harness:
       - Breast band (or collar)
       - Hames
       - Traces
       - Saddle (back pad)
       - Girth (belly band)
       - Breeching (breaching strap)
       - Holding back strap
       Label each part and describe its function.

   13. harness-materials.png
       A 2D diagram showing materials used for harnesses:
       - Leather (strong, flexible, needs maintenance)
       - Synthetic materials (nylon, polyester) (strong, rot-resistant)
       - Metal (steel, iron) (strong, used for chains, hames)
       - Wood (used for yokes, some hames)

   14. harnessing-animals.png
       A 2D diagram showing how to harness specific animals:
       - Oxen (collar harness) – place collar around neck, attach hames, fasten girth
       - Donkeys (breast band harness) – place breast band across chest, attach hames, fasten girth
       - Horses (collar harness) – place collar around neck, attach hames, fasten girth
       Show each step with labels.

   ============================================================ */