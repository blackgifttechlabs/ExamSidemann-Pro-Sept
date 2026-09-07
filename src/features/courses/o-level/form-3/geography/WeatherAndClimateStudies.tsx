import React, { useState, useRef } from 'react';

/**
 * Topic: Weather and Climate Studies – Geography
 * Full component with sticky navigation, container cards (9px border-radius),
 * image placeholders, and auto‑scroll + double‑highlight on heading.
 */
export const WeatherAndClimateStudies: React.FC = () => {
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
  const GeographyImage: React.FC<{
    fileName: string;
    alt: string;
    caption: string;
  }> = ({ fileName, alt, caption }) => {
    const [isMissing, setIsMissing] = useState(false);

    if (isMissing) return null;
    return (
      <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm">
        <img
          src={`/images/geography/${fileName}`}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="w-full object-cover"
          onError={() => setIsMissing(true)}
        />
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
      id: 'air-masses',
      title: 'Air Masses',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Definition and Origins of Air Masses">
            <p>
              <strong>Definition:</strong> An air mass is a large body of air that has
              uniform temperature, humidity, and pressure characteristics. Air masses
              form over large areas of land or water called <strong>source regions</strong>.
              The characteristics of an air mass depend on the region where it forms.
            </p>
            <p>
              Air masses are classified by their temperature (tropical, polar, arctic)
              and by their moisture content (maritime = wet, continental = dry).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Types of Air Masses Affecting Southern Africa</h4>
          </SubtopicCard>

          <SubtopicCard title="Tropical Maritime (Tm)">
            <p>
              <strong>Origins:</strong> Forms over the warm Indian Ocean and Atlantic Ocean,
              particularly near the tropics.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong> Warm and moist. It brings humid
                conditions and often leads to rainfall.
              </li>
              <li>
                <strong>Effect on Southern Africa:</strong> Brings moisture to the eastern
                parts of Southern Africa, including Zimbabwe, Mozambique, and South Africa's
                east coast. It is responsible for much of the summer rainfall in these areas.
              </li>
              <li>
                <strong>Example:</strong> Tropical maritime air from the Indian Ocean
                brings rainfall to the Eastern Highlands of Zimbabwe during summer.
              </li>
            </ul>

            <GeographyImage
              fileName="tropical-maritime-air-mass.png"
              alt="A diagram showing the origin and movement of Tropical Maritime air mass from the Indian Ocean into Southern Africa"
              caption="Tropical Maritime air mass: origin and movement into Southern Africa."
            />
          </SubtopicCard>

          <SubtopicCard title="Tropical Continental (Tc)">
            <p>
              <strong>Origins:</strong> Forms over the interior of Southern Africa,
              particularly over the Kalahari Desert and the interior plateaus.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong> Warm and dry. It brings hot, dry
                conditions and can lead to drought.
              </li>
              <li>
                <strong>Effect on Southern Africa:</strong> Causes dry, hot weather
                in the interior of Southern Africa, including Zimbabwe, Botswana, and
                South Africa's interior. It can lead to heatwaves and drought conditions.
              </li>
              <li>
                <strong>Example:</strong> Tropical continental air dominates during
                winter months, bringing dry, sunny weather to most of Zimbabwe.
              </li>
            </ul>

            <GeographyImage
              fileName="tropical-continental-air-mass.png"
              alt="A diagram showing the origin of Tropical Continental air mass over the Kalahari Desert in Southern Africa"
              caption="Tropical Continental air mass: origin over the Kalahari Desert."
            />
          </SubtopicCard>

          <SubtopicCard title="Polar Maritime (Pm)">
            <p>
              <strong>Origins:</strong> Forms over the cold Southern Ocean, near Antarctica.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong> Cold and moist. It brings cold, wet
                conditions and can lead to frontal rainfall.
              </li>
              <li>
                <strong>Effect on Southern Africa:</strong> Occasionally affects the
                southern parts of Southern Africa, including South Africa's Cape region,
                bringing cold fronts and winter rainfall. It can also bring cold
                conditions to Zimbabwe during winter.
              </li>
              <li>
                <strong>Example:</strong> Polar maritime air brings cold fronts to the
                Western Cape of South Africa during winter, causing rainfall.
              </li>
            </ul>

            <GeographyImage
              fileName="polar-maritime-air-mass.png"
              alt="A diagram showing the origin and movement of Polar Maritime air mass from the Southern Ocean towards Southern Africa"
              caption="Polar Maritime air mass: origin and movement into Southern Africa."
            />
          </SubtopicCard>

          <SubtopicCard title="Factors Influencing Pressure Systems and Sequence of Pressure Systems Affecting Southern Africa">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Factors Influencing Pressure Systems</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Temperature:</strong> Warm air rises (low pressure), while
                cold air sinks (high pressure).
              </li>
              <li>
                <strong>Rotation of the Earth (Coriolis effect):</strong> Causes air
                to be deflected, creating high and low pressure systems.
              </li>
              <li>
                <strong>Land and sea distribution:</strong> Land heats and cools faster
                than water, creating pressure differences.
              </li>
              <li>
                <strong>Altitude:</strong> Pressure decreases with altitude.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sequence of Pressure Systems Affecting Southern Africa</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Summer (January):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>The Inter-Tropical Convergence Zone (ITCZ) moves southwards.</li>
                  <li>Low pressure dominates over the interior of Southern Africa.</li>
                  <li>Tropical maritime air brings moisture from the Indian Ocean.</li>
                  <li>Convectional and convergence rainfall occurs.</li>
                </ul>
              </li>
              <li>
                <strong>Winter (July):</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>The ITCZ moves northwards, away from Southern Africa.</li>
                  <li>High pressure dominates over the interior (Kalahari High).</li>
                  <li>Tropical continental air brings dry, clear conditions.</li>
                  <li>Polar maritime air brings cold fronts to the southern Cape.</li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="pressure-systems-southern-africa.png"
              alt="Two maps of Southern Africa showing summer (January) and winter (July) pressure systems"
              caption="Summer and winter pressure systems affecting Southern Africa."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Air mass:</strong> large body of air with uniform characteristics</li>
            <li><strong>Tropical Maritime:</strong> warm, moist air from oceans</li>
            <li><strong>Tropical Continental:</strong> warm, dry air from land</li>
            <li><strong>Polar Maritime:</strong> cold, moist air from polar regions</li>
            <li><strong>ITCZ:</strong> Inter-Tropical Convergence Zone</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'rainfall-types',
      title: 'Rainfall Types and Patterns',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Mechanism of Rainfall Formation">
            <p>
              <strong>Definition:</strong> Rainfall occurs when moist air rises, cools,
              and condenses to form clouds. When the water droplets become too heavy,
              they fall as rain. There are four main types of rainfall:
            </p>
          </SubtopicCard>

          <SubtopicCard title="1. Orographic Rainfall">
            <p>
              <strong>Definition:</strong> Orographic rainfall occurs when moist air
              is forced to rise over a mountain barrier. As the air rises, it cools,
              condenses, and forms clouds on the windward side of the mountain.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Process:</strong> Moist air is forced up the mountain slope.
                It cools, condenses, and rain falls on the windward side. The leeward
                side (rain shadow) is dry.
              </li>
              <li>
                <strong>Example (Zimbabwe):</strong> The Eastern Highlands (Chimanimani,
                Nyanga, Vumba) receive high rainfall due to orographic uplift of moist
                air from the Indian Ocean.
              </li>
              <li>
                <strong>Example (Africa):</strong> Mount Kilimanjaro in Tanzania.
              </li>
            </ul>

            <GeographyImage
              fileName="orographic-rainfall-diagram.png"
              alt="A 2D diagram showing orographic rainfall: moist air rises over mountains, cools, condenses, and rains on the windward side while the leeward side is dry"
              caption="Orographic rainfall: moist air forced to rise over a mountain barrier."
            />
          </SubtopicCard>

          <SubtopicCard title="2. Convectional Rainfall">
            <p>
              <strong>Definition:</strong> Convectional rainfall occurs when the sun
              heats the ground, causing the air above it to warm and rise. As the air
              rises, it cools, condenses, and forms clouds.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Process:</strong> The sun heats the ground. Warm air rises
                rapidly, cools, condenses, and forms towering cumulonimbus clouds.
                Heavy rainfall often occurs in the afternoon.
              </li>
              <li>
                <strong>Example:</strong> Equatorial rainforest regions (Congo Basin)
                and summer afternoon thundershowers in Zimbabwe.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> Afternoon thunderstorms in Harare
                during the summer months (November to March).
              </li>
            </ul>

            <GeographyImage
              fileName="convectional-rainfall-diagram.png"
              alt="A 2D diagram showing convectional rainfall: sun heats the ground, warm air rises, cools, condenses, and forms afternoon thunderstorms"
              caption="Convectional rainfall: warm air rising due to surface heating."
            />
          </SubtopicCard>

          <SubtopicCard title="3. Convergence Rainfall (ITCZ)">
            <p>
              <strong>Definition:</strong> Convergence rainfall occurs when air masses
              from different directions meet and are forced to rise. The Inter-Tropical
              Convergence Zone (ITCZ) is a major convergence zone.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Process:</strong> Warm, moist air from the Indian Ocean meets
                warm, dry air from the interior. The air rises, cools, and condenses,
                forming extensive cloud cover and rainfall.
              </li>
              <li>
                <strong>Example (Zimbabwe):</strong> The ITCZ brings heavy rainfall to
                Zimbabwe during summer (January). Most of Zimbabwe receives 80% of its
                annual rainfall during this period.
              </li>
              <li>
                <strong>Example (Africa):</strong> The ITCZ affects West Africa,
                bringing rainfall to the Sahel region.
              </li>
            </ul>

            <GeographyImage
              fileName="itcz-rainfall-diagram.png"
              alt="A 2D diagram showing the Inter-Tropical Convergence Zone (ITCZ) and how it brings rainfall to Southern Africa"
              caption="Convergence rainfall: the Inter-Tropical Convergence Zone (ITCZ)."
            />
          </SubtopicCard>

          <SubtopicCard title="4. Cyclonic / Frontal Rainfall">
            <p>
              <strong>Definition:</strong> Frontal rainfall occurs when a warm air mass
              meets a cold air mass. The warm air is forced to rise over the cold air,
              leading to cloud formation and rainfall.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Process:</strong> Cold front: cold air pushes under warm air,
                forcing it to rise rapidly, causing heavy rain. Warm front: warm air
                rises gradually over cold air, causing light, steady rain.
              </li>
              <li>
                <strong>Example (Southern Africa):</strong> The South Western Cape of
                South Africa receives winter rainfall from cold fronts brought by
                polar maritime air. This region has a Mediterranean climate.
              </li>
              <li>
                <strong>Zimbabwe:</strong> Frontal rainfall is less common but can
                occur when cold fronts reach the southern parts of Zimbabwe.
              </li>
            </ul>

            <GeographyImage
              fileName="frontal-rainfall-diagram.png"
              alt="A 2D diagram showing frontal rainfall: cold front and warm front formation with associated weather patterns"
              caption="Cyclonic / Frontal rainfall: cold and warm fronts."
            />
          </SubtopicCard>

          <SubtopicCard title="Prevailing Winds in Southern Africa and Their Effect on Rainfall">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>South-East Trade Winds:</strong> Blow from the Indian Ocean
                towards Southern Africa. They bring moisture to the eastern parts of
                the region, including Zimbabwe. They cause orographic rainfall on the
                Eastern Highlands.
              </li>
              <li>
                <strong>North-East Trade Winds:</strong> Blow from the Atlantic Ocean
                and parts of the Indian Ocean. They bring moisture to parts of West
                Africa and occasionally affect Southern Africa.
              </li>
              <li>
                <strong>Westerlies:</strong> Blow from the Atlantic Ocean towards the
                southern Cape. They bring cold fronts and winter rainfall to the
                South Western Cape.
              </li>
            </ul>

            <GeographyImage
              fileName="prevailing-winds-southern-africa.png"
              alt="A map of Southern Africa showing the prevailing wind directions and their effect on rainfall distribution"
              caption="Prevailing winds in Southern Africa and their effect on rainfall distribution."
            />
          </SubtopicCard>

          <SubtopicCard title="Effect of Mountain Alignment on Rainfall Distribution">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Windward side:</strong> The side of a mountain facing the wind.
                Moist air is forced to rise, cools, and condenses, causing heavy rainfall.
              </li>
              <li>
                <strong>Leeward side (Rain shadow):</strong> The side of the mountain
                away from the wind. The air is dry and descends, causing little or no rain.
              </li>
              <li>
                <strong>Example (Zimbabwe):</strong> The Eastern Highlands (Nyanga,
                Chimanimani, Vumba) create a rain shadow effect. The windward side
                (east-facing slopes) receives heavy rainfall, while the leeward side
                (west-facing) receives much less.
              </li>
              <li>
                <strong>Example (Africa):</strong> The Drakensberg Mountains create
                a rain shadow, with the eastern slopes receiving more rainfall than
                the western interior.
              </li>
            </ul>

            <GeographyImage
              fileName="rain-shadow-effect-diagram.png"
              alt="A 2D diagram showing the rain shadow effect: moist air rises over a mountain, rains on the windward side, and creates dry conditions on the leeward side"
              caption="Rain shadow effect: how mountain alignment affects rainfall distribution."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Rainfall Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Orographic:</strong> mountains force air up</li>
            <li><strong>Convectional:</strong> surface heating, afternoon rain</li>
            <li><strong>Convergence:</strong> ITCZ, air masses meet</li>
            <li><strong>Frontal:</strong> warm and cold air meet</li>
            <li><strong>Rain shadow:</strong> dry side of mountains</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'frontal-systems',
      title: 'Frontal Systems',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Development of Anticyclones, Fronts, and Depressions">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Anticyclones (High Pressure Systems)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A high-pressure system where air descends
                and moves outwards in a clockwise direction (in the Southern Hemisphere).
              </li>
              <li>
                <strong>Weather sequence:</strong> Clear skies, dry conditions, calm
                winds, and stable weather.
              </li>
              <li>
                <strong>Example:</strong> The Kalahari High dominates Southern Africa
                during winter, bringing dry, clear conditions.
              </li>
            </ul>

            <GeographyImage
              fileName="anticyclone-diagram.png"
              alt="A 2D diagram showing an anticyclone (high pressure system) with descending air and clockwise wind movement in the Southern Hemisphere"
              caption="Anticyclone: high pressure system with descending air."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Fronts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A front is the boundary between two air
                masses of different temperature and density.
              </li>
              <li>
                <strong>Cold front:</strong> Cold air pushes under warm air, forcing
                it to rise rapidly. Causes heavy rain, thunderstorms, and a drop in temperature.
              </li>
              <li>
                <strong>Warm front:</strong> Warm air rises gradually over cold air.
                Causes light, steady rain and rising temperatures.
              </li>
              <li>
                <strong>Occluded front:</strong> When a cold front catches up with a
                warm front. Often brings complex weather.
              </li>
            </ul>

            <GeographyImage
              fileName="front-types-diagram.png"
              alt="A 2D diagram showing cold front, warm front, and occluded front with their associated weather patterns"
              caption="Types of fronts: cold front, warm front, and occluded front."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Depressions (Low Pressure Systems)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A low-pressure system where air rises
                and moves inwards in an anticlockwise direction (in the Southern Hemisphere).
              </li>
              <li>
                <strong>Weather sequence:</strong> Unstable weather, cloudiness, rainfall,
                and often strong winds.
              </li>
              <li>
                <strong>Types:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Mid-latitude depressions:</strong> Form between 30° and 60°
                    latitude. Bring frontal rainfall.
                  </li>
                  <li>
                    <strong>Tropical cyclones:</strong> Form over warm oceans near the
                    tropics. Bring destructive winds and heavy rainfall.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="depression-low-pressure-diagram.png"
              alt="A 2D diagram showing a depression (low pressure system) with rising air and anticlockwise wind movement in the Southern Hemisphere"
              caption="Depression: low pressure system with rising air."
            />
          </SubtopicCard>

          <SubtopicCard title="Tropical Cyclones">
            <p>
              <strong>Definition:</strong> Tropical cyclones are intense low-pressure
              systems that form over warm tropical oceans. They are characterised by
              strong winds, heavy rain, and storm surges.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Formation:</strong> Warm ocean water (above 26.5°C), moist air,
                and the Coriolis effect. They form between 5° and 20° north and south
                of the equator.
              </li>
              <li>
                <strong>Structure:</strong> Eye (calm centre), eye wall (strongest winds
                and heaviest rain), and spiral rain bands.
              </li>
              <li>
                <strong>Weather sequence:</strong> Calm conditions, then increasing
                winds and rain, then the eye passes (calm), then winds and rain return
                from the opposite direction.
              </li>
              <li>
                <strong>Examples affecting Africa:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Cyclone Domoina (1984):</strong> Affected Madagascar,
                    Mozambique, and South Africa. Caused severe flooding.
                  </li>
                  <li>
                    <strong>Cyclone Idai (2019):</strong> Affected Mozambique, Zimbabwe,
                    and Malawi. Caused widespread destruction and loss of life.
                  </li>
                  <li>
                    <strong>Cyclone Eline (2000):</strong> Affected Madagascar,
                    Mozambique, and South Africa.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="tropical-cyclone-structure.png"
              alt="A 2D diagram showing the structure of a tropical cyclone with the eye, eye wall, and spiral rain bands labelled"
              caption="Tropical cyclone structure: eye, eye wall, and spiral rain bands."
            />

            <GeographyImage
              fileName="tropical-cyclone-path-mozambique.png"
              alt="A map showing the path of Cyclone Domoina and Cyclone Idai affecting Madagascar, Mozambique, and Southern Africa"
              caption="Tropical cyclone paths affecting Southern Africa: Cyclone Domoina and Cyclone Idai."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Frontal Systems Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Anticyclone:</strong> high pressure, dry, clear</li>
            <li><strong>Cold front:</strong> heavy rain, temperature drop</li>
            <li><strong>Warm front:</strong> light rain, temperature rise</li>
            <li><strong>Depression:</strong> low pressure, unstable weather</li>
            <li><strong>Tropical cyclone:</strong> over warm oceans, destructive</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'weather-maps',
      title: 'Simple Weather Maps',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Interpreting Synoptic Charts">
            <p>
              <strong>Definition:</strong> Synoptic charts (weather maps) show weather
              conditions over a large area at a specific time. They use symbols and
              lines to represent weather elements.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Weather Patterns Over Zimbabwe/Southern Africa in Summer (January)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pressure:</strong> Low pressure dominates over the interior
                of Southern Africa.
              </li>
              <li>
                <strong>Wind:</strong> Moist winds from the Indian Ocean blow into
                the region (south-east trade winds).
              </li>
              <li>
                <strong>Rainfall:</strong> Convectional, convergence (ITCZ), and
                orographic rainfall occur. Most of Zimbabwe receives heavy rainfall.
              </li>
              <li>
                <strong>Temperature:</strong> Warm to hot conditions prevail.
              </li>
              <li>
                <strong>Humidity:</strong> High humidity due to moisture from the ocean.
              </li>
            </ul>

            <GeographyImage
              fileName="summer-synoptic-chart-southern-africa.png"
              alt="A synoptic weather chart of Southern Africa in January (summer) showing low pressure, ITCZ, and moist winds"
              caption="Synoptic chart: Southern Africa in summer (January)."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Weather Patterns Over Zimbabwe/Southern Africa in Winter (July)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Pressure:</strong> High pressure (Kalahari High) dominates
                over the interior of Southern Africa.
              </li>
              <li>
                <strong>Wind:</strong> Dry winds blow from the interior (tropical
                continental air). Cold fronts occasionally affect the Cape region.
              </li>
              <li>
                <strong>Rainfall:</strong> Little or no rainfall in Zimbabwe. Dry,
                clear conditions prevail. Rainfall only in the South Western Cape
                (frontal rainfall).
              </li>
              <li>
                <strong>Temperature:</strong> Cool to cold conditions, especially at night.
              </li>
              <li>
                <strong>Humidity:</strong> Low humidity, dry conditions.
              </li>
            </ul>

            <GeographyImage
              fileName="winter-synoptic-chart-southern-africa.png"
              alt="A synoptic weather chart of Southern Africa in July (winter) showing high pressure (Kalahari High) and cold fronts"
              caption="Synoptic chart: Southern Africa in winter (July)."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">How to Read Synoptic Charts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Isobars:</strong> Lines joining points of equal pressure.
                Closely spaced isobars mean strong winds.
              </li>
              <li>
                <strong>Pressure systems:</strong> "H" for high pressure, "L" for low pressure.
              </li>
              <li>
                <strong>Fronts:</strong> Cold front (blue line with triangles),
                warm front (red line with semi-circles).
              </li>
              <li>
                <strong>Wind direction:</strong> Indicated by wind arrows or symbols.
              </li>
              <li>
                <strong>Precipitation:</strong> Areas of cloud and rain are often shaded
                or indicated with symbols.
              </li>
            </ul>

            <GeographyImage
              fileName="synoptic-chart-reading-guide.png"
              alt="A guide showing how to read synoptic charts with labelled isobars, pressure systems, fronts, and weather symbols"
              caption="How to read synoptic charts: isobars, pressure systems, fronts, and weather symbols."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Weather Map Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Summer (Jan):</strong> low pressure, rainfall, high humidity</li>
            <li><strong>Winter (Jul):</strong> high pressure, dry, clear, cold</li>
            <li><strong>Isobars:</strong> lines of equal pressure</li>
            <li><strong>Fronts:</strong> cold and warm front boundaries</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'climate-types',
      title: 'Climate and Climatic Types',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Concept of Climate and Classification">
            <p>
              <strong>Definition:</strong> Climate is the average weather conditions
              of a place over a long period (usually 30 years or more). It is determined
              by factors such as temperature, precipitation, wind, and humidity.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Climate Classification</h4>
            <p>
              Climate can be classified based on different elements:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Temperature:</strong> Tropical (hot), temperate (moderate),
                polar (cold).
              </li>
              <li>
                <strong>Precipitation:</strong> Wet (high rainfall), dry (low rainfall),
                seasonal (rainfall in certain seasons).
              </li>
              <li>
                <strong>Wind:</strong> Prevailing wind direction and strength.
              </li>
              <li>
                <strong>Humidity:</strong> Amount of moisture in the air.
              </li>
            </ul>

            <GeographyImage
              fileName="climate-classification-diagram.png"
              alt="A 2D diagram showing the Köppen climate classification system with major climate types labelled"
              caption="Climate classification: major climate types of the world."
            />
          </SubtopicCard>

          <SubtopicCard title="World Climatic Regions">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Tropical Climates</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong> Hot all year round, high humidity,
                heavy rainfall (convectional and convergence).
              </li>
              <li>
                <strong>Examples:</strong> Congo Basin, Amazon Basin, parts of
                South-East Asia.
              </li>
              <li>
                <strong>Zimbabwe:</strong> Tropical climate with a distinct wet and dry season.
              </li>
            </ul>

            <GeographyImage
              fileName="tropical-climate-graph.png"
              alt="A climate graph showing high temperatures and rainfall throughout the year for a tropical region"
              caption="Climate graph: Tropical climate region."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Temperate Climates</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong> Moderate temperatures, four distinct
                seasons, moderate rainfall.
              </li>
              <li>
                <strong>Examples:</strong> Western Europe, eastern United States,
                parts of China, South Africa's Cape region.
              </li>
            </ul>

            <GeographyImage
              fileName="temperate-climate-graph.png"
              alt="A climate graph showing moderate temperatures and seasonal rainfall for a temperate region"
              caption="Climate graph: Temperate climate region."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Polar Climates</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong> Very cold all year round, little
                precipitation, snow and ice cover.
              </li>
              <li>
                <strong>Examples:</strong> Antarctica, Greenland, Arctic region.
              </li>
            </ul>

            <GeographyImage
              fileName="polar-climate-graph.png"
              alt="A climate graph showing very cold temperatures and low precipitation for a polar region"
              caption="Climate graph: Polar climate region."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Desert Climates</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Characteristics:</strong> Very low rainfall (less than 250mm
                per year), extreme temperatures (hot days, cold nights).
              </li>
              <li>
                <strong>Examples:</strong> Sahara Desert, Kalahari Desert, Namib Desert.
              </li>
            </ul>

            <GeographyImage
              fileName="desert-climate-graph.png"
              alt="A climate graph showing very low rainfall and high temperatures for a desert region"
              caption="Climate graph: Desert climate region."
            />
          </SubtopicCard>

          <SubtopicCard title="Reading and Interpreting Climatic Graphs">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Climate graphs (climographs) show monthly
                temperature (as a line graph) and precipitation (as bar charts).
              </li>
              <li>
                <strong>How to read:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Look at the temperature line: when is it hottest/coldest?</li>
                  <li>Look at the rainfall bars: when is it wettest/driest?</li>
                  <li>Identify the climate type based on the pattern.</li>
                </ol>
              </li>
              <li>
                <strong>Example (Zimbabwe):</strong> Harare has a wet season from
                November to March (summer) and a dry season from May to October (winter).
                Temperatures are highest in October (before the rains) and coolest in July.
              </li>
            </ul>

            <GeographyImage
              fileName="climate-graph-harare.png"
              alt="A climate graph for Harare, Zimbabwe showing monthly rainfall and temperature"
              caption="Climate graph: Harare, Zimbabwe (tropical with distinct wet and dry seasons)."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Climate Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Tropical:</strong> hot, wet, humid</li>
            <li><strong>Temperate:</strong> moderate, four seasons</li>
            <li><strong>Polar:</strong> cold, dry, ice cover</li>
            <li><strong>Desert:</strong> hot, very dry</li>
            <li><strong>Climate graph:</strong> temperature (line) + rainfall (bars)</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'people-weather',
      title: 'People and the Weather',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="How Weather Forecasts Are Constructed and Their Usefulness">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">How Forecasts Are Constructed</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Data collection:</strong> Weather data is collected from
                weather stations, satellites, radar, and weather balloons (radiosondes).
              </li>
              <li>
                <strong>Analysis:</strong> Meteorologists analyse the data to identify
                pressure systems, fronts, and air masses.
              </li>
              <li>
                <strong>Modelling:</strong> Computer models simulate weather patterns
                and predict future conditions.
              </li>
              <li>
                <strong>Communication:</strong> Forecasts are communicated to the public
                through television, radio, internet, and mobile apps.
              </li>
            </ul>

            <GeographyImage
              fileName="weather-forecast-construction.png"
              alt="A diagram showing the process of weather forecasting: data collection, analysis, modelling, and communication"
              caption="How weather forecasts are constructed: data collection to communication."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Usefulness of Weather Forecasts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Agriculture:</strong> Farmers use forecasts to plan planting,
                harvesting, and irrigation.
              </li>
              <li>
                <strong>Transport:</strong> Aviation and shipping use forecasts to
                avoid dangerous weather.
              </li>
              <li>
                <strong>Disaster management:</strong> Forecasts help predict floods,
                cyclones, and droughts, allowing for early warning and evacuation.
              </li>
              <li>
                <strong>Daily life:</strong> People use forecasts to plan activities,
                clothing, and travel.
              </li>
              <li>
                <strong>Zimbabwe Example:</strong> The Zimbabwe Meteorological Services
                Department (ZMSD) provides daily forecasts for farmers, businesses,
                and the public.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="Human Influence on Weather">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Cloud Seeding</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The process of dispersing substances
                (silver iodide, dry ice) into the air to encourage rainfall.
              </li>
              <li>
                <strong>Effect:</strong> Can increase rainfall in areas with cloud
                cover, but is not always effective.
              </li>
              <li>
                <strong>Example:</strong> Zimbabwe has experimented with cloud seeding
                to increase rainfall in drought-affected areas.
              </li>
            </ul>

            <GeographyImage
              fileName="cloud-seeding-diagram.png"
              alt="A 2D diagram showing cloud seeding: aircraft dispersing silver iodide into clouds to encourage rainfall"
              caption="Cloud seeding: encouraging rainfall through human intervention."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Dam Construction</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Effect:</strong> Dams create large water bodies that can affect
                local climate, increasing humidity and influencing rainfall patterns.
              </li>
              <li>
                <strong>Example:</strong> The Kariba Dam on the Zambezi River has
                created Lake Kariba, which influences local weather and supports
                agriculture and hydroelectric power.
              </li>
            </ul>

            <GeographyImage
              fileName="dam-climate-effect-diagram.png"
              alt="A 2D diagram showing how dam construction affects local climate through increased evaporation and humidity"
              caption="Dam construction: effect on local climate and weather."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">CO₂ Increase and Global Warming</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Effect:</strong> Burning fossil fuels releases CO₂, which traps
                heat in the atmosphere (greenhouse effect). This leads to global warming
                and climate change.
              </li>
              <li>
                <strong>Consequences:</strong> Changes in rainfall patterns, more
                extreme weather events, rising sea levels, and melting ice caps.
              </li>
              <li>
                <strong>Zimbabwe:</strong> Climate change is affecting Zimbabwe through
                more frequent and severe droughts, affecting agriculture and food security.
              </li>
            </ul>

            <GeographyImage
              fileName="co2-greenhouse-effect.png"
              alt="A 2D diagram showing the greenhouse effect: CO₂ trapping heat in the atmosphere"
              caption="CO₂ increase and the greenhouse effect: human impact on climate."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Acid Rain</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Rain with high acidity caused by pollutants
                like sulphur dioxide and nitrogen oxides from burning fossil fuels.
              </li>
              <li>
                <strong>Effect:</strong> Damages forests, lakes, and buildings.
                Affects agriculture and water quality.
              </li>
              <li>
                <strong>Example:</strong> Acid rain has affected parts of Europe,
                North America, and China. In Southern Africa, it is less common but
                occurs near industrial areas and mines.
              </li>
            </ul>

            <GeographyImage
              fileName="acid-rain-diagram.png"
              alt="A 2D diagram showing the formation of acid rain from industrial pollution and its effects on the environment"
              caption="Acid rain: formation from pollutants and environmental impacts."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Deforestation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Effect:</strong> Cutting down trees reduces evapotranspiration,
                leading to lower rainfall and drier conditions. It also increases CO₂
                levels and soil erosion.
              </li>
              <li>
                <strong>Zimbabwe:</strong> Deforestation in Zimbabwe is caused by
                agriculture, firewood collection, and urban expansion. This has reduced
                rainfall in some areas and contributed to land degradation.
              </li>
            </ul>

            <GeographyImage
              fileName="deforestation-climate-effect.png"
              alt="A 2D diagram showing how deforestation affects local rainfall and climate through reduced evapotranspiration"
              caption="Deforestation: impact on local rainfall and climate."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Human Impact Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Cloud seeding:</strong> encourages rainfall</li>
            <li><strong>Dams:</strong> affect local climate</li>
            <li><strong>CO₂ increase:</strong> global warming</li>
            <li><strong>Acid rain:</strong> from industrial pollution</li>
            <li><strong>Deforestation:</strong> reduces rainfall</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'weather-hazards',
      title: 'Weather Hazards',
      content: (
        <div className="space-y-6">
          <SubtopicCard title="Weather Hazards in Africa">
            <p>
              <strong>Definition:</strong> Weather hazards are extreme weather events
              that can cause damage, loss of life, and disruption to communities and economies.
            </p>
          </SubtopicCard>

          <SubtopicCard title="1. Drought (Sahel Case Study)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              A drought is a prolonged period of below-average rainfall, leading to
              water shortages, crop failure, and food insecurity.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Natural causes:</strong> Changes in atmospheric circulation
                (shift in ITCZ), El Niño events, and climate change.
              </li>
              <li>
                <strong>Human causes:</strong> Deforestation, overgrazing, poor land
                management, and population pressure.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Agricultural:</strong> Crop failure, livestock deaths, and food shortages.
              </li>
              <li>
                <strong>Economic:</strong> Loss of income, increased poverty, and
                reliance on food aid.
              </li>
              <li>
                <strong>Social:</strong> Malnutrition, disease, displacement, and conflict.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Sahel Case Study</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> The Sahel region of West Africa (Mali, Niger,
                Chad, Burkina Faso, etc.).
              </li>
              <li>
                <strong>Causes:</strong> Persistent drought, desertification,
                population pressure, and climate change.
              </li>
              <li>
                <strong>Effects:</strong> Severe food insecurity, malnutrition,
                displacement, and conflict over resources.
              </li>
              <li>
                <strong>Management:</strong> Relief aid, sustainable farming,
                reforestation, and water conservation.
              </li>
            </ul>

            <GeographyImage
              fileName="sahel-drought-case-study.png"
              alt="A map of the Sahel region showing drought-affected areas and a photograph of dry, cracked land"
              caption="Sahel drought case study: causes, effects, and management in West Africa."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Zimbabwe Example</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Zimbabwe experiences recurrent droughts, especially in Masvingo,
                Matabeleland South, and parts of the Midlands.
              </li>
              <li>
                <strong>Causes:</strong> El Niño, climate change, and deforestation.
              </li>
              <li>
                <strong>Effects:</strong> Crop failure, livestock losses, food shortages,
                and water scarcity.
              </li>
              <li>
                <strong>Management:</strong> Irrigation schemes, drought-resistant
                crops, and food aid.
              </li>
            </ul>
          </SubtopicCard>

          <SubtopicCard title="2. Tropical Cyclones (Cyclone Domoina Case Study)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              A tropical cyclone is a large storm system with a low-pressure centre,
              strong winds, and heavy rainfall. They form over warm oceans and can
              cause severe damage when they make landfall.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Warm ocean water (above 26.5°C).</li>
              <li>Moist air and converging winds.</li>
              <li>The Coriolis effect (rotation of the Earth).</li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Wind:</strong> Strong winds (over 100 km/h) cause damage to
                buildings, trees, and infrastructure.
              </li>
              <li>
                <strong>Rain:</strong> Heavy rainfall causes flooding and landslides.
              </li>
              <li>
                <strong>Storm surge:</strong> Rising sea levels cause coastal flooding.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Cyclone Domoina (1984) Case Study</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> Affected Madagascar, Mozambique, and
                South Africa (Natal/Transvaal region).
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Heavy rainfall caused severe flooding.</li>
                  <li>Damage to crops, livestock, and infrastructure.</li>
                  <li>Loss of life and displacement of people.</li>
                </ul>
              </li>
              <li>
                <strong>Management:</strong> Early warning systems, evacuation,
                emergency relief, and reconstruction.
              </li>
            </ul>

            <GeographyImage
              fileName="cyclone-domoina-path.png"
              alt="A map showing the path of Cyclone Domoina from the Indian Ocean to Madagascar, Mozambique, and South Africa"
              caption="Cyclone Domoina (1984): path and affected areas."
            />
          </SubtopicCard>

          <SubtopicCard title="3. Floods (Natal/Transvaal 2000 Case Study)">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Definition</h4>
            <p>
              A flood is an overflow of water that submerges land. Floods are often
              caused by heavy rainfall, cyclones, or dam failure.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Causes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Heavy rainfall:</strong> Prolonged or intense rainfall.
              </li>
              <li>
                <strong>Tropical cyclones:</strong> Storm surges and heavy rain.
              </li>
              <li>
                <strong>Dam failure:</strong> Dam collapses release large amounts of water.
              </li>
              <li>
                <strong>Deforestation:</strong> Reduces water absorption, increasing runoff.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Effects</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Loss of life:</strong> Drowning and disease.
              </li>
              <li>
                <strong>Property damage:</strong> Homes, roads, bridges destroyed.
              </li>
              <li>
                <strong>Agricultural damage:</strong> Crops destroyed, livestock lost.
              </li>
              <li>
                <strong>Disease:</strong> Waterborne diseases (cholera, malaria).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Natal/Transvaal Floods (2000) Case Study</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Location:</strong> KwaZulu-Natal and Mpumalanga provinces of
                South Africa.
              </li>
              <li>
                <strong>Causes:</strong> Heavy rainfall from Cyclone Eline and another
                low-pressure system. The region received over 1000mm of rain in a week.
              </li>
              <li>
                <strong>Effects:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>Widespread flooding, especially in low-lying areas.</li>
                  <li>Over 400,000 people displaced.</li>
                  <li>Damage to roads, bridges, and infrastructure.</li>
                  <li>Loss of life and economic damage.</li>
                </ul>
              </li>
              <li>
                <strong>Management:</strong> Emergency relief, evacuation, and flood
                warning systems.
              </li>
            </ul>

            <GeographyImage
              fileName="natal-transvaal-floods-2000.png"
              alt="A photograph of flooding in KwaZulu-Natal during the 2000 floods, showing submerged houses and roads"
              caption="Natal/Transvaal floods (2000): causes, effects, and management."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Zimbabwe Floods</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Zimbabwe experiences flooding, especially in low-lying areas such as
                the Save, Runde, and Zambezi river basins.
              </li>
              <li>
                <strong>Causes:</strong> Cyclones (e.g., Cyclone Idai, 2019), heavy
                summer rainfall, and dam releases.
              </li>
              <li>
                <strong>Effects:</strong> Displacement, crop loss, infrastructure damage,
                and loss of life.
              </li>
              <li>
                <strong>Management:</strong> Early warning systems, evacuation, and
                flood relief programmes.
              </li>
            </ul>
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Weather Hazards</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Drought:</strong> Sahel, Zimbabwe (El Niño)</li>
            <li><strong>Cyclone:</strong> Domoina 1984, Idai 2019</li>
            <li><strong>Floods:</strong> Natal/Transvaal 2000</li>
            <li><strong>Management:</strong> early warnings, relief, adaptation</li>
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
            GEOGRAPHY
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Weather and Climate Studies
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Explore the fundamental concepts of weather and climate: air masses, rainfall types,
            frontal systems, climate classification, human influence on weather, and weather hazards
            affecting Africa and Zimbabwe.
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
                  <strong className="text-white">Air Masses:</strong> Tropical Maritime
                  (warm, moist), Tropical Continental (warm, dry), Polar Maritime (cold, moist)
                  affect Southern Africa's weather.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Rainfall Types:</strong> Orographic
                  (Eastern Highlands), Convectional (afternoon thunderstorms), Convergence
                  (ITCZ), and Frontal (S.W. Cape) rainfall each have distinct mechanisms.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Frontal Systems:</strong> Anticyclones
                  bring dry weather, depressions bring rainfall, and tropical cyclones are
                  destructive storms over warm oceans.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Climate:</strong> Tropical (hot, wet),
                  Temperate (moderate), Polar (cold), Desert (dry). Zimbabwe has a tropical
                  climate with distinct wet and dry seasons.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Human Influence:</strong> Cloud seeding,
                  dams, CO₂ emissions, acid rain, and deforestation all affect weather
                  and climate.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Weather Hazards:</strong> Drought (Sahel,
                  Zimbabwe), tropical cyclones (Domoina, Idai), and floods (Natal/Transvaal
                  2000) have severe effects on African communities.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Weather and Climate topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
          </p>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">
            {isLastChapter ? (
              <>Ready to move on to <span className="text-blue-600">Geomorphology</span>?</>
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
                alert('Proceed to Geomorphology (next topic)');
              }
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 hover:shadow-blue-300 transform hover:-translate-y-0.5"
          >
            {isLastChapter ? 'Begin Geomorphology →' : 'Next Section →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeatherAndClimateStudies;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/geography/
   Use a mix of 2D diagram style and realistic photographs.

   --- AIR MASS IMAGES (2D DIAGRAM STYLE) ---

   1. tropical-maritime-air-mass.png
      A 2D diagram showing the origin of Tropical Maritime air mass over the Indian Ocean.
      Show arrows indicating movement towards Southern Africa.
      Label: "Warm, moist air" and "Indian Ocean".
      Include a map of Southern Africa with the air mass overlay.

   2. tropical-continental-air-mass.png
      A 2D diagram showing the origin of Tropical Continental air mass over the Kalahari Desert.
      Show arrows indicating dry, warm air moving over Southern Africa.
      Label: "Hot, dry air" and "Kalahari Desert".
      Include a map of Southern Africa with the air mass overlay.

   3. polar-maritime-air-mass.png
      A 2D diagram showing the origin of Polar Maritime air mass over the Southern Ocean.
      Show arrows indicating cold, moist air moving towards Southern Africa.
      Label: "Cold, moist air" and "Southern Ocean / Antarctica".
      Include a map showing the path to South Africa's Cape region.

   4. pressure-systems-southern-africa.png
      Two maps of Southern Africa side by side:
      - Summer (January): Low pressure over interior, ITCZ shown.
      - Winter (July): High pressure over interior (Kalahari High).
      Label pressure systems and wind directions.

   --- RAINFALL TYPE IMAGES (2D DIAGRAM STYLE) ---

   5. orographic-rainfall-diagram.png
      A 2D cross-section diagram showing a mountain range.
      Show moist air rising on the windward side, clouds forming, rain falling.
      Show dry air descending on the leeward side (rain shadow).
      Label: "Windward side (rain)", "Leeward side (rain shadow)", "Mountain".

   6. convectional-rainfall-diagram.png
      A 2D diagram showing the sun heating the ground.
      Show warm air rising, cooling, condensing, and forming cumulonimbus clouds.
      Show rain falling in the afternoon.
      Label: "Sun", "Warm air rises", "Cumulonimbus cloud", "Afternoon rain".

   7. itcz-rainfall-diagram.png
      A 2D diagram showing the ITCZ (Inter-Tropical Convergence Zone).
      Show warm, moist air from the Indian Ocean converging with dry air from the interior.
      Show rising air, cloud formation, and rainfall.
      Label: "ITCZ", "Warm moist air", "Convergence".

   8. frontal-rainfall-diagram.png
      A 2D cross-section diagram showing a cold front and a warm front.
      Cold front: cold air pushing under warm air, rapid rising, heavy rain.
      Warm front: warm air rising over cold air, gradual rising, light rain.
      Label: "Cold front", "Warm front", "Heavy rain", "Light rain".

   9. prevailing-winds-southern-africa.png
      A map of Southern Africa showing prevailing wind directions:
      - South-East Trade Winds (from Indian Ocean)
      - North-East Trade Winds (from Atlantic)
      - Westerlies (from Atlantic to Cape)
      Show arrows indicating wind direction. Label each wind type.

   10. rain-shadow-effect-diagram.png
       A 2D diagram showing the rain shadow effect.
       Show moist air rising over mountains, rain on the windward side, and dry conditions on the leeward side.
       Label: "Windward", "Leeward", "Rain shadow", "Moist air", "Dry air".

   --- FRONTAL SYSTEMS IMAGES (2D DIAGRAM STYLE) ---

   11. anticyclone-diagram.png
       A 2D diagram of an anticyclone (high pressure) in the Southern Hemisphere.
       Show descending air, clockwise wind movement.
       Label: "High pressure", "Descending air", "Clear skies".

   12. front-types-diagram.png
       A 2D diagram showing cold front, warm front, and occluded front.
       Show cross-sections and map view for each.
       Label: "Cold front", "Warm front", "Occluded front", and associated weather.

   13. depression-low-pressure-diagram.png
       A 2D diagram of a depression (low pressure) in the Southern Hemisphere.
       Show rising air, anticlockwise wind movement.
       Label: "Low pressure", "Rising air", "Clouds and rain".

   14. tropical-cyclone-structure.png
       A 2D diagram showing the structure of a tropical cyclone.
       Show the eye, eye wall, and spiral rain bands.
       Label: "Eye (calm)", "Eye wall (strongest winds)", "Spiral rain bands".

   15. tropical-cyclone-path-mozambique.png
       A map showing the path of Cyclone Domoina and Cyclone Idai.
       Show origins in the Indian Ocean, movement towards Madagascar, Mozambique, and Southern Africa.
       Label the paths and affected areas.

   --- WEATHER MAP IMAGES (2D DIAGRAM STYLE) ---

   16. summer-synoptic-chart-southern-africa.png
       A synoptic weather chart of Southern Africa in January (summer).
       Show low pressure over the interior, ITCZ, and moist winds from the Indian Ocean.
       Show isobars and pressure systems. Label: "L" for low pressure.

   17. winter-synoptic-chart-southern-africa.png
       A synoptic weather chart of Southern Africa in July (winter).
       Show high pressure (Kalahari High) over the interior.
       Show cold fronts approaching the Cape. Label: "H" for high pressure.

   18. synoptic-chart-reading-guide.png
       A guide showing how to read synoptic charts.
       Label isobars, pressure systems (H/L), fronts (cold/warm), wind direction, and precipitation areas.
       Include a key for weather symbols.

   --- CLIMATE IMAGES (2D DIAGRAM AND GRAPH STYLE) ---

   19. climate-classification-diagram.png
       A 2D diagram showing the Köppen climate classification system.
       Show major climate types: Tropical, Temperate, Polar, Desert, etc.
       Use colour coding for different climate regions.

   20. tropical-climate-graph.png
       A climate graph for a tropical region.
       Show temperature (line graph) and rainfall (bar chart) for each month.
       Temperatures should be consistently high (25-30°C). Rainfall high throughout the year.

   21. temperate-climate-graph.png
       A climate graph for a temperate region.
       Show four distinct seasons with moderate temperatures (0-25°C).
       Show seasonal rainfall (spring/summer peaks).

   22. polar-climate-graph.png
       A climate graph for a polar region.
       Show very cold temperatures (-30°C to 0°C).
       Show low precipitation throughout the year.

   23. desert-climate-graph.png
       A climate graph for a desert region.
       Show high temperatures (30-45°C) and very low rainfall (less than 250mm per year).

   24. climate-graph-harare.png
       A climate graph for Harare, Zimbabwe.
       Show wet season (Nov-Mar) with high rainfall and dry season (May-Oct) with little rain.
       Show temperatures: highest in October (pre-rains), coolest in July.

   --- PEOPLE AND WEATHER IMAGES (2D DIAGRAM AND REALISTIC) ---

   25. weather-forecast-construction.png
       A 2D diagram showing the process of weather forecasting.
       Steps: Data collection (satellites, stations, balloons) → Analysis → Computer modelling → Communication (TV, radio, apps).
       Label each step clearly.

   26. cloud-seeding-diagram.png
       A 2D diagram showing cloud seeding.
       Show an aircraft dispersing silver iodide into clouds.
       Show clouds forming and rain falling.
       Label: "Aircraft", "Silver iodide", "Cloud", "Rain".

   27. dam-climate-effect-diagram.png
       A 2D diagram showing how dam construction affects local climate.
       Show a dam creating a lake, evaporation, and increased humidity.
       Show how this can influence rainfall in the area.
       Label: "Dam", "Lake", "Evaporation", "Increased humidity".

   28. co2-greenhouse-effect.png
       A 2D diagram showing the greenhouse effect.
       Show the sun's energy entering the atmosphere, some being absorbed, and some trapped by CO₂.
       Label: "Sun", "Earth", "CO₂", "Trapped heat", "Global warming".

   29. acid-rain-diagram.png
       A 2D diagram showing the formation of acid rain.
       Show factories releasing SO₂ and NOₓ, which react with water vapour to form acid rain.
       Show acid rain damaging trees, lakes, and buildings.
       Label: "Factories", "SO₂ and NOₓ", "Acid rain", "Damage".

   30. deforestation-climate-effect.png
       A 2D diagram showing how deforestation affects rainfall.
       Show a forest on the left with evapotranspiration and rain.
       Show cleared land on the right with reduced evapotranspiration and less rain.
       Label: "Forest", "Evapotranspiration", "Deforestation", "Reduced rainfall".

   --- WEATHER HAZARD IMAGES (REALISTIC AND MAP STYLE) ---

   31. sahel-drought-case-study.png
       A map of the Sahel region showing drought-affected areas.
       Include a realistic photograph of dry, cracked land and dying crops.
       Show the location of Mali, Niger, Chad, Burkina Faso, etc.

   32. cyclone-domoina-path.png
       A map showing the path of Cyclone Domoina (1984) and Cyclone Idai (2019).
       Show the origins in the Indian Ocean and the paths to Madagascar, Mozambique, South Africa, and Zimbabwe.

   33. natal-transvaal-floods-2000.png
       A realistic photograph of the 2000 floods in KwaZulu-Natal, South Africa.
       Show submerged houses, flooded roads, and people being rescued.
       Show the extent of the flooding.

   ============================================================ */