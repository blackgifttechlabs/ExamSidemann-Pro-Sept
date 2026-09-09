import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ecdSounds } from "../../../lib/audio/ecdSounds";
import { EcdShell } from "../EcdShell";
import { EcdAdventureMap, type AdventureStop } from "../EcdAdventureMap";
import { MATHS_TOPICS, mathsTopicImage } from "./mathsTopics";

const stops: AdventureStop[] = MATHS_TOPICS.map(topic => ({
  id: topic.id,
  title: topic.title,
  blurb: topic.blurb,
  route: topic.route,
  image: topic.id === "addition" || topic.id === "subtraction"
    ? "/images/ecd/journey/maths-blocks.webp"
    : mathsTopicImage(topic),
}));

export const EcdMaths: React.FC = () => {
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
    <EcdAdventureMap title="Maths journey" subtitle="Count, explore and solve. A little adventure at every stop!" stops={stops} onOpen={open} />
  </EcdShell>;
};

export default EcdMaths;
