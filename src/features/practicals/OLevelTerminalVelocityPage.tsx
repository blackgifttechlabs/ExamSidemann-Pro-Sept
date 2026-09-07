import React from "react";
import { useNavigate } from "react-router-dom";
import { practicalBack } from './common/usePracticalBack';
import TerminalVelocitySim from "./o-level/physics-experiments/TerminalVelocity";
import { ExperimentGameHeader } from "./common/ExperimentGameChrome";
import { ExperimentSceneGate } from "./common/ExperimentSceneLoader";

export const OLevelTerminalVelocityPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPaper, setShowPaper] = React.useState(false);
  const [tutorialRequestKey, setTutorialRequestKey] = React.useState(0);
  const [tutorialMode, setTutorialMode] = React.useState<"tour" | "howto">("tour");
  const requestHowTo = () => {
    setShowPaper(false);
    setTutorialMode("howto");
    setTutorialRequestKey((key) => key + 1);
  };

  return (
    <div className="flex h-screen h-[100dvh] w-full flex-col overflow-hidden bg-[#0a0a0a] text-white">
      <ExperimentGameHeader
        title="Terminal Velocity & Motion in Fluids"
        subtitle="O Level Physics practical"
        symbol="💧"
        backLabel="Back to O Level Physics"
        onBack={() => practicalBack(navigate, "/practicals/olevel/physics")}
        onRequestHowTo={requestHowTo}
        onRequestPaper={() => setShowPaper(true)}
      />

      <div className="min-h-0 w-full flex-1">
        <ExperimentSceneGate label="Priming the falling-sphere timer">
          <TerminalVelocitySim
            showPaper={showPaper}
            onClosePaper={() => setShowPaper(false)}
            tutorialRequestKey={tutorialRequestKey}
            tutorialMode={tutorialMode}
            onBack={() => practicalBack(navigate, "/practicals/olevel/physics")}
            onRequestHowTo={requestHowTo}
            onRequestPaper={() => setShowPaper(true)}
          />
        </ExperimentSceneGate>
      </div>
    </div>
  );
};
