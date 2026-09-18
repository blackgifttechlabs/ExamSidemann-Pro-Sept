import { AgricultureLessonImage as AnimalImage } from '../../../common/AgricultureLessonImage';
import React, { useState, useRef } from 'react';

/**
 * Topic: Animal Husbandry
 * Full component with sticky navigation, container cards (9px border-radius),
 * lesson illustrations, and auto‑scroll + double‑highlight on heading.
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
      id: 'reproductive-system',
      title: 'Anatomy and Physiology – Reproductive System',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Parts and Functions of the Male Ruminant Reproductive System">
            <p>
              <strong>Definition:</strong> The male reproductive system produces
              sperm and delivers it to the female for fertilisation. In ruminants,
              the male is called a bull (cattle), ram (sheep), or buck (goat).
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Testes (scrotum):</strong>
                <br />
                <strong>Function:</strong> Produce sperm (spermatogenesis) and
                the male hormone testosterone. The scrotum hangs outside the body
                to keep the testes at a lower temperature (4–6°C cooler than body
                temperature), which is essential for sperm production.
              </li>
              <li>
                <strong>Epididymis:</strong>
                <br />
                <strong>Function:</strong> Stores and matures sperm. Sperm are
                transported from the testes to the epididymis, where they gain
                motility and fertilising ability.
              </li>
              <li>
                <strong>Vas deferens (sperm duct):</strong>
                <br />
                <strong>Function:</strong> Transports sperm from the epididymis
                to the urethra during ejaculation.
              </li>
              <li>
                <strong>Accessory glands (seminal vesicles, prostate, Cowper's gland):</strong>
                <br />
                <strong>Function:</strong> Produce seminal fluid (semen) that
                nourishes and protects sperm. The fluid provides a medium for
                sperm transport.
              </li>
              <li>
                <strong>Urethra:</strong>
                <br />
                <strong>Function:</strong> Carries both urine and semen (in males)
                to the outside. During ejaculation, sphincters close off the
                bladder, allowing semen to pass.
              </li>
              <li>
                <strong>Penis:</strong>
                <br />
                <strong>Function:</strong> Delivers semen into the female
                reproductive tract during mating. In ruminants, the penis has
                a characteristic sigmoid flexure (S‑shape) that straightens
                during erection.
              </li>
            </ul>

            <AnimalImage
              fileName="male-ruminant-reproductive-system.webp"
              alt="A 2D diagram showing the male ruminant reproductive system: testes, scrotum, epididymis, vas deferens, accessory glands, urethra, penis"
              caption="Parts and functions of the male ruminant reproductive system."
            />
          </SubtopicCard>

          <SubtopicCard title="Parts and Functions of the Female Ruminant Reproductive System">
            <p>
              <strong>Definition:</strong> The female reproductive system produces
              eggs (ova), supports fertilisation, and nurtures the developing foetus
              until birth. In ruminants, the female is called a cow (cattle), ewe
              (sheep), or doe (goat).
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Ovaries:</strong>
                <br />
                <strong>Function:</strong> Produce eggs (ova) and female hormones
                (oestrogen and progesterone). Each ovary contains many follicles
                (eggs in various stages of development). Ovulation is the release
                of a mature egg.
              </li>
              <li>
                <strong>Oviducts (Fallopian tubes):</strong>
                <br />
                <strong>Function:</strong> Transport the egg from the ovary to
                the uterus. Fertilisation occurs in the oviduct (ampulla region).
              </li>
              <li>
                <strong>Uterus:</strong>
                <br />
                <strong>Function:</strong> Houses and nourishes the developing
                foetus during pregnancy. The uterus has two horns (bicornuate)
                in ruminants, allowing multiple foetuses. It provides the
                environment for implantation and placental development.
              </li>
              <li>
                <strong>Cervix:</strong>
                <br />
                <strong>Function:</strong> The muscular neck of the uterus that
                acts as a barrier to protect the uterus from infection. It opens
                during oestrus (heat) and birth. In artificial insemination, the
                cervix is a key landmark.
              </li>
              <li>
                <strong>Vagina:</strong>
                <br />
                <strong>Function:</strong> Receives the penis during mating and
                serves as the birth canal during parturition (birth).
              </li>
              <li>
                <strong>Vulva:</strong>
                <br />
                <strong>Function:</strong> The external opening of the female
                reproductive tract. It swells during oestrus (heat) to signal
                receptivity.
              </li>
            </ul>

            <AnimalImage
              fileName="female-ruminant-reproductive-system.webp"
              alt="A 2D diagram showing the female ruminant reproductive system: ovaries, oviducts, uterus, cervix, vagina, vulva"
              caption="Parts and functions of the female ruminant reproductive system."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Reproductive Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Male:</strong> testes (sperm), epididymis (storage), vas deferens, penis</li>
            <li><strong>Female:</strong> ovaries (eggs), oviducts (fertilisation), uterus (foetus), cervix, vagina</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'nutrition-ration-formulation',
      title: 'Nutrition – Ration Formulation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Calculating Maintenance and Production Rations (Pearson Square Method)">
            <p>
              <strong>Definition:</strong> A balanced ration provides all the
              nutrients an animal needs for <strong>maintenance</strong> (staying
              alive and healthy) and <strong>production</strong> (growth, milk,
              meat, wool, or reproduction).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Maintenance Ration</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The amount of feed required to keep
                an animal alive, maintain body weight, and support basic metabolic
                functions (without any production).
              </li>
              <li>
                <strong>Example:</strong> A 500 kg dry cow needs about 8–10 kg of
                dry matter per day for maintenance (roughages like hay or silage).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Production Ration</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The additional nutrients needed
                above maintenance for production (milk, meat, wool, growth, or
                reproduction).
              </li>
              <li>
                <strong>Example:</strong> A lactating dairy cow needs additional
                energy and protein to produce milk. A growing lamb needs extra
                protein for muscle development.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Pearson Square Method</h4>
            <p>
              The Pearson Square is a simple method for calculating the proportions
              of two feeds needed to achieve a desired nutrient level (usually
              protein or energy).
            </p>

            <h5 className="text-xl font-semibold text-blue-700 mt-4">Example: Ruminant Ration</h5>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Problem:</strong> You need to formulate a ration with 14%
                crude protein (CP) for growing sheep using maize meal (9% CP) and
                cottonseed cake (38% CP).
              </li>
              <li>
                <strong>Step 1:</strong> Draw a square and put the desired protein
                (14%) in the centre.
              </li>
              <li>
                <strong>Step 2:</strong> Put the protein of each feed in the left
                corners.
              </li>
              <li>
                <strong>Step 3:</strong> Subtract diagonally (use positive numbers):
                <br />
                38 – 14 = 24 parts maize meal
                <br />
                14 – 9 = 5 parts cottonseed cake
              </li>
              <li>
                <strong>Step 4:</strong> Total parts = 24 + 5 = 29
              </li>
              <li>
                <strong>Step 5:</strong> Percentage of each feed:
                <br />
                Maize meal: (24 ÷ 29) × 100 = 82.8%
                <br />
                Cottonseed cake: (5 ÷ 29) × 100 = 17.2%
              </li>
              <li>
                <strong>Result:</strong> Mix 82.8 kg maize meal with 17.2 kg
                cottonseed cake to get 100 kg of feed with 14% CP.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Preparing Balanced Rations for Ruminants">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Ruminants (cattle, sheep, goats):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Roughage base:</strong> Provide good quality hay or
                    silage (ad libitum).
                  </li>
                  <li>
                    <strong>Concentrates:</strong> Supplement with grains (maize,
                    sorghum) and protein sources (cottonseed cake, soyameal).
                  </li>
                  <li>
                    <strong>Minerals/vitamins:</strong> Provide mineral licks
                    and salt to meet deficiencies.
                  </li>
                  <li>
                    <strong>Water:</strong> Always provide clean, fresh water.
                  </li>
                </ul>
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Preparing Balanced Rations for Non‑Ruminants">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Non‑ruminants (pigs, poultry, rabbits):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Starter/grower/finisher:</strong> Use commercial feeds
                    (starter 20–22% CP, grower 18–20% CP, finisher 16–18% CP).
                  </li>
                  <li>
                    <strong>Energy source:</strong> Maize is the main energy grain.
                  </li>
                  <li>
                    <strong>Protein source:</strong> Soyameal, fish meal, or
                    cottonseed cake.
                  </li>
                  <li>
                    <strong>Minerals/vitamins:</strong> Use commercial premixes.
                  </li>
                  <li>
                    <strong>Water:</strong> Always provide clean, fresh water.
                  </li>
                </ul>
              </li>
            </ul>

            <AnimalImage
              fileName="pearson-square-ration.webp"
              alt="A 2D diagram showing the Pearson Square method with an example: maize meal (9% CP) and cottonseed cake (38% CP) to achieve 14% CP"
              caption="Calculating balanced rations using the Pearson Square method."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Nutrition Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Maintenance:</strong> feed to keep animal alive</li>
            <li><strong>Production:</strong> extra feed for milk, meat, growth</li>
            <li><strong>Pearson Square:</strong> calculates feed proportions for desired nutrient level</li>
            <li><strong>Ruminants:</strong> roughage + concentrates + minerals</li>
            <li><strong>Non‑ruminants:</strong> commercial or balanced mash</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'small-livestock-production',
      title: 'Small Livestock Production – Slaughtering and Marketing',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Slaughtering and Dressing Rabbits, Off‑Layers, Indigenous Chickens">
            <p>
              <strong>Definition:</strong> Slaughtering and dressing are the
              processes of killing and preparing animals for consumption or sale.
              Proper technique ensures hygiene, quality, and safety.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Rabbits</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Slaughtering:</strong> Stop feeding 8–12 hours before.
                Kill humanely (neck dislocation or sharp blow to the head). Bleed
                by cutting the jugular vein.
              </li>
              <li>
                <strong>Dressing:</strong> Skin (remove pelt), eviscerate (remove
                internal organs), wash and chill the carcass.
              </li>
              <li>
                <strong>Pelt preparation:</strong> Dry the pelt (salt or stretch)
                for sale to the leather industry.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Off‑Layers (Spent Hens)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Slaughtering:</strong> Stop feeding 8–12 hours before.
                Kill by cutting the jugular vein. Bleed thoroughly.
              </li>
              <li>
                <strong>Dressing:</strong> Scald in hot water (60–65°C) for
                30–60 seconds, pluck feathers, remove head and feet, eviscerate,
                wash and chill.
              </li>
              <li>
                <strong>Marketing:</strong> Sell as frozen whole birds or cut‑up
                portions to local markets or processors.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Indigenous Chickens</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Slaughtering:</strong> Similar to off‑layers. Kill humanely
                by cutting the jugular vein.
              </li>
              <li>
                <strong>Dressing:</strong> Scalding, plucking, eviscerating,
                washing, and chilling.
              </li>
              <li>
                <strong>Marketing:</strong> Sold live (for ceremonies) or dressed
                (for households, restaurants).
              </li>
            </ul>

            <AnimalImage
              fileName="slaughtering-dressing-small-livestock.webp"
              alt="A 2D diagram showing slaughtering and dressing steps for rabbits, off-layers, and indigenous chickens"
              caption="Slaughtering and dressing small livestock: rabbits, off‑layers, indigenous chickens."
            />
          </SubtopicCard>

          <SubtopicCard title="Preparing Pelts and Eggs for Market">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Rabbit Pelts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Fleshing:</strong> Remove excess fat and meat from the pelt.
              </li>
              <li>
                <strong>Drying:</strong> Stretch and dry the pelt on a frame
                (fur side inwards). Salt may be used for preservation.
              </li>
              <li>
                <strong>Storage:</strong> Store in a cool, dry place.
              </li>
              <li>
                <strong>Marketing:</strong> Sell to leather processors or craft
                makers.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Eggs (Layers)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Collection:</strong> Collect eggs at least twice daily
                to prevent breakage and soiling.
              </li>
              <li>
                <strong>Cleaning:</strong> Wipe clean (do not wash) to remove
                dirt. Washing removes the protective bloom and reduces shelf life.
              </li>
              <li>
                <strong>Grading:</strong> Sort by size (small, medium, large,
                extra large) and quality (cracked, dirty, stained).
              </li>
              <li>
                <strong>Packaging:</strong> Use clean, sturdy cartons (egg trays)
                to reduce breakage.
              </li>
              <li>
                <strong>Storage:</strong> Store at 4–10°C (refrigerated) to
                maintain freshness.
              </li>
              <li>
                <strong>Marketing:</strong> Sell to households, restaurants,
                supermarkets, or baking companies.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Compiling Financial and Production Records">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Production Records</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Number of animals/eggs produced.</li>
              <li>Mortality (deaths) – daily/weekly.</li>
              <li>Feed consumption (kg per week/month).</li>
              <li>Egg production (number, grade, weight).</li>
              <li>Weight gain (for meat animals).</li>
              <li>Vaccination and treatment records.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Financial Records</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Income:</strong>
                <br />
                Sales of animals (live or dressed), eggs, pelts, manure.
              </li>
              <li>
                <strong>Expenditure:</strong>
                <br />
                Purchases of animals (day‑olds, breeders), feed, medication,
                vaccines, bedding, transport, labour.
              </li>
              <li>
                <strong>Profit/loss:</strong>
                <br />
                Calculate by subtracting total expenditure from total income.
              </li>
            </ul>

            <AnimalImage
              fileName="records-marketing-small-livestock.webp"
              alt="A 2D diagram showing pelt preparation, egg grading/packaging, and financial/production record keeping"
              caption="Preparing pelts/eggs for market and compiling financial/production records."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Small Livestock</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Slaughtering:</strong> humane kill, bleeding, dressing</li>
            <li><strong>Pelts:</strong> flesh, dry, store, sell</li>
            <li><strong>Eggs:</strong> collect, grade, package, store, market</li>
            <li><strong>Records:</strong> production (animals/eggs, mortality) + financial (income, costs)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'ruminants-breeds',
      title: 'Ruminants – Breeds and Management',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Exotic and Indigenous Cattle Breeds in Zimbabwe">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Exotic (Introduced) Breeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Holstein‑Friesian:</strong>
                <br />
                <strong>Characteristics:</strong> Large, black‑and‑white, high
                milk production (20–30 L/day). Used for dairy. Requires good
                management, high feed, and cooler climates.
              </li>
              <li>
                <strong>Jersey:</strong>
                <br />
                <strong>Characteristics:</strong> Smaller, fawn/brown, high butterfat
                milk. Used for dairy. Hardy, good for warmer areas.
              </li>
              <li>
                <strong>Brahman:</strong>
                <br />
                <strong>Characteristics:</strong> Humped, heat‑tolerant, tick‑resistant.
                Used for beef. Good for hot, dry areas (Lowveld).
              </li>
              <li>
                <strong>Hereford:</strong>
                <br />
                <strong>Characteristics:</strong> Red with white face. Good beef
                breed, moderate milk. Used for beef, adaptable.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Indigenous Breeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Mashona:</strong>
                <br />
                <strong>Characteristics:</strong> Small to medium, hardy, tick‑tolerant,
                good fertility. Used for beef and draught. Found in communal areas.
              </li>
              <li>
                <strong>Nguni:</strong>
                <br />
                <strong>Characteristics:</strong> Medium, colourful, heat‑tolerant,
                good milk yield. Used for beef, milk, and draught. Found in
                Matabeleland and Southern Province.
              </li>
              <li>
                <strong>Tuli:</strong>
                <br />
                <strong>Characteristics:</strong> Medium, white to grey, heat‑tolerant,
                good beef quality. Used for beef. Found in the Lowveld.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Exotic and Indigenous Sheep Breeds in Zimbabwe">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Exotic Breeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Merino:</strong>
                <br />
                <strong>Characteristics:</strong> Fine wool, white. Used for wool
                production. Requires good management.
              </li>
              <li>
                <strong>Dorper:</strong>
                <br />
                <strong>Characteristics:</strong> White body, black head, good
                meat breed. Used for mutton. Hardy, good for dry areas.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Indigenous Breeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Zimbabwean indigenous sheep:</strong>
                <br />
                <strong>Characteristics:</strong> Small, hardy, disease‑tolerant.
                Used for meat and skin. Found in communal areas.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Exotic and Indigenous Goat Breeds in Zimbabwe">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Exotic Breeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Boer goat:</strong>
                <br />
                <strong>Characteristics:</strong> Large, white with brown head,
                high meat yield. Used for meat. Good for commercial production.
              </li>
              <li>
                <strong>Angora:</strong>
                <br />
                <strong>Characteristics:</strong> Produces mohair (wool). Used
                for fibre production.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Indigenous Breeds</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Matabele goat:</strong>
                <br />
                <strong>Characteristics:</strong> Medium, hardy, good meat. Used
                for meat and milk. Found in Matabeleland.
              </li>
              <li>
                <strong>Small East African (SEA) goat:</strong>
                <br />
                <strong>Characteristics:</strong> Small, hardy, disease‑tolerant.
                Used for meat and milk.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Management Practices for Ruminants">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Breeding:</strong>
                <br />
                Use controlled breeding to improve genetics. Match bulls/rams/bucks
                to females. Keep breeding records.
              </li>
              <li>
                <strong>Feeding:</strong>
                <br />
                Provide balanced ration (roughage + concentrate) and minerals.
                Rotate pastures to prevent overgrazing.
              </li>
              <li>
                <strong>Health:</strong>
                <br />
                Vaccinate against common diseases (FMD, anthrax). Control parasites
                (dipping, deworming). Monitor for signs of illness.
              </li>
              <li>
                <strong>Housing:</strong>
                <br />
                Provide shelter from sun, rain, and wind. Provide clean water
                and feed troughs.
              </li>
              <li>
                <strong>Record keeping:</strong>
                <br />
                Keep records of breeding, health, production (milk, weight gains),
                and financial transactions.
              </li>
            </ul>

            <AnimalImage
              fileName="ruminant-breeds-zimbabwe.webp"
              alt="A 2D diagram showing exotic and indigenous cattle, sheep, and goat breeds in Zimbabwe with their characteristics"
              caption="Ruminant breeds in Zimbabwe: exotic and indigenous breeds."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Ruminant Breeds</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Cattle:</strong> Holstein (dairy), Brahman (beef), Mashona (indigenous)</li>
            <li><strong>Sheep:</strong> Merino (wool), Dorper (meat), indigenous</li>
            <li><strong>Goats:</strong> Boer (meat), Angora (mohair), Matabele (indigenous)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'animal-health',
      title: 'Animal Health – Parasites, Immunity, and Legislation',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Internal and External Parasites">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Internal Parasites (Endoparasites)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Roundworms (nematodes):</strong> e.g., <em>Haemonchus</em>
                    (barber's pole worm), <em>Ostertagia</em>.
                  </li>
                  <li>
                    <strong>Tapeworms (cestodes):</strong> e.g., <em>Moniezia</em>.
                  </li>
                  <li>
                    <strong>Liver flukes (trematodes):</strong> <em>Fasciola</em>.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Life cycle:</strong>
                <br />
                Eggs passed in faeces → larvae develop on pasture → ingested by
                animal → larvae mature in the gut/liver → produce eggs → cycle
                repeats.
              </li>
              <li>
                <strong>Symptoms:</strong>
                <br />
                Weight loss, diarrhoea, anaemia (pale mucous membranes), rough coat,
                reduced production, bottle jaw (swelling under jaw), death.
              </li>
              <li>
                <strong>Prevention and treatment:</strong>
                <br />
                <strong>Prevention:</strong> Rotate pastures, maintain good hygiene,
                practice clean grazing (defer grazing on contaminated pastures).
                <br />
                <strong>Treatment:</strong> Deworming with anthelmintics (e.g.,
                ivermectin, albendazole).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">External Parasites (Ectoparasites)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Ticks:</strong> e.g., <em>Amblyomma</em> (bont tick),
                    <em>Rhipicephalus</em> (brown tick). Transmit diseases like
                    East Coast Fever (ECF) and anaplasmosis.
                  </li>
                  <li>
                    <strong>Mites:</strong> Cause mange (skin irritation, hair loss).
                  </li>
                  <li>
                    <strong>Lice:</strong> Cause irritation, biting, and anaemia.
                  </li>
                  <li>
                    <strong>Flies:</strong> e.g., blowflies (myiasis – maggots
                    in wounds), stable flies.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Life cycle:</strong>
                <br />
                Adult ticks/mites/lice reproduce on the animal, lay eggs, and
                larvae develop on the animal or in the environment.
              </li>
              <li>
                <strong>Symptoms:</strong>
                <br />
                Irritation, scratching, hair loss, skin lesions, anaemia, weight
                loss, reduced production, and transmission of diseases.
              </li>
              <li>
                <strong>Prevention and treatment:</strong>
                <br />
                <strong>Prevention:</strong> Regular dipping (use acaricides) or
                spraying, rotational grazing, pasture management.
                <br />
                <strong>Treatment:</strong> Dipping, spraying, or applying
                pour‑on insecticides (e.g., deltamethrin, amitraz).
              </li>
            </ul>

            <AnimalImage
              fileName="internal-external-parasites.webp"
              alt="A 2D diagram showing internal parasites (roundworms, tapeworms, flukes) and external parasites (ticks, mites, lice, flies) with symptoms and control methods"
              caption="Internal and external parasites: life cycle, symptoms, prevention, treatment, control."
            />
          </SubtopicCard>

          <SubtopicCard title="The Animal Health Act">
            <p>
              <strong>Definition:</strong> The Animal Health Act is the legislation
              in Zimbabwe that governs the prevention, control, and eradication of
              animal diseases. It provides the legal framework for animal health
              management.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Key provisions:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Regulation of animal imports and exports.</li>
                  <li>Control of notifiable diseases (quarantine, movement control).</li>
                  <li>Vaccination and disease control programmes.</li>
                  <li>Inspection of animals (health certificates).</li>
                  <li>Meat inspection (abattoirs).</li>
                </ul>
              </li>
              <li>
                <strong>Enforcement:</strong>
                <br />
                The Department of Veterinary Services (DVS) is the enforcing
                authority. They conduct inspections, quarantine, and disease
                surveillance.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Types of Livestock Immunity">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Immunity is the ability of an animal
                to resist disease. There are several types:
              </li>
              <li>
                <strong>Natural (innate) immunity:</strong>
                <br />
                Present at birth. Non‑specific (protects against many pathogens).
                Examples: skin barriers, stomach acid, mucous membranes, and
                white blood cells (macrophages).
              </li>
              <li>
                <strong>Acquired (adaptive) immunity:</strong>
                <br />
                Developed after exposure to a pathogen or vaccination. Specific
                to a particular disease.
              </li>
              <li>
                <strong>Active immunity:</strong>
                <br />
                Animal produces its own antibodies after exposure to a pathogen
                (e.g., after infection or vaccination). Long‑lasting (memory cells).
              </li>
              <li>
                <strong>Passive immunity:</strong>
                <br />
                Antibodies are transferred from mother to offspring (via colostrum
                or placenta). Temporary (lasts a few weeks to months).
              </li>
              <li>
                <strong>Herd immunity:</strong>
                <br />
                When a large proportion of a population is immune, the spread of
                disease is reduced, protecting even non‑immune animals.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Animal Health</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Internal parasites:</strong> worms (deworming, rotation)</li>
            <li><strong>External parasites:</strong> ticks, mites (dipping, spraying)</li>
            <li><strong>Animal Health Act:</strong> disease control, quarantine, inspections</li>
            <li><strong>Immunity:</strong> natural, acquired, active, passive, herd</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'genetics-improvement',
      title: 'Animal Improvement – Genetics',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Importance of Breeding">
            <ul className="list-disc list-inside space-y-1">
              <li>Improves production traits (milk, meat, wool, eggs).</li>
              <li>Enhances fertility and reproductive performance.</li>
              <li>Increases resistance to diseases and parasites.</li>
              <li>Improves adaptability to local environments.</li>
              <li>Reduces costs (efficiency, feed conversion).</li>
              <li>Increases profitability and sustainability.</li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Effects of Environment on Breeding">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The environment (nutrition, climate,
                management) can affect the expression of genetic potential.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Heat stress:</strong> Reduces fertility and production
                    in dairy cattle, even with good genetics.
                  </li>
                  <li>
                    <strong>Poor nutrition:</strong> Stunted growth and poor
                    reproduction, even in genetically superior animals.
                  </li>
                  <li>
                    <strong>Disease:</strong> Parasites and pathogens reduce
                    productivity and fertility.
                  </li>
                </ul>
              </li>
              <li>
                <strong>Conclusion:</strong> Good genetics must be combined with
                good management (nutrition, health, housing) to achieve genetic potential.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Cross‑breeding vs In‑breeding">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Cross‑breeding</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Mating animals of different breeds.
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Heterosis (hybrid vigour):</strong> Offspring are
                    stronger, more productive, and more disease‑resistant than
                    either parent.
                  </li>
                  <li>Combines desirable traits from different breeds.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Offspring may not breed true (traits vary).</li>
                  <li>Requires careful selection of parent breeds.</li>
                </ul>
              </li>
              <li>
                <strong>Zimbabwe example:</strong> Brahman (heat‑tolerant) ×
                Hereford (good beef) for beef production in the Lowveld.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">In‑breeding</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Mating animals that are closely
                related (e.g., father‑daughter, brother‑sister).
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Fix desirable traits (homozygosity).</li>
                  <li>Used in breeding purebred lines.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Inbreeding depression:</strong> Reduced fertility,
                    vigour, and increased susceptibility to disease.
                  </li>
                  <li>Recessive genetic defects can appear.</li>
                </ul>
              </li>
              <li>
                <strong>Recommendation:</strong> In‑breeding should be limited and
                carefully managed (avoid close in‑breeding).
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Artificial Selection and Selecting Animals for Breeding">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Artificial Selection</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The process by which humans select
                animals with desirable traits for breeding, rather than allowing
                natural selection to occur.
              </li>
              <li>
                <strong>Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Phenotypic selection:</strong> Select animals based
                    on their physical appearance (size, conformation, milk yield).
                  </li>
                  <li>
                    <strong>Pedigree selection:</strong> Select animals based on
                    the performance of their ancestors.
                  </li>
                  <li>
                    <strong>Progeny testing:</strong> Select animals based on the
                    performance of their offspring.
                  </li>
                  <li>
                    <strong>Performance testing:</strong> Select animals based on
                    their own performance (e.g., growth rate, milk production).
                  </li>
                </ul>
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Selecting Animals for Breeding</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Criteria for selection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Production traits:</strong> Milk yield, meat yield,
                    wool quality, egg production, growth rate.
                  </li>
                  <li>
                    <strong>Reproductive traits:</strong> Fertility, litter size,
                    ease of calving/lambing/kidding.
                  </li>
                  <li>
                    <strong>Health traits:</strong> Disease resistance, parasite
                    tolerance, longevity.
                  </li>
                  <li>
                    <strong>Conformation:</strong> Physical structure (legs, udder,
                    body shape) that affects performance and longevity.
                  </li>
                  <li>
                    <strong>Adaptability:</strong> Ability to thrive in the local
                    environment (heat tolerance, feed efficiency).
                  </li>
                </ul>
              </li>
              <li>
                <strong>Record keeping:</strong>
                <br />
                Keep detailed records of all animals (birth, parentage, health,
                production) to make informed selection decisions.
              </li>
            </ul>

            <AnimalImage
              fileName="genetics-breeding-selection.webp"
              alt="A 2D diagram showing cross-breeding vs in-breeding, artificial selection methods, and criteria for selecting breeding animals"
              caption="Animal improvement: genetics, breeding, and selection."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Genetics Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Breeding importance:</strong> productivity, fertility, disease resistance</li>
            <li><strong>Environment:</strong> affects gene expression (nutrition, heat, disease)</li>
            <li><strong>Cross‑breeding:</strong> heterosis (vigour) – Brahman × Hereford</li>
            <li><strong>In‑breeding:</strong> fixes traits but risk of depression</li>
            <li><strong>Selection:</strong> phenotypic, pedigree, progeny, performance</li>
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
            Explore reproductive anatomy, ration formulation (Pearson Square),
            small livestock production and marketing, ruminant breeds, animal
            health (parasites, immunity, legislation), and genetics improvement.
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
                  <strong className="text-white">Reproductive system:</strong> Male
                  (testes, epididymis, vas deferens, penis) and female (ovaries,
                  oviducts, uterus, cervix, vagina) – each with specific functions.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Ration formulation:</strong> Pearson
                  Square method calculates feed proportions for desired nutrient
                  levels. Ruminants need roughage + concentrates; non‑ruminants
                  need balanced mash.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Small livestock:</strong> Slaughtering
                  and dressing (rabbits, off‑layers, indigenous chickens). Prepare
                  pelts (flesh, dry) and eggs (grade, package). Keep production and
                  financial records.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Ruminant breeds:</strong> Exotic
                  (Holstein, Brahman, Merino, Boer) and indigenous (Mashona, Nguni,
                  Matabele) – each with specific characteristics and uses.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Animal health:</strong> Internal
                  parasites (deworming) and external parasites (dipping/spraying).
                  The Animal Health Act controls diseases. Immunity includes natural,
                  acquired, active, passive, and herd immunity.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Genetics:</strong> Cross‑breeding
                  gives heterosis (hybrid vigour); in‑breeding fixes traits but
                  risks depression. Artificial selection uses phenotypic, pedigree,
                  progeny, and performance testing.
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

   --- ANATOMY AND PHYSIOLOGY ---
   1. male-ruminant-reproductive-system.png
      A 2D diagram showing: testes, scrotum, epididymis, vas deferens,
      accessory glands (seminal vesicles, prostate, Cowper's gland), urethra, penis.

   2. female-ruminant-reproductive-system.png
      A 2D diagram showing: ovaries, oviducts (fallopian tubes), uterus (horns),
      cervix, vagina, vulva.

   --- NUTRITION ---
   3. pearson-square-ration.png
      A 2D diagram showing the Pearson Square method with an example:
      maize meal (9% CP) and cottonseed cake (38% CP) to achieve 14% CP.
      Show the square, subtraction, and final proportions (82.8% and 17.2%).

   --- SMALL LIVESTOCK PRODUCTION ---
   4. slaughtering-dressing-small-livestock.png
      A 2D diagram showing steps for slaughtering and dressing rabbits,
      off-layers, and indigenous chickens (killing, bleeding, scalding, plucking,
      eviscerating, washing, chilling).

   5. records-marketing-small-livestock.png
      A 2D diagram showing: pelt preparation (fleshing, drying), egg grading/
      packaging (size, quality, cartons), and record keeping (production and
      financial records).

   --- RUMINANTS ---
   6. ruminant-breeds-zimbabwe.png
      A 2D diagram showing exotic and indigenous cattle (Holstein, Jersey,
      Brahman, Hereford, Mashona, Nguni, Tuli), sheep (Merino, Dorper,
      indigenous), and goats (Boer, Angora, Matabele, SEA) with characteristics.

   --- ANIMAL HEALTH ---
   7. internal-external-parasites.png
      A 2D diagram showing internal parasites (roundworms, tapeworms, flukes)
      and external parasites (ticks, mites, lice, flies) with life cycle,
      symptoms, prevention (rotational grazing, dipping), and treatment
      (deworming, spraying).

   --- GENETICS ---
   8. genetics-breeding-selection.png
      A 2D diagram showing cross‑breeding vs in‑breeding, artificial selection
      methods (phenotypic, pedigree, progeny, performance), and criteria for
      selecting breeding animals.

   ============================================================ */