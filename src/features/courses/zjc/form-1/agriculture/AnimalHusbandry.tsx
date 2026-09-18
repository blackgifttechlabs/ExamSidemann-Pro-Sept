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
      id: 'types-livestock',
      title: 'Types of Livestock',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Livestock?">
            <p>
              <strong>Definition:</strong> Livestock refers to domesticated animals
              raised in an agricultural setting to produce commodities such as
              food, fibre, and labour. They are kept for meat, milk, eggs, wool,
              leather, and as draught animals.
            </p>
            <p>
              Livestock play a vital role in the economy of Zimbabwe and many
              African countries, providing livelihoods, nutrition, and income
              for millions of people.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Types of Livestock">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Ruminants</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Ruminants are mammals that digest
                plant‑based food through fermentation in a four‑chambered stomach
                (rumen, reticulum, omasum, abomasum). They include cattle, sheep,
                goats, and buffalo.
              </li>
              <li>
                <strong>Examples:</strong> Beef and dairy cattle, mutton sheep,
                mohair goats (e.g., Angora), meat goats (e.g., Boer).
              </li>
              <li>
                <strong>Importance:</strong> Provide meat, milk, wool, hides, and
                manure; also used for draught power in ploughing.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Non‑Ruminants</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Non‑ruminants (monogastric) have a
                single‑chambered stomach. They include pigs, rabbits, and poultry
                (though birds have a different digestive system but are still
                monogastric).
              </li>
              <li>
                <strong>Examples:</strong> Pigs (Sus scrofa), rabbits (Oryctolagus),
                guinea pigs, and poultry.
              </li>
              <li>
                <strong>Importance:</strong> Quick growth, efficient feed conversion,
                provide meat (pork, rabbit meat) and eggs (poultry).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Poultry</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Domesticated birds kept for eggs and
                meat. Includes chickens, ducks, turkeys, guinea fowl, and geese.
              </li>
              <li>
                <strong>Most common:</strong> Chickens – broilers (meat) and layers (eggs).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Fish (Aquaculture)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Fish farming (aquaculture) involves
                rearing fish in tanks, ponds, or cages for food.
              </li>
              <li>
                <strong>Examples:</strong> Tilapia, catfish, and trout – widely
                farmed in Zimbabwe.
              </li>
            </ul>
            <AnimalImage
              fileName="types-of-livestock.webp"
              alt="A 2D diagram showing ruminants (cattle, sheep, goats), non-ruminants (pigs, rabbits), poultry (chickens), and fish"
              caption="Types of livestock: ruminants, non-ruminants, poultry, and fish."
            />
          </SubtopicCard>

          <SubtopicCard title="Importance of Livestock">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Food production:</strong> Meat, milk, eggs, and fish provide
                high‑quality protein and nutrients.
              </li>
              <li>
                <strong>Income and employment:</strong> Livestock sales, processed
                products, and related industries create jobs.
              </li>
              <li>
                <strong>Draught power:</strong> Oxen and donkeys are used for
                ploughing and transport, especially in rural areas.
              </li>
              <li>
                <strong>Manure and fertiliser:</strong> Animal dung improves soil
                fertility, reducing the need for chemical fertilisers.
              </li>
              <li>
                <strong>By‑products:</strong> Hides, wool, feathers, bones, and
                blood are used for leather, textiles, and other industries.
              </li>
              <li>
                <strong>Social and cultural significance:</strong> Livestock are
                used for bride price (lobola), ceremonies, and as a store of wealth.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Livestock Products and By‑Products">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Products:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Meat (beef, mutton, pork, poultry, fish).</li>
                  <li>Milk and dairy products (cheese, butter, yoghurt).</li>
                  <li>Eggs (from poultry).</li>
                  <li>Wool and mohair (from sheep and goats).</li>
                </ul>
              </li>
              <li>
                <strong>By‑products:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Leather and hides (from cattle, goats).</li>
                  <li>Bone meal and blood meal (used in animal feed and fertiliser).</li>
                  <li>Feathers (used for stuffing, decorations).</li>
                  <li>Manure (as fertiliser and biogas).</li>
                  <li>Gelatin (from bones and hooves).</li>
                </ul>
              </li>
            </ul>
            <AnimalImage
              fileName="livestock-products.webp"
              alt="A 2D diagram showing livestock products (meat, milk, eggs, wool) and by-products (leather, bone meal, manure, feathers)"
              caption="Livestock products and by-products."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Livestock:</strong> domesticated farm animals</li>
            <li><strong>Ruminants:</strong> four‑stomach animals (cattle, sheep, goats)</li>
            <li><strong>Non‑ruminants:</strong> single stomach (pigs, poultry, fish)</li>
            <li><strong>Products:</strong> meat, milk, eggs, wool</li>
            <li><strong>By‑products:</strong> hides, bone meal, manure</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'small-livestock-production',
      title: 'Small Livestock Production – Broiler Breeds',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Are Broiler Breeds?">
            <p>
              <strong>Definition:</strong> Broilers are chickens that are specially
              bred for meat production. They grow very quickly and reach market
              weight (about 2 kg) in 6–8 weeks.
            </p>
            <p>
              Common broiler breeds include <strong>Cobb 500</strong>, <strong>Ross 308</strong>,
              and <strong>Arbor Acres</strong>. They have high feed conversion
              efficiency, meaning they convert feed into meat very well.
            </p>
          </SubtopicCard>

          <SubtopicCard title="Importance of Rearing Broilers">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Quick returns:</strong> Broilers mature in 6–8 weeks,
                allowing rapid income generation.
              </li>
              <li>
                <strong>High meat quality:</strong> Broiler meat is tender, tasty,
                and in high demand.
              </li>
              <li>
                <strong>Employment:</strong> Broiler production creates jobs in
                farming, processing, and marketing.
              </li>
              <li>
                <strong>Nutrition:</strong> Provides affordable animal protein for
                families.
              </li>
              <li>
                <strong>Export potential:</strong> Zimbabwe exports broiler meat
                to neighbouring countries.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Housing Requirements for Broilers">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Types of Brooders</h4>
            <p>
              A brooder is a heated enclosure used to keep young chicks warm
              during the first few weeks of life. Common types include:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Gas brooders:</strong> Use propane or natural gas; efficient
                and easily controlled. Common in large commercial farms.
              </li>
              <li>
                <strong>Electric brooders:</strong> Use infrared bulbs or heating
                elements; safe and clean, but require reliable electricity.
              </li>
              <li>
                <strong>Charcoal/wood‑fired brooders:</strong> Traditional and
                cheap, used in rural areas where electricity is not available.
                Requires careful monitoring to avoid fire or smoke.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Deep Litter System</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A housing system where birds are kept
                on a floor covered with absorbent litter material (e.g., wood shavings,
                rice hulls, sawdust).
              </li>
              <li>
                <strong>Requirements:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Litter depth: 5–10 cm initially, topped up as needed.</li>
                  <li>Proper ventilation to keep the litter dry (wet litter causes disease).</li>
                  <li>Regular stirring to prevent caking and reduce ammonia build‑up.</li>
                  <li>Space: about 10–12 birds per square metre.</li>
                </ul>
              </li>
              <li>
                <strong>Advantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Comfortable for birds (soft floor).</li>
                  <li>Litter absorbs moisture and droppings, reducing smell.</li>
                  <li>Can be composted and used as fertiliser after the batch.</li>
                </ul>
              </li>
              <li>
                <strong>Disadvantages:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Requires regular maintenance.</li>
                  <li>Risk of disease if litter becomes wet or contaminated.</li>
                </ul>
              </li>
            </ul>
            <AnimalImage
              fileName="broiler-housing-brooders-deep-litter.webp"
              alt="A 2D diagram showing gas, electric, and charcoal brooders, and a deep litter poultry house with litter, feeders, drinkers"
              caption="Broiler housing: types of brooders and the deep litter system."
            />
          </SubtopicCard>

          <SubtopicCard title="Other Small Livestock Production">
            <p>
              Besides broilers, small livestock like <strong>pigs</strong>, <strong>rabbits</strong>,
              and <strong>fish</strong> are also important in Zimbabwe. They are suitable
              for small‑scale farmers because they require less space and capital.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pigs:</strong> Kept for pork; breeds include Large White,
                Landrace, and Duroc. Housing requires pens with clean bedding and
                good drainage.
              </li>
              <li>
                <strong>Rabbits:</strong> Quick breeders, produce meat and fur.
                Housed in hutches with wire floors to keep them clean.
              </li>
              <li>
                <strong>Fish farming (aquaculture):</strong> Tilapia and catfish are
                popular. Ponds must have adequate water supply, aeration, and proper
                feeding.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Broiler Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Broilers:</strong> meat chickens (Cobb, Ross)</li>
            <li><strong>Growth:</strong> 6–8 weeks to market</li>
            <li><strong>Brooders:</strong> gas, electric, charcoal</li>
            <li><strong>Deep litter:</strong> wood shavings, good ventilation</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'animal-health',
      title: 'Animal Health',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="What Is Animal Health?">
            <p>
              <strong>Definition:</strong> Animal health refers to the state of
              physical and mental well‑being of an animal. A healthy animal is
              free from disease, injury, and stress, and is able to perform its
              normal functions like eating, moving, growing, and reproducing.
            </p>
            <p>
              Good animal health is essential for productivity – sick animals
              produce less meat, milk, eggs, and offspring. It also affects human
              health through zoonotic diseases (diseases that can pass from animals
              to humans).
            </p>
          </SubtopicCard>

          <SubtopicCard title="Distinguishing Healthy from Unhealthy Livestock">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Signs of Health (Healthy Animal)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Alert and active:</strong> The animal is responsive and moves around normally.</li>
              <li><strong>Good appetite:</strong> Eats and drinks normally.</li>
              <li><strong>Normal temperature:</strong> Cattle ~38.5°C, poultry ~41°C, pigs ~39°C.</li>
              <li><strong>Clean, bright eyes:</strong> No discharge or dullness.</li>
              <li><strong>Shiny coat/skin:</strong> Hair or feathers are smooth and glossy.</li>
              <li><strong>Normal breathing:</strong> Steady, not laboured.</li>
              <li><strong>Normal droppings:</strong> Consistent in consistency and colour.</li>
              <li><strong>Good body condition:</strong> Not too thin or too fat.</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Signs of Ill‑Health (Sick Animal)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Lethargy/dullness:</strong> Animal is quiet, isolated, or reluctant to move.</li>
              <li><strong>Loss of appetite:</strong> Not eating or drinking enough.</li>
              <li><strong>Fever (elevated temperature).</strong></li>
              <li><strong>Discharge from eyes, nose, or other openings.</strong></li>
              <li><strong>Coughing, sneezing, or laboured breathing.</strong></li>
              <li><strong>Diarrhoea or constipation.</strong></li>
              <li><strong>Rough or dull coat, skin lesions, or wounds.</strong></li>
              <li><strong>Weight loss or poor growth.</strong></li>
              <li><strong>Abnormal behaviour:</strong> Grinding teeth, circling, etc.</li>
            </ul>
            <AnimalImage
              fileName="signs-health-illness-livestock.webp"
              alt="A split 2D diagram showing healthy animal (alert, clean eyes, shiny coat) vs unhealthy animal (dull, discharge, rough coat)"
              caption="Signs of health and illness in livestock."
            />
          </SubtopicCard>

          <SubtopicCard title="Common Diseases and Prevention">
            <p>
              In Zimbabwe, livestock are affected by various diseases. Some
              common ones include:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Foot‑and‑mouth disease (cattle):</strong> Viral, causes
                blisters on mouth and feet; controlled by vaccination and movement
                restrictions.
              </li>
              <li>
                <strong>Newcastle disease (poultry):</strong> Viral, causes respiratory
                distress and death; controlled by vaccination and biosecurity.
              </li>
              <li>
                <strong>African swine fever (pigs):</strong> Viral, high mortality;
                control by quarantine and strict hygiene.
              </li>
              <li>
                <strong>Internal and external parasites:</strong> Worms, ticks,
                mites; controlled by deworming, dipping, and spraying.
              </li>
            </ul>
            <p>
              <strong>Prevention measures:</strong> Vaccination, regular health
              checks, clean housing, proper nutrition, quarantine of new animals,
              and prompt treatment.
            </p>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Health Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Healthy:</strong> active, good appetite, shiny coat, normal droppings</li>
            <li><strong>Ill:</strong> dull, loss of appetite, fever, discharge, diarrhoea</li>
            <li><strong>Prevention:</strong> vaccination, hygiene, nutrition, biosecurity</li>
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
            Explore types of livestock, small livestock production (broilers),
            and animal health – with a focus on practical management in Zimbabwe
            and Africa.
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
                  <strong className="text-white">Livestock types</strong> include
                  ruminants (cattle, sheep, goats), non‑ruminants (pigs, rabbits),
                  poultry (chickens, ducks), and fish. They provide food, income,
                  draught power, and many by‑products.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Broiler production</strong> is
                  important for quick meat supply. Brooders (gas, electric, charcoal)
                  keep chicks warm, and the deep litter system provides comfortable
                  housing with good management.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Animal health</strong> is critical
                  for productivity. Healthy animals are active and have good appetite;
                  sick animals show dullness, loss of appetite, fever, or discharges.
                  Prevention includes vaccination, hygiene, and nutrition.
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

export default AnimalHusbandry;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/animal-husbandry/
   Use a mix of 2D diagram style and realistic photographs.

   --- TYPES OF LIVESTOCK ---
   1. types-of-livestock.png
      A 2D diagram showing four panels: ruminants (cattle, sheep, goats), non‑ruminants (pig, rabbit), poultry (chicken, duck), and fish (tilapia).
      Include labels for each type.

   2. livestock-products.png
      A 2D diagram showing products (meat, milk, eggs, wool) and by‑products (leather, bone meal, manure, feathers, gelatin).

   --- SMALL LIVESTOCK PRODUCTION (BROILERS) ---
   3. broiler-housing-brooders-deep-litter.png
      A 2D diagram with: top – three types of brooders (gas, electric, charcoal), bottom – a cross‑section of a deep litter house showing litter, feeders, drinkers, and ventilation.

   --- ANIMAL HEALTH ---
   4. signs-health-illness-livestock.png
      A split diagram: left side – a healthy animal (alert, bright eyes, smooth coat), right side – an unhealthy animal (dull, discharge, rough coat, isolated).
      Include icons for appetite, temperature, droppings.

   ============================================================ */