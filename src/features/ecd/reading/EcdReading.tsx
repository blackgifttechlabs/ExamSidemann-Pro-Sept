import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Play } from "lucide-react";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { READING_TOPICS, readingTopicImage, type ReadingTopic } from "./readingTopics";

/**
 * The reading journey's topic map.
 *
 * Every topic on the path is on screen; the ones that are not built yet are
 * drawn locked rather than hidden, so a child can see where the road goes.
 */

const headingFont = {
  fontFamily: '"Nunito", "Plus Jakarta Sans", sans-serif',
  fontWeight: 800,
} as const;

export const EcdReading: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    ecdSounds.retainIntro();
    return () => ecdSounds.releaseIntro();
  }, []);

  const open = (topic: ReadingTopic) => {
    if (!topic.route) return;
    ecdSounds.play("buttonClick");
    ecdSounds.play("swipe", 0.8);
    navigate(topic.route);
  };

  return (
    <EcdShell backTo="/ecd/journey">
      <div className="relative z-10 flex w-full flex-1 flex-col items-center px-4 pb-24 pt-[72px] sm:pt-[84px]">
        <h1
          className="px-12 text-center text-[30px] leading-[1.1] text-white drop-shadow-[0_3px_0_rgba(6,102,124,0.45)] sm:px-16 sm:text-[44px]"
          style={headingFont}
        >
          Reading journey
        </h1>
        <p
          className="mt-2 text-center text-[15px] text-white/90 drop-shadow-[0_2px_0_rgba(6,102,124,0.35)] sm:text-[18px]"
          style={headingFont}
        >
          Letters, sounds and rhymes are open. The rest arrives soon.
        </p>

        {/* Two square cards to a row on a phone, so each picture stays big
            enough for a four-year-old to recognise at a glance. */}
        <div className="mt-7 grid w-full max-w-[1120px] grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
          {READING_TOPICS.map((topic) => {
            const locked = !topic.route;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => open(topic)}
                disabled={locked}
                aria-disabled={locked}
                title={locked ? "Coming soon" : undefined}
                style={{ aspectRatio: "1 / 1" }}
                className={`group relative flex w-full flex-col overflow-hidden rounded-[10px] bg-white text-center ring-4 transition-all ${topic.ring} ${
                  locked
                    ? "cursor-not-allowed opacity-60 grayscale"
                    : "shadow-[0_7px_0_rgba(6,102,124,0.28)] hover:-translate-y-1 active:translate-y-[3px] active:shadow-[0_3px_0_rgba(6,102,124,0.28)]"
                }`}
              >
                <span className="relative block w-full flex-1 overflow-hidden bg-white">
                  <img
                    src={readingTopicImage(topic)}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain p-1.5 sm:p-2"
                  />

                  {locked ? (
                    <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-[#26313b]/75 px-2 py-1 text-white">
                      <Lock size={13} />
                      <span className="text-[10px] uppercase tracking-[0.1em]" style={headingFont}>
                        Soon
                      </span>
                    </span>
                  ) : (
                    <span className="absolute bottom-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#2f2fbe] text-white shadow-[0_4px_0_#21218f] transition-transform group-hover:scale-110 sm:h-12 sm:w-12">
                      <Play size={20} fill="currentColor" />
                    </span>
                  )}
                </span>

                <span
                  className={`flex shrink-0 items-center justify-center px-2 py-2.5 text-center text-[15px] leading-tight text-[#26313b] sm:px-3 sm:py-3 sm:text-[19px] ${topic.tint}`}
                  style={headingFont}
                >
                  {topic.title}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            ecdSounds.play("buttonClick");
            navigate("/ecd/journey");
          }}
          className="ecd-btn mt-8 h-[48px] w-full max-w-[186px] rounded-[10px] text-[16px] uppercase tracking-[0.01em] transition-all duration-100 sm:h-[52px] sm:text-[18px]"
          style={headingFont}
        >
          Back
        </button>
      </div>
    </EcdShell>
  );
};

export default EcdReading;
