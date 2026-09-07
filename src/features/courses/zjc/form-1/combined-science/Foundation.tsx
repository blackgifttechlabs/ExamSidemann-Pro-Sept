import React, { useState, useRef } from 'react';
import { useLessonState } from '../../../lessonProgress';

/* ---------- Helper: SVG to data URI ---------- */
const svgToDataUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

/* ---------- SVG diagrams ---------- */
const measuringCylinderSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 350" width="100%" height="100%">
  <rect width="200" height="350" fill="white" />
  <rect x="60" y="50" width="80" height="250" rx="5" fill="rgba(200,230,255,0.3)" stroke="#1e293b" stroke-width="2" />
  <g stroke="#1e293b" stroke-width="1">
    ${Array.from({ length: 8 }, (_, i) => {
      const y = 60 + i*30;
      return `<line x1="100" y1="${y}" x2="120" y2="${y}" />`;
    }).join('')}
  </g>
  <path d="M 65 170 Q 100 160 135 170" fill="none" stroke="#2563eb" stroke-width="2" />
  <text x="80" y="190" font-size="12" font-family="Arial" fill="#2563eb">meniscus</text>
  <line x1="40" y1="170" x2="160" y2="170" stroke="red" stroke-width="2" stroke-dasharray="4,4" />
  <text x="10" y="165" font-size="12" font-family="Arial" fill="red">eye level</text>
  <text x="140" y="80" font-size="14" font-family="Arial" fill="#1e293b">mL</text>
  <text x="140" y="110" font-size="14" font-family="Arial" fill="#1e293b">100</text>
  <text x="140" y="140" font-size="14" font-family="Arial" fill="#1e293b">80</text>
  <text x="140" y="170" font-size="14" font-family="Arial" fill="#1e293b">60</text>
</svg>
`;

const safetySymbolsSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 150" width="100%" height="100%">
  <rect width="600" height="150" fill="white" />
  <g transform="translate(50,15)">
    <rect x="0" y="0" width="100" height="120" rx="10" fill="#fef2f2" stroke="#ef4444" stroke-width="2" />
    <circle cx="50" cy="50" r="30" fill="#ef4444" />
    <path d="M35 35 L65 65 M65 35 L35 65" stroke="white" stroke-width="5" />
    <text x="50" y="110" text-anchor="middle" font-size="14" font-weight="bold" fill="#ef4444">Corrosive</text>
  </g>
  <g transform="translate(180,15)">
    <rect x="0" y="0" width="100" height="120" rx="10" fill="#fefce8" stroke="#eab308" stroke-width="2" />
    <circle cx="50" cy="50" r="30" fill="#eab308" />
    <path d="M50 25 L50 75 M30 45 L70 45 M40 60 L60 40" stroke="white" stroke-width="4" />
    <text x="50" y="110" text-anchor="middle" font-size="14" font-weight="bold" fill="#ca8a04">Flammable</text>
  </g>
  <g transform="translate(310,15)">
    <rect x="0" y="0" width="100" height="120" rx="10" fill="#fef2f2" stroke="#ef4444" stroke-width="2" />
    <circle cx="50" cy="50" r="30" fill="black" />
    <circle cx="50" cy="45" r="5" fill="white" />
    <circle cx="50" cy="45" r="2" fill="black" />
    <path d="M50 50 L50 65 M50 70 L50 75" stroke="white" stroke-width="4" />
    <text x="50" y="110" text-anchor="middle" font-size="14" font-weight="bold" fill="#dc2626">Toxic</text>
  </g>
  <g transform="translate(440,15)">
    <rect x="0" y="0" width="100" height="120" rx="10" fill="#fefce8" stroke="#eab308" stroke-width="2" />
    <circle cx="50" cy="50" r="30" fill="#eab308" />
    <text x="50" y="55" text-anchor="middle" font-size="30" fill="white">!</text>
    <text x="50" y="110" text-anchor="middle" font-size="14" font-weight="bold" fill="#ca8a04">Irritant</text>
  </g>
</svg>
`;

const bunsenBurnerSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250" width="100%" height="100%">
  <rect width="200" height="250" fill="white" />
  <!-- Base -->
  <rect x="70" y="220" width="60" height="10" rx="3" fill="#6b7280" />
  <rect x="85" y="200" width="30" height="20" rx="2" fill="#9ca3af" />
  <!-- Tube -->
  <rect x="90" y="60" width="20" height="140" rx="2" fill="#d1d5db" />
  <!-- Collar -->
  <rect x="85" y="140" width="30" height="15" rx="2" fill="#6b7280" />
  <!-- Flame -->
  <path d="M100 60 Q85 40 95 10 Q100 0 105 10 Q115 40 100 60" fill="#fbbf24" opacity="0.9" />
  <path d="M100 60 Q92 45 97 25 Q100 15 103 25 Q108 45 100 60" fill="#fcd34d" opacity="0.8" />
  <path d="M100 60 Q96 50 99 35 Q100 28 101 35 Q104 50 100 60" fill="#fde68a" opacity="0.7" />
  <text x="100" y="195" text-anchor="middle" font-size="10" font-family="Arial" fill="#374151">collar</text>
  <!-- labels -->
  <text x="130" y="75" font-size="12" font-family="Arial" fill="#dc2626">blue flame</text>
  <text x="130" y="90" font-size="12" font-family="Arial" fill="#dc2626">(hottest)</text>
