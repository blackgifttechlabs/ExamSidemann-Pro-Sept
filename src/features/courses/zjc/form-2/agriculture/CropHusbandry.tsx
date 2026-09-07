import React, { useState, useRef } from 'react';

/**
 * Topic: Crop Husbandry – Full component with sticky navigation,
 * container cards (9px border-radius), image placeholders,
 * and auto‑scroll + double‑highlight on heading.
 */
export const CropHusbandry: React.FC = () => {
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
      id: 'classification-plants',
      title: 'Classification of Plants',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Monocotyledonous vs Dicotyledonous Plants">
            <p>
              <strong>Definition:</strong> Flowering plants (angiosperms) are divided
              into two main groups based on the number of seed leaves (cotyledons)
              they have. This classification is important because it helps us understand
              plant structure, growth patterns, and how to manage different crops.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Monocotyledonous Plants (Monocots)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Monocots have one seed leaf (cotyledon)
                in their seeds. The embryo has a single cotyledon.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Leaves:</strong> Narrow, with parallel veins (e.g., maize,
                    grass, wheat).
                  </li>
                  <li>
                    <strong>Roots:</strong> Fibrous root system (many thin roots
                    spreading out).
                  </li>
                  <li>
                    <strong>Stems:</strong> Usually hollow or soft (herbaceous),
                    with scattered vascular bundles.
                  </li>
                  <li>
                    <strong>Flowers:</strong> Floral parts are in threes or multiples
                    of three (e.g., 3 petals, 6 stamens).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Cereals:</strong> Maize, wheat, rice, sorghum, millet.</li>
                  <li><strong>Grasses:</strong> Sugarcane, lawn grasses, forage grasses.</li>
                  <li><strong>Other monocots:</strong> Onions, garlic, lilies, orchids.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Maize (staple crop), sugarcane
                (commercial crop in the Lowveld), sorghum and millet (drought-resistant
                cereals).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Dicotyledonous Plants (Dicots)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Dicots have two seed leaves (cotyledons)
                in their seeds. The embryo has two cotyledons.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Leaves:</strong> Broad, with net-like veins (reticulate
                    venation) (e.g., beans, tobacco, tomatoes).
                  </li>
                  <li>
                    <strong>Roots:</strong> Tap root system (one main root with
                    smaller branches).
                  </li>
                  <li>
                    <strong>Stems:</strong> Usually solid with vascular bundles in
                    a ring pattern. Can be herbaceous or woody.
                  </li>
                  <li>
                    <strong>Flowers:</strong> Floral parts are in fours or fives or
                    multiples of these (e.g., 4 or 5 petals, 8 or 10 stamens).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Legumes:</strong> Beans, groundnuts, peas, cowpeas, soybeans.</li>
                  <li><strong>Vegetables:</strong> Tomatoes, peppers, cabbage, spinach.</li>
                  <li><strong>Fruits:</strong> Citrus, mangoes, apples, peaches.</li>
                  <li><strong>Other dicots:</strong> Tobacco, cotton, coffee, tea.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Tobacco (commercial crop), beans
                (common in communal areas), tomatoes (grown in all regions), citrus
                (grown in the Lowveld).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Comparison of Monocots and Dicots</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Feature</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Monocots</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Dicots</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Cotyledons</td>
                  <td className="border border-slate-300 px-4 py-2">One (mono)</td>
                  <td className="border border-slate-300 px-4 py-2">Two (di)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Leaf venation</td>
                  <td className="border border-slate-300 px-4 py-2">Parallel</td>
                  <td className="border border-slate-300 px-4 py-2">Netted (reticulate)</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Root system</td>
                  <td className="border border-slate-300 px-4 py-2">Fibrous</td>
                  <td className="border border-slate-300 px-4 py-2">Tap root</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Stem vascular bundles</td>
                  <td className="border border-slate-300 px-4 py-2">Scattered</td>
                  <td className="border border-slate-300 px-4 py-2">In a ring</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Floral parts</td>
                  <td className="border border-slate-300 px-4 py-2">In threes</td>
                  <td className="border border-slate-300 px-4 py-2">In fours or fives</td>
                </tr>
              </tbody>
            </table>

            <AgricultureImage
              fileName="monocot-dicot-comparison.png"
              alt="A 2D diagram comparing monocot and dicot plants: seed, leaf venation, root system, stem, and flower"
              caption="Comparison of monocotyledonous and dicotyledonous plants."
            />
          </SubtopicCard>

          <SubtopicCard title="Botanical Classes of Crops">
            <p>
              <strong>Definition:</strong> Crops can be grouped into botanical classes
              based on their family characteristics. This classification helps farmers
              understand the growth habits, nutrient requirements, and pest and disease
              susceptibilities of different crops.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Legumes (Fabaceae family):</strong>
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Have pods (legumes) as fruits.</li>
                  <li>Can fix nitrogen through symbiotic bacteria (Rhizobium) in root nodules.</li>
                  <li>Leaves are compound (divided into leaflets).</li>
                  <li>Improve soil fertility by adding nitrogen.</li>
                </ul>
                <br />
                <strong>Examples:</strong> Beans, groundnuts, peas, cowpeas, soybeans,
                lucerne, clover.
                <br />
                <strong>Zimbabwe examples:</strong> Sugar beans (common in communal
                areas), groundnuts (grown in all regions), soybeans (commercial crop).
              </li>
              <li>
                <strong>Brassicas (Brassicaceae family):</strong>
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Have four-petalled flowers (cross-shaped).</li>
                  <li>Leaves are often fleshy and edible.</li>
                  <li>Many are cool-season crops.</li>
                </ul>
                <br />
                <strong>Examples:</strong> Cabbage, kale, rape, cauliflower, broccoli,
                Brussels sprouts, mustard, turnips.
                <br />
                <strong>Zimbabwe examples:</strong> Cabbage (common vegetable in all
                areas), rape (popular in communal areas), kale (grown in the Eastern
                Highlands).
              </li>
              <li>
                <strong>Solanaceous crops (Solanaceae family):</strong>
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Have five-petalled flowers (often star-shaped).</li>
                  <li>Many have edible fruits or tubers.</li>
                  <li>Susceptible to common pests and diseases (blight, nematodes).</li>
                </ul>
                <br />
                <strong>Examples:</strong> Tomatoes, potatoes, peppers (sweet and
                chilli), eggplants, tobacco.
                <br />
                <strong>Zimbabwe examples:</strong> Tomatoes (grown in all regions),
                potatoes (Eastern Highlands), tobacco (commercial crop in Mashonaland),
                peppers (grown commercially and in gardens).
              </li>
              <li>
                <strong>Cereals (Poaceae family – grasses):</strong>
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Monocotyledonous plants (grasses).</li>
                  <li>Have hollow stems with nodes (joints).</li>
                  <li>Flowers are wind-pollinated (inconspicuous).</li>
                  <li>Produce grains (caryopses) as fruits.</li>
                </ul>
                <br />
                <strong>Examples:</strong> Maize, wheat, rice, sorghum, millet, barley,
                oats.
                <br />
                <strong>Zimbabwe examples:</strong> Maize (staple food), sorghum and
                millet (grown in semi-arid areas), wheat (grown in the Eastern Highlands
                and under irrigation).
              </li>
              <li>
                <strong>Cucurbits (Cucurbitaceae family):</strong>
                <br />
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Vine-like plants that trail or climb.</li>
                  <li>Have tendrils for climbing.</li>
                  <li>Produce fleshy fruits with many seeds.</li>
                </ul>
                <br />
                <strong>Examples:</strong> Pumpkins, butternut, cucumbers, melons,
                watermelons, squashes, zucchini.
                <br />
                <strong>Zimbabwe examples:</strong> Pumpkins (common in communal areas),
                butternut (grown commercially in the Lowveld), cucumbers (grown in
                horticultural areas).
              </li>
            </ul>

            <AgricultureImage
              fileName="botanical-classes-crops.png"
              alt="A 2D diagram showing botanical classes of crops: legumes, brassicas, solanaceous, cereals, and cucurbits with examples"
              caption="Botanical classes of crops: legumes, brassicas, solanaceous, cereals, and cucurbits."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Monocot:</strong> one seed leaf (maize, grass)</li>
            <li><strong>Dicot:</strong> two seed leaves (beans, tomatoes)</li>
            <li><strong>Legumes:</strong> nitrogen-fixing, pods (beans, groundnuts)</li>
            <li><strong>Brassicas:</strong> cross-shaped flowers (cabbage, rape)</li>
            <li><strong>Solanaceous:</strong> star-shaped flowers (tomatoes, tobacco)</li>
            <li><strong>Cereals:</strong> grasses, grains (maize, sorghum)</li>
            <li><strong>Cucurbits:</strong> vines, fleshy fruits (pumpkin, butternut)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'structure-flowering-plants',
      title: 'Structure of Flowering Plants',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Structure of Maize and Bean Flowers">
            <p>
              <strong>Definition:</strong> Flowers are the reproductive organs of
              flowering plants. They contain the male and female parts that are
              necessary for sexual reproduction. The structure of flowers varies
              between monocots and dicots.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Maize Flower (Monocot)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> Maize is a monoecious plant, meaning
                it has separate male and female flowers on the same plant.
              </li>
              <li>
                <strong>Male flower (tassel):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Located at the top of the plant.</li>
                  <li>Consists of many small flowers (spikelets) on a central stalk.</li>
                  <li>Produces pollen (male gametes).</li>
                  <li>Pollen is wind-dispersed.</li>
                </ul>
              </li>
              <li>
                <strong>Female flower (ear):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Located in the leaf axils (between the stem and leaf).</li>
                  <li>Consists of a cob (central axis) with many small flowers
                    (spikelets) arranged in rows.</li>
                  <li>Each flower has an ovary with a single ovule and a long,
                    thread-like style (silk).</li>
                  <li>Stigma is at the tip of the silk, where pollen lands.</li>
                </ul>
              </li>
              <li>
                <strong>Pollination:</strong> Maize is wind-pollinated. Pollen from
                the tassel is carried by the wind to the silks of the female flower.
              </li>
            </ul>

            <AgricultureImage
              fileName="maize-flower-structure.png"
              alt="A 2D diagram showing the structure of maize flowers: male tassel and female ear with silk"
              caption="Structure of maize flowers: male tassel and female ear."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Bean Flower (Dicot)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> Beans have perfect flowers (bisexual),
                meaning each flower contains both male and female parts.
              </li>
              <li>
                <strong>Flower structure:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Sepals:</strong> The outermost part of the flower,
                    usually green, protecting the flower bud.
                  </li>
                  <li>
                    <strong>Petals:</strong> The colourful part of the flower,
                    attracting pollinators. Bean flowers have a characteristic
                    shape (papilionaceous) with a banner, wings, and keel.
                  </li>
                  <li>
                    <strong>Stamens (male):</strong> Consist of the anther (produces
                    pollen) and filament (stalk). Bean flowers often have 10 stamens
                    (diadelphous – 9 fused, 1 free).
                  </li>
                  <li>
                    <strong>Carpel (female):</strong> Consists of the stigma (receives
                    pollen), style (connects stigma to ovary), and ovary (contains ovules).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Pollination:</strong> Beans are often self-pollinated
                (pollination occurs within the same flower) or insect-pollinated.
              </li>
            </ul>

            <AgricultureImage
              fileName="bean-flower-structure.png"
              alt="A 2D diagram showing the structure of a bean flower: sepals, petals, stamens, and carpel with labels"
              caption="Structure of a bean flower: sepals, petals, stamens, and carpel."
            />
          </SubtopicCard>

          <SubtopicCard title="Parts and Functions of a Flower">
            <p>
              <strong>Definition:</strong> A typical flower has four main parts:
              sepals, petals, stamens, and carpels. Each part has a specific function
              in reproduction.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sepals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> The outermost part of the flower.
                Usually green and leaf-like.
              </li>
              <li>
                <strong>Function:</strong> Protect the flower bud before it opens.
                May also support the petals.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Petals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Description:</strong> The colourful part of the flower.
                Often brightly coloured and scented.
              </li>
              <li>
                <strong>Function:</strong> Attract pollinators (insects, birds) to
                the flower. They also protect the reproductive parts.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Stamens (Male Reproductive Parts)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Parts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Anther:</strong> The top part of the stamen that produces
                    and releases pollen.
                  </li>
                  <li>
                    <strong>Filament:</strong> The stalk that supports the anther.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Function:</strong> Produce and release pollen (male gametes)
                for fertilisation.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Carpels (Female Reproductive Parts)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Parts:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Stigma:</strong> The top part of the carpel that receives
                    pollen. It is often sticky to trap pollen.
                  </li>
                  <li>
                    <strong>Style:</strong> The stalk that connects the stigma to
                    the ovary. Pollen tubes grow down the style.
                  </li>
                  <li>
                    <strong>Ovary:</strong> The swollen base of the carpel that
                    contains the ovules. After fertilisation, it develops into the fruit.
                  </li>
                  <li>
                    <strong>Ovules:</strong> Contain the female gametes (egg cells).
                    After fertilisation, they develop into seeds.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Function:</strong> Receive pollen and produce seeds after fertilisation.
              </li>
            </ul>

            <AgricultureImage
              fileName="flower-parts-functions.png"
              alt="A 2D diagram showing the parts of a flower: sepals, petals, stamens (anther, filament), and carpel (stigma, style, ovary, ovules) with functions labelled"
              caption="Parts of a flower and their functions."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Flower Parts</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Sepals:</strong> protect bud</li>
            <li><strong>Petals:</strong> attract pollinators</li>
            <li><strong>Stamens:</strong> male (anther + filament)</li>
            <li><strong>Carpel:</strong> female (stigma + style + ovary + ovules)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'plant-processes',
      title: 'Plant Processes',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Sexual vs Asexual Reproduction">
            <p>
              <strong>Definition:</strong> Reproduction is the process by which plants
              produce new individuals (offspring). There are two main types of
              reproduction: sexual and asexual.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sexual Reproduction</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Reproduction that involves the fusion of
                male and female gametes (sex cells) to produce offspring.
              </li>
              <li>
                <strong>Process:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Male gametes (pollen) fertilise female gametes (ovules).</li>
                  <li>Produces seeds.</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Produces genetic diversity (variation).</li>
                  <li>Plants can adapt to changing environments.</li>
                  <li>Seeds can be dispersed to new areas.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Requires pollination and fertilisation (needs pollinators or wind).</li>
                  <li>Takes time and energy.</li>
                  <li>Produces fewer offspring than asexual reproduction.</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong> Maize, beans, tomatoes, fruit trees (oranges,
                mangoes).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Asexual (Vegetative) Reproduction</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Reproduction that does not involve the
                fusion of gametes. Offspring are produced from a single parent and
                are genetically identical to the parent (clones).
              </li>
              <li>
                <strong>Process:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>New plants grow from parts of the parent plant (stems, roots, leaves).</li>
                  <li>No seeds are produced.</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fast and produces many offspring quickly.</li>
                  <li>Offspring are identical to the parent (preserves desirable traits).</li>
                  <li>Does not require pollination or fertilisation.</li>
                  <li>Useful for plants that do not produce seeds.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Lack of genetic diversity (all offspring are identical).</li>
                  <li>Plants are all susceptible to the same pests and diseases.</li>
                  <li>Can lead to spread of diseases.</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong> Sugarcane, potatoes, bananas, strawberries,
                cassava, sweet potatoes.
              </li>
            </ul>

            <AgricultureImage
              fileName="sexual-asexual-reproduction.png"
              alt="A 2D diagram comparing sexual reproduction (flower, pollination, seed) and asexual reproduction (cuttings, runners, tubers, bulbs)"
              caption="Sexual vs asexual reproduction in plants."
            />
          </SubtopicCard>

          <SubtopicCard title="Pollination and Fertilisation in Maize and Beans">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Maize (Monocot)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pollination:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Maize is wind-pollinated.</li>
                  <li>Pollen from the tassel (male flower) is carried by the wind.</li>
                  <li>Pollen lands on the silks (stigmas) of the female flower (ear).</li>
                  <li>Each silk is connected to one ovule (potential seed).</li>
                </ul>
              </li>
              <li>
                <strong>Fertilisation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Pollen germinates on the silk and grows a pollen tube down the silk.</li>
                  <li>The pollen tube reaches the ovary and delivers the male gametes.</li>
                  <li>Fertilisation occurs – the male gamete fuses with the female gamete (ovule).</li>
                  <li>Each fertilised ovule develops into a kernel (grain).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Bean (Dicot)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pollination:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Beans are often self-pollinated (selfing).</li>
                  <li>Pollination occurs within the same flower before it opens (cleistogamy).</li>
                  <li>Some beans are insect-pollinated (cross-pollination).</li>
                </ul>
              </li>
              <li>
                <strong>Fertilisation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Pollen lands on the stigma (self or cross).</li>
                  <li>Pollen tube grows down the style to the ovary.</li>
                  <li>Fertilisation occurs – the male gamete fuses with the female gamete (ovule).</li>
                  <li>Each fertilised ovule develops into a seed (bean).</li>
                  <li>The ovary develops into the pod (fruit).</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="pollination-fertilisation-maize-bean.png"
              alt="A 2D diagram showing pollination and fertilisation in maize (wind pollination, silk, kernel) and bean (self-pollination, pod, seed)"
              caption="Pollination and fertilisation in maize and bean."
            />
          </SubtopicCard>

          <SubtopicCard title="Methods of Asexual Reproduction">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Budding</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A method where a bud from one plant
                (scion) is inserted into another plant (rootstock) to grow together.
              </li>
              <li>
                <strong>Uses:</strong> Used in fruit tree propagation (oranges,
                mangoes, apples).
              </li>
              <li>
                <strong>Benefits:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Combines desirable traits of two plants (e.g., disease resistance
                    from rootstock, good fruit from scion).</li>
                  <li>Produces true-to-type plants.</li>
                </ul>
              </li>
              <li>
                <strong>Types:</strong> T-budding, chip budding, patch budding.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Layering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A method where a stem is bent to the
                ground and covered with soil. Roots develop at the buried part,
                and a new plant is formed.
              </li>
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Simple layering:</strong> A branch is bent to the ground
                    and covered with soil.
                  </li>
                  <li>
                    <strong>Air layering:</strong> A branch is wounded, covered with
                    moist material (moss, soil), and wrapped with plastic to encourage root growth.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Uses:</strong> Used for plants that do not root easily from
                cuttings (e.g., citrus, guava, lychee).
              </li>
            </ul>

            <AgricultureImage
              fileName="asexual-reproduction-methods.png"
              alt="A 2D diagram showing asexual reproduction methods: budding (T-budding) and layering (simple layering, air layering)"
              caption="Methods of asexual reproduction: budding and layering."
            />
          </SubtopicCard>

          <SubtopicCard title="Germination Requirements and Process">
            <p>
              <strong>Definition:</strong> Germination is the process by which a
              seed begins to grow and develop into a seedling. It is the start of
              the plant's life cycle.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Requirements for Germination</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Water:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Seeds need water to soften the seed coat and to activate enzymes.</li>
                  <li>Water is essential for metabolic processes.</li>
                </ul>
              </li>
              <li>
                <strong>Oxygen:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Seeds need oxygen for respiration (energy production).</li>
                  <li>Waterlogged soils lack oxygen and prevent germination.</li>
                </ul>
              </li>
              <li>
                <strong>Temperature:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Seeds need the right temperature for germination.</li>
                  <li>Different seeds have different temperature requirements.
                    Maize needs warm temperatures (20-30°C), while wheat needs
                    cooler temperatures (15-20°C).</li>
                </ul>
              </li>
              <li>
                <strong>Light or darkness:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Some seeds need light to germinate (lettuce, tobacco), while
                    others need darkness (onions, peppers).</li>
                </ul>
              </li>
              <li>
                <strong>Soil:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>A suitable seedbed with good soil structure and nutrients is important.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Germination vs Emergence</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Germination:</strong>
                <br />
                <strong>Definition:</strong> The process where the seed absorbs water,
                the embryo starts to grow, and the radicle (embryonic root) emerges
                from the seed coat.
                <br />
                <strong>What happens:</strong> The radicle pushes through the seed
                coat and starts to grow down into the soil.
              </li>
              <li>
                <strong>Emergence:</strong>
                <br />
                <strong>Definition:</strong> The appearance of the seedling above
                the soil surface.
                <br />
                <strong>What happens:</strong> The shoot (plumule) pushes through
                the soil and emerges into the light. The cotyledons (seed leaves)
                may also appear.
              </li>
            </ul>

            <AgricultureImage
              fileName="germination-emergence.png"
              alt="A 2D diagram showing germination (radicle emerging from seed) and emergence (seedling above soil) with stages"
              caption="Germination and emergence in plants."
            />
          </SubtopicCard>

          <SubtopicCard title="Structure of Maize and Bean Seeds">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">External Parts of a Seed</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Seed coat (Testa):</strong> The outer protective layer of the seed.
              </li>
              <li>
                <strong>Hilum (Eye):</strong> The scar on the seed where it was
                attached to the fruit.
              </li>
              <li>
                <strong>Micropyle:</strong> A small opening in the seed coat where
                water enters during germination.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Internal Parts of a Maize Seed (Monocot)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Endosperm:</strong> The main food storage tissue in the seed.
                It provides nutrients for the growing embryo.
              </li>
              <li>
                <strong>Cotyledon (scutellum):</strong> The single seed leaf that
                absorbs food from the endosperm and transfers it to the embryo.
              </li>
              <li>
                <strong>Embryo (germ):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Plumule:</strong> The embryonic shoot that develops into
                    the stem and leaves.
                  </li>
                  <li>
                    <strong>Radicle:</strong> The embryonic root that develops into
                    the root system.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Coleoptile:</strong> The protective sheath covering the plumule.
              </li>
              <li>
                <strong>Coleorhiza:</strong> The protective sheath covering the radicle.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Internal Parts of a Bean Seed (Dicot)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Cotyledons (two):</strong> The two seed leaves that contain
                stored food for the embryo. They provide nutrients for germination.
              </li>
              <li>
                <strong>Embryo:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Plumule:</strong> The embryonic shoot.
                  </li>
                  <li>
                    <strong>Radicle:</strong> The embryonic root.
                  </li>
                  <li>
                    <strong>Epicotyl:</strong> The part of the stem above the cotyledons.
                  </li>
                  <li>
                    <strong>Hypocotyl:</strong> The part of the stem below the cotyledons.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="maize-bean-seed-structure.png"
              alt="A 2D diagram showing the external and internal parts of maize seed (endosperm, cotyledon, embryo, coleoptile) and bean seed (cotyledons, embryo, plumule, radicle)"
              caption="Structure of maize and bean seeds."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Plant Processes</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Sexual:</strong> pollination, fertilisation, seeds</li>
            <li><strong>Asexual:</strong> budding, layering, cuttings</li>
            <li><strong>Germination:</strong> water, oxygen, temperature</li>
            <li><strong>Maize seed:</strong> endosperm, cotyledon, embryo</li>
            <li><strong>Bean seed:</strong> two cotyledons, embryo</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'crop-production',
      title: 'Crop Production',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Orchard Establishment">
            <p>
              <strong>Definition:</strong> An orchard is a piece of land where fruit
              trees are grown. Orchard establishment involves careful planning and
              preparation to ensure the long-term success of the fruit trees.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Site Selection</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Climate:</strong> The area should have suitable temperature,
                rainfall, and sunlight for the chosen fruit species. Some fruits
                need subtropical conditions (citrus, mangoes), while others need
                temperate conditions (apples, peaches).
              </li>
              <li>
                <strong>Soil:</strong> Deep, well-drained soils with good fertility.
                Soil pH should be appropriate for the fruit species (e.g., citrus
                prefers slightly acidic to neutral soil).
              </li>
              <li>
                <strong>Water supply:</strong> Access to a reliable water source
                for irrigation, especially during dry periods.
              </li>
              <li>
                <strong>Topography:</strong> Gentle slopes are ideal for drainage
                and air circulation. Avoid steep slopes and areas prone to frost.
              </li>
              <li>
                <strong>Accessibility:</strong> The orchard should be accessible by
                road for transporting inputs and produce.
              </li>
              <li>
                <strong>Protection from wind:</strong> The site should be sheltered
                from strong winds (windbreaks may be needed).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Land Preparation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Clearing:</strong> Remove vegetation, trees, and debris from
                the site.
              </li>
              <li>
                <strong>Ploughing:</strong> Deep ploughing (30-40cm) to break up
                hardpans and improve drainage.
              </li>
              <li>
                <strong>Harrowing:</strong> Break up soil clods and level the land.
              </li>
              <li>
                <strong>Soil testing:</strong> Test soil for pH, nutrients, and
                organic matter. Apply lime or fertilisers as needed.
              </li>
              <li>
                <strong>Drainage:</strong> Ensure proper drainage to prevent
                waterlogging, which can damage tree roots.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Planting Patterns and Pegging</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Planting pattern:</strong> The arrangement of trees in the
                orchard. Common patterns include square, rectangular, triangular,
                and quincunx.
              </li>
              <li>
                <strong>Spacing:</strong> The distance between trees depends on the
                species, rootstock, and growing conditions. Typical spacing:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Citrus:</strong> 6m x 6m or 8m x 8m.</li>
                  <li><strong>Mangoes:</strong> 10m x 10m or 12m x 12m.</li>
                  <li><strong>Deciduous fruits:</strong> 4m x 4m or 5m x 5m.</li>
                </ul>
              </li>
              <li>
                <strong>Pegging:</strong> Marking the planting positions in the field
                using stakes or pegs. This ensures straight rows and correct spacing.
              </li>
              <li>
                <strong>Example:</strong> For a citrus orchard with 6m x 6m spacing,
                pegs are placed 6m apart in both directions.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Planting Holes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Size:</strong> Planting holes should be large enough to
                accommodate the root system. Typically 60-90cm wide and deep.
              </li>
              <li>
                <strong>Preparation:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Dig the hole and separate the topsoil and subsoil.</li>
                  <li>Mix the topsoil with compost or manure.</li>
                  <li>Place the tree in the hole and spread the roots.</li>
                  <li>Backfill with the soil mixture, firming the soil around the roots.</li>
                  <li>Water thoroughly after planting.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="orchard-establishment.png"
              alt="A 2D diagram showing orchard establishment: site selection, land preparation, planting patterns (square, rectangular), and planting holes"
              caption="Orchard establishment: site selection, land preparation, and planting."
            />
          </SubtopicCard>

          <SubtopicCard title="Fertiliser Calculation">
            <p>
              <strong>Definition:</strong> Fertiliser calculation involves
              determining the correct amount of fertiliser to apply to a crop
              based on soil test results, crop nutrient requirements, and the
              nutrient content of the fertiliser.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Steps for Fertiliser Calculation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Soil test:</strong> Analyse the soil to determine the
                available nutrients (N, P, K) and soil pH.
              </li>
              <li>
                <strong>Crop requirement:</strong> Determine the nutrient requirements
                of the crop. This depends on the crop type, yield target, and growth stage.
              </li>
              <li>
                <strong>Nutrient content of fertiliser:</strong> Check the NPK ratio
                of the fertiliser (e.g., 20-10-10 means 20% N, 10% P₂O₅, 10% K₂O).
              </li>
              <li>
                <strong>Calculate:</strong> Use the formula:
                <br />
                Amount of fertiliser needed = (Nutrient required ÷ % Nutrient in fertiliser) × 100
              </li>
              <li>
                <strong>Example:</strong> If maize needs 100 kg of N per hectare,
                and you are using urea (46% N), you need:
                <br />
                100 ÷ 46 × 100 = 217 kg of urea per hectare.
              </li>
            </ul>

            <AgricultureImage
              fileName="fertiliser-calculation.png"
              alt="A 2D diagram showing fertiliser calculation steps: soil test, crop requirement, fertiliser nutrient content, and calculation example"
              caption="Fertiliser calculation for crop production."
            />
          </SubtopicCard>

          <SubtopicCard title="Irrigation Scheduling">
            <p>
              <strong>Definition:</strong> Irrigation scheduling is the planning of
              when and how much water to apply to crops. It ensures that crops
              receive the right amount of water at the right time, improving yields
              and saving water.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Factors influencing irrigation scheduling:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Soil type:</strong> Sandy soils need more frequent
                    watering than clay soils.
                  </li>
                  <li>
                    <strong>Crop type:</strong> Different crops have different water
                    needs (e.g., rice needs more water than maize).
                  </li>
                  <li>
                    <strong>Growth stage:</strong> Water needs vary with growth stage
                    (e.g., flowering and fruiting need more water).
                  </li>
                  <li>
                    <strong>Weather:</strong> High temperatures and wind increase
                    water loss, requiring more water.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Soil moisture monitoring:</strong> Using sensors or
                    feel to check soil moisture.
                  </li>
                  <li>
                    <strong>Evapotranspiration (ET) based scheduling:</strong> Using
                    weather data to estimate water loss and schedule irrigation.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="irrigation-scheduling.png"
              alt="A 2D diagram showing irrigation scheduling factors: soil type, crop type, growth stage, and weather"
              caption="Irrigation scheduling: factors and methods."
            />
          </SubtopicCard>

          <SubtopicCard title="Pruning">
            <p>
              <strong>Definition:</strong> Pruning is the selective removal of plant
              parts (branches, leaves, shoots) to improve plant growth, yield, and quality.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Objectives of pruning:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Remove dead, diseased, or damaged branches.</li>
                  <li>Improve air circulation and sunlight penetration.</li>
                  <li>Shape the plant for better growth.</li>
                  <li>Improve fruit size and quality.</li>
                  <li>Encourage new growth and fruiting wood.</li>
                </ul>
              </li>
              <li>
                <strong>Types of pruning:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Formative pruning:</strong> Done in the early years to
                    shape the tree (open centre, central leader, etc.).
                  </li>
                  <li>
                    <strong>Maintenance pruning:</strong> Done regularly to remove
                    unwanted growth and maintain shape.
                  </li>
                  <li>
                    <strong>Rejuvenation pruning:</strong> Done on old trees to
                    stimulate new growth and improve fruiting.
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="pruning-techniques.png"
              alt="A 2D diagram showing pruning techniques: formative pruning, maintenance pruning, and rejuvenation pruning"
              caption="Pruning techniques for orchard trees."
            />
          </SubtopicCard>

          <SubtopicCard title="Fire Guards">
            <p>
              <strong>Definition:</strong> Fire guards (also called firebreaks) are
              cleared strips of land that prevent fires from spreading. They are
              essential for protecting orchards and plantations from veld fires.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Purpose:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Prevent fires from entering the orchard.</li>
                  <li>Provide access for firefighting equipment.</li>
                </ul>
              </li>
              <li>
                <strong>Construction:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Clearing a strip of land (5-10m wide) around the orchard.</li>
                  <li>Removing all vegetation and leaving bare soil.</li>
                  <li>Maintaining fire guards by regularly clearing regrowth.</li>
                </ul>
              </li>
              <li>
                <strong>Importance:</strong> Fire guards can save an orchard from
                being destroyed by veld fires.
              </li>
            </ul>

            <AgricultureImage
              fileName="fire-guards-orchard.png"
              alt="A 2D diagram showing fire guards (firebreaks) around an orchard to prevent fires"
              caption="Fire guards for orchard protection."
            />
          </SubtopicCard>

          <SubtopicCard title="Signs of Maturity">
            <p>
              <strong>Definition:</strong> Signs of maturity are indicators that
              fruits are ready for harvesting. Knowing when to harvest is important
              for fruit quality, shelf life, and market value.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Visual signs:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Change in colour (e.g., green to yellow/orange for citrus,
                    green to red for tomatoes).</li>
                  <li>Increase in size.</li>
                  <li>Skin texture (e.g., smooth, waxy).</li>
                </ul>
              </li>
              <li>
                <strong>Physical signs:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Ease of detachment (fruits come off easily).</li>
                  <li>Firmness (some fruits soften as they ripen).</li>
                </ul>
              </li>
              <li>
                <strong>Chemical signs:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Change in sugar content (Brix level).</li>
                  <li>Change in acidity.</li>
                </ul>
              </li>
              <li>
                <strong>Counting days from flowering:</strong> Some fruits have a
                known number of days from flowering to maturity (e.g., maize 90-120 days).
              </li>
            </ul>

            <AgricultureImage
              fileName="fruit-maturity-signs.png"
              alt="A 2D diagram showing signs of fruit maturity: visual signs (colour change, size), physical signs (firmness, detachment), and chemical signs (sugar content)"
              caption="Signs of maturity in fruit crops."
            />
          </SubtopicCard>

          <SubtopicCard title="Marketing Orchard Fruits">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Deciduous Fruits</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Fruits that grow on trees that lose
                their leaves in winter (e.g., apples, peaches, pears, plums).
              </li>
              <li>
                <strong>Marketing:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Sold fresh in local markets and supermarkets.</li>
                  <li>Some are processed (juice, jams, canned fruit).</li>
                  <li>Exported to countries with demand (e.g., apples to South Africa).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Subtropical Fruits</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Fruits that grow in subtropical climates
                (e.g., citrus, mangoes, avocados, litchis).
              </li>
              <li>
                <strong>Marketing:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Sold fresh in local markets and exported.</li>
                  <li>Processed into juice (orange juice).</li>
                  <li>Grown commercially in the Lowveld of Zimbabwe (citrus, mangoes).</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Citrus Fruits</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Fruits from the genus Citrus (oranges,
                lemons, grapefruit, limes, mandarins).
              </li>
              <li>
                <strong>Marketing:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Sold fresh in local and export markets.</li>
                  <li>Processed into juice, concentrates, and essential oils.</li>
                  <li>Zimbabwe exports citrus to Europe and other African countries.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="orchard-fruit-marketing.png"
              alt="A 2D diagram showing marketing of orchard fruits: deciduous fruits (apples, peaches), subtropical fruits (mangoes, avocados), and citrus fruits (oranges, lemons)"
              caption="Marketing of deciduous, subtropical, and citrus orchard fruits."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Crop Production</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Orchard:</strong> site, land prep, planting, pegging</li>
            <li><strong>Fertiliser:</strong> soil test, crop needs, calculation</li>
            <li><strong>Irrigation:</strong> scheduling, factors, methods</li>
            <li><strong>Pruning:</strong> formative, maintenance, rejuvenation</li>
            <li><strong>Fire guards:</strong> firebreaks, protection</li>
            <li><strong>Maturity:</strong> visual, physical, chemical signs</li>
            <li><strong>Marketing:</strong> deciduous, subtropical, citrus</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'crop-protection',
      title: 'Crop Protection',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Pest Life Cycles">
            <p>
              <strong>Definition:</strong> The life cycle of a pest is the sequence
              of stages it goes through from egg to adult. Understanding pest life
              cycles helps in planning effective pest control measures.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Complete Metamorphosis</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The insect goes through four distinct
                stages: egg → larva → pupa → adult.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Each stage looks very different from the others.</li>
                  <li>The larva is the main feeding stage (causes most damage).</li>
                  <li>The pupa is a resting stage (cocoon or chrysalis).</li>
                  <li>The adult stage is the reproductive stage (egg-laying).</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Cabbage butterfly:</strong> Egg → caterpillar (larva) → chrysalis (pupa) → adult butterfly.</li>
                  <li><strong>Maize stem borer:</strong> Egg → caterpillar (larva) → pupa → adult moth.</li>
                  <li><strong>Fruit flies:</strong> Egg → maggot (larva) → pupa → adult fly.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Cabbage caterpillar (damages
                cabbage), African armyworm (damages maize and cereals), maize stem
                borer (damages maize).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Incomplete Metamorphosis</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The insect goes through three stages:
                egg → nymph → adult. There is no pupal stage.
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>The nymph looks similar to the adult but is smaller and lacks wings.</li>
                  <li>Nymphs moult (shed their skin) several times as they grow.</li>
                  <li>Both nymphs and adults can cause damage (they feed on plants).</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Aphids:</strong> Egg → nymph → adult (winged or wingless).</li>
                  <li><strong>Grasshoppers:</strong> Egg → nymph (hopper) → adult.</li>
                  <li><strong>Termites:</strong> Egg → nymph → adult (workers, soldiers, reproductive).</li>
                  <li><strong>Thrips:</strong> Egg → nymph → adult.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Aphids (damage vegetables, tobacco),
                grasshoppers (damage many crops), termites (damage crops in dry areas).
              </li>
            </ul>

            <AgricultureImage
              fileName="pest-life-cycles.png"
              alt="A 2D diagram showing complete metamorphosis (egg → larva → pupa → adult) and incomplete metamorphosis (egg → nymph → adult) with examples"
              caption="Pest life cycles: complete and incomplete metamorphosis."
            />
          </SubtopicCard>

          <SubtopicCard title="How Plant Diseases Spread">
            <p>
              <strong>Definition:</strong> Plant diseases can spread from plant to
              plant through various means. Understanding how diseases spread is
              important for implementing effective control measures.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Wind:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fungal spores can be carried long distances by wind.</li>
                  <li>Examples: Rust, powdery mildew, blight.</li>
                </ul>
              </li>
              <li>
                <strong>Water (rain, irrigation):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Disease organisms are splashed by rain or irrigation water.</li>
                  <li>Examples: Bacterial wilt, blight, downy mildew.</li>
                </ul>
              </li>
              <li>
                <strong>Insects (vectors):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Insects carry pathogens from one plant to another.</li>
                  <li>Examples: Aphids transmit viruses; whiteflies transmit viruses.</li>
                </ul>
              </li>
              <li>
                <strong>Soil:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Pathogens live in the soil and infect plants through roots.</li>
                  <li>Examples: Fusarium wilt, nematodes, bacterial wilt.</li>
                </ul>
              </li>
              <li>
                <strong>Seed:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Disease organisms are carried on or in seeds.</li>
                  <li>Examples: Bacterial spot on tomatoes, smut on maize.</li>
                </ul>
              </li>
              <li>
                <strong>Human activities:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Tools, equipment, and hands can carry diseases.</li>
                  <li>Example: Tobacco mosaic virus spread by handling infected plants.</li>
                </ul>
              </li>
              <li>
                <strong>Plant debris:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Disease organisms survive on infected plant debris.</li>
                  <li>Examples: Blight, rust.</li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="disease-spread-methods.png"
              alt="A 2D diagram showing how plant diseases spread: wind, water, insects, soil, seed, human activities, and plant debris"
              caption="How plant diseases spread: methods of disease transmission."
            />
          </SubtopicCard>

          <SubtopicCard title="Symptoms of Plant Diseases">
            <p>
              <strong>Definition:</strong> Symptoms are the visible signs of disease
              in plants. Different types of diseases cause different symptoms.
              Recognising symptoms helps in diagnosing the disease and choosing
              the right treatment.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Fungal Diseases</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Symptoms:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Leaf spots:</strong> Brown, yellow, or black spots on
                    leaves (e.g., rust, blight).
                  </li>
                  <li>
                    <strong>Powdery growth:</strong> White or grey powdery coating
                    on leaves (e.g., powdery mildew).
                  </li>
                  <li>
                    <strong>Wilting:</strong> Plant wilts and dies (e.g., Fusarium wilt).
                  </li>
                  <li>
                    <strong>Rotting:</strong> Soft rot of fruits, stems, or roots
                    (e.g., root rot, fruit rot).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Late blight in tomatoes, rust
                in beans, powdery mildew in cucurbits.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Bacterial Diseases</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Symptoms:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Wilting:</strong> Sudden wilting, often without yellowing
                    (e.g., bacterial wilt).
                  </li>
                  <li>
                    <strong>Leaf spots:</strong> Water-soaked spots on leaves
                    (e.g., bacterial leaf spot).
                  </li>
                  <li>
                    <strong>Rotting:</strong> Soft rot of tissues (e.g., black rot in cabbage).
                  </li>
                  <li>
                    <strong>Bacterial ooze:</strong> Sticky fluid oozing from infected
                    tissues (e.g., bacterial wilt).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Bacterial wilt in tomatoes and
                potatoes, black rot in cabbage.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Viral Diseases</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Symptoms:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Mosaic patterns:</strong> Yellow and green patches on
                    leaves (e.g., maize streak virus, tomato mosaic virus).
                  </li>
                  <li>
                    <strong>Stunted growth:</strong> Plants are smaller and weaker
                    (e.g., cassava mosaic virus).
                  </li>
                  <li>
                    <strong>Leaf curling:</strong> Leaves curl or deform (e.g., leaf curl virus).
                  </li>
                  <li>
                    <strong>Yellowing:</strong> Leaves turn yellow (chlorosis).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Maize streak virus (common in
                maize), tomato spotted wilt virus (common in tomatoes).
              </li>
            </ul>

            <AgricultureImage
              fileName="disease-symptoms.png"
              alt="A 2D diagram showing symptoms of fungal diseases (leaf spots, powdery growth, wilting), bacterial diseases (wilting, leaf spots, rotting), and viral diseases (mosaic patterns, stunted growth, leaf curling)"
              caption="Symptoms of fungal, bacterial, and viral diseases."
            />
          </SubtopicCard>

          <SubtopicCard title="Weed Classification">
            <p>
              <strong>Definition:</strong> Weeds can be classified into different
              groups based on their leaf shape, growth habit, and life cycle.
              Understanding weed classification helps in choosing the right control methods.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Narrow-leaved Weeds (Grasses)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Weeds with long, narrow leaves (monocotyledons).
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Parallel leaf veins.</li>
                  <li>Fibrous root systems.</li>
                  <li>Often perennial (live for many years) or annual.</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Bermuda grass (Cynodon dactylon):</strong> Perennial, spreading grass.</li>
                  <li><strong>Goosegrass (Eleusine indica):</strong> Annual grass.</li>
                  <li><strong>Wild sorghum (Sorghum halepense):</strong> Perennial grass (Johnson grass).</li>
                  <li><strong>Couch grass (Agropyron repens):</strong> Perennial grass.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Bermuda grass (common in lawns
                and fields), goosegrass (common in disturbed areas), Johnson grass
                (common in fields and roadsides).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Broad-leaved Weeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Weeds with broad leaves (dicotyledons).
              </li>
              <li>
                <strong>Characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Netted leaf veins.</li>
                  <li>Tap root systems.</li>
                  <li>Includes annual and perennial species.</li>
                </ul>
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li><strong>Blackjack (Bidens pilosa):</strong> Annual weed with sticky seeds.</li>
                  <li><strong>Pigweed (Amaranthus spp.):</strong> Annual weed, common in gardens.</li>
                  <li><strong>Wild pumpkin (Cucurbita spp.):</strong> Trailing weed.</li>
                  <li><strong>Lantana (Lantana camara):</strong> Perennial shrub, invasive.</li>
                  <li><strong>Mexican poppy (Argemone mexicana):</strong> Prickly weed.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Blackjack (common in fields and
                gardens), pigweed (common in disturbed areas), lantana (invasive in
                many areas), Mexican poppy (common in dry areas).
              </li>
            </ul>

            <AgricultureImage
              fileName="weed-classification.png"
              alt="A 2D diagram showing weed classification: narrow-leaved weeds (grasses) and broad-leaved weeds with examples"
              caption="Classification of weeds: narrow-leaved and broad-leaved weeds."
            />
          </SubtopicCard>

          <SubtopicCard title="Modes of Weed Spread">
            <p>
              <strong>Definition:</strong> Weeds spread from one area to another
              through various means. Understanding how weeds spread helps in
              implementing effective control measures.
            </p>

            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Seed dispersal:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Wind:</strong> Seeds are carried by wind (e.g., dandelion,
                    thistles, ragweed).
                  </li>
                  <li>
                    <strong>Water:</strong> Seeds are carried by water (rivers,
                    irrigation) (e.g., many aquatic and wetland weeds).
                  </li>
                  <li>
                    <strong>Animals:</strong> Seeds are carried in animal fur, feathers,
                    or digestive systems (e.g., blackjack, burs, cockleburs).
                  </li>
                  <li>
                    <strong>Human activities:</strong> Seeds are carried on clothing,
                    machinery, vehicles, or in contaminated seed (e.g., weed seeds
                    in crop seed).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Vegetative spread:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Rhizomes:</strong> Underground stems that spread (e.g.,
                    Bermuda grass, couch grass).
                  </li>
                  <li>
                    <strong>Stolons:</strong> Above-ground runners that root at nodes
                    (e.g., strawberry weeds, creeping grasses).
                  </li>
                  <li>
                    <strong>Bulbs and tubers:</strong> Underground storage organs
                    that produce new plants (e.g., nutgrass, wild garlic).
                  </li>
                  <li>
                    <strong>Cuttings:</strong> Plant fragments can root and grow
                    (e.g., lantana, willow).
                  </li>
                </ul>
              </li>
            </ul>

            <AgricultureImage
              fileName="weed-spread-modes.png"
              alt="A 2D diagram showing modes of weed spread: seed dispersal (wind, water, animals, human) and vegetative spread (rhizomes, stolons, bulbs, tubers, cuttings)"
              caption="Modes of weed spread: seed dispersal and vegetative spread."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Crop Protection</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Pest life cycles:</strong> complete (4 stages), incomplete (3 stages)</li>
            <li><strong>Disease spread:</strong> wind, water, insects, soil, seed, human</li>
            <li><strong>Fungal symptoms:</strong> leaf spots, powdery growth, wilting</li>
            <li><strong>Bacterial symptoms:</strong> wilting, leaf spots, rotting</li>
            <li><strong>Viral symptoms:</strong> mosaic, stunted growth, curling</li>
            <li><strong>Weed types:</strong> narrow-leaved (grasses), broad-leaved</li>
            <li><strong>Weed spread:</strong> seed dispersal, vegetative spread</li>
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
            Crop Husbandry
          </h1>
          <p className="text-lg text-green-100 max-w-2xl leading-relaxed">
            Explore plant classification, flower structure, plant processes
            (reproduction, pollination, germination), crop production (orchard
            establishment, fertiliser calculation, irrigation, pruning), and crop
            protection (pest life cycles, disease spread, weed classification).
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
                  <strong className="text-white">Plant Classification:</strong> Monocots
                  (one cotyledon, parallel veins, fibrous roots) vs Dicots (two cotyledons,
                  netted veins, tap roots). Botanical classes include legumes,
                  brassicas, solanaceous, cereals, and cucurbits.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Flower Structure:</strong> Sepals
                  protect the bud; petals attract pollinators; stamens (anther +
                  filament) produce pollen; carpels (stigma + style + ovary + ovules)
                  produce seeds.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Plant Processes:</strong> Sexual
                  reproduction (pollination, fertilisation, seeds) and asexual
                  reproduction (budding, layering, cuttings). Germination requires
                  water, oxygen, temperature, and light.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Crop Production:</strong> Orchard
                  establishment involves site selection, land preparation, planting
                  patterns, and planting holes. Fertilisers are calculated based on
                  soil tests and crop requirements. Irrigation scheduling, pruning,
                  fire guards, and marketing are essential for fruit production.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Crop Protection:</strong> Pests
                  have complete (egg → larva → pupa → adult) or incomplete (egg →
                  nymph → adult) metamorphosis. Diseases spread through wind, water,
                  insects, soil, seed, and human activities. Weeds are classified
                  as narrow-leaved (grasses) or broad-leaved.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Crop Husbandry topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
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

export default CropHusbandry;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/agriculture/
   Use a mix of 2D diagram style and realistic photographs.

   --- PLANT CLASSIFICATION IMAGES (2D DIAGRAM STYLE) ---

   1. monocot-dicot-comparison.png
      A 2D diagram comparing monocot and dicot plants:
      - Seed (one vs two cotyledons)
      - Leaf venation (parallel vs netted)
      - Root system (fibrous vs tap root)
      - Stem (scattered vs ring vascular bundles)
      - Flower (parts in threes vs fours/fives)
      Label all parts clearly.

   2. botanical-classes-crops.png
      A 2D diagram showing botanical classes:
      - Legumes (beans, groundnuts) – nitrogen-fixing, pods
      - Brassicas (cabbage, rape) – cross-shaped flowers
      - Solanaceous (tomatoes, tobacco) – star-shaped flowers
      - Cereals (maize, sorghum) – grasses, grains
      - Cucurbits (pumpkin, butternut) – vines, fleshy fruits
      Include examples and key characteristics.

   --- FLOWER STRUCTURE IMAGES (2D DIAGRAM STYLE) ---

   3. maize-flower-structure.png
      A 2D diagram showing maize flowers:
      - Male flower (tassel) at the top
      - Female flower (ear) in leaf axils
      - Silk (stigma) and cob
      Label all parts.

   4. bean-flower-structure.png
      A 2D diagram showing a bean flower:
      - Sepals, petals (banner, wings, keel)
      - Stamens (anther, filament)
      - Carpel (stigma, style, ovary, ovules)
      Label all parts.

   5. flower-parts-functions.png
      A 2D diagram showing the parts of a flower:
      - Sepals (protect bud)
      - Petals (attract pollinators)
      - Stamens (male: anther + filament)
      - Carpel (female: stigma + style + ovary + ovules)
      Label each part with its function.

   --- PLANT PROCESSES IMAGES (2D DIAGRAM STYLE) ---

   6. sexual-asexual-reproduction.png
      A 2D diagram comparing sexual reproduction (flower, pollination, seed) and
      asexual reproduction (cuttings, runners, tubers, bulbs).

   7. pollination-fertilisation-maize-bean.png
      A 2D diagram showing pollination and fertilisation in maize (wind pollination,
      silk, kernel) and bean (self-pollination, pod, seed).

   8. asexual-reproduction-methods.png
      A 2D diagram showing budding (T-budding) and layering (simple layering,
      air layering).

   9. germination-emergence.png
      A 2D diagram showing germination (radicle emerging from seed) and emergence
      (seedling above soil).

   10. maize-bean-seed-structure.png
       A 2D diagram showing external and internal parts of maize seed (endosperm,
       cotyledon, embryo, coleoptile) and bean seed (cotyledons, embryo, plumule,
       radicle).

   --- CROP PRODUCTION IMAGES (2D DIAGRAM AND REALISTIC) ---

   11. orchard-establishment.png
       A 2D diagram showing orchard establishment: site selection, land preparation,
       planting patterns (square, rectangular), and planting holes.

   12. fertiliser-calculation.png
       A 2D diagram showing fertiliser calculation steps: soil test, crop requirement,
       fertiliser nutrient content, and calculation example.

   13. irrigation-scheduling.png
       A 2D diagram showing irrigation scheduling factors: soil type, crop type,
       growth stage, and weather.

   14. pruning-techniques.png
       A 2D diagram showing pruning techniques: formative pruning, maintenance pruning,
       and rejuvenation pruning.

   15. fire-guards-orchard.png
       A 2D diagram showing fire guards (firebreaks) around an orchard.

   16. fruit-maturity-signs.png
       A 2D diagram showing signs of fruit maturity: visual (colour, size),
       physical (firmness, detachment), and chemical (sugar content).

   17. orchard-fruit-marketing.png
       A 2D diagram showing marketing of deciduous fruits (apples, peaches),
       subtropical fruits (mangoes, avocados), and citrus fruits (oranges, lemons).

   --- CROP PROTECTION IMAGES (2D DIAGRAM STYLE) ---

   18. pest-life-cycles.png
       A 2D diagram showing complete metamorphosis (egg → larva → pupa → adult)
       and incomplete metamorphosis (egg → nymph → adult) with examples.

   19. disease-spread-methods.png
       A 2D diagram showing how plant diseases spread: wind, water, insects, soil,
       seed, human activities, and plant debris.

   20. disease-symptoms.png
       A 2D diagram showing symptoms of fungal diseases (leaf spots, powdery growth,
       wilting), bacterial diseases (wilting, leaf spots, rotting), and viral
       diseases (mosaic patterns, stunted growth, leaf curling).

   21. weed-classification.png
       A 2D diagram showing weed classification: narrow-leaved weeds (grasses)
       and broad-leaved weeds with examples.

   22. weed-spread-modes.png
       A 2D diagram showing modes of weed spread: seed dispersal (wind, water,
       animals, human) and vegetative spread (rhizomes, stolons, bulbs, tubers,
       cuttings).

   ============================================================ */