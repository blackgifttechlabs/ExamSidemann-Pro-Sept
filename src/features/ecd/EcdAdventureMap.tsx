import React, { useEffect, useState } from "react";
import { BookOpen, Lock, Play, Sparkles, Star } from "lucide-react";
import "./ecdAdventureMap.css";

export type AdventureStop = {
  id: string;
  title: string;
  blurb: string;
  image: string;
  route?: string;
};

type AdventureMapProps = {
  title: string;
  subtitle: string;
  stops: AdventureStop[];
  onOpen: (stop: AdventureStop) => void;
  variant?: "adventure" | "learning-path";
};

/** A responsive lesson map; English can opt into the simple downward trail. */
export const EcdAdventureMap = ({
  title,
  subtitle,
  stops,
  onOpen,
  variant = "adventure",
}: AdventureMapProps) => {
  const [desktop, setDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 1024px)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(media.matches);

    media.addEventListener("change", update);
    update();

    return () => media.removeEventListener("change", update);
  }, []);

  const learningPath = variant === "learning-path";
  const featured = stops.find((stop) => stop.route);

  /*
   * English desktop learning path
   *
   * Uses a wide 1200-unit coordinate system.
   *
   * First four lessons descend diagonally:
   *
   *        1
   *          2
   *            3
   *              4
   *
   * Then the path bends back left and travels across the bottom:
   *
   *      5 -- 6 -- 7 -- 8 -- 9 -- 10 -- 11
   */
  const learningDesktopPoints = [
    { x: 360, y: 82 },   // Meet the Letters
    { x: 455, y: 132 },  // Phonics & Letter Sounds
    { x: 550, y: 182 },  // Rhyming Words
    { x: 645, y: 232 },  // Sight Words

    { x: 405, y: 325 },  // CVC Words
    { x: 515, y: 342 },  // Opposites
    { x: 625, y: 350 },  // Story Sequencing
    { x: 735, y: 342 },  // Word Families
    { x: 845, y: 350 },  // Syllable Counting
    { x: 955, y: 342 },  // Sentence Building
    { x: 1065, y: 350 }, // Reading Quizzes
  ];

  const mobileLearningPoints = stops.map((_, i) => {
    const offsets = [210, 150, 210, 270];

    return {
      x: offsets[i % offsets.length],
      y: 66 + i * 142,
    };
  });

  const columns = desktop ? 6 : 3;
  const rowHeight = desktop ? 196 : 180;
  const rows = Math.ceil(stops.length / columns);

  const adventurePoints = stops.map((_, i) => {
    const row = Math.floor(i / columns);

    const column =
      row % 2
        ? columns - 1 - (i % columns)
        : i % columns;

    return {
      x: ((column + 0.5) * 420) / columns,
      y: (desktop ? 74 : 72) + row * rowHeight,
    };
  });

  const points = learningPath
    ? desktop
      ? stops.map(
          (_, i) =>
            learningDesktopPoints[i] ?? {
              x: 1065,
              y: 350 + (i - learningDesktopPoints.length + 1) * 90,
            }
        )
      : mobileLearningPoints
    : adventurePoints;

  const viewWidth =
    learningPath && desktop
      ? 1200
      : 420;

  const height =
    learningPath
      ? desktop
        ? 440
        : stops.length * 142
      : rows * rowHeight;

  const path = points.reduce((d, point, i) => {
    if (!i) {
      return `M ${point.x} ${point.y}`;
    }

    const previous = points[i - 1];

    /*
     * Wide English desktop map gets smooth horizontal curves.
     */
    if (learningPath && desktop) {
      const dx = point.x - previous.x;
      const control = Math.max(35, Math.abs(dx) * 0.42);

      if (dx >= 0) {
        return `${d} C ${
          previous.x + control
        } ${previous.y}, ${
          point.x - control
        } ${point.y}, ${point.x} ${point.y}`;
      }

      /*
       * Sight Words -> CVC Words is the big bend back to the left.
       */
      return `${d} C ${
        previous.x + 40
      } ${previous.y + 55}, ${
        point.x + 90
      } ${point.y - 65}, ${point.x} ${point.y}`;
    }

    if (point.y === previous.y) {
      return `${d} L ${point.x} ${point.y}`;
    }

    const bend =
      point.x > previous.x
        ? -42
        : 42;

    return `${d} C ${
      previous.x + bend
    } ${previous.y + 50}, ${
      point.x - bend
    } ${point.y - 50}, ${point.x} ${point.y}`;
  }, "");

  return (
    <main
      className={`ecd-adventure${
        learningPath ? " ecd-learning-path" : ""
      }`}
    >
      <div className="ecd-adventure-inner">
        <div className="ecd-adventure-heading">
          <span>
            <Sparkles size={16} /> A LITTLE PLAY. A BIG ADVENTURE.
          </span>

          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>

        {featured && !learningPath && (
          <section
            className="ecd-adventure-feature"
            aria-label="Featured adventure"
          >
            <div className="ecd-adventure-feature-copy">
              <span className="ecd-adventure-eyebrow">
                LET'S EXPLORE
              </span>

              <h2>{featured.title}</h2>
              <p>{featured.blurb}</p>

              <button
                type="button"
                onClick={() => onOpen(featured)}
              >
                <span>
                  <Play size={15} fill="currentColor" />
                </span>
                Let's go!
              </button>
            </div>

            <div
              className="ecd-adventure-feature-art"
              aria-hidden="true"
            >
              <Star
                className="ecd-feature-star"
                fill="currentColor"
              />

              <img src={featured.image} alt="" />

              <Sparkles className="ecd-feature-sparkles" />
            </div>
          </section>
        )}

        <section
          aria-labelledby="adventure-map-title"
          className="ecd-adventure-map-section"
        >
          <div className="ecd-adventure-map-heading">
            <div>
              <h2 id="adventure-map-title">
                {learningPath
                  ? "English lessons"
                  : "Adventure Map"}
              </h2>

              <p>
                {learningPath
                  ? "Choose a lesson to start learning"
                  : `${
                      stops.filter((stop) => stop.route).length
                    } adventures ready to explore`}
              </p>
            </div>

            <span>
              {learningPath ? (
                <BookOpen size={15} />
              ) : (
                <Star size={15} fill="currentColor" />
              )}

              {learningPath ? "English" : "Pick a stop"}
            </span>
          </div>

          {learningPath ? (
            <div className="ecd-lesson-grid">
              {stops.map((stop, i) => (
                <button
                  key={stop.id}
                  type="button"
                  disabled={!stop.route}
                  onClick={() => onOpen(stop)}
                  className={`ecd-lesson-card${
                    stop.route ? " ecd-lesson-card-active" : " ecd-lesson-card-locked"
                  }`}
                  aria-label={`${stop.title}${stop.route ? "" : ", coming soon"}`}
                >
                  <span className="ecd-lesson-card-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <span className="ecd-lesson-card-image">
                    <img
                      src={stop.image}
                      alt=""
                      loading="lazy"
                    />
                  </span>

                  <span className="ecd-lesson-card-content">
                    <strong>{stop.title}</strong>

                    <span className="ecd-lesson-card-status">
                      {stop.route ? (
                        <>
                          <span className="ecd-lesson-card-status-icon">
                            <Play size={11} fill="currentColor" />
                          </span>
                          Start lesson
                        </>
                      ) : (
                        <>
                          <span className="ecd-lesson-card-status-icon">
                            <Lock size={11} />
                          </span>
                          Coming soon
                        </>
                      )}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div
              className="ecd-adventure-path"
              style={{ height }}
            >
              <svg
                viewBox={`0 0 ${viewWidth} ${height}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d={path}
                  fill="none"
                  stroke="#171717"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="1 13"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {stops.map((stop, i) => (
                <button
                  key={stop.id}
                  type="button"
                  disabled={!stop.route}
                  onClick={() => onOpen(stop)}
                  className={`ecd-adventure-stop ecd-stop-${i % 5}`}
                  style={{
                    left: `${(points[i].x / viewWidth) * 100}%`,
                    top: points[i].y,
                  }}
                  aria-label={`${stop.title}${stop.route ? "" : ", coming soon"}`}
                >
                  <span className="ecd-adventure-orb">
                    <img
                      src={stop.image}
                      alt=""
                      loading="lazy"
                    />

                    <span className="ecd-adventure-stop-badge">
                      {stop.route ? (
                        <Play size={12} fill="currentColor" />
                      ) : (
                        <Lock size={12} />
                      )}
                    </span>
                  </span>

                  <span className="ecd-adventure-stop-title">
                    {stop.title}
                  </span>

                  {!stop.route && (
                    <span className="ecd-adventure-soon">
                      Coming soon
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
