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
      id: 'fencing',
      title: 'Fencing',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Role of Anchors in Fencing">
            <p>
              <strong>Definition:</strong> An anchor (also called a stay or brace)
              is a structure used to support and stabilise fence posts, especially
              at corners, gateways, and changes in direction. Anchors prevent fence
              posts from leaning or being pulled out of the ground by the tension
              of the wire.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Purpose of anchors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Support tension:</strong> Fences are tensioned by
                    straining wires. Anchors absorb this tension and transfer it
                    to the ground, preventing posts from pulling over.
                  </li>
                  <li>
                    <strong>Stability:</strong> Anchors keep corner and gate posts
                    stable, ensuring the fence stays straight and aligned.
                  </li>
                  <li>
                    <strong>Durability:</strong> Proper anchoring extends the life
                    of the fence by reducing stress on individual posts.
                  </li>
                  <li>
                    <strong>Prevents sagging:</strong> Anchors prevent wires from
                    sagging by maintaining tension.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="fence-anchor-role.png"
              alt="A 2D diagram showing the role of anchors in fencing: corner post with anchor, gate post with anchor, and strainer post with anchor"
              caption="Role of anchors in fencing: supporting tension and stability."
            />
          </SubtopicCard>

          <SubtopicCard title="Types of Anchors – Advantages and Disadvantages">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Deadman Anchor</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> A buried log, concrete block, or
                large stone that is attached to the post with wire or chain.
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Strong and durable (resists high tension).</li>
                  <li>Uses locally available materials (logs, stones).</li>
                  <li>Long-lasting.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Labour-intensive to install (digging).</li>
                  <li>Requires heavy materials.</li>
                  <li>Not easily moved or adjusted.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Strainer Post Anchor</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> A larger, stronger post (strainer)
                that is set deeper in the ground and braced with a strut to a
                secondary post.
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Effective for tensioning wire.</li>
                  <li>Relatively easy to install.</li>
                  <li>Common and well-tested design.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Requires strong posts and proper bracing.</li>
                  <li>Can rot or decay (if wooden).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Concrete Anchor</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> A concrete block or pier cast in the
                ground and attached to the post.
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Very strong and durable.</li>
                  <li>Resistant to rot and insects.</li>
                  <li>Long-lasting.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Expensive (materials and labour).</li>
                  <li>Heavy and difficult to install.</li>
                  <li>Not easily moved.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steel Post Anchor</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> A steel post set in concrete or driven
                deep into the ground, with a brace to resist tension.
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Very strong and durable.</li>
                  <li>Resistant to rot and termites.</li>
                  <li>Can be driven deep for extra stability.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Expensive.</li>
                  <li>Can rust if not galvanised.</li>
                  <li>Heavy and difficult to install.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="anchor-types.png"
              alt="A 2D diagram showing different types of anchors: deadman anchor, strainer post anchor, concrete anchor, and steel post anchor with advantages and disadvantages"
              caption="Types of anchors: deadman, strainer post, concrete, and steel post anchors."
            />
          </SubtopicCard>

          <SubtopicCard title="Calculating Material Quantities per Perimeter">
            <p>
              <strong>Definition:</strong> To construct a fence, you need to
              calculate the quantities of materials required (posts, wire, anchors,
              strainers, and fasteners) based on the length of the fence line and
              the spacing of materials.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps for Material Calculation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1: Measure the perimeter.</strong>
                <br />
                Measure the total length of the fence line (in metres).
              </li>
              <li>
                <strong>Step 2: Determine post spacing.</strong>
                <br />
                Decide on the spacing between posts (e.g., 3-5m for intermediate
                posts, 1-2m for droppers).
              </li>
              <li>
                <strong>Step 3: Calculate the number of posts.</strong>
                <br />
                Number of posts = (Perimeter ÷ Spacing) + 1 (for the starting post).
              </li>
              <li>
                <strong>Step 4: Determine number of strands.</strong>
                <br />
                Decide on the number of wire strands (e.g., 4-6 for cattle, 6-8
                for sheep/goats).
              </li>
              <li>
                <strong>Step 5: Calculate wire length.</strong>
                <br />
                Wire length = Perimeter × Number of strands + 10% for wastage and
                overlaps.
              </li>
              <li>
                <strong>Step 6: Calculate strainers and anchors.</strong>
                <br />
                Allow for strainer posts at corners and every 100-200m. Allow for
                anchors at corners and gateways.
              </li>
              <li>
                <strong>Step 7: Calculate fasteners.</strong>
                <br />
                Estimate staples, clips, and binding wire based on the number of
                posts and strands.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example Calculation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Scenario:</strong> A rectangular field measuring 200m × 100m.
                <br />
                <strong>Perimeter:</strong> 2 × (200 + 100) = 600m.
                <br />
                <strong>Post spacing:</strong> 4m for intermediate posts, 1.5m for droppers.
                <br />
                <strong>Number of intermediate posts:</strong> 600 ÷ 4 = 150 posts.
                <br />
                <strong>Number of droppers:</strong> 600 ÷ 1.5 = 400 droppers.
                <br />
                <strong>Number of strands:</strong> 6 strands (for cattle).
                <br />
                <strong>Wire length:</strong> 600m × 6 = 3600m + 10% = 3960m of wire.
                <br />
                <strong>Strainers/anchors:</strong> 4 corners + 2 gateways = 6 sets.
              </li>
            </ul>

            <AgricultureImage
              fileName="fence-material-calculation.png"
              alt="A 2D diagram showing material calculation for fencing: perimeter measurement, post spacing, wire length, and fasteners"
              caption="Calculating material quantities for fencing."
            />
          </SubtopicCard>

          <SubtopicCard title="Constructing Anchors">
            <p>
              <strong>Definition:</strong> Anchor construction involves building
              the support structures that hold fence posts in place, especially at
              corners, gateways, and changes in direction.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps for Constructing a Deadman Anchor</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1:</strong> Dig a hole behind the corner post (about
                1-1.5m from the post, 0.5-1m deep).
              </li>
              <li>
                <strong>Step 2:</strong> Place a log, concrete block, or large
                stone in the hole.
              </li>
              <li>
                <strong>Step 3:</strong> Attach a wire or chain from the deadman
                to the corner post (at the point where the wire pulls).
              </li>
              <li>
                <strong>Step 4:</strong> Backfill the hole with soil and compact
                well to secure the deadman.
              </li>
              <li>
                <strong>Step 5:</strong> Tension the wire between the post and the
                deadman to make it tight.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps for Constructing a Strainer Post Anchor</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1:</strong> Dig a hole for the strainer post (about
                1-1.2m deep).
              </li>
              <li>
                <strong>Step 2:</strong> Place the strainer post in the hole and
                backfill with soil, compacting well.
              </li>
              <li>
                <strong>Step 3:</strong> Place a brace (a diagonal strut) from the
                strainer post to a secondary post (blocking post) set about 2-3m away.
              </li>
              <li>
                <strong>Step 4:</strong> Secure the brace with nails or wire.
              </li>
              <li>
                <strong>Step 5:</strong> Tension the wire from the strainer post
                using a wire strainer.
              </li>
            </ul>

            <AgricultureImage
              fileName="anchor-construction.png"
              alt="A 2D diagram showing the construction of a deadman anchor and a strainer post anchor with step-by-step labels"
              caption="Constructing anchors: deadman anchor and strainer post anchor."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Anchor:</strong> support for fence posts</li>
            <li><strong>Deadman anchor:</strong> buried log/stone attached to post</li>
            <li><strong>Strainer post:</strong> strong post for tensioning wire</li>
            <li><strong>Perimeter:</strong> total length of fence</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'farm-buildings',
      title: 'Farm Buildings',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Designing Livestock Building Plans">
            <p>
              <strong>Definition:</strong> Livestock buildings are structures
              designed to house animals (cattle, sheep, goats, pigs, poultry).
              Proper design ensures animal welfare, productivity, and efficient
              management.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Key Design Considerations</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Space requirements:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Animals:</strong> Provide adequate space for animals
                    to move, lie down, and feed.
                    <br />
                    Example: A cow requires about 10-12 m² of housing space.
                  </li>
                  <li>
                    <strong>Ventilation:</strong> Ensure good air circulation to
                    prevent respiratory diseases and remove odours.
                  </li>
                  <li>
                    <strong>Lighting:</strong> Provide natural or artificial
                    lighting for animal comfort and management.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Feeding and watering:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Feeders:</strong> Design feeders to minimise waste
                    and allow access for all animals.
                  </li>
                  <li>
                    <strong>Water troughs:</strong> Provide clean, accessible
                    water at all times.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Drainage and waste management:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Flooring:</strong> Use non-slip, easy-to-clean
                    flooring with proper drainage.
                  </li>
                  <li>
                    <strong>Manure management:</strong> Design for easy removal
                    of manure to reduce disease and odour.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Accessibility:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Worker access:</strong> Easy access for feeding,
                    cleaning, and veterinary care.
                  </li>
                  <li>
                    <strong>Animal movement:</strong> Allow easy movement of
                    animals in and out of the building.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Protection from weather:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Roof:</strong> Provide a waterproof roof to protect
                    animals from rain and sun.
                  </li>
                  <li>
                    <strong>Walls:</strong> Provide shelter from wind and cold.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example: Cattle Housing (Zero-Grazing Unit)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Features:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Covered roof with corrugated iron or thatch.</li>
                  <li>Concrete floor with drainage channels.</li>
                  <li>Feed troughs along one side.</li>
                  <li>Water troughs at the front.</li>
                  <li>Individual stalls or open pens.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="livestock-building-design.png"
              alt="A 2D diagram showing a livestock building plan: cattle zero-grazing unit with labelled features (roof, floor, feed troughs, water troughs, drainage)"
              caption="Designing livestock building plans: cattle zero-grazing unit."
            />
          </SubtopicCard>

          <SubtopicCard title="Calculating Construction Costs">
            <p>
              <strong>Definition:</strong> Calculating construction costs involves
              estimating the total amount of money needed to build a farm structure,
              including materials, labour, and other expenses.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps for Cost Calculation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1: List all materials.</strong>
                <br />
                Identify all materials needed: timber, metal sheets, concrete,
                bricks, nails, cement, etc.
              </li>
              <li>
                <strong>Step 2: Quantify materials.</strong>
                <br />
                Calculate the quantity of each material needed (e.g., number of
                sheets, bags of cement, lengths of timber).
              </li>
              <li>
                <strong>Step 3: Estimate material costs.</strong>
                <br />
                Multiply the quantity by the unit price (e.g., cost per bag, per
                sheet, per metre).
              </li>
              <li>
                <strong>Step 4: Estimate labour costs.</strong>
                <br />
                Calculate the number of labour hours or days required and the wage rate.
              </li>
              <li>
                <strong>Step 5: Add other costs.</strong>
                <br />
                Include transport costs, equipment rental, and contingency (10-15%
                for unexpected expenses).
              </li>
              <li>
                <strong>Step 6: Calculate total cost.</strong>
                <br />
                Total cost = Material costs + Labour costs + Other costs + Contingency.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Example Cost Calculation</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Item</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Quantity</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Unit Price</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Cement bags</td>
                  <td className="border border-slate-300 px-4 py-2">20</td>
                  <td className="border border-slate-300 px-4 py-2">$15</td>
                  <td className="border border-slate-300 px-4 py-2">$300</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Corrugated iron sheets</td>
                  <td className="border border-slate-300 px-4 py-2">50</td>
                  <td className="border border-slate-300 px-4 py-2">$20</td>
                  <td className="border border-slate-300 px-4 py-2">$1,000</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Timber (poles)</td>
                  <td className="border border-slate-300 px-4 py-2">40</td>
                  <td className="border border-slate-300 px-4 py-2">$10</td>
                  <td className="border border-slate-300 px-4 py-2">$400</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Nails and fasteners</td>
                  <td className="border border-slate-300 px-4 py-2">-</td>
                  <td className="border border-slate-300 px-4 py-2">-</td>
                  <td className="border border-slate-300 px-4 py-2">$100</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Labour (10 days × 2 workers)</td>
                  <td className="border border-slate-300 px-4 py-2">20 person-days</td>
                  <td className="border border-slate-300 px-4 py-2">$20/day</td>
                  <td className="border border-slate-300 px-4 py-2">$400</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Transport</td>
                  <td className="border border-slate-300 px-4 py-2">-</td>
                  <td className="border border-slate-300 px-4 py-2">-</td>
                  <td className="border border-slate-300 px-4 py-2">$100</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2 font-bold">Subtotal</td>
                  <td className="border border-slate-300 px-4 py-2"></td>
                  <td className="border border-slate-300 px-4 py-2"></td>
                  <td className="border border-slate-300 px-4 py-2 font-bold">$2,300</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Contingency (10%)</td>
                  <td className="border border-slate-300 px-4 py-2"></td>
                  <td className="border border-slate-300 px-4 py-2"></td>
                  <td className="border border-slate-300 px-4 py-2">$230</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2 font-bold">Total Cost</td>
                  <td className="border border-slate-300 px-4 py-2"></td>
                  <td className="border border-slate-300 px-4 py-2"></td>
                  <td className="border border-slate-300 px-4 py-2 font-bold">$2,530</td>
                </tr>
              </tbody>
            </table>

            <AgricultureImage
              fileName="building-cost-calculation.png"
              alt="A 2D diagram showing cost calculation for farm buildings: materials list, quantities, unit prices, and total costs"
              caption="Calculating construction costs for farm buildings."
            />
          </SubtopicCard>

          <SubtopicCard title="Cost-Effectiveness of Building Materials">
            <p>
              <strong>Definition:</strong> Cost-effectiveness compares the initial
              cost of materials with their durability, maintenance needs, and
              lifespan. A material may be more expensive initially but cheaper
              over the long term.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Comparison of Materials</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Material</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Initial Cost</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Durability</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Maintenance</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Cost-Effectiveness</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Wood (untreated)</td>
                  <td className="border border-slate-300 px-4 py-2">Low</td>
                  <td className="border border-slate-300 px-4 py-2">Short (5-10 years)</td>
                  <td className="border border-slate-300 px-4 py-2">High (requires treatment)</td>
                  <td className="border border-slate-300 px-4 py-2">Low</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Wood (treated)</td>
                  <td className="border border-slate-300 px-4 py-2">Medium</td>
                  <td className="border border-slate-300 px-4 py-2">Medium (15-25 years)</td>
                  <td className="border border-slate-300 px-4 py-2">Low</td>
                  <td className="border border-slate-300 px-4 py-2">Good</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Metal (galvanised)</td>
                  <td className="border border-slate-300 px-4 py-2">High</td>
                  <td className="border border-slate-300 px-4 py-2">Long (30+ years)</td>
                  <td className="border border-slate-300 px-4 py-2">Very low</td>
                  <td className="border border-slate-300 px-4 py-2">Very good</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Concrete</td>
                  <td className="border border-slate-300 px-4 py-2">High</td>
                  <td className="border border-slate-300 px-4 py-2">Long (50+ years)</td>
                  <td className="border border-slate-300 px-4 py-2">Very low</td>
                  <td className="border border-slate-300 px-4 py-2">Very good</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Brick</td>
                  <td className="border border-slate-300 px-4 py-2">Medium</td>
                  <td className="border border-slate-300 px-4 py-2">Long (50+ years)</td>
                  <td className="border border-slate-300 px-4 py-2">Very low</td>
                  <td className="border border-slate-300 px-4 py-2">Good</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Thatch</td>
                  <td className="border border-slate-300 px-4 py-2">Low</td>
                  <td className="border border-slate-300 px-4 py-2">Short (5-10 years)</td>
                  <td className="border border-slate-300 px-4 py-2">High (regular replacement)</td>
                  <td className="border border-slate-300 px-4 py-2">Low</td>
                </tr>
              </tbody>
            </table>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Choosing Cost-Effective Materials</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Consider lifespan:</strong> A more expensive material that
                lasts longer may be cheaper over time.
              </li>
              <li>
                <strong>Consider maintenance:</strong> Materials with low maintenance
                costs (galvanised metal, concrete) are more cost-effective in the
                long run.
              </li>
              <li>
                <strong>Local availability:</strong> Use locally available materials
                to reduce transport costs.
              </li>
            </ul>

            <AgricultureImage
              fileName="material-cost-effectiveness.png"
              alt="A 2D diagram comparing cost-effectiveness of building materials: wood, metal, concrete, brick, and thatch"
              caption="Cost-effectiveness of building materials."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Farm Buildings</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Design:</strong> space, ventilation, feeding, drainage</li>
            <li><strong>Costs:</strong> materials + labour + transport + contingency</li>
            <li><strong>Cost-effectiveness:</strong> initial cost vs durability vs maintenance</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'farm-roads',
      title: 'Farm Roads',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Materials Needed for Farm Road Construction">
            <p>
              <strong>Definition:</strong> Farm roads are essential for accessing
              fields, moving produce, and transporting inputs. The choice of
              materials affects the durability and cost of the road.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Base materials (sub-base):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Compacted soil:</strong> The natural soil compacted to
                    form a stable base.
                  </li>
                  <li>
                    <strong>Gravel:</strong> Crushed rock or river gravel used as
                    a base layer to provide stability.
                  </li>
                  <li>
                    <strong>Crushed stone:</strong> Larger stones used in areas
                    with poor soil or high traffic.
                  </li>
                  <li>
                    <strong>Calcrete:</strong> A calcium carbonate-rich material
                    that hardens when compacted, common in dry areas.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Surface materials:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Gravel (finely graded):</strong> A layer of fine gravel
                    on top of the base to create a smooth driving surface.
                  </li>
                  <li>
                    <strong>Crushed stone (small):</strong> Fine crushed stone for
                    the surface layer.
                  </li>
                  <li>
                    <strong>Clay:</strong> In some areas, clay is used to bind the
                    surface materials.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Drainage materials:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Pipes (culverts):</strong> For water drainage under
                    the road.
                  </li>
                  <li>
                    <strong>Sand and gravel:</strong> For backfilling around
                    culverts and drainage channels.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="farm-road-materials.png"
              alt="A 2D diagram showing materials needed for farm road construction: base materials (compacted soil, gravel, crushed stone), surface materials (fine gravel), and drainage materials (culverts)"
              caption="Materials needed for farm road construction."
            />
          </SubtopicCard>

          <SubtopicCard title="Farm Road Construction Process">
            <p>
              <strong>Definition:</strong> Farm road construction involves several
              steps to ensure the road is durable, well-drained, and suitable for
              farm vehicles.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1: Clearing and grubbing.</strong>
                <br />
                Remove vegetation, trees, and debris from the road alignment.
              </li>
              <li>
                <strong>Step 2: Surveying and pegging.</strong>
                <br />
                Mark the road alignment and set pegs to guide construction.
              </li>
              <li>
                <strong>Step 3: Excavation and grading.</strong>
                <br />
                Excavate the road bed to the required depth, creating a flat base
                with the correct camber (slope for drainage).
              </li>
              <li>
                <strong>Step 4: Installing drainage.</strong>
                <br />
                Install culverts (pipes) under the road and dig drainage ditches
                on the sides.
              </li>
              <li>
                <strong>Step 5: Laying the base layer.</strong>
                <br />
                Spread and compact the base material (gravel, crushed stone, or
                compacted soil) to a thickness of 15-30cm.
              </li>
              <li>
                <strong>Step 6: Laying the surface layer.</strong>
                <br />
                Spread a layer of fine gravel or crushed stone (5-10cm thick) and
                compact it to create a smooth driving surface.
              </li>
              <li>
                <strong>Step 7: Final grading and compaction.</strong>
                <br />
                Grade the road to the correct camber and compact thoroughly.
              </li>
              <li>
                <strong>Step 8: Rolling.</strong>
                <br />
                Use a roller (or tractor) to compact the road surface for stability.
              </li>
            </ul>

            <AgricultureImage
              fileName="farm-road-construction.png"
              alt="A 2D diagram showing the farm road construction process: clearing, surveying, excavation, drainage installation, base layer, surface layer, and compaction"
              caption="Farm road construction process: step-by-step."
            />
          </SubtopicCard>

          <SubtopicCard title="Maintaining Local Farm Roads">
            <p>
              <strong>Definition:</strong> Regular maintenance is essential to
              keep farm roads in good condition and prevent deterioration.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Grading (re-shaping):</strong>
                <br />
                Use a grader or tractor-drawn blade to re-shape the road surface,
                restoring the camber and removing ruts.
                <br />
                <strong>Frequency:</strong> After heavy rain or several months of use.
              </li>
              <li>
                <strong>Filling potholes:</strong>
                <br />
                Fill potholes with gravel, crushed stone, or compacted soil to
                prevent them from growing.
                <br />
                <strong>Method:</strong> Remove loose material, fill the hole with
                gravel, compact, and add a final layer.
              </li>
              <li>
                <strong>Cleaning ditches:</strong>
                <br />
                Remove silt, debris, and vegetation from ditches to ensure proper
                drainage.
                <br />
                <strong>Frequency:</strong> Regularly, especially before the
                rainy season.
              </li>
              <li>
                <strong>Repairing culverts:</strong>
                <br />
                Clear blockages and repair damaged culverts to prevent water
                damage to the road.
                <br />
                <strong>Frequency:</strong> After heavy rains or flooding.
              </li>
              <li>
                <strong>Adding gravel:</strong>
                <br />
                Add new gravel or crushed stone to maintain the surface thickness
                and stability.
                <br />
                <strong>Frequency:</strong> As needed (when the surface is worn thin).
              </li>
            </ul>

            <AgricultureImage
              fileName="farm-road-maintenance.png"
              alt="A 2D diagram showing farm road maintenance methods: grading, filling potholes, cleaning ditches, repairing culverts, and adding gravel"
              caption="Maintaining local farm roads: methods and frequency."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Farm Roads</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Materials:</strong> base (gravel, stone), surface (fine gravel), drainage (culverts)</li>
            <li><strong>Construction:</strong> clearing, grading, drainage, base, surface, compaction</li>
            <li><strong>Maintenance:</strong> grading, potholes, ditches, culverts, gravel</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'appropriate-technology',
      title: 'Appropriate Technology – Shellers',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Parts of a Maize/ Groundnut Sheller">
            <p>
              <strong>Definition:</strong> A sheller is a machine used to remove
              the outer covering (husk or shell) from grains or nuts. Maize shellers
              remove kernels from the cob, while groundnut shellers remove the shell
              from the nut.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Maize Sheller</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Hopper:</strong>
                <br />
                <strong>Description:</strong> A funnel-shaped opening at the top
                where maize cobs are fed into the machine.
                <br />
                <strong>Function:</strong> Guides the cobs into the shelling chamber.
              </li>
              <li>
                <strong>Shelling drum (cylinder):</strong>
                <br />
                <strong>Description:</strong> A rotating cylinder with projections
                (teeth, bars, or spikes) that strike the cobs.
                <br />
                <strong>Function:</strong> Removes the kernels from the cob by
                impact and friction.
              </li>
              <li>
                <strong>Concave (grating):</strong>
                <br />
                <strong>Description:</strong> A curved metal plate with holes or
                openings that surrounds the shelling drum.
                <br />
                <strong>Function:</strong> Allows kernels to pass through while
                retaining the cobs.
              </li>
              <li>
                <strong>Screen (sieves):</strong>
                <br />
                <strong>Description:</strong> A mesh or perforated plate that
                separates kernels from broken cobs and chaff.
                <br />
                <strong>Function:</strong> Sorts the shelled grain from the waste.
              </li>
              <li>
                <strong>Fan (blower):</strong>
                <br />
                <strong>Description:</strong> A fan that blows air through the
                machine.
                <br />
                <strong>Function:</strong> Removes chaff and dust from the kernels.
              </li>
              <li>
                <strong>Power source:</strong>
                <br />
                <strong>Description:</strong> The motor (electric, petrol, or diesel)
                or hand crank that drives the machine.
                <br />
                <strong>Function:</strong> Provides the mechanical power for
                shelling.
              </li>
              <li>
                <strong>Outlets:</strong>
                <br />
                <strong>Description:</strong> Two exits – one for grain (kernels)
                and one for waste (cobs, chaff).
                <br />
                <strong>Function:</strong> Separates and delivers the grain and waste.
              </li>
            </ul>

            <AgricultureImage
              fileName="maize-sheller-parts.png"
              alt="A 2D diagram showing the parts of a maize sheller: hopper, shelling drum, concave, screen, fan, power source, and outlets"
              caption="Parts of a maize sheller and their functions."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Groundnut Sheller</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Hopper:</strong>
                <br />
                <strong>Description:</strong> A funnel-shaped opening where groundnuts
                are fed.
                <br />
                <strong>Function:</strong> Guides groundnuts into the shelling chamber.
              </li>
              <li>
                <strong>Shelling drum (with ribs):</strong>
                <br />
                <strong>Description:</strong> A rotating drum with ribs or bars
                that rub and crack the shells.
                <br />
                <strong>Function:</strong> Cracks the shells without damaging the nuts.
              </li>
              <li>
                <strong>Concave:</strong>
                <br />
                <strong>Description:</strong> A curved metal plate with adjustable
                clearance.
                <br />
                <strong>Function:</strong> Provides friction and pressure to crack
                the shells.
              </li>
              <li>
                <strong>Screen (sieves):</strong>
                <br />
                <strong>Description:</strong> A perforated plate that separates
                shells from nuts.
                <br />
                <strong>Function:</strong> Separates nuts from shell pieces.
              </li>
              <li>
                <strong>Fan (blower):</strong>
                <br />
                <strong>Description:</strong> A fan that blows air through the machine.
                <br />
                <strong>Function:</strong> Removes light shell pieces and dust.
              </li>
              <li>
                <strong>Power source:</strong>
                <br />
                <strong>Description:</strong> Motor or hand crank that drives the machine.
                <br />
                <strong>Function:</strong> Provides power for shelling.
              </li>
              <li>
                <strong>Outlets:</strong>
                <br />
                <strong>Description:</strong> Two exits – one for nuts and one for shells.
                <br />
                <strong>Function:</strong> Separates nuts from shell waste.
              </li>
            </ul>

            <AgricultureImage
              fileName="groundnut-sheller-parts.png"
              alt="A 2D diagram showing the parts of a groundnut sheller: hopper, shelling drum, concave, screen, fan, power source, and outlets"
              caption="Parts of a groundnut sheller and their functions."
            />
          </SubtopicCard>

          <SubtopicCard title="Operational Principles of Shellers">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Maize Sheller – How It Works</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Principle:</strong> Impact and friction remove kernels from
                the cob.
              </li>
              <li>
                <strong>Operation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Feeding:</strong> Cobs are fed into the hopper by hand.
                  </li>
                  <li>
                    <strong>Shelling:</strong> The shelling drum rotates and strikes
                    the cobs, knocking the kernels off the cob. The concave provides
                    friction to help separate kernels.
                  </li>
                  <li>
                    <strong>Separation:</strong> Kernels fall through the holes in
                    the concave and onto the screen. The cob pieces are retained and
                    exit through the waste outlet.
                  </li>
                  <li>
                    <strong>Cleaning:</strong> The fan blows air through the machine,
                    removing chaff and dust from the kernels.
                  </li>
                  <li>
                    <strong>Collection:</strong> Clean kernels exit through the
                    grain outlet and are collected in bags or containers.
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Groundnut Sheller – How It Works</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Principle:</strong> Friction and pressure crack the shells
                without damaging the nuts.
              </li>
              <li>
                <strong>Operation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Feeding:</strong> Groundnuts are fed into the hopper.
                  </li>
                  <li>
                    <strong>Shelling:</strong> The shelling drum with ribs rotates
                    against the concave, cracking the shells through friction and
                    pressure.
                  </li>
                  <li>
                    <strong>Separation:</strong> Nuts fall through the screen (mesh)
                    while shell pieces are separated. The screen size can be adjusted
                    to suit different groundnut varieties.
                  </li>
                  <li>
                    <strong>Cleaning:</strong> The fan blows away light shell
                    pieces and dust.
                  </li>
                  <li>
                    <strong>Collection:</strong> Shelled nuts exit through the
                    nut outlet and are collected.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="sheller-operational-principles.png"
              alt="A 2D diagram showing the operational principles of maize and groundnut shellers: feeding, shelling, separation, cleaning, and collection"
              caption="Operational principles of maize and groundnut shellers."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Shellers Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Maize sheller parts:</strong> hopper, shelling drum, concave, screen, fan, power source, outlets</li>
            <li><strong>Groundnut sheller parts:</strong> hopper, shelling drum (ribs), concave, screen, fan, power source, outlets</li>
            <li><strong>Principles:</strong> impact/friction (maize), friction/pressure (groundnuts)</li>
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
            Explore fencing anchors and material calculations, livestock building
            design and cost estimation, farm road construction and maintenance,
            and appropriate technology for maize and groundnut shellers.
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
                  <strong className="text-white">Fencing Anchors:</strong> Anchors
                  (deadman, strainer post, concrete, steel post) support fence
                  posts and absorb tension. Material calculation involves measuring
                  perimeter, spacing posts, and calculating wire length and
                  fasteners.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farm Buildings:</strong> Livestock
                  building design considers space, ventilation, feeding, drainage,
                  and accessibility. Cost calculation includes materials, labour,
                  transport, and contingency. Cost-effectiveness compares initial
                  cost, durability, and maintenance.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Farm Roads:</strong> Materials
                  include base (gravel, stone), surface (fine gravel), and drainage
                  (culverts). Construction involves clearing, grading, drainage
                  installation, laying base and surface, and compaction. Maintenance
                  includes grading, potholes, ditches, and adding gravel.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Shellers:</strong> Maize and
                  groundnut shellers have hoppers, shelling drums, concaves,
                  screens, fans, power sources, and outlets. Maize shellers use
                  impact and friction; groundnut shellers use friction and pressure
                  to crack shells without damaging nuts.
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

   --- FENCING IMAGES (2D DIAGRAM STYLE) ---

   1. fence-anchor-role.png
      A 2D diagram showing the role of anchors in fencing: corner post with
      anchor, gate post with anchor, and strainer post with anchor.
      Show the forces (tension) on the posts and how anchors resist them.

   2. anchor-types.png
      A 2D diagram showing types of anchors:
      - Deadman anchor (buried log with wire to post)
      - Strainer post anchor (strainer post with brace/strut)
      - Concrete anchor (concrete block attached to post)
      - Steel post anchor (steel post with brace)
      Label each with advantages and disadvantages.

   3. fence-material-calculation.png
      A 2D diagram showing material calculation for fencing:
      - Perimeter measurement (diagram of a rectangular field)
      - Post spacing (3-5m for intermediates, 1-2m for droppers)
      - Wire length calculation (perimeter × strands)
      - Fasteners (staples, clips, binding wire)
      Show an example calculation.

   4. anchor-construction.png
      A 2D diagram showing the construction of a deadman anchor and a strainer
      post anchor with step-by-step labels.

   --- FARM BUILDINGS IMAGES (2D DIAGRAM STYLE) ---

   5. livestock-building-design.png
      A 2D diagram showing a livestock building plan: cattle zero-grazing unit
      with labelled features (roof, concrete floor, drainage, feed troughs,
      water troughs, stalls).

   6. building-cost-calculation.png
      A 2D diagram showing cost calculation for farm buildings: materials list,
      quantities, unit prices, and total costs.
      Include an example calculation table.

   7. material-cost-effectiveness.png
      A 2D diagram comparing cost-effectiveness of building materials:
      - Wood (treated vs untreated)
      - Metal (galvanised)
      - Concrete
      - Brick
      - Thatch
      Show initial cost, durability, maintenance, and overall cost-effectiveness.

   --- FARM ROADS IMAGES (2D DIAGRAM STYLE) ---

   8. farm-road-materials.png
      A 2D diagram showing materials needed for farm road construction:
      - Base materials (compacted soil, gravel, crushed stone, calcrete)
      - Surface materials (fine gravel, crushed stone)
      - Drainage materials (culverts, pipes, sand)

   9. farm-road-construction.png
      A 2D diagram showing the farm road construction process:
      - Clearing and grubbing
      - Surveying and pegging
      - Excavation and grading
      - Installing drainage (culverts, ditches)
      - Laying base layer (gravel)
      - Laying surface layer (fine gravel)
      - Compaction and rolling

   10. farm-road-maintenance.png
       A 2D diagram showing farm road maintenance methods:
       - Grading (re-shaping)
       - Filling potholes
       - Cleaning ditches
       - Repairing culverts
       - Adding gravel
       Include frequency recommendations.

   --- APPROPRIATE TECHNOLOGY IMAGES (2D DIAGRAM STYLE) ---

   11. maize-sheller-parts.png
       A 2D diagram showing the parts of a maize sheller:
       - Hopper (funnel at top)
       - Shelling drum (rotating cylinder with teeth)
       - Concave (grating around drum)
       - Screen (sieve/mesh)
       - Fan (blower)
       - Power source (motor or hand crank)
       - Outlets (grain and waste)
       Label each part with its function.

   12. groundnut-sheller-parts.png
       A 2D diagram showing the parts of a groundnut sheller:
       - Hopper (funnel at top)
       - Shelling drum (rotating drum with ribs)
       - Concave (adjustable plate)
       - Screen (sieve/mesh)
       - Fan (blower)
       - Power source (motor or hand crank)
       - Outlets (nuts and shells)
       Label each part with its function.

   13. sheller-operational-principles.png
       A 2D diagram showing the operational principles of maize and groundnut
       shellers:
       - Maize: feeding → impact/friction shelling → separation (screen) →
         cleaning (fan) → collection (grain outlet)
       - Groundnut: feeding → friction/pressure shelling → separation (screen) →
         cleaning (fan) → collection (nut outlet)

   ============================================================ */