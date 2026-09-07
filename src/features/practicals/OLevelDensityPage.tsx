import React from 'react';
import { useNavigate } from 'react-router-dom';
import { practicalBack } from './common/usePracticalBack';
import DensityLabSim from './o-level/physics-experiments/Density';
import { ExperimentGameHeader } from './common/ExperimentGameChrome';
import { ExperimentSceneGate } from './common/ExperimentSceneLoader';

export const OLevelDensityPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPaper, setShowPaper] = React.useState(false);
  const [tutorialRequestKey, setTutorialRequestKey] = React.useState(0);
  const [tutorialMode, setTutorialMode] = React.useState<'tour' | 'howto'>('tour');
  const requestHowTo = () => {
    setShowPaper(false);
    setTutorialMode('howto');
    setTutorialRequestKey((key) => key + 1);
  };

  return (
    <div className="w-full h-screen h-[100dvh] flex flex-col bg-[#0a0a0a] text-white overflow-hidden">
      <ExperimentGameHeader
        title="Density"
        subtitle="O Level Physics practical"
        symbol="⚖️"
        backLabel="Back to O Level Physics"
        onBack={() => practicalBack(navigate, '/practicals/olevel/physics')}
        onRequestHowTo={requestHowTo}
        onRequestPaper={() => setShowPaper(true)}
      />

      <div className="w-full flex-1 min-h-0">
        <ExperimentSceneGate label="Calibrating mass and water level">
          <DensityLabSim
            showPaper={showPaper}
            onClosePaper={() => setShowPaper(false)}
            tutorialRequestKey={tutorialRequestKey}
            tutorialMode={tutorialMode}
            onBack={() => practicalBack(navigate, '/practicals/olevel/physics')}
            onRequestHowTo={requestHowTo}
            onRequestPaper={() => setShowPaper(true)}
          />
        </ExperimentSceneGate>
      </div>
    </div>
  );
};
