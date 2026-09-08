import React from "react";

/** A short supplied character reaction with its original flat background removed. */
export const EcdReaction: React.FC<{
  show: boolean;
  kind: "try-again" | "happy" | "run";
  label?: string;
}> = ({ show, kind, label }) => {
  if (!show) return null;

  const source = {
    "try-again": "/images/ecd/reactions/monster-try-again.gif",
    happy: "/images/ecd/reactions/happy-dance.gif",
    run: "/images/ecd/reactions/monster-run.gif",
  }[kind];

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[58] flex items-center justify-center"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
    >
      <img
        key={`${kind}-${show}`}
        src={source}
        alt=""
        className="h-[min(46vw,250px)] w-[min(46vw,250px)] object-contain drop-shadow-[0_12px_14px_rgba(25,45,70,.3)]"
      />
    </div>
  );
};

export default EcdReaction;
