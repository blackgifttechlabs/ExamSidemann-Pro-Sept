import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { EcdAdventureMap, type AdventureStop } from "../EcdAdventureMap";
import { READING_TOPICS, readingTopicImage } from "./readingTopics";

const stops: AdventureStop[] = READING_TOPICS.map(topic => ({
  id: topic.id,
  title: topic.title,
  blurb: topic.blurb,
  route: topic.route,
  image: topic.id === "letters" ? "/images/ecd/journey/reading-letters-transparent.webp" : readingTopicImage(topic),
}));

export const EcdReading: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    ecdSounds.retainIntro();
    return () => ecdSounds.releaseIntro();
  }, []);
  const open = (stop: AdventureStop) => {
    if (!stop.route) return;
    ecdSounds.play("buttonClick");
    ecdSounds.play("swipe", 0.8);
    navigate(stop.route);
  };
  return <EcdShell backTo="/ecd/journey" showClouds={false}>
    <EcdAdventureMap title="Reading journey" subtitle="Letters, sounds and stories. Your next discovery awaits!" stops={stops} onOpen={open} />
  </EcdShell>;
};

export default EcdReading;
