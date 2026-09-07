import React from "react";
import { useNavigate } from "react-router-dom";
import { practicalBack } from '../../common/usePracticalBack';
import { ExperimentGameHeader } from "../../common/ExperimentGameChrome";
import { ExperimentSceneGate } from "../../common/ExperimentSceneLoader";
import PaperChromatographySim from "./PaperChromatography";
import AcidAlkaliTitrationSim from "./AcidAlkaliTitration";
import QualitativeAnalysisSim from "./QualitativeAnalysis";

const CHEMISTRY_LANDING_ROUTE = "/practicals/olevel/chemistry";

interface ChemistrySimulationProps {
  showPaper: boolean;
  onClosePaper: () => void;
  tutorialRequestKey?: number;
  tutorialMode?: "tour" | "howto";
  onRequestPaper?: () => void;
  onRequestHowTo?: () => void;
  onBack?: () => void;
}

interface ChemistryScenePageProps {
  title: string;
  subtitle: string;
  symbol: React.ReactNode;
  loaderLabel: string;
  Simulation: React.ComponentType<ChemistrySimulationProps>;
  /** Sims that draw their own in-scene HUD do not need the page-level header. */
  immersiveHeader?: boolean;
}

const ChemistryScenePage: React.FC<ChemistryScenePageProps> = ({
  title,
  subtitle,
  symbol,
  loaderLabel,
  Simulation,
  immersiveHeader = false,
}) => {
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
      {!immersiveHeader && (
        <ExperimentGameHeader
          title={title}
          subtitle={subtitle}
          symbol={symbol}
          backLabel="Back to O Level Chemistry"
          onBack={() => practicalBack(navigate, CHEMISTRY_LANDING_ROUTE)}
          onRequestHowTo={requestHowTo}
          onRequestPaper={() => setShowPaper(true)}
        />
      )}

      <div className="min-h-0 w-full flex-1">
        <ExperimentSceneGate label={loaderLabel}>
          <Simulation
            showPaper={showPaper}
            onClosePaper={() => setShowPaper(false)}
            tutorialRequestKey={tutorialRequestKey}
            tutorialMode={tutorialMode}
            onBack={() => practicalBack(navigate, CHEMISTRY_LANDING_ROUTE)}
            onRequestHowTo={requestHowTo}
            onRequestPaper={() => setShowPaper(true)}
          />
        </ExperimentSceneGate>
      </div>
    </div>
  );
};

export const OLevelChromatographyPage: React.FC = () => (
  <ChemistryScenePage
    title="Paper Chromatography"
    subtitle="Separating a mixture of dyes and inks"
    symbol="🧫"
    loaderLabel="Ruling the pencil base line and spotting the samples"
    Simulation={PaperChromatographySim}
    immersiveHeader
  />
);

export const OLevelChemistryTitrationPage: React.FC = () => (
  <ChemistryScenePage
    title="Acid–Alkali Titration"
    subtitle="Burette, pipette and concordant titres"
    symbol="⚗️"
    loaderLabel="Rinsing the burette and filling the jet"
    Simulation={AcidAlkaliTitrationSim}
    immersiveHeader
  />
);

export const OLevelQualitativeAnalysisPage: React.FC = () => (
  <ChemistryScenePage
    title="Qualitative Analysis"
    subtitle="Tests for cations and anions"
    symbol="🧪"
    loaderLabel="Setting out the test tubes and reagents"
    Simulation={QualitativeAnalysisSim}
    immersiveHeader
  />
);
