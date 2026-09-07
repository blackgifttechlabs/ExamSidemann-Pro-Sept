import React, { useState, useRef } from 'react';

// ---------------------------------------------------------------------------
// Image helper – defined at module scope so React sees a stable component
// type and never unmounts/remounts it (which would reset useState and cause
// onError to fire the missing-image fallback on every render).
// ---------------------------------------------------------------------------
const GeographyImage: React.FC<{
  fileName: string;
  alt: string;
  caption: string;
}> = ({ fileName, alt, caption }) => {
  const [isMissing, setIsMissing] = useState(false);
  const [imgSrc, setImgSrc] = useState(`/images/geography/${fileName}`);

  if (isMissing) return null;
  return (
    <figure className="my-4 overflow-hidden rounded-[9px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <img
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="w-full max-h-[550px] object-contain bg-slate-50 dark:bg-slate-950"
        onError={() => {
          if (imgSrc.startsWith('/images/geography/')) {
            setImgSrc(`/images/courses/o-level/geography/${fileName}`);
          } else {
            setIsMissing(true);
          }
        }}
      />
      <figcaption className="border-t border-slate-100 dark:border-slate-800 px-4 py-3 text-sm font-medium leading-6 text-slate-600 dark:text-slate-300">
        {caption}
      </figcaption>
    </figure>
  );
};

// ---------------------------------------------------------------------------
// Subtopic Card – also at module scope for the same stability reason.
// ---------------------------------------------------------------------------
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

/**
 * Topic: Basic Techniques and Skills – Geography
 * Each subtopic is in its own card with visible separation,
 * larger headings, and 9px border-radius.
 */