</svg>
`;

const foundationImage = (fileName: string) => new URL(`../mathematics/images/${fileName}`, import.meta.url).href;

const placeholderToImage = (placeholder: string) =>
  foundationImage(`${placeholder.replace(/[{}]/g, '')}.png`);

const labImages = {
  apparatusFullLineup: foundationImage('apparatus_full_lineup_overview.png'),
  readingThermometer: foundationImage('reading_thermometer_correctly.png'),
  readingMeniscus: foundationImage('reading_the_meniscus.png'),
  balanceZeroing: foundationImage('balance_zeroing_and_liquid_mass.png'),
  measuringVolumePractical: foundationImage('practical_measuring_volume_steps.png'),
};

/* ---------- Content ---------- */
interface TopicSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const PlaceholderImage: React.FC<{ placeholder: string; alt: string; className?: string }> = ({
  placeholder,
  alt,
  className = 'mt-3 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm',
}) => (
  <img
    src={placeholderToImage(placeholder)}
    alt={alt}
    loading="lazy"
    decoding="async"
    className={className}
  />
);

const sections: TopicSection[] = [
  {
    id: 'part-a',
    title: 'Part A: Laboratory Rules (15 Rules)',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-8">
          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-slate-700 leading-relaxed">
              A science laboratory has fire, glass, chemicals, and heat all in one room. Rules exist so that an experiment that teaches you something never accidentally hurts you or your classmates.
            </p>
          </div>

          {/* A. Instruction & General Conduct Rules */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
              <span className="inline-block w-1 h-6 bg-blue-500 rounded-full"></span>
              A. Instruction & General Conduct Rules
            </h3>
            <div className="grid gap-4">
              {[
                {
                  num: 1,
                  rule: 'Always listen to and follow your teacher\'s instructions before starting any practical. Never begin an experiment before you are told to.',
                  placeholder: '{rule_1_follow_instructions}'
                },
                {
                  num: 2,
                  rule: 'Never run, play, or push others in the laboratory. A lab is a workspace, not a playground — sudden movement causes spills and breakages.',
                  placeholder: '{rule_2_no_running}'
                },
                {
                  num: 3,
                  rule: 'Do not eat, drink, or chew anything in the laboratory. Chemicals can contaminate food, and food can contaminate experiments.',
                  placeholder: '{rule_3_no_eating}'
                },
                {
                  num: 4,
                  rule: 'Keep your workspace clear. Only the apparatus and books you need for the current experiment should be on the bench.',
                  placeholder: '{rule_4_clear_workspace}'
                },
                {
                  num: 5,
                  rule: 'Report every accident immediately, no matter how small — a small chemical splash left unreported can become a serious injury.',
                  placeholder: '{rule_5_report_accidents}'
                }
              ].map((item) => (
                <div key={item.num} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                  <div className="flex gap-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {item.num}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 leading-relaxed">{item.rule}</p>
                  </div>
                  </div>
                  <PlaceholderImage placeholder={item.placeholder} alt={`Laboratory rule ${item.num}`} className="mt-4 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
                </div>
              ))}
            </div>
          </div>

          {/* B. Hygiene Rules */}
          <div>
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-blue-500 rounded-full"></span>
            B. Hygiene Rules
          </h3>
          <div className="grid gap-4">
            {[
              {
                num: 6,
                rule: 'Wash your hands with soap before and after every practical lesson.',
                placeholder: '{rule_6_wash_hands}'
              },
              {
                num: 7,
                rule: 'Tie back long hair and tuck in loose clothing before working near a flame — loose items catch fire easily.',
                placeholder: '{rule_7_tie_hair}'
              },
              {
                num: 8,
                rule: 'Never taste any substance in the laboratory, even if you think you know what it is.',
                placeholder: '{rule_8_no_tasting}'
              },
              {
                num: 9,
                rule: 'Do not smell chemicals directly. Instead, gently waft the vapor toward your nose with your hand.',
                placeholder: '{rule_9_wafting_smell}'
              },
              {
                num: 10,
                rule: 'Keep laboratory coats/aprons on during practicals to protect your skin and clothes from chemical stains or burns.',
                placeholder: '{rule_10_wear_lab_coat}'
              }
            ].map((item) => (
              <div key={item.num} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {item.num}
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 leading-relaxed">{item.rule}</p>
                </div>
                </div>
                <PlaceholderImage placeholder={item.placeholder} alt={`Laboratory rule ${item.num}`} className="mt-4 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* C. Handling Spills and Accidents */}
        <div>
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-blue-500 rounded-full"></span>
            C. Handling Spills and Accidents
          </h3>
          <div className="grid gap-4">
            {[
              {
                num: 11,
                rule: 'If a chemical spills, do not touch it — inform your teacher immediately so it can be cleaned up safely.',
                placeholder: '{rule_11_chemical_spill}'
              },
              {
                num: 12,
                rule: 'If a chemical touches your skin or eyes, rinse the area with plenty of clean water immediately and tell your teacher.',
                placeholder: '{rule_12_rinse_skin_eyes}'
              },
              {
                num: 13,
                rule: 'Broken glass must never be picked up with bare hands. Use a brush and dustpan, or ask your teacher.',
                placeholder: '{rule_13_broken_glass}'
              }
            ].map((item) => (
              <div key={item.num} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {item.num}
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 leading-relaxed">{item.rule}</p>
                </div>
                </div>
                <PlaceholderImage placeholder={item.placeholder} alt={`Laboratory rule ${item.num}`} className="mt-4 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* D. Handling Chemicals and Equipment */}
        <div>
          <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center gap-2">
            <span className="inline-block w-1 h-6 bg-blue-500 rounded-full"></span>
            D. Handling Chemicals and Equipment
          </h3>
          <div className="grid gap-4">
            {[
              {
                num: 14,
                rule: 'Always read the label on a chemical bottle twice before using it, and never use a chemical from an unlabeled container.',
                placeholder: '{rule_14_read_label_twice}'
              },
              {
                num: 15,
                rule: 'Point test tubes away from yourself and others when heating, since heated liquids can suddenly spurt out.',
                placeholder: '{rule_15_point_away_heating}'
              }
            ].map((item) => (
              <div key={item.num} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                  {item.num}
                </div>
                <div className="flex-1">
                  <p className="text-slate-800 leading-relaxed">{item.rule}</p>
                </div>
                </div>
                <PlaceholderImage placeholder={item.placeholder} alt={`Laboratory rule ${item.num}`} className="mt-4 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm" />
              </div>
            ))}
          </div>
        </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Safety symbols to recognise</h3>
            <img
              src={svgToDataUri(safetySymbolsSvg)}
              alt="Laboratory safety symbols: corrosive, flammable, toxic, irritant"
              className="w-full rounded-xl border border-slate-200 bg-white p-2"
            />
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Read hazard symbols before using chemicals. If you are not sure what a symbol means, stop and ask the teacher first.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <h4 className="mb-2 font-bold text-amber-900">Quick safety memory</h4>
            <ul className="space-y-2 text-sm leading-relaxed text-amber-800">
              <li>• Follow instructions before starting.</li>
              <li>• Do not eat, drink, run, or play in the lab.</li>
              <li>• Report spills, broken glass, and accidents immediately.</li>
              <li>• Point heated test tubes away from people.</li>
            </ul>
          </div>
        </aside>
      </div>
    )
  },
  {
    id: 'part-b',
    title: 'Part B: Apparatus and Their Uses',
    content: (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <div className="space-y-6">
        <div className="grid gap-5">
          {[
            {
              name: 'Crucible',
              desc: 'A small, heat-resistant bowl, usually made of porcelain, used to heat solid substances to very high temperatures — for example, to burn a solid until it turns to ash, or to melt certain substances.',
              crucial: 'It can withstand direct, very high heat without cracking — unlike glass.',
              placeholder: '{apparatus_crucible}'
            },
            {
              name: 'Evaporating Dish',
              desc: 'A shallow, wide, saucer-shaped dish made of porcelain or glass, used to evaporate liquid from a solution so that the dissolved solid is left behind (e.g., getting salt from salty water).',
              crucial: 'Its wide, shallow shape gives the liquid a large surface area so it evaporates faster.',
              placeholder: '{apparatus_evaporating_dish}'
            },
            {
              name: 'Tripod Stand',
              desc: 'A three-legged metal stand that supports apparatus (like a beaker, crucible, or evaporating dish) above a Bunsen burner or spirit burner while heating.',
              crucial: 'It must always be placed on a stable, flat surface, never near the edge of a bench.',
              placeholder: '{apparatus_tripod_stand}'
            },
            {
              name: 'Wire Gauze',
              desc: 'A flat square of wire mesh, often with a ceramic center, placed on top of a tripod stand to spread heat evenly under a beaker or flask.',
              crucial: 'It stops the glass from cracking by preventing a single hot spot from touching it directly.',
              placeholder: '{apparatus_wire_gauze}'
            },
            {
              name: 'Bunsen Burner',
              desc: 'A gas-powered burner used as the main heat source in the laboratory. Turning the collar changes the air supply, which changes the flame from a yellow "safety flame" (cooler, more visible) to a blue "roaring flame" (hotter, used for heating).',
              crucial: 'The blue flame is the hottest and is used for active heating; the yellow flame is only for standby, because it is cooler and safer to leave visible.',
              placeholder: '{apparatus_bunsen_burner}',
              image: svgToDataUri(bunsenBurnerSvg),
              imageCaption: 'Bunsen burner with blue flame (hottest) and adjustable collar.'
            },
            {
              name: 'Spirit Burner',
              desc: 'A small burner filled with methylated spirit (alcohol), used as an alternative heat source when a gas supply is not available.',
              crucial: 'It must always be lit with a match held at the wick, never tilted or refilled while lit.',
              placeholder: '{apparatus_spirit_burner}'
            },
            {
              name: 'Spatula',
              desc: 'A small metal or plastic tool with a flat blade, used to scoop, transfer, or measure out small amounts of solid chemicals or powders.',
              crucial: 'A separate clean spatula (or a clean one wiped between uses) must be used for each chemical to avoid contamination.',
              placeholder: '{apparatus_spatula}'
            },
            {
              name: 'Hand Lens (Magnifying Glass)',
              desc: 'A small lens held in the hand and used to look closely at small objects, such as crystals, insects, or fine structures, to see details not visible to the naked eye.',
              crucial: 'Hold it close to your eye and move the object, not the lens, to bring it into sharp focus.',
              placeholder: '{apparatus_hand_lens}'
            },
            {
              name: 'Beaker',
              desc: 'A cylindrical glass container with a flat bottom and a small pouring spout, used to hold, mix, stir, or heat liquids. It has volume markings but they are only approximate.',
              crucial: 'Never use a beaker for precise volume measurement — use a measuring cylinder instead.',
              placeholder: '{apparatus_beaker}'
            },
            {
              name: 'Test Tube',
              desc: 'A small, narrow glass tube, closed at one end, used to hold, mix, heat, or observe small amounts of substances during an experiment.',
              crucial: 'When heating a test tube, always point the open end away from yourself and others.',
              placeholder: '{apparatus_test_tube}'
            },
            {
              name: 'Funnel',
              desc: 'A cone-shaped tool with a wide top and a narrow tube at the bottom, used to guide liquids or fine powders into a container with a small opening, or to hold filter paper during filtration.',
              crucial: 'In filtration, filter paper is folded into a cone and placed inside the funnel to trap solid particles.',
              placeholder: '{apparatus_funnel}'
            },
            {
              name: 'Measuring Cylinder',
              desc: 'A tall, narrow glass or plastic cylinder marked with volume graduations, used to measure the volume of a liquid accurately.',
              crucial: 'It is far more accurate than a beaker for measuring volume, because it is narrow and finely graduated.',
              placeholder: '{apparatus_measuring_cylinder}',
              image: svgToDataUri(measuringCylinderSvg),
              imageCaption: 'Measuring cylinder: read the meniscus at eye level for accurate volume.'
            },
            {
              name: 'Balance (Beam Balance / Electronic Balance)',
              desc: 'An instrument used to measure the mass of a solid or liquid substance accurately, in grams.',
              crucial: 'It must always be zeroed (or "tared") before use, especially when measuring the mass of a liquid inside a container.',
              placeholder: '{apparatus_balance}'
            },
            {
              name: 'Thermometer',
              desc: 'A narrow glass or digital instrument used to measure temperature, usually in degrees Celsius (°C).',
              crucial: 'The bulb of the thermometer must be fully submerged in the substance, but must not touch the sides or bottom of the container, when taking a reading.',
              placeholder: '{apparatus_thermometer}'
            }
          ].map((item) => (
            <div key={item.name} className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col gap-4">
                <div>
                  <h4 className="text-lg font-bold text-blue-700 mb-2">{item.name}</h4>
                  <p className="text-slate-700 leading-relaxed">{item.desc}</p>
                  <div className="mt-3 p-3 bg-amber-50 rounded-r-lg">
                    <span className="font-semibold text-amber-800">Crucial point:</span>
                    <span className="text-amber-700 ml-1">{item.crucial}</span>
                  </div>
                </div>
                {(item.image || item.placeholder) && (
                  <div className="flex flex-col items-center">
                    <img
                      src={placeholderToImage(item.placeholder)}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full max-h-56 object-contain rounded-lg border border-slate-200 bg-white p-2"
                    />
                    {item.imageCaption && (
                      <span className="text-xs text-slate-500 text-center mt-1">{item.imageCaption}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-sm text-blue-700">
          <img
            src={labImages.apparatusFullLineup}
            alt="Full laboratory apparatus lineup"
            loading="lazy"
            decoding="async"
            className="w-full rounded-xl border border-blue-100 bg-white object-contain"
          />
        </div>
        </div>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-bold text-blue-700">Apparatus visual guide</h3>
            <img
              src={labImages.apparatusFullLineup}
              alt="Laboratory apparatus overview"
              loading="lazy"
              decoding="async"
              className="w-full rounded-xl border border-slate-200 bg-white object-contain"
            />
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Use this overview to connect each apparatus name to its picture before reading the detailed use cards.
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
            <h4 className="mb-2 font-bold text-blue-900">Group the apparatus</h4>
            <ul className="space-y-2 text-sm leading-relaxed text-blue-800">
              <li>• Heating: crucible, evaporating dish, tripod, wire gauze, Bunsen burner, spirit burner.</li>
              <li>• Measuring: measuring cylinder, balance, thermometer.</li>
              <li>• Handling/observing: spatula, hand lens, beaker, test tube, funnel.</li>
            </ul>
          </div>
        </aside>
      </div>
    )
  },
  {
    id: 'part-c',
    title: 'Part C: Taking Accurate Readings',
    content: (
      <div className="space-y-8">
        <p className="text-lg text-slate-700 leading-relaxed">
          Getting the right measurement is as important as doing the experiment itself — a good method with a careless reading gives a wrong result.
        </p>

        {/* 1. Reading a Thermometer */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Reading a Thermometer</h3>
          <ul className="space-y-2 text-slate-700 list-disc list-inside">
            <li>Keep the thermometer upright and make sure the bulb is fully covered by the liquid, without touching the container's walls or base.</li>
            <li>Wait a few seconds for the reading to stabilize before recording it.</li>
            <li>Read the scale at eye level, looking straight across, not from above or below (this avoids an error called parallax error).</li>
          </ul>
          <img
            src={labImages.readingThermometer}
            alt="How to read a thermometer correctly"
            loading="lazy"
            decoding="async"
            className="mt-4 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
          />
        </div>

        {/* 2. Reading a Measuring Cylinder (The Meniscus) */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Reading a Measuring Cylinder (The Meniscus)</h3>
          <p className="text-slate-700 mb-3">When a liquid is poured into a narrow container like a measuring cylinder, its surface curves. This curve is called the <strong>meniscus</strong>.</p>
          <ul className="space-y-2 text-slate-700 list-disc list-inside">
            <li>Place the measuring cylinder on a flat surface and bring your eye down to the same level as the liquid surface.</li>
            <li>For most liquids (like water), read the volume at the bottom of the curve.</li>
            <li>For a few liquids, like mercury, the surface curves the opposite way, so the reading is taken at the top of the curve.</li>
            <li>Never read the meniscus from above — this causes parallax error and gives an inaccurate volume.</li>
          </ul>
          <img
            src={labImages.readingMeniscus}
            alt="How to read the meniscus in a measuring cylinder"
            loading="lazy"
            decoding="async"
            className="mt-4 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
          />
        </div>

        {/* 3. Using a Balance */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Using a Balance (Zeroing and Measuring Liquids)</h3>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-slate-800">Zeroing/Taring:</span>
              <span className="text-slate-700 ml-1">Before placing anything on the balance, check that the display reads "0.00 g." If it does not, press the zero/tare button to reset it.</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800">Measuring the mass of a solid:</span>
              <span className="text-slate-700 ml-1">Place the object directly on the pan and read the display once the number stops changing.</span>
            </div>
            <div>
              <span className="font-semibold text-slate-800">Measuring the mass of a liquid:</span>
              <ul className="list-disc list-inside text-slate-700 ml-4 space-y-1 mt-1">
                <li>Place the empty container (e.g., a beaker) on the balance and record its mass, OR press "tare" so the display resets to zero with the empty container already on the pan.</li>
                <li>Pour in the liquid.</li>
                <li>If you tared with the container on the pan, the new reading is the mass of the liquid alone.</li>
                <li>If you did not tare, subtract: mass of liquid = (mass of container + liquid) − (mass of empty container).</li>
              </ul>
            </div>
          </div>
          <img
            src={labImages.balanceZeroing}
            alt="Zeroing a balance and measuring liquid mass"
            loading="lazy"
            decoding="async"
            className="mt-4 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
          />
        </div>
      </div>
    )
  },
  {
    id: 'part-d',
    title: 'Part D: Practical — Measuring Volume with a Measuring Cylinder',
    content: (
      <div className="space-y-6">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Aim:</h3>
          <p className="text-slate-700">To accurately measure a given volume of water using a measuring cylinder.</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Apparatus needed:</h3>
          <p className="text-slate-700">Measuring cylinder (100 ml), beaker, water, dropper (optional).</p>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Method:</h3>
          <ol className="space-y-2 text-slate-700 list-decimal list-inside">
            <li>Place the measuring cylinder on a flat, level bench.</li>
            <li>Pour water from the beaker into the measuring cylinder slowly, stopping just before you reach the volume you want.</li>
            <li>Crouch down so your eye is level with the surface of the water (eye-level reading, to avoid parallax error).</li>
            <li>If the water is above or below the line you need, use a dropper (or pour carefully) to add or remove small amounts of water until the bottom of the meniscus sits exactly on the required mark.</li>
            <li>Record the final volume reading, including the correct unit (cm³ or ml).</li>
          </ol>
          <img
            src={labImages.measuringVolumePractical}
            alt="Practical steps for measuring volume using a measuring cylinder"
            loading="lazy"
            decoding="async"
            className="mt-4 w-full rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
          />
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-3">Results Table (example for students to fill in):</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold text-slate-700">Trial</th>
                  <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold text-slate-700">Target Volume (cm³)</th>
                  <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold text-slate-700">Actual Volume Measured (cm³)</th>
                  <th className="border border-slate-300 px-4 py-2 text-left text-sm font-semibold text-slate-700">Difference (cm³)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">1</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">50</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700"></td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700"></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">2</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">25</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700"></td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700"></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">3</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700">75</td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700"></td>
                  <td className="border border-slate-300 px-4 py-2 text-slate-700"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-blue-700 mb-2">Conclusion (guide):</h3>
          <p className="text-slate-700">Students should conclude that the measuring cylinder allows accurate volume measurement when read correctly at eye level, at the bottom of the meniscus, and that careless reading (from above or below) causes measurement errors.</p>
        </div>

        <div className="p-5 bg-amber-50 rounded-xl">
          <h4 className="font-bold text-amber-800">Safety note for this practical:</h4>
          <p className="text-amber-700">Handle glass measuring cylinders carefully — they are narrow and can tip over easily; always place them upright on a flat surface before pouring, and clean up any spilled water immediately to avoid a slipping hazard.</p>
        </div>
      </div>
    )
  },
  {
    id: 'revision-summary',
    title: 'Quick Revision Summary',
    content: (
      <div className="grid gap-6 md:grid-cols-3">
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🛡️</span>
            <h4 className="text-lg font-bold text-blue-700">Safety First</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside">
            <li>Follow instructions</li>
            <li>Stay clean and tidy</li>
            <li>Report spills</li>
            <li>Handle chemicals carefully</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">🔥</span>
            <h4 className="text-lg font-bold text-blue-700">Heating Apparatus</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside">
            <li>Crucible — high heat</li>
            <li>Evaporating dish — evaporation</li>
            <li>Tripod stand & wire gauze — support</li>
            <li>Bunsen burner — main heat source</li>
          </ul>
        </div>

        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">📏</span>
            <h4 className="text-lg font-bold text-blue-700">Measuring Apparatus</h4>
          </div>
          <ul className="space-y-1 text-slate-700 list-disc list-inside">
            <li>Thermometer — temperature</li>
            <li>Measuring cylinder — volume (meniscus)</li>
            <li>Balance — mass (zero/tare)</li>
          </ul>
        </div>

        <div className="md:col-span-3 p-5 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👁️</span>
            <h4 className="text-lg font-bold text-blue-700">Golden Rule for All Readings</h4>
          </div>
          <p className="text-slate-700 mt-1">Always read at eye level to avoid parallax error.</p>
        </div>
      </div>
    )
  }
];

/* ---------- Components ---------- */
const TopicNav: React.FC<{ activeId: string; onNavigate: (id: string) => void }> = ({ activeId, onNavigate }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-30 w-full border-b-2 border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0a0a0b]/95 py-2.5 backdrop-blur-md shadow-xs">
      <div className="w-full px-[5px] sm:px-6 md:px-8 relative flex items-center">
        <button
          onClick={() => scroll('left')}
          className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18181b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-xs"
          aria-label="Scroll left"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div ref={scrollRef} className="flex gap-2 overflow-x-auto flex-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className={`shrink-0 whitespace-nowrap rounded-2xl px-4 py-2 text-xs font-black transition-all active:translate-y-0.5 ${
                activeId === s.id
                  ? 'bg-teal-600 border-b-4 border-teal-800 text-white shadow-sm'
                  : 'border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#1a1a1a] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
              }`}
            >
              {s.title.replace(/^Part [A-D]: /, '')}
            </button>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl border-2 border-b-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-[#18181b] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5 transition-all shadow-xs"
          aria-label="Scroll right"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </div>
  );
};

const Section: React.FC<{ section: TopicSection }> = ({ section }) => (
  <section id={section.id} className="mb-16 scroll-mt-24">
    <div className="mb-6">
      <h2 className="text-2xl font-black text-slate-900 dark:text-white">{section.title}</h2>
    </div>
    <div className="prose prose-slate dark:prose-invert max-w-none">
      {section.content}
    </div>
  </section>
);

interface FoundationProps {
  onNextTopic?: () => void;
  nextTopicTitle?: string;
}

export const Foundation: React.FC<FoundationProps> = ({ onNextTopic, nextTopicTitle = 'Biology' }) => {
  const [active, setActive] = useLessonState('chapter', sections[0].id);
  const activeIndex = Math.max(sections.findIndex((section) => section.id === active), 0);
  const activeSection = sections[activeIndex];
  const isLastFoundationChapter = activeIndex >= sections.length - 1;

  const handleNavigate = (id: string) => {
    setActive(id);
    document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!isLastFoundationChapter) {
      setActive(sections[activeIndex + 1].id);
      document.getElementById('lesson-scroll-area')?.scrollTo({ top: 0, behavior: 'smooth' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onNextTopic?.();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0a0a0b] font-sans text-slate-900 dark:text-slate-100 pb-20">
      {/* Duolingo Gradient Header */}
      <header className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-800 border-b-4 border-teal-900 pb-8 pt-10 text-white shadow-md">
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

        <div className="w-full px-[5px] sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center rounded-2xl px-3.5 py-1 text-xs font-black tracking-wider uppercase bg-teal-400/30 text-white border border-teal-200/40 shadow-xs">
                CHAPTER 1 • FOUNDATION
              </span>
              <span className="rounded-2xl bg-white/20 px-3 py-1 text-xs font-bold text-white/90 backdrop-blur-xs">
                ZJC Form 1 • Combined Science
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-white/90">
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                🔬 {sections.length} Parts
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-2xl bg-black/20 px-3.5 py-1.5 backdrop-blur-md border border-white/25 shadow-inner">
                🥼 Lab Skills
              </span>
            </div>
          </div>

          <h1 className="mt-4 mb-2 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
            Laboratory Safety and Apparatus
          </h1>
          <p className="max-w-3xl text-sm sm:text-base leading-relaxed text-teal-50 font-medium">
            Science begins with safe practical work. Learn how to behave in a laboratory, handle equipment, and take accurate measurements.
          </p>
        </div>
      </header>

      <TopicNav activeId={active} onNavigate={handleNavigate} />

      <div className="w-full px-[5px] sm:px-6 md:px-8 pt-8 sm:pt-12">
        <div id="foundation-chapter-content">
          <Section section={activeSection} />
        </div>

        {/* Footer - Key Takeaways */}
        {isLastFoundationChapter && (
          <div className="mt-12 rounded-3xl border-2 border-b-6 border-teal-800 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 p-6 sm:p-8 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💡</span>
              <h3 className="font-black text-xl sm:text-2xl">Key Takeaways</h3>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 text-sm text-teal-50 font-medium">
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🛡️ Safety first:</strong>
                Always follow lab rules – no eating, report spills, waft smells carefully.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">🧪 Apparatus:</strong>
                Know the names and uses of beakers, measuring cylinders, balances, thermometers, and Bunsen burners.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">📏 Measurement:</strong>
                Read scales at eye level, zero balances, and wait for readings to settle.
              </li>
              <li className="rounded-2xl bg-white/10 p-3.5 backdrop-blur-xs border border-white/15">
                <strong className="text-white block font-bold mb-1">⚠️ Hazard symbols:</strong>
                Recognise corrosive, flammable, toxic, and irritant symbols immediately.
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 rounded-3xl border-2 border-b-6 border-slate-200 dark:border-slate-800 bg-white dark:bg-[#18181b] p-6 sm:p-8 shadow-sm text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            {isLastFoundationChapter ? 'Section complete' : `Part ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">
            {isLastFoundationChapter ? (
              <>
                Ready for the next section: <span className="text-teal-600 dark:text-teal-400">{nextTopicTitle}</span>
              </>
            ) : (
              <>
                Up Next: <span className="text-teal-600 dark:text-teal-400">{sections[activeIndex + 1].title}</span>
              </>
            )}
          </h3>
          <div className="flex items-center justify-center gap-4">
            {activeIndex > 0 && (
              <button
                type="button"
                onClick={() => handleNavigate(sections[activeIndex - 1].id)}
                className="rounded-2xl border-2 border-b-4 border-slate-300 dark:border-slate-700 bg-white dark:bg-[#18181b] px-6 py-3 text-xs sm:text-sm font-black text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-100 dark:hover:bg-slate-800 active:translate-y-0.5"
              >
                ← Previous Part
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={isLastFoundationChapter && !onNextTopic}
              className="rounded-2xl border-2 border-b-4 border-teal-800 bg-teal-600 px-8 py-3 text-xs sm:text-sm font-black text-white shadow-md transition-all hover:bg-teal-500 active:translate-y-0.5 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:border-slate-400 disabled:shadow-none"
            >
              {isLastFoundationChapter ? `Begin ${nextTopicTitle} →` : 'Next Part →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Foundation;
