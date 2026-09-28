import React, { useEffect, useState } from "react";
import { BookOpen, Lock, Play, Sparkles, Star } from "lucide-react";
import "./ecdAdventureMap.css";

export type AdventureStop = { id: string; title: string; blurb: string; image: string; route?: string; };
type AdventureMapProps = { title: string; subtitle: string; stops: AdventureStop[]; onOpen: (stop: AdventureStop) => void; variant?: "adventure" | "learning-path"; };

/** A responsive lesson map; English can opt into the simple downward trail. */
export const EcdAdventureMap = ({ title, subtitle, stops, onOpen, variant = "adventure" }: AdventureMapProps) => {
  const [desktop, setDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(media.matches);
    media.addEventListener("change", update);
    update();
    return () => media.removeEventListener("change", update);
  }, []);
  const learningPath = variant === "learning-path";
  const featured = stops.find((stop) => stop.route);
  const columns = learningPath ? 1 : desktop ? 6 : 3;
  const rowHeight = learningPath ? 142 : desktop ? 196 : 180;
  const rows = Math.ceil(stops.length / columns);
  const height = learningPath ? stops.length * rowHeight : rows * rowHeight;
  const points = stops.map((_, i) => {
    if (learningPath) {
      const offsets = [210, 150, 210, 270];
      return { x: offsets[i % offsets.length], y: 66 + i * rowHeight };
    }
    const row = Math.floor(i / columns);
    const column = row % 2 ? columns - 1 - (i % columns) : i % columns;
    return { x: ((column + 0.5) * 420) / columns, y: (desktop ? 74 : 72) + row * rowHeight };
  });
  const path = points.reduce((d, point, i) => {
    if (!i) return `M ${point.x} ${point.y}`;
    const previous = points[i - 1];
    if (point.y === previous.y) return `${d} L ${point.x} ${point.y}`;
    const bend = point.x > previous.x ? -42 : 42;
    return `${d} C ${previous.x + bend} ${previous.y + 50}, ${point.x - bend} ${point.y - 50}, ${point.x} ${point.y}`;
  }, "");
  return <main className={`ecd-adventure${learningPath ? " ecd-learning-path" : ""}`}>
    <div className="ecd-adventure-inner">
      <div className="ecd-adventure-heading"><span><Sparkles size={16}/> A LITTLE PLAY. A BIG ADVENTURE.</span><h1>{title}</h1><p>{subtitle}</p></div>
      {featured && !learningPath && <section className="ecd-adventure-feature" aria-label="Featured adventure">
        <div className="ecd-adventure-feature-copy"><span className="ecd-adventure-eyebrow">LET'S EXPLORE</span><h2>{featured.title}</h2><p>{featured.blurb}</p><button type="button" onClick={() => onOpen(featured)}><span><Play size={15} fill="currentColor"/></span>Let's go!</button></div>
        <div className="ecd-adventure-feature-art" aria-hidden="true"><Star className="ecd-feature-star" fill="currentColor"/><img src={featured.image} alt=""/><Sparkles className="ecd-feature-sparkles"/></div>
      </section>}
      <section aria-labelledby="adventure-map-title" className="ecd-adventure-map-section">
        <div className="ecd-adventure-map-heading"><div><h2 id="adventure-map-title">{learningPath ? "Your learning path" : "Adventure Map"}</h2><p>{learningPath ? "Start at the top and follow the path down" : `${stops.filter((stop) => stop.route).length} adventures ready to explore`}</p></div><span>{learningPath ? <BookOpen size={15}/> : <Star size={15} fill="currentColor"/>} {learningPath ? "English" : "Pick a stop"}</span></div>
        <div className="ecd-adventure-path" style={{ height }}>
          <svg viewBox={`0 0 420 ${height}`} preserveAspectRatio="none" aria-hidden="true"><path d={path} fill="none" stroke="#171717" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 13" vectorEffect="non-scaling-stroke"/></svg>
          {stops.map((stop, i) => <button key={stop.id} type="button" disabled={!stop.route} onClick={() => onOpen(stop)} className={`ecd-adventure-stop ecd-stop-${i % 5}${i === 0 && learningPath ? " ecd-path-start" : ""}`} style={{ left: `${(points[i].x / 420) * 100}%`, top: points[i].y }} aria-label={`${stop.title}${stop.route ? "" : ", coming soon"}`}>
            {i === 0 && learningPath && <span className="ecd-start-label">START</span>}
            <span className="ecd-adventure-orb"><img src={stop.image} alt="" loading="lazy"/><span className="ecd-adventure-stop-badge">{stop.route ? <Play size={12} fill="currentColor"/> : <Lock size={12}/>}</span></span>
            <span className="ecd-adventure-stop-title">{stop.title}</span>{!stop.route && <span className="ecd-adventure-soon">Coming soon</span>}
          </button>)}
        </div>
      </section>
    </div>
  </main>;
};