export const BasicTechniquesAndSkills: React.FC = () => {
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

  const sections: TopicSection[] = [
    {
      id: 'topocadastral-maps',
      title: 'Topocadastral (1:50 000 / 1:25 000) & Atlas Maps',
      content: (
        <div className="space-y-6">
          {/* Subtopic 1: Definition */}
          <SubtopicCard title="Definition of Topocadastral Maps">
            <p>
              <strong>Topocadastral maps</strong> are large-scale maps that show both natural
              and man-made features of the landscape. They are used for planning, land
              management, and navigation. The term "topo" refers to the shape of the land
              (relief), and "cadastral" refers to land ownership boundaries.
            </p>
            <p>
              In Zimbabwe, the most commonly used topocadastral maps are the <strong>1:50 000</strong>
              and <strong>1:25 000</strong> scale maps produced by the Zimbabwean government.
              These maps are used by surveyors, planners, farmers, and students.
            </p>
            <GeographyImage
              fileName="topocadastral-map-example.png"
              alt="A Zimbabwean 1:50 000 topocadastral map showing relief, drainage, settlements, and transport routes"
              caption="Example of a 1:50 000 topocadastral map of Zimbabwe showing contour lines, rivers, roads, and settlements."
            />
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Key Terms</h4>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Topography:</strong> The shape and features of the land surface.</li>
              <li><strong>Cadastral:</strong> Relating to land ownership and boundaries.</li>
              <li><strong>Contour line:</strong> A line joining points of equal height above sea level.</li>
              <li><strong>Grid reference:</strong> A system for locating points on a map.</li>
              <li><strong>Scale:</strong> The relationship between distance on a map and distance on the ground.</li>
            </ul>
          </SubtopicCard>

          {/* Subtopic 2: Reading Symbols and Keys */}
          <SubtopicCard title="Reading Symbols and Keys">
            <p>
              <strong>Definition:</strong> Symbols are pictures or signs used on maps to
              represent features in the real world. The key (or legend) explains what each
              symbol means.
            </p>
            <p>
              <strong>How to read:</strong> Always look at the key first before reading a map.
              The key tells you what each colour, line, or symbol represents. For example:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Blue:</strong> Water features (rivers, lakes, dams).</li>
              <li><strong>Green:</strong> Vegetation (forests, parks, cultivated land).</li>
              <li><strong>Black:</strong> Man-made features (buildings, roads, railways).</li>
              <li><strong>Brown:</strong> Contour lines (showing relief).</li>
              <li><strong>Red:</strong> Main roads and built-up areas.</li>
            </ul>
            <p>
              <strong>Example (Zimbabwe):</strong> On a 1:50 000 map of Harare, the key
              shows that a solid black line is a major road, while a dashed black line is
              a footpath. A blue line with dashes represents a seasonal river.
            </p>
            <GeographyImage
              fileName="map-symbols-key.png"
              alt="A detailed map key showing common symbols used on topocadastral maps"
              caption="Common symbols and their meanings on a topocadastral map."
            />
          </SubtopicCard>

          {/* Subtopic 3: Grid References & Latitude/Longitude */}
          <SubtopicCard title="Grid References and Latitude/Longitude">
            <p>
              <strong>Definition:</strong> Grid references are a way of locating points on
              a map using numbered grid lines.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">4-Figure Grid References</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                A 4-figure grid reference gives the location of a grid square.
                It is made up of the easting (vertical line) followed by the northing (horizontal line).
              </li>
              <li>
                <strong>Example:</strong> 2345 means the square at easting 23 and northing 45.
                This gives a location to the nearest 1 km².
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">6-Figure Grid References</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                A 6-figure grid reference gives the location of a point within a grid square.
                It divides the square into tenths.
              </li>
              <li>
                <strong>Example:</strong> 234456 means easting 234 and northing 456.
                This gives a location to the nearest 100 metres.
              </li>
              <li>
                <strong>How to find:</strong> First find the grid square, then imagine the
                square divided into 10 equal parts. Estimate how many tenths across and up
                the point is.
              </li>
            </ul>

            <GeographyImage
              fileName="grid-references-explained.png"
              alt="Diagram showing how 4-figure and 6-figure grid references are determined on a map grid"
              caption="How to read 4-figure and 6-figure grid references on a topocadastral map."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Latitude and Longitude</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Latitude and longitude are a global system of
                coordinates that locate any place on Earth.
              </li>
              <li>
                <strong>Latitude:</strong> Lines run east-west (parallels). They measure
                distance north or south of the Equator (0°). The equator is at 0°,
                the poles are at 90°N and 90°S.
              </li>
              <li>
                <strong>Longitude:</strong> Lines run north-south (meridians). They measure
                distance east or west of the Prime Meridian (0°), which passes through
                Greenwich, England.
              </li>
              <li>
                <strong>Zimbabwe coordinates:</strong> Zimbabwe is located approximately
                between 15°S and 22°S latitude, and 25°E and 33°E longitude.
                Harare is at approximately 17°S, 31°E.
              </li>
            </ul>
          </SubtopicCard>

          {/* Subtopic 4: Scale & Map Generalisation */}
          <SubtopicCard title="Scale and Map Generalisation">
            <p>
              <strong>Definition:</strong> Scale is the relationship between distance on a
              map and distance on the ground. It shows how much the real world has been
              reduced to fit on the map.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Types of Scale</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Statement scale:</strong> Written in words, e.g., "1 cm represents 1 km".
              </li>
              <li>
                <strong>Representative Fraction (RF):</strong> A ratio, e.g., 1:50 000.
                This means that 1 unit on the map equals 50 000 units on the ground.
              </li>
              <li>
                <strong>Linear scale (bar scale):</strong> A line divided into sections
                showing distances on the ground. It is useful because it remains accurate
                even if the map is enlarged or reduced.
              </li>
            </ul>

            <GeographyImage
              fileName="map-scale-types.png"
              alt="Three types of map scale shown side by side: statement scale, representative fraction, and linear/bar scale"
              caption="The three types of map scale: Statement scale, Representative Fraction (RF), and Linear (bar) scale."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Map Generalisation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Generalisation is the process of simplifying
                information on a map. Not everything can be shown, so map makers must
                decide what is most important.
              </li>
              <li>
                On small-scale maps (e.g., 1:1 000 000), only major features are shown.
                On large-scale maps (e.g., 1:25 000), more detail is included.
              </li>
            </ul>
          </SubtopicCard>

          {/* Subtopic 5: Measuring Distance and Gradient */}
          <SubtopicCard title="Measuring Distance and Gradient">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Measuring Distance</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Straight-line distance:</strong> Use a ruler to measure the distance
                on the map. Multiply by the scale to get the ground distance.
              </li>
              <li>
                <strong>Curved distance (e.g., a river or road):</strong> Use a piece of
                string or a paper strip. Trace the curve, then measure the string against
                the linear scale.
              </li>
              <li>
                <strong>Example:</strong> On a 1:50 000 map, 1 cm = 0.5 km. If the straight-line
                distance between two points is 8 cm, the ground distance is 8 × 0.5 = 4 km.
              </li>
            </ul>

            <GeographyImage
              fileName="measuring-distance-map.png"
              alt="A map showing how to measure straight-line and curved distances using a ruler and string method"
              caption="Measuring straight-line and curved distances on a topocadastral map."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Measuring Gradient (Slope)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Gradient is the steepness of a slope. It is
                the ratio of vertical height (rise) to horizontal distance (run).
              </li>
              <li>
                <strong>Formula:</strong> Gradient = Vertical Interval ÷ Horizontal Equivalent
              </li>
              <li>
                <strong>How to calculate:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Find the vertical interval (difference in height between two points) using contour lines.</li>
                  <li>Measure the horizontal distance on the map and convert to ground distance using the scale.</li>
                  <li>Divide the vertical interval by the horizontal distance.</li>
                </ol>
              </li>
              <li className="mt-2">
                <strong>Example:</strong> If the vertical interval is 100 metres and the
                horizontal distance is 2 km (2000 m), the gradient is 100:2000 = 1:20.
                This means the slope rises 1 metre for every 20 metres horizontally.
              </li>
            </ul>

            <GeographyImage
              fileName="gradient-calculation.png"
              alt="Diagram showing how to calculate gradient using contour lines and horizontal distance"
              caption="Calculating gradient using vertical interval and horizontal distance."
            />
          </SubtopicCard>

          {/* Subtopic 6: Area Calculation */}
          <SubtopicCard title="Area Calculation (Grid Square Method)">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> The grid square method is a way to estimate
                the area of a feature on a map.
              </li>
              <li>
                <strong>How to do it:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Count the number of full grid squares within the feature.</li>
                  <li>Count the number of partial squares and estimate their total (e.g., half squares = 0.5).</li>
                  <li>Add the full squares and partial squares to get the total number of squares.</li>
                  <li>Multiply the number of squares by the area of one grid square (which is determined by the map scale).</li>
                </ol>
              </li>
              <li className="mt-2">
                <strong>Example:</strong> On a 1:50 000 map, one grid square is 1 km × 1 km = 1 km².
                If a lake covers 4 full squares and 6 half squares, the area is (4 + 3) = 7 km².
              </li>
            </ul>

            <GeographyImage
              fileName="grid-square-area-calculation.png"
              alt="A map grid showing how to calculate area using the grid square method with full and partial squares highlighted"
              caption="Calculating area using the grid square method on a topocadastral map."
            />
          </SubtopicCard>

          {/* Subtopic 7: Compass Directions & Bearings */}
          <SubtopicCard title="Compass Directions, Bearings, and Backbearings">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Compass Directions</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                The four main directions are <strong>North</strong>, <strong>South</strong>,
                <strong>East</strong>, and <strong>West</strong>.
              </li>
              <li>
                These are divided into eight (N, NE, E, SE, S, SW, W, NW) and sixteen directions.
              </li>
            </ul>

            <GeographyImage
              fileName="compass-directions.png"
              alt="A compass rose showing the 8 main directions and 16-point compass directions"
              caption="Compass directions showing the 8-point and 16-point compass rose."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Bearings</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A bearing is a direction measured in degrees
                clockwise from North (0°).
              </li>
              <li>
                <strong>How to measure:</strong> Place a protractor over the point, align it
                with North, and read the angle clockwise to the target.
              </li>
              <li>
                <strong>Example:</strong> If a church is directly to the east, its bearing is 090°.
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Backbearings</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A backbearing is the opposite direction to a bearing.
                It is the bearing from the target back to your starting point.
              </li>
              <li>
                <strong>How to calculate:</strong> If the bearing is less than 180°, add 180°.
                If the bearing is more than 180°, subtract 180°.
              </li>
              <li>
                <strong>Example:</strong> If the bearing from point A to point B is 045°,
                the backbearing from B to A is 045° + 180° = 225°.
              </li>
            </ul>

            <GeographyImage
              fileName="bearings-backbearings.png"
              alt="Diagram showing how to measure a bearing and calculate the backbearing on a map"
              caption="Measuring bearings and calculating backbearings on a topocadastral map."
            />
          </SubtopicCard>

          {/* Subtopic 8: Describing Routes */}
          <SubtopicCard title="Describing Routes">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Describing a route means explaining how to get
                from one place to another using map features as landmarks.
              </li>
              <li>
                <strong>How to describe:</strong> Use grid references, compass directions,
                distances, and landmarks (e.g., "Travel north-west along the main road for
                3 km, then turn east at the church and continue to the river crossing.").
              </li>
              <li>
                <strong>Example (Zimbabwe):</strong> "Starting from the railway station at
                grid reference 234567, travel south-east along the A4 road for 2 km.
                At the junction with the B1 road, turn north-east and continue for 1.5 km
                until you reach the bridge over the Mazowe River."
              </li>
            </ul>

            <GeographyImage
              fileName="route-description-example.png"
              alt="A map showing a highlighted route with grid references and compass directions for describing the journey"
              caption="Describing a route using grid references, compass directions, and landmarks."
            />
          </SubtopicCard>

          {/* Subtopic 9: Contour Patterns & Relief */}
          <SubtopicCard title="Interpreting Contour Patterns and Relief">
            <p>
              <strong>Definition:</strong> Contour lines are lines on a map that join points
              of equal height above sea level. They show the shape of the land (relief).
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Contour Patterns</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Close contours:</strong> Steep slope (contours are very close together).
              </li>
              <li>
                <strong>Wide contours:</strong> Gentle slope (contours are far apart).
              </li>
              <li>
                <strong>V-shaped contours pointing uphill:</strong> Valley.
              </li>
              <li>
                <strong>V-shaped contours pointing downhill:</strong> Ridge or spur.
              </li>
              <li>
                <strong>Circular contours:</strong> Hill or conical hill.
              </li>
              <li>
                <strong>Concentric contours with higher values in the centre:</strong> Hilltop.
              </li>
              <li>
                <strong>Concentric contours with lower values in the centre:</strong> Depression.
              </li>
            </ul>

            <GeographyImage
              fileName="contour-patterns-landforms.png"
              alt="A diagram showing different contour patterns and the landforms they represent: hill, valley, ridge, plateau, and depression"
              caption="Contour patterns and the landforms they represent on a topocadastral map."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Describing Slopes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Gentle/Undulating:</strong> Contours are far apart.
              </li>
              <li>
                <strong>Steep:</strong> Contours are close together.
              </li>
              <li>
                <strong>Convex slope:</strong> Contours are widely spaced at the bottom
                and closely spaced at the top (the slope gets steeper upwards).
              </li>
              <li>
                <strong>Concave slope:</strong> Contours are closely spaced at the bottom
                and widely spaced at the top (the slope gets gentler upwards).
              </li>
              <li>
                <strong>Terraced slope:</strong> Contours are evenly spaced but with
                flat areas (often showing terracing for farming).
              </li>
            </ul>

            <GeographyImage
              fileName="slope-types-concave-convex.png"
              alt="A diagram showing concave, convex, steep, and gentle slopes with their corresponding contour patterns"
              caption="Different slope types and their contour patterns: concave, convex, steep, and gentle slopes."
            />
          </SubtopicCard>

          {/* Subtopic 10: Recognising Landforms */}
          <SubtopicCard title="Recognising Landforms">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Ridge:</strong> A long narrow hilltop. Contours form elongated
                V-shapes pointing downhill.
              </li>
              <li>
                <strong>Plateau:</strong> A flat area of high land. Contours are widely
                spaced at the top with steep sides.
              </li>
              <li>
                <strong>Conical hill:</strong> A rounded hill that rises to a point.
                Contours form concentric rings.
              </li>
              <li>
                <strong>Waterfall:</strong> Where a river drops vertically. Contours are
                very close together where the river crosses a steep slope.
              </li>
              <li>
                <strong>Gorge:</strong> A deep, narrow valley with steep sides.
                Contours are very close together and form a V-shape.
              </li>
              <li>
                <strong>Valley:</strong> A low area between hills. Contours form V-shapes
                pointing uphill, with the river in the bottom.
              </li>
              <li>
                <strong>Meander:</strong> A bend in a river. Contours show the river
                curving across the valley floor.
              </li>
              <li>
                <strong>Floodplain:</strong> A flat area beside a river. Contours are
                widely spaced and follow the river valley.
              </li>
            </ul>

            <GeographyImage
              fileName="landforms-contour-recognition.png"
              alt="A diagram showing various landforms with their corresponding contour patterns: ridge, plateau, conical hill, valley, gorge, and meander"
              caption="Recognising landforms from contour patterns on a topocadastral map."
            />
          </SubtopicCard>

          {/* Subtopic 11: Land Use & Settlement */}
          <SubtopicCard title="Inferring Land Use and Settlement Patterns">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Land use:</strong> Look at the symbols and colours on the map.
                Green areas may be forest or farmland. Built-up areas are shown in red or black.
              </li>
              <li>
                <strong>Settlement patterns:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Dispersed:</strong> Isolated buildings spread across the landscape
                    (often in rural areas).
                  </li>
                  <li>
                    <strong>Linear:</strong> Buildings arranged in a line (often along roads
                    or rivers).
                  </li>
                  <li>
                    <strong>Nucleated:</strong> Buildings grouped together in a central area
                    (often in villages or towns).
                  </li>
                </ul>
              </li>
              <li className="mt-2">
                <strong>Example (Zimbabwe):</strong> On a map of Chinhoyi, a nucleated
                settlement pattern is seen in the town centre. Linear patterns are seen
                along the main roads. Dispersed patterns are seen in the surrounding rural areas.
              </li>
            </ul>

            <GeographyImage
              fileName="settlement-patterns-maps.png"
              alt="Three maps showing dispersed, linear, and nucleated settlement patterns with typical land use features"
              caption="Dispersed, linear, and nucleated settlement patterns on a topocadastral map."
            />
          </SubtopicCard>

          {/* Subtopic 12: Drainage Patterns */}
          <SubtopicCard title="Drainage Patterns and Watersheds">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Drainage pattern:</strong> The arrangement of rivers and streams in an area.
              </li>
              <li>
                <strong>Dendritic:</strong> Tree‑like pattern. The most common pattern,
                found where the underlying rock is uniform.
              </li>
              <li>
                <strong>Rectangular:</strong> Rivers flow in right‑angle bends. Found where
                the underlying rock has joints or faults.
              </li>
              <li>
                <strong>Radial:</strong> Rivers flow outwards from a central point, such as
                a hill or mountain.
              </li>
              <li>
                <strong>Trellised:</strong> Rivers flow parallel to each other and then join
                at right angles. Found where there are alternating bands of hard and soft rock.
              </li>
              <li>
                <strong>Watershed:</strong> The boundary between two drainage basins.
                It is the ridge of high land that separates one river system from another.
              </li>
              <li className="mt-2">
                <strong>Example (Zimbabwe):</strong> The Eastern Highlands act as a watershed,
                with rivers flowing east to the Indian Ocean and west to the Zambezi River.
              </li>
            </ul>

            <GeographyImage
              fileName="drainage-patterns-diagram.png"
              alt="A diagram showing the four main drainage patterns: dendritic, rectangular, radial, and trellised"
              caption="The four main drainage patterns: dendritic, rectangular, radial, and trellised."
            />
          </SubtopicCard>

          {/* Subtopic 13: Topological Diagrams */}
          <SubtopicCard title="Converting a Route Network into a Topological Diagram">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A topological diagram is a simplified map that
                shows the connections between places, not the exact distances or directions.
              </li>
              <li>
                <strong>How to convert:</strong> Identify the main routes (roads, rivers, paths).
                Draw a simplified diagram showing only the connections between key points
                (towns, intersections, landmarks).
              </li>
              <li>
                <strong>Example:</strong> A topological diagram of a bus route might show
                the stops in order, without worrying about the exact distances between them.
                This is similar to a London Underground map.
              </li>
            </ul>

            <GeographyImage
              fileName="topological-diagram.png"
              alt="A map and its corresponding topological diagram showing simplified connections between key points"
              caption="Converting a route network into a topological diagram."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-blue-100 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Key Terms</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Topocadastral:</strong> maps showing relief and land ownership</li>
            <li><strong>Scale:</strong> map distance to ground distance</li>
            <li><strong>Grid reference:</strong> location using grid lines</li>
            <li><strong>Contour:</strong> line joining points of equal height</li>
            <li><strong>Relief:</strong> shape of the land</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'photographs',
      title: 'Photographs',
      content: (
        <div className="space-y-6">
          {/* Subtopic 1: Definition & Types */}
          <SubtopicCard title="Definition and Types of Photographs">
            <p>
              <strong>Photographs</strong> are pictures taken from the ground, from the air,
              or from satellites. They are used in geography to show what the landscape
              really looks like. They help geographers identify landforms, vegetation,
              and land use.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Oblique Photographs</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Taken from an angle, usually from the air or
                from a high point. They show a wide view of the landscape.
              </li>
              <li>
                <strong>Uses:</strong> Good for showing the relationship between different
                features (e.g., a town and its surroundings).
              </li>
              <li>
                <strong>Advantages:</strong> Easy to understand because they look like what
                we see with our eyes. They show depth and perspective.
              </li>
              <li>
                <strong>Disadvantages:</strong> They don't show the true shape of the land
                (distortion due to perspective).
              </li>
            </ul>

            <GeographyImage
              fileName="oblique-photograph-example.png"
              alt="An oblique aerial photograph of a Zimbabwean landscape showing hills, valleys, and settlement patterns"
              caption="Oblique photograph of a Zimbabwean landscape showing depth and perspective."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Aerial Photographs</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Taken from directly above (vertical). They show
                a bird's‑eye view of the landscape.
              </li>
              <li>
                <strong>Uses:</strong> Used for mapping, planning, and environmental monitoring.
              </li>
              <li>
                <strong>Advantages:</strong> They show the true shape of the land and features.
                They can be used to create maps.
              </li>
              <li>
                <strong>Disadvantages:</strong> They can be difficult to interpret because
                they are not what we see with our eyes. Features can look flat and small.
              </li>
            </ul>

            <GeographyImage
              fileName="aerial-photograph-example.png"
              alt="A vertical aerial photograph of a Zimbabwean urban area showing roads, buildings, and land use patterns"
              caption="Vertical aerial photograph of an urban area showing the true shape of features from above."
            />
          </SubtopicCard>

          {/* Subtopic 2: Identifying Landforms */}
          <SubtopicCard title="Identifying Landforms from Photographs">
            <p>
              <strong>How to identify:</strong> Look for shapes, patterns, and colours in the photograph.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>Mountains and hills:</strong> Look for large areas of high land with
                sloping sides. On a vertical photo, they appear as darker areas with shadows.
              </li>
              <li>
                <strong>Valleys:</strong> Look for V‑shaped or U‑shaped depressions between
                hills. On a vertical photo, they appear as lighter areas with darker sides.
              </li>
              <li>
                <strong>Plateaus:</strong> Look for flat areas of high land with steep sides.
              </li>
              <li>
                <strong>Rivers and lakes:</strong> Look for dark, winding lines (rivers) or
                dark, rounded areas (lakes).
              </li>
              <li>
                <strong>Coastal features:</strong> Look for bays, headlands, cliffs, and beaches.
              </li>
              <li className="mt-2">
                <strong>Example (Zimbabwe):</strong> An oblique photograph of the Eastern
                Highlands shows the steep slopes of the mountains, the green vegetation,
                and the valleys with rivers flowing through them.
              </li>
            </ul>

            <GeographyImage
              fileName="landforms-photograph-identification.png"
              alt="A photograph with labels showing how to identify mountains, valleys, rivers, and plateaus"
              caption="Identifying landforms from an oblique photograph."
            />
          </SubtopicCard>

          {/* Subtopic 3: Vegetation & Land Use */}
          <SubtopicCard title="Identifying Vegetation and Land Use from Photographs">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Vegetation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Forests:</strong> Appear as large areas of dark green (on oblique
                photos) or dark grey with a rough texture (on vertical photos).
              </li>
              <li>
                <strong>Savannah/grassland:</strong> Appears as lighter green or brown,
                with scattered trees (small dark patches on vertical photos).
              </li>
              <li>
                <strong>Cultivated land:</strong> Appears in regular patterns (rectangular
                or circular fields). Colours depend on the crop and season.
              </li>
              <li>
                <strong>Woodland:</strong> Appears as medium green with a rougher texture
                than grassland.
              </li>
            </ul>

            <GeographyImage
              fileName="vegetation-photograph-types.png"
              alt="A photograph showing different vegetation types: forest, savannah, cultivated land, and woodland"
              caption="Identifying different vegetation types from photographs."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Land Use</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Urban areas:</strong> Appear as large areas of grey/brown with
                buildings (small rectangles), roads (straight lines), and cars (small dots).
              </li>
              <li>
                <strong>Rural areas:</strong> Appear as large areas of green/brown with
                scattered buildings and fields.
              </li>
              <li>
                <strong>Industrial areas:</strong> Appear as large buildings with tall
                chimneys. There may be smoke or steam visible.
              </li>
              <li>
                <strong>Agricultural areas:</strong> Appear as regular patterns of fields
                with different colours (depending on the crop).
              </li>
              <li>
                <strong>Mining areas:</strong> Appear as large, bare areas with spoil heaps
                and possibly tailings dams.
              </li>
            </ul>

            <GeographyImage
              fileName="landuse-photograph-examples.png"
              alt="A photograph showing different land use types: urban, rural, industrial, and agricultural areas"
              caption="Identifying different land use types from photographs."
            />
          </SubtopicCard>

          {/* Subtopic 4: Explaining Processes */}
          <SubtopicCard title="Explaining Processes from Photographs">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Erosion:</strong> Look for features like river valleys, gullies,
                and cliffs. These show that water or wind is wearing away the land.
              </li>
              <li>
                <strong>Deposition:</strong> Look for features like floodplains, deltas,
                and beaches. These show that material is being dropped by rivers or waves.
              </li>
              <li>
                <strong>Urban growth:</strong> Look for the expansion of built-up areas
                into surrounding farmland. This shows that a city or town is growing.
              </li>
              <li>
                <strong>Deforestation:</strong> Look for areas where trees are missing or
                where there is a distinct boundary between forest and cleared land.
              </li>
            </ul>

            <GeographyImage
              fileName="geographic-processes-photographs.png"
              alt="A photograph showing evidence of geographic processes: erosion, deposition, urban growth, and deforestation"
              caption="Identifying geographic processes from photographs: erosion, deposition, urban growth, and deforestation."
            />
          </SubtopicCard>

          {/* Subtopic 5: Human-Environment Link */}
          <SubtopicCard title="Human-Environment Link">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Causes:</strong> Human activities like farming, mining, and urban
                development change the landscape. For example, deforestation for agriculture
                can lead to soil erosion.
              </li>
              <li>
                <strong>Effects:</strong> Changes can be positive (e.g., improved farming)
                or negative (e.g., pollution, loss of habitat).
              </li>
              <li>
                <strong>Management:</strong> Photographs can be used to monitor changes
                over time and to plan for sustainable development.
              </li>
              <li className="mt-2">
                <strong>Example (Zimbabwe):</strong> Aerial photographs of Harare over time
                show the expansion of the city and the loss of farmland and natural vegetation
                on the outskirts. This helps planners manage urban growth.
              </li>
            </ul>

            <GeographyImage
              fileName="human-environment-photographs.png"
              alt="A split photograph showing environmental change over time: deforestation, urban expansion, and conservation efforts"
              caption="Human-environment link: causes, effects, and management of environmental change."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Photograph Snapshot</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Oblique:</strong> taken from angle, shows perspective</li>
            <li><strong>Aerial:</strong> taken from above, shows true shape</li>
            <li><strong>Landforms:</strong> mountains, valleys, plateaus</li>
            <li><strong>Land use:</strong> urban, rural, industrial, agricultural</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'diagrams-models',
      title: 'Diagrams, Sketch Maps, Data, Graphs & Models',
      content: (
        <div className="space-y-6">
          {/* Subtopic 1: Definition & Bar Charts */}
          <SubtopicCard title="Definition and Constructing Bar Charts">
            <p>
              <strong>Diagrams, sketch maps, graphs, and models</strong> are ways of presenting
              geographical information visually. They help to simplify and communicate
              complex information in a clear and understandable way.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Constructing Bar Charts</h4>
            <p>
              <strong>Definition:</strong> Bar charts use rectangular bars to show and compare data.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>
                <strong>How to construct:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Draw the x‑axis (horizontal) and y‑axis (vertical).</li>
                  <li>Label the x‑axis with the categories (e.g., years, countries).</li>
                  <li>Label the y‑axis with the values (e.g., population, rainfall in mm).</li>
                  <li>Choose a suitable scale for the y‑axis.</li>
                  <li>Draw bars of equal width for each category. The height of the bar represents the value.</li>
                  <li>Add a title and labels.</li>
                </ol>
              </li>
              <li className="mt-2">
                <strong>Example:</strong> A bar chart showing the population of Zimbabwe's
                provinces (Harare, Mashonaland East, Manicaland, etc.).
              </li>
            </ul>

            <GeographyImage
              fileName="bar-chart-example.png"
              alt="A bar chart showing the population of Zimbabwe's provinces with clear labels and title"
              caption="Bar chart showing the population of Zimbabwe's provinces."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Constructing Line Graphs</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Line graphs show how data changes over time.
                Points are plotted and connected by a line.
              </li>
              <li>
                <strong>How to construct:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Draw the x‑axis (time) and y‑axis (values).</li>
                  <li>Label the axes clearly.</li>
                  <li>Plot the points for each time period.</li>
                  <li>Join the points with a straight line.</li>
                  <li>Add a title and labels.</li>
                </ol>
              </li>
              <li className="mt-2">
                <strong>Example:</strong> A line graph showing the average rainfall in
                Harare over the twelve months of the year.
              </li>
            </ul>

            <GeographyImage
              fileName="line-graph-example.png"
              alt="A line graph showing monthly rainfall in Harare with clear labels and title"
              caption="Line graph showing average monthly rainfall in Harare, Zimbabwe."
            />
          </SubtopicCard>

          {/* Subtopic 2: Sketch Maps & Diagrams */}
          <SubtopicCard title="Sketch Maps and Diagrams">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Constructing Sketch Maps</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A sketch map is a simple, hand‑drawn map that
                shows the main features of an area. It is not drawn to scale but is very useful
                for showing the layout and relationships between features.
              </li>
              <li>
                <strong>How to construct:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Decide on the area to be shown.</li>
                  <li>Draw the main features (roads, rivers, buildings).</li>
                  <li>Use simple symbols and a key.</li>
                  <li>Add a north arrow.</li>
                  <li>Add a title.</li>
                </ol>
              </li>
              <li className="mt-2">
                <strong>Example:</strong> A sketch map of your school, showing the buildings,
                sports fields, and main road.
              </li>
            </ul>

            <GeographyImage
              fileName="sketch-map-example.png"
              alt="A hand-drawn sketch map of a school showing buildings, sports fields, and the main road with a north arrow and key"
              caption="Example of a sketch map showing a school with key features labelled."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Constructing Diagrams and Models</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Diagrams and models are visual representations
                of geographic concepts or processes. They can be simple sketches or detailed
                three‑dimensional models.
              </li>
              <li>
                <strong>Examples:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Cross‑section diagrams:</strong> Show the side view of a feature
                    (e.g., a river valley, a volcano).
                  </li>
                  <li>
                    <strong>Block diagrams:</strong> Show a three‑dimensional view of a
                    landscape (e.g., showing relief and landforms).
                  </li>
                  <li>
                    <strong>Flow charts:</strong> Show the steps in a process (e.g., the
                    water cycle, manufacturing processes).
                  </li>
                  <li>
                    <strong>Models:</strong> Physical models (e.g., a model of a drainage
                    basin) or computer models (e.g., climate models).
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="cross-section-diagram-example.png"
              alt="A cross-section diagram of a river valley showing the river channel, floodplain, and valley sides"
              caption="Cross-section diagram of a river valley showing the river channel, floodplain, and valley sides."
            />
          </SubtopicCard>

          {/* Subtopic 3: Interpreting Maps & Charts */}
          <SubtopicCard title="Interpreting Topocadastral Maps and Synoptic Charts">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Interpreting Topocadastral Maps</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Reading and understanding the information on
                a topocadastral map. This includes identifying features, measuring distances,
                and describing the landscape.
              </li>
              <li>
                <strong>What to look for:</strong> Relief (contour lines), drainage (rivers),
                vegetation (green areas), settlement (built-up areas), and land use (farming, mining, etc.).
              </li>
            </ul>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Interpreting Synoptic Charts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Synoptic charts (weather maps) show weather
                conditions over a large area at a specific time.
              </li>
              <li>
                <strong>What to read:</strong> Isobars (lines joining points of equal
                pressure), pressure systems (highs and lows), fronts (cold, warm, occluded),
                and wind direction.
              </li>
              <li>
                <strong>Example:</strong> Reading a weather map for southern Africa shows
                the movement of a cold front from the Atlantic Ocean.
              </li>
            </ul>

            <GeographyImage
              fileName="synoptic-chart-example.png"
              alt="A synoptic weather chart showing isobars, pressure systems, fronts, and wind direction over Southern Africa"
              caption="Synoptic weather chart showing isobars, pressure systems, and fronts over Southern Africa."
            />
          </SubtopicCard>

          {/* Subtopic 4: Thematic Maps */}
          <SubtopicCard title="Thematic Maps: Proportional Symbols, Flow-Line, Pie, Dot, Shading, and Isoline">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Proportional Symbols</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Symbols (circles, squares) that are drawn in
                different sizes to represent the quantity of something.
              </li>
              <li>
                <strong>Example:</strong> A map showing the population of Zimbabwe's cities
                uses circles of different sizes. Harare has the largest circle.
              </li>
            </ul>

            <GeographyImage
              fileName="proportional-symbol-map.png"
              alt="A map of Zimbabwe showing cities with proportional circles representing population size"
              caption="Proportional symbol map showing population of Zimbabwe's cities."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Flow-Line Diagrams</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Diagrams that show the movement of people,
                goods, or information. The thickness of the line represents the volume.
              </li>
              <li>
                <strong>Example:</strong> A flow‑line diagram showing trade between Zimbabwe
                and its neighbours. A thicker line to South Africa shows more trade.
              </li>
            </ul>

            <GeographyImage
              fileName="flow-line-diagram-example.png"
              alt="A flow-line diagram showing trade routes between Zimbabwe and neighbouring countries with line thickness representing trade volume"
              caption="Flow-line diagram showing trade volumes between Zimbabwe and its neighbours."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Pie Charts</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A circular chart divided into sectors, each
                representing a proportion of the whole.
              </li>
              <li>
                <strong>How to construct:</strong> Calculate the angle for each sector
                (percentage × 3.6). Draw the sectors.
              </li>
              <li>
                <strong>Example:</strong> A pie chart showing Zimbabwe's main exports
                (gold, tobacco, platinum, etc.).
              </li>
            </ul>

            <GeographyImage
              fileName="pie-chart-example.png"
              alt="A pie chart showing Zimbabwe's main exports: gold, tobacco, platinum, and other minerals"
              caption="Pie chart showing Zimbabwe's main exports by value."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Dot Maps</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Maps that use dots to show the distribution
                of something. One dot represents a certain number (e.g., one dot = 1,000 people).
              </li>
              <li>
                <strong>Example:</strong> A dot map showing the distribution of the population
                in Zimbabwe. Dots are concentrated in Harare, Bulawayo, and other urban areas.
              </li>
            </ul>

            <GeographyImage
              fileName="dot-map-example.png"
              alt="A dot map of Zimbabwe showing population distribution with dots concentrated in urban areas"
              caption="Dot map showing population distribution in Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Shading Maps (Choropleth)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Maps that use different shades of colour to
                show the quantity of something in different areas.
              </li>
              <li>
                <strong>Example:</strong> A map showing average rainfall in Zimbabwe.
                Darker shades show areas with higher rainfall (Eastern Highlands).
              </li>
            </ul>

            <GeographyImage
              fileName="choropleth-map-example.png"
              alt="A choropleth map of Zimbabwe showing average annual rainfall with darker shades for higher rainfall areas"
              caption="Choropleth map showing average annual rainfall in Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Isoline Maps</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Maps that use lines to join points of equal value.
                Examples include contour lines (height), isobars (air pressure), and isotherms (temperature).
              </li>
              <li>
                <strong>Example:</strong> A contour map showing the relief of the Chimanimani
                area in the Eastern Highlands.
              </li>
            </ul>

            <GeographyImage
              fileName="isoline-map-example.png"
              alt="An isoline map showing contour lines of the Chimanimani area in Zimbabwe's Eastern Highlands"
              caption="Isoline map (contour map) showing relief of the Chimanimani area."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Graphs &amp; Maps</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Bar charts:</strong> compare categories</li>
            <li><strong>Line graphs:</strong> show change over time</li>
            <li><strong>Sketch maps:</strong> simple hand‑drawn maps</li>
            <li><strong>Diagrams:</strong> cross-sections, block diagrams</li>
            <li><strong>Thematic maps:</strong> proportional symbols, flow‑lines, pie, dot, shading, isolines</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'field-studies',
      title: 'Field Studies',
      content: (
        <div className="space-y-6">
          {/* Subtopic 1: Definition & Observation */}
          <SubtopicCard title="Definition and Observation">
            <p>
              <strong>Field studies</strong> are investigations that take place outside the
              classroom, in the real world. They involve observing, measuring, collecting,
              and recording data about the environment.
            </p>
            <p>
              Field studies are an important part of geography because they allow students
              and geographers to see and understand geographic processes and features in
              their natural setting.
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Observation</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Observation is the careful examination of the
                environment using your senses. It involves looking at, listening to, and
                sometimes smelling or touching features in the landscape.
              </li>
              <li>
                <strong>What to observe:</strong> Landforms (hills, valleys, rivers),
                vegetation (types of trees, grasses), land use (farming, urban areas,
                industrial areas), and human activities (people working, traffic).
              </li>
              <li>
                <strong>How to observe:</strong> Be systematic. Look from near to far,
                and from general to specific. Take notes and make sketches.
              </li>
            </ul>

            <GeographyImage
              fileName="field-observation-example.png"
              alt="A student observing and recording data in a field setting with a notebook and clipboard"
              caption="Field observation: student recording data in the field."
            />
          </SubtopicCard>

          {/* Subtopic 2: Field Sketching & Measurement */}
          <SubtopicCard title="Field Sketching and Measurement">
            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Field Sketching</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> A field sketch is a quick, hand‑drawn picture
                of the landscape. It helps to record what you see and to identify features.
              </li>
              <li>
                <strong>How to sketch:</strong>
                <ol className="list-decimal list-inside ml-4 mt-1 space-y-1">
                  <li>Find a good viewpoint.</li>
                  <li>Draw the outline of the main features (skyline, hills, buildings).</li>
                  <li>Add details (trees, roads, rivers).</li>
                  <li>Label important features.</li>
                  <li>Add a title, date, and location.</li>
                </ol>
              </li>
              <li className="mt-2">
                <strong>Example:</strong> A field sketch of the Great Zimbabwe ruins,
                showing the main structures and the surrounding landscape.
              </li>
            </ul>

            <GeographyImage
              fileName="field-sketch-example.png"
              alt="A hand-drawn field sketch of Great Zimbabwe showing the main structures and surrounding landscape with labels"
              caption="Field sketch of the Great Zimbabwe ruins."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Measurement</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Measurement is the process of collecting
                numerical data about the environment. This makes observations more precise
                and allows for analysis and comparison.
              </li>
              <li>
                <strong>Examples of measurements:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>River flow:</strong> Speed of water flow (m/s), width, and depth.
                  </li>
                  <li>
                    <strong>Weather:</strong> Temperature, rainfall, wind speed, and direction.
                  </li>
                  <li>
                    <strong>Population:</strong> Number of people, age structure, and
                    population density.
                  </li>
                  <li>
                    <strong>Traffic:</strong> Volume of traffic, types of vehicles, and
                    peak hours.
                  </li>
                </ul>
              </li>
            </ul>

            <GeographyImage
              fileName="field-measurement-example.png"
              alt="Students measuring river width and depth using a tape measure and meter ruler in a field setting"
              caption="Field measurement: students measuring river width and depth."
            />
          </SubtopicCard>

          {/* Subtopic 3: Data Collection */}
          <SubtopicCard title="Data Collection and Interpretation">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Definition:</strong> Data collection is the process of gathering
                information, and interpretation is making sense of that information.
              </li>
              <li>
                <strong>Methods of data collection:</strong>
                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                  <li>
                    <strong>Questionnaires:</strong> Surveys to gather information from people.
                  </li>
                  <li>
                    <strong>Interviews:</strong> Talking to people to get detailed information.
                  </li>
                  <li>
                    <strong>Sampling:</strong> Measuring a small part to represent the whole.
                  </li>
                  <li>
                    <strong>Direct observation:</strong> Recording what you see.
                  </li>
                </ul>
              </li>
              <li className="mt-2">
                <strong>Interpreting data:</strong> Analyse the data to find patterns,
                relationships, and trends. Present the data using graphs, tables, and maps.
              </li>
            </ul>

            <GeographyImage
              fileName="data-collection-fieldwork.png"
              alt="A student conducting a questionnaire interview with a local resident during fieldwork"
              caption="Data collection: student conducting a questionnaire survey during fieldwork."
            />
          </SubtopicCard>

          {/* Subtopic 4: Local Examples */}
          <SubtopicCard title="Using Local Examples in Field Studies">
            <p>
              Field studies should use local examples to make the learning relevant and
              meaningful. Here are some examples from Zimbabwe:
            </p>

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Landforms (Zimbabwe)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Example:</strong> Study the granite inselbergs (kopjes) in the
                Matopos Hills. Observe the rock formations, vegetation, and how people use
                the area.
              </li>
              <li>
                <strong>Process:</strong> Understand that these landforms are formed by
                weathering and erosion of granite rock.
              </li>
            </ul>

            <GeographyImage
              fileName="matopos-kopje-field-study.png"
              alt="The granite kopjes (inselbergs) of the Matopos Hills in Zimbabwe showing rock formations and vegetation"
              caption="Field study of granite kopjes (inselbergs) in the Matopos Hills, Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">River Flow (Zimbabwe)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Example:</strong> Study a local river, such as the Mazowe River.
                Measure the width, depth, and speed of flow at different points.
              </li>
              <li>
                <strong>Human-environment link:</strong> Observe how the river is used for
                irrigation, drinking water, and fishing. Look for signs of pollution or
                erosion.
              </li>
            </ul>

            <GeographyImage
              fileName="mazowe-river-field-study.png"
              alt="The Mazowe River in Zimbabwe showing river channel, vegetation, and human use for irrigation"
              caption="Field study of the Mazowe River, Zimbabwe: measuring river flow and observing human uses."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Land Use and Settlement</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Example:</strong> Study land use and settlement patterns in your local area.
                Map out different land uses (residential, commercial, industrial, agricultural).
              </li>
              <li>
                <strong>Human-environment link:</strong> Understand why certain land uses
                are located where they are (e.g., industries near roads, farms in rural areas).
              </li>
            </ul>

            <GeographyImage
              fileName="landuse-settlement-field-study.png"
              alt="A Zimbabwean rural landscape showing settlement patterns, agricultural land use, and transport routes"
              caption="Field study of land use and settlement patterns in a Zimbabwean rural area."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Urban Problems (Zimbabwe)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Example:</strong> Study problems in a local urban area, such as
                traffic congestion, waste disposal, or housing shortages.
              </li>
              <li>
                <strong>Management:</strong> Consider solutions to these problems, such as
                improved public transport, recycling programmes, or more housing.
              </li>
            </ul>

            <GeographyImage
              fileName="urban-problems-field-study.png"
              alt="An urban scene in Harare showing traffic congestion, waste disposal issues, and housing challenges"
              caption="Field study of urban problems in Harare, Zimbabwe: traffic, waste, and housing."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Traffic and Population</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Example:</strong> Count the number of vehicles passing a point
                at different times of the day. Record the types of vehicles.
              </li>
              <li>
                <strong>Population structure:</strong> Use census data to create a population
                pyramid for your local area or for Zimbabwe as a whole.
              </li>
            </ul>

            <GeographyImage
              fileName="traffic-population-field-study.png"
              alt="A busy road in Harare showing traffic volume and a population pyramid for Zimbabwe"
              caption="Field study of traffic patterns and population structure in Zimbabwe."
            />

            <h4 className="text-2xl font-semibold text-blue-700 mt-4">Industry (Zimbabwe)</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Example:</strong> Visit a local factory, such as a cigarette factory
                or a food processing plant. Observe the inputs, processes, and outputs.
              </li>
              <li>
                <strong>Human-environment link:</strong> Understand the effects of industry
                on the environment (pollution, waste) and on the local community (jobs, health).
              </li>
            </ul>

            <GeographyImage
              fileName="industry-field-study-zimbabwe.png"
              alt="An industrial area in Zimbabwe showing factory buildings, chimneys, and environmental impacts"
              caption="Field study of industry in Zimbabwe: inputs, processes, outputs, and environmental impacts."
            />
          </SubtopicCard>

          {/* Subtopic 5: Human-Environment Link */}
          <SubtopicCard title="Human-Environment Link: Causes, Effects, and Management">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Causes:</strong> Human activities such as farming, mining, urbanisation,
                and industrialisation affect the environment.
              </li>
              <li>
                <strong>Effects:</strong> These activities can lead to deforestation, soil
                erosion, pollution, loss of biodiversity, and climate change.
              </li>
              <li>
                <strong>Management:</strong> Sustainable development and conservation
                practices can reduce the negative effects. This includes reforestation,
                sustainable farming, pollution control, and environmental education.
              </li>
              <li className="mt-2">
                <strong>Example (Zimbabwe):</strong> The mining of platinum in the Great Dyke
                provides jobs and income but can also cause water pollution and soil erosion.
                Management includes treating wastewater and rehabilitating mined land.
              </li>
            </ul>

            <GeographyImage
              fileName="human-environment-management-zimbabwe.png"
              alt="A split image showing environmental degradation from mining and conservation efforts such as reforestation and pollution control in Zimbabwe"
              caption="Human-environment link: causes, effects, and management of environmental change in Zimbabwe."
            />
          </SubtopicCard>
        </div>
      ),
      aside: (
        <div className="rounded-[9px] border border-slate-200 bg-white p-5 shadow-sm sticky top-24">
          <h3 className="mb-3 text-xl font-bold text-blue-700">Field Studies</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><strong>Observation:</strong> careful looking and recording</li>
            <li><strong>Field sketching:</strong> drawing what you see</li>
            <li><strong>Measurement:</strong> collecting numerical data</li>
            <li><strong>Data collection:</strong> questionnaires, interviews, sampling</li>
            <li><strong>Local examples:</strong> landforms, rivers, settlements, traffic</li>
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
            Basic Techniques and Skills
          </h1>
          <p className="text-lg text-blue-100 max-w-2xl leading-relaxed">
            Learn the fundamental skills needed for geography: map reading, photograph
            interpretation, data presentation, and field study techniques. These skills
            are the foundation for all geographical investigation.
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
                  <strong className="text-white">Topocadastral Maps:</strong> Learn to read
                  symbols, give grid references, use scale, measure distance and gradient,
                  interpret contour patterns, and identify landforms and drainage patterns.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Photographs:</strong> Distinguish between
                  oblique and aerial photographs; identify landforms, vegetation, and land use;
                  explain processes shown in photographs.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Diagrams and Graphs:</strong> Construct and
                  interpret bar charts, line graphs, sketch maps, and diagrams; read thematic
                  maps including proportional symbols, flow‑line diagrams, and isoline maps.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Field Studies:</strong> Practice observation,
                  field sketching, measurement, and data collection; use local examples to
                  study landforms, rivers, settlements, urban problems, traffic, and population.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-300 font-bold">•</span>
                <span>
                  <strong className="text-white">Human-Environment Link:</strong> Understand
                  the causes and effects of human activities on the environment, and the
                  management and conservation measures that can be taken.
                </span>
              </li>
            </ul>
          </div>
        )}

        {/* Chapter Transition */}
        <div className="mt-10 text-center p-6 sm:p-8 rounded-[9px] bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-600 mb-3 font-medium">
            {isLastChapter ? 'You have completed the Basic Skills topic!' : `Section ${activeIndex + 1} of ${sections.length}`}
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

export default BasicTechniquesAndSkills;

/* ============================================================
   IMAGE PROMPTS
   ============================================================

   All images should be placed in: public/images/geography/
   Use a mix of 2D diagram style and realistic photographs.

   --- MAP-RELATED IMAGES (2D DIAGRAM STYLE) ---

   1. topocadastral-map-example.png
      A 2D diagram showing a section of a 1:50 000 topocadastral map of Zimbabwe.
      Include contour lines (brown), rivers (blue), roads (black/red), settlement areas (grey),
      grid lines, and a key. Show typical features like a hill, valley, and river.
      Style: clean 2D map style with clear labels.

   2. map-symbols-key.png
      A 2D chart showing common map symbols used on topocadastral maps.
      Include symbols for: main road, secondary road, footpath, railway, river (permanent and seasonal),
      lake, forest, cultivated land, built-up area, school, church, trig beacon, contour line.
      Label each symbol clearly.

   3. grid-references-explained.png
      A 2D diagram showing a grid square divided into 10 parts.
      Show how to find a 4-figure grid reference (e.g., 2345) and a 6-figure grid reference (e.g., 234456).
      Use arrows and labels to explain the easting and northing lines.
      Include an example point with clear labelling.

   4. map-scale-types.png
      A 2D diagram showing the three types of map scale side by side:
      - Statement scale: "1 cm represents 0.5 km"
      - Representative Fraction: "1:50 000"
      - Linear/Bar scale: a divided line showing kilometres
      Use a clean, educational style.

   5. measuring-distance-map.png
      A 2D map showing a route (a winding road) and a straight line between two points.
      Show a ruler measuring the straight line and a piece of string tracing the curved route.
      Add labels explaining both methods.

   6. gradient-calculation.png
      A 2D diagram showing contour lines with a vertical interval of 100 metres.
      Show the horizontal distance measurement and the formula: Gradient = Vertical Interval ÷ Horizontal Equivalent.
      Include an example calculation.

   7. grid-square-area-calculation.png
      A 2D map grid showing a lake (blue shape) covering full and partial grid squares.
      Highlight full squares in green and partial squares in yellow.
      Show the calculation: (full squares + partial squares) × area of one square.

   8. compass-directions.png
      A 2D compass rose showing the 8 main directions (N, NE, E, SE, S, SW, W, NW)
      and the 16-point compass with degree markings. Clean, educational style.

   9. bearings-backbearings.png
      A 2D map with two points (A and B). Show a protractor measuring the bearing from A to B.
      Show the formula: Backbearing = Bearing + 180° (if bearing < 180°).
      Include an example: Bearing 045° → Backbearing 225°.

   10. route-description-example.png
       A 2D map showing a highlighted route from point A to point B.
       Include grid references, compass directions, and landmarks (road, river, church, bridge).
       Label the route steps: "Travel south-east along main road for 2 km..."

   11. contour-patterns-landforms.png
       A 2D diagram showing contour patterns for different landforms:
       - Hill (concentric rings)
       - Valley (V-shape pointing uphill)
       - Ridge (V-shape pointing downhill)
       - Plateau (widely spaced contours at top, steep sides)
       - Depression (concentric rings with lower values in centre)
       Label each with the landform name and contour pattern.

   12. slope-types-concave-convex.png
       A 2D diagram showing four slope types with contour patterns:
       - Gentle slope (widely spaced contours)
       - Steep slope (closely spaced contours)
       - Convex slope (closely spaced at top, widely at bottom)
       - Concave slope (widely spaced at top, closely at bottom)
       Include side-view profile for each.

   13. landforms-contour-recognition.png
       A 2D diagram showing various landforms with their contour patterns:
       Ridge, Plateau, Conical hill, Valley, Gorge, Meander, Floodplain.
       Show both the map view (contours) and the side view (profile) for each.

   14. settlement-patterns-maps.png
       Three 2D maps showing:
       - Dispersed settlement (isolated buildings spread across the landscape)
       - Linear settlement (buildings along a road or river)
       - Nucleated settlement (buildings clustered in a central area)
       Include typical land use features (roads, rivers, fields).

   15. drainage-patterns-diagram.png
       A 2D diagram showing the four main drainage patterns:
       - Dendritic (tree-like)
       - Rectangular (right-angle bends)
       - Radial (flowing outwards from centre)
       - Trellised (parallel with right-angle joins)
       Label each pattern and explain the rock type/conditions where they form.

   16. topological-diagram.png
       A 2D diagram showing a map on the left and its corresponding topological diagram on the right.
       The topological diagram should simplify the connections, showing only the links between key points (like a tube map).

   17. cross-section-diagram-example.png
       A 2D cross-section diagram of a river valley showing:
       - River channel
       - Floodplain
       - Valley sides
       - Terraces (if applicable)
       Label all features clearly. Educational diagram style.

   18. bar-chart-example.png
       A 2D bar chart showing the population of Zimbabwe's provinces.
       Use realistic data. Bars should be in different colours.
       X-axis: provinces (Harare, Mashonaland East, Manicaland, etc.)
       Y-axis: population in millions.
       Title: "Population of Zimbabwe's Provinces (2022)"

   19. line-graph-example.png
       A 2D line graph showing average monthly rainfall in Harare.
       X-axis: months (Jan to Dec)
       Y-axis: rainfall in mm
       Plot the points and connect with a line.
       Title: "Average Monthly Rainfall in Harare"

   20. sketch-map-example.png
       A hand-drawn style sketch map of a school showing buildings, sports fields, and the main road.
       Include a north arrow, a key, and a title.
       Use a rough, hand-drawn appearance.

   21. proportional-symbol-map.png
       A 2D map of Zimbabwe showing cities with proportional circles.
       The circle size represents population.
       Cities: Harare (largest circle), Bulawayo, Mutare, Gweru, Kwekwe, Masvingo.
       Include a legend explaining circle sizes.

   22. flow-line-diagram-example.png
       A 2D flow-line diagram showing trade between Zimbabwe and its neighbours.
       Line thickness represents trade volume.
       Neighbours: South Africa (thickest line), Mozambique, Zambia, Botswana, Namibia.
       Include arrow directions.

   23. pie-chart-example.png
       A 2D pie chart showing Zimbabwe's main exports.
       Sectors: Gold (35%), Tobacco (25%), Platinum (20%), Nickel (10%), Other (10%).
       Use different colours for each sector. Label with percentages.

   24. dot-map-example.png
       A 2D dot map of Zimbabwe showing population distribution.
       One dot = 5,000 people.
       Show higher density in Harare, Bulawayo, and along the main transport corridors.
       Rural areas should have scattered dots.

   25. choropleth-map-example.png
       A 2D choropleth map of Zimbabwe showing average annual rainfall.
       Use a colour gradient from light (low rainfall) to dark (high rainfall).
       Darkest areas: Eastern Highlands (Chimanimani, Nyanga, Vumba).
       Lightest areas: Lowveld (south-east).

   26. isoline-map-example.png
       A 2D isoline map showing contour lines of the Chimanimani area in the Eastern Highlands.
       Show contour lines at 100m intervals (500m, 600m, 700m, 800m, 900m, 1000m).
       Include spot heights and a scale.

   27. synoptic-chart-example.png
       A 2D synoptic weather chart showing isobars, pressure systems, and fronts over Southern Africa.
       Show a high-pressure system, a low-pressure system, and a cold front moving from the Atlantic.
       Label: High (H), Low (L), cold front, warm front.

   --- PHOTOGRAPH-RELATED IMAGES (REALISTIC / PHOTOGRAPHIC STYLE) ---

   28. oblique-photograph-example.png
       A realistic oblique aerial photograph of a Zimbabwean landscape.
       Show hills, valleys, a river, and scattered settlements.
       Show depth and perspective typical of oblique photography.

   29. aerial-photograph-example.png
       A realistic vertical aerial photograph of an urban area (like Harare or Bulawayo).
       Show roads, buildings, and land use patterns from directly above.
       The image should look like a true vertical aerial photo.

   30. landforms-photograph-identification.png
       A realistic photograph (oblique) with labels showing how to identify:
       - Mountains/hills
       - Valleys
       - Rivers
       - Plateaus
       Use arrows and text boxes to label the features.

   31. vegetation-photograph-types.png
       A realistic photograph showing different vegetation types:
       - Dense forest (dark green)
       - Savannah/grassland (lighter green/brown with scattered trees)
       - Cultivated land (regular patterns of fields)
       - Woodland (medium green with rough texture)
       Label each vegetation type clearly.

   32. landuse-photograph-examples.png
       A realistic photograph (aerial or oblique) showing different land use types:
       - Urban area (buildings, roads, cars)
       - Rural area (scattered buildings, fields)
       - Industrial area (factories, chimneys)
       - Agricultural area (regular fields, crops)
       Label each area.

   33. geographic-processes-photographs.png
       A composite of four realistic photographs showing:
       - Erosion (a gully or river valley)
       - Deposition (a river delta or floodplain)
       - Urban growth (city expanding into farmland)
       - Deforestation (cleared area with a forest edge)
       Label each process.

   34. human-environment-photographs.png
       A split photograph showing environmental change over time:
       - Left side: deforestation or urban expansion
       - Right side: conservation efforts (reforestation, protected area)
       Add labels explaining the causes, effects, and management.

   35. field-observation-example.png
       A realistic photograph of a student observing and recording data in the field.
       Student has a notebook and clipboard, standing in a landscape.
       Show the student looking at the environment and writing.

   36. field-sketch-example.png
       A hand-drawn field sketch of the Great Zimbabwe ruins.
       Show the main structures (walls, towers) and the surrounding landscape (hills, vegetation).
       Include labels and a title.

   37. field-measurement-example.png
       A realistic photograph of students measuring river width and depth.
       Students are using a tape measure across the river and a meter ruler to measure depth.
       Show the equipment and the river clearly.

   38. data-collection-fieldwork.png
       A realistic photograph of a student conducting a questionnaire interview with a local resident.
       Show the student with a clipboard and pen, talking to an elderly person.
       Add a caption: "Conducting a questionnaire survey during fieldwork."

   39. matopos-kopje-field-study.png
       A realistic photograph of the granite kopjes (inselbergs) in the Matopos Hills.
       Show the large granite rock formations, scattered vegetation, and the landscape.
       This should be a landscape photograph showing the distinctive landforms.

   40. mazowe-river-field-study.png
       A realistic photograph of the Mazowe River in Zimbabwe.
       Show the river channel, vegetation on the banks, and people using the water for irrigation or fishing.
       Show the river's width and flow.

   41. landuse-settlement-field-study.png
       A realistic photograph of a Zimbabwean rural landscape.
       Show settlement patterns (scattered homesteads), agricultural land use (fields, crops), and transport routes (dirt road).
       Label the different land uses.

   42. urban-problems-field-study.png
       A realistic photograph of an urban area in Zimbabwe (Harare or Bulawayo).
       Show traffic congestion, waste disposal issues, or housing challenges.
       Label the problems visible in the photograph.

   43. traffic-population-field-study.png
       A composite image:
       - Left side: a realistic photograph of a busy road in Harare showing traffic volume
       - Right side: a population pyramid for Zimbabwe (2D diagram style)
       Label both parts.

   44. industry-field-study-zimbabwe.png
       A realistic photograph of an industrial area in Zimbabwe.
       Show factory buildings, chimneys, and possibly smoke.
       Include environmental impacts (waste, pollution) if visible.

   45. human-environment-management-zimbabwe.png
       A split image showing:
       - Left side: environmental degradation (e.g., mining area with polluted water)
       - Right side: conservation/management (e.g., reforestation, treated water, rehabilitation)
       Show the human-environment link and management efforts.

   ============================================================ */