import React, { useState, useRef } from 'react';

/**
 * Topic: Animal Husbandry
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const AnimalHusbandry: React.FC = () => {
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
  const AnimalImage: React.FC<{
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
              Place this file in <strong>public/images/animal-husbandry/</strong>
            </p>
          </div>
        ) : (
          <img
            src={`/images/animal-husbandry/${fileName}`}
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
      id: 'types-livestock',
      title: 'Types of Livestock',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Ruminant vs Non‑Ruminant Animals">
            <p>
              <strong>Definition:</strong> Livestock animals are classified into
              two main groups based on their digestive system: <strong>ruminants</strong>
              and <strong>non‑ruminants</strong> (monogastrics). This classification
              affects what they eat, how they digest food, and how they are managed.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ruminants</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Ruminants are mammals that digest
                plant‑based food through fermentation in a specialised stomach
                with four compartments: <strong>rumen</strong>, <strong>reticulum</strong>,
                <strong>omasum</strong>, and <strong>abomasum</strong>.
              </li>
              <li>
                <strong>Distinguishing characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Stomach structure:</strong> Four chambers (rumen,
                    reticulum, omasum, abomasum).
                  </li>
                  <li>
                    <strong>Digestion:</strong> They ferment food (regurgitate
                    and re‑chew) – this is called <em>rumination</em> or chewing
                    the cud.
                  </li>
                  <li>
                    <strong>Feeding:</strong> Herbivores – eat grass, leaves, and
                    other plant material.
                  </li>
                  <li>
                    <strong>Examples:</strong> Cattle, sheep, goats, buffalo,
                    giraffes, deer.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Beef cattle (e.g., Brahman,
                Mashona, Nguni), dairy cattle (e.g., Holstein, Jersey), sheep
                (e.g., Merino, Dorper), goats (e.g., Matabele, Boer).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Non‑Ruminants (Monogastrics)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Non‑ruminants are animals that have
                a single‑chambered stomach. They cannot digest cellulose (plant
                fibre) as efficiently as ruminants.
              </li>
              <li>
                <strong>Distinguishing characteristics:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Stomach structure:</strong> Single stomach (simple
                    or monogastric).
                  </li>
                  <li>
                    <strong>Digestion:</strong> No rumination; digestion occurs
                    through enzymatic breakdown in the stomach and intestines.
                  </li>
                  <li>
                    <strong>Feeding:</strong> Can be omnivores (pigs, poultry) or
                    herbivores with a different digestive strategy (rabbits, horses).
                  </li>
                  <li>
                    <strong>Examples:</strong> Pigs, poultry (chickens, ducks,
                    turkeys), rabbits, horses, guinea pigs.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe examples:</strong> Pigs (e.g., Large White,
                Landrace), poultry (broilers, layers), rabbits (e.g., New Zealand
                White), and horses.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Comparison Table: Ruminants vs Non‑Ruminants</h4>
            <table className="w-full border-collapse border border-slate-300 text-sm">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Feature</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Ruminants</th>
                  <th className="border border-slate-300 px-4 py-2 text-left font-bold">Non‑Ruminants</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Stomach</td>
                  <td className="border border-slate-300 px-4 py-2">Four chambers</td>
                  <td className="border border-slate-300 px-4 py-2">Single chamber</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Rumination (cud chewing)</td>
                  <td className="border border-slate-300 px-4 py-2">Yes</td>
                  <td className="border border-slate-300 px-4 py-2">No</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Digestion of cellulose</td>
                  <td className="border border-slate-300 px-4 py-2">Efficient</td>
                  <td className="border border-slate-300 px-4 py-2">Limited</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Feed type</td>
                  <td className="border border-slate-300 px-4 py-2">Herbivores (grass, hay)</td>
                  <td className="border border-slate-300 px-4 py-2">Omnivores or herbivores</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">Examples</td>
                  <td className="border border-slate-300 px-4 py-2">Cattle, sheep, goats</td>
                  <td className="border border-slate-300 px-4 py-2">Pigs, poultry, rabbits</td>
                </tr>
              </tbody>
            </table>

            <AnimalImage
              fileName="ruminant-nonruminant-comparison.png"
              alt="A 2D diagram comparing ruminants (cattle, sheep, goats with four-chambered stomach) and non-ruminants (pigs, poultry, rabbits with single stomach)"
              caption="Comparison of ruminants and non‑ruminants."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Ruminant:</strong> four‑stomach animal (cattle, sheep, goats)</li>
            <li><strong>Non‑ruminant (monogastric):</strong> single stomach (pigs, poultry)</li>
            <li><strong>Rumination:</strong> chewing the cud</li>
            <li><strong>Rumen, reticulum, omasum, abomasum:</strong> four stomach chambers</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'anatomy-physiology',
      title: 'Anatomy and Physiology – Poultry Reproduction',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Reproductive System of a Hen and Cock">
            <p>
              <strong>Definition:</strong> The reproductive system of poultry is
              specialised for producing eggs and fertilising them. Males (cocks)
              and females (hens) have different reproductive organs.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Reproductive System of a Hen (Female)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Ovary:</strong> A hen has only one functional ovary (the
                left one). It produces yolk (ovum). The ovary contains many
                ova at different stages of development.
              </li>
              <li>
                <strong>Oviduct:</strong> A long, coiled tube where the egg is
                formed. It has several parts:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Infundibulum (funnel):</strong> Catches the yolk after
                    it is released from the ovary. Fertilisation occurs here if
                    sperm is present.
                  </li>
                  <li>
                    <strong>Magnum:</strong> Where the albumen (egg white) is added.
                  </li>
                  <li>
                    <strong>Isthmus:</strong> Where the inner and outer shell
                    membranes are added.
                  </li>
                  <li>
                    <strong>Shell gland (uterus):</strong> Where the eggshell is
                    added (calcium carbonate). This is where the egg spends the
                    longest time (about 20 hours).
                  </li>
                  <li>
                    <strong>Vagina:</strong> The final part of the oviduct, where
                    the egg is held before laying.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Cloaca:</strong> The common opening for the reproductive,
                urinary, and digestive systems. The egg passes through the cloaca
                when laid.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Reproductive System of a Cock (Male)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Testes:</strong> A cock has two testes located inside the
                body (not external like in mammals). They produce sperm.
              </li>
              <li>
                <strong>Vas deferens:</strong> Tubes that carry sperm from the
                testes to the cloaca.
              </li>
              <li>
                <strong>Cloaca:</strong> The common opening. The cock does not have
                a penis; instead, sperm is transferred through the cloaca during
                mating (cloacal kiss).
              </li>
              <li>
                <strong>Accessory glands:</strong> A cock has accessory glands
                (seminal vesicles) that produce fluids to nourish and transport sperm.
              </li>
            </ul>

            <AnimalImage
              fileName="hen-cock-reproductive-system.png"
              alt="A 2D diagram showing the reproductive system of a hen (ovary, oviduct with parts) and a cock (testes, vas deferens, cloaca)"
              caption="Reproductive systems of a hen and a cock."
            />
          </SubtopicCard>

          <SubtopicCard title="Egg Formation Process">
            <p>
              <strong>Definition:</strong> Egg formation (oviposition) is the
              process by which a hen produces an egg. It takes about 24–26 hours
              from ovulation to laying.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Step 1 – Ovulation:</strong> A yolk (ovum) is released
                from the ovary into the infundibulum (funnel). This usually happens
                about 30 minutes after the previous egg is laid.
              </li>
              <li>
                <strong>Step 2 – Fertilisation (if mating occurs):</strong> Sperm
                meets the yolk in the infundibulum. If fertilised, the embryo
                begins to develop.
              </li>
              <li>
                <strong>Step 3 – Albumen (egg white) added:</strong> The yolk moves
                into the magnum, where albumen is added around it. This takes about
                3 hours.
              </li>
              <li>
                <strong>Step 4 – Shell membranes added:</strong> In the isthmus,
                the inner and outer shell membranes are added. This takes about
                1.5 hours.
              </li>
              <li>
                <strong>Step 5 – Shell added:</strong> In the shell gland (uterus),
                calcium carbonate is deposited to form the hard shell. This takes
                the longest – about 20 hours. Pigment (colour) is also added here.
              </li>
              <li>
                <strong>Step 6 – Laying:</strong> The fully formed egg moves into
                the vagina and is laid through the cloaca. The hen's body contracts
                to push the egg out.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Parts and Functions of an Egg">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Shell (outermost layer):</strong>
                <br />
                <strong>Function:</strong> Protects the egg from physical damage
                and bacterial invasion. Made of calcium carbonate. Pores allow
                gas exchange (oxygen in, carbon dioxide out).
              </li>
              <li>
                <strong>Shell membranes (inner and outer):</strong>
                <br />
                <strong>Function:</strong> Protect the egg from bacterial entry.
                The outer membrane is next to the shell; the inner membrane
                surrounds the albumen.
              </li>
              <li>
                <strong>Air cell (air space):</strong>
                <br />
                <strong>Function:</strong> Located at the blunt end of the egg.
                Provides oxygen for the developing embryo. Gets larger as the egg ages.
              </li>
              <li>
                <strong>Albumen (egg white):</strong>
                <br />
                <strong>Function:</strong> Provides water and protein for the
                developing embryo. Also protects the yolk from damage. Contains
                two layers – thick and thin albumen.
              </li>
              <li>
                <strong>Chalaza:</strong>
                <br />
                <strong>Function:</strong> Rope‑like structures that anchor the
                yolk in the centre of the egg. Keeps the yolk properly positioned.
              </li>
              <li>
                <strong>Vitelline membrane:</strong>
                <br />
                <strong>Function:</strong> A thin membrane surrounding the yolk.
                It holds the yolk contents together.
              </li>
              <li>
                <strong>Yolk:</strong>
                <br />
                <strong>Function:</strong> Contains the embryo's food supply
                (fat, protein, vitamins, minerals). If fertilised, the embryo
                develops here.
              </li>
              <li>
                <strong>Germinal disc (blastodisc):</strong>
                <br />
                <strong>Function:</strong> A small spot on the yolk where
                fertilisation occurs. If fertilised, this becomes the embryo.
              </li>
            </ul>

            <AnimalImage
              fileName="egg-structure-functions.png"
              alt="A labelled 2D diagram of an egg showing: shell, shell membranes, air cell, albumen, chalaza, vitelline membrane, yolk, and germinal disc"
              caption="Parts and functions of an egg."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Poultry Reproduction</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Hen:</strong> ovary, oviduct (infundibulum, magnum, isthmus, shell gland, vagina)</li>
            <li><strong>Cock:</strong> testes, vas deferens, cloaca</li>
            <li><strong>Egg formation:</strong> 24–26 hours</li>
            <li><strong>Parts:</strong> shell, albumen, yolk, chalaza, air cell</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'nutrition',
      title: 'Nutrition – Livestock',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Main Nutrients Required by Livestock">
            <p>
              <strong>Definition:</strong> Livestock need a balanced diet containing
              various nutrients to maintain health, growth, reproduction, and
              production (meat, milk, eggs). The main nutrients are:
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Carbohydrates</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Function:</strong> Provide energy for body functions,
                growth, and production. Maintain body temperature.
              </li>
              <li>
                <strong>Deficiency symptoms:</strong> Weight loss, poor growth,
                weakness, reduced production.
              </li>
              <li>
                <strong>Sources:</strong> Grains (maize, wheat, sorghum), grass,
                hay, silage, roots (cassava, sweet potatoes).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Proteins</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Function:</strong> Build and repair body tissues (muscle,
                organs). Essential for growth, egg production, milk production,
                and reproduction.
              </li>
              <li>
                <strong>Deficiency symptoms:</strong> Poor growth, reduced egg
                size and production, poor milk yield, loss of condition.
              </li>
              <li>
                <strong>Sources:</strong> Soya bean meal, cottonseed meal, fish
                meal, meat and bone meal, groundnut cake, sunflower cake, legumes
                (lucerne, beans).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Fats (Lipids)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Function:</strong> Concentrated energy source. Provide
                essential fatty acids. Help absorb fat‑soluble vitamins (A, D, E, K).
              </li>
              <li>
                <strong>Deficiency symptoms:</strong> Poor growth, dry skin, reduced
                reproductive performance.
              </li>
              <li>
                <strong>Sources:</strong> Vegetable oils, animal fats (tallow), oil
                seeds (soyabean, sunflower), fish oil.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Vitamins</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Function:</strong> Essential for many metabolic processes.
                Examples:
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Vitamin A:</strong> Vision, skin, reproduction.
                    Deficiency: night blindness, poor growth.
                  </li>
                  <li>
                    <strong>Vitamin D:</strong> Calcium absorption, bone formation.
                    Deficiency: rickets (weak bones), egg shell thinning.
                  </li>
                  <li>
                    <strong>Vitamin E:</strong> Reproduction, immune function.
                    Deficiency: muscle degeneration (white muscle disease).
                  </li>
                  <li>
                    <strong>Vitamin K:</strong> Blood clotting. Deficiency: bleeding.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Sources:</strong> Green leafy materials (grass, lucerne),
                sun‑dried hay (Vitamin D), supplemented in commercial feeds.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Minerals</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Function:</strong> Essential for bone formation, enzyme
                activity, and body fluid balance.
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Calcium (Ca) &amp; Phosphorus (P):</strong> Bone
                    formation, egg shell quality. Deficiency: rickets, weak shells.
                  </li>
                  <li>
                    <strong>Salt (NaCl):</strong> Fluid balance, nerve function.
                    Deficiency: salt craving, reduced appetite.
                  </li>
                  <li>
                    <strong>Magnesium (Mg):</strong> Enzyme function. Deficiency:
                    grass tetany in cattle.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Sources:</strong> Mineral licks, bone meal, limestone,
                salt blocks, formulated feeds.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Water</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Function:</strong> Essential for all life processes.
                Regulates body temperature, transports nutrients, removes waste.
              </li>
              <li>
                <strong>Deficiency symptoms:</strong> Dehydration, reduced appetite,
                reduced production, death.
              </li>
              <li>
                <strong>Sources:</strong> Fresh, clean water from rivers, dams,
                boreholes, piped water.
              </li>
            </ul>

            <AnimalImage
              fileName="livestock-nutrients.png"
              alt="A 2D diagram showing the main nutrients required by livestock: carbohydrates, proteins, fats, vitamins, minerals, and water with functions and sources"
              caption="Main nutrients required by livestock – functions and sources."
            />
          </SubtopicCard>

          <SubtopicCard title="Nutritional Deficiencies and Their Symptoms">
            <p>
              <strong>Definition:</strong> Nutritional deficiencies occur when an
              animal does not get enough of a particular nutrient. Symptoms vary
              depending on the missing nutrient.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Protein deficiency:</strong> Poor growth, weight loss,
                reduced milk and egg production, weak immune system.
              </li>
              <li>
                <strong>Energy deficiency:</strong> Weight loss, weakness, reduced
                production, the animal becomes thin.
              </li>
              <li>
                <strong>Calcium &amp; Phosphorus deficiency:</strong> Rickets
                (weak bones), thin egg shells, milk fever, poor growth.
              </li>
              <li>
                <strong>Vitamin A deficiency:</strong> Poor vision (night blindness),
                rough coat, infertility, reduced disease resistance.
              </li>
              <li>
                <strong>Vitamin D deficiency:</strong> Rickets, soft bones, egg
                shell thinning.
              </li>
              <li>
                <strong>Iron deficiency:</strong> Anaemia (pale skin, weakness),
                especially in piglets.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Nutrition Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Carbohydrates:</strong> energy (grains, grass)</li>
            <li><strong>Proteins:</strong> growth (soya, fish meal)</li>
            <li><strong>Fats:</strong> energy, vitamins</li>
            <li><strong>Vitamins:</strong> metabolism, reproduction</li>
            <li><strong>Minerals:</strong> bones, egg shells</li>
            <li><strong>Water:</strong> essential for all functions</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'small-livestock-production',
      title: 'Small Livestock Production – Broilers',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Broiler Feed Selection by Age">
            <p>
              <strong>Definition:</strong> Broilers require different feeds at
              different stages of growth to ensure optimal development and
              feed efficiency.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Starter feed (0–14 days):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Nutrient content:</strong> High protein (22–24%),
                    high energy, balanced vitamins and minerals.
                  </li>
                  <li>
                    <strong>Purpose:</strong> Supports rapid growth and development
                    in the early stage.
                  </li>
                  <li>
                    <strong>Form:</strong> Often crumbles or small pellets.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Grower feed (15–28 days):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Nutrient content:</strong> Protein reduced to 20–22%,
                    energy slightly reduced.
                  </li>
                  <li>
                    <strong>Purpose:</strong> Promotes skeletal growth and
                    muscle development at a slower rate.
                  </li>
                  <li>
                    <strong>Form:</strong> Pellets or mash.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Finisher feed (29–42+ days):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Nutrient content:</strong> Lower protein (18–20%),
                    higher energy, may include fat to improve carcass quality.
                  </li>
                  <li>
                    <strong>Purpose:</strong> Promotes finishing (fat deposition)
                    and weight gain for market.
                  </li>
                  <li>
                    <strong>Form:</strong> Pellets.
                  </li>
                </ul>
              </li>
            </ul>
            <p>
              In Zimbabwe, commercial broiler feeds are available from companies
              like <strong>AfriFeeds</strong>, <strong>National Foods</strong>,
              and <strong>Superfeed</strong>. Small‑scale farmers may also use
              home‑mixed feeds using maize, soyabean meal, and supplements.
            </p>

            <AnimalImage
              fileName="broiler-feed-types.png"
              alt="A 2D diagram showing broiler feed types by age: Starter (0-14 days), Grower (15-28 days), Finisher (29-42+ days) with nutrient content"
              caption="Broiler feed selection by age."
            />
          </SubtopicCard>

          <SubtopicCard title="Rearing Broilers – Management Practices">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Brooding:</strong> Provide heat for chicks (32–35°C in
                the first week, reduce by 2°C each week). Use brooders (gas,
                electric, charcoal).
              </li>
              <li>
                <strong>Housing:</strong> Deep litter system is common – use
                wood shavings, rice hulls, or sawdust. Ensure good ventilation,
                adequate space (10–12 birds/m²), and clean water.
              </li>
              <li>
                <strong>Feeding:</strong> Provide fresh feed daily in troughs or
                feeders. Ensure feed is fresh and free from mould.
              </li>
              <li>
                <strong>Watering:</strong> Provide clean, fresh water at all times.
                Use drinkers (bell drinkers, nipple drinkers).
              </li>
              <li>
                <strong>Health management:</strong> Vaccinate against Newcastle
                disease and other common diseases. Monitor for signs of illness.
              </li>
              <li>
                <strong>Biosecurity:</strong> Limit visitors, disinfect footwear,
                and isolate sick birds to prevent disease spread.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Growth Rate Assessment">
            <p>
              <strong>Definition:</strong> Growth rate assessment is the process
              of monitoring how quickly broilers gain weight. It helps farmers
              determine if birds are developing at the expected rate.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Weigh a sample of birds weekly (at least 10% of the flock).</li>
                  <li>Compare average weight to the breed standard.</li>
                  <li>Calculate average daily gain (ADG).</li>
                </ul>
              </li>
              <li>
                <strong>Example:</strong>
                <br />
                A broiler chicken from a day‑old chick should reach about 1.5–2.2 kg
                at 6–7 weeks. If birds are below the standard, check feed quality,
                health, or management.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Physical and Financial Records">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Physical Records</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Number of chicks purchased and date.</li>
              <li>Mortality (deaths) – daily or weekly.</li>
              <li>Feed consumption (kg per day/week).</li>
              <li>Weight of birds (weekly).</li>
              <li>Vaccination and treatment records.</li>
              <li>Litter condition.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Financial Records</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Income:</strong> Sales of birds, sales of manure.
              </li>
              <li>
                <strong>Expenditure:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Chicks (day‑olds).</li>
                  <li>Feed (starter, grower, finisher).</li>
                  <li>Medication and vaccines.</li>
                  <li>Litter material.</li>
                  <li>Transport costs.</li>
                  <li>Labour.</li>
                </ul>
              </li>
              <li>
                <strong>Profit calculation:</strong> Total income – total expenditure.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Slaughtering, Dressing, and Dressing‑Out Percentage">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Slaughtering</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Stop feeding 8–12 hours before slaughter to empty the crop.</li>
              <li>Kill humanely – cut the jugular vein or use a sharp blow.</li>
              <li>Bleed the bird thoroughly.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Dressing</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Scald the bird in hot water (60–65°C) for 30–60 seconds.</li>
              <li>Pluck the feathers (by hand or using a plucking machine).</li>
              <li>Remove the head, feet, and internal organs (evisceration).</li>
              <li>Wash and clean the carcass.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Dressing‑Out Percentage</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The proportion of the live bird that
                becomes the dressed carcass.
              </li>
              <li>
                <strong>Formula:</strong>
                <br />
                <strong>Dressing‑out (%)</strong> = (Dressed weight ÷ Live weight) × 100
              </li>
              <li>
                <strong>Example:</strong>
                <br />
                If a broiler weighs 2.0 kg live, and the dressed carcass weighs
                1.4 kg, the dressing‑out percentage is (1.4 ÷ 2.0) × 100 = 70%.
              </li>
              <li>
                <strong>Good broilers:</strong> 65–75% dressing‑out is typical.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Marketing of Broilers">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Live market:</strong> Selling birds alive to processors,
                restaurants, or directly to consumers.
              </li>
              <li>
                <strong>Processed market:</strong> Selling dressed or frozen birds
                to supermarkets, restaurants, or butcheries.
              </li>
              <li>
                <strong>Marketing channels:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Direct sales to consumers (farm gate, local markets).</li>
                  <li>Sales to middlemen (agents, wholesalers).</li>
                  <li>Contracts with large buyers (abattoirs, hotels).</li>
                </ul>
              </li>
              <li>
                <strong>Factors to consider:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Market demand and price trends.</li>
                  <li>Quality of birds (size, health, appearance).</li>
                  <li>Packaging and presentation (important for processed birds).</li>
                  <li>Transport and delivery.</li>
                </ul>
              </li>
            </ul>

            <AnimalImage
              fileName="broiler-production-cycle.png"
              alt="A 2D diagram showing the broiler production cycle: feeding, rearing, growth assessment, records, slaughtering, dressing, and marketing"
              caption="Broiler production cycle – from rearing to marketing."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Broiler Production</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Feeds:</strong> Starter (22–24%), Grower, Finisher</li>
            <li><strong>Growth:</strong> ~6–7 weeks, 1.5–2.2 kg</li>
            <li><strong>Records:</strong> physical (weights, feed) + financial</li>
            <li><strong>Dressing‑out:</strong> 65–75%</li>
            <li><strong>Marketing:</strong> live or processed</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'animal-health',
      title: 'Animal Health',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Causes of Livestock Diseases">
            <p>
              <strong>Definition:</strong> Livestock diseases are conditions that
              affect the health and productivity of animals. They are caused by
              various factors.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pathogens (infectious agents):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Viruses:</strong> Newcastle disease, Foot‑and‑mouth,
                    Avian influenza.
                  </li>
                  <li>
                    <strong>Bacteria:</strong> Salmonellosis, Tuberculosis (TB),
                    Anthrax.
                  </li>
                  <li>
                    <strong>Fungi:</strong> Ringworm, Aspergillosis.
                  </li>
                  <li>
                    <strong>Parasites:</strong>
                    <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                      <li>
                        <strong>Internal parasites:</strong> Worms (roundworms,
                        tapeworms), liver fluke.
                      </li>
                      <li>
                        <strong>External parasites:</strong> Ticks, mites, lice,
                        fleas.
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Nutritional deficiencies:</strong> Lack of protein,
                vitamins, or minerals (e.g., rickets, milk fever).
              </li>
              <li>
                <strong>Environmental factors:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Poor housing (damp, drafty, overcrowded).</li>
                  <li>Poor sanitation (dirty water, contaminated feed).</li>
                  <li>Heat stress or cold stress.</li>
                </ul>
              </li>
              <li>
                <strong>Genetic factors:</strong> Some breeds are more susceptible
                to certain diseases.
              </li>
              <li>
                <strong>Injuries and accidents:</strong> Wounds, fractures, and
                trauma from fighting or handling.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Modes of Transmission (How Diseases Spread)">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Direct contact:</strong> Healthy animals come into contact
                with infected animals. Examples: Foot‑and‑mouth disease, brucellosis.
              </li>
              <li>
                <strong>Indirect contact:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Contaminated feed and water:</strong> Bacteria and
                    parasites can be spread through feed and water.
                  </li>
                  <li>
                    <strong>Contaminated equipment:</strong> Tools, troughs, and
                    vehicles can carry pathogens.
                  </li>
                  <li>
                    <strong>Airborne:</strong> Viruses can be carried through the
                    air (e.g., Newcastle disease).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Vectors (carriers):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Insects:</strong> Mosquitoes spread avian malaria,
                    ticks spread East Coast Fever (ECF) and anaplasmosis.
                  </li>
                  <li>
                    <strong>Wild animals and birds:</strong> Can carry diseases to
                    domestic livestock.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Zoonotic transmission:</strong> Diseases that can spread
                from animals to humans. Examples: Anthrax, TB, rabies, salmonellosis.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Importance of Hygiene in Livestock Production">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Prevents disease outbreaks:</strong> Good hygiene reduces
                the presence of pathogens.
              </li>
              <li>
                <strong>Improves animal welfare:</strong> Clean conditions reduce
                stress and improve animal comfort.
              </li>
              <li>
                <strong>Increases productivity:</strong> Healthy animals grow
                faster, produce more milk/eggs, and have better fertility.
              </li>
              <li>
                <strong>Reduces mortality:</strong> Fewer animals die from disease.
              </li>
              <li>
                <strong>Reduces costs:</strong> Less money is spent on medication
                and treatment.
              </li>
              <li>
                <strong>Protects public health:</strong> Reduces the risk of
                zoonotic diseases spreading to people.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Prevention and Control Methods">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Vaccination</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Administration of a vaccine to stimulate
                the immune system against specific diseases.
              </li>
              <li>
                <strong>Examples:</strong> Newcastle disease vaccine (poultry),
                Foot‑and‑mouth vaccine (cattle), Rabies vaccine.
              </li>
              <li>
                <strong>Importance:</strong> One of the most effective ways to
                prevent infectious diseases.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Biosecurity</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Measures to prevent disease introduction
                and spread on the farm.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Limit visitors and vehicles.</li>
                  <li>Disinfect footwear and equipment.</li>
                  <li>Quarantine new animals.</li>
                  <li>Separate sick animals from healthy ones.</li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Good Hygiene and Sanitation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Clean housing, equipment, and water sources regularly.</li>
              <li>Remove manure and soiled litter.</li>
              <li>Control flies, rodents, and other pests.</li>
              <li>Provide clean, fresh water and feed.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Parasite Control</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Internal parasites:</strong> Regular deworming (using
                anthelmintics). Rotate pastures to break parasite life cycles.
              </li>
              <li>
                <strong>External parasites:</strong> Dip, spray, or dust animals
                regularly. Control ticks, mites, and lice.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Good Nutrition</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Provide a balanced diet to maintain strong immune systems.</li>
              <li>Ensure adequate minerals and vitamins.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Regular Health Monitoring</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Observe animals daily for signs of illness.</li>
              <li>Keep health records for each animal or group.</li>
              <li>Call a veterinarian when needed.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Isolation and Quarantine</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Isolate sick animals immediately.</li>
              <li>Quarantine new animals for 2–4 weeks before introducing them.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Proper Waste Disposal</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Dispose of dead animals safely (bury or burn).</li>
              <li>Compost manure properly before using as fertiliser.</li>
            </ul>

            <AnimalImage
              fileName="animal-disease-prevention.png"
              alt="A 2D diagram showing prevention and control methods: vaccination, biosecurity, hygiene, parasite control, nutrition, monitoring, isolation, and waste disposal"
              caption="Prevention and control methods for livestock diseases."
            />
          </SubtopicCard>

          <SubtopicCard title="Common Livestock Diseases in Zimbabwe">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Foot‑and‑mouth disease (cattle):</strong> Viral, causes
                blisters on mouth and feet. Prevention: vaccination, movement
                restrictions.
              </li>
              <li>
                <strong>Newcastle disease (poultry):</strong> Viral, causes
                respiratory distress and high mortality. Prevention: vaccination,
                biosecurity.
              </li>
              <li>
                <strong>African swine fever (pigs):</strong> Viral, high mortality.
                Prevention: quarantine, strict hygiene.
              </li>
              <li>
                <strong>Mastitis (cattle):</strong> Bacterial infection of the
                udder. Prevention: hygiene, good milking practices.
              </li>
              <li>
                <strong>East Coast Fever (ECF):</strong> Tick‑borne disease in
                cattle. Prevention: tick control (dipping/spraying).
              </li>
              <li>
                <strong>Anthrax:</strong> Bacterial disease (zoonotic). Prevention:
                vaccination of animals in high‑risk areas.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Animal Health</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Causes:</strong> pathogens, nutrition, environment, genetics</li>
            <li><strong>Transmission:</strong> contact, vectors, airborne, zoonotic</li>
            <li><strong>Prevention:</strong> vaccination, biosecurity, hygiene, parasite control</li>
            <li><strong>Common:</strong> FMD, Newcastle, ASF, ECF, Anthrax</li>
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
            Animal Husbandry
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore livestock types (ruminants vs non‑ruminants), poultry anatomy
            and egg formation, livestock nutrition, broiler production management,
            and animal health – with a focus on Zimbabwe and Africa.
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
                  <strong className="text-white">Livestock types:</strong> Ruminants
                  (cattle, sheep, goats) have a four‑chambered stomach and chew cud.
                  Non‑ruminants (pigs, poultry, rabbits) have a single stomach.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Poultry anatomy:</strong> The hen's
                  oviduct (infundibulum, magnum, isthmus, shell gland) forms the egg
                  in 24–26 hours. An egg has shell, membranes, albumen, yolk,
                  chalaza, and an air cell.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Nutrition:</strong> Livestock need
                  carbohydrates (energy), proteins (growth), fats, vitamins, minerals,
                  and water. Deficiencies cause poor growth, reduced production, and disease.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Broiler production:</strong> Feeds
                  are starter (22–24% protein), grower, and finisher. Growth is
                  monitored by weighing. Records (physical and financial) help track
                  performance. Dressing‑out percentage is (dressed weight ÷ live weight) × 100.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Animal health:</strong> Diseases are
                  caused by pathogens, nutrition, environment, and genetics. They
                  spread through contact, vectors, and air. Prevention includes
                  vaccination, biosecurity, hygiene, parasite control, and good nutrition.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Animal Husbandry topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">Agri‑Business</span>?</>
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
                alert('Proceed to Agri‑Business (next topic)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Agri‑Business →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimalHusbandry;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/animal-husbandry/
   Use a mix of 2D diagram style and realistic photographs.

   --- TYPES OF LIVESTOCK ---
   1. ruminant-nonruminant-comparison.png
      A split diagram: left – ruminants (cattle, sheep, goats) with four-chambered
      stomach (rumen, reticulum, omasum, abomasum); right – non-ruminants (pigs,
      poultry, rabbits) with single stomach.

   --- ANATOMY AND PHYSIOLOGY ---
   2. hen-cock-reproductive-system.png
      A 2D diagram showing the hen's reproductive system (ovary, infundibulum,
      magnum, isthmus, shell gland, vagina, cloaca) and the cock's system
      (testes, vas deferens, cloaca).

   3. egg-structure-functions.png
      A labelled 2D diagram of an egg: shell, shell membranes, air cell, albumen
      (thick and thin), chalaza, vitelline membrane, yolk, germinal disc.

   --- NUTRITION ---
   4. livestock-nutrients.png
      A 2D diagram showing the six main nutrients: carbohydrates, proteins, fats,
      vitamins, minerals, water – with their functions and sources.

   --- SMALL LIVESTOCK PRODUCTION (BROILERS) ---
   5. broiler-feed-types.png
      A 2D diagram showing starter (0–14 days), grower (15–28 days), and finisher
      (29–42+ days) feeds with protein percentages and forms (crumble, pellet).

   6. broiler-production-cycle.png
      A flowchart diagram showing the broiler cycle: rearing → growth assessment →
      records → slaughtering → dressing → marketing.

   --- ANIMAL HEALTH ---
   7. animal-disease-prevention.png
      A 2D diagram showing prevention methods: vaccination, biosecurity, hygiene,
      parasite control, good nutrition, monitoring, isolation, waste disposal.

   ============================================================ */